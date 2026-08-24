/**
 * src/evaluation/baseline.ts
 *
 * Deterministic Baseline & Comparative Evaluation Engine
 *
 * Baseline Model:
 *  "Retry every eligible failed transaction once."
 *  Eligibility rules:
 *   - Excludes suspected_risk transactions (anti-fraud safety)
 *   - Excludes unrecoverable transactions (terminal declination)
 *   - Excludes transactions where retryCount >= 2
 *   - Cost per single retry: 150 paise (₹1.50)
 *   - Recovers revenue if and only if groundTruth indicates smart_retry is the optimal recovery vector.
 */

import type { TransactionDocument } from '../types/index.js';

export interface BaselineMetrics {
  totalTransactions: number;
  eligibleTransactions: number;
  ineligibleTransactions: number;
  totalFailedRevenuePaise: number;
  grossRecoveredPaise: number;
  interventionCostPaise: number;
  netRecoveredPaise: number;
  recoveredTransactionsCount: number;
  failedTransactionsCount: number;
  recoveryYieldPercent: number;
  recoveryRatePercent: number;
}

export interface SalvoComparisonReport {
  baseline: BaselineMetrics;
  salvo: {
    grossRecoveredPaise: number;
    interventionCostPaise: number;
    netRecoveredPaise: number;
    recoveredTransactionsCount: number;
    recoveryYieldPercent: number;
    recoveryRatePercent: number;
    fallbackRecoveredPaise: number;
  };
  comparison: {
    additionalGrossRecoveryPaise: number;
    additionalNetRecoveryPaise: number;
    netImprovementPercent: number;
    yieldImprovementPercent: number;
    rateImprovementPercent: number;
    additionalRecoveredTransactions: number;
    fallbackContributionPercent: number;
  };
}

/**
 * Evaluate deterministic single-retry baseline on a transaction dataset.
 */
export function evaluateBaseline(transactions: TransactionDocument[]): BaselineMetrics {
  let eligibleCount = 0;
  let ineligibleCount = 0;
  let totalFailedRevenuePaise = 0;
  let grossRecoveredPaise = 0;
  let interventionCostPaise = 0;
  let recoveredCount = 0;
  let failedCount = 0;

  const RETRY_COST_PAISE = 150; // ₹1.50 standard single retry cost

  for (const txn of transactions) {
    totalFailedRevenuePaise += txn.amountPaise;

    // Eligibility check
    const isEligible =
      txn.failureCategory !== 'suspected_risk' &&
      txn.failureCategory !== 'unrecoverable' &&
      txn.retryCount < 2;

    if (!isEligible) {
      ineligibleCount++;
      continue;
    }

    eligibleCount++;
    interventionCostPaise += RETRY_COST_PAISE;

    // Naive baseline only recovers if smart_retry alone was the optimal strategy
    const gt = txn.groundTruth;
    if (gt.recoverable && gt.optimalStrategy === 'smart_retry') {
      grossRecoveredPaise += gt.expectedRecoveryPaise;
      recoveredCount++;
    } else {
      failedCount++;
    }
  }

  const netRecoveredPaise = grossRecoveredPaise - interventionCostPaise;
  const recoveryYieldPercent =
    totalFailedRevenuePaise > 0
      ? Number(((grossRecoveredPaise / totalFailedRevenuePaise) * 100).toFixed(2))
      : 0;
  const recoveryRatePercent =
    transactions.length > 0
      ? Number(((recoveredCount / transactions.length) * 100).toFixed(2))
      : 0;

  return {
    totalTransactions: transactions.length,
    eligibleTransactions: eligibleCount,
    ineligibleTransactions: ineligibleCount,
    totalFailedRevenuePaise,
    grossRecoveredPaise,
    interventionCostPaise,
    netRecoveredPaise,
    recoveredTransactionsCount: recoveredCount,
    failedTransactionsCount: failedCount,
    recoveryYieldPercent,
    recoveryRatePercent,
  };
}

/**
 * Compare autonomous Salvo agent performance against naive baseline.
 */
export function compareSalvoAgainstBaseline(
  salvo: {
    grossRecoveredPaise: number;
    interventionCostPaise: number;
    netRecoveredPaise: number;
    recoveredTransactionsCount: number;
    recoveryYieldPercent: number;
    recoveryRatePercent: number;
    fallbackRecoveredPaise: number;
  },
  baseline: BaselineMetrics
): SalvoComparisonReport {
  const additionalGrossRecoveryPaise = salvo.grossRecoveredPaise - baseline.grossRecoveredPaise;
  const additionalNetRecoveryPaise = salvo.netRecoveredPaise - baseline.netRecoveredPaise;

  const netImprovementPercent =
    baseline.netRecoveredPaise > 0
      ? Number(
          (
            ((salvo.netRecoveredPaise - baseline.netRecoveredPaise) /
              baseline.netRecoveredPaise) *
            100
          ).toFixed(2)
        )
      : salvo.netRecoveredPaise > 0
      ? 100
      : 0;

  const yieldImprovementPercent = Number(
    (salvo.recoveryYieldPercent - baseline.recoveryYieldPercent).toFixed(2)
  );

  const rateImprovementPercent = Number(
    (salvo.recoveryRatePercent - baseline.recoveryRatePercent).toFixed(2)
  );

  const additionalRecoveredTransactions =
    salvo.recoveredTransactionsCount - baseline.recoveredTransactionsCount;

  const fallbackContributionPercent =
    salvo.grossRecoveredPaise > 0
      ? Number(
          ((salvo.fallbackRecoveredPaise / salvo.grossRecoveredPaise) * 100).toFixed(2)
        )
      : 0;

  return {
    baseline,
    salvo,
    comparison: {
      additionalGrossRecoveryPaise,
      additionalNetRecoveryPaise,
      netImprovementPercent,
      yieldImprovementPercent,
      rateImprovementPercent,
      additionalRecoveredTransactions,
      fallbackContributionPercent,
    },
  };
}
