/**
 * src/evaluation/engine.ts
 *
 * Deterministic Batch Evaluation Engine for Salvo
 *
 * Computes end-to-end performance metrics over the complete transaction dataset:
 *  - Financial Recovery Yields (Gross & Net in integer paise)
 *  - Precision, Recall & Confusion Matrix
 *  - Safety Policy Blocks & Execution Counts
 *  - Strategy-Level Breakdown for all 5 recovery vectors
 *
 * ZERO FLOATING POINT MONEY CALCULATIONS.
 * NEVER DERIVES FINANCIALS FROM LLM PROSE.
 */

import type {
  TransactionDocument,
  EvaluationReport,
  StrategyPerformanceMetrics,
  RecoveryStrategy,
  ConfusionMatrix,
} from '../types/index.js';

const ALL_STRATEGIES: RecoveryStrategy[] = [
  'smart_retry',
  'payment_method_switch',
  'payment_link',
  'reminder',
  'no_action',
];

/**
 * Execute batch evaluation over the complete transaction dataset.
 */
export function evaluateDataset(
  transactions: TransactionDocument[],
  seed: string = 'salvo-buildathon-v1'
): EvaluationReport {
  let totalFailedRevenuePaise = 0;
  let totalActuallyRecoverablePaise = 0;
  let predictedRecoverableRevenuePaise = 0;
  let actualRecoveryPaise = 0;
  let interventionCostPaise = 0;

  let policyBlockedCount = 0;
  let successfulRecoveriesCount = 0;
  let failedRecoveryAttemptsCount = 0;
  let unattemptedCount = 0;

  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let trueNegatives = 0;

  // Initialize strategy breakdown map
  const strategyBreakdown: Record<RecoveryStrategy, StrategyPerformanceMetrics> = {
    smart_retry: createInitialStrategyMetrics('smart_retry'),
    payment_method_switch: createInitialStrategyMetrics('payment_method_switch'),
    payment_link: createInitialStrategyMetrics('payment_link'),
    reminder: createInitialStrategyMetrics('reminder'),
    no_action: createInitialStrategyMetrics('no_action'),
  };

  for (const txn of transactions) {
    const { amountPaise, groundTruth, simulation } = txn;

    // 1. Financial Totals
    totalFailedRevenuePaise += amountPaise;

    if (groundTruth.recoverable) {
      totalActuallyRecoverablePaise += amountPaise;
    }

    predictedRecoverableRevenuePaise += simulation.predictedRecoveryPaise;
    actualRecoveryPaise += simulation.actualRecoveryPaise;
    interventionCostPaise += simulation.interventionCostPaise;

    // 2. Execution & Policy State Counts
    if (simulation.policyVerdict === 'blocked') {
      policyBlockedCount++;
    }

    if (simulation.executionStatus === 'recovered') {
      successfulRecoveriesCount++;
    } else if (simulation.executionStatus === 'failed') {
      failedRecoveryAttemptsCount++;
    } else {
      unattemptedCount++;
    }

    // 3. Precision & Recall Classification
    // Positive prediction: Model recommends an active recovery intervention (not 'no_action')
    // Actual positive: Ground truth indicates transaction is genuinely recoverable
    const isPredictedPositive = simulation.predictedStrategy !== 'no_action';
    const isActualPositive = groundTruth.recoverable;

    if (isPredictedPositive && isActualPositive) {
      truePositives++;
    } else if (isPredictedPositive && !isActualPositive) {
      falsePositives++;
    } else if (!isPredictedPositive && isActualPositive) {
      falseNegatives++;
    } else {
      trueNegatives++;
    }

    // 4. Strategy Breakdown
    const predStrat = simulation.predictedStrategy;
    const optStrat = groundTruth.optimalStrategy;

    if (strategyBreakdown[predStrat]) {
      strategyBreakdown[predStrat].predictedCount++;
      strategyBreakdown[predStrat].recoveryAmountPaise += simulation.actualRecoveryPaise;
      strategyBreakdown[predStrat].interventionCostPaise += simulation.interventionCostPaise;
      strategyBreakdown[predStrat].netRecoveryPaise +=
        simulation.actualRecoveryPaise - simulation.interventionCostPaise;

      if (predStrat === optStrat) {
        strategyBreakdown[predStrat].correctPredictions++;
      } else {
        strategyBreakdown[predStrat].incorrectPredictions++;
      }
    }

    if (strategyBreakdown[optStrat]) {
      strategyBreakdown[optStrat].groundTruthOptimalCount++;
    }
  }

  // Compute Net Recovery
  const netRecoveryPaise = actualRecoveryPaise - interventionCostPaise;

  // Compute Precision & Recall (safe zero-denominator handling)
  const precisionDenominator = truePositives + falsePositives;
  const precision = precisionDenominator > 0 ? truePositives / precisionDenominator : 0;

  const recallDenominator = truePositives + falseNegatives;
  const recall = recallDenominator > 0 ? truePositives / recallDenominator : 0;

  const f1Denominator = precision + recall;
  const f1Score = f1Denominator > 0 ? (2 * precision * recall) / f1Denominator : 0;

  const confusionMatrix: ConfusionMatrix = {
    truePositives,
    falsePositives,
    falseNegatives,
    trueNegatives,
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4)),
  };

  // Compute final strategy accuracy percentages
  for (const s of ALL_STRATEGIES) {
    const item = strategyBreakdown[s];
    item.accuracyRate =
      item.predictedCount > 0
        ? Number((item.correctPredictions / item.predictedCount).toFixed(4))
        : 0;
  }

  const recoveryYieldPercent =
    totalFailedRevenuePaise > 0
      ? Number(((actualRecoveryPaise / totalFailedRevenuePaise) * 100).toFixed(2))
      : 0;

  return {
    evaluatedAt: new Date().toISOString(),
    seed,
    totalTransactions: transactions.length,
    totalFailedRevenuePaise,
    totalActuallyRecoverablePaise,
    predictedRecoverableRevenuePaise,
    actualRecoveryPaise,
    interventionCostPaise,
    netRecoveryPaise,
    recoveryYieldPercent,
    confusionMatrix,
    policyBlockedCount,
    successfulRecoveriesCount,
    failedRecoveryAttemptsCount,
    unattemptedCount,
    strategyBreakdown,
  };
}

function createInitialStrategyMetrics(strategy: RecoveryStrategy): StrategyPerformanceMetrics {
  return {
    strategy,
    predictedCount: 0,
    groundTruthOptimalCount: 0,
    correctPredictions: 0,
    incorrectPredictions: 0,
    recoveryAmountPaise: 0,
    interventionCostPaise: 0,
    netRecoveryPaise: 0,
    accuracyRate: 0,
  };
}
