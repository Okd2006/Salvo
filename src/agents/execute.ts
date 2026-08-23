/**
 * Agent 3: Execute
 *
 * Responsibilities:
 *  1. Accept a Policy Gate-approved RecoveryAction
 *  2. Execute the corresponding Razorpay API call
 *  3. Emit a typed AuditEvent recording the outcome
 *
 * INVARIANT: Execute NEVER receives an action that has not been
 *            explicitly approved (verdict === 'approved') by the Policy Gate.
 *            Callers MUST enforce this before calling executeAction().
 *
 * Supported action types (Phase 0 skeletons — real API calls in Phase 1):
 *   - retry_payment          → Payment link fallback until Phase 1
 *   - send_payment_link      → razorpay.paymentLink.create(...)
 *   - change_payment_method  → Advisory only; triggers customer notification
 *   - notify_customer        → Notification stub (Phase 1)
 *   - flag_for_manual_review → Write audit record; no API call
 */

import { randomUUID } from 'crypto';
import { createPaymentLink } from '../lib/razorpay.js';
import type {
  Transaction,
  RecoveryAction,
  PolicyResult,
  AuditEvent,
  AuditEventType,
} from '../types/index.js';

// ─── Execution Result ─────────────────────────────────────────────────────────

export interface ExecutionResult {
  success: boolean;
  auditEvent: AuditEvent;
  /** The Razorpay resource created/used, if any */
  razorpayPayload?: Record<string, unknown>;
  error?: string;
}

// ─── Action Handlers ──────────────────────────────────────────────────────────

async function handleSendPaymentLink(
  transaction: Transaction,
  action: RecoveryAction,
): Promise<{ razorpayPayload: Record<string, unknown> }> {
  // Build params object — only include optional fields when they have actual values
  // (required by exactOptionalPropertyTypes: true)
  const linkParams: Parameters<typeof createPaymentLink>[0] = {
    amountPaise: transaction.amountPaise,
    currency: transaction.currency,
    description: `Recovery payment for order ${transaction.orderId || transaction.transactionId}`,
  };
  if (transaction.orderId) linkParams.orderId = transaction.orderId;
  if (transaction.email) linkParams.customerEmail = transaction.email;
  if (transaction.contact) linkParams.customerContact = transaction.contact;

  const link = await createPaymentLink(linkParams);

  return {
    razorpayPayload: {
      paymentLinkId: link.id,
      shortUrl: link.shortUrl,
      actionParams: action.params,
    },
  };
}

async function handleRetryPayment(
  transaction: Transaction,
  _action: RecoveryAction,
): Promise<{ razorpayPayload: Record<string, unknown> }> {
  // Phase 1: Implement Razorpay automatic retry via their API.
  // For now, fall back to a payment link as the safest retry mechanism.
  console.warn(
    `[execute] retry_payment for ${transaction.id} — falling back to payment link (Phase 1 will implement direct retry)`,
  );

  const linkParams: Parameters<typeof createPaymentLink>[0] = {
    amountPaise: transaction.amountPaise,
    currency: transaction.currency,
    description: `Retry payment for order ${transaction.orderId || transaction.transactionId}`,
  };
  if (transaction.orderId) linkParams.orderId = transaction.orderId;
  if (transaction.email) linkParams.customerEmail = transaction.email;
  if (transaction.contact) linkParams.customerContact = transaction.contact;

  const link = await createPaymentLink(linkParams);
  return {
    razorpayPayload: { paymentLinkId: link.id, shortUrl: link.shortUrl, isFallback: true },
  };
}

async function handleNotifyCustomer(
  transaction: Transaction,
  action: RecoveryAction,
): Promise<{ razorpayPayload: Record<string, unknown> }> {
  // Phase 1: Integrate with email/SMS provider
  console.warn(
    `[execute] notify_customer for ${transaction.id} — notification provider not yet wired (Phase 1)`,
  );
  return {
    razorpayPayload: {
      notificationType: action.params['notificationType'] ?? 'email',
      recipient: transaction.email ?? transaction.contact ?? 'unknown',
      status: 'queued_phase1',
    },
  };
}

async function handleFlagForManualReview(
  transaction: Transaction,
  action: RecoveryAction,
): Promise<{ razorpayPayload: Record<string, unknown> }> {
  // Write audit record only; no external API call
  return {
    razorpayPayload: {
      flaggedTransactionId: transaction.id,
      reason: action.rationale,
      requiresHumanAction: true,
    },
  };
}

// ─── Dispatch Map ─────────────────────────────────────────────────────────────

type ActionHandler = (
  tx: Transaction,
  action: RecoveryAction,
) => Promise<{ razorpayPayload: Record<string, unknown> }>;

const ACTION_HANDLERS: Partial<Record<RecoveryAction['type'], ActionHandler>> = {
  retry_payment: handleRetryPayment,
  send_payment_link: handleSendPaymentLink,
  change_payment_method: handleNotifyCustomer, // advisory — notify only
  notify_customer: handleNotifyCustomer,
  flag_for_manual_review: handleFlagForManualReview,
};

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Execute a Policy Gate-approved action against the Razorpay API.
 *
 * @param transaction  The original failed transaction
 * @param action       The approved RecoveryAction
 * @param policyResult The PolicyResult confirming approval (used for audit)
 */
export async function executeAction(
  transaction: Transaction,
  action: RecoveryAction,
  policyResult: PolicyResult,
): Promise<ExecutionResult> {
  const txnId = transaction.transactionId || transaction.id || '';

  // Guard: never execute an unapproved action
  if (!policyResult.allowed || policyResult.verdict !== 'approved') {
    const auditEvent = makeAuditEvent(txnId, 'action_blocked', {
      action,
      policyResult,
      reason: 'Called executeAction with a non-approved PolicyResult',
    });
    return {
      success: false,
      auditEvent,
      error: `Cannot execute action with verdict "${policyResult.verdict || 'blocked'}". Only "approved" actions may be executed.`,
    };
  }

  const handler = ACTION_HANDLERS[action.type];
  if (!handler) {
    const auditEvent = makeAuditEvent(txnId, 'action_failed', {
      action,
      reason: `No handler registered for action type: ${action.type}`,
    });
    return {
      success: false,
      auditEvent,
      error: `Unsupported action type: ${action.type}`,
    };
  }

  try {
    const { razorpayPayload } = await handler(transaction, action);

    const eventType: AuditEventType =
      action.type === 'flag_for_manual_review' ? 'manual_review_flagged' : 'action_executed';

    const auditEvent = makeAuditEvent(
      txnId,
      eventType,
      { action, policyResult },
      razorpayPayload,
    );

    return { success: true, auditEvent, razorpayPayload };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const auditEvent = makeAuditEvent(txnId, 'action_failed', {
      action,
      policyResult,
      error,
    });
    return { success: false, auditEvent, error };
  }
}

// ─── Audit Helper ─────────────────────────────────────────────────────────────

function makeAuditEvent(
  transactionId: string,
  eventType: AuditEventType,
  payload: Record<string, unknown>,
  razorpayResponse?: Record<string, unknown>,
): AuditEvent {
  const eventId = randomUUID();
  const timestamp = new Date().toISOString();
  const event: AuditEvent = {
    eventId,
    id: eventId,
    transactionId,
    eventType,
    actor: 'razorpay_executor',
    details: payload,
    payload,
    timestamp,
    createdAt: timestamp,
  };
  if (razorpayResponse !== undefined) {
    event.razorpayResponse = razorpayResponse;
  }
  return event;
}
