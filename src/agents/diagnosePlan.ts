/**
 * Agent 1: Diagnose & Plan
 *
 * Responsibilities:
 *  1. Accept a failed/abandoned Transaction + optional CustomerHistory
 *  2. Call Gemini (structured output) to classify the failure
 *  3. Validate the Gemini response before it touches the Policy Gate
 *  4. Call Gemini (narrative) to generate a merchant-facing explanation
 *  5. Derive RecoveryActions from the validated structured output
 *  6. Compute expectedRecoveryPaise DETERMINISTICALLY (no LLM math)
 *  7. Return a typed DiagnosisResult
 *
 * SAFETY INVARIANTS:
 *  - Gemini output is ALWAYS validated before use (validateDiagnosisPayload in gemini.ts)
 *  - Financial amounts are NEVER parsed from Gemini prose
 *  - expectedRecoveryPaise = amountPaise × predictedRecovery (deterministic)
 *  - This agent only PROPOSES actions; the Policy Gate decides
 */

import { callDiagnosisModel, callExplanationModel } from '../lib/gemini.js';
import type {
  Transaction,
  CustomerHistory,
  DiagnosisResult,
  GeminiDiagnosisPayload,
  RecoveryAction,
  ActionType,
  RecommendedStrategy,
} from '../types/index.js';

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildDiagnosisPrompt(
  transaction: Transaction,
  history: CustomerHistory | null,
): string {
  const lines: string[] = [
    'Diagnose this failed Razorpay payment and determine the best recovery strategy.',
    '',
    '## Transaction',
    `ID: ${transaction.id}`,
    `Order ID: ${transaction.orderId}`,
    `Amount: ₹${(transaction.amountPaise / 100).toFixed(2)} (${transaction.amountPaise} paise)`,
    `Currency: ${transaction.currency}`,
    `Status: ${transaction.status}`,
    `Payment Method: ${transaction.method}`,
    `Error Code: ${transaction.errorCode ?? 'none'}`,
    `Error Description: ${transaction.errorDescription ?? 'none'}`,
    `Error Reason: ${transaction.errorReason ?? 'none'}`,
    `Bank / Issuer: ${transaction.bank ?? 'unknown'}`,
  ];

  if (history) {
    lines.push(
      '',
      '## Customer History',
      `Total transactions: ${history.totalTransactions}`,
      `Successful: ${history.successfulTransactions}`,
      `Failed: ${history.failedTransactions}`,
      `Historical retry success rate: ${(history.retrySuccessRate * 100).toFixed(1)}%`,
      `Preferred payment method: ${history.preferredMethod}`,
      `Average transaction: ₹${(history.averageTransactionPaise / 100).toFixed(2)}`,
    );
  }

  lines.push(
    '',
    '## Instructions',
    'Return a structured JSON object following exactly the responseSchema.',
    'predictedRecovery must be a probability (0–1), NOT an INR amount.',
    'evidence must contain specific, factual observations — not generic statements.',
    'Maximum 5 evidence items.',
  );

  return lines.join('\n');
}

function buildNarrativePrompt(
  transaction: Transaction,
  payload: GeminiDiagnosisPayload,
): string {
  return [
    'You are Salvo, an AI revenue recovery agent writing for a merchant dashboard.',
    'Write one concise paragraph (2–3 sentences max) explaining what happened with',
    'this payment and what Salvo is doing about it.',
    '',
    'Rules:',
    '- Be specific about the actual failure reason',
    '- Reference the recovery strategy in plain language',
    '- Professional, direct tone — no jargon, no hedging',
    '- Do NOT mention specific probability numbers or confidence scores',
    '- Do NOT mention rupee amounts (those are shown separately)',
    '',
    `Failure type: ${payload.failureType}`,
    `Strategy: ${payload.recommendedStrategy}`,
    `Evidence: ${payload.evidence.join('; ')}`,
    `Transaction: ${transaction.method} payment${transaction.bank ? ` via ${transaction.bank}` : ''}`,
  ].join('\n');
}

// ─── Strategy → Action Mapping ────────────────────────────────────────────────
// Converts Gemini's recommendedStrategy into concrete RecoveryActions.
// The estimatedSuccessProbability is taken directly from predictedRecovery.

function strategyToActions(
  strategy: RecommendedStrategy,
  payload: GeminiDiagnosisPayload,
  transaction: Transaction,
): RecoveryAction[] {
  const p = payload.predictedRecovery;

  const actionMap: Record<RecommendedStrategy, RecoveryAction[]> = {
    smart_retry: [
      {
        type: 'retry_payment' as ActionType,
        rationale: `Transient failure detected. Retry has ${(p * 100).toFixed(0)}% predicted success.`,
        params: { orderId: transaction.orderId, method: transaction.method },
        estimatedSuccessProbability: p,
      },
      {
        type: 'send_payment_link' as ActionType,
        rationale: 'Fallback: send payment link if retry fails.',
        params: { orderId: transaction.orderId },
        estimatedSuccessProbability: p * 0.7,
      },
    ],
    payment_method_switch: [
      {
        type: 'change_payment_method' as ActionType,
        rationale: `Payment method ${transaction.method} has issues. Switching may resolve.`,
        params: { currentMethod: transaction.method, suggestedMethod: 'upi' },
        estimatedSuccessProbability: p,
      },
      {
        type: 'send_payment_link' as ActionType,
        rationale: 'Payment link lets the customer choose a different method.',
        params: { orderId: transaction.orderId },
        estimatedSuccessProbability: p * 0.8,
      },
    ],
    payment_link: [
      {
        type: 'send_payment_link' as ActionType,
        rationale: 'Customer-side failure. A fresh payment link re-engages without friction.',
        params: { orderId: transaction.orderId, email: transaction.email },
        estimatedSuccessProbability: p,
      },
      {
        type: 'notify_customer' as ActionType,
        rationale: 'Notify customer about payment failure and link.',
        params: { channel: 'email', orderId: transaction.orderId },
        estimatedSuccessProbability: p * 0.6,
      },
    ],
    reminder: [
      {
        type: 'notify_customer' as ActionType,
        rationale: 'Customer abandoned checkout. A reminder may bring them back.',
        params: { channel: 'email', orderId: transaction.orderId },
        estimatedSuccessProbability: p,
      },
    ],
    no_action: [
      {
        type: 'flag_for_manual_review' as ActionType,
        rationale: `Failure type "${payload.failureType}" has no automated recovery path. Manual review required.`,
        params: { reason: payload.evidence.join('; ') },
        estimatedSuccessProbability: 0,
      },
    ],
  };

  return (actionMap[strategy] ?? actionMap['no_action']).sort(
    (a, b) => b.estimatedSuccessProbability - a.estimatedSuccessProbability,
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Diagnose a failed transaction and return a fully typed recovery plan.
 *
 * @param transaction  The failed/abandoned Razorpay payment
 * @param history      Optional customer payment history for richer diagnosis
 */
export async function diagnosePlan(
  transaction: Transaction,
  history: CustomerHistory | null = null,
): Promise<DiagnosisResult> {
  // Step 1: Build prompt and call Gemini for structured diagnosis
  const diagnosisPrompt = buildDiagnosisPrompt(transaction, history);
  const geminiPayload = await callDiagnosisModel(diagnosisPrompt);
  // geminiPayload is now validated — safe to proceed

  // Step 2: Generate merchant narrative (presentation only)
  const narrativePrompt = buildNarrativePrompt(transaction, geminiPayload);
  const merchantNarrative = await callExplanationModel(narrativePrompt);

  // Step 3: Derive recovery actions from validated strategy
  const proposedActions = strategyToActions(
    geminiPayload.recommendedStrategy,
    geminiPayload,
    transaction,
  );

  // Step 4: Compute expected recovery DETERMINISTICALLY
  // This is the only place INR amounts are derived from predictedRecovery.
  // No LLM prose is ever parsed for financial values.
  const expectedRecoveryPaise = Math.round(
    transaction.amountPaise * geminiPayload.predictedRecovery,
  );

  return {
    transactionId: transaction.id,
    geminiPayload,
    merchantNarrative,
    proposedActions,
    expectedRecoveryPaise,
    diagnosedAt: new Date().toISOString(),
  };
}

// ─── Batch Helper ─────────────────────────────────────────────────────────────

/**
 * Diagnose multiple transactions, collecting errors without stopping the batch.
 */
export async function diagnoseBatch(
  transactions: Transaction[],
  getHistory: (tx: Transaction) => Promise<CustomerHistory | null> = async () => null,
): Promise<{ result?: DiagnosisResult; error?: string; transactionId: string }[]> {
  return Promise.all(
    transactions.map(async (tx) => {
      try {
        const history = await getHistory(tx);
        const result = await diagnosePlan(tx, history);
        return { transactionId: tx.id, result };
      } catch (err) {
        return {
          transactionId: tx.id,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }),
  );
}
