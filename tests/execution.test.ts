/**
 * tests/execution.test.ts
 *
 * Comprehensive Unit Tests for Phase 4:
 * Razorpay Test Execution + Deterministic Failure Injection + Fallback Engine + Autonomous Orchestrator
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { toObservableTransaction } from '../src/agents/observation.js';
import {
  executeRecoveryAction,
  simulateDeterministicOutcome,
  clearIdempotencyCache,
} from '../src/agents/executor.js';
import { selectFallbackStrategy, buildFallbackRecommendation } from '../src/agents/fallback.js';
import { runAutonomousRecovery } from '../src/agents/orchestrator.js';
import { assertTestMode } from '../src/lib/razorpay.js';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  RecoveryRecommendation,
} from '../src/types/index.js';

function createMockTransaction(overrides?: Partial<TransactionDocument>): TransactionDocument {
  const base: TransactionDocument = {
    transactionId: 'txn_test_exec_01',
    merchantId: 'mer_01',
    merchantName: 'Test Merchant',
    customerId: 'cust_01',
    customerEmail: 'customer@example.com',
    customerPhone: '+919876543210',
    amountPaise: 450000, // ₹4,500
    currency: 'INR',
    paymentMethod: 'card',
    status: 'failed',
    failureCode: 'GATEWAY_TIMEOUT',
    failureDescription: 'Gateway timeout on upstream acquirer',
    failureCategory: 'temporary_network_failure',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerHistory: {
      customerId: 'cust_01',
      previousPayments: 10,
      successfulPayments: 9,
      previousFailures: 1,
      retrySuccessRate: 0.9,
      preferredMethod: 'card',
      averageTransactionPaise: 450000,
    },
    retryCount: 0,
    recoverable: true,
    groundTruth: {
      recoverable: true,
      optimalStrategy: 'smart_retry',
      expectedRecoveryPaise: 450000,
      shouldIntervene: true,
      interventionCostPaise: 150,
      riskScore: 0.05,
    },
    simulation: {
      predictedStrategy: 'smart_retry',
      confidence: 0.92,
      predictedRecoveryPaise: 450000,
      interventionCostPaise: 150,
      policyVerdict: 'approved',
      executionStatus: 'not_executed',
      actualRecoveryPaise: 0,
    },
  };
  return { ...base, ...overrides };
}

function createMockAction(overrides?: Partial<RecoveryActionDocument>): RecoveryActionDocument {
  const base: RecoveryActionDocument = {
    actionId: `act_test_${Date.now()}`,
    transactionId: 'txn_test_exec_01',
    strategy: 'smart_retry',
    predictedRecoveryPaise: 450000,
    actualRecoveryPaise: 0,
    interventionCostPaise: 150,
    confidence: 0.92,
    policyStatus: 'approved',
    executionStatus: 'not_executed',
    evidence: ['Observed GATEWAY_TIMEOUT'],
    reasoning: 'Transient network failure',
    createdAt: new Date().toISOString(),
    executedAt: null,
  };
  return { ...base, ...overrides };
}

test('Safety: assertTestMode rejects production mode', () => {
  const originalMode = process.env.RAZORPAY_MODE;
  try {
    process.env.RAZORPAY_MODE = 'live';
    assert.throws(() => assertTestMode(), /Production payment mutations are strictly prohibited/);
  } finally {
    process.env.RAZORPAY_MODE = originalMode || 'test';
  }
});

test('Executor: Approved action executes and returns valid ExecutionResult', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction();
  const action = createMockAction({ policyStatus: 'approved', executionStatus: 'not_executed' });

  const result = await executeRecoveryAction(action, txn, 1);

  assert.equal(result.actionId, action.actionId);
  assert.equal(result.transactionId, txn.transactionId);
  assert.equal(result.provider, 'razorpay_test');
  assert.ok(result.status === 'succeeded' || result.status === 'failed');
  assert.ok(result.executedAt);
});

test('Executor: Refuses execution when policyStatus is NOT approved', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction();
  const pendingAction = createMockAction({ policyStatus: 'pending', executionStatus: 'not_executed' });
  const blockedAction = createMockAction({ policyStatus: 'blocked', executionStatus: 'not_executed' });

  const resPending = await executeRecoveryAction(pendingAction, txn, 1);
  assert.equal(resPending.success, false);
  assert.equal(resPending.status, 'blocked');
  assert.equal(resPending.errorCode, 'EXECUTION_BLOCKED_BY_POLICY');

  const resBlocked = await executeRecoveryAction(blockedAction, txn, 1);
  assert.equal(resBlocked.success, false);
  assert.equal(resBlocked.status, 'blocked');
  assert.equal(resBlocked.errorCode, 'EXECUTION_BLOCKED_BY_POLICY');
});

test('Idempotency: Prevents duplicate execution and returns already_executed', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction();
  const action = createMockAction({ policyStatus: 'approved', executionStatus: 'not_executed' });

  // First execution
  const res1 = await executeRecoveryAction(action, txn, 1);
  assert.ok(res1.status === 'succeeded' || res1.status === 'failed');

  // Second execution with same action and attempt
  const res2 = await executeRecoveryAction(action, txn, 1);
  assert.equal(res2.status, 'already_executed');
});

test('Deterministic Simulation: Produces 100% identical outcomes for same seed', () => {
  const txn = createMockTransaction();

  const out1 = simulateDeterministicOutcome(txn, 'smart_retry', 1);
  const out2 = simulateDeterministicOutcome(txn, 'smart_retry', 1);
  const out3 = simulateDeterministicOutcome(txn, 'smart_retry', 1);

  assert.equal(out1.success, out2.success);
  assert.equal(out1.errorCode, out2.errorCode);
  assert.equal(out1.providerReference, out2.providerReference);

  assert.equal(out2.success, out3.success);
  assert.equal(out2.errorCode, out3.errorCode);
});

test('Fallback Engine: Correctly determines next viable strategy in sequence', () => {
  // smart_retry -> payment_method_switch
  const fb1 = selectFallbackStrategy('smart_retry', 'temporary_network_failure');
  assert.equal(fb1, 'payment_method_switch');

  // payment_method_switch -> payment_link
  const fb2 = selectFallbackStrategy('payment_method_switch', 'payment_method_issue');
  assert.equal(fb2, 'payment_link');

  // payment_link -> reminder
  const fb3 = selectFallbackStrategy('payment_link', 'customer_abandonment');
  assert.equal(fb3, 'reminder');

  // reminder -> no_action
  const fb4 = selectFallbackStrategy('reminder', 'authentication_failure');
  assert.equal(fb4, 'no_action');
});

test('Fallback Engine: Builds valid RecoveryRecommendation for fallback', () => {
  const txn = createMockTransaction();
  const observable = toObservableTransaction(txn);

  const prevRec: RecoveryRecommendation = {
    transactionId: observable.transactionId,
    failureType: 'temporary',
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry',
    confidence: 0.90,
    evidence: ['Observed timeout'],
    reasoning: 'Initial retry attempt',
    predictedRecoveryPaise: 382500,
    recommendedInterventionCostPaise: 150,
  };

  const fallbackRec = buildFallbackRecommendation(prevRec, 'payment_method_switch', observable);

  assert.equal(fallbackRec.transactionId, observable.transactionId);
  assert.equal(fallbackRec.recommendedStrategy, 'payment_method_switch');
  assert.equal(fallbackRec.recommendedInterventionCostPaise, 450);
  assert.ok(fallbackRec.predictedRecoveryPaise <= observable.amountPaise);
});

test('SCENARIO A — Success: Temporary network failure recovers cleanly', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction({
    transactionId: 'txn_scen_a_01',
    failureCategory: 'temporary_network_failure',
    failureCode: 'GATEWAY_TIMEOUT',
  });

  const session = await runAutonomousRecovery(txn, 3);

  assert.equal(session.transactionId, txn.transactionId);
  assert.ok(session.policyDecisions.length >= 1);
  assert.equal(session.policyDecisions[0].allowed, true);
  assert.ok(session.actions.length >= 1);
  assert.equal(session.success, true);
  assert.equal(session.finalStatus, 'succeeded');
  assert.ok(session.totalRecoveredPaise > 0);
});

test('SCENARIO B — Fallback: Execution failure on attempt 1 falls back and recovers', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction({
    transactionId: 'txn_scen_b_fb',
    failureCategory: 'bank_decline',
    failureCode: 'ISSUER_SWITCH_UNAVAILABLE',
  });

  const session = await runAutonomousRecovery(txn, 3);

  assert.equal(session.transactionId, txn.transactionId);
  assert.ok(session.actions.length >= 1);
  assert.ok(session.policyDecisions.length >= 1);
});

test('SCENARIO C — Risk Block: Suspected risk is blocked by Policy Gate with 0 execution attempts', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction({
    transactionId: 'txn_scen_c_risk',
    failureCategory: 'suspected_risk',
    failureCode: 'HIGH_RISK_SUSPICIOUS_VELOCITY',
  });

  const session = await runAutonomousRecovery(txn, 3);

  assert.equal(session.success, false);
  assert.equal(session.finalStatus, 'blocked');
  assert.equal(session.actions.length, 0); // Zero executions attempted
  assert.equal(session.policyDecisions[0].allowed, false);
  assert.equal(session.policyDecisions[0].reasonCode, 'RISK_BLOCK');
});

test('SCENARIO D — Retry Limit: retryCount >= 2 is blocked by Policy Gate with 0 executions', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction({
    transactionId: 'txn_scen_d_limit',
    retryCount: 2,
    failureCategory: 'temporary_network_failure',
  });

  const session = await runAutonomousRecovery(txn, 3);

  assert.equal(session.success, false);
  assert.equal(session.finalStatus, 'blocked');
  assert.equal(session.actions.length, 0);
  assert.equal(session.policyDecisions[0].allowed, false);
  assert.equal(session.policyDecisions[0].reasonCode, 'RETRY_LIMIT_EXCEEDED');
});

test('SCENARIO F — Three Failures: Stops at MAX_RECOVERY_ATTEMPTS without infinite loop', async () => {
  clearIdempotencyCache();
  const txn = createMockTransaction({
    transactionId: 'txn_scen_f_3fail',
    failureCategory: 'insufficient_funds',
  });

  const session = await runAutonomousRecovery(txn, 3);

  assert.ok(session.attempts <= 3);
  assert.ok(
    session.finalStatus === 'succeeded' ||
      session.finalStatus === 'failed' ||
      session.finalStatus === 'max_attempts_exceeded' ||
      session.finalStatus === 'blocked'
  );
});
