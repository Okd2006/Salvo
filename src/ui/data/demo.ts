/**
 * src/ui/data/demo.ts
 *
 * DEMO DATA — temporary Stitch prototype values.
 * Replace every value here with real API data in later phases.
 * DO NOT reference these constants from backend code.
 */

// ─── Overview Metrics ─────────────────────────────────────────────────────────
// DEMO DATA: replace with API
export const DEMO_TOTAL_FAILED_PAISE = 1_284_590_000; // ₹1,28,45,900
export const DEMO_RECOVERABLE_PAISE = 845_021_000; // ₹84,50,210
export const DEMO_UNRECOVERABLE_PAISE = 439_569_000; // ₹43,95,690

// ─── Recovery Strategy Table ──────────────────────────────────────────────────
// DEMO DATA: replace with API
export const DEMO_STRATEGIES = [
  {
    id: 'smart-retry',
    icon: 'route',
    label: 'Smart Retry Routing',
    affectedVolume: 452_100,
    potentialRecoveryPaise: 340_025_000,
    successRate: 82.4,
  },
  {
    id: 'fraud-reversal',
    icon: 'account_tree',
    label: 'ML Fraud False-Positive Reversal',
    affectedVolume: 128_450,
    potentialRecoveryPaise: 185_000_000,
    successRate: 64.1,
  },
  {
    id: 'bin-opt',
    icon: 'credit_card',
    label: 'Issuer BIN Optimization',
    affectedVolume: 89_200,
    potentialRecoveryPaise: 98_015_000,
    successRate: 45.8,
  },
  {
    id: 'dunning',
    icon: 'link',
    label: 'Dunning Link Injection',
    affectedVolume: 34_500,
    potentialRecoveryPaise: 42_000_000,
    successRate: 28.2,
  },
] as const;

// ─── Execution Timeline ────────────────────────────────────────────────────────
// DEMO DATA: replace with API
export type ExecutionStatus = 'RECOVERED' | 'EXECUTING' | 'POLICY_CHECK' | 'FAILED' | 'QUEUED';

export interface ExecutionRow {
  timestamp: string;
  txnId: string;
  amountPaise: number;
  status: ExecutionStatus;
}

export const DEMO_EXECUTION_ROWS: ExecutionRow[] = [
  { timestamp: '14:22:01.45', txnId: 'TXN-9982-A4B1-00X', amountPaise: 450_000, status: 'RECOVERED' },
  { timestamp: '14:22:01.12', txnId: 'TXN-7731-C9D2-11Y', amountPaise: 125_050, status: 'EXECUTING' },
  { timestamp: '14:22:00.89', txnId: 'TXN-4410-F2E3-22Z', amountPaise: 89_000, status: 'POLICY_CHECK' },
  { timestamp: '14:21:59.33', txnId: 'TXN-1102-G5H4-33W', amountPaise: 1_240_000, status: 'FAILED' },
  { timestamp: '14:21:59.01', txnId: 'TXN-8829-J6K5-44V', amountPaise: 35_025, status: 'QUEUED' },
  { timestamp: '14:21:58.77', txnId: 'TXN-5541-L7M6-55U', amountPaise: 210_000, status: 'RECOVERED' },
];

export const DEMO_ACTIVE_THREADS = 1_204;
export const DEMO_RECOVERY_RATE = 94.2;

// ─── Simulator Strategies ─────────────────────────────────────────────────────
// DEMO DATA: replace with API
export const DEMO_SIMULATOR_STRATEGIES = [
  {
    id: 'smart-retries',
    icon: 'refresh',
    label: 'Smart Retries',
    sublabel: 'Velocity-adjusted rebilling',
    transactionsAffected: 14_205,
    predictedRecoveryPaise: 24_560_000,
    interventionCostPaise: 142_050,
    netRecoveryPaise: 24_417_950,
    recommended: false,
  },
  {
    id: 'fallback-routing',
    icon: 'alt_route',
    label: 'Fallback Routing',
    sublabel: 'Cross-border gateway pivot',
    transactionsAffected: 8_430,
    predictedRecoveryPaise: 18_245_000,
    interventionCostPaise: 421_500,
    netRecoveryPaise: 17_823_500,
    recommended: false,
  },
  {
    id: 'preemptive-verify',
    icon: 'verified_user',
    label: 'Pre-emptive Verification',
    sublabel: '3D Secure step-up orchestration',
    transactionsAffected: 21_850,
    predictedRecoveryPaise: 41_289_000,
    interventionCostPaise: 874_000,
    netRecoveryPaise: 40_415_000,
    recommended: true,
  },
] as const;

// ─── Audit Records ─────────────────────────────────────────────────────────────
// DEMO DATA: replace with API
export interface AuditRecord {
  txnId: string;
  timestamp: string;
  failureCode: string;
  confidence: number;
  policyResult: string;
  policyPassed: boolean;
  expectedPaise: number;
  actualPaise: number;
  hash: string;
}

export const DEMO_AUDIT_RECORDS: AuditRecord[] = [
  {
    txnId: 'TXN-984A-21X',
    timestamp: '14:02:11.094',
    failureCode: 'BAD_REQUEST_HEADER',
    confidence: 0.99,
    policyResult: 'Override Applied',
    policyPassed: true,
    expectedPaise: 452_000,
    actualPaise: 452_000,
    hash: 'sha256:8f91b42c99a01e3b',
  },
  {
    txnId: 'TXN-984B-33Y',
    timestamp: '14:02:12.110',
    failureCode: 'RATE_LIMIT_EXCEEDED',
    confidence: 0.82,
    policyResult: 'Queued for Retry',
    policyPassed: true,
    expectedPaise: 125_050,
    actualPaise: 0,
    hash: 'sha256:7a42c11b88e12d4a',
  },
  {
    txnId: 'TXN-984C-44Z',
    timestamp: '14:02:15.882',
    failureCode: 'INVALID_CURRENCY_CODE',
    confidence: 0.96,
    policyResult: 'Override Applied',
    policyPassed: true,
    expectedPaise: 98_500,
    actualPaise: 98_500,
    hash: 'sha256:3b19f04c22a101ee',
  },
  {
    txnId: 'TXN-984D-55V',
    timestamp: '14:02:18.210',
    failureCode: 'SUSPICIOUS_VELOCITY',
    confidence: 0.99,
    policyResult: 'Blocked by Safety Gate',
    policyPassed: false,
    expectedPaise: 450_000,
    actualPaise: 0,
    hash: 'sha256:91c002ff11a88c2b',
  },
];

// ─── Diagnosis Demo ────────────────────────────────────────────────────────────
// DEMO DATA: replace with API (Gemini diagnosis response)
export const DEMO_DIAGNOSIS = {
  id: 'DIA-8892-A',
  rootCause:
    'Detected anomalous latency spikes in the Razorpay API endpoint starting at 08:14 UTC. This caused authorization timeouts resulting in elevated involuntary churn on recurring subscription renewals.',
  affectedTransactions: 1_402,
  grossValueImpactPaise: -4_285_000,
  estimatedRecoverablePaise: 3_812_500,
  successRatePercent: 88.9,
  rationale:
    'Based on historical retry success rates for timeout-induced failures via Razorpay.',
} as const;
