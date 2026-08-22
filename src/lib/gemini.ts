/**
 * src/lib/gemini.ts
 *
 * Gemini API client abstraction for Salvo.
 *
 * Responsibilities:
 *  - Client initialization with API key validation
 *  - Centralized model configuration (AI_CONFIG)
 *  - Structured JSON output using Gemini's native responseSchema
 *  - Retry handling with exponential back-off
 *  - Request timeout handling
 *  - Schema validation of structured responses before they enter the Policy Gate
 *  - Merchant-facing narrative generation (plain text)
 *  - Centralized error handling
 *
 * SAFETY RULE: This module NEVER executes Razorpay operations.
 *              It returns typed data structures only.
 *              The Policy Gate (policyGate.ts) decides what to do with them.
 *
 * This module is server-side only. The GEMINI_API_KEY is never sent to the browser.
 */

import 'dotenv/config';
import {
  GoogleGenerativeAI,
  SchemaType,
  type GenerativeModel,
  type GenerationConfig,
  type Schema,
} from '@google/generative-ai';
import type { GeminiDiagnosisPayload } from '../types/index.js';

// ─── Model Configuration ──────────────────────────────────────────────────────
// Single source of truth for all model choices.
// Update here only — never scatter model names across the codebase.

export const AI_CONFIG = {
  /**
   * Diagnosis & structured classification model.
   * gemini-1.5-flash: fast latency, supports responseSchema, cost-efficient for
   * high-volume classification across many failed transactions.
   */
  diagnosisModel: 'gemini-1.5-flash',

  /**
   * Merchant-facing explanation model.
   * gemini-1.5-pro: higher quality natural language for merchant-visible output.
   */
  explanationModel: 'gemini-1.5-pro',
} as const;

// ─── Response Schema (Gemini native) ─────────────────────────────────────────
// This schema is passed directly to the Gemini SDK's generationConfig.
// The model is constrained to output exactly this structure — no markdown fences,
// no prose wrapping, just a valid JSON object.

const DIAGNOSIS_RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  description: 'Structured diagnosis of a failed Razorpay payment transaction',
  properties: {
    failureType: {
      type: SchemaType.STRING,
      enum: ['temporary', 'customer', 'payment_method', 'unrecoverable'],
      description:
        'Nature of the failure: temporary (transient), customer (user-caused), payment_method (method-specific), unrecoverable (fraud/permanent)',
      nullable: false,
    },
    recoverability: {
      type: SchemaType.NUMBER,
      description: 'Probability 0-1 that this transaction can be recovered via automated action',
      nullable: false,
    },
    recommendedStrategy: {
      type: SchemaType.STRING,
      enum: ['smart_retry', 'payment_method_switch', 'payment_link', 'reminder', 'no_action'],
      description: 'The single best recovery strategy to attempt first',
      nullable: false,
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: 'Confidence in this diagnosis 0-1',
      nullable: false,
    },
    evidence: {
      type: SchemaType.ARRAY,
      description: 'Specific evidence supporting the diagnosis (max 5 items)',
      items: {
        type: SchemaType.STRING,
        nullable: false,
      },
      nullable: false,
    },
    predictedRecovery: {
      type: SchemaType.NUMBER,
      description:
        'Probability 0-1 that the recommended strategy will result in successful payment. This is NOT an INR amount.',
      nullable: false,
    },
  },
  required: [
    'failureType',
    'recoverability',
    'recommendedStrategy',
    'confidence',
    'evidence',
    'predictedRecovery',
  ],
};

// ─── Client Initialization ────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env['GEMINI_API_KEY'];
  if (!key || key.trim() === '' || key === 'AIza...') {
    throw new GeminiConfigError(
      'GEMINI_API_KEY is not set. Copy .env.example to .env and add your Gemini API key.',
    );
  }
  return key.trim();
}

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(getApiKey());
  }
  return _genAI;
}

// ─── Model Factories ──────────────────────────────────────────────────────────

/**
 * Returns the diagnosis model configured for structured JSON output.
 * The responseSchema constrains the model to emit exactly GeminiDiagnosisPayload.
 */
function getDiagnosisModel(): GenerativeModel {
  const config: GenerationConfig = {
    responseMimeType: 'application/json',
    responseSchema: DIAGNOSIS_RESPONSE_SCHEMA,
    temperature: 0,       // deterministic classification
    topP: 0.1,
    maxOutputTokens: 1024,
  };
  return getGenAI().getGenerativeModel({
    model: AI_CONFIG.diagnosisModel,
    generationConfig: config,
  });
}

/**
 * Returns the explanation model configured for natural-language output.
 * Used only for merchant-facing narratives — never for financial decisions.
 */
function getExplanationModel(): GenerativeModel {
  const config: GenerationConfig = {
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 512,
  };
  return getGenAI().getGenerativeModel({
    model: AI_CONFIG.explanationModel,
    generationConfig: config,
  });
}

// ─── Retry Logic ──────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries = MAX_RETRIES,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(operation(), 30_000, operationName);
    } catch (err) {
      lastError = err;

      // Don't retry config errors or schema validation failures
      if (err instanceof GeminiConfigError || err instanceof GeminiValidationError) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delayMs);
      }
    }
  }

  throw new GeminiError(
    `${operationName} failed after ${maxRetries} attempts: ${errorMessage(lastError)}`,
  );
}

// ─── Timeout ──────────────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new GeminiError(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Schema Validation ────────────────────────────────────────────────────────

const VALID_FAILURE_TYPES = new Set(['temporary', 'customer', 'payment_method', 'unrecoverable']);
const VALID_STRATEGIES = new Set([
  'smart_retry',
  'payment_method_switch',
  'payment_link',
  'reminder',
  'no_action',
]);

/**
 * Validates Gemini's structured output before it is passed to the Policy Gate.
 * Throws GeminiValidationError if any field is missing or out of range.
 *
 * This is the firewall between AI output and deterministic business logic.
 */
function validateDiagnosisPayload(raw: unknown): GeminiDiagnosisPayload {
  if (typeof raw !== 'object' || raw === null) {
    throw new GeminiValidationError('Diagnosis response is not an object');
  }

  const obj = raw as Record<string, unknown>;

  // failureType
  const failureType = obj['failureType'];
  if (typeof failureType !== 'string' || !VALID_FAILURE_TYPES.has(failureType)) {
    throw new GeminiValidationError(
      `Invalid failureType: "${String(failureType)}". Expected one of: ${[...VALID_FAILURE_TYPES].join(', ')}`,
    );
  }

  // recoverability
  const recoverability = Number(obj['recoverability']);
  if (isNaN(recoverability) || recoverability < 0 || recoverability > 1) {
    throw new GeminiValidationError(
      `Invalid recoverability: ${String(obj['recoverability'])}. Must be 0–1.`,
    );
  }

  // recommendedStrategy
  const recommendedStrategy = obj['recommendedStrategy'];
  if (typeof recommendedStrategy !== 'string' || !VALID_STRATEGIES.has(recommendedStrategy)) {
    throw new GeminiValidationError(
      `Invalid recommendedStrategy: "${String(recommendedStrategy)}"`,
    );
  }

  // confidence
  const confidence = Number(obj['confidence']);
  if (isNaN(confidence) || confidence < 0 || confidence > 1) {
    throw new GeminiValidationError(
      `Invalid confidence: ${String(obj['confidence'])}. Must be 0–1.`,
    );
  }

  // evidence
  const evidence = obj['evidence'];
  if (!Array.isArray(evidence) || !evidence.every((e) => typeof e === 'string')) {
    throw new GeminiValidationError('evidence must be an array of strings');
  }

  // predictedRecovery  — this is a PROBABILITY, not an INR amount
  const predictedRecovery = Number(obj['predictedRecovery']);
  if (isNaN(predictedRecovery) || predictedRecovery < 0 || predictedRecovery > 1) {
    throw new GeminiValidationError(
      `Invalid predictedRecovery: ${String(obj['predictedRecovery'])}. Must be 0–1.`,
    );
  }

  return {
    failureType: failureType as GeminiDiagnosisPayload['failureType'],
    recoverability: clamp01(recoverability),
    recommendedStrategy: recommendedStrategy as GeminiDiagnosisPayload['recommendedStrategy'],
    confidence: clamp01(confidence),
    evidence: evidence.slice(0, 5) as string[],
    predictedRecovery: clamp01(predictedRecovery),
  };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Call Gemini to produce a structured diagnosis of a failed transaction.
 *
 * Returns a validated GeminiDiagnosisPayload.
 * Throws GeminiValidationError if the response fails schema validation.
 *
 * @param prompt   The assembled prompt containing transaction details
 */
export async function callDiagnosisModel(prompt: string): Promise<GeminiDiagnosisPayload> {
  return withRetry(async () => {
    const model = getDiagnosisModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new GeminiValidationError(
        `Diagnosis model returned non-JSON output: ${text.slice(0, 200)}`,
      );
    }

    return validateDiagnosisPayload(parsed);
  }, 'callDiagnosisModel');
}

/**
 * Call Gemini to generate a merchant-facing narrative explanation.
 *
 * Returns plain text only.
 * SAFETY: The return value of this function must NEVER be used for:
 *   - Financial calculations
 *   - Policy decisions
 *   - Execution triggers
 *   - Recovery totals
 *
 * It is presentation-only.
 */
export async function callExplanationModel(prompt: string): Promise<string> {
  return withRetry(async () => {
    const model = getExplanationModel();
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }, 'callExplanationModel');
}

// ─── Error Types ──────────────────────────────────────────────────────────────

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

// ─── Utilities ────────────────────────────────────────────────────────────────

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
