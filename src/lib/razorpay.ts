/**
 * src/lib/razorpay.ts
 *
 * Razorpay API Client & Payment Helpers
 *
 * Rules:
 *  - Uses razorpay package for Razorpay Test API calls
 *  - Financial amounts are strictly integer paise
 *  - Never hardcode API keys
 */

import Razorpay from 'razorpay';
import type { Transaction } from '../types/index.js';

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('...')) {
    throw new Error(
      'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in .env.'
    );
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Fetch payments from Razorpay test API.
 */
export async function fetchRazorpayPayments(count: number = 10): Promise<Transaction[]> {
  const client = getRazorpayClient();
  const res = (await client.payments.all({ count })) as { items?: unknown[] };
  const items = Array.isArray(res.items) ? res.items : [];
  return items.map((item) => mapRazorpayPayment(item as Record<string, unknown>));
}

/**
 * Create a Razorpay Payment Link for recovery.
 */
export const createPaymentLink = createRecoveryPaymentLink;

export async function createRecoveryPaymentLink(params: {
  amountPaise: number;
  currency?: string;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  customerContact?: string;
  referenceId?: string;
  orderId?: string;
}): Promise<{ id: string; shortUrl: string }> {
  const client = getRazorpayClient();

  const refId = params.referenceId || params.orderId || `ref_${Date.now()}`;

  const payload: Record<string, unknown> = {
    amount: params.amountPaise,
    currency: params.currency || 'INR',
    description: params.description,
    reference_id: refId,
  };

  const email = params.customerEmail;
  const phone = params.customerPhone || params.customerContact;

  if (email || phone) {
    payload['customer'] = {
      ...(email ? { email } : {}),
      ...(phone ? { contact: phone } : {}),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (await client.paymentLink.create(payload as any)) as {
    id?: string;
    short_url?: string;
  };

  return {
    id: String(res.id ?? ''),
    shortUrl: String(res.short_url ?? ''),
  };
}

function mapRazorpayPayment(p: Record<string, unknown>): Transaction {
  const id = String(p['id'] ?? `txn_${Date.now()}`);
  const amountPaise = Number(p['amount'] ?? 0);
  const email = p['email'] ? String(p['email']) : 'customer@example.com';
  const contact = p['contact'] ? String(p['contact']) : '+919999999999';
  const createdAtIso = p['created_at']
    ? new Date(Number(p['created_at']) * 1000).toISOString()
    : new Date().toISOString();

  return {
    transactionId: id,
    id,
    orderId: String(p['order_id'] ?? ''),
    merchantId: 'mer_razorpay_live',
    merchantName: 'Razorpay Connected Merchant',
    customerId: `cust_${id.slice(-6)}`,
    customerEmail: email,
    customerPhone: contact,
    amountPaise,
    currency: String(p['currency'] ?? 'INR'),
    paymentMethod: 'card',
    method: 'card',
    status: (p['status'] as Transaction['status']) ?? 'failed',
    failureCode: String(p['error_code'] ?? 'UNKNOWN_ERROR'),
    errorCode: p['error_code'] ? String(p['error_code']) : null,
    failureDescription: String(p['error_description'] ?? 'Payment failed'),
    errorDescription: p['error_description'] ? String(p['error_description']) : null,
    errorReason: p['error_reason'] ? String(p['error_reason']) : null,
    failureCategory: 'temporary_network_failure',
    bank: p['bank'] ? String(p['bank']) : null,
    email,
    contact,
    createdAt: createdAtIso,
    updatedAt: createdAtIso,
    retryCount: 0,
    recoverable: true,
    customerHistory: {
      customerId: `cust_${id.slice(-6)}`,
      previousPayments: 1,
      successfulPayments: 1,
      previousFailures: 0,
      retrySuccessRate: 1.0,
      preferredMethod: 'card',
      averageTransactionPaise: amountPaise,
    },
    groundTruth: {
      recoverable: true,
      optimalStrategy: 'smart_retry',
      expectedRecoveryPaise: amountPaise,
      shouldIntervene: true,
      interventionCostPaise: 150,
      riskScore: 0.05,
    },
    simulation: {
      predictedStrategy: 'smart_retry',
      confidence: 0.9,
      predictedRecoveryPaise: amountPaise,
      interventionCostPaise: 150,
      policyVerdict: 'approved',
      executionStatus: 'queued',
      actualRecoveryPaise: 0,
    },
    metadata: p,
  };
}
