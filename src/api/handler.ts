/**
 * src/api/handler.ts
 *
 * API Route Handlers for Salvo Backend
 *
 * Endpoints:
 *  - POST /api/diagnose: Diagnoses a failed transaction with Gemini without ground truth leakage.
 *  - GET /api/health: Returns system status.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { getAllTransactions, saveRecoveryActions, saveAuditLogs } from '../db/repository.js';
import { diagnoseTransaction } from '../agents/diagnosePlan.js';

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
