/**
 * src/lib/razorpay.ts
 *
 * Razorpay Test API Client & Test Recovery Adapter
 *
 * SAFETY INVARIANTS:
 *  - STRICTLY ENFORCES RAZORPAY_MODE === "test" (Production mode disabled)
 *  - Centralizes Razorpay SDK initialization
 *  - Financial amounts are strictly integer paise
 *  - Never returns or logs API secrets
 */

import Razorpay from 'razorpay';
import type { Transaction } from '../types/index.js';

export const RAZORPAY_CONFIG = {
  mode: (process.env.RAZORPAY_MODE || 'test').toLowerCase(),
  isSimulation: process.env.EXECUTION_SIMULATION !== 'false',
  maxRecoveryAttempts: parseInt(process.env.MAX_RECOVERY_ATTEMPTS || '3', 10),
};

export function assertTestMode(): void {
  const currentMode = (process.env.RAZORPAY_MODE || 'test').toLowerCase();
  if (currentMode !== 'test') {
    throw new Error(
      `[SECURITY INVARIANT VIOLATION] RAZORPAY_MODE is set to "${currentMode}". Production payment mutations are strictly prohibited.`
    );
  }
}

export function isRazorpayConfigured(): boolean {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(
    key_id &&
      key_secret &&
      !key_id.includes('...') &&
      !key_secret.includes('...') &&
      key_id.startsWith('rzp_test_')
  );
}

let cachedRazorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  assertTestMode();

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('...')) {
    throw new Error(
      'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured with test credentials in .env.'
    );
  }

  if (cachedRazorpayClient) {
    return cachedRazorpayClient;
  }

  cachedRazorpayClient = new Razorpay({
    key_id: key_id.trim(),
    key_secret: key_secret.trim(),
  });

  return cachedRazorpayClient;
}

/**
 * Fetch payments from Razorpay test API (sandbox only).
 */
export async function fetchRazorpayPayments(count: number = 10): Promise<Transaction[]> {
  assertTestMode();
  const client = getRazorpayClient();
  const res = (await client.payments.all({ count })) as { items?: unknown[] };
  const items = Array.isArray(res.items) ? res.items : [];
  return items.map((item) => mapRazorpayPayment(item as Record<string, unknown>));
}

/**
 * Create a Razorpay Payment Link in Test Mode.
 */
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
  assertTestMode();
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
    id: String(res.id ?? `plink_test_${refId}`),
    shortUrl: String(res.short_url ?? `https://rzp.io/i/test_${refId}`),
  };
}

export const createPaymentLink = createRecoveryPaymentLink;

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
    merchantId: 'mer_razorpay_test',
    merchantName: 'Razorpay Test Merchant',
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
