/**
 * src/agents/demoScenarios.ts
 *
 * Deterministic Demo Scenarios for Salvo
 *
 * Provides 6 stable, reproducible demo scenarios that exercise the real Salvo pipeline
 * (Gemini Diagnose -> Policy Gate -> Execution -> Fallback -> Audit).
 *
 * Scenarios:
 *  1. "success":          Temporary network failure -> smart_retry -> Approved -> Success
 *  2. "fallback":         Bank decline -> smart_retry fails -> Fallback to payment_method_switch -> Approved -> Success
 *  3. "risk_block":       Suspected risk -> Policy Gate blocks with RISK_BLOCK -> Zero executions
 *  4. "confidence_block": Low confidence (< 60%) -> Policy Gate blocks with CONFIDENCE_TOO_LOW -> Zero executions
 *  5. "retry_limit":      Order already has retryCount = 2 -> Policy Gate blocks with RETRY_LIMIT_EXCEEDED
 *  6. "max_attempts":     Three consecutive failure attempts -> Stops at MAX_RECOVERY_ATTEMPTS (3)
 */

import type { TransactionDocument, RecoverySessionResult } from '../types/index.js';
import { runAutonomousRecovery } from './orchestrator.js';
import { clearIdempotencyCache } from './executor.js';

export type DemoScenarioName =
  | 'success'
  | 'fallback'
  | 'risk_block'
  | 'confidence_block'
  | 'retry_limit'
  | 'max_attempts';

export function createDemoTransactionFixture(scenario: DemoScenarioName): TransactionDocument {
  const now = new Date().toISOString();

  switch (scenario) {
    case 'success':
      return {
        transactionId: 'txn_demo_scen_01_success',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_01',
        customerEmail: 'arjun.sharma@example.com',
        customerPhone: '+919876500001',
        amountPaise: 450000, // ₹4,500
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'GATEWAY_TIMEOUT',
        failureDescription: 'Acquiring switch timeout on primary HDFC gateway route',
        failureCategory: 'temporary_network_failure',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_01',
          previousPayments: 12,
          successfulPayments: 11,
          previousFailures: 1,
          retrySuccessRate: 0.92,
          preferredMethod: 'card',
          averageTransactionPaise: 450000,
        },
        retryCount: 0,
        recoverable: true,
        groundTruth: {
          recoverable: true,
          optimalStrategy: 'smart_retry',
          expectedRecoveryPaise: 450000,
          shouldIntervene: true,
          interventionCostPaise: 150,
          riskScore: 0.05,
        },
        simulation: {
          predictedStrategy: 'smart_retry',
          confidence: 0.94,
          predictedRecoveryPaise: 450000,
          interventionCostPaise: 150,
          policyVerdict: 'approved',
          executionStatus: 'not_executed',
          actualRecoveryPaise: 0,
        },
      };

    case 'fallback':
      return {
        transactionId: 'txn_demo_scen_02_fallback',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_02',
        customerEmail: 'priya.patel@example.com',
        customerPhone: '+919876500002',
        amountPaise: 380000, // ₹3,800
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'ISSUER_SWITCH_UNAVAILABLE',
        failureDescription: 'Issuing bank switch temporarily unavailable for card network',
        failureCategory: 'bank_decline',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_02',
          previousPayments: 8,
          successfulPayments: 7,
          previousFailures: 1,
          retrySuccessRate: 0.88,
          preferredMethod: 'upi',
          averageTransactionPaise: 380000,
        },
        retryCount: 0,
        recoverable: true,
        groundTruth: {
          recoverable: true,
          optimalStrategy: 'payment_method_switch',
          expectedRecoveryPaise: 380000,
          shouldIntervene: true,
          interventionCostPaise: 450,
          riskScore: 0.08,
        },
        simulation: {
          predictedStrategy: 'smart_retry',
          confidence: 0.90,
          predictedRecoveryPaise: 380000,
          interventionCostPaise: 150,
          policyVerdict: 'approved',
          executionStatus: 'not_executed',
          actualRecoveryPaise: 0,
        },
      };

    case 'risk_block':
      return {
        transactionId: 'txn_demo_scen_03_risk',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_03',
        customerEmail: 'anonymous.buyer@example.com',
        customerPhone: '+919876500003',
        amountPaise: 1250000, // ₹12,500
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'HIGH_RISK_SUSPICIOUS_VELOCITY',
        failureDescription: 'Transaction flagged by velocity rules (3 failed attempts within 60s from untrusted ASN)',
        failureCategory: 'suspected_risk',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_03',
          previousPayments: 1,
          successfulPayments: 0,
          previousFailures: 1,
          retrySuccessRate: 0.0,
          preferredMethod: 'card',
          averageTransactionPaise: 1250000,
        },
        retryCount: 0,
        recoverable: false,
        groundTruth: {
          recoverable: false,
          optimalStrategy: 'no_action',
          expectedRecoveryPaise: 0,
          shouldIntervene: false,
          interventionCostPaise: 0,
          riskScore: 0.95,
        },
        simulation: {
          predictedStrategy: 'no_action',
          confidence: 0.98,
          predictedRecoveryPaise: 0,
          interventionCostPaise: 0,
          policyVerdict: 'blocked',
          executionStatus: 'blocked',
          actualRecoveryPaise: 0,
        },
      };

    case 'confidence_block':
      return {
        transactionId: 'txn_demo_scen_04_lowconf',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_04',
        customerEmail: 'rohit.kumar@example.com',
        customerPhone: '+919876500004',
        amountPaise: 890000, // ₹8,900
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'TRANSACTION_REJECTED_UNKNOWN',
        failureDescription: 'Ambiguous decline code with insufficient telemetry for confident classification',
        failureCategory: 'temporary_network_failure',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_04',
          previousPayments: 2,
          successfulPayments: 1,
          previousFailures: 1,
          retrySuccessRate: 0.5,
          preferredMethod: 'card',
          averageTransactionPaise: 890000,
        },
        retryCount: 0,
        recoverable: false,
        groundTruth: {
          recoverable: false,
          optimalStrategy: 'no_action',
          expectedRecoveryPaise: 0,
          shouldIntervene: false,
          interventionCostPaise: 0,
          riskScore: 0.35,
        },
        simulation: {
          predictedStrategy: 'smart_retry',
          confidence: 0.45, // < 60% confidence triggers CONFIDENCE_TOO_LOW
          predictedRecoveryPaise: 400000,
          interventionCostPaise: 150,
          policyVerdict: 'blocked',
          executionStatus: 'blocked',
          actualRecoveryPaise: 0,
        },
      };

    case 'retry_limit':
      return {
        transactionId: 'txn_demo_scen_05_limit',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_05',
        customerEmail: 'sneha.verma@example.com',
        customerPhone: '+919876500005',
        amountPaise: 520000, // ₹5,200
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'GATEWAY_TIMEOUT',
        failureDescription: 'Third retry attempt on previously failed order',
        failureCategory: 'temporary_network_failure',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_05',
          previousPayments: 5,
          successfulPayments: 3,
          previousFailures: 2,
          retrySuccessRate: 0.6,
          preferredMethod: 'card',
          averageTransactionPaise: 520000,
        },
        retryCount: 2, // Exceeds MAX_RETRY_COUNT (2) -> RETRY_LIMIT_EXCEEDED
        recoverable: false,
        groundTruth: {
          recoverable: false,
          optimalStrategy: 'no_action',
          expectedRecoveryPaise: 0,
          shouldIntervene: false,
          interventionCostPaise: 0,
          riskScore: 0.15,
        },
        simulation: {
          predictedStrategy: 'smart_retry',
          confidence: 0.90,
          predictedRecoveryPaise: 520000,
          interventionCostPaise: 150,
          policyVerdict: 'blocked',
          executionStatus: 'blocked',
          actualRecoveryPaise: 0,
        },
      };

    case 'max_attempts':
      return {
        transactionId: 'txn_demo_scen_06_3fail',
        merchantId: 'mer_demo_01',
        merchantName: 'Salvo Demo Store',
        customerId: 'cust_demo_06',
        customerEmail: 'vikram.singh@example.com',
        customerPhone: '+919876500006',
        amountPaise: 320000, // ₹3,200
        currency: 'INR',
        paymentMethod: 'card',
        status: 'failed',
        failureCode: 'ISSUER_DECLINED',
        failureDescription: 'Persistent issuer decline across card and alternative switch attempts',
        failureCategory: 'bank_decline',
        createdAt: now,
        updatedAt: now,
        customerHistory: {
          customerId: 'cust_demo_06',
          previousPayments: 3,
          successfulPayments: 1,
          previousFailures: 2,
          retrySuccessRate: 0.33,
          preferredMethod: 'card',
          averageTransactionPaise: 610000,
        },
        retryCount: 0,
        recoverable: false,
        groundTruth: {
          recoverable: false,
          optimalStrategy: 'no_action',
          expectedRecoveryPaise: 0,
          shouldIntervene: false,
          interventionCostPaise: 0,
          riskScore: 0.20,
        },
        simulation: {
          predictedStrategy: 'smart_retry',
          confidence: 0.85,
          predictedRecoveryPaise: 320000,
          interventionCostPaise: 150,
          policyVerdict: 'approved',
          executionStatus: 'failed',
          actualRecoveryPaise: 0,
        },
      };
  }
}

/**
 * Execute a stable, deterministic demo scenario through the real Salvo orchestrator.
 */
export async function executeDemoScenario(scenario: DemoScenarioName): Promise<RecoverySessionResult> {
  clearIdempotencyCache();
  const txn = createDemoTransactionFixture(scenario);
  return await runAutonomousRecovery(txn, 3);
}
