/**
 * scripts/diagnose.ts
 *
 * Salvo Batch Gemini Diagnosis Script
 *
 * Usage:
 *   DIAGNOSIS_LIMIT=10 npm run diagnose
 *   npm run diagnose
 *
 * Features:
 *  - Loads transactions and converts to ObservableTransaction DTOs (ground truth stripped)
 *  - Calls Gemini for structured diagnosis recommendations
 *  - Persists recovery_actions and audit_logs to repository / database
 *  - Evaluates AI diagnostic accuracy against hidden ground truth post-hoc
 *  - Emits diagnose-results.json
 */

import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { getAllTransactions, saveRecoveryActions, saveAuditLogs } from '../src/db/repository.js';
import { diagnoseBatchTransactions } from '../src/agents/diagnosePlan.js';
import { isGeminiConfigured, AI_CONFIG } from '../src/lib/gemini.js';
import { formatPaise, formatPercent } from '../src/lib/currency.js';
import type { AIDiagnosisMetrics, RecoveryActionDocument, AuditLogDocument } from '../src/types/index.js';

async function runDiagnose(): Promise<void> {
  const startTime = Date.now();
  const limitEnv = process.env.DIAGNOSIS_LIMIT;
  const limit = limitEnv && limitEnv !== 'all' ? parseInt(limitEnv, 10) : undefined;

  console.log('\n========================================');
  console.log('  SALVO — GEMINI AI DIAGNOSE & PLAN');
  console.log('========================================\n');
  console.log(`  AI Model:         ${AI_CONFIG.diagnosisModel}`);
  console.log(`  Diagnosis Limit:  ${limit ? limit.toLocaleString('en-IN') : 'Full Dataset'}`);
  console.log(`  Gemini Key:       ${isGeminiConfigured() ? 'Configured' : 'Missing / Incomplete'}`);

  if (!isGeminiConfigured()) {
    console.error('\n[diagnose] ERROR: GEMINI_API_KEY is not set or contains placeholder value in .env.');
    console.error('[diagnose] Please set a valid Google Gemini API key in .env before running diagnosis.\n');
    process.exit(1);
  }

  console.log('\n  [1/4] Loading transactions from database...');
  const allTransactions = await getAllTransactions();

  if (allTransactions.length === 0) {
    console.error('\n[diagnose] Error: No transactions found. Run "npm run seed" first.\n');
    process.exit(1);
  }

  const transactionsToProcess = limit ? allTransactions.slice(0, limit) : allTransactions;
  console.log(`  [2/4] Selected ${transactionsToProcess.length.toLocaleString('en-IN')} transactions for Gemini diagnosis.`);
  console.log(`  [3/4] Dispatching structured diagnoses to Gemini (concurrency: 3)...`);

  const batchResult = await diagnoseBatchTransactions(transactionsToProcess, 3);
  const durationMs = Date.now() - startTime;

  console.log(`  [4/4] Completed: ${batchResult.successful.length} succeeded, ${batchResult.failed.length} failed in ${(durationMs / 1000).toFixed(1)}s.\n`);

  if (batchResult.failed.length > 0) {
    console.warn(`  ⚠️ Warnings / Failures:`);
    for (const f of batchResult.failed.slice(0, 5)) {
      console.warn(`     - ${f.transactionId}: ${f.error}`);
    }
    if (batchResult.failed.length > 5) {
      console.warn(`     ... and ${batchResult.failed.length - 5} more errors.`);
    }
  }

  // ─── Save Results to Database Collections ────────────────────────────────────
  const newActions: RecoveryActionDocument[] = batchResult.successful.map((s) => s.action);
  const newAuditLogs: AuditLogDocument[] = batchResult.successful.map((s) => s.auditLog);

  if (newActions.length > 0) {
    await saveRecoveryActions(newActions);
    await saveAuditLogs(newAuditLogs);
  }

  // ─── Post-hoc AI Metrics Computation ─────────────────────────────────────────
  // Compare model predictions against ground truth (strictly post-hoc)
  let strategyAgreementCount = 0;
  let classificationAgreementCount = 0;
  let totalConfidence = 0;
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let totalPredictedRecoveryPaise = 0;
  let totalGroundTruthRecoverablePaise = 0;

  for (const success of batchResult.successful) {
    const { recommendation } = success;
    const originalTxn = transactionsToProcess.find(
      (t) => (t.transactionId || t.id) === recommendation.transactionId
    );

    if (!originalTxn) continue;

    const gt = originalTxn.groundTruth;
    totalConfidence += recommendation.confidence;
    totalPredictedRecoveryPaise += recommendation.predictedRecoveryPaise;
    totalGroundTruthRecoverablePaise += gt.expectedRecoveryPaise;

    // Strategy agreement
    if (recommendation.recommendedStrategy === gt.optimalStrategy) {
      strategyAgreementCount++;
    }

    // Classification agreement (recoverable vs unrecoverable)
    const isModelRecoverable = recommendation.recommendedStrategy !== 'no_action' && recommendation.recoverability > 0.3;
    if (isModelRecoverable === gt.recoverable) {
      classificationAgreementCount++;
    }

    // Precision & Recall
    const isPredictedPositive = recommendation.recommendedStrategy !== 'no_action';
    const isActualPositive = gt.recoverable;

    if (isPredictedPositive && isActualPositive) truePositives++;
    else if (isPredictedPositive && !isActualPositive) falsePositives++;
    else if (!isPredictedPositive && isActualPositive) falseNegatives++;
  }

  const count = batchResult.successful.length;
  const precision = truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const aiMetrics: AIDiagnosisMetrics = {
    totalDiagnosed: count,
    strategyAgreementCount,
    strategyAgreementRate: count > 0 ? Number((strategyAgreementCount / count).toFixed(4)) : 0,
    classificationAgreementCount,
    classificationAgreementRate: count > 0 ? Number((classificationAgreementCount / count).toFixed(4)) : 0,
    averageConfidence: count > 0 ? Number((totalConfidence / count).toFixed(4)) : 0,
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4)),
    totalPredictedRecoveryPaise,
    totalGroundTruthRecoverablePaise,
    model: AI_CONFIG.diagnosisModel,
    durationMs,
  };

  // Write results JSON
  const outputPath = path.resolve(process.cwd(), 'diagnose-results.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        metrics: aiMetrics,
        diagnoses: batchResult.successful.map((s) => s.recommendation),
        failures: batchResult.failed,
      },
      null,
      2
    ),
    'utf-8'
  );

  // ─── Print Terminal Report ───────────────────────────────────────────────────
  console.log('========================================');
  console.log('  GEMINI DIAGNOSTIC EVALUATION REPORT');
  console.log('========================================\n');
  console.log(`  Model Evaluated:          ${aiMetrics.model}`);
  console.log(`  Transactions Diagnosed:   ${aiMetrics.totalDiagnosed.toLocaleString('en-IN')}`);
  console.log(`  Average Confidence:       ${formatPercent(aiMetrics.averageConfidence)}`);
  console.log(`  Strategy Agreement Rate:  ${formatPercent(aiMetrics.strategyAgreementRate)} (${strategyAgreementCount}/${count})`);
  console.log(`  Classification Accuracy:  ${formatPercent(aiMetrics.classificationAgreementRate)} (${classificationAgreementCount}/${count})`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  Recommendation Precision: ${formatPercent(aiMetrics.precision)}`);
  console.log(`  Recommendation Recall:    ${formatPercent(aiMetrics.recall)}`);
  console.log(`  F1 Quality Score:         ${formatPercent(aiMetrics.f1Score)}`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  Predicted Recovery:       ${formatPaise(aiMetrics.totalPredictedRecoveryPaise)}`);
  console.log(`  Ground Truth Target:      ${formatPaise(aiMetrics.totalGroundTruthRecoverablePaise)}`);
  console.log(`  Execution Latency:        ${(aiMetrics.durationMs / 1000).toFixed(2)}s`);

  if (batchResult.successful.length > 0) {
    const sample = batchResult.successful[0].recommendation;
    console.log('\n========================================');
    console.log('  SAMPLE STRUCTURED GEMINI RECOMMENDATION');
    console.log('========================================\n');
    console.log(`  Transaction ID:   ${sample.transactionId}`);
    console.log(`  Failure Type:     ${sample.failureType}`);
    console.log(`  Strategy:         ${sample.recommendedStrategy}`);
    console.log(`  Confidence:       ${(sample.confidence * 100).toFixed(1)}%`);
    console.log(`  Recoverability:   ${(sample.recoverability * 100).toFixed(1)}%`);
    console.log(`  Predicted Paise:  ${formatPaise(sample.predictedRecoveryPaise)}`);
    console.log(`  Est. Cost:        ${formatPaise(sample.recommendedInterventionCostPaise)}`);
    console.log(`  Reasoning:        ${sample.reasoning}`);
    console.log(`  Evidence:`);
    for (const e of sample.evidence) {
      console.log(`    • ${e}`);
    }
  }

  console.log('\n========================================');
  console.log(`  Results exported to: ${outputPath}`);
  console.log('========================================\n');
}

runDiagnose().catch((err: unknown) => {
  console.error('[diagnose] Fatal error during diagnosis:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
