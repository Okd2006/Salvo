/**
 * tests/schema.test.ts
 *
 * Unit tests for RecoveryRecommendation schema and runtime validation rules.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { RecoveryRecommendationSchema, GeminiRawDiagnosisSchema } from '../src/lib/schemas.js';

test('RecoveryRecommendationSchema accepts valid recommendation objects', () => {
  const validRec = {
    transactionId: 'txn_rec_01',
    failureType: 'temporary',
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry',
    confidence: 0.92,
    evidence: ['Gateway timeout encountered', 'Customer has 95% historical success rate'],
    reasoning: 'Transient network failure on acquiring switch. Smart retry has high probability of success.',
    predictedRecoveryPaise: 85000,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(validRec);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.transactionId, 'txn_rec_01');
    assert.equal(parsed.data.predictedRecoveryPaise, 85000);
  }
});

test('RecoveryRecommendationSchema rejects invalid confidence out of [0, 1] range', () => {
  const invalidRec = {
    transactionId: 'txn_rec_02',
    failureType: 'temporary',
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry',
    confidence: 1.5, // INVALID > 1
    evidence: ['Valid evidence'],
    reasoning: 'Valid reasoning',
    predictedRecoveryPaise: 85000,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(invalidRec);
  assert.equal(parsed.success, false);
});

test('RecoveryRecommendationSchema rejects invalid recoverability out of [0, 1] range', () => {
  const invalidRec = {
    transactionId: 'txn_rec_03',
    failureType: 'temporary',
    recoverability: -0.2, // INVALID < 0
    recommendedStrategy: 'smart_retry',
    confidence: 0.8,
    evidence: ['Valid evidence'],
    reasoning: 'Valid reasoning',
    predictedRecoveryPaise: 85000,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(invalidRec);
  assert.equal(parsed.success, false);
});

test('RecoveryRecommendationSchema rejects empty evidence array', () => {
  const invalidRec = {
    transactionId: 'txn_rec_04',
    failureType: 'customer',
    recoverability: 0.5,
    recommendedStrategy: 'payment_link',
    confidence: 0.8,
    evidence: [], // INVALID: must have >= 1 item
    reasoning: 'Valid reasoning',
    predictedRecoveryPaise: 50000,
    recommendedInterventionCostPaise: 250,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(invalidRec);
  assert.equal(parsed.success, false);
});

test('RecoveryRecommendationSchema rejects negative financial paise amounts', () => {
  const invalidRec = {
    transactionId: 'txn_rec_05',
    failureType: 'risk',
    recoverability: 0.0,
    recommendedStrategy: 'no_action',
    confidence: 0.95,
    evidence: ['Suspicious velocity'],
    reasoning: 'Anti-fraud flagged',
    predictedRecoveryPaise: -100, // INVALID negative paise
    recommendedInterventionCostPaise: 0,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(invalidRec);
  assert.equal(parsed.success, false);
});

test('no_action is a valid recommendation with zero paise', () => {
  const noActionRec = {
    transactionId: 'txn_rec_06',
    failureType: 'unrecoverable',
    recoverability: 0.0,
    recommendedStrategy: 'no_action',
    confidence: 0.98,
    evidence: ['Account permanently closed by issuer'],
    reasoning: 'Permanent issuer decline — do not attempt intervention.',
    predictedRecoveryPaise: 0,
    recommendedInterventionCostPaise: 0,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(noActionRec);
  assert.equal(parsed.success, true);
});

test('GeminiRawDiagnosisSchema parses valid raw Gemini structured output', () => {
  const rawOutput = {
    failureType: 'payment_method',
    recoverability: 0.65,
    recommendedStrategy: 'payment_method_switch',
    confidence: 0.88,
    evidence: ['Card expired on previous month'],
    reasoning: 'Customer card has passed expiry date.',
    predictedRecoveryPercentage: 0.65,
    recommendedInterventionCostPaise: 450,
  };

  const parsed = GeminiRawDiagnosisSchema.safeParse(rawOutput);
  assert.equal(parsed.success, true);
});
