/**
 * src/index.ts
 *
 * Salvo — Backend Entry Point
 *
 * This file is the target of `npm run dev`.
 * It will be expanded in later phases to run the full recovery pipeline.
 *
 * Current state: validates configuration and prints a startup banner.
 */

import 'dotenv/config';
import { AI_CONFIG } from './lib/gemini.js';

function printBanner(): void {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   SALVO — AI Revenue Recovery Agent  ║');
  console.log('  ║   Razorpay AI Buildathon             ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  console.log('  Diagnosis model:', AI_CONFIG.diagnosisModel);
  console.log('  Explanation model:', AI_CONFIG.explanationModel);
  console.log('');
  console.log('  Architecture:');
  console.log('    Gemini → Diagnose & Plan → Policy Gate → Execute → Razorpay');
  console.log('');
  console.log('  Status: Initialised. Ready for Phase 1 (Seed + Schema).');
  console.log('');
}

printBanner();
