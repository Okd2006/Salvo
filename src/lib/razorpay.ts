/**
 * Razorpay Client & Helpers
 *
 * Wraps the official Razorpay SDK and exposes typed helpers
 * for the operations Salvo needs:
 *
 *   - Fetching failed / abandoned payments
 *   - Creating payment links for re-engagement
 *   - Fetching order details
 *
 * All calls use Test Mode credentials (RAZORPAY_KEY_ID starting with rzp_test_).
 * Live Mode keys will be explicitly rejected at startup.
 */

import 'dotenv/config';
import Razorpay from 'razorpay';
import type { Transaction } from '../types/index.js';

// ─── Client ───────────────────────────────────────────────────────────────────

function createRazorpayClient(): Razorpay {
  const keyId = process.env['RAZORPAY_KEY_ID'];
  const keySecret = process.env['RAZORPAY_KEY_SECRET'];

  if (!keyId || !keySecret) {
    throw new Error(
      'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set. Copy .env.example to .env.',
    );
  }

  if (!keyId.startsWith('rzp_test_')) {
    throw new Error(
      'Salvo only operates in Razorpay TEST MODE. ' +
        'Your RAZORPAY_KEY_ID does not start with "rzp_test_". ' +
        'Do not use live credentials during development.',
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

let _razorpay: Razorpay | null = null;
export function getRazorpayClient(): Razorpay {
  if (!_razorpay) {
    _razorpay = createRazorpayClient();
  }
  return _razorpay;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single payment from Razorpay and map it to our Transaction interface.
 */
export async function fetchPayment(paymentId: string): Promise<Transaction> {
  const rzp = getRazorpayClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payment = await (rzp.payments.fetch(paymentId) as Promise<any>);

  return mapRazorpayPayment(payment);
}

/**
 * List payments with optional filters. Returns up to `count` payments.
 */
export async function listPayments(
  options: { from?: number; to?: number; count?: number } = {},
): Promise<Transaction[]> {
  const rzp = getRazorpayClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (rzp.payments.all(options) as Promise<any>);
   
  const items: unknown[] = Array.isArray(result?.items) ? result.items : [];
  return items.map(mapRazorpayPayment);
}

/**
 * Create a Razorpay Payment Link for customer re-engagement.
 * Returns the short URL.
 */
export async function createPaymentLink(params: {
  amountPaise: number;
  currency: string;
  description: string;
  customerEmail?: string;
  customerContact?: string;
  orderId?: string;
}): Promise<{ id: string; shortUrl: string }> {
  const rzp = getRazorpayClient();

  // Build a plain object with only the fields Razorpay needs.
  // Cast through `unknown` then to the SDK's expected union type to avoid
  // the strict overload mismatch while keeping our own params typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {
    amount: params.amountPaise,
    currency: params.currency,
    description: params.description,
    callback_method: 'get',
  };

  if (params.customerEmail !== undefined || params.customerContact !== undefined) {
    payload.customer = {
      email: params.customerEmail,
      contact: params.customerContact,
    };
  }

  if (params.orderId !== undefined) {
    payload.reference_id = params.orderId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const link = await (rzp.paymentLink.create(payload) as Promise<any>);

  return {
    id: String(link.id ?? ''),
    shortUrl: String(link.short_url ?? ''),
  };
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRazorpayPayment(p: any): Transaction {
  // Capture metadata before narrowing — safe cast from any
   
  const metadata: Record<string, unknown> =
    p !== null && typeof p === 'object' ? (p as Record<string, unknown>) : {};

  return {
    id: String(p.id ?? ''),
    orderId: String(p.order_id ?? ''),
    amountPaise: Number(p.amount ?? 0),
    currency: String(p.currency ?? 'INR'),
    status: p.status ?? 'failed',
    method: p.method ?? 'unknown',
    errorCode: p.error_code ?? null,
    errorDescription: p.error_description ?? null,
    errorReason: p.error_reason ?? null,
    bank: p.bank ?? p.vpa ?? p.wallet ?? null,
    email: p.email ?? null,
    contact: p.contact ?? null,
    createdAt: Number(p.created_at ?? 0),
    updatedAt: Number(p.created_at ?? 0),
    metadata,
  };
}
