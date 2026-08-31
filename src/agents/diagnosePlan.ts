/**
 * src/agents/diagnosePlan.ts
 *
 * Diagnose & Plan Agent for Salvo
 *
 * Core Workflow:
 *  1. Accepts an ObservableTransaction (strict observation boundary)
 *  2. Delegates to provider-agnostic LLM interface (src/lib/llm.ts)
 *  3. Enforces strict financial clamping (0 <= predictedRecoveryPaise <= amountPaise)
 *  4. Validates output with Zod RecoveryRecommendationSchema
 *  5. Creates pending RecoveryActionDocument and diagnosis_created AuditLogDocument
 *
 * SAFETY GUARANTEES:
 *  - LLM NEVER executes transactions or calls Razorpay APIs
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
} from '../types/index.js';
import { toObservableTransaction } from './observation.js';
import {
  diagnose,
  getActiveModelName,
  SALVO_DIAGNOSIS_SYSTEM_PROMPT,
  buildObservablePrompt,
  getDefaultInterventionCostPaise,
} from '../lib/llm.js';

// Re-export for backward compatibility
export {
  SALVO_DIAGNOSIS_SYSTEM_PROMPT,
  buildObservablePrompt,
  getDefaultInterventionCostPaise,
};

// ─── Single Diagnosis Core Function ──────────────────────────────────────────

/**
 * Diagnoses a single observable transaction using the configured LLM provider.
 * Throws typed LLMError on failure without returning fake fallback recommendations.
 */
export async function diagnosePlan(
  observable: ObservableTransaction
): Promise<RecoveryRecommendation> {
  return await diagnose(observable);
}

// ─── Transaction Full Pipeline Wrapper ───────────────────────────────────────

export interface DiagnosisOutput {
  recommendation: RecoveryRecommendation;
  action: RecoveryActionDocument;
  auditLog: AuditLogDocument;
}

/**
 * Process a TransactionDocument: extracts observable view, calls LLM, and builds
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
      model: getActiveModelName(),
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

// ─── Batch Helper ────────────────────────────────────────────────────────────

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
