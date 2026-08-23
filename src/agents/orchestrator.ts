/**
 * src/agents/orchestrator.ts
 *
 * Salvo Autonomous Revenue Recovery Orchestrator
 *
 * Orchestrates the complete agent pipeline:
 *  ObservableTransaction
 *     ↓
 *  Gemini Diagnose & Plan (Agent 1)
 *     ↓
 *  RecoveryRecommendation
 *     ↓
 *  Deterministic Policy Gate (Agent 2)
 *     ↓
 *  [APPROVED / BLOCKED]
 *     ↓
 *  Razorpay Test Execution (Agent 3)
 *     ↓
 *  [SUCCESS / FAILURE]
 *     ↓ (if failure)
 *  Deterministic Fallback Selection (Agent 4)
 *     ↓
 *  Policy Gate (Evaluated on every fallback)
 *     ↓
 *  Execution Attempt 2 / 3 ...
 *     ↓
 *  Recovery Completed / Session Finalized
 */

import { randomUUID } from 'node:crypto';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  RecoveryRecommendation,
  PolicyResult,
  ExecutionResult,
  RecoverySessionResult,
  AuditLogDocument,
} from '../types/index.js';
import { toObservableTransaction } from './observation.js';
import { diagnoseTransaction } from './diagnosePlan.js';
import { evaluatePolicyGate } from './policyGate.js';
import { executeRecoveryAction } from './executor.js';
import { selectFallbackStrategy, buildFallbackRecommendation } from './fallback.js';
import { RAZORPAY_CONFIG } from '../lib/razorpay.js';
import { saveRecoveryActions, saveAuditLogs } from '../db/repository.js';
import { RecoverySessionResultSchema } from '../lib/schemas.js';

export async function runAutonomousRecovery(
  txn: TransactionDocument,
  maxAttempts: number = RAZORPAY_CONFIG.maxRecoveryAttempts
): Promise<RecoverySessionResult> {
  const observable = toObservableTransaction(txn);
  const actions: ExecutionResult[] = [];
  const policyDecisions: PolicyResult[] = [];

  // Step 1: Initialize Diagnosis
  let currentRec: RecoveryRecommendation;
  let currentAction: RecoveryActionDocument;

  try {
    const diag = await diagnoseTransaction(txn);
    currentRec = diag.recommendation;
    currentAction = diag.action;
    await saveRecoveryActions([diag.action]);
    await saveAuditLogs([diag.auditLog]);
  } catch {
    // If Gemini key is missing in offline test mode, construct deterministic recommendation
    const isRisk = txn.failureCategory === 'suspected_risk';
    const isUnrec = txn.failureCategory === 'unrecoverable';
    const recoverability = isRisk || isUnrec ? 0 : 0.85;
    const strategy = isRisk || isUnrec ? 'no_action' : 'smart_retry';

    currentRec = {
      transactionId: observable.transactionId,
      failureType: isRisk ? 'risk' : isUnrec ? 'unrecoverable' : 'temporary',
      recoverability,
      recommendedStrategy: strategy,
      confidence: 0.90,
      evidence: [`Observable failure code: ${observable.failureCode}`],
      reasoning: 'Autonomous recovery offline diagnostic initialization',
      predictedRecoveryPaise: Math.round(observable.amountPaise * recoverability),
      recommendedInterventionCostPaise: strategy === 'no_action' ? 0 : 150,
    };

    const actionId = `act_${observable.transactionId}_${Date.now()}`;
    currentAction = {
      actionId,
      transactionId: observable.transactionId,
      strategy: currentRec.recommendedStrategy,
      predictedRecoveryPaise: currentRec.predictedRecoveryPaise,
      actualRecoveryPaise: 0,
      interventionCostPaise: currentRec.recommendedInterventionCostPaise,
      confidence: currentRec.confidence,
      policyStatus: 'pending',
      executionStatus: 'not_executed',
      evidence: currentRec.evidence,
      reasoning: currentRec.reasoning,
      diagnosis: currentRec,
      createdAt: new Date().toISOString(),
      executedAt: null,
    };
    await saveRecoveryActions([currentAction]);
  }

  let finalStatus: RecoverySessionResult['finalStatus'] = 'failed';
  let totalRecoveredPaise = 0;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    // Step 2: Deterministic Policy Gate Check
    const policyResult = evaluatePolicyGate(currentRec, observable);
    policyDecisions.push(policyResult);

    if (!policyResult.allowed) {
      // Policy Gate BLOCKED action
      currentAction.policyStatus = 'blocked';
      currentAction.policyResult = policyResult;
      await saveRecoveryActions([currentAction]);

      finalStatus = 'blocked';
      break;
    }

    // Policy Gate APPROVED action
    currentAction.policyStatus = 'approved';
    currentAction.policyResult = policyResult;
    await saveRecoveryActions([currentAction]);

    // Step 3: Execute Action
    const execResult = await executeRecoveryAction(currentAction, txn, attempt);
    actions.push(execResult);

    if (execResult.success && execResult.recoveredAmountPaise > 0) {
      // Execution SUCCEEDED! Recovery completed
      finalStatus = 'succeeded';
      totalRecoveredPaise = execResult.recoveredAmountPaise;
      break;
    }

    // Step 4: Execution Failed — Check attempt limits
    if (attempt >= maxAttempts) {
      finalStatus = 'max_attempts_exceeded';
      break;
    }

    // Step 5: Select Deterministic Fallback Strategy
    const fallbackStrategy = selectFallbackStrategy(
      currentRec.recommendedStrategy,
      observable.failureCategory
    );

    if (!fallbackStrategy || fallbackStrategy === 'no_action') {
      finalStatus = 'failed';
      break;
    }

    // Step 6: Log Fallback Selected Audit Event
    const auditFallback: AuditLogDocument = {
      eventId: `evt_${observable.transactionId}_fb_${randomUUID().slice(0, 8)}`,
      transactionId: observable.transactionId,
      eventType: 'fallback_selected',
      actor: 'system',
      details: {
        failedStrategy: currentRec.recommendedStrategy,
        selectedFallbackStrategy: fallbackStrategy,
        attemptNumber: attempt,
      },
      timestamp: new Date().toISOString(),
    };
    await saveAuditLogs([auditFallback]);

    // Step 7: Build Fallback Recommendation & Action for next attempt
    currentRec = buildFallbackRecommendation(currentRec, fallbackStrategy, observable);
    const newActionId = `act_${observable.transactionId}_fb_${Date.now()}_${attempt + 1}`;
    currentAction = {
      actionId: newActionId,
      transactionId: observable.transactionId,
      strategy: currentRec.recommendedStrategy,
      predictedRecoveryPaise: currentRec.predictedRecoveryPaise,
      actualRecoveryPaise: 0,
      interventionCostPaise: currentRec.recommendedInterventionCostPaise,
      confidence: currentRec.confidence,
      policyStatus: 'pending',
      executionStatus: 'not_executed',
      evidence: currentRec.evidence,
      reasoning: currentRec.reasoning,
      diagnosis: currentRec,
      createdAt: new Date().toISOString(),
      executedAt: null,
    };
    await saveRecoveryActions([currentAction]);

    attempt++;
  }

  const sessionResultPayload: RecoverySessionResult = {
    transactionId: observable.transactionId,
    success: finalStatus === 'succeeded',
    attempts: actions.length,
    totalRecoveredPaise,
    finalStrategy: currentRec.recommendedStrategy,
    finalStatus,
    actions,
    policyDecisions,
    completedAt: new Date().toISOString(),
  };

  const parsed = RecoverySessionResultSchema.parse(sessionResultPayload);

  return {
    transactionId: parsed.transactionId,
    success: parsed.success,
    attempts: parsed.attempts,
    totalRecoveredPaise: parsed.totalRecoveredPaise,
    finalStrategy: parsed.finalStrategy,
    finalStatus: parsed.finalStatus,
    actions,
    policyDecisions,
    completedAt: parsed.completedAt,
  };
}
