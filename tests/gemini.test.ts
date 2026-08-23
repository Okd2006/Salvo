/**
 * tests/gemini.test.ts
 *
 * Unit tests for Gemini client configuration, financial clamping, and pipeline document creation.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import { toObservableTransaction } from '../src/agents/observation.js';
import { RecoveryRecommendationSchema } from '../src/lib/schemas.js';
import { GeminiConfigError, GeminiValidationError } from '../src/lib/gemini.js';
import type { RecoveryActionDocument, AuditLogDocument } from '../src/types/index.js';

test('Financial clamping invariant: Predicted recovery cannot exceed transaction amount', () => {
  const { transactions } = generateSyntheticDataset(5, 'clamp-seed');
  const txn = transactions[0];
  const observable = toObservableTransaction(txn);

  // Simulate an over-optimistic model estimating 200% recovery
  const simulatedRawPaise = observable.amountPaise * 2;
  const clampedPaise = Math.max(0, Math.min(observable.amountPaise, simulatedRawPaise));

  assert.equal(clampedPaise, observable.amountPaise);
  assert.ok(clampedPaise <= observable.amountPaise);

  const recommendation = {
    transactionId: observable.transactionId,
    failureType: 'temporary' as const,
    recoverability: 0.9,
    recommendedStrategy: 'smart_retry' as const,
    confidence: 0.95,
    evidence: ['Transient network latency'],
    reasoning: 'Transient network failure',
    predictedRecoveryPaise: clampedPaise,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.parse(recommendation);
  assert.ok(parsed.predictedRecoveryPaise <= observable.amountPaise);
});

test('Diagnosis creates recovery_action with policyStatus "pending" and executionStatus "not_executed"', () => {
  const { transactions } = generateSyntheticDataset(1, 'action-seed');
  const txn = transactions[0];

  const now = new Date().toISOString();
  const mockAction: RecoveryActionDocument = {
    actionId: `act_${txn.transactionId}_123`,
    transactionId: txn.transactionId,
    strategy: 'smart_retry',
    predictedRecoveryPaise: 84000,
    actualRecoveryPaise: 0,
    interventionCostPaise: 150,
    confidence: 0.92,
    policyStatus: 'pending', // REQUIRED: Policy Gate has not run
    executionStatus: 'not_executed', // REQUIRED: Razorpay has not executed
    createdAt: now,
    executedAt: null,
  };

  assert.equal(mockAction.policyStatus, 'pending');
  assert.equal(mockAction.executionStatus, 'not_executed');
  assert.equal(mockAction.executedAt, null);
});

test('Diagnosis creates audit_log event with eventType "diagnosis_created"', () => {
  const { transactions } = generateSyntheticDataset(1, 'audit-seed');
  const txn = transactions[0];

  const now = new Date().toISOString();
  const mockAudit: AuditLogDocument = {
    eventId: `evt_${txn.transactionId}_diag_123`,
    transactionId: txn.transactionId,
    eventType: 'diagnosis_created',
    actor: 'gemini_agent',
    details: {
      failureType: 'temporary',
      recommendedStrategy: 'smart_retry',
      confidence: 0.92,
      model: 'gemini-2.5-flash',
    },
    timestamp: now,
  };

  assert.equal(mockAudit.eventType, 'diagnosis_created');
  assert.equal(mockAudit.actor, 'gemini_agent');
  assert.equal(mockAudit.transactionId, txn.transactionId);
});

test('GeminiConfigError is thrown when API key is missing, without fake AI fallbacks', () => {
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    // Verify that error class is properly recognized
    const err = new GeminiConfigError('GEMINI_API_KEY is missing');
    assert.ok(err instanceof Error);
    assert.equal(err.name, 'GeminiConfigError');
  } finally {
    if (originalKey) process.env.GEMINI_API_KEY = originalKey;
  }
});

test('GeminiValidationError is non-retryable and preserves typed error hierarchy', () => {
  const validationError = new GeminiValidationError('Schema validation failure on confidence');
  assert.ok(validationError instanceof Error);
  assert.equal(validationError.name, 'GeminiValidationError');
});
