/**
 * src/services/razorpayService.ts
 *
 * Salvo Razorpay Technology Partner Integration & Revenue Analytics Engine
 */
import crypto from 'node:crypto';
import { URLSearchParams } from 'node:url';
import type { Transaction } from '../types/index.js';

export interface RevenueMetricsResult {
  period: 'today' | '7d' | '30d' | '90d' | 'all';
  grossCollectedPaise: number;
  refundedAmountPaise: number;
  netCollectedPaise: number;
  totalAttemptsCount: number;
  successfulCount: number;
  failedCount: number;
  failureRate: number;
  averagePaymentPaise: number;
  failedPaymentValuePaise: number;
  recoverableOpportunityPaise: number;
  recoveredValuePaise: number;
  recoveryRate: number;
  lastSynchronizedAt: string;
}

export function isRazorpayOAuthConfigured(): boolean {
  const clientId = process.env.RAZORPAY_OAUTH_CLIENT_ID;
  const clientSecret = process.env.RAZORPAY_OAUTH_CLIENT_SECRET;
  return Boolean(
    clientId &&
      clientSecret &&
      !clientId.includes('...') &&
      !clientSecret.includes('...')
  );
}

export function getRazorpayOAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.RAZORPAY_OAUTH_CLIENT_ID || 'rzp_partner_sandbox_app';
  const rootUrl = 'https://auth.razorpay.com/authorize';
  const options = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'read_write',
    state: state || 'salvo_rzp_state',
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export function verifyRazorpayWebhookSignature(
  bodyRaw: string,
  signature: string,
  secret?: string
): boolean {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return true;
  try {
    const expected = crypto.createHmac('sha256', webhookSecret).update(bodyRaw).digest('hex');
    return expected === signature;
  } catch {
    return false;
  }
}

export function filterPaymentsByPeriod(
  payments: Transaction[],
  period: 'today' | '7d' | '30d' | '90d' | 'all' = '30d'
): Transaction[] {
  if (period === 'all') return payments;

  const now = Date.now();
  let msLimit: number;
  switch (period) {
    case 'today':
      msLimit = 24 * 60 * 60 * 1000;
      break;
    case '7d':
      msLimit = 7 * 24 * 60 * 60 * 1000;
      break;
    case '90d':
      msLimit = 90 * 24 * 60 * 60 * 1000;
      break;
    case '30d':
    default:
      msLimit = 30 * 24 * 60 * 60 * 1000;
      break;
  }

  const thresholdIso = new Date(now - msLimit).toISOString();
  return payments.filter((p) => p.createdAt >= thresholdIso);
}

export function calculateRevenueMetrics(
  payments: Transaction[],
  period: 'today' | '7d' | '30d' | '90d' | 'all' = '30d',
  recoveredPaiseTotal: number = 0
): RevenueMetricsResult {
  const filtered = filterPaymentsByPeriod(payments, period);

  let grossCollectedPaise = 0;
  let refundedAmountPaise = 0;
  let successfulCount = 0;
  let failedCount = 0;
  let failedPaymentValuePaise = 0;
  let recoverableOpportunityPaise = 0;

  const recoverableErrorCodes = [
    'GATEWAY_TIMEOUT',
    'BAD_REQUEST_ERROR',
    'ISSUER_SWITCH_UNAVAILABLE',
    'BANK_NETWORK_DOWN',
    'TEMPORARY_NETWORK_FAILURE',
    'PAYMENT_TIMED_OUT',
    'INSUFFICIENT_FUNDS',
    'CARD_INACTIVE',
  ];

  for (const p of filtered) {
    if (p.status === 'captured' || p.status === 'authorized') {
      grossCollectedPaise += p.amountPaise;
      successfulCount++;
    } else if (p.status === 'failed') {
      failedCount++;
      failedPaymentValuePaise += p.amountPaise;

      const isEligibleForRecovery =
        p.recoverable ||
        recoverableErrorCodes.includes(p.failureCode || '') ||
        p.failureCategory === 'temporary_network_failure' ||
        p.failureCategory === 'bank_decline' ||
        p.failureCategory === 'payment_method_issue';

      if (isEligibleForRecovery) {
        recoverableOpportunityPaise += p.amountPaise;
      }
    } else if (p.status === 'refunded') {
      refundedAmountPaise += p.amountPaise;
    }
  }

  const totalAttemptsCount = filtered.length;
  const netCollectedPaise = Math.max(0, grossCollectedPaise - refundedAmountPaise);
  const failureRate = totalAttemptsCount > 0 ? failedCount / totalAttemptsCount : 0;
  const averagePaymentPaise =
    successfulCount > 0 ? Math.round(grossCollectedPaise / successfulCount) : 0;

  const recoveryRate =
    recoverableOpportunityPaise > 0
      ? Math.min(1.0, recoveredPaiseTotal / recoverableOpportunityPaise)
      : 0;

  return {
    period,
    grossCollectedPaise,
    refundedAmountPaise,
    netCollectedPaise,
    totalAttemptsCount,
    successfulCount,
    failedCount,
    failureRate,
    averagePaymentPaise,
    failedPaymentValuePaise,
    recoverableOpportunityPaise,
    recoveredValuePaise: recoveredPaiseTotal,
    recoveryRate,
    lastSynchronizedAt: new Date().toISOString(),
  };
}
