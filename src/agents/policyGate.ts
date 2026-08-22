/**
 * Agent 2: Policy Gate  (DETERMINISTIC — ZERO LLM CALLS)
 *
 * The Policy Gate is the mandatory safety layer between Gemini-proposed
 * recovery actions and any real Razorpay execution.
 *
 * Architecture guarantee:
 *   Gemini → diagnosePlan → [ Policy Gate ] → execute
 *
 * The gate evaluates a validated GeminiDiagnosisPayload + RecoveryAction
 * against a set of named, deterministic rules. No randomness, no LLM calls.
 *
 * Rules:
 *  1. NO_ACTION_ON_UNRECOVERABLE — Block all automated actions on unrecoverable failures
 *  2. NO_RETRY_ON_PAYMENT_METHOD — Never raw-retry a payment_method failure without switching
 *  3. MAX_RETRY_AMOUNT           — Block retries above ₹50,000
 *  4. MIN_CONFIDENCE             — Flag for review if diagnosis confidence < 0.5
 *  5. MANUAL_REVIEW_HIGH_VALUE   — Route to manual review if > ₹25,000
 *  6. MAX_ATTEMPTS_PER_ORDER     — Block if order already has ≥ 3 recovery attempts
 *  7. LOW_RECOVERABILITY         — Block if recoverability score < 0.2
 *
 * Adding new rules: implement a named PolicyRule function, add to POLICY_RULES.
 */

import type {
  Transaction,
  DiagnosisResult,
  RecoveryAction,
  PolicyResult,
  PolicyVerdict,
} from '../types/index.js';

// ─── Rule Engine Types ────────────────────────────────────────────────────────

interface RuleContext {
  transaction: Transaction;
  diagnosis: DiagnosisResult;
  action: RecoveryAction;
  /** Number of prior recovery attempts on this order */
  priorAttempts: number;
}

interface RuleOutcome {
  triggered: boolean;
  verdict: PolicyVerdict;
  ruleName: string;
  explanation: string;
}

type PolicyRule = (ctx: RuleContext) => RuleOutcome;

// ─── Policy Constants ─────────────────────────────────────────────────────────

const MAX_RETRY_AMOUNT_PAISE = 5_000_00;       // ₹50,000
const MANUAL_REVIEW_THRESHOLD_PAISE = 2_500_00; // ₹25,000
const MIN_DIAGNOSIS_CONFIDENCE = 0.5;
const MAX_ATTEMPTS_PER_ORDER = 3;
const MIN_RECOVERABILITY = 0.2;

// ─── Individual Rules ─────────────────────────────────────────────────────────

/** Block ALL automated actions on unrecoverable failures (fraud, permanent declines) */
const ruleNoActionOnUnrecoverable: PolicyRule = ({ diagnosis, action }) => {
  const isUnrecoverable = diagnosis.geminiPayload.failureType === 'unrecoverable';
  const isAutomatedAction =
    action.type !== 'flag_for_manual_review' && action.type !== 'notify_customer';
  const triggered = isUnrecoverable && isAutomatedAction;
  return {
    triggered,
    verdict: 'blocked',
    ruleName: 'NO_ACTION_ON_UNRECOVERABLE',
    explanation:
      'Unrecoverable failure (fraud or permanent decline). No automated recovery action is permitted.',
  };
};

/** Never raw-retry a payment_method failure — the same method will fail again */
const ruleNoRetryOnPaymentMethodFailure: PolicyRule = ({ diagnosis, action }) => {
  const triggered =
    diagnosis.geminiPayload.failureType === 'payment_method' &&
    action.type === 'retry_payment';
  return {
    triggered,
    verdict: 'blocked',
    ruleName: 'NO_RETRY_ON_PAYMENT_METHOD',
    explanation:
      'Payment method failure cannot be resolved by retrying the same method. Switch method or use a payment link.',
  };
};

/** Hard cap on automated retry amount */
const ruleMaxRetryAmount: PolicyRule = ({ transaction, action }) => {
  const triggered =
    transaction.amountPaise > MAX_RETRY_AMOUNT_PAISE &&
    action.type === 'retry_payment';
  return {
    triggered,
    verdict: 'blocked',
    ruleName: 'MAX_RETRY_AMOUNT',
    explanation: `Automatic retry blocked: ₹${(transaction.amountPaise / 100).toFixed(2)} exceeds the ₹50,000 automated retry limit.`,
  };
};

/** Low confidence → flag for human review */
const ruleMinConfidence: PolicyRule = ({ diagnosis }) => {
  const triggered = diagnosis.geminiPayload.confidence < MIN_DIAGNOSIS_CONFIDENCE;
  return {
    triggered,
    verdict: 'needs_review',
    ruleName: 'MIN_CONFIDENCE',
    explanation: `Diagnosis confidence ${(diagnosis.geminiPayload.confidence * 100).toFixed(0)}% is below the 50% threshold. Flagging for manual review.`,
  };
};

/** High-value transactions require human sign-off */
const ruleManualReviewHighValue: PolicyRule = ({ transaction }) => {
  const triggered = transaction.amountPaise > MANUAL_REVIEW_THRESHOLD_PAISE;
  return {
    triggered,
    verdict: 'needs_review',
    ruleName: 'MANUAL_REVIEW_HIGH_VALUE',
    explanation: `Transaction ₹${(transaction.amountPaise / 100).toFixed(2)} exceeds ₹25,000. Routing to manual review for high-value safety.`,
  };
};

/** Prevent retry storms on a single order */
const ruleMaxAttemptsPerOrder: PolicyRule = ({ priorAttempts }) => {
  const triggered = priorAttempts >= MAX_ATTEMPTS_PER_ORDER;
  return {
    triggered,
    verdict: 'blocked',
    ruleName: 'MAX_ATTEMPTS_PER_ORDER',
    explanation: `Order has ${priorAttempts} prior recovery attempt(s). Maximum of ${MAX_ATTEMPTS_PER_ORDER} enforced to prevent retry storms.`,
  };
};

/** Don't waste resources on transactions Gemini deems unlikely to recover */
const ruleLowRecoverability: PolicyRule = ({ diagnosis, action }) => {
  const triggered =
    diagnosis.geminiPayload.recoverability < MIN_RECOVERABILITY &&
    action.type !== 'flag_for_manual_review';
  return {
    triggered,
    verdict: 'blocked',
    ruleName: 'LOW_RECOVERABILITY',
    explanation: `Recoverability score ${(diagnosis.geminiPayload.recoverability * 100).toFixed(0)}% is below the 20% minimum. No automated action warranted.`,
  };
};

// ─── Rule Registry ────────────────────────────────────────────────────────────
// Evaluated in order. First BLOCKED verdict short-circuits evaluation.
// NEEDS_REVIEW verdicts accumulate without stopping.

const POLICY_RULES: PolicyRule[] = [
  ruleNoActionOnUnrecoverable,      // Hard blocks first (highest safety priority)
  ruleNoRetryOnPaymentMethodFailure,
  ruleMaxRetryAmount,
  ruleMaxAttemptsPerOrder,
  ruleLowRecoverability,
  ruleManualReviewHighValue,        // Soft escalations after hard blocks
  ruleMinConfidence,
];

// ─── Gate Function ────────────────────────────────────────────────────────────

/**
 * Evaluate a proposed RecoveryAction against all policy rules.
 * This function is deterministic — same inputs always produce the same verdict.
 *
 * @param transaction   The original failed transaction
 * @param diagnosis     The validated DiagnosisResult from Agent 1
 * @param action        The specific RecoveryAction to evaluate
 * @param priorAttempts Number of prior recovery attempts on this order (default 0)
 */
export function evaluatePolicy(
  transaction: Transaction,
  diagnosis: DiagnosisResult,
  action: RecoveryAction,
  priorAttempts = 0,
): PolicyResult {
  const ctx: RuleContext = { transaction, diagnosis, action, priorAttempts };

  const triggeredRules: string[] = [];
  const explanations: string[] = [];
  let finalVerdict: PolicyVerdict = 'approved';

  for (const rule of POLICY_RULES) {
    const outcome = rule(ctx);
    if (outcome.triggered) {
      triggeredRules.push(outcome.ruleName);
      explanations.push(outcome.explanation);

      if (outcome.verdict === 'blocked') {
        finalVerdict = 'blocked';
        break; // Hard block — no further evaluation
      }
      if (outcome.verdict === 'needs_review' && finalVerdict === 'approved') {
        finalVerdict = 'needs_review';
      }
    }
  }

  return {
    transactionId: transaction.id,
    action,
    verdict: finalVerdict,
    triggeredRules,
    explanation:
      explanations.length > 0
        ? explanations.join(' | ')
        : 'All policy rules passed. Action approved for execution.',
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Evaluate all proposed actions from a DiagnosisResult and return the first
 * approved action (or null if all are blocked or need review).
 */
export function selectBestApprovedAction(
  transaction: Transaction,
  diagnosis: DiagnosisResult,
  priorAttempts = 0,
): { action: RecoveryAction; policyResult: PolicyResult } | null {
  for (const action of diagnosis.proposedActions) {
    const policyResult = evaluatePolicy(transaction, diagnosis, action, priorAttempts);
    if (policyResult.verdict === 'approved') {
      return { action, policyResult };
    }
  }
  return null;
}
