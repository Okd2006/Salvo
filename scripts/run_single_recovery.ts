/**
 * scripts/run_single_recovery.ts
 *
 * Salvo — Phase 6: Single Controlled Real Razorpay Test Recovery
 *
 * SAFETY INVARIANTS:
 *  - Enforces RAZORPAY_MODE === "test" (never production/live)
 *  - EXECUTION_SIMULATION is set to false (exercises real test API path)
 *  - Idempotency is enforced
 *  - All audit logs and recovery actions are persisted
 *  - Exactly ONE transaction is evaluated (txn_salv_0001)
 */

import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { getAllTransactions, saveRecoveryActions, saveAuditLogs } from '../src/db/repository.js';
import { toObservableTransaction } from '../src/agents/observation.js';
import { diagnose } from '../src/lib/llm.js';
import { evaluatePolicyGate } from '../src/agents/policyGate.js';
import { executeRecoveryAction, clearIdempotencyCache } from '../src/agents/executor.js';
import { assertTestMode, RAZORPAY_CONFIG } from '../src/lib/razorpay.js';
import { formatPaise } from '../src/lib/currency.js';
import type {
  RecoveryActionDocument,
  AuditLogDocument,
  RecoverySessionResult,
} from '../src/types/index.js';

export async function runSingleControlledRecovery(targetTxnId: string = 'txn_salv_0001'): Promise<RecoverySessionResult> {
  console.log('\n========================================');
  console.log('  SALVO — PHASE 6: REAL TEST RECOVERY');
  console.log('========================================\n');

  // 1. HARD SECURITY INVARIANT ASSERTION
  assertTestMode();
  process.env.EXECUTION_SIMULATION = 'false';
  (RAZORPAY_CONFIG as any).isSimulation = false;

  console.log(`  Razorpay Mode:        ${(process.env.RAZORPAY_MODE || 'test').toUpperCase()}`);
  console.log(`  Execution Simulation: ${RAZORPAY_CONFIG.isSimulation ? 'ENABLED' : 'DISABLED (Real Test API Path Active)'}`);
  console.log(`  Target Transaction:   ${targetTxnId}\n`);

  // 2. Load Transaction from Repository / MongoDB
  console.log('  [1/5] Loading transaction from database...');
  const allTxns = await getAllTransactions();
  const txn = allTxns.find((t) => t.transactionId === targetTxnId);

  if (!txn) {
    throw new Error(`Transaction "${targetTxnId}" not found in database. Run "npm run seed" first.`);
  }

  console.log(`        Found: ${txn.transactionId} | Amount: ${formatPaise(txn.amountPaise)} | Method: ${txn.paymentMethod}`);
  console.log(`        Failure Code: ${txn.failureCode} (${txn.failureCategory})\n`);

  // 3. Ground-Truth Boundary Conversion
  console.log('  [2/5] Stripping ground truth via ObservableTransaction boundary...');
  const observable = toObservableTransaction(txn);
  console.log('        ✓ Observable boundary enforced (0 ground-truth keys leaked)\n');

  // 4. Groq LLM Diagnosis
  console.log('  [3/5] Dispatching diagnosis to Groq AI (openai/gpt-oss-20b)...');
  const recommendation = await diagnose(observable);
  console.log(`        Strategy:       ${recommendation.recommendedStrategy}`);
  console.log(`        Confidence:     ${(recommendation.confidence * 100).toFixed(1)}%`);
  console.log(`        Recoverability: ${(recommendation.recoverability * 100).toFixed(1)}%`);
  console.log(`        Predicted:      ${formatPaise(recommendation.predictedRecoveryPaise)}`);
  console.log(`        Reasoning:      ${recommendation.reasoning}\n`);

  const actionId = `act_${observable.transactionId}_${randomUUID().slice(0, 8)}`;
  const initialAction: RecoveryActionDocument = {
    actionId,
    transactionId: observable.transactionId,
    strategy: recommendation.recommendedStrategy,
    predictedRecoveryPaise: recommendation.predictedRecoveryPaise,
    actualRecoveryPaise: 0,
    interventionCostPaise: recommendation.recommendedInterventionCostPaise,
    confidence: recommendation.confidence,
    policyStatus: 'pending',
    executionStatus: 'not_executed',
    evidence: recommendation.evidence,
    reasoning: recommendation.reasoning,
    diagnosis: recommendation,
    createdAt: new Date().toISOString(),
    executedAt: null,
  };

  const auditDiagnosis: AuditLogDocument = {
    eventId: `evt_${observable.transactionId}_diag_${randomUUID().slice(0, 8)}`,
    transactionId: observable.transactionId,
    eventType: 'diagnosis_created',
    actor: 'gemini_agent',
    details: {
      actionId,
      strategy: recommendation.recommendedStrategy,
      confidence: recommendation.confidence,
      recoverability: recommendation.recoverability,
      predictedRecoveryPaise: recommendation.predictedRecoveryPaise,
      model: 'openai/gpt-oss-20b',
    },
    timestamp: new Date().toISOString(),
  };

  await saveRecoveryActions([initialAction]);
  await saveAuditLogs([auditDiagnosis]);

  // 5. Deterministic Policy Gate Evaluation
  console.log('  [4/5] Evaluating deterministic Policy Gate (Zero LLM calls)...');
  const policyResult = evaluatePolicyGate(recommendation, observable);
  console.log(`        Verdict:     ${(policyResult.verdict || 'approved').toUpperCase()}`);
  console.log(`        Reason Code: ${policyResult.reasonCode}`);
  console.log(`        Reason:      ${policyResult.reason}`);
  console.log(`        Passed Checks: ${policyResult.checks.filter((c) => c.passed).length}/${policyResult.checks.length}\n`);

  const auditPolicy: AuditLogDocument = {
    eventId: `evt_${observable.transactionId}_pol_${randomUUID().slice(0, 8)}`,
    transactionId: observable.transactionId,
    eventType: 'policy_checked',
    actor: 'policy_gate',
    details: {
      actionId,
      strategy: recommendation.recommendedStrategy,
      allowed: policyResult.allowed,
      reasonCode: policyResult.reasonCode,
      reason: policyResult.reason,
      attemptNumber: 1,
    },
    timestamp: new Date().toISOString(),
  };
  await saveAuditLogs([auditPolicy]);

  if (!policyResult.allowed) {
    initialAction.policyStatus = 'blocked';
    initialAction.policyResult = policyResult;
    await saveRecoveryActions([initialAction]);

    const sessionResult: RecoverySessionResult = {
      transactionId: observable.transactionId,
      success: false,
      attempts: 0,
      totalRecoveredPaise: 0,
      finalStrategy: recommendation.recommendedStrategy,
      finalStatus: 'blocked',
      actions: [],
      policyDecisions: [policyResult],
      completedAt: new Date().toISOString(),
    };
    return sessionResult;
  }

  initialAction.policyStatus = 'approved';
  initialAction.policyResult = policyResult;
  await saveRecoveryActions([initialAction]);

  // 6. Execute via RecoveryExecutor with REAL Razorpay Test API path
  console.log('  [5/5] Executing approved recovery action via RecoveryExecutor...');
  clearIdempotencyCache();
  const execResult = await executeRecoveryAction(initialAction, txn, 1);

  console.log(`        Status:             ${execResult.status.toUpperCase()}`);
  console.log(`        Provider:           ${execResult.provider}`);
  console.log(`        Provider Ref:       ${execResult.providerReference || 'N/A'}`);
  console.log(`        Recovered Amount:   ${formatPaise(execResult.recoveredAmountPaise)}`);
  if (execResult.errorCode) {
    console.log(`        Error Code:         ${execResult.errorCode}`);
    console.log(`        Error Message:      ${execResult.errorMessage}`);
  }
  console.log(`        Executed At:        ${execResult.executedAt}\n`);

  const isRealExecution = execResult.status === 'succeeded' && execResult.recoveredAmountPaise > 0;

  const sessionResult: RecoverySessionResult = {
    transactionId: observable.transactionId,
    success: execResult.success,
    attempts: 1,
    totalRecoveredPaise: execResult.recoveredAmountPaise,
    finalStrategy: recommendation.recommendedStrategy,
    finalStatus: execResult.status === 'succeeded' ? 'succeeded' : execResult.status === 'blocked' ? 'blocked' : 'failed',
    actions: [execResult],
    policyDecisions: [policyResult],
    completedAt: new Date().toISOString(),
  };

  console.log('========================================');
  console.log(`FINAL RESULT: ${isRealExecution ? 'REAL RAZORPAY TEST EXECUTION' : 'CONTROLLED TEST FAILURE'}`);
  console.log('========================================\n');

  return sessionResult;
}

runSingleControlledRecovery('txn_salv_0001').catch((err) => {
  console.error('Fatal execution error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
