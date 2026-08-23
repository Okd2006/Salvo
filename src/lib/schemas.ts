/**
 * src/lib/schemas.ts
 *
 * Runtime Zod Schemas for Salvo
 *
 * Enforces strict validation on:
 *  - ObservableTransaction boundary
 *  - Gemini Structured Output
 *  - Final RecoveryRecommendation object
 *  - Financial integer constraints
 */

import { z } from 'zod';

export const PaymentMethodSchema = z.enum(['card', 'upi', 'netbanking', 'wallet', 'emi']);
export const TransactionStatusSchema = z.enum([
  'failed',
  'abandoned',
  'captured',
  'authorized',
  'refunded',
]);

export const FailureCategorySchema = z.enum([
  'temporary_network_failure',
  'bank_decline',
  'insufficient_funds',
  'authentication_failure',
  'payment_method_issue',
  'customer_abandonment',
  'expired_payment',
  'suspected_risk',
  'unrecoverable',
]);

export const DiagnosisFailureTypeSchema = z.enum([
  'temporary',
  'customer',
  'payment_method',
  'risk',
  'unrecoverable',
]);

export const RecoveryStrategySchema = z.enum([
  'smart_retry',
  'payment_method_switch',
  'payment_link',
  'reminder',
  'no_action',
]);

export const ObservableCustomerHistorySchema = z.object({
  customerId: z.string().min(1),
  previousPayments: z.number().int().nonnegative(),
  successfulPayments: z.number().int().nonnegative(),
  previousFailures: z.number().int().nonnegative(),
  retrySuccessRate: z.number().min(0).max(1),
  preferredMethod: PaymentMethodSchema,
  averageTransactionPaise: z.number().int().nonnegative(),
  accountAgeDays: z.number().int().nonnegative().optional(),
});

export const ObservableTransactionSchema = z.object({
  transactionId: z.string().min(1),
  amountPaise: z.number().int().positive(),
  currency: z.string().min(1),
  paymentMethod: PaymentMethodSchema,
  status: TransactionStatusSchema,
  failureCode: z.string().min(1),
  failureCategory: FailureCategorySchema,
  failureDescription: z.string().optional(),
  createdAt: z.string().min(1),
  customerHistory: ObservableCustomerHistorySchema,
  retryCount: z.number().int().nonnegative(),
  merchantName: z.string().optional(),
  merchantCategory: z.string().optional(),
});

/**
 * Raw structured output schema emitted by Gemini's native JSON schema constraint.
 */
export const GeminiRawDiagnosisSchema = z.object({
  failureType: DiagnosisFailureTypeSchema,
  recoverability: z.number().min(0).max(1),
  recommendedStrategy: RecoveryStrategySchema,
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string().min(1)).min(1, 'Evidence must contain at least one item.'),
  reasoning: z.string().min(1, 'Reasoning must be provided.'),
  predictedRecoveryPercentage: z.number().min(0).max(1).optional(),
  estimatedRecoveryPaise: z.number().int().nonnegative().optional(),
  recommendedInterventionCostPaise: z.number().int().nonnegative().optional(),
});

/**
 * Strict final RecoveryRecommendation schema used throughout the application.
 */
export const RecoveryRecommendationSchema = z.object({
  transactionId: z.string().min(1),
  failureType: DiagnosisFailureTypeSchema,
  recoverability: z.number().min(0).max(1),
  recommendedStrategy: RecoveryStrategySchema,
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string().min(1)).min(1, 'Evidence must contain at least one item.'),
  reasoning: z.string().min(1, 'Reasoning must be provided.'),
  predictedRecoveryPaise: z.number().int().nonnegative(),
  recommendedInterventionCostPaise: z.number().int().nonnegative(),
});

export type RawGeminiDiagnosis = z.infer<typeof GeminiRawDiagnosisSchema>;
