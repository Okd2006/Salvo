/**
 * scripts/evaluate.ts
 *
 * Evaluate Salvo's recovery rate against seeded transaction data.
 *
 * Phase 1 implementation:
 *  - Fetch failed transactions from Supabase
 *  - Run diagnosePlan on each
 *  - Evaluate policy gate results
 *  - Compute recovery rate, revenue recovered, breakdown by failure type
 *  - Print tabular evaluation report
 *
 * Current state: skeleton — exits successfully.
 * Implementation: Phase 1 (after seed data + schema are ready)
 */

import 'dotenv/config';
import type { EvaluationResult } from '../src/types/index.js';

async function evaluate(): Promise<void> {
  console.log('[evaluate] Starting evaluation run...');
  console.log('[evaluate] Phase 1 implementation pending.');
  console.log('[evaluate] Will evaluate recovery rate against seeded transactions.');

  // Stub result — all zeros until Phase 1
  const result: EvaluationResult = {
    totalTransactions: 0,
    diagnosisAttempted: 0,
    recoveryActionsProposed: 0,
    actionsApprovedByGate: 0,
    actionsBlocked: 0,
    actionsExecuted: 0,
    successfulRecoveries: 0,
    totalRecoveredPaise: 0,
    recoveryRatePercent: 0,
    evaluatedAt: new Date().toISOString(),
  };

  console.log('[evaluate] Result:', JSON.stringify(result, null, 2));
  console.log('[evaluate] Done (skeleton).');
}

evaluate().catch((err: unknown) => {
  console.error('[evaluate] Fatal error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
