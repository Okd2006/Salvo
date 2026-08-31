/**
 * tests/real_auth_merchant.test.ts
 *
 * Real Google OAuth, Razorpay Technology Partner, Revenue Intelligence,
 * and Webhook Security Tests for Salvo.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { getGoogleOAuthUrl, exchangeGoogleCodeForProfile } from '../src/lib/googleAuth.js';
import {
  getRazorpayOAuthUrl,
  calculateRevenueMetrics,
  verifyRazorpayWebhookSignature,
  filterPaymentsByPeriod,
} from '../src/services/razorpayService.js';
import type { Transaction } from '../src/types/index.js';

function makeMockTxn(partial: Partial<Transaction>): Transaction {
  return {
    id: 'pay_mock',
    transactionId: 'pay_mock',
    orderId: 'order_mock',
    merchantId: 'mer_test',
    merchantName: 'Test Merchant',
    customerId: 'cust_01',
    customerEmail: 'customer@example.com',
    customerPhone: '+919999999999',
    amountPaise: 500000,
    currency: 'INR',
    paymentMethod: 'card',
    method: 'card',
    status: 'captured',
    failureCode: 'NONE',
    errorCode: null,
    failureDescription: 'No failure',
    errorDescription: null,
    errorReason: null,
    failureCategory: 'temporary_network_failure',
    bank: 'HDFC',
    email: 'customer@example.com',
    contact: '+919999999999',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retryCount: 0,
    recoverable: false,
    customerHistory: {
      customerId: 'cust_01',
      previousPayments: 1,
      successfulPayments: 1,
      previousFailures: 0,
      retrySuccessRate: 1.0,
      preferredMethod: 'card',
      averageTransactionPaise: 500000,
    },
    groundTruth: {
      recoverable: true,
      optimalStrategy: 'smart_retry',
      expectedRecoveryPaise: 500000,
      shouldIntervene: true,
      interventionCostPaise: 150,
      riskScore: 0.05,
    },
    simulation: {
      predictedStrategy: 'smart_retry',
      confidence: 0.9,
      predictedRecoveryPaise: 500000,
      interventionCostPaise: 150,
      policyVerdict: 'approved',
      executionStatus: 'queued',
      actualRecoveryPaise: 0,
    },
    ...partial,
  };
}

test('1. Google OAuth: Generates compliant OAuth 2.0 authorization URL with openid scopes', () => {
  const redirectUri = 'https://salvorecovery.ai/auth/google/callback';
  const url = getGoogleOAuthUrl(redirectUri, 'custom_state_123');

  assert.ok(url.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
  assert.ok(url.includes('response_type=code'));
  assert.ok(url.includes('openid'));
  assert.ok(url.includes('userinfo.email'));
  assert.ok(url.includes('custom_state_123'));
});

test('2. Google OAuth: Sandbox code exchange returns verified profile structure', async () => {
  const profile = await exchangeGoogleCodeForProfile('mock_auth_code_99', 'http://localhost:3000/login');
  assert.ok(profile.googleSub);
  assert.ok(profile.email.includes('@'));
  assert.ok(profile.name);
});

test('3. Razorpay OAuth: Generates Technology Partner merchant authorization URL', () => {
  const redirectUri = 'https://salvorecovery.ai/auth/razorpay/callback';
  const url = getRazorpayOAuthUrl(redirectUri, 'rzp_state_456');

  assert.ok(url.startsWith('https://auth.razorpay.com/authorize'));
  assert.ok(url.includes('response_type=code'));
  assert.ok(url.includes('scope=read_write'));
  assert.ok(url.includes('rzp_state_456'));
});

test('4. Webhook Security: Validates valid Razorpay HMAC-SHA256 signatures and rejects spoofed payloads', () => {
  const secret = 'webhook_secret_salvo_2026';
  const payload = JSON.stringify({ event: 'payment.failed', payload: { payment: { entity: { id: 'pay_123' } } } });

  const validSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const invalidSig = 'deadbeef1234567890abcdef';

  assert.equal(verifyRazorpayWebhookSignature(payload, validSig, secret), true);
  assert.equal(verifyRazorpayWebhookSignature(payload, invalidSig, secret), false);
});

test('5. Revenue Intelligence: Accurately computes Gross, Net, Refunded, and Revenue at Risk from transactions', () => {
  const samplePayments: Transaction[] = [
    makeMockTxn({
      id: 'pay_01',
      transactionId: 'pay_01',
      amountPaise: 500000,
      status: 'captured',
      recoverable: false,
    }),
    makeMockTxn({
      id: 'pay_02',
      transactionId: 'pay_02',
      amountPaise: 300000,
      status: 'failed',
      failureCode: 'GATEWAY_TIMEOUT',
      failureCategory: 'temporary_network_failure',
      recoverable: true,
    }),
    makeMockTxn({
      id: 'pay_03',
      transactionId: 'pay_03',
      amountPaise: 1000000,
      status: 'failed',
      failureCode: 'FRAUD_SUSPECTED',
      failureCategory: 'suspected_risk',
      recoverable: false,
    }),
  ];

  const metrics = calculateRevenueMetrics(samplePayments, '30d', 300000);

  assert.equal(metrics.grossCollectedPaise, 500000);
  assert.equal(metrics.netCollectedPaise, 500000);
  assert.equal(metrics.successfulCount, 1);
  assert.equal(metrics.failedCount, 2);
  assert.equal(metrics.totalAttemptsCount, 3);
  assert.equal(metrics.recoverableOpportunityPaise, 300000);
  assert.equal(metrics.recoveredValuePaise, 300000);
  assert.equal(metrics.recoveryRate, 1.0);
});

test('6. Period Filtering: Correctly filters payments within today, 7d, 30d, 90d windows', () => {
  const now = Date.now();
  const payments: Transaction[] = [
    makeMockTxn({
      id: 'pay_recent',
      transactionId: 'pay_recent',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    }),
    makeMockTxn({
      id: 'pay_old',
      transactionId: 'pay_old',
      createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000).toISOString(),
    }),
  ];

  const todayFiltered = filterPaymentsByPeriod(payments, 'today');
  assert.equal(todayFiltered.length, 1);
  assert.equal(todayFiltered[0].id, 'pay_recent');

  const thirtyDaysFiltered = filterPaymentsByPeriod(payments, '30d');
  assert.equal(thirtyDaysFiltered.length, 1);

  const ninetyDaysFiltered = filterPaymentsByPeriod(payments, '90d');
  assert.equal(ninetyDaysFiltered.length, 2);
});
