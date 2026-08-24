/**
 * src/agents/executor.ts
 *
 * Salvo Razorpay Test Execution & Recovery Executor
 *
 * SAFETY INVARIANTS:
 *  - "Gemini recommends. Deterministic policy code decides. Execution code acts."
 *  - Refuses to execute any action where policyStatus !== "approved"
 *  - Refuses to execute if RAZORPAY_MODE !== "test"
 *  - Strictly protects against double execution & replay via idempotency keys
 *  - Enforces explicit state machine transitions
 *  - Deterministic simulation mode for reproducible hackathon demonstrations
 */

import { randomUUID } from 'node:crypto';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  ExecutionResult,
  RecoveryStrategy,
  AuditLogDocument,
} from '../types/index.js';
import { assertTestMode, RAZORPAY_CONFIG, isRazorpayConfigured, createRecoveryPaymentLink } from '../lib/razorpay.js';
import { saveRecoveryActions, saveAuditLogs } from '../db/repository.js';
import { ExecutionResultSchema } from '../lib/schemas.js';

// ─── Idempotency Ledger (In-memory map to store execution results and prevent concurrent re-entrancy) ──────

const executedIdempotencyResults = new Map<string, ExecutionResult>();

export function clearIdempotencyCache(): void {
  executedIdempotencyResults.clear();
}

// ─── Deterministic Hash Simulation Helper ────────────────────────────────────

/**
 * Creates a deterministic 32-bit integer hash from a string seed.
 */
function deterministicHash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0);
}

/**
 * Deterministically simulates execution outcome for a transaction, strategy, and attempt.
 */
export function simulateDeterministicOutcome(
  txn: TransactionDocument,
  strategy: RecoveryStrategy,
  attemptNumber: number
): { success: boolean; errorCode?: string; errorMessage?: string; providerReference: string } {
  const seed = `${txn.transactionId}:${strategy}:${attemptNumber}`;
  const hashVal = deterministicHash(seed);
  const normalizedProb = (hashVal % 1000) / 1000; // Value between 0.000 and 0.999

  const providerRef = `rzp_test_sim_${txn.transactionId.slice(-6)}_${strategy.slice(0, 4)}_${attemptNumber}`;

  // If transaction is ground-truth unrecoverable, execution must fail
  if (txn.groundTruth && !txn.groundTruth.recoverable) {
    return {
      success: false,
      errorCode: 'UNRECOVERABLE_DECLINE',
      errorMessage: 'Instrument declined permanently by issuer.',
      providerReference: providerRef,
    };
  }

  // If strategy matches optimal ground truth strategy, it succeeds
  if (txn.groundTruth && txn.groundTruth.optimalStrategy) {
    if (strategy === txn.groundTruth.optimalStrategy) {
      return { success: true, providerReference: providerRef };
    } else {
      // Sub-optimal strategy: attempt 1 fails to trigger realistic fallback
      if (attemptNumber === 1) {
        return {
          success: false,
          errorCode: 'SUBOPTIMAL_STRATEGY_DECLINE',
          errorMessage: `Execution with "${strategy}" was rejected by payment switch. Alternative method required.`,
          providerReference: providerRef,
        };
      }
    }
  }

  // Standard category heuristics
  if (strategy === 'smart_retry') {
    if (txn.failureCategory === 'temporary_network_failure') {
      if (normalizedProb < 0.85) {
        return { success: true, providerReference: providerRef };
      }
      return {
        success: false,
        errorCode: 'GATEWAY_TIMEOUT',
        errorMessage: 'Acquiring switch timed out during automated test retry.',
        providerReference: providerRef,
      };
    } else if (txn.failureCategory === 'bank_decline') {
      if (normalizedProb < 0.55) {
        return { success: true, providerReference: providerRef };
      }
      return {
        success: false,
        errorCode: 'ISSUER_DECLINED',
        errorMessage: 'Issuer declined authorization on automated retry.',
        providerReference: providerRef,
      };
    } else {
      return {
        success: false,
        errorCode: 'RETRY_UNSUPPORTED',
        errorMessage: `Automated retry failed for failure category ${txn.failureCategory}.`,
        providerReference: providerRef,
      };
    }
  }

  if (strategy === 'payment_method_switch') {
    if (normalizedProb < 0.78) {
      return { success: true, providerReference: providerRef };
    }
    return {
      success: false,
      errorCode: 'NEW_METHOD_FAILED',
      errorMessage: 'Customer alternative payment method was declined by issuing bank.',
      providerReference: providerRef,
    };
  }

  if (strategy === 'payment_link') {
    const threshold = attemptNumber >= 2 ? 0.85 : 0.70;
    if (normalizedProb < threshold) {
      return { success: true, providerReference: providerRef };
    }
    return {
      success: false,
      errorCode: 'LINK_EXPIRED_OR_UNPAID',
      errorMessage: 'Customer did not complete payment link transaction before expiration.',
      providerReference: providerRef,
    };
  }

  if (strategy === 'reminder') {
    if (normalizedProb < 0.65) {
      return { success: true, providerReference: providerRef };
    }
    return {
      success: false,
      errorCode: 'CUSTOMER_NO_RESPONSE',
      errorMessage: 'Customer did not respond to verification reminder message.',
      providerReference: providerRef,
    };
  }

  return {
    success: false,
    errorCode: 'NO_ACTION_PERMITTED',
    errorMessage: 'No automated action is permissible for this strategy.',
    providerReference: providerRef,
  };
}

// ─── Main Recovery Executor ───────────────────────────────────────────────────

export async function executeRecoveryAction(
  action: RecoveryActionDocument,
  txn: TransactionDocument,
  attemptNumber: number = 1
): Promise<ExecutionResult> {
  // 1. HARD SECURITY INVARIANT: Verify Test Mode
  assertTestMode();

  const executedAt = new Date().toISOString();
  const idempotencyKey = `salvo:${action.actionId}:${attemptNumber}`;

  // 2. INVARIANT CHECK: Refuse execution if policy is not explicitly approved
  if (action.policyStatus !== 'approved') {
    // Log blocked audit attempt
    const auditBlock: AuditLogDocument = {
      eventId: `evt_${action.transactionId}_blk_${randomUUID().slice(0, 8)}`,
      transactionId: action.transactionId,
      eventType: 'action_blocked',
      actor: 'razorpay_executor',
      details: {
        actionId: action.actionId,
        strategy: action.strategy,
        policyStatus: action.policyStatus,
        reason: 'Execution refused: Action has not been approved by Policy Gate.',
      },
      timestamp: executedAt,
    };
    await saveAuditLogs([auditBlock]);

    return {
      success: false,
      actionId: action.actionId,
      transactionId: action.transactionId,
      strategy: action.strategy,
      provider: 'razorpay_test',
      status: 'blocked',
      recoveredAmountPaise: 0,
      errorCode: 'EXECUTION_BLOCKED_BY_POLICY',
      errorMessage: `Action ${action.actionId} has policyStatus "${action.policyStatus}". Only "approved" actions may be executed.`,
      executedAt,
    };
  }

  // 3. IDEMPOTENCY / RE-ENTRANCY CHECK
  if (executedIdempotencyResults.has(idempotencyKey)) {
    const prev = executedIdempotencyResults.get(idempotencyKey)!;
    return {
      ...prev,
      status: 'already_executed',
    };
  }

  // 4. Log execution started audit event
  const auditStart: AuditLogDocument = {
    eventId: `evt_${action.transactionId}_start_${randomUUID().slice(0, 8)}`,
    transactionId: action.transactionId,
    eventType: 'action_execution_started',
    actor: 'razorpay_executor',
    details: {
      actionId: action.actionId,
      strategy: action.strategy,
      attemptNumber,
      amountPaise: txn.amountPaise,
      mode: RAZORPAY_CONFIG.mode,
      isSimulation: RAZORPAY_CONFIG.isSimulation,
    },
    timestamp: executedAt,
  };
  await saveAuditLogs([auditStart]);

  // 5. Execute via Razorpay Test API or Deterministic Test Simulation
  let outcome: {
    success: boolean;
    providerReference: string;
    errorCode?: string;
    errorMessage?: string;
  };

  if (!RAZORPAY_CONFIG.isSimulation && isRazorpayConfigured() && action.strategy === 'payment_link') {
    // Real Razorpay Test API Call for Payment Link
    try {
      const plink = await createRecoveryPaymentLink({
        amountPaise: txn.amountPaise,
        currency: txn.currency,
        description: `Salvo Recovery Link - Txn ${txn.transactionId}`,
        customerEmail: txn.customerEmail,
        customerPhone: txn.customerPhone,
        referenceId: `salv_${action.actionId}`,
      });
      outcome = {
        success: true,
        providerReference: plink.id,
      };
    } catch (apiErr) {
      outcome = {
        success: false,
        providerReference: `rzp_test_err_${action.actionId}`,
        errorCode: 'RAZORPAY_API_ERROR',
        errorMessage: apiErr instanceof Error ? apiErr.message : String(apiErr),
      };
    }
  } else {
    // Deterministic Test Failure / Success Simulation
    outcome = simulateDeterministicOutcome(txn, action.strategy, attemptNumber);
  }

  // 6. Financial Settlement & Clamping
  const recoveredAmountPaise = outcome.success
    ? Math.min(txn.amountPaise, action.predictedRecoveryPaise || txn.amountPaise)
    : 0;

  // 7. Update Recovery Action State Machine
  const updatedAction: RecoveryActionDocument = {
    ...action,
    executionStatus: outcome.success ? 'succeeded' : 'failed',
    actualRecoveryPaise: recoveredAmountPaise,
    executedAt,
    idempotencyKey,
    ...(outcome.errorCode ? { errorCode: outcome.errorCode } : {}),
    ...(outcome.errorMessage ? { errorMessage: outcome.errorMessage } : {}),
  };

  const execResultPayload: ExecutionResult = {
    success: outcome.success,
    actionId: action.actionId,
    transactionId: action.transactionId,
    strategy: action.strategy,
    provider: 'razorpay_test',
    status: outcome.success ? 'succeeded' : 'failed',
    recoveredAmountPaise,
    executedAt,
    ...(outcome.providerReference ? { providerReference: outcome.providerReference } : {}),
    ...(outcome.errorCode ? { errorCode: outcome.errorCode } : {}),
    ...(outcome.errorMessage ? { errorMessage: outcome.errorMessage } : {}),
  };

  updatedAction.executionResult = execResultPayload;
  await saveRecoveryActions([updatedAction]);

  // Record idempotency result
  executedIdempotencyResults.set(idempotencyKey, execResultPayload);

  // 8. Create Audit Logs
  const auditLogsToSave: AuditLogDocument[] = [];

  const auditExec: AuditLogDocument = {
    eventId: `evt_${action.transactionId}_exec_${randomUUID().slice(0, 8)}`,
    transactionId: action.transactionId,
    eventType: outcome.success ? 'action_executed' : 'execution_failed',
    actor: 'razorpay_executor',
    details: {
      actionId: action.actionId,
      strategy: action.strategy,
      attemptNumber,
      success: outcome.success,
      recoveredAmountPaise,
      providerReference: outcome.providerReference,
      ...(outcome.errorCode ? { errorCode: outcome.errorCode } : {}),
      ...(outcome.errorMessage ? { errorMessage: outcome.errorMessage } : {}),
    },
    timestamp: executedAt,
  };
  auditLogsToSave.push(auditExec);

  // INVARIANT: recovery_completed event is ONLY created when executionStatus === 'succeeded' AND recoveredAmountPaise > 0
  if (outcome.success && recoveredAmountPaise > 0) {
    const auditCompleted: AuditLogDocument = {
      eventId: `evt_${action.transactionId}_comp_${randomUUID().slice(0, 8)}`,
      transactionId: action.transactionId,
      eventType: 'recovery_completed',
      actor: 'razorpay_executor',
      details: {
        actionId: action.actionId,
        strategy: action.strategy,
        recoveredAmountPaise,
        totalTransactionAmountPaise: txn.amountPaise,
        attemptNumber,
      },
      timestamp: executedAt,
    };
    auditLogsToSave.push(auditCompleted);
  }

  await saveAuditLogs(auditLogsToSave);

  // Validate with Zod
  const parsed = ExecutionResultSchema.parse(execResultPayload);

  return {
    success: parsed.success,
    actionId: parsed.actionId,
    transactionId: parsed.transactionId,
    strategy: parsed.strategy,
    provider: parsed.provider,
    status: parsed.status,
    recoveredAmountPaise: parsed.recoveredAmountPaise,
    executedAt: parsed.executedAt,
    ...(parsed.providerReference ? { providerReference: parsed.providerReference } : {}),
    ...(parsed.errorCode ? { errorCode: parsed.errorCode } : {}),
    ...(parsed.errorMessage ? { errorMessage: parsed.errorMessage } : {}),
  };
}
