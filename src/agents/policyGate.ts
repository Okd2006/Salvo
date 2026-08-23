/**
 * src/agents/policyGate.ts
 *
 * Deterministic Policy Gate for Salvo
 *
 * ZERO LLM CALLS. ZERO PROSE PARSING. ZERO NON-DETERMINISM.
 *
 * The Policy Gate is the non-negotiable deterministic safety boundary between
 * Gemini recommendations and real payment infrastructure.
 *
 * Architectural Invariant:
 *   "Gemini recommends. Deterministic policy code decides. Execution code acts."
 */

import type {
  ObservableTransaction,
  RecoveryRecommendation,
  PolicyResult,
  PolicyCheck,
  PolicyReasonCode,
  TransactionDocument,
} from '../types/index.js';
import { toObservableTransaction } from './observation.js';
import { PolicyResultSchema } from '../lib/schemas.js';

// ─── Safety Threshold Constants ───────────────────────────────────────────────

export const POLICY_CONSTANTS = {
  MIN_CONFIDENCE_THRESHOLD: 0.60,
  HIGH_TICKET_CONFIDENCE_THRESHOLD: 0.85,
  MAX_RETRY_COUNT: 2,
  MAX_CONTACT_COUNT: 3,
  MAX_AUTO_RETRY_AMOUNT_PAISE: 5_000_000,    // ₹50,000
  HIGH_TICKET_THRESHOLD_PAISE: 8_000_000,    // ₹80,000
} as const;

// ─── Deterministic Policy Gate Evaluator ──────────────────────────────────────

/**
 * Evaluates a Gemini RecoveryRecommendation against deterministic safety policies.
 * Returns a typed, validated PolicyResult containing all individual checks.
 */
export function evaluatePolicyGate(
  recommendation: RecoveryRecommendation,
  observable: ObservableTransaction
): PolicyResult {
  const checks: PolicyCheck[] = [];
  const evaluatedAt = new Date().toISOString();

  // 1. RISK_SAFETY_CHECK
  const isRisk =
    recommendation.failureType === 'risk' ||
    observable.failureCategory === 'suspected_risk' ||
    observable.failureCode === 'HIGH_RISK_SUSPICIOUS_VELOCITY' ||
    observable.failureCode === 'GEOLOCATION_FRAUD_FLAG' ||
    observable.failureCode === 'BLACKLISTED_DEVICE_FINGERPRINT';

  checks.push({
    name: 'RISK_SAFETY_CHECK',
    passed: !isRisk,
    reason: isRisk
      ? 'Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited.'
      : 'No fraud or risk anomalies detected.',
  });

  // 2. UNRECOVERABLE_SAFETY_CHECK
  const isUnrecoverable =
    recommendation.failureType === 'unrecoverable' ||
    observable.failureCategory === 'unrecoverable' ||
    recommendation.recommendedStrategy === 'no_action' ||
    recommendation.recoverability === 0;

  checks.push({
    name: 'UNRECOVERABLE_SAFETY_CHECK',
    passed: !isUnrecoverable,
    reason: isUnrecoverable
      ? 'Terminal decline or unrecoverable instrument. No automated intervention permitted.'
      : 'Failure is classified as potentially recoverable.',
  });

  // 3. RETRY_LIMIT_CHECK
  const isRetryLimitExceeded =
    recommendation.recommendedStrategy === 'smart_retry' &&
    observable.retryCount >= POLICY_CONSTANTS.MAX_RETRY_COUNT;

  checks.push({
    name: 'RETRY_LIMIT_CHECK',
    passed: !isRetryLimitExceeded,
    reason: isRetryLimitExceeded
      ? `Maximum automated retry attempts (${POLICY_CONSTANTS.MAX_RETRY_COUNT}) reached for this transaction.`
      : 'Retry count is within permissible limits.',
  });

  // 4. CONFIDENCE_THRESHOLD_CHECK
  const isConfidenceTooLow = recommendation.confidence < POLICY_CONSTANTS.MIN_CONFIDENCE_THRESHOLD;

  checks.push({
    name: 'CONFIDENCE_THRESHOLD_CHECK',
    passed: !isConfidenceTooLow,
    reason: isConfidenceTooLow
      ? `Diagnosis confidence (${(recommendation.confidence * 100).toFixed(1)}%) is below required minimum threshold (${(POLICY_CONSTANTS.MIN_CONFIDENCE_THRESHOLD * 100).toFixed(0)}%).`
      : 'Diagnosis confidence meets or exceeds safety threshold.',
  });

  // 5. POSITIVE_EXPECTED_VALUE_CHECK
  const netExpectedYield =
    recommendation.predictedRecoveryPaise - recommendation.recommendedInterventionCostPaise;
  const isNegativeExpectedValue =
    recommendation.recommendedStrategy !== 'no_action' &&
    (netExpectedYield <= 0 || recommendation.predictedRecoveryPaise <= recommendation.recommendedInterventionCostPaise);

  checks.push({
    name: 'POSITIVE_EXPECTED_VALUE_CHECK',
    passed: !isNegativeExpectedValue,
    reason: isNegativeExpectedValue
      ? `Intervention cost (${recommendation.recommendedInterventionCostPaise} paise) equals or exceeds projected recovery (${recommendation.predictedRecoveryPaise} paise).`
      : 'Intervention maintains positive net expected financial value.',
  });

  // 6. AMOUNT_VALIDITY_CHECK
  const isInvalidRecoveryAmount =
    recommendation.recommendedStrategy !== 'no_action' &&
    (recommendation.predictedRecoveryPaise <= 0 ||
      recommendation.predictedRecoveryPaise > observable.amountPaise);

  checks.push({
    name: 'AMOUNT_VALIDITY_CHECK',
    passed: !isInvalidRecoveryAmount,
    reason: isInvalidRecoveryAmount
      ? `Predicted recovery (${recommendation.predictedRecoveryPaise} paise) is invalid for transaction volume (${observable.amountPaise} paise).`
      : 'Predicted recovery amount is structurally valid.',
  });

  // 7. AMOUNT_THRESHOLD_CHECK
  const isHighTicketRetry =
    recommendation.recommendedStrategy === 'smart_retry' &&
    observable.amountPaise > POLICY_CONSTANTS.MAX_AUTO_RETRY_AMOUNT_PAISE;

  const isHighTicketLowConfidence =
    observable.amountPaise > POLICY_CONSTANTS.HIGH_TICKET_THRESHOLD_PAISE &&
    recommendation.confidence < POLICY_CONSTANTS.HIGH_TICKET_CONFIDENCE_THRESHOLD;

  const isAmountThresholdExceeded = isHighTicketRetry || isHighTicketLowConfidence;

  checks.push({
    name: 'AMOUNT_THRESHOLD_CHECK',
    passed: !isAmountThresholdExceeded,
    reason: isHighTicketRetry
      ? `Automated retry exceeds ₹50,000 limit (${(observable.amountPaise / 100).toFixed(0)} INR). Requires customer-present payment link.`
      : isHighTicketLowConfidence
      ? `High-ticket volume (> ₹80,000) requires >= 85% confidence for automated execution.`
      : 'Transaction amount is within automated execution limits.',
  });

  // 8. STRATEGY_PERMISSIBILITY_CHECK
  const isBadStrategyCombination =
    (recommendation.recommendedStrategy === 'smart_retry' &&
      (observable.failureCategory === 'payment_method_issue' ||
        observable.failureCategory === 'customer_abandonment' ||
        observable.failureCategory === 'expired_payment')) ||
    (recommendation.recommendedStrategy === 'payment_method_switch' &&
      observable.failureCategory === 'temporary_network_failure');

  checks.push({
    name: 'STRATEGY_PERMISSIBILITY_CHECK',
    passed: !isBadStrategyCombination,
    reason: isBadStrategyCombination
      ? `Strategy "${recommendation.recommendedStrategy}" is incompatible with failure category "${observable.failureCategory}".`
      : 'Strategy is compatible with failure mode.',
  });

  // 9. CONTACT_LIMIT_CHECK
  const isContactLimitExceeded =
    (recommendation.recommendedStrategy === 'reminder' ||
      recommendation.recommendedStrategy === 'payment_link') &&
    observable.retryCount >= POLICY_CONSTANTS.MAX_CONTACT_COUNT;

  checks.push({
    name: 'CONTACT_LIMIT_CHECK',
    passed: !isContactLimitExceeded,
    reason: isContactLimitExceeded
      ? `Maximum customer contact attempts (${POLICY_CONSTANTS.MAX_CONTACT_COUNT}) exceeded.`
      : 'Customer contact attempt limit respected.',
  });

  // ─── Determine Final Verdict & ReasonCode ────────────────────────────────────
  let allowed = true;
  let reasonCode: PolicyReasonCode = 'ALLOWED';
  let primaryReason = 'All deterministic policy gate safety checks passed successfully.';

  // Priority order for failure reason codes
  if (isRisk) {
    allowed = false;
    reasonCode = 'RISK_BLOCK';
    primaryReason = 'Anti-fraud policy gate blocked recovery on suspected risk transaction.';
  } else if (isUnrecoverable) {
    allowed = false;
    reasonCode = 'UNRECOVERABLE_BLOCK';
    primaryReason = 'Terminal failure mode. Automated intervention blocked.';
  } else if (isRetryLimitExceeded) {
    allowed = false;
    reasonCode = 'RETRY_LIMIT_EXCEEDED';
    primaryReason = 'Automated retry limit reached for this payment attempt.';
  } else if (isConfidenceTooLow) {
    allowed = false;
    reasonCode = 'CONFIDENCE_TOO_LOW';
    primaryReason = 'Diagnosis confidence is below deterministic minimum threshold.';
  } else if (isNegativeExpectedValue) {
    allowed = false;
    reasonCode = 'NEGATIVE_EXPECTED_VALUE';
    primaryReason = 'Negative or zero net expected recovery value.';
  } else if (isInvalidRecoveryAmount) {
    allowed = false;
    reasonCode = 'INVALID_RECOVERY_AMOUNT';
    primaryReason = 'Predicted recovery amount violates financial invariants.';
  } else if (isAmountThresholdExceeded) {
    allowed = false;
    reasonCode = 'AMOUNT_THRESHOLD_EXCEEDED';
    primaryReason = 'High-value transaction exceeds automated threshold.';
  } else if (isBadStrategyCombination) {
    allowed = false;
    reasonCode = 'STRATEGY_NOT_PERMITTED';
    primaryReason = 'Recommended strategy is incompatible with observable failure mode.';
  } else if (isContactLimitExceeded) {
    allowed = false;
    reasonCode = 'CONTACT_LIMIT_EXCEEDED';
    primaryReason = 'Maximum customer contact attempts reached.';
  }

  const triggeredRules = checks.filter((c) => !c.passed).map((c) => c.name);

  const result: PolicyResult = {
    allowed,
    reasonCode,
    reason: primaryReason,
    checks,
    evaluatedAt,
    transactionId: recommendation.transactionId || observable.transactionId,
    verdict: allowed ? 'approved' : 'blocked',
    triggeredRules,
    explanation: primaryReason,
  };

  // Validate with Zod
  const parsed = PolicyResultSchema.parse(result);

  return {
    allowed: parsed.allowed,
    reasonCode: parsed.reasonCode,
    reason: parsed.reason,
    checks: parsed.checks,
    evaluatedAt: parsed.evaluatedAt,
    ...(parsed.transactionId ? { transactionId: parsed.transactionId } : {}),
    ...(parsed.verdict ? { verdict: parsed.verdict } : {}),
    ...(parsed.triggeredRules ? { triggeredRules: parsed.triggeredRules } : {}),
    ...(parsed.explanation ? { explanation: parsed.explanation } : {}),
  };
}

/**
 * Convenience wrapper evaluating a full database TransactionDocument.
 */
export function evaluateTransactionPolicyGate(
  recommendation: RecoveryRecommendation,
  txn: TransactionDocument
): PolicyResult {
  const observable = toObservableTransaction(txn);
  return evaluatePolicyGate(recommendation, observable);
}

// ─── Legacy compatibility alias for existing modules ──────────────────────────
export const evaluatePolicy = evaluatePolicyGate;
