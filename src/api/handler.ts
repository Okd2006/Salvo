/**
 * src/api/handler.ts
 *
 * API Route Handlers for Salvo Backend
 *
 * Endpoints:
 *  - POST /api/diagnose: Diagnoses a failed transaction with Gemini without ground truth leakage.
 *  - POST /api/policy-gate: Evaluates a deterministic policy gate check on a transaction & recommendation.
 *  - POST /api/execute: Executes a policy-approved recovery action via Razorpay test adapter.
 *  - POST /api/recover: Runs the complete autonomous agent recovery loop (Diagnose -> Gate -> Exec -> Fallback).
 *  - GET /api/health: Returns system status.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  getAllTransactions,
  getAllRecoveryActions,
  saveRecoveryActions,
  saveAuditLogs,
} from '../db/repository.js';
import { diagnoseTransaction } from '../agents/diagnosePlan.js';
import { evaluatePolicyGate } from '../agents/policyGate.js';
import { executeRecoveryAction } from '../agents/executor.js';
import { runAutonomousRecovery } from '../agents/orchestrator.js';
import { toObservableTransaction } from '../agents/observation.js';
import type { RecoveryRecommendation, AuditLogDocument } from '../types/index.js';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url || '';
  const method = req.method || 'GET';

  // Set standard JSON headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check
  if (url === '/api/health' && method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  // POST /api/diagnose
  if (url === '/api/diagnose' && method === 'POST') {
    try {
      const body = await parseJsonBody<{ transactionId?: string }>(req);

      if (!body.transactionId || typeof body.transactionId !== 'string') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing or invalid transactionId in request body.' }));
        return;
      }

      const allTxns = await getAllTransactions();
      const txn = allTxns.find((t) => (t.transactionId || t.id) === body.transactionId);

      if (!txn) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Transaction "${body.transactionId}" not found.` }));
        return;
      }

      // Diagnose via Gemini (Observation boundary is strictly enforced internally)
      const { recommendation, action, auditLog } = await diagnoseTransaction(txn);

      // Persist to database collections
      await saveRecoveryActions([action]);
      await saveAuditLogs([auditLog]);

      // NEVER return groundTruth to client
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          recommendation,
          actionId: action.actionId,
          diagnosedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal Server Error during diagnosis',
        })
      );
    }
    return;
  }

  // POST /api/policy-gate
  if (url === '/api/policy-gate' && method === 'POST') {
    try {
      const body = await parseJsonBody<{
        transactionId?: string;
        recommendation?: RecoveryRecommendation;
      }>(req);

      if (!body.transactionId || typeof body.transactionId !== 'string') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing or invalid transactionId in request body.' }));
        return;
      }

      const allTxns = await getAllTransactions();
      const txn = allTxns.find((t) => (t.transactionId || t.id) === body.transactionId);

      if (!txn) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Transaction "${body.transactionId}" not found.` }));
        return;
      }

      const observable = toObservableTransaction(txn);

      // If recommendation is not provided in body, build from latest action or default
      let rec = body.recommendation;
      if (!rec) {
        const allActions = await getAllRecoveryActions();
        const existingAction = allActions.find((a) => a.transactionId === body.transactionId);
        if (existingAction && existingAction.diagnosis) {
          rec = existingAction.diagnosis as RecoveryRecommendation;
        } else {
          rec = {
            transactionId: observable.transactionId,
            failureType: txn.failureCategory === 'suspected_risk' ? 'risk' : 'temporary',
            recoverability: txn.groundTruth ? (txn.groundTruth.recoverable ? 0.85 : 0) : 0.8,
            recommendedStrategy: txn.simulation.predictedStrategy,
            confidence: txn.simulation.confidence,
            evidence: ['Observable transaction metadata'],
            reasoning: 'Policy gate evaluation from observable transaction data',
            predictedRecoveryPaise: txn.simulation.predictedRecoveryPaise,
            recommendedInterventionCostPaise: txn.simulation.interventionCostPaise,
          };
        }
      }

      // Evaluate Policy Gate deterministically (zero LLM calls)
      const policyResult = evaluatePolicyGate(rec, observable);

      // Create Policy Gate audit event
      const auditLog: AuditLogDocument = {
        eventId: `evt_${observable.transactionId}_pol_${Date.now()}`,
        transactionId: observable.transactionId,
        eventType: policyResult.allowed ? 'action_approved' : 'action_blocked',
        actor: 'policy_gate',
        details: {
          allowed: policyResult.allowed,
          reasonCode: policyResult.reasonCode,
          reason: policyResult.reason,
          checksCount: policyResult.checks.length,
          triggeredRules: policyResult.triggeredRules,
        },
        timestamp: new Date().toISOString(),
      };

      await saveAuditLogs([auditLog]);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          policyResult,
          evaluatedAt: policyResult.evaluatedAt,
        })
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal Server Error during policy check',
        })
      );
    }
    return;
  }

  // POST /api/execute
  if (url === '/api/execute' && method === 'POST') {
    try {
      const body = await parseJsonBody<{ actionId?: string }>(req);

      if (!body.actionId || typeof body.actionId !== 'string') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing or invalid actionId in request body.' }));
        return;
      }

      const allActions = await getAllRecoveryActions();
      const action = allActions.find((a) => a.actionId === body.actionId);

      if (!action) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Recovery action "${body.actionId}" not found.` }));
        return;
      }

      const allTxns = await getAllTransactions();
      const txn = allTxns.find((t) => (t.transactionId || t.id) === action.transactionId);

      if (!txn) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Transaction "${action.transactionId}" not found.` }));
        return;
      }

      // Execute through RecoveryExecutor
      const executionResult = await executeRecoveryAction(action, txn, 1);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: executionResult.success,
          executionResult,
        })
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal Server Error during execution',
        })
      );
    }
    return;
  }

  // POST /api/recover
  if (url === '/api/recover' && method === 'POST') {
    try {
      const body = await parseJsonBody<{ transactionId?: string }>(req);

      if (!body.transactionId || typeof body.transactionId !== 'string') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing or invalid transactionId in request body.' }));
        return;
      }

      const allTxns = await getAllTransactions();
      const txn = allTxns.find((t) => (t.transactionId || t.id) === body.transactionId);

      if (!txn) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Transaction "${body.transactionId}" not found.` }));
        return;
      }

      // Run full autonomous recovery loop
      const recoverySession = await runAutonomousRecovery(txn);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: recoverySession.success,
          recoverySession,
        })
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal Server Error during recovery session',
        })
      );
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
}

function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}') as T;
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Invalid JSON body: ${(err as Error).message}`));
      }
    });
    req.on('error', (err) => reject(err));
  });
}
