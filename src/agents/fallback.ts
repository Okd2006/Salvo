/**
 * src/agents/fallback.ts
 *
 * Deterministic Fallback Engine for Salvo
 *
 * ZERO LLM CALLS. ZERO PROSE PARSING. ZERO NON-DETERMINISM.
 *
 * Responsibilities:
 *  1. When an execution fails, deterministically selects the next viable strategy
 *  2. Constructs a new RecoveryRecommendation for the fallback action
 *  3. Strictly enforces strategy compatibility rules
 *  4. Invariant: Every fallback MUST pass through the Policy Gate before execution
 */

import type {
  RecoveryStrategy,
  FailureCategory,
  RecoveryRecommendation,
  ObservableTransaction,
} from '../types/index.js';
import { RecoveryRecommendationSchema } from '../lib/schemas.js';

// ─── Fallback Progression Hierarchy ──────────────────────────────────────────

/**
 * Standard deterministic fallback progression hierarchy.
 */
const DEFAULT_FALLBACK_CHAIN: Record<RecoveryStrategy, RecoveryStrategy | null> = {
  smart_retry: 'payment_method_switch',
  payment_method_switch: 'payment_link',
  payment_link: 'reminder',
  reminder: 'no_action',
  no_action: null,
};

/**
 * Select the next deterministic recovery strategy after an execution failure.
 */
export function selectFallbackStrategy(
  failedStrategy: RecoveryStrategy,
  failureCategory: FailureCategory
): RecoveryStrategy | null {
  let candidate = DEFAULT_FALLBACK_CHAIN[failedStrategy];

  while (candidate && candidate !== 'no_action') {
    if (isStrategyViableForCategory(candidate, failureCategory)) {
      return candidate;
    }
    candidate = DEFAULT_FALLBACK_CHAIN[candidate];
  }

  return candidate ?? null;
}

/**
 * Validates whether a strategy is logically viable for a given failure category.
 */
function isStrategyViableForCategory(
  strategy: RecoveryStrategy,
  failureCategory: FailureCategory
): boolean {
  if (failureCategory === 'suspected_risk' || failureCategory === 'unrecoverable') {
    return strategy === 'no_action';
  }

  if (strategy === 'smart_retry') {
    return (
      failureCategory === 'temporary_network_failure' ||
      failureCategory === 'bank_decline' ||
      failureCategory === 'insufficient_funds'
    );
  }

  if (strategy === 'payment_method_switch') {
    return (
      failureCategory === 'payment_method_issue' ||
      failureCategory === 'bank_decline' ||
      failureCategory === 'insufficient_funds' ||
      failureCategory === 'temporary_network_failure'
    );
  }

  if (strategy === 'payment_link') {
    return (
      failureCategory === 'customer_abandonment' ||
      failureCategory === 'expired_payment' ||
      failureCategory === 'insufficient_funds' ||
      failureCategory === 'bank_decline' ||
      failureCategory === 'payment_method_issue' ||
      failureCategory === 'temporary_network_failure'
    );
  }

  if (strategy === 'reminder') {
    return (
      failureCategory === 'authentication_failure' ||
      failureCategory === 'customer_abandonment' ||
      failureCategory === 'expired_payment'
    );
  }

  return true;
}

/**
 * Build a structured RecoveryRecommendation for a deterministic fallback strategy.
 */
export function buildFallbackRecommendation(
  previousRec: RecoveryRecommendation,
  nextStrategy: RecoveryStrategy,
  observable: ObservableTransaction
): RecoveryRecommendation {
  // Compute deterministic recoverable yield and cost for fallback
  const recoverability = nextStrategy === 'no_action' ? 0 : Math.max(0.2, previousRec.recoverability * 0.9);
  const predictedRecoveryPaise = nextStrategy === 'no_action'
    ? 0
    : Math.min(observable.amountPaise, Math.round(observable.amountPaise * recoverability));

  let costPaise = 0;
  switch (nextStrategy) {
    case 'smart_retry':
      costPaise = 150;
      break;
    case 'payment_method_switch':
      costPaise = 450;
      break;
    case 'payment_link':
      costPaise = 250;
      break;
    case 'reminder':
      costPaise = 250;
      break;
    case 'no_action':
    default:
      costPaise = 0;
      break;
  }

  const fallbackRec: RecoveryRecommendation = {
    transactionId: observable.transactionId,
    failureType: previousRec.failureType,
    recoverability,
    recommendedStrategy: nextStrategy,
    confidence: Math.max(0.65, Number((previousRec.confidence * 0.95).toFixed(2))),
    evidence: [
      `Automated fallback selected after initial strategy "${previousRec.recommendedStrategy}" failed`,
      `Observable failure code: ${observable.failureCode}`,
    ],
    reasoning: `Deterministic fallback execution: transitioning to "${nextStrategy}" to maximize recovery probability.`,
    predictedRecoveryPaise,
    recommendedInterventionCostPaise: costPaise,
  };

  return RecoveryRecommendationSchema.parse(fallbackRec);
}
