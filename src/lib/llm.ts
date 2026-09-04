/**
 * src/lib/llm.ts
 *
 * Provider-Agnostic LLM Interface for Salvo
 *
 * Supports Groq (default/primary), OpenRouter, and Gemini providers with unified
 * error handling, strict observation boundary enforcement, financial clamping invariants,
 * and runtime Zod validation.
 *
 * Main Interface:
 *  diagnose(transaction: ObservableTransaction): Promise<RecoveryRecommendation>
 */

import 'dotenv/config';
import type {
  ObservableTransaction,
  RecoveryRecommendation,
  RecoveryStrategy,
} from '../types/index.js';
import { assertNoGroundTruthLeakage } from '../agents/observation.js';
import {
  GeminiRawDiagnosisSchema,
  RecoveryRecommendationSchema,
  type RawGeminiDiagnosis,
} from './schemas.js';
import { formatPaise } from './currency.js';
import {
  isGroqConfigured,
  executeGroqDiagnosis,
  executeGroqExplanation,
  getGroqModel,
  GroqConfigError,
  GroqAuthError,
  GroqValidationError,
  GroqTimeoutError,
  GroqRateLimitError,
  GroqError,
} from './groq.js';
import {
  isOpenRouterConfigured,
  executeOpenRouterDiagnosis,
  executeOpenRouterExplanation,
  getOpenRouterModel,
  OpenRouterConfigError,
  OpenRouterAuthError,
  OpenRouterValidationError,
  OpenRouterTimeoutError,
  OpenRouterRateLimitError,
  OpenRouterError,
} from './openrouter.js';
import {
  isGeminiConfigured,
  executeStructuredDiagnosis as executeGeminiDiagnosis,
  executeMerchantExplanation as executeGeminiExplanation,
  AI_CONFIG as GEMINI_CONFIG,
  GeminiConfigError,
  GeminiValidationError,
  GeminiTimeoutError,
  GeminiError,
} from './gemini.js';

export type LLMProvider = 'groq' | 'openrouter' | 'gemini';
export type RawLLMDiagnosis = RawGeminiDiagnosis;
export const RawLLMDiagnosisSchema = GeminiRawDiagnosisSchema;

// System Prompt
export const SALVO_DIAGNOSIS_SYSTEM_PROMPT = `You are Salvo, an autonomous revenue recovery intelligence system built for payment gateways and merchants.

Your job is to diagnose why a payment failed or was abandoned and recommend the safest appropriate recovery strategy.

Operational Directives:
1. You may recommend an action.
2. If the failure is permanent, unrecoverable, or suspected fraudulent, you MUST recommend 'no_action' with recoverability 0.0.
3. Every recommendation is deterministically audited and gated by Salvo's Policy Engine. High risk actions will be blocked.
4. Return ONLY structured data strictly adhering to the requested schema. Never output markdown fences or commentary.`;

/**
 * Returns the currently active LLM provider based on environment configuration.
 * Supported values: 'groq' | 'openrouter' | 'gemini'
 */
export function getLLMProvider(): LLMProvider {
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (explicit === 'groq') return 'groq';
  if (explicit === 'openrouter') return 'openrouter';
  if (explicit === 'gemini') return 'gemini';

  // Default provider resolution: groq > openrouter > gemini
  if (isGroqConfigured()) return 'groq';
  if (isOpenRouterConfigured()) return 'openrouter';
  if (isGeminiConfigured()) return 'gemini';
  return 'groq';
}

/**
 * Checks if the currently active LLM provider has valid API credentials configured.
 */
export function isLLMConfigured(): boolean {
  const provider = getLLMProvider();
  if (provider === 'groq') {
    return isGroqConfigured();
  }
  if (provider === 'gemini') {
    return isGeminiConfigured();
  }
  return isOpenRouterConfigured();
}

/**
 * Returns the active model identifier string (for logs, reports, and audit trails).
 */
export function getActiveModelName(): string {
  const provider = getLLMProvider();
  if (provider === 'groq') {
    return getGroqModel();
  }
  if (provider === 'gemini') {
    return process.env.GEMINI_MODEL || GEMINI_CONFIG.diagnosisModel;
  }
  return getOpenRouterModel();
}

/**
 * Primary LLM Interface Method:
 * Diagnoses a single ObservableTransaction and produces a validated RecoveryRecommendation.
 *
 * Strict Guarantees:
 *  - Enforces observation boundary and checks for ground truth leakage
 *  - Calls active LLM provider (Groq by default when configured)
 *  - Application-level deterministic clamping (0 <= predictedRecoveryPaise <= amountPaise)
 *  - Strict integer paise arithmetic for all financial fields
 *  - Runtime Zod validation against RecoveryRecommendationSchema
 */
export async function diagnose(
  transaction: ObservableTransaction
): Promise<RecoveryRecommendation> {
  // 1. Assert no ground truth leakage in the input object
  assertNoGroundTruthLeakage(transaction);

  // 2. Build sanitized prompt
  const prompt = buildObservablePrompt(transaction);

  // 3. Assert no ground truth leakage in the generated prompt
  assertNoGroundTruthLeakage(prompt);

  // 4. Dispatch to structured diagnosis
  const rawDiagnosis = await executeStructuredDiagnosis(prompt, SALVO_DIAGNOSIS_SYSTEM_PROMPT);

  // 5. Financial Calculations & Clamping (Application-level determinism)
  let predictedRecoveryPaise: number;
  if (rawDiagnosis.recommendedStrategy === 'no_action' || rawDiagnosis.recoverability === 0) {
    predictedRecoveryPaise = 0;
  } else if (rawDiagnosis.estimatedRecoveryPaise !== undefined && rawDiagnosis.estimatedRecoveryPaise !== null) {
    // Validate & clamp model-estimated paise between 0 and transaction amount
    predictedRecoveryPaise = Math.max(
      0,
      Math.min(transaction.amountPaise, rawDiagnosis.estimatedRecoveryPaise)
    );
  } else {
    // Deterministic arithmetic from recoverability probability
    predictedRecoveryPaise = Math.round(transaction.amountPaise * rawDiagnosis.recoverability);
  }

  // Hard safety invariant: Predicted recovery can NEVER exceed the transaction amount
  predictedRecoveryPaise = Math.max(0, Math.min(transaction.amountPaise, predictedRecoveryPaise));

  // Determine intervention cost in integer paise
  let recommendedInterventionCostPaise = 0;
  if (rawDiagnosis.recommendedStrategy !== 'no_action') {
    if (rawDiagnosis.recommendedInterventionCostPaise !== undefined && rawDiagnosis.recommendedInterventionCostPaise !== null) {
      recommendedInterventionCostPaise = Math.max(0, rawDiagnosis.recommendedInterventionCostPaise);
    } else {
      recommendedInterventionCostPaise = getDefaultInterventionCostPaise(rawDiagnosis.recommendedStrategy);
    }
  }

  const recommendationPayload: RecoveryRecommendation = {
    transactionId: transaction.transactionId,
    failureType: rawDiagnosis.failureType,
    recoverability: rawDiagnosis.recoverability,
    recommendedStrategy: rawDiagnosis.recommendedStrategy,
    confidence: rawDiagnosis.confidence,
    evidence:
      rawDiagnosis.evidence.length > 0
        ? rawDiagnosis.evidence
        : ['Automated telemetry classification'],
    reasoning: rawDiagnosis.reasoning,
    predictedRecoveryPaise,
    recommendedInterventionCostPaise,
  };

  // 6. Strict runtime schema validation
  const validated = RecoveryRecommendationSchema.parse(recommendationPayload);

  return validated;
}

/**
 * Provider-agnostic structured diagnosis dispatcher.
 */
export async function executeStructuredDiagnosis(
  prompt: string,
  systemInstruction?: string
): Promise<RawLLMDiagnosis> {
  const provider = getLLMProvider();

  try {
    if (provider === 'groq') {
      return await executeGroqDiagnosis(prompt, systemInstruction);
    }
    if (provider === 'gemini') {
      return await executeGeminiDiagnosis(prompt, systemInstruction);
    }
    return await executeOpenRouterDiagnosis(prompt, systemInstruction);
  } catch (err) {
    // Normalize errors into unified LLM error hierarchy
    if (
      err instanceof GroqConfigError ||
      err instanceof OpenRouterConfigError ||
      err instanceof GeminiConfigError
    ) {
      throw new LLMConfigError(err.message);
    }
    if (err instanceof GroqAuthError || err instanceof OpenRouterAuthError) {
      throw new LLMAuthError(err.message);
    }
    if (
      err instanceof GroqValidationError ||
      err instanceof OpenRouterValidationError ||
      err instanceof GeminiValidationError
    ) {
      throw new LLMValidationError(err.message);
    }
    if (err instanceof GroqRateLimitError || err instanceof OpenRouterRateLimitError) {
      throw new LLMRateLimitError(err.message);
    }
    if (
      err instanceof GroqTimeoutError ||
      err instanceof OpenRouterTimeoutError ||
      err instanceof GeminiTimeoutError
    ) {
      throw new LLMTimeoutError(err.message);
    }
    if (
      err instanceof GroqError ||
      err instanceof OpenRouterError ||
      err instanceof GeminiError
    ) {
      throw new LLMError(err.message);
    }
    throw err;
  }
}

/**
 * Provider-agnostic narrative explanation dispatcher.
 */
export async function executeMerchantExplanation(
  prompt: string,
  systemInstruction?: string,
  options?: {
    messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  }
): Promise<string> {
  const provider = getLLMProvider();

  try {
    if (provider === 'groq') {
      return await executeGroqExplanation(prompt, systemInstruction, options?.messages ? { messages: options.messages } : undefined);
    }
    if (provider === 'gemini') {
      return await executeGeminiExplanation(prompt, systemInstruction);
    }
    return await executeOpenRouterExplanation(prompt, systemInstruction);
  } catch (err) {
    // If primary provider fails and another provider is configured, attempt fallback
    if (provider === 'groq') {
      try {
        const { isGeminiConfigured, executeMerchantExplanation: executeGeminiExp } = await import('./gemini.js');
        if (isGeminiConfigured()) {
          return await executeGeminiExp(prompt, systemInstruction);
        }
      } catch {
        // Fallback provider attempt failed, proceed to error classification
      }
    }

    if (
      err instanceof GroqConfigError ||
      err instanceof OpenRouterConfigError ||
      err instanceof GeminiConfigError
    ) {
      throw new LLMConfigError(err.message);
    }
    if (err instanceof GroqAuthError || err instanceof OpenRouterAuthError) {
      throw new LLMAuthError(err.message);
    }
    if (
      err instanceof GroqValidationError ||
      err instanceof OpenRouterValidationError ||
      err instanceof GeminiValidationError
    ) {
      throw new LLMValidationError(err.message);
    }
    throw new LLMError((err as Error).message);
  }
}

export function buildObservablePrompt(obs: ObservableTransaction): string {
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

Analyze the root cause and return ONLY a single valid raw JSON object matching the required schema. Do NOT wrap in markdown fences.`;
}

export function getDefaultInterventionCostPaise(strategy: RecoveryStrategy): number {
  switch (strategy) {
    case 'smart_retry':
      return 150; // ₹1.50
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

// Unified LLM Error Classes
export class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMError';
  }
}

export class LLMConfigError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'LLMConfigError';
  }
}

export class LLMAuthError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'LLMAuthError';
  }
}

export class LLMValidationError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'LLMValidationError';
  }
}

export class LLMTimeoutError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'LLMTimeoutError';
  }
}

export class LLMRateLimitError extends LLMError {
  constructor(message: string) {
    super(message);
    this.name = 'LLMRateLimitError';
  }
}
