/**
 * tests/observation.test.ts
 *
 * Unit tests for Ground Truth Protection and Observation Boundary Isolation.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import {
  toObservableTransaction,
  assertNoGroundTruthLeakage,
  FORBIDDEN_GROUND_TRUTH_KEYS,
} from '../src/agents/observation.js';

test('toObservableTransaction strictly strips all ground truth and simulation fields', () => {
  const { transactions } = generateSyntheticDataset(10, 'obs-seed');
  const txn = transactions[0];

  assert.ok(txn.groundTruth);
  assert.ok(txn.simulation);

  const observable = toObservableTransaction(txn);

  // Assert observable fields are present
  assert.equal(observable.transactionId, txn.transactionId);
  assert.equal(observable.amountPaise, txn.amountPaise);
  assert.equal(observable.failureCategory, txn.failureCategory);
  assert.equal(observable.failureCode, txn.failureCode);
  assert.equal(observable.customerHistory.customerId, txn.customerHistory.customerId);

  // Assert ground truth and simulation are COMPLETELY absent
  const rawObj = observable as unknown as Record<string, unknown>;
  assert.equal(rawObj['groundTruth'], undefined);
  assert.equal(rawObj['simulation'], undefined);
  assert.equal(rawObj['optimalStrategy'], undefined);
  assert.equal(rawObj['expectedRecoveryPaise'], undefined);
  assert.equal(rawObj['shouldIntervene'], undefined);
  assert.equal(rawObj['riskScore'], undefined);

  // Verify serialized string has zero forbidden ground truth keys
  const serialized = JSON.stringify(observable);
  for (const forbiddenKey of FORBIDDEN_GROUND_TRUTH_KEYS) {
    assert.equal(
      serialized.includes(`"${forbiddenKey}"`),
      false,
      `Forbidden key "${forbiddenKey}" found in serialized observable transaction!`
    );
  }
});

test('assertNoGroundTruthLeakage throws error when ground truth is leaked', () => {
  const leakedObject = {
    transactionId: 'txn_test_01',
    groundTruth: {
      optimalStrategy: 'smart_retry',
    },
  };

  assert.throws(
    () => {
      assertNoGroundTruthLeakage(leakedObject);
    },
    /Ground truth leakage detected/
  );
});

test('assertNoGroundTruthLeakage allows clean observable objects', () => {
  const cleanObject = {
    transactionId: 'txn_clean_01',
    amountPaise: 450000,
    failureCode: 'GATEWAY_TIMEOUT',
    failureCategory: 'temporary_network_failure',
  };

  assert.doesNotThrow(() => {
    assertNoGroundTruthLeakage(cleanObject);
  });
});
