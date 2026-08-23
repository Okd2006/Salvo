/**
 * src/agents/diagnosePlan.ts
 *
 * Gemini Diagnose & Plan Agent for Salvo
 *
 * Core Workflow:
 *  1. Accepts an ObservableTransaction (strict observation boundary)
 *  2. Constructs prompt with NO ground truth leakage
 *  3. Calls Gemini for structured JSON schema diagnosis
 *  4. Enforces strict financial clamping (0 <= predictedRecoveryPaise <= amountPaise)
 *  5. Validates output with Zod RecoveryRecommendationSchema
 *  6. Creates pending RecoveryActionDocument and diagnosis_created AuditLogDocument
 *
 * SAFETY GUARANTEES:
 *  - Gemini NEVER executes transactions or calls Razorpay APIs
 *  - Policy Gate remains the final gatekeeper (policyStatus is initially 'pending')
 *  - No fake fallback recommendations on AI failure
 */

import { randomUUID } from 'node:crypto';
import type {
  TransactionDocument,
  ObservableTransaction,
  RecoveryRecommendation,
  RecoveryActionDocument,
  AuditLogDocument,
  RecoveryStrategy,
} from '../types/index.js';
import { toObservableTransaction, assertNoGroundTruthLeakage } from './observation.js';
import { executeStructuredDiagnosis, AI_CONFIG } from '../lib/gemini.js';
import { RecoveryRecommendationSchema } from '../lib/schemas.js';
import { formatPaise } from '../lib/currency.js';

// ─── System Prompt ────────────────────────────────────────────────────────────

export const SALVO_DIAGNOSIS_SYSTEM_PROMPT = `You are Salvo, an autonomous revenue recovery intelligence system built for payment gateways and merchants.

Your job is to diagnose why a payment failed or was abandoned and recommend the safest appropriate recovery strategy.

Operational Directives:
1. You may recommend an action.
2. You do NOT execute actions.
3. You do NOT override safety policies.
4. You must base your diagnosis and recommendation ONLY on the observable transaction metadata and customer history provided.
5. Base intervention cost recommendations in integer paise (e.g., ₹1.50 = 150 paise, ₹3.00 = 300 paise).
6. Provide concise, executive evidence (1 to 4 bullet points) suitable for merchant ledger auditability.

Strategy Guidelines:
- "smart_retry": Appropriate for transient network latency, gateway timeouts, and temporary bank switch throttles.
- "payment_method_switch": Appropriate when the card/instrument has expired, BIN is blocked, or recurring mandate limits are exceeded.
- "payment_link": Appropriate for insufficient funds, checkout abandonment, or expired sessions where a fresh payment flow is optimal.
- "reminder": Appropriate when the customer dropped during OTP/3DS verification or biometric challenge.
- "no_action": Appropriate when suspected fraud/risk is detected or the instrument/account is permanently unrecoverable.`;

// ─── Single Diagnosis Core Function ───────────────────────────────────────────

/**
 * Diagnoses a single observable transaction using Gemini AI.
 * Throws typed GeminiError on failure without returning fake fallback recommendations.
 */
export async function diagnosePlan(
  observable: ObservableTransaction
): Promise<RecoveryRecommendation> {
  // 1. Build prompt containing only observable data
  const prompt = buildObservablePrompt(observable);

  // 2. Assert no ground truth leakage in the prompt
  assertNoGroundTruthLeakage(prompt);

  // 3. Call Gemini with native structured schema
  const rawDiagnosis = await executeStructuredDiagnosis(prompt, SALVO_DIAGNOSIS_SYSTEM_PROMPT);

  // 4. Financial Calculations & Clamping (Application-level determinism)
  // Derive expected recovery deterministically: amountPaise * recoverability
  let predictedRecoveryPaise: number;
  if (rawDiagnosis.recommendedStrategy === 'no_action' || rawDiagnosis.recoverability === 0) {
    predictedRecoveryPaise = 0;
  } else if (rawDiagnosis.estimatedRecoveryPaise !== undefined) {
    // Validate & clamp model-estimated paise between 0 and transaction amount
    predictedRecoveryPaise = Math.max(
      0,
      Math.min(observable.amountPaise, rawDiagnosis.estimatedRecoveryPaise)
    );
  } else {
    // Deterministic arithmetic from recoverability probability
    predictedRecoveryPaise = Math.round(observable.amountPaise * rawDiagnosis.recoverability);
  }

  // Hard safety invariant: Predicted recovery can NEVER exceed the transaction amount
  predictedRecoveryPaise = Math.max(0, Math.min(observable.amountPaise, predictedRecoveryPaise));

  // Determine intervention cost in integer paise
  let recommendedInterventionCostPaise = 0;
  if (rawDiagnosis.recommendedStrategy !== 'no_action') {
    if (rawDiagnosis.recommendedInterventionCostPaise !== undefined) {
      recommendedInterventionCostPaise = Math.max(0, rawDiagnosis.recommendedInterventionCostPaise);
    } else {
      // Default heuristic cost in paise based on strategy
      recommendedInterventionCostPaise = getDefaultInterventionCostPaise(rawDiagnosis.recommendedStrategy);
    }
  }

  const recommendationPayload: RecoveryRecommendation = {
    transactionId: observable.transactionId,
    failureType: rawDiagnosis.failureType,
    recoverability: rawDiagnosis.recoverability,
    recommendedStrategy: rawDiagnosis.recommendedStrategy,
    confidence: rawDiagnosis.confidence,
    evidence: rawDiagnosis.evidence.length > 0 ? rawDiagnosis.evidence : ['Automated telemetry classification'],
    reasoning: rawDiagnosis.reasoning,
    predictedRecoveryPaise,
    recommendedInterventionCostPaise,
  };

  // 5. Strict runtime schema validation
  const validated = RecoveryRecommendationSchema.parse(recommendationPayload);

  return validated;
}

// ─── Transaction Full Pipeline Wrapper ────────────────────────────────────────

export interface DiagnosisOutput {
  recommendation: RecoveryRecommendation;
  action: RecoveryActionDocument;
  auditLog: AuditLogDocument;
}

/**
 * Process a TransactionDocument: extracts observable view, calls Gemini, and builds
 * corresponding database documents (recovery_action with policyStatus 'pending' and audit_log).
 */
export async function diagnoseTransaction(
  txn: TransactionDocument
): Promise<DiagnosisOutput> {
  const observable = toObservableTransaction(txn);
  const recommendation = await diagnosePlan(observable);

  const actionId = `act_${recommendation.transactionId}_${Date.now()}`;
  const now = new Date().toISOString();

  // Build RecoveryAction document
  const action: RecoveryActionDocument = {
    actionId,
    transactionId: recommendation.transactionId,
    strategy: recommendation.recommendedStrategy,
    predictedRecoveryPaise: recommendation.predictedRecoveryPaise,
    actualRecoveryPaise: 0,
    interventionCostPaise: recommendation.recommendedInterventionCostPaise,
    confidence: recommendation.confidence,
    policyStatus: 'pending', // Pending Policy Gate check in next phase
    executionStatus: 'not_executed',
    evidence: recommendation.evidence,
    reasoning: recommendation.reasoning,
    diagnosis: recommendation,
    createdAt: now,
    executedAt: null,
  };

  // Build AuditLog document
  const auditLog: AuditLogDocument = {
    eventId: `evt_${recommendation.transactionId}_diag_${randomUUID().slice(0, 8)}`,
    transactionId: recommendation.transactionId,
    eventType: 'diagnosis_created',
    actor: 'gemini_agent',
    details: {
      actionId,
      failureType: recommendation.failureType,
      recommendedStrategy: recommendation.recommendedStrategy,
      confidence: recommendation.confidence,
      recoverability: recommendation.recoverability,
      predictedRecoveryPaise: recommendation.predictedRecoveryPaise,
      model: AI_CONFIG.diagnosisModel,
      evidenceCount: recommendation.evidence.length,
    },
    timestamp: now,
  };

  return {
    recommendation,
    action,
    auditLog,
  };
}

// ─── Batch Helper ─────────────────────────────────────────────────────────────

export interface BatchDiagnosisResult {
  successful: DiagnosisOutput[];
  failed: { transactionId: string; error: string }[];
  totalProcessed: number;
}

/**
 * Process a batch of transactions with controlled concurrency and delay to respect API rate limits.
 */
export async function diagnoseBatchTransactions(
  transactions: TransactionDocument[],
  concurrency: number = 3
): Promise<BatchDiagnosisResult> {
  const successful: DiagnosisOutput[] = [];
  const failed: { transactionId: string; error: string }[] = [];

  for (let i = 0; i < transactions.length; i += concurrency) {
    const chunk = transactions.slice(i, i + concurrency);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (t) => {
        return await diagnoseTransaction(t);
      })
    );

    for (let j = 0; j < chunkResults.length; j++) {
      const res = chunkResults[j];
      const txn = chunk[j];
      const txnId = txn.transactionId || txn.id || `txn_${i + j}`;

      if (res.status === 'fulfilled') {
        successful.push(res.value);
      } else {
        failed.push({
          transactionId: txnId,
          error: res.reason instanceof Error ? res.reason.message : String(res.reason),
        });
      }
    }

    // Brief cooldown between chunks
    if (i + concurrency < transactions.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return {
    successful,
    failed,
    totalProcessed: transactions.length,
  };
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function buildObservablePrompt(obs: ObservableTransaction): string {
  const history = obs.customerHistory;
  const amountFormatted = formatPaise(obs.amountPaise);

  return `### FAILED TRANSACTION FOR DIAGNOSIS

**Transaction Details:**
- Transaction ID: ${obs.transactionId}
- Amount: ${amountFormatted} (${obs.amountPaise} paise)
- Currency: ${obs.currency}
- Payment Method: ${obs.paymentMethod}
- Gateway Status: ${obs.status}
- Gateway Failure Code: ${obs.failureCode}
- Failure Category: ${obs.failureCategory}
- Failure Description: ${obs.failureDescription || 'None'}
- Retry Count: ${obs.retryCount}
- Merchant: ${obs.merchantName || 'Merchant'}
- Created At: ${obs.createdAt}

**Observable Customer Profile & History:**
- Customer ID: ${history.customerId}
- Previous Transactions: ${history.previousPayments}
- Successful Payments: ${history.successfulPayments}
- Failed Payments: ${history.previousFailures}
- Historical Retry Success Rate: ${(history.retrySuccessRate * 100).toFixed(1)}%
- Preferred Payment Method: ${history.preferredMethod}
- Average Transaction Volume: ${formatPaise(history.averageTransactionPaise)}
${history.accountAgeDays ? `- Account Age: ${history.accountAgeDays} days` : ''}

Analyze the root cause and provide your structured diagnosis according to the schema.`;
}

function getDefaultInterventionCostPaise(strategy: RecoveryStrategy): number {
  switch (strategy) {
    case 'smart_retry':
      return 150; // ₹1.50
    case 'bank_decline' as unknown as RecoveryStrategy:
      return 200; // ₹2.00
    case 'payment_method_switch':
      return 450; // ₹4.50
    case 'payment_link':
      return 250; // ₹2.50
    case 'reminder':
      return 250; // ₹2.50
    case 'no_action':
    default:
      return 0;
  }
}
