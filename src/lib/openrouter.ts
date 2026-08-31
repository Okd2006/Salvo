/**
 * src/lib/openrouter.ts
 *
 * OpenRouter Client & Model Abstraction for Salvo
 *
 * Provides server-side access to OpenRouter API (e.g. openrouter/free).
 *
 * Core Guarantees:
 *  - Strict JSON output mode and runtime Zod validation
 *  - Server-side only (never exposes OPENROUTER_API_KEY to browser)
 *  - Centralized model configuration (OPENROUTER_CONFIG)
 *  - Bounded retry policy for transient network/rate-limit errors (max 2 attempts)
 *  - Strict typed error handling without fake fallbacks
 *  - Non-retryable authentication (401/403) and validation errors
 */

import 'dotenv/config';
import { GeminiRawDiagnosisSchema, type RawGeminiDiagnosis } from './schemas.js';

export type RawLLMDiagnosis = RawGeminiDiagnosis;
export const RawLLMDiagnosisSchema = GeminiRawDiagnosisSchema;

export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.OPENROUTER_MODEL || 'openrouter/free',
  baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  temperature: 0.1,
  maxTokens: 1024,
  maxRetries: 2,
  timeoutMs: 25000,
} as const;

export function isOpenRouterConfigured(): boolean {
  const key = process.env.OPENROUTER_API_KEY;
  return Boolean(
    key &&
      key.trim() !== '' &&
      !key.startsWith('sk-or-v1-placeholder') &&
      !key.startsWith('your_')
  );
}

export function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (
    !key ||
    key.trim() === '' ||
    key.startsWith('sk-or-v1-placeholder') ||
    key.startsWith('your_')
  ) {
    throw new OpenRouterConfigError(
      'OPENROUTER_API_KEY is not configured in .env. Please configure a valid OpenRouter API key.'
    );
  }
  return key.trim();
}

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || OPENROUTER_CONFIG.model;
}

/**
 * Execute structured diagnosis via OpenRouter.
 */
export async function executeOpenRouterDiagnosis(
  prompt: string,
  systemInstruction?: string,
  options?: { apiKey?: string; model?: string; baseUrl?: string }
): Promise<RawLLMDiagnosis> {
  const apiKey = options?.apiKey || getOpenRouterApiKey();
  const model = options?.model || getOpenRouterModel();
  const baseUrl = (options?.baseUrl || OPENROUTER_CONFIG.baseUrl).replace(/\/+$/, '');

  return withBoundedRetry(async (attempt) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, OPENROUTER_CONFIG.timeoutMs);

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
            'HTTP-Referer': 'https://salvo.dev',
            'X-Title': 'Salvo Revenue Recovery',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: OPENROUTER_CONFIG.temperature,
            max_tokens: OPENROUTER_CONFIG.maxTokens,
            response_format: { type: 'json_object' },
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if ((fetchErr as Error).name === 'AbortError') {
          throw new OpenRouterTimeoutError(
            `OpenRouter request timed out after ${OPENROUTER_CONFIG.timeoutMs}ms (attempt ${attempt})`
          );
        }
        throw new OpenRouterNetworkError(
          `OpenRouter network connection error: ${(fetchErr as Error).message}`
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
          throw new OpenRouterAuthError(
            `OpenRouter authentication failed (HTTP ${response.status}): ${parsedErrorMsg}`
          );
        }

        if (response.status === 429) {
          throw new OpenRouterRateLimitError(
            `OpenRouter rate limit exceeded (HTTP 429): ${parsedErrorMsg}`
          );
        }

        if (response.status >= 500) {
          throw new OpenRouterApiError(
            `OpenRouter server error (HTTP ${response.status}): ${parsedErrorMsg}`,
            response.status
          );
        }

        throw new OpenRouterApiError(
          `OpenRouter API error (HTTP ${response.status}): ${parsedErrorMsg}`,
          response.status
        );
      }

      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new OpenRouterValidationError(
          `Failed to parse OpenRouter response envelope as JSON: ${(jsonErr as Error).message}`
        );
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new OpenRouterValidationError('OpenRouter returned an empty message content.');
      }

      const rawText = content.trim();

      // Strict JSON parsing without regex/markdown stripping loops
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new OpenRouterValidationError(
          `OpenRouter output is not valid JSON: ${(jsonErr as Error).message}. Raw text: ${rawText.slice(0, 150)}`
        );
      }

      // Validate against strict Zod schema
      const validated = RawLLMDiagnosisSchema.safeParse(parsed);
      if (!validated.success) {
        throw new OpenRouterValidationError(
          `OpenRouter response failed schema validation: ${validated.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }

      return validated.data;
    } catch (err) {
      if (
        err instanceof OpenRouterConfigError ||
        err instanceof OpenRouterAuthError ||
        err instanceof OpenRouterValidationError
      ) {
        throw err; // Non-retryable
      }
      throw err;
    }
  }, 'OpenRouter Structured Diagnosis');
}

/**
 * Generate a merchant-facing explanation using OpenRouter.
 */
export async function executeOpenRouterExplanation(
  prompt: string,
  systemInstruction?: string,
  options?: { apiKey?: string; model?: string; baseUrl?: string }
): Promise<string> {
  const apiKey = options?.apiKey || getOpenRouterApiKey();
  const model = options?.model || getOpenRouterModel();
  const baseUrl = (options?.baseUrl || OPENROUTER_CONFIG.baseUrl).replace(/\/+$/, '');

  return withBoundedRetry(async (attempt) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, OPENROUTER_CONFIG.timeoutMs);

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
            'HTTP-Referer': 'https://salvo.dev',
            'X-Title': 'Salvo Revenue Recovery',
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
          throw new OpenRouterTimeoutError(
            `OpenRouter explanation timed out after ${OPENROUTER_CONFIG.timeoutMs}ms (attempt ${attempt})`
          );
        }
        throw new OpenRouterNetworkError(
          `OpenRouter explanation connection error: ${(fetchErr as Error).message}`
        );
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw new OpenRouterAuthError(`OpenRouter auth failed (HTTP ${response.status}): ${errorText}`);
        }
        if (response.status === 429) {
          throw new OpenRouterRateLimitError(`OpenRouter rate limit (HTTP 429): ${errorText}`);
        }
        throw new OpenRouterApiError(`OpenRouter API error (HTTP ${response.status}): ${errorText}`, response.status);
      }

      const data: any = await response.json();
      return (data?.choices?.[0]?.message?.content || '').trim();
    } finally {
      clearTimeout(timer);
    }
  }, 'OpenRouter Explanation');
}

/**
 * Bounded Retry Helper for OpenRouter
 * Max 2 attempts. Retries only transient network, rate limit, timeout, and 5xx server errors.
 */
async function withBoundedRetry<T>(
  fn: (attempt: number) => Promise<T>,
  operationLabel: string
): Promise<T> {
  const maxAttempts = OPENROUTER_CONFIG.maxRetries;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;

      // Do NOT retry non-retryable errors
      if (
        err instanceof OpenRouterConfigError ||
        err instanceof OpenRouterAuthError ||
        err instanceof OpenRouterValidationError
      ) {
        throw err;
      }

      if (attempt < maxAttempts) {
        const delayMs = 600 * attempt;
        await sleep(delayMs);
      }
    }
  }

  throw new OpenRouterError(
    `${operationLabel} failed after ${maxAttempts} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// Error Classes
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class OpenRouterConfigError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterConfigError';
  }
}

export class OpenRouterAuthError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterAuthError';
  }
}

export class OpenRouterValidationError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterValidationError';
  }
}

export class OpenRouterRateLimitError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterRateLimitError';
  }
}

export class OpenRouterTimeoutError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterTimeoutError';
  }
}

export class OpenRouterNetworkError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterNetworkError';
  }
}

export class OpenRouterApiError extends OpenRouterError {
  public statusCode?: number | undefined;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'OpenRouterApiError';
    this.statusCode = statusCode;
  }
}
