/**
 * tests/evaluation.test.ts
 *
 * Unit tests for deterministic evaluation engine metrics and formulas.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDataset } from '../src/evaluation/engine.js';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import type { TransactionDocument } from '../src/types/index.js';

test('Evaluation engine computes correct gross, cost, and net recovery formulas', () => {
  const mockTxns: TransactionDocument[] = [
    {
      transactionId: 'txn_01',
      merchantId: 'mer_1',
      merchantName: 'Test Merchant',
      customerId: 'cust_1',
      customerEmail: 'c1@test.com',
      customerPhone: '+919999999999',
      amountPaise: 100000, // ₹1,000
      currency: 'INR',
      paymentMethod: 'card',
      status: 'captured',
      failureCode: 'GATEWAY_TIMEOUT',
      failureDescription: 'Timeout',
      failureCategory: 'temporary_network_failure',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerHistory: {
        customerId: 'cust_1',
        previousPayments: 5,
        successfulPayments: 5,
        previousFailures: 0,
        retrySuccessRate: 1.0,
        preferredMethod: 'card',
        averageTransactionPaise: 100000,
        accountAgeDays: 100,
      },
      retryCount: 1,
      recoverable: true,
      groundTruth: {
        recoverable: true,
        optimalStrategy: 'smart_retry',
        expectedRecoveryPaise: 90000,
        shouldIntervene: true,
        interventionCostPaise: 150,
        riskScore: 0.05,
      },
      simulation: {
        predictedStrategy: 'smart_retry',
        confidence: 0.95,
        predictedRecoveryPaise: 90000,
        interventionCostPaise: 150,
        policyVerdict: 'approved',
        executionStatus: 'recovered',
        actualRecoveryPaise: 100000,
      },
    },
    {
      transactionId: 'txn_02',
      merchantId: 'mer_1',
      merchantName: 'Test Merchant',
      customerId: 'cust_2',
      customerEmail: 'c2@test.com',
      customerPhone: '+919999999998',
      amountPaise: 200000, // ₹2,000
      currency: 'INR',
      paymentMethod: 'upi',
      status: 'failed',
      failureCode: 'SUSPICIOUS_VELOCITY',
      failureDescription: 'Fraud',
      failureCategory: 'suspected_risk',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerHistory: {
        customerId: 'cust_2',
        previousPayments: 1,
        successfulPayments: 0,
        previousFailures: 1,
        retrySuccessRate: 0.0,
        preferredMethod: 'upi',
        averageTransactionPaise: 200000,
        accountAgeDays: 5,
      },
      retryCount: 0,
      recoverable: false,
      groundTruth: {
        recoverable: false,
        optimalStrategy: 'no_action',
        expectedRecoveryPaise: 0,
        shouldIntervene: false,
        interventionCostPaise: 0,
        riskScore: 0.95,
      },
      simulation: {
        predictedStrategy: 'no_action',
        confidence: 0.99,
        predictedRecoveryPaise: 0,
        interventionCostPaise: 0,
        policyVerdict: 'blocked',
        executionStatus: 'blocked',
        actualRecoveryPaise: 0,
      },
    },
  ];

  const report = evaluateDataset(mockTxns);

  assert.equal(report.totalTransactions, 2);
  assert.equal(report.totalFailedRevenuePaise, 300000);
  assert.equal(report.totalActuallyRecoverablePaise, 100000);
  assert.equal(report.actualRecoveryPaise, 100000);
  assert.equal(report.interventionCostPaise, 150);
  assert.equal(report.netRecoveryPaise, 100000 - 150); // 99850 paise
  assert.equal(report.policyBlockedCount, 1);
  assert.equal(report.successfulRecoveriesCount, 1);
  assert.equal(report.confusionMatrix.precision, 1.0);
  assert.equal(report.confusionMatrix.recall, 1.0);
});

test('Zero denominator precision and recall evaluate safely to 0 without NaN', () => {
  const emptyReport = evaluateDataset([]);
  assert.equal(emptyReport.totalTransactions, 0);
  assert.equal(emptyReport.confusionMatrix.precision, 0);
  assert.equal(emptyReport.confusionMatrix.recall, 0);
  assert.equal(emptyReport.confusionMatrix.f1Score, 0);
  assert.equal(emptyReport.netRecoveryPaise, 0);
});

test('Full dataset evaluation produces valid strategy breakdowns and consistency', () => {
  const dataset = generateSyntheticDataset(1350, 'salvo-buildathon-v1');
  const report = evaluateDataset(dataset.transactions, 'salvo-buildathon-v1');

  assert.equal(report.totalTransactions, 1350);
  assert.ok(report.totalFailedRevenuePaise > 0);
  assert.ok(report.actualRecoveryPaise > 0);
  assert.ok(report.netRecoveryPaise > 0);
  assert.ok(report.confusionMatrix.precision > 0.5);
  assert.ok(report.confusionMatrix.recall > 0.5);

  let sumStrategyPredictions = 0;
  for (const s of Object.keys(report.strategyBreakdown) as (keyof typeof report.strategyBreakdown)[]) {
    sumStrategyPredictions += report.strategyBreakdown[s].predictedCount;
    assert.ok(report.strategyBreakdown[s].accuracyRate >= 0 && report.strategyBreakdown[s].accuracyRate <= 1);
  }

  assert.equal(sumStrategyPredictions, 1350);
});
