/**
 * Salvo — Shared Type Definitions & Schemas
 *
 * Single source of truth for:
 *   1. Transaction, Customer History, Failure Categories
 *   2. Recovery Strategies & Ground Truth (Evaluation only)
 *   3. Observable Transaction DTO (Ground-Truth Protection Boundary)
 *   4. RecoveryRecommendation & Gemini AI Contracts
 *   5. Deterministic Policy Gate & PolicyResult Schemas
 *   6. MongoDB Collections: transactions, recovery_actions, audit_logs
 *   7. Evaluation Engine Contracts
 *
 * RULES:
 *  - Financial calculations are ALWAYS in integer paise (1 INR = 100 paise)
 *  - No floating point arithmetic for financial sums
 *  - Ground truth fields exist strictly for evaluation and are never sent to AI
 */

// ─────────────────────────────────────────────────────────────
// 1. Transaction & Domain Primitives
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
  | 'emi';

export type FailureCategory =
  | 'temporary_network_failure'
  | 'bank_decline'
  | 'insufficient_funds'
  | 'authentication_failure'
  | 'payment_method_issue'
  | 'customer_abandonment'
  | 'expired_payment'
  | 'suspected_risk'
  | 'unrecoverable';

export type RecoveryStrategy =
  | 'smart_retry'
  | 'payment_method_switch'
  | 'payment_link'
  | 'reminder'
  | 'no_action';

export type DiagnosisFailureType =
  | 'temporary'
  | 'customer'
  | 'payment_method'
  | 'risk'
  | 'unrecoverable';

// Alias for Gemini module compatibility
export type RecommendedStrategy = RecoveryStrategy;
export type FailureType = DiagnosisFailureType;

// ─────────────────────────────────────────────────────────────
// 2. Customer Profile & History
// ─────────────────────────────────────────────────────────────

export interface CustomerHistory {
  customerId: string;
  previousPayments: number;
  successfulPayments: number;
  previousFailures: number;
  /** Historical retry success rate 0–1, computed deterministically */
  retrySuccessRate: number;
  preferredMethod: PaymentMethod;
  averageTransactionPaise: number;
  accountAgeDays?: number;

  // Compatibility aliases
  totalTransactions?: number;
  successfulTransactions?: number;
  failedTransactions?: number;
}

// ─────────────────────────────────────────────────────────────
// 3. Ground Truth (HIDDEN / EVALUATION ONLY)
// ─────────────────────────────────────────────────────────────

/**
 * Ground truth represents the actual deterministic reality of a transaction.
 * It is used EXCLUSIVELY by the evaluation engine.
 * Never expose groundTruth to Gemini prompt contexts or public client endpoints.
 */
export interface GroundTruth {
  /** True if the transaction is genuinely recoverable under optimal intervention */
  recoverable: boolean;
  /** The single optimal recovery strategy */
  optimalStrategy: RecoveryStrategy;
  /** Expected recoverable yield in integer paise */
  expectedRecoveryPaise: number;
  /** True if safety policy permits automated recovery intervention */
  shouldIntervene: boolean;
  /** Baseline intervention cost in integer paise */
  interventionCostPaise: number;
  /** Risk classification score 0–1 */
  riskScore: number;
}

// ─────────────────────────────────────────────────────────────
// 4. Observable Transaction DTO (Observation Boundary)
// ─────────────────────────────────────────────────────────────

/**
 * Strictly sanitized transaction observation.
 * This is the ONLY object allowed to enter the Gemini prompt context.
 * Excludes all groundTruth and hidden evaluation fields.
 */
export interface ObservableCustomerHistory {
  customerId: string;
  previousPayments: number;
  successfulPayments: number;
  previousFailures: number;
  retrySuccessRate: number;
  preferredMethod: PaymentMethod;
  averageTransactionPaise: number;
  accountAgeDays?: number;
}

export interface ObservableTransaction {
  transactionId: string;
  amountPaise: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  failureCode: string;
  failureCategory: FailureCategory;
  failureDescription?: string;
  createdAt: string;
  customerHistory: ObservableCustomerHistory;
  retryCount: number;
  merchantName?: string;
  merchantCategory?: string;
}

// ─────────────────────────────────────────────────────────────
// 5. Recovery Recommendation (Gemini Output)
// ─────────────────────────────────────────────────────────────

export interface RecoveryRecommendation {
  transactionId: string;
  failureType: DiagnosisFailureType;
  /** Recoverability estimate 0–1 */
  recoverability: number;
  recommendedStrategy: RecoveryStrategy;
  /** Confidence score 0–1 */
  confidence: number;
  /** Minimum 1 supporting evidence item */
  evidence: string[];
  /** Merchant-facing concise explanation */
  reasoning: string;
  /** Integer paise (0 <= predictedRecoveryPaise <= transaction.amountPaise) */
  predictedRecoveryPaise: number;
  /** Integer paise (>= 0) */
  recommendedInterventionCostPaise: number;
}

// ─────────────────────────────────────────────────────────────
// 6. Deterministic Policy Gate Schemas (Phase 3)
// ─────────────────────────────────────────────────────────────

export type PolicyReasonCode =
  | 'ALLOWED'
  | 'RISK_BLOCK'
  | 'UNRECOVERABLE_BLOCK'
  | 'CONFIDENCE_TOO_LOW'
  | 'RETRY_LIMIT_EXCEEDED'
  | 'CONTACT_LIMIT_EXCEEDED'
  | 'AMOUNT_THRESHOLD_EXCEEDED'
  | 'STRATEGY_NOT_PERMITTED'
  | 'NEGATIVE_EXPECTED_VALUE'
  | 'INVALID_RECOVERY_AMOUNT';

export interface PolicyCheck {
  name: string;
  passed: boolean;
  reason: string;
}

export interface PolicyResult {
  allowed: boolean;
  reasonCode: PolicyReasonCode;
  reason: string;
  checks: PolicyCheck[];
  evaluatedAt: string; // ISO-8601

  // Compatibility aliases for execution and legacy agent compatibility
  transactionId?: string;
  action?: RecoveryAction;
  verdict?: PolicyVerdict;
  triggeredRules?: string[];
  explanation?: string;
}

// ─────────────────────────────────────────────────────────────
// 7. Simulation / Execution Trace
// ─────────────────────────────────────────────────────────────

export type PolicyVerdict = 'approved' | 'blocked' | 'needs_review' | 'pending';
export type ExecutionStatus = 'recovered' | 'failed' | 'blocked' | 'queued' | 'not_attempted' | 'not_executed';

export interface SimulationTrace {
  predictedStrategy: RecoveryStrategy;
  confidence: number;
  predictedRecoveryPaise: number;
  interventionCostPaise: number;
  policyVerdict: PolicyVerdict;
  executionStatus: ExecutionStatus;
  actualRecoveryPaise: number;
  executedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// 8. MongoDB Collections & Documents
// ─────────────────────────────────────────────────────────────

/**
 * Primary document in `transactions` collection.
 */
export interface TransactionDocument {
  transactionId: string;
  merchantId: string;
  merchantName: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  /** Integer paise (1 INR = 100 paise) */
  amountPaise: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  failureCode: string;
  failureDescription: string;
  failureCategory: FailureCategory;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  customerHistory: CustomerHistory;
  retryCount: number;
  /** Derived top-level indicator */
  recoverable: boolean;
  /** Evaluation-only ground truth — isolated from production prompts */
  groundTruth: GroundTruth;
  /** Baseline simulation output */
  simulation: SimulationTrace;

  // Compatibility aliases for existing backend modules
  id?: string;
  orderId?: string;
  method?: PaymentMethod;
  errorCode?: string | null;
  errorDescription?: string | null;
  errorReason?: string | null;
  bank?: string | null;
  email?: string | null;
  contact?: string | null;
  metadata?: Record<string, unknown>;
}

export type Transaction = TransactionDocument;

/**
 * Document in `recovery_actions` collection.
 */
export interface RecoveryActionDocument {
  actionId: string;
  transactionId: string;
  strategy: RecoveryStrategy;
  predictedRecoveryPaise: number;
  actualRecoveryPaise: number;
  interventionCostPaise: number;
  confidence: number;
  policyStatus: PolicyVerdict;
  executionStatus: ExecutionStatus;
  evidence?: string[];
  reasoning?: string;
  diagnosis?: Partial<RecoveryRecommendation>;
  policyResult?: PolicyResult;
  createdAt: string;
  executedAt: string | null;
}

export type ActionType =
  | 'retry_payment'
  | 'send_payment_link'
  | 'change_payment_method'
  | 'partial_refund_then_retry'
  | 'notify_customer'
  | 'flag_for_manual_review';

export interface RecoveryAction {
  type: ActionType;
  rationale: string;
  params: Record<string, unknown>;
  estimatedSuccessProbability: number;
}

/**
 * Document in `audit_logs` collection.
 */
export type AuditEventType =
  | 'transaction_created'
  | 'diagnosis_created'
  | 'diagnosis_completed'
  | 'recovery_recommended'
  | 'policy_checked'
  | 'policy_evaluated'
  | 'action_approved'
  | 'action_executed'
  | 'action_blocked'
  | 'action_failed'
  | 'execution_failed'
  | 'fallback_selected'
  | 'recovery_completed'
  | 'recovery_successful'
  | 'manual_review_flagged';

export interface AuditLogDocument {
  eventId: string;
  transactionId: string;
  eventType: AuditEventType;
  actor: 'system' | 'gemini_agent' | 'policy_gate' | 'razorpay_executor';
  details: Record<string, unknown>;
  timestamp: string; // ISO-8601

  // Compatibility aliases
  id?: string;
  payload?: Record<string, unknown>;
  razorpayResponse?: Record<string, unknown>;
  createdAt?: string;
}

export type AuditEvent = AuditLogDocument;

// ─────────────────────────────────────────────────────────────
// 9. Legacy Gemini Integration Contracts (Maintained for compatibility)
// ─────────────────────────────────────────────────────────────

export interface GeminiDiagnosisPayload {
  failureType: FailureType;
  recoverability: number;
  recommendedStrategy: RecommendedStrategy;
  confidence: number;
  evidence: string[];
  predictedRecovery: number;
}

export interface DiagnosisResult {
  transactionId: string;
  geminiPayload: GeminiDiagnosisPayload;
  merchantNarrative: string;
  proposedActions: RecoveryAction[];
  expectedRecoveryPaise: number;
  diagnosedAt: string;
}

// ─────────────────────────────────────────────────────────────
// 10. Evaluation Engine Contracts
// ─────────────────────────────────────────────────────────────

export interface StrategyPerformanceMetrics {
  strategy: RecoveryStrategy;
  predictedCount: number;
  groundTruthOptimalCount: number;
  correctPredictions: number;
  incorrectPredictions: number;
  recoveryAmountPaise: number;
  interventionCostPaise: number;
  netRecoveryPaise: number;
  accuracyRate: number;
}

export interface ConfusionMatrix {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface EvaluationReport {
  evaluatedAt: string;
  seed: string;
  totalTransactions: number;
  totalFailedRevenuePaise: number;
  totalActuallyRecoverablePaise: number;
  predictedRecoverableRevenuePaise: number;
  actualRecoveryPaise: number;
  interventionCostPaise: number;
  netRecoveryPaise: number;
  recoveryYieldPercent: number;
  confusionMatrix: ConfusionMatrix;
  policyBlockedCount: number;
  successfulRecoveriesCount: number;
  failedRecoveryAttemptsCount: number;
  unattemptedCount: number;
  strategyBreakdown: Record<RecoveryStrategy, StrategyPerformanceMetrics>;
}

export type EvaluationResult = EvaluationReport;

// ─────────────────────────────────────────────────────────────
// 11. AI Diagnosis Metrics (Phase 2 & 3 Evaluation)
// ─────────────────────────────────────────────────────────────

export interface AIDiagnosisMetrics {
  totalDiagnosed: number;
  strategyAgreementCount: number;
  strategyAgreementRate: number;
  classificationAgreementCount: number;
  classificationAgreementRate: number;
  averageConfidence: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalPredictedRecoveryPaise: number;
  totalGroundTruthRecoverablePaise: number;
  model: string;
  durationMs: number;
}
