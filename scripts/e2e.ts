/**
 * scripts/e2e.ts
 *
 * Salvo End-to-End Validation & Benchmarking Runner
 *
 * Usage:
 *   E2E_LIMIT=10 npm run e2e
 *   npm run e2e
 *   npm run benchmark
 *
 * Exercises the complete, live Salvo pipeline:
 *   ObservableTransaction
 *      ↓
 *   Gemini Diagnose & Plan
 *      ↓
 *   Deterministic Policy Gate
 *      ↓
 *   Razorpay Test Execution
 *      ↓
 *   Fallback Engine (if needed)
 *      ↓
 *   Policy Gate Again
 *      ↓
 *   Audit & Invariant Validation
 *      ↓
 *   Comparative Baseline Evaluation
 */

import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { getAllTransactions, getAllRecoveryActions, getAllAuditLogs } from '../src/db/repository.js';
import { runAutonomousRecovery } from '../src/agents/orchestrator.js';
import { validateSafetyInvariants } from '../src/evaluation/invariants.js';
import { computeBenchmarkReport } from '../src/evaluation/benchmarkHarness.js';
import { formatPaise } from '../src/lib/currency.js';
import { clearIdempotencyCache } from '../src/agents/executor.js';
import type { RecoverySessionResult } from '../src/types/index.js';

async function runE2ERunner(): Promise<void> {
  const startTime = Date.now();
  const limitEnv = process.env.E2E_LIMIT || process.env.BENCHMARK_LIMIT;
  const limit = limitEnv && limitEnv !== 'all' ? parseInt(limitEnv, 10) : 10;

  console.log('\n========================================');
  console.log('  SALVO — END-TO-END VALIDATION & HARNESS');
  console.log('========================================\n');
  console.log(`  E2E Limit:        ${limit ? limit.toLocaleString('en-IN') : 'Full Dataset'}`);
  console.log(`  Safety Invariant: Hard-Enforced Policy Gate + Test Mode`);

  console.log('\n  [1/5] Loading transactions from database...');
  const allTransactions = await getAllTransactions();

  if (allTransactions.length === 0) {
    console.error('\n[e2e] Error: No transactions found. Run "npm run seed" first.\n');
    process.exit(1);
  }

  const transactionsToProcess = limit ? allTransactions.slice(0, limit) : allTransactions;
  console.log(`  [2/5] Selected ${transactionsToProcess.length.toLocaleString('en-IN')} transactions for live E2E pipeline.`);
  console.log(`  [3/5] Executing autonomous recovery pipeline (Diagnose -> Gate -> Exec -> Fallback)...`);

  clearIdempotencyCache();
  const sessions: RecoverySessionResult[] = [];

  for (let i = 0; i < transactionsToProcess.length; i++) {
    const txn = transactionsToProcess[i];
    const txnId = txn.transactionId || txn.id || `txn_${i}`;
    process.stdout.write(`       [${i + 1}/${transactionsToProcess.length}] Processing ${txnId}... `);

    const session = await runAutonomousRecovery(txn, 3);
    sessions.push(session);

    const statusBadge = session.success
      ? `✅ RECOVERED (${formatPaise(session.totalRecoveredPaise)}, ${session.attempts} attempts)`
      : session.finalStatus === 'blocked'
      ? `🛑 BLOCKED (${session.policyDecisions[0]?.reasonCode || 'POLICY_GATE'})`
      : `❌ FAILED (${session.attempts} attempts)`;

    console.log(statusBadge);
  }

  console.log('\n  [4/5] Running Safety Invariant Auditor across all sessions...');
  const allActions = await getAllRecoveryActions();
  const allLogs = await getAllAuditLogs();
  const invariantReport = validateSafetyInvariants(
    sessions,
    transactionsToProcess,
    allLogs,
    allActions
  );

  console.log(`       Audited ${invariantReport.totalChecks} invariants: ${invariantReport.passedChecks} passed, ${invariantReport.failedChecks} failed.`);

  console.log('  [5/5] Computing comparative benchmark metrics against baseline...');
  const benchmarkReport = computeBenchmarkReport(sessions, transactionsToProcess, invariantReport);

  // ─── Export Results JSON ─────────────────────────────────────────────────────
  const e2eResultsPath = path.resolve(process.cwd(), 'e2e-results.json');
  fs.writeFileSync(
    e2eResultsPath,
    JSON.stringify(
      {
        totalProcessed: sessions.length,
        evaluatedAt: benchmarkReport.evaluatedAt,
        sessions,
      },
      null,
      2
    ),
    'utf-8'
  );

  const benchmarkReportPath = path.resolve(process.cwd(), 'benchmark-report.json');
  fs.writeFileSync(benchmarkReportPath, JSON.stringify(benchmarkReport, null, 2), 'utf-8');

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // ─── Print Human-Readable Terminal Report ────────────────────────────────────
  const b = benchmarkReport.business;
  const ai = benchmarkReport.ai;
  const sf = benchmarkReport.safety;
  const ag = benchmarkReport.agent;
  const comp = benchmarkReport.baselineComparison;

  console.log('\n========================================');
  console.log('SALVO — END-TO-END VALIDATION');
  console.log('========================================\n');
  console.log(`Transactions:`);
  console.log(`${b.totalTransactions.toLocaleString('en-IN')}\n`);
  console.log(`Failed Revenue:`);
  console.log(`${formatPaise(b.totalFailedRevenuePaise)}\n`);
  console.log(`Actually Recoverable:`);
  console.log(`${formatPaise(b.totalActuallyRecoverablePaise)}\n`);
  console.log(`Gross Recovered:`);
  console.log(`${formatPaise(b.grossRecoveredPaise)}\n`);
  console.log(`Intervention Cost:`);
  console.log(`${formatPaise(b.interventionCostPaise)}\n`);
  console.log(`Net Recovered:`);
  console.log(`${formatPaise(b.netRecoveredPaise)}\n`);
  console.log(`Recovery Yield:`);
  console.log(`${b.recoveryYieldPercent.toFixed(2)}%\n`);
  console.log(`Recovery Rate:`);
  console.log(`${b.recoveryRatePercent.toFixed(2)}%\n`);
  console.log('----------------------------------------');
  console.log('AI PERFORMANCE');
  console.log('----------------------------------------\n');
  console.log(`Strategy Accuracy:`);
  console.log(`${ai.strategyAccuracyPercent.toFixed(2)}%\n`);
  console.log(`Precision:`);
  console.log(`${ai.precisionPercent.toFixed(2)}%\n`);
  console.log(`Recall:`);
  console.log(`${ai.recallPercent.toFixed(2)}%\n`);
  console.log(`F1:`);
  console.log(`${ai.f1ScorePercent.toFixed(2)}%\n`);
  console.log(`Average Confidence:`);
  console.log(`${ai.averageConfidencePercent.toFixed(2)}%\n`);
  console.log('----------------------------------------');
  console.log('SAFETY');
  console.log('----------------------------------------\n');
  console.log(`Policy Evaluations:`);
  console.log(`${sf.totalPolicyEvaluations}\n`);
  console.log(`Approved:`);
  console.log(`${sf.approvedActions}\n`);
  console.log(`Blocked:`);
  console.log(`${sf.blockedActions}\n`);
  console.log(`Policy Block Rate:`);
  console.log(`${sf.policyBlockRatePercent.toFixed(2)}%\n`);
  console.log(`Unauthorized Executions:`);
  console.log(`${sf.unauthorizedExecutionCount}\n`);
  console.log(`Invariant Violations:`);
  console.log(`${sf.invariantViolationsCount}\n`);
  console.log('----------------------------------------');
  console.log('AGENT PERFORMANCE');
  console.log('----------------------------------------\n');
  console.log(`First Attempt Recovery:`);
  console.log(`${ag.firstAttemptRecoveryRatePercent.toFixed(2)}%\n`);
  console.log(`Fallback Invocation:`);
  console.log(`${ag.fallbackInvocationRatePercent.toFixed(2)}%\n`);
  console.log(`Fallback Success:`);
  console.log(`${ag.fallbackSuccessRatePercent.toFixed(2)}%\n`);
  console.log(`Recovered Through Fallback:`);
  console.log(`${formatPaise(ag.recoveredThroughFallbackPaise)}\n`);
  console.log(`Maximum Attempt Stops:`);
  console.log(`${ag.maxAttemptStopsCount}\n`);
  console.log('----------------------------------------');
  console.log('BASELINE');
  console.log('----------------------------------------\n');
  console.log(`Baseline Net Recovery:`);
  console.log(`${formatPaise(comp.baseline.netRecoveredPaise)}\n`);
  console.log(`Salvo Net Recovery:`);
  console.log(`${formatPaise(comp.salvo.netRecoveredPaise)}\n`);
  console.log(`Additional Net Recovery:`);
  console.log(`${formatPaise(comp.comparison.additionalNetRecoveryPaise)}\n`);
  console.log(`Net Improvement:`);
  console.log(`${comp.comparison.netImprovementPercent.toFixed(2)}%\n`);
  console.log('========================================\n');
  console.log(`  Artifacts Saved:`);
  console.log(`    • e2e-results.json:      ${e2eResultsPath}`);
  console.log(`    • benchmark-report.json: ${benchmarkReportPath}`);
  console.log(`  Completed in ${durationSec}s.\n`);

  if (!invariantReport.valid) {
    console.error('❌ SAFETY INVARIANT AUDIT FAILED! Violations detected:');
    for (const v of invariantReport.checkResults.filter((c) => !c.passed)) {
      console.error(`   - [Invariant ${v.invariantId}] ${v.name}:`);
      for (const item of v.violations) {
        console.error(`       • ${item}`);
      }
    }
    process.exit(1);
  }
}

runE2ERunner().catch((err: unknown) => {
  console.error('[e2e] Fatal error during E2E validation:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
