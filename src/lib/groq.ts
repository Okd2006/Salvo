/**
 * src/lib/groq.ts
 *
 * Groq Client & Model Abstraction for Salvo
 *
 * Provides server-side access to Groq's OpenAI-compatible Chat Completions API.
 * Uses Groq strict Structured Outputs with JSON Schema (e.g. for openai/gpt-oss-20b).
 *
 * Core Guarantees:
 *  - Strict JSON output mode and runtime Zod validation
 *  - Server-side only (never exposes GROQ_API_KEY to browser)
 *  - Centralized model configuration (GROQ_CONFIG)
 *  - Bounded retry policy for transient network, 429 rate limit, 5xx, and timeout errors (max 2 attempts)
 *  - Strict typed error handling without fake fallbacks
 *  - Non-retryable authentication (401/403) and validation errors
 */

import 'dotenv/config';
import { GeminiRawDiagnosisSchema, type RawGeminiDiagnosis } from './schemas.js';

export type RawLLMDiagnosis = RawGeminiDiagnosis;
export const RawLLMDiagnosisSchema = GeminiRawDiagnosisSchema;

export const GROQ_CONFIG = {
  apiKey: process.env.GROQ_API_KEY || '',
  model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  temperature: 0.1,
  maxTokens: 1024,
  maxRetries: 2,
  timeoutMs: 25000,
} as const;

/**
 * Strict JSON Schema conforming to Groq Structured Outputs specification.
 * All objects specify additionalProperties: false, and all required properties are declared.
 */
export const GROQ_DIAGNOSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    failureType: {
      type: 'string',
      enum: ['temporary', 'customer', 'payment_method', 'risk', 'unrecoverable'],
      description: 'The root cause failure category.',
    },
    recoverability: {
      type: 'number',
      description: 'Probability of successful recovery between 0.0 and 1.0.',
    },
    recommendedStrategy: {
      type: 'string',
      enum: ['smart_retry', 'payment_method_switch', 'payment_link', 'reminder', 'no_action'],
      description: 'The recommended recovery strategy.',
    },
    confidence: {
      type: 'number',
      description: 'Confidence score for this diagnosis between 0.0 and 1.0.',
    },
    evidence: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'List of observed facts and evidence items.',
    },
    reasoning: {
      type: 'string',
      description: 'Clinical rationale for the chosen strategy.',
    },
    predictedRecoveryPercentage: {
      type: ['number', 'null'],
      description: 'Optional expected recovery ratio between 0.0 and 1.0.',
    },
    estimatedRecoveryPaise: {
      type: ['integer', 'null'],
      description: 'Optional raw estimated recoverable amount in integer paise.',
    },
    recommendedInterventionCostPaise: {
      type: ['integer', 'null'],
      description: 'Optional estimated intervention cost in integer paise.',
    },
  },
  required: [
    'failureType',
    'recoverability',
    'recommendedStrategy',
    'confidence',
    'evidence',
    'reasoning',
    'predictedRecoveryPercentage',
    'estimatedRecoveryPaise',
    'recommendedInterventionCostPaise',
  ],
  additionalProperties: false,
};

export function isGroqConfigured(): boolean {
  const key = process.env.GROQ_API_KEY;
  return Boolean(
    key &&
      key.trim() !== '' &&
      !key.startsWith('gsk_placeholder') &&
      !key.startsWith('your_')
  );
}

export function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (
    !key ||
    key.trim() === '' ||
    key.startsWith('gsk_placeholder') ||
    key.startsWith('your_')
  ) {
    throw new GroqConfigError(
      'GROQ_API_KEY is not configured in .env. Please configure a valid Groq API key.'
    );
  }
  return key.trim();
}

export function getGroqModel(): string {
  return process.env.GROQ_MODEL?.trim() || GROQ_CONFIG.model;
}

/**
 * Execute structured diagnosis via Groq Chat Completions API with strict JSON schema.
 */
export async function executeGroqDiagnosis(
  prompt: string,
  systemInstruction?: string,
  options?: { apiKey?: string; model?: string; baseUrl?: string }
): Promise<RawLLMDiagnosis> {
  const apiKey = options?.apiKey || getGroqApiKey();
  const model = options?.model || getGroqModel();
  const baseUrl = (options?.baseUrl || process.env.GROQ_BASE_URL || GROQ_CONFIG.baseUrl).replace(/\/+$/, '');

  return withBoundedRetry(async (attempt) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, GROQ_CONFIG.timeoutMs);

    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      let response: Response;
      try {
        response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: GROQ_CONFIG.temperature,
            max_tokens: GROQ_CONFIG.maxTokens,
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'recovery_recommendation',
                strict: true,
                schema: GROQ_DIAGNOSIS_JSON_SCHEMA,
              },
            },
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if ((fetchErr as Error).name === 'AbortError') {
          throw new GroqTimeoutError(
            `Groq request timed out after ${GROQ_CONFIG.timeoutMs}ms (attempt ${attempt})`
          );
        }
        throw new GroqNetworkError(
          `Groq network connection error: ${(fetchErr as Error).message}`
        );
      } finally {
        clearTimeout(timer);
      }

      // Handle HTTP status codes
      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {
          errorBody = response.statusText;
        }

        let parsedErrorMsg = errorBody;
        try {
          const parsed = JSON.parse(errorBody);
          if (parsed.error?.message) {
            parsedErrorMsg = parsed.error.message;
          }
        } catch {
          // Keep raw errorBody
        }

        if (response.status === 401 || response.status === 403) {
          throw new GroqAuthError(
            `Groq authentication failed (HTTP ${response.status}): ${parsedErrorMsg}`
          );
        }

        if (response.status === 429) {
          throw new GroqRateLimitError(
            `Groq rate limit exceeded (HTTP 429): ${parsedErrorMsg}`
          );
        }

        if (response.status >= 500) {
          throw new GroqApiError(
            `Groq server error (HTTP ${response.status}): ${parsedErrorMsg}`,
            response.status
          );
        }

        throw new GroqApiError(
          `Groq API error (HTTP ${response.status}): ${parsedErrorMsg}`,
          response.status
        );
      }

      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new GroqValidationError(
          `Failed to parse Groq response envelope as JSON: ${(jsonErr as Error).message}`
        );
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new GroqValidationError('Groq returned an empty message content.');
      }

      const rawText = content.trim();

      // Strict JSON parsing
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new GroqValidationError(
          `Groq output is not valid JSON: ${(jsonErr as Error).message}. Raw text: ${rawText.slice(0, 150)}`
        );
      }

      // Validate against strict Zod schema
      const validated = RawLLMDiagnosisSchema.safeParse(parsed);
      if (!validated.success) {
        throw new GroqValidationError(
          `Groq response failed schema validation: ${validated.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }

      return validated.data;
    } catch (err) {
      if (
        err instanceof GroqConfigError ||
        err instanceof GroqAuthError ||
        err instanceof GroqValidationError
      ) {
        throw err; // Non-retryable
      }
      throw err;
    }
  }, 'Groq Structured Diagnosis');
}

/**
 * Generate a merchant-facing explanation using Groq.
 */
export async function executeGroqExplanation(
  prompt: string,
  systemInstruction?: string,
  options?: { apiKey?: string; model?: string; baseUrl?: string }
): Promise<string> {
  const apiKey = options?.apiKey || getGroqApiKey();
  const model = options?.model || getGroqModel();
  const baseUrl = (options?.baseUrl || GROQ_CONFIG.baseUrl).replace(/\/+$/, '');

  return withBoundedRetry(async (attempt) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, GROQ_CONFIG.timeoutMs);

    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      let response: Response;
      try {
        response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
            max_tokens: 512,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if ((fetchErr as Error).name === 'AbortError') {
          throw new GroqTimeoutError(
            `Groq explanation timed out after ${GROQ_CONFIG.timeoutMs}ms (attempt ${attempt})`
          );
        }
        throw new GroqNetworkError(
          `Groq explanation connection error: ${(fetchErr as Error).message}`
        );
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw new GroqAuthError(`Groq auth failed (HTTP ${response.status}): ${errorText}`);
        }
        if (response.status === 429) {
          throw new GroqRateLimitError(`Groq rate limit (HTTP 429): ${errorText}`);
        }
        throw new GroqApiError(`Groq API error (HTTP ${response.status}): ${errorText}`, response.status);
      }

      const data: any = await response.json();
      return (data?.choices?.[0]?.message?.content || '').trim();
    } finally {
      clearTimeout(timer);
    }
  }, 'Groq Explanation');
}

/**
 * Bounded Retry Helper for Groq
 * Max 2 attempts. Retries only transient network, 429 rate limit, timeout, and 5xx server errors.
 */
async function withBoundedRetry<T>(
  fn: (attempt: number) => Promise<T>,
  operationLabel: string
): Promise<T> {
  const maxAttempts = GROQ_CONFIG.maxRetries;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;

      // Do NOT retry non-retryable errors
      if (
        err instanceof GroqConfigError ||
        err instanceof GroqAuthError ||
        err instanceof GroqValidationError
      ) {
        throw err;
      }

      if (attempt < maxAttempts) {
        const delayMs = 600 * attempt;
        await sleep(delayMs);
      }
    }
  }

  throw new GroqError(
    `${operationLabel} failed after ${maxAttempts} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// Error Classes
export class GroqError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroqError';
  }
}

export class GroqConfigError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqConfigError';
  }
}

export class GroqAuthError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqAuthError';
  }
}

export class GroqValidationError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqValidationError';
  }
}

export class GroqRateLimitError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqRateLimitError';
  }
}

export class GroqTimeoutError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqTimeoutError';
  }
}

export class GroqNetworkError extends GroqError {
  constructor(message: string) {
    super(message);
    this.name = 'GroqNetworkError';
  }
}

export class GroqApiError extends GroqError {
  public statusCode?: number | undefined;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'GroqApiError';
    this.statusCode = statusCode;
  }
}
