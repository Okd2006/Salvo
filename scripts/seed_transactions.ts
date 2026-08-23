/**
 * scripts/seed_transactions.ts
 *
 * Deterministic Synthetic Transaction Seeder for Salvo
 *
 * Usage:
 *   npm run seed
 *
 * Configurable via .env:
 *   DATASET_SEED=salvo-buildathon-v1
 *   DATASET_SIZE=1350
 *   MONGODB_URI=...
 */

import 'dotenv/config';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import {
  saveTransactions,
  saveRecoveryActions,
  saveAuditLogs,
} from '../src/db/repository.js';
import { closeMongoClient, isMongoConfigured } from '../src/db/mongo.js';
import { formatPaise } from '../src/lib/currency.js';

async function runSeed(): Promise<void> {
  const seed = process.env.DATASET_SEED || 'salvo-buildathon-v1';
  const count = parseInt(process.env.DATASET_SIZE || '1350', 10);

  console.log('\n========================================');
  console.log('  SALVO — SYNTHETIC DATASET SEEDER');
  console.log('========================================\n');
  console.log(`  Seed Key:         ${seed}`);
  console.log(`  Target Records:   ${count.toLocaleString('en-IN')}`);
  console.log(`  Storage Target:   ${isMongoConfigured() ? 'MongoDB Atlas' : 'Local Repository (data/*.json)'}`);
  console.log('\n  [1/3] Generating deterministic synthetic transactions...');

  const { transactions, recoveryActions, auditLogs } = generateSyntheticDataset(count, seed);

  const totalFailedPaise = transactions.reduce((s, t) => s + t.amountPaise, 0);
  const totalRecoverablePaise = transactions
    .filter((t) => t.groundTruth.recoverable)
    .reduce((s, t) => s + t.amountPaise, 0);

  console.log(`  [2/3] Generated ${transactions.length.toLocaleString('en-IN')} transactions (${formatPaise(totalFailedPaise)} volume).`);
  console.log(`  [3/3] Persisting dataset to collections...`);

  const txnResult = await saveTransactions(transactions);
  const actResult = await saveRecoveryActions(recoveryActions);
  const auditResult = await saveAuditLogs(auditLogs);

  await closeMongoClient();

  console.log('\n========================================');
  console.log('  SEED COMPLETE (100% REPRODUCIBLE)');
  console.log('========================================');
  console.log(`  • Transactions:     ${txnResult.count.toLocaleString('en-IN')} (Stored: ${txnResult.source})`);
  console.log(`  • Recovery Actions: ${actResult.count.toLocaleString('en-IN')} (Stored: ${actResult.source})`);
  console.log(`  • Audit Logs:       ${auditResult.count.toLocaleString('en-IN')} (Stored: ${auditResult.source})`);
  console.log(`  • Failed Revenue:   ${formatPaise(totalFailedPaise)}`);
  console.log(`  • Recoverable Base: ${formatPaise(totalRecoverablePaise)}`);
  console.log('========================================\n');
}

runSeed().catch((err: unknown) => {
  console.error('[seed] Fatal error during dataset seeding:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
