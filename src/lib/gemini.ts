/**
 * src/lib/gemini.ts
 *
 * Gemini Client & Model Abstraction for Salvo
 *
 * Built using the official current @google/genai SDK.
 *
 * Core Guarantees:
 *  - Native structured output via responseSchema (no markdown fences, no regex parsing)
 *  - Server-side only (never exposes GEMINI_API_KEY to browser)
 *  - Centralized model configuration (AI_CONFIG)
 *  - Bounded retry policy for transient network/rate-limit errors (max 2 attempts)
 *  - Strict typed error handling without fake fallbacks
 *  - Financial integer validation & runtime Zod schema parsing
 */

import 'dotenv/config';
import { GoogleGenAI, Type, type Schema } from '@google/genai';
import { GeminiRawDiagnosisSchema, type RawGeminiDiagnosis } from './schemas.js';

// ─── Centralized Model Configuration ──────────────────────────────────────────

export const AI_CONFIG = {
  /**
   * Fast Flash model appropriate for real-time structured classification & reasoning.
   */
  diagnosisModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',

  /**
   * Natural language narrative explanation model.
   */
  explanationModel: process.env.GEMINI_EXPLANATION_MODEL || 'gemini-2.5-flash',

  temperature: 0.1,
  maxOutputTokens: 1024,
  maxRetries: 2,
  timeoutMs: 25000,
} as const;

// ─── Native Structured Response Schema ────────────────────────────────────────

export const GEMINI_DIAGNOSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  description: 'Structured diagnosis of a failed payment transaction',
  properties: {
    failureType: {
      type: Type.STRING,
      enum: ['temporary', 'customer', 'payment_method', 'risk', 'unrecoverable'],
      description: 'Nature of payment failure',
    },
    recoverability: {
      type: Type.NUMBER,
      description: 'Estimated recovery probability between 0.0 and 1.0',
    },
    recommendedStrategy: {
      type: Type.STRING,
      enum: ['smart_retry', 'payment_method_switch', 'payment_link', 'reminder', 'no_action'],
      description: 'The single best recovery strategy to attempt',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Model confidence score in this diagnosis between 0.0 and 1.0',
    },
    evidence: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Key observable evidence points supporting this diagnosis (at least 1 item)',
    },
    reasoning: {
      type: Type.STRING,
      description: 'Concise executive explanation of root cause and recovery rationale',
    },
    predictedRecoveryPercentage: {
      type: Type.NUMBER,
      description: 'Estimated recovery yield probability (0.0 to 1.0)',
    },
    recommendedInterventionCostPaise: {
      type: Type.INTEGER,
      description: 'Recommended intervention cost in integer paise',
    },
  },
  required: [
    'failureType',
    'recoverability',
    'recommendedStrategy',
    'confidence',
    'evidence',
    'reasoning',
  ],
};

// ─── Client Singleton ─────────────────────────────────────────────────────────

let cachedAiClient: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && !key.startsWith('AIza...'));
}

export function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key.startsWith('AIza...')) {
    throw new GeminiConfigError(
      'GEMINI_API_KEY is not configured in .env. Please configure a valid Gemini API key to run AI diagnoses.'
    );
  }

  if (cachedAiClient) {
    return cachedAiClient;
  }

  cachedAiClient = new GoogleGenAI({ apiKey: key.trim() });
  return cachedAiClient;
}

// ─── Structured Output Invocation with Bounded Retry ──────────────────────────

/**
 * Executes a Gemini structured content generation call with bounded retries.
 */
export async function executeStructuredDiagnosis(
  prompt: string,
  systemInstruction?: string
): Promise<RawGeminiDiagnosis> {
  const ai = getGeminiClient();

  return withBoundedRetry(async (attempt) => {
    try {
      const config: Parameters<typeof ai.models.generateContent>[0]['config'] = {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_DIAGNOSIS_SCHEMA,
        temperature: AI_CONFIG.temperature,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const response = await withTimeout(
        ai.models.generateContent({
          model: AI_CONFIG.diagnosisModel,
          contents: prompt,
          config,
        }),
        AI_CONFIG.timeoutMs,
        `Gemini Structured Diagnosis (attempt ${attempt})`
      );

      const rawText = response.text;
      if (!rawText || rawText.trim() === '') {
        throw new GeminiValidationError('Gemini returned an empty response text.');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new GeminiValidationError(
          `Failed to parse Gemini structured JSON: ${(jsonErr as Error).message}. Raw text: ${rawText.slice(0, 150)}`
        );
      }

      // Validate with Zod schema
      const validated = GeminiRawDiagnosisSchema.safeParse(parsed);
      if (!validated.success) {
        throw new GeminiValidationError(
          `Gemini response failed schema validation: ${validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
        );
      }

      return validated.data;
    } catch (err) {
      // Classify error for retry logic
      if (err instanceof GeminiConfigError || err instanceof GeminiValidationError) {
        throw err; // Non-retryable
      }
      throw err;
    }
  }, 'Gemini Structured Diagnosis');
}

/**
 * Generate a merchant-facing plain text explanation.
 */
export async function executeMerchantExplanation(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const ai = getGeminiClient();

  return withBoundedRetry(async (attempt) => {
    const config: Parameters<typeof ai.models.generateContent>[0]['config'] = {
      temperature: 0.3,
      maxOutputTokens: 512,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await withTimeout(
      ai.models.generateContent({
        model: AI_CONFIG.explanationModel,
        contents: prompt,
        config,
      }),
      AI_CONFIG.timeoutMs,
      `Gemini Narrative (attempt ${attempt})`
    );

    return (response.text || '').trim();
  }, 'Gemini Narrative Explanation');
}

// ─── Bounded Retry & Timeout Helpers ──────────────────────────────────────────

async function withBoundedRetry<T>(
  fn: (attempt: number) => Promise<T>,
  operationLabel: string
): Promise<T> {
  const maxAttempts = AI_CONFIG.maxRetries;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;

      // Do not retry configuration or schema validation errors
      if (err instanceof GeminiConfigError || err instanceof GeminiValidationError) {
        throw err;
      }

      if (attempt < maxAttempts) {
        const delayMs = 600 * attempt;
        await sleep(delayMs);
      }
    }
  }

  throw new GeminiError(
    `${operationLabel} failed after ${maxAttempts} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new GeminiTimeoutError(`${label} timed out after ${ms}ms`));
    }, ms);

    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// ─── Error Classes ────────────────────────────────────────────────────────────

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

export class GeminiConfigError extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiConfigError';
  }
}

export class GeminiValidationError extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiValidationError';
  }
}

export class GeminiTimeoutError extends GeminiError {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiTimeoutError';
  }
}
