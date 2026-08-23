/**
 * scripts/evaluate.ts
 *
 * Deterministic Batch Evaluation Script for Salvo
 *
 * Usage:
 *   npm run evaluate
 *
 * Features:
 *  - Evaluates the COMPLETE dataset (no sampling)
 *  - Computes precision, recall, gross recovery, intervention cost, and net yield
 *  - Prints formatted institutional terminal report
 *  - Emits machine-readable evaluation-results.json
 */

import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { getAllTransactions } from '../src/db/repository.js';
import { evaluateDataset } from '../src/evaluation/engine.js';
import { closeMongoClient } from '../src/db/mongo.js';
import { formatPaise, formatPercent } from '../src/lib/currency.js';
import type { RecoveryStrategy } from '../src/types/index.js';

async function runEvaluation(): Promise<void> {
  const seed = process.env.DATASET_SEED || 'salvo-buildathon-v1';

  console.log('\n========================================');
  console.log('  SALVO — BATCH REVENUE EVALUATION');
  console.log('========================================\n');
  console.log(`  Reading complete transaction dataset...`);

  const transactions = await getAllTransactions();

  if (transactions.length === 0) {
    console.error('\n[evaluate] Error: No transactions found in repository.');
    console.error('[evaluate] Please run "npm run seed" first to generate the dataset.\n');
    await closeMongoClient();
    process.exit(1);
  }

  console.log(`  Evaluating ${transactions.length.toLocaleString('en-IN')} transactions against ground truth...\n`);

  const report = evaluateDataset(transactions, seed);

  await closeMongoClient();

  // Save machine-readable evaluation report
  const outputPath = path.resolve(process.cwd(), 'evaluation-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');

  // Format Terminal Report
  console.log('========================================');
  console.log('  SALVO BATCH EVALUATION REPORT');
  console.log('========================================\n');
  console.log(`  Transactions Evaluated:   ${report.totalTransactions.toLocaleString('en-IN')}`);
  console.log(`  Total Failed Revenue:     ${formatPaise(report.totalFailedRevenuePaise)}`);
  console.log(`  Actually Recoverable:     ${formatPaise(report.totalActuallyRecoverablePaise)}`);
  console.log(`  Predicted Recovery:       ${formatPaise(report.predictedRecoverableRevenuePaise)}`);
  console.log(`  Gross Actual Recovery:    ${formatPaise(report.actualRecoveryPaise)}`);
  console.log(`  Intervention Cost:        ${formatPaise(report.interventionCostPaise)}`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  NET REVENUE RECOVERED:    ${formatPaise(report.netRecoveryPaise)}`);
  console.log(`  Recovery Yield on Loss:   ${report.recoveryYieldPercent}%`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  Precision:                ${formatPercent(report.confusionMatrix.precision)}`);
  console.log(`  Recall:                   ${formatPercent(report.confusionMatrix.recall)}`);
  console.log(`  F1 Score:                 ${(report.confusionMatrix.f1Score * 100).toFixed(1)}%`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  Safety Policy Blocks:     ${report.policyBlockedCount.toLocaleString('en-IN')}`);
  console.log(`  Successful Recoveries:    ${report.successfulRecoveriesCount.toLocaleString('en-IN')}`);
  console.log(`  Failed Recovery Attempts: ${report.failedRecoveryAttemptsCount.toLocaleString('en-IN')}`);
  console.log(`  Unattempted / Isolated:   ${report.unattemptedCount.toLocaleString('en-IN')}`);

  console.log('\n========================================');
  console.log('  STRATEGY-LEVEL PERFORMANCE BREAKDOWN');
  console.log('========================================\n');

  const strategies = Object.keys(report.strategyBreakdown) as RecoveryStrategy[];

  console.log(
    `  ${'Strategy'.padEnd(24)} | ${'Predicted'.padStart(9)} | ${'Optimal'.padStart(7)} | ${'Accuracy'.padStart(8)} | ${'Gross Yield'.padStart(14)} | ${'Cost'.padStart(10)} | ${'Net Gain'.padStart(14)}`
  );
  console.log('  ' + '─'.repeat(100));

  for (const s of strategies) {
    const item = report.strategyBreakdown[s];
    const name = s.replace(/_/g, ' ');
    const accuracyStr = formatPercent(item.accuracyRate, 1);
    const grossStr = formatPaise(item.recoveryAmountPaise);
    const costStr = formatPaise(item.interventionCostPaise);
    const netStr = formatPaise(item.netRecoveryPaise);

    console.log(
      `  ${name.padEnd(24)} | ${item.predictedCount.toString().padStart(9)} | ${item.groundTruthOptimalCount.toString().padStart(7)} | ${accuracyStr.padStart(8)} | ${grossStr.padStart(14)} | ${costStr.padStart(10)} | ${netStr.padStart(14)}`
    );
  }

  console.log('\n========================================');
  console.log(`  Machine-readable results written to:`);
  console.log(`  ${outputPath}`);
  console.log('========================================\n');
}

runEvaluation().catch((err: unknown) => {
  console.error('[evaluate] Fatal error during evaluation:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
