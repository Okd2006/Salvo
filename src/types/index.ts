/**
 * Salvo — Shared Type Definitions
 *
 * These interfaces form the strict contract between the three backend components:
 *   1. Diagnose & Plan  (src/agents/diagnosePlan.ts)   — Gemini-powered
 *   2. Policy Gate      (src/agents/policyGate.ts)     — deterministic code
 *   3. Execute          (src/agents/execute.ts)        — Razorpay API calls
 *
 * RULE: Financial calculations are NEVER derived from LLM prose.
 *       All monetary values are computed by deterministic application code.
 */

// ─────────────────────────────────────────────────────────────
// Transaction
// ─────────────────────────────────────────────────────────────

export type TransactionStatus =
  | 'failed'
  | 'abandoned'
  | 'captured'
  | 'authorized'
  | 'refunded';

export type PaymentMethod =
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'wallet'
  | 'emi'
  | 'cod'
  | 'unknown';

export interface Transaction {
  /** Razorpay payment ID, e.g. pay_XXXXXXXXXXXXX */
  id: string;
  /** Order ID the payment belongs to */
  orderId: string;
  /** Amount in paise (INR × 100) */
  amountPaise: number;
  currency: string;
  status: TransactionStatus;
  method: PaymentMethod;
  /** Razorpay error code, e.g. BAD_REQUEST_ERROR */
  errorCode: string | null;
  /** Human-readable error description from Razorpay */
  errorDescription: string | null;
  /** Razorpay internal error reason */
  errorReason: string | null;
  /** Issuing bank / VPA / wallet provider */
  bank: string | null;
  /** Customer email */
  email: string | null;
  /** Customer contact number */
  contact: string | null;
  /** Unix timestamp of payment creation */
  createdAt: number;
  /** Unix timestamp of last status update */
  updatedAt: number;
  /** Raw Razorpay metadata (arbitrary JSON) */
  metadata: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// Customer History  (input to Diagnose & Plan)
// ─────────────────────────────────────────────────────────────

export interface CustomerHistory {
  customerId: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  /** Historical retry success rate 0–1, computed deterministically */
  retrySuccessRate: number;
  preferredMethod: PaymentMethod;
  averageTransactionPaise: number;
}

// ─────────────────────────────────────────────────────────────
// Diagnosis Result  (Gemini structured output — validated before Policy Gate)
// ─────────────────────────────────────────────────────────────

/**
 * Nature of the failure — used by Policy Gate for hard rules.
 *
 * temporary          → transient network/bank issue; retry is viable
 * customer           → user-caused (abandoned, insufficient funds); engagement needed
 * payment_method     → method-specific issue; switch may work
 * unrecoverable      → fraud block, permanent decline; no automated action
 */
export type FailureType = 'temporary' | 'customer' | 'payment_method' | 'unrecoverable';

/**
 * The recovery strategy recommended by Gemini.
 * The Policy Gate decides whether this is permitted.
 */
export type RecommendedStrategy =
  | 'smart_retry'
  | 'payment_method_switch'
  | 'payment_link'
  | 'reminder'
  | 'no_action';

/**
 * Structured output from Gemini's Diagnose & Plan stage.
 *
 * IMPORTANT: `predictedRecovery` is a PROBABILITY from Gemini (0–1).
 * Actual INR recovery amounts are computed deterministically in application code
 * by multiplying this probability × transaction.amountPaise.
 *
 * Never render `predictedRecovery` as a currency amount directly.
 */
export interface GeminiDiagnosisPayload {
  failureType: FailureType;
  /** Gemini's estimate of recoverability 0–1 */
  recoverability: number;
  recommendedStrategy: RecommendedStrategy;
  /** Confidence in the diagnosis 0–1 */
  confidence: number;
  /** Specific evidence supporting the diagnosis (max 5 items) */
  evidence: string[];
  /**
   * Probability 0–1 that the recovery strategy will succeed.
   * NOT an INR amount — application code computes expected INR.
   */
  predictedRecovery: number;
}

/**
 * Full DiagnosisResult after Gemini output is validated and enriched
 * with deterministically-computed financial projections.
 */
export interface DiagnosisResult {
  transactionId: string;
  /** Validated Gemini structured output */
  geminiPayload: GeminiDiagnosisPayload;
  /**
   * Merchant-facing explanation from Gemini.
   * PRESENTATION ONLY — never used for financial calculations.
   */
  merchantNarrative: string;
  /**
   * Proposed recovery actions derived from recommendedStrategy.
   * Ordered by estimated success probability.
   */
  proposedActions: RecoveryAction[];
  /**
   * Expected recovery amount in paise.
   * DETERMINISTIC: amountPaise × geminiPayload.predictedRecovery
   * Computed by application code, not by Gemini.
   */
  expectedRecoveryPaise: number;
  diagnosedAt: string; // ISO-8601
}

// Legacy alias kept for Policy Gate compatibility during migration
export type FailureCategory =
  | 'insufficient_funds'
  | 'card_declined'
  | 'network_timeout'
  | 'authentication_failure'
  | 'user_abandoned'
  | 'bank_downtime'
  | 'invalid_details'
  | 'fraud_block'
  | 'unknown';

// ─────────────────────────────────────────────────────────────
// Recovery Action
// ─────────────────────────────────────────────────────────────

export type ActionType =
  | 'retry_payment'
  | 'send_payment_link'
  | 'change_payment_method'
  | 'partial_refund_then_retry'
  | 'notify_customer'
  | 'flag_for_manual_review';

export interface RecoveryAction {
  type: ActionType;
  /** Human-readable rationale for proposing this action */
  rationale: string;
  /** Parameters consumed by the Execute layer */
  params: Record<string, unknown>;
  /** Estimated probability this action leads to successful payment (0–1) */
  estimatedSuccessProbability: number;
}

// ─────────────────────────────────────────────────────────────
// Policy Result  (output of the deterministic Policy Gate)
// ─────────────────────────────────────────────────────────────

export type PolicyVerdict = 'approved' | 'blocked' | 'needs_review';

export interface PolicyResult {
  transactionId: string;
  action: RecoveryAction;
  verdict: PolicyVerdict;
  /** Policy rule(s) that produced this verdict */
  triggeredRules: string[];
  /** Human-readable explanation of the gate decision */
  explanation: string;
  evaluatedAt: string; // ISO-8601
}

// ─────────────────────────────────────────────────────────────
// Audit Event
// ─────────────────────────────────────────────────────────────

export type AuditEventType =
  | 'diagnosis_completed'
  | 'policy_evaluated'
  | 'action_approved'
  | 'action_blocked'
  | 'action_executed'
  | 'action_failed'
  | 'recovery_successful'
  | 'manual_review_flagged';

export interface AuditEvent {
  id: string; // UUID
  transactionId: string;
  eventType: AuditEventType;
  /** Snapshot of the relevant data at the time of the event */
  payload: Record<string, unknown>;
  /** Razorpay API response if this event involved an API call */
  razorpayResponse?: Record<string, unknown>;
  createdAt: string; // ISO-8601
}

// ─────────────────────────────────────────────────────────────
// Evaluation (used by scripts/evaluate.ts)
// ─────────────────────────────────────────────────────────────

export interface EvaluationResult {
  totalTransactions: number;
  diagnosisAttempted: number;
  recoveryActionsProposed: number;
  actionsApprovedByGate: number;
  actionsBlocked: number;
  actionsExecuted: number;
  successfulRecoveries: number;
  /** Recovered amount in paise — deterministic computation */
  totalRecoveredPaise: number;
  recoveryRatePercent: number;
  evaluatedAt: string; // ISO-8601
}
