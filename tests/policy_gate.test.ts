/**
 * tests/policy_gate.test.ts
 *
 * Unit tests for the Deterministic Policy Gate.
 *
 * Verifies all 9 deterministic safety rules, reason codes, checks array,
 * and zero-LLM reproducibility.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import { toObservableTransaction } from '../src/agents/observation.js';
import { evaluatePolicyGate } from '../src/agents/policyGate.js';
import type { RecoveryRecommendation, ObservableTransaction } from '../src/types/index.js';

function createBaseObservable(overrides?: Partial<ObservableTransaction>): ObservableTransaction {
  return {
    transactionId: 'txn_test_pg_01',
    amountPaise: 250000, // ₹2,500
    currency: 'INR',
    paymentMethod: 'card',
    status: 'failed',
    failureCode: 'GATEWAY_TIMEOUT',
    failureCategory: 'temporary_network_failure',
    failureDescription: 'Upstream gateway timeout',
    createdAt: new Date().toISOString(),
    customerHistory: {
      customerId: 'cust_01',
      previousPayments: 10,
      successfulPayments: 9,
      previousFailures: 1,
      retrySuccessRate: 0.9,
      preferredMethod: 'card',
      averageTransactionPaise: 250000,
    },
    retryCount: 0,
    merchantName: 'Test Merchant',
    ...overrides,
  };
}

function createBaseRecommendation(overrides?: Partial<RecoveryRecommendation>): RecoveryRecommendation {
  return {
    transactionId: 'txn_test_pg_01',
    failureType: 'temporary',
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry',
    confidence: 0.90,
    evidence: ['Gateway timeout encountered', 'High customer success rate'],
    reasoning: 'Transient network failure on acquiring switch',
    predictedRecoveryPaise: 212500, // ₹2,125
    recommendedInterventionCostPaise: 150, // ₹1.50
    ...overrides,
  };
}

test('Policy Gate: APPROVES compliant recovery recommendation with ALLOWED reasonCode', () => {
  const observable = createBaseObservable();
  const recommendation = createBaseRecommendation();

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, true);
  assert.equal(result.reasonCode, 'ALLOWED');
  assert.equal(result.verdict, 'approved');
  assert.ok(result.checks.length >= 9);

  // Assert all individual checks passed
  for (const check of result.checks) {
    assert.equal(check.passed, true, `Check "${check.name}" should have passed`);
  }
});

test('Policy Gate: BLOCKS suspected fraud/risk with RISK_BLOCK reasonCode', () => {
  const observable = createBaseObservable({
    failureCategory: 'suspected_risk',
    failureCode: 'HIGH_RISK_SUSPICIOUS_VELOCITY',
  });
  const recommendation = createBaseRecommendation({
    failureType: 'risk',
    recommendedStrategy: 'no_action',
    recoverability: 0.0,
    predictedRecoveryPaise: 0,
    recommendedInterventionCostPaise: 0,
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'RISK_BLOCK');
  assert.equal(result.verdict, 'blocked');

  const riskCheck = result.checks.find((c) => c.name === 'RISK_SAFETY_CHECK');
  assert.ok(riskCheck);
  assert.equal(riskCheck.passed, false);
});

test('Policy Gate: BLOCKS unrecoverable failures with UNRECOVERABLE_BLOCK reasonCode', () => {
  const observable = createBaseObservable({
    failureCategory: 'unrecoverable',
    failureCode: 'ACCOUNT_CLOSED_PERMANENTLY',
  });
  const recommendation = createBaseRecommendation({
    failureType: 'unrecoverable',
    recommendedStrategy: 'no_action',
    recoverability: 0.0,
    predictedRecoveryPaise: 0,
    recommendedInterventionCostPaise: 0,
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'UNRECOVERABLE_BLOCK');
  assert.equal(result.verdict, 'blocked');

  const unrecCheck = result.checks.find((c) => c.name === 'UNRECOVERABLE_SAFETY_CHECK');
  assert.ok(unrecCheck);
  assert.equal(unrecCheck.passed, false);
});

test('Policy Gate: BLOCKS when retry limit exceeded with RETRY_LIMIT_EXCEEDED reasonCode', () => {
  const observable = createBaseObservable({
    retryCount: 2, // Max allowed retries reached
  });
  const recommendation = createBaseRecommendation({
    recommendedStrategy: 'smart_retry',
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'RETRY_LIMIT_EXCEEDED');

  const retryCheck = result.checks.find((c) => c.name === 'RETRY_LIMIT_CHECK');
  assert.ok(retryCheck);
  assert.equal(retryCheck.passed, false);
});

test('Policy Gate: BLOCKS when diagnosis confidence is too low with CONFIDENCE_TOO_LOW reasonCode', () => {
  const observable = createBaseObservable();
  const recommendation = createBaseRecommendation({
    confidence: 0.45, // Below 0.60 threshold
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'CONFIDENCE_TOO_LOW');

  const confCheck = result.checks.find((c) => c.name === 'CONFIDENCE_THRESHOLD_CHECK');
  assert.ok(confCheck);
  assert.equal(confCheck.passed, false);
});

test('Policy Gate: BLOCKS negative expected value with NEGATIVE_EXPECTED_VALUE reasonCode', () => {
  const observable = createBaseObservable();
  const recommendation = createBaseRecommendation({
    predictedRecoveryPaise: 150, // Projected recovery = 150 paise
    recommendedInterventionCostPaise: 300, // Cost = 300 paise -> Net = -150 paise
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'NEGATIVE_EXPECTED_VALUE');

  const valCheck = result.checks.find((c) => c.name === 'POSITIVE_EXPECTED_VALUE_CHECK');
  assert.ok(valCheck);
  assert.equal(valCheck.passed, false);
});

test('Policy Gate: BLOCKS invalid recovery amount with INVALID_RECOVERY_AMOUNT reasonCode', () => {
  const observable = createBaseObservable({
    amountPaise: 100000, // ₹1,000
  });
  const recommendation = createBaseRecommendation({
    predictedRecoveryPaise: 200000, // ₹2,000 > transaction amount
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'INVALID_RECOVERY_AMOUNT');

  const amtCheck = result.checks.find((c) => c.name === 'AMOUNT_VALIDITY_CHECK');
  assert.ok(amtCheck);
  assert.equal(amtCheck.passed, false);
});

test('Policy Gate: BLOCKS high-ticket automated retry with AMOUNT_THRESHOLD_EXCEEDED reasonCode', () => {
  const observable = createBaseObservable({
    amountPaise: 6_000_000, // ₹60,000 > ₹50,000 retry threshold
  });
  const recommendation = createBaseRecommendation({
    recommendedStrategy: 'smart_retry',
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'AMOUNT_THRESHOLD_EXCEEDED');

  const thresholdCheck = result.checks.find((c) => c.name === 'AMOUNT_THRESHOLD_CHECK');
  assert.ok(thresholdCheck);
  assert.equal(thresholdCheck.passed, false);
});

test('Policy Gate: BLOCKS incompatible strategy combinations with STRATEGY_NOT_PERMITTED reasonCode', () => {
  const observable = createBaseObservable({
    failureCategory: 'payment_method_issue', // Expired card
  });
  const recommendation = createBaseRecommendation({
    recommendedStrategy: 'smart_retry', // Retrying expired card is impermissible
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'STRATEGY_NOT_PERMITTED');

  const stratCheck = result.checks.find((c) => c.name === 'STRATEGY_PERMISSIBILITY_CHECK');
  assert.ok(stratCheck);
  assert.equal(stratCheck.passed, false);
});

test('Policy Gate: BLOCKS excessive customer contact with CONTACT_LIMIT_EXCEEDED reasonCode', () => {
  const observable = createBaseObservable({
    retryCount: 3, // Already contacted 3 times
  });
  const recommendation = createBaseRecommendation({
    recommendedStrategy: 'payment_link',
  });

  const result = evaluatePolicyGate(recommendation, observable);

  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, 'CONTACT_LIMIT_EXCEEDED');

  const contactCheck = result.checks.find((c) => c.name === 'CONTACT_LIMIT_CHECK');
  assert.ok(contactCheck);
  assert.equal(contactCheck.passed, false);
});

test('Policy Gate is 100% deterministic across multiple evaluations', () => {
  const { transactions } = generateSyntheticDataset(20, 'pg-determinism');

  for (const txn of transactions) {
    const observable = toObservableTransaction(txn);
    const recommendation: RecoveryRecommendation = {
      transactionId: observable.transactionId,
      failureType: txn.failureCategory === 'suspected_risk' ? 'risk' : 'temporary',
      recoverability: txn.groundTruth.recoverable ? 0.85 : 0.0,
      recommendedStrategy: txn.groundTruth.optimalStrategy,
      confidence: 0.90,
      evidence: ['Deterministic telemetry data'],
      reasoning: 'Policy determinism verification',
      predictedRecoveryPaise: txn.groundTruth.expectedRecoveryPaise,
      recommendedInterventionCostPaise: txn.groundTruth.interventionCostPaise,
    };

    const run1 = evaluatePolicyGate(recommendation, observable);
    const run2 = evaluatePolicyGate(recommendation, observable);

    assert.equal(run1.allowed, run2.allowed);
    assert.equal(run1.reasonCode, run2.reasonCode);
    assert.equal(run1.reason, run2.reason);
    assert.equal(run1.checks.length, run2.checks.length);

    for (let i = 0; i < run1.checks.length; i++) {
      assert.equal(run1.checks[i].name, run2.checks[i].name);
      assert.equal(run1.checks[i].passed, run2.checks[i].passed);
      assert.equal(run1.checks[i].reason, run2.checks[i].reason);
    }
  }
});
