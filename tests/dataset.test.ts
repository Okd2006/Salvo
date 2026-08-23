/**
 * tests/dataset.test.ts
 *
 * Unit tests for deterministic synthetic dataset generation.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';

test('SeededPRNG produces 100% deterministic, reproducible outputs', () => {
  const seed = 'test-seed-42';
  const run1 = generateSyntheticDataset(50, seed);
  const run2 = generateSyntheticDataset(50, seed);

  assert.equal(run1.transactions.length, 50);
  assert.equal(run2.transactions.length, 50);

  for (let i = 0; i < 50; i++) {
    const t1 = run1.transactions[i];
    const t2 = run2.transactions[i];

    assert.equal(t1.transactionId, t2.transactionId);
    assert.equal(t1.amountPaise, t2.amountPaise);
    assert.equal(t1.failureCategory, t2.failureCategory);
    assert.equal(t1.failureCode, t2.failureCode);
    assert.equal(t1.groundTruth.recoverable, t2.groundTruth.recoverable);
    assert.equal(t1.groundTruth.optimalStrategy, t2.groundTruth.optimalStrategy);
    assert.equal(t1.groundTruth.expectedRecoveryPaise, t2.groundTruth.expectedRecoveryPaise);
    assert.equal(t1.simulation.predictedStrategy, t2.simulation.predictedStrategy);
    assert.equal(t1.simulation.actualRecoveryPaise, t2.simulation.actualRecoveryPaise);
  }
});

test('Dataset generation respects requested size', () => {
  const dataset = generateSyntheticDataset(1350, 'salvo-buildathon-v1');
  assert.equal(dataset.transactions.length, 1350);
  assert.ok(dataset.recoveryActions.length > 0);
  assert.ok(dataset.auditLogs.length >= 1350);
});

test('All transaction amounts are strictly positive integer paise', () => {
  const dataset = generateSyntheticDataset(100, 'test-amounts');
  for (const txn of dataset.transactions) {
    assert.ok(Number.isInteger(txn.amountPaise), `Amount must be integer: ${txn.amountPaise}`);
    assert.ok(txn.amountPaise > 0, `Amount must be positive: ${txn.amountPaise}`);
    assert.equal(txn.currency, 'INR');
    assert.ok(Number.isInteger(txn.groundTruth.expectedRecoveryPaise));
    assert.ok(Number.isInteger(txn.simulation.actualRecoveryPaise));
    assert.ok(Number.isInteger(txn.simulation.interventionCostPaise));
  }
});

test('High-risk and unrecoverable failures are never flagged as recoverable', () => {
  const dataset = generateSyntheticDataset(300, 'test-risk');
  for (const txn of dataset.transactions) {
    if (txn.failureCategory === 'suspected_risk' || txn.failureCategory === 'unrecoverable') {
      assert.equal(txn.groundTruth.recoverable, false);
      assert.equal(txn.groundTruth.optimalStrategy, 'no_action');
      assert.equal(txn.groundTruth.shouldIntervene, false);
      assert.equal(txn.simulation.policyVerdict, 'blocked');
    }
  }
});
