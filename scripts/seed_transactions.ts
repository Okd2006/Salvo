/**
 * scripts/seed_transactions.ts
 *
 * Seed synthetic failed transactions into Supabase for development/evaluation.
 *
 * Phase 1 implementation:
 *  - Generate realistic Razorpay-style failed payment records
 *  - Cover all failure categories (network, card, UPI, fraud, abandoned, etc.)
 *  - Insert into Supabase `transactions` table
 *  - Print seed summary
 *
 * Current state: skeleton — exits successfully.
 * Implementation: Phase 1
 */

import 'dotenv/config';

async function seed(): Promise<void> {
  console.log('[seed] Starting transaction seed...');
  console.log('[seed] Phase 1 implementation pending.');
  console.log('[seed] Will generate synthetic Razorpay-style failed transactions.');
  console.log('[seed] Done (skeleton).');
}

seed().catch((err: unknown) => {
  console.error('[seed] Fatal error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
