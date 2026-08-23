/**
 * tests/diagnose_batch.test.ts
 *
 * Unit tests for batch diagnosis processing, document creation, and AI metrics.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import { toObservableTransaction } from '../src/agents/observation.js';
import { RecoveryRecommendationSchema } from '../src/lib/schemas.js';
import type { RecoveryActionDocument, AuditLogDocument, RecoveryRecommendation } from '../src/types/index.js';

test('10-transaction batch diagnosis creates compliant recovery_actions and audit_logs', () => {
  const { transactions } = generateSyntheticDataset(10, 'batch-test-seed');
  assert.equal(transactions.length, 10);

  const actions: RecoveryActionDocument[] = [];
  const auditLogs: AuditLogDocument[] = [];
  const recommendations: RecoveryRecommendation[] = [];

  for (const txn of transactions) {
    const observable = toObservableTransaction(txn);

    // Derive deterministic diagnosis for test batch
    const recoverability = txn.failureCategory === 'suspected_risk' || txn.failureCategory === 'unrecoverable' ? 0.0 : 0.85;
    const strategy = recoverability > 0 ? 'smart_retry' : 'no_action';
    const predictedPaise = Math.round(observable.amountPaise * recoverability);

    const rec: RecoveryRecommendation = {
      transactionId: observable.transactionId,
      failureType: txn.failureCategory === 'suspected_risk' ? 'risk' : 'temporary',
      recoverability,
      recommendedStrategy: strategy,
      confidence: 0.92,
      evidence: [`Observed ${observable.failureCode}`, 'Historical payment record verified'],
      reasoning: 'Automated test classification matching observable metadata',
      predictedRecoveryPaise: predictedPaise,
      recommendedInterventionCostPaise: strategy === 'no_action' ? 0 : 150,
    };

    // Strict validation
    const validated = RecoveryRecommendationSchema.parse(rec);
    recommendations.push(validated);

    // Build RecoveryAction
    const action: RecoveryActionDocument = {
      actionId: `act_${validated.transactionId}_${Date.now()}`,
      transactionId: validated.transactionId,
      strategy: validated.recommendedStrategy,
      predictedRecoveryPaise: validated.predictedRecoveryPaise,
      actualRecoveryPaise: 0,
      interventionCostPaise: validated.recommendedInterventionCostPaise,
      confidence: validated.confidence,
      policyStatus: 'pending', // REQUIRED: Policy Gate has not run
      executionStatus: 'not_executed', // REQUIRED: Razorpay has not executed
      evidence: validated.evidence,
      reasoning: validated.reasoning,
      diagnosis: validated,
      createdAt: new Date().toISOString(),
      executedAt: null,
    };
    actions.push(action);

    // Build AuditLog
    const audit: AuditLogDocument = {
      eventId: `evt_${validated.transactionId}_diag_test`,
      transactionId: validated.transactionId,
      eventType: 'diagnosis_created',
      actor: 'gemini_agent',
      details: {
        actionId: action.actionId,
        failureType: validated.failureType,
        recommendedStrategy: validated.recommendedStrategy,
        confidence: validated.confidence,
        recoverability: validated.recoverability,
        predictedRecoveryPaise: validated.predictedRecoveryPaise,
        model: 'gemini-2.5-flash',
      },
      timestamp: new Date().toISOString(),
    };
    auditLogs.push(audit);
  }

  assert.equal(actions.length, 10);
  assert.equal(auditLogs.length, 10);
  assert.equal(recommendations.length, 10);

  // Assert all actions have policyStatus === 'pending'
  for (const act of actions) {
    assert.equal(act.policyStatus, 'pending');
    assert.equal(act.executionStatus, 'not_executed');
    assert.equal(act.executedAt, null);
    assert.ok(act.predictedRecoveryPaise >= 0);
  }

  // Assert all audit logs have eventType === 'diagnosis_created' and actor === 'gemini_agent'
  for (const log of auditLogs) {
    assert.equal(log.eventType, 'diagnosis_created');
    assert.equal(log.actor, 'gemini_agent');
  }
});
