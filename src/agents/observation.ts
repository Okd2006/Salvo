/**
 * src/agents/observation.ts
 *
 * Observation Boundary & Ground Truth Protection
 *
 * Enforces the strict rule:
 *  Gemini must receive ONLY information observable in a live merchant environment.
 *  Ground truth fields exist strictly for post-hoc evaluation and must NEVER enter
 *  model prompt contexts.
 */

import type {
  TransactionDocument,
  ObservableTransaction,
  ObservableCustomerHistory,
} from '../types/index.js';
import { ObservableTransactionSchema } from '../lib/schemas.js';

export const FORBIDDEN_GROUND_TRUTH_KEYS = [
  'groundTruth',
  'optimalStrategy',
  'expectedRecoveryPaise',
  'shouldIntervene',
  'interventionCostPaise',
  'riskScore',
] as const;

/**
 * Transform a full database TransactionDocument into a sanitized ObservableTransaction DTO.
 * Explicitly strips all ground truth and simulation fields.
 */
export function toObservableTransaction(txn: TransactionDocument): ObservableTransaction {
  const customerHistory: ObservableCustomerHistory = {
    customerId: txn.customerHistory.customerId,
    previousPayments: txn.customerHistory.previousPayments,
    successfulPayments: txn.customerHistory.successfulPayments,
    previousFailures: txn.customerHistory.previousFailures,
    retrySuccessRate: txn.customerHistory.retrySuccessRate,
    preferredMethod: txn.customerHistory.preferredMethod,
    averageTransactionPaise: txn.customerHistory.averageTransactionPaise,
  };

  if (txn.customerHistory.accountAgeDays !== undefined) {
    customerHistory.accountAgeDays = txn.customerHistory.accountAgeDays;
  }

  const observable: ObservableTransaction = {
    transactionId: txn.transactionId || txn.id || '',
    amountPaise: txn.amountPaise,
    currency: txn.currency || 'INR',
    paymentMethod: txn.paymentMethod || txn.method || 'card',
    status: txn.status,
    failureCode: txn.failureCode || txn.errorCode || 'UNKNOWN_FAILURE',
    failureCategory: txn.failureCategory,
    createdAt: txn.createdAt,
    customerHistory,
    retryCount: txn.retryCount ?? 0,
  };

  const desc = txn.failureDescription || txn.errorDescription;
  if (desc) {
    observable.failureDescription = desc;
  }

  if (txn.merchantName) {
    observable.merchantName = txn.merchantName;
  }

  // Validate with Zod schema
  ObservableTransactionSchema.parse(observable);

  // Assert no ground truth leaked
  assertNoGroundTruthLeakage(observable);

  return observable;
}

/**
 * Asserts that an object or prompt payload contains no ground truth keys or values.
 * Throws an error if any forbidden key or ground truth object is detected.
 */
export function assertNoGroundTruthLeakage(target: unknown): void {
  if (!target) return;

  const jsonString = typeof target === 'string' ? target : JSON.stringify(target);

  for (const key of FORBIDDEN_GROUND_TRUTH_KEYS) {
    // Check for "groundTruth" as an object key
    if (jsonString.includes(`"${key}"`) || jsonString.includes(`${key}:`)) {
      throw new Error(
        `[SECURITY ALERT] Ground truth leakage detected! Forbidden key "${key}" found in observation payload.`
      );
    }
  }
}
