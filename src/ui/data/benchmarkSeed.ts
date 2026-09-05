/**
 * src/ui/data/benchmarkSeed.ts
 *
 * Seeded deterministic Buildathon benchmark dataset for Salvo UI.
 * Automatically used as an offline / resilient fallback if backend API network is interrupted.
 * Sourced directly from verified Salvo benchmark dataset (1,350 transactions, 208 failed, 7,264 audit events).
 */

import type { ObservableTransaction, AuditLogDocument, RecoveryActionDocument } from '../../types/index.js';
import type { OverviewMetrics } from '../lib/api.js';

export const BENCHMARK_METRICS: OverviewMetrics = {
  "grossRecoveredPaise": 146475900,
  "netRecoveredPaise": 145984345,
  "totalInterventionCostPaise": 491555,
  "totalFailedPaise": 1992191000,
  "recoverablePaise": 1864556600,
  "unrecoverablePaise": 127634400,
  "netRecoveryRate": 7.85,
  "recoveryYield": 7.33,
  "successfulRecoveries": 382,
  "activeRecoveries": 192,
  "policyBlocks": 322,
  "failedRecoveries": 454,
  "totalMonitored": 1350,
  "avgConfidence": 0.83,
  "auditEventsCount": 7264,
  "strategies": [
    {
      "strategy": "smart_retry",
      "affectedVolume": 1167,
      "potentialRecoveryPaise": 738811101,
      "recoveredPaise": 123237000,
      "successRate": 25.96,
      "roiMultiplier": 704.0
    },
    {
      "strategy": "payment_method_switch",
      "affectedVolume": 339,
      "potentialRecoveryPaise": 196443250,
      "recoveredPaise": 23238900,
      "successRate": 23.3,
      "roiMultiplier": 457.0
    },
    {
      "strategy": "reminder",
      "affectedVolume": 214,
      "potentialRecoveryPaise": 217793174,
      "recoveredPaise": 0,
      "successRate": 0,
      "roiMultiplier": 0
    },
    {
      "strategy": "payment_link",
      "affectedVolume": 483,
      "potentialRecoveryPaise": 446557840,
      "recoveredPaise": 0,
      "successRate": 0,
      "roiMultiplier": 0
    },
    {
      "strategy": "no_action",
      "affectedVolume": 145,
      "potentialRecoveryPaise": 0,
      "recoveredPaise": 0,
      "successRate": 0,
      "roiMultiplier": 0
    }
  ],
  "lastUpdated": "2026-09-05T05:17:49.864Z"
};

export const BENCHMARK_FAILED_TRANSACTIONS: ObservableTransaction[] = [
  {
    "transactionId": "txn_salv_0008",
    "amountPaise": 10939100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:20:09.785Z",
    "customerHistory": {
      "customerId": "cust_517",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "emi",
      "averageTransactionPaise": 10939100,
      "accountAgeDays": 46
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0014",
    "amountPaise": 10253600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:26:09.785Z",
    "customerHistory": {
      "customerId": "cust_559",
      "previousPayments": 3,
      "successfulPayments": 1,
      "previousFailures": 2,
      "retrySuccessRate": 0.33,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 10253600,
      "accountAgeDays": 545
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0018",
    "amountPaise": 202500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:30:09.785Z",
    "customerHistory": {
      "customerId": "cust_585",
      "previousPayments": 8,
      "successfulPayments": 3,
      "previousFailures": 5,
      "retrySuccessRate": 0.38,
      "preferredMethod": "card",
      "averageTransactionPaise": 202500,
      "accountAgeDays": 132
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0030",
    "amountPaise": 1614000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:42:09.786Z",
    "customerHistory": {
      "customerId": "cust_779",
      "previousPayments": 16,
      "successfulPayments": 10,
      "previousFailures": 6,
      "retrySuccessRate": 0.63,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 1614000,
      "accountAgeDays": 52
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0036",
    "amountPaise": 103100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:48:09.786Z",
    "customerHistory": {
      "customerId": "cust_620",
      "previousPayments": 18,
      "successfulPayments": 9,
      "previousFailures": 9,
      "retrySuccessRate": 0.5,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 103100,
      "accountAgeDays": 270
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0059",
    "amountPaise": 3408700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:11:09.786Z",
    "customerHistory": {
      "customerId": "cust_583",
      "previousPayments": 2,
      "successfulPayments": 1,
      "previousFailures": 1,
      "retrySuccessRate": 0.5,
      "preferredMethod": "emi",
      "averageTransactionPaise": 3408700,
      "accountAgeDays": 516
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0062",
    "amountPaise": 808700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:14:09.786Z",
    "customerHistory": {
      "customerId": "cust_333",
      "previousPayments": 19,
      "successfulPayments": 9,
      "previousFailures": 10,
      "retrySuccessRate": 0.47,
      "preferredMethod": "card",
      "averageTransactionPaise": 808700,
      "accountAgeDays": 432
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0063",
    "amountPaise": 11613700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:15:09.786Z",
    "customerHistory": {
      "customerId": "cust_570",
      "previousPayments": 14,
      "successfulPayments": 8,
      "previousFailures": 6,
      "retrySuccessRate": 0.57,
      "preferredMethod": "card",
      "averageTransactionPaise": 11613700,
      "accountAgeDays": 418
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0067",
    "amountPaise": 222600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:19:09.786Z",
    "customerHistory": {
      "customerId": "cust_128",
      "previousPayments": 20,
      "successfulPayments": 17,
      "previousFailures": 3,
      "retrySuccessRate": 0.85,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 222600,
      "accountAgeDays": 590
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0070",
    "amountPaise": 941000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:22:09.787Z",
    "customerHistory": {
      "customerId": "cust_274",
      "previousPayments": 11,
      "successfulPayments": 5,
      "previousFailures": 6,
      "retrySuccessRate": 0.45,
      "preferredMethod": "card",
      "averageTransactionPaise": 941000,
      "accountAgeDays": 79
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0074",
    "amountPaise": 155100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:26:09.787Z",
    "customerHistory": {
      "customerId": "cust_265",
      "previousPayments": 6,
      "successfulPayments": 3,
      "previousFailures": 3,
      "retrySuccessRate": 0.5,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 155100,
      "accountAgeDays": 661
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0080",
    "amountPaise": 438500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:32:09.787Z",
    "customerHistory": {
      "customerId": "cust_750",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "upi",
      "averageTransactionPaise": 438500,
      "accountAgeDays": 675
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0081",
    "amountPaise": 1036900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:33:09.787Z",
    "customerHistory": {
      "customerId": "cust_383",
      "previousPayments": 24,
      "successfulPayments": 10,
      "previousFailures": 14,
      "retrySuccessRate": 0.42,
      "preferredMethod": "card",
      "averageTransactionPaise": 1036900,
      "accountAgeDays": 726
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0082",
    "amountPaise": 1024900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:34:09.787Z",
    "customerHistory": {
      "customerId": "cust_145",
      "previousPayments": 10,
      "successfulPayments": 7,
      "previousFailures": 3,
      "retrySuccessRate": 0.7,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 1024900,
      "accountAgeDays": 130
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0087",
    "amountPaise": 940500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:39:09.787Z",
    "customerHistory": {
      "customerId": "cust_160",
      "previousPayments": 6,
      "successfulPayments": 4,
      "previousFailures": 2,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 940500,
      "accountAgeDays": 528
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0090",
    "amountPaise": 63500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:42:09.787Z",
    "customerHistory": {
      "customerId": "cust_613",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "emi",
      "averageTransactionPaise": 63500,
      "accountAgeDays": 689
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0099",
    "amountPaise": 9126900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:51:09.787Z",
    "customerHistory": {
      "customerId": "cust_589",
      "previousPayments": 21,
      "successfulPayments": 11,
      "previousFailures": 10,
      "retrySuccessRate": 0.52,
      "preferredMethod": "upi",
      "averageTransactionPaise": 9126900,
      "accountAgeDays": 551
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0105",
    "amountPaise": 8755200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:57:09.787Z",
    "customerHistory": {
      "customerId": "cust_613",
      "previousPayments": 3,
      "successfulPayments": 2,
      "previousFailures": 1,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 8755200,
      "accountAgeDays": 593
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0106",
    "amountPaise": 1066500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:58:09.787Z",
    "customerHistory": {
      "customerId": "cust_429",
      "previousPayments": 24,
      "successfulPayments": 10,
      "previousFailures": 14,
      "retrySuccessRate": 0.42,
      "preferredMethod": "card",
      "averageTransactionPaise": 1066500,
      "accountAgeDays": 602
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0120",
    "amountPaise": 309800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:12:09.787Z",
    "customerHistory": {
      "customerId": "cust_220",
      "previousPayments": 11,
      "successfulPayments": 6,
      "previousFailures": 5,
      "retrySuccessRate": 0.55,
      "preferredMethod": "card",
      "averageTransactionPaise": 309800,
      "accountAgeDays": 460
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0123",
    "amountPaise": 475000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:15:09.787Z",
    "customerHistory": {
      "customerId": "cust_620",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "upi",
      "averageTransactionPaise": 475000,
      "accountAgeDays": 699
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0132",
    "amountPaise": 10303200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:24:09.787Z",
    "customerHistory": {
      "customerId": "cust_423",
      "previousPayments": 14,
      "successfulPayments": 8,
      "previousFailures": 6,
      "retrySuccessRate": 0.57,
      "preferredMethod": "upi",
      "averageTransactionPaise": 10303200,
      "accountAgeDays": 537
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0142",
    "amountPaise": 1705500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:34:09.788Z",
    "customerHistory": {
      "customerId": "cust_774",
      "previousPayments": 22,
      "successfulPayments": 13,
      "previousFailures": 9,
      "retrySuccessRate": 0.59,
      "preferredMethod": "card",
      "averageTransactionPaise": 1705500,
      "accountAgeDays": 206
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0145",
    "amountPaise": 1325900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:37:09.788Z",
    "customerHistory": {
      "customerId": "cust_756",
      "previousPayments": 23,
      "successfulPayments": 11,
      "previousFailures": 12,
      "retrySuccessRate": 0.48,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1325900,
      "accountAgeDays": 340
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0174",
    "amountPaise": 588800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:06:09.788Z",
    "customerHistory": {
      "customerId": "cust_465",
      "previousPayments": 4,
      "successfulPayments": 1,
      "previousFailures": 3,
      "retrySuccessRate": 0.25,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 588800,
      "accountAgeDays": 265
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0176",
    "amountPaise": 60200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:08:09.788Z",
    "customerHistory": {
      "customerId": "cust_583",
      "previousPayments": 10,
      "successfulPayments": 4,
      "previousFailures": 6,
      "retrySuccessRate": 0.4,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 60200,
      "accountAgeDays": 712
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0181",
    "amountPaise": 780100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:13:09.788Z",
    "customerHistory": {
      "customerId": "cust_100",
      "previousPayments": 6,
      "successfulPayments": 5,
      "previousFailures": 1,
      "retrySuccessRate": 0.83,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 780100,
      "accountAgeDays": 321
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0191",
    "amountPaise": 61000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:23:09.788Z",
    "customerHistory": {
      "customerId": "cust_188",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 61000,
      "accountAgeDays": 707
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0198",
    "amountPaise": 711900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:30:09.789Z",
    "customerHistory": {
      "customerId": "cust_375",
      "previousPayments": 17,
      "successfulPayments": 12,
      "previousFailures": 5,
      "retrySuccessRate": 0.71,
      "preferredMethod": "emi",
      "averageTransactionPaise": 711900,
      "accountAgeDays": 687
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0203",
    "amountPaise": 3916300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:35:09.789Z",
    "customerHistory": {
      "customerId": "cust_758",
      "previousPayments": 20,
      "successfulPayments": 12,
      "previousFailures": 8,
      "retrySuccessRate": 0.6,
      "preferredMethod": "card",
      "averageTransactionPaise": 3916300,
      "accountAgeDays": 466
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0205",
    "amountPaise": 246600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:37:09.789Z",
    "customerHistory": {
      "customerId": "cust_371",
      "previousPayments": 12,
      "successfulPayments": 8,
      "previousFailures": 4,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 246600,
      "accountAgeDays": 309
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0206",
    "amountPaise": 183800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:38:09.789Z",
    "customerHistory": {
      "customerId": "cust_108",
      "previousPayments": 12,
      "successfulPayments": 4,
      "previousFailures": 8,
      "retrySuccessRate": 0.33,
      "preferredMethod": "emi",
      "averageTransactionPaise": 183800,
      "accountAgeDays": 617
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0207",
    "amountPaise": 506500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:39:09.789Z",
    "customerHistory": {
      "customerId": "cust_392",
      "previousPayments": 16,
      "successfulPayments": 7,
      "previousFailures": 9,
      "retrySuccessRate": 0.44,
      "preferredMethod": "card",
      "averageTransactionPaise": 506500,
      "accountAgeDays": 275
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0217",
    "amountPaise": 101500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:49:09.789Z",
    "customerHistory": {
      "customerId": "cust_393",
      "previousPayments": 2,
      "successfulPayments": 0,
      "previousFailures": 2,
      "retrySuccessRate": 0,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 101500,
      "accountAgeDays": 445
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0221",
    "amountPaise": 9419100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:53:09.789Z",
    "customerHistory": {
      "customerId": "cust_568",
      "previousPayments": 23,
      "successfulPayments": 9,
      "previousFailures": 14,
      "retrySuccessRate": 0.39,
      "preferredMethod": "card",
      "averageTransactionPaise": 9419100,
      "accountAgeDays": 184
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0224",
    "amountPaise": 10222300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:56:09.789Z",
    "customerHistory": {
      "customerId": "cust_793",
      "previousPayments": 16,
      "successfulPayments": 8,
      "previousFailures": 8,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 10222300,
      "accountAgeDays": 715
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0231",
    "amountPaise": 55400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:03:09.789Z",
    "customerHistory": {
      "customerId": "cust_765",
      "previousPayments": 4,
      "successfulPayments": 2,
      "previousFailures": 2,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 55400,
      "accountAgeDays": 119
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0233",
    "amountPaise": 773600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:05:09.789Z",
    "customerHistory": {
      "customerId": "cust_795",
      "previousPayments": 22,
      "successfulPayments": 11,
      "previousFailures": 11,
      "retrySuccessRate": 0.5,
      "preferredMethod": "upi",
      "averageTransactionPaise": 773600,
      "accountAgeDays": 720
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0237",
    "amountPaise": 458900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:09:09.789Z",
    "customerHistory": {
      "customerId": "cust_101",
      "previousPayments": 5,
      "successfulPayments": 3,
      "previousFailures": 2,
      "retrySuccessRate": 0.6,
      "preferredMethod": "card",
      "averageTransactionPaise": 458900,
      "accountAgeDays": 395
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0241",
    "amountPaise": 9759600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:13:09.789Z",
    "customerHistory": {
      "customerId": "cust_168",
      "previousPayments": 15,
      "successfulPayments": 8,
      "previousFailures": 7,
      "retrySuccessRate": 0.53,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 9759600,
      "accountAgeDays": 22
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0246",
    "amountPaise": 994300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:18:09.789Z",
    "customerHistory": {
      "customerId": "cust_271",
      "previousPayments": 12,
      "successfulPayments": 10,
      "previousFailures": 2,
      "retrySuccessRate": 0.83,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 994300,
      "accountAgeDays": 305
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0249",
    "amountPaise": 1349900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:21:09.789Z",
    "customerHistory": {
      "customerId": "cust_680",
      "previousPayments": 20,
      "successfulPayments": 13,
      "previousFailures": 7,
      "retrySuccessRate": 0.65,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1349900,
      "accountAgeDays": 540
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0251",
    "amountPaise": 32800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:23:09.789Z",
    "customerHistory": {
      "customerId": "cust_494",
      "previousPayments": 21,
      "successfulPayments": 11,
      "previousFailures": 10,
      "retrySuccessRate": 0.52,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 32800,
      "accountAgeDays": 711
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0254",
    "amountPaise": 109900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:26:09.789Z",
    "customerHistory": {
      "customerId": "cust_325",
      "previousPayments": 18,
      "successfulPayments": 14,
      "previousFailures": 4,
      "retrySuccessRate": 0.78,
      "preferredMethod": "emi",
      "averageTransactionPaise": 109900,
      "accountAgeDays": 455
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0262",
    "amountPaise": 8063400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:34:09.790Z",
    "customerHistory": {
      "customerId": "cust_485",
      "previousPayments": 8,
      "successfulPayments": 6,
      "previousFailures": 2,
      "retrySuccessRate": 0.75,
      "preferredMethod": "emi",
      "averageTransactionPaise": 8063400,
      "accountAgeDays": 536
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0269",
    "amountPaise": 450400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:41:09.790Z",
    "customerHistory": {
      "customerId": "cust_633",
      "previousPayments": 16,
      "successfulPayments": 8,
      "previousFailures": 8,
      "retrySuccessRate": 0.5,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 450400,
      "accountAgeDays": 544
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0272",
    "amountPaise": 188200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:44:09.790Z",
    "customerHistory": {
      "customerId": "cust_354",
      "previousPayments": 21,
      "successfulPayments": 18,
      "previousFailures": 3,
      "retrySuccessRate": 0.86,
      "preferredMethod": "upi",
      "averageTransactionPaise": 188200,
      "accountAgeDays": 234
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0273",
    "amountPaise": 8997000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:45:09.790Z",
    "customerHistory": {
      "customerId": "cust_459",
      "previousPayments": 22,
      "successfulPayments": 16,
      "previousFailures": 6,
      "retrySuccessRate": 0.73,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 8997000,
      "accountAgeDays": 161
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0274",
    "amountPaise": 866300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:46:09.790Z",
    "customerHistory": {
      "customerId": "cust_384",
      "previousPayments": 24,
      "successfulPayments": 22,
      "previousFailures": 2,
      "retrySuccessRate": 0.92,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 866300,
      "accountAgeDays": 138
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0275",
    "amountPaise": 4205800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:47:09.790Z",
    "customerHistory": {
      "customerId": "cust_656",
      "previousPayments": 24,
      "successfulPayments": 21,
      "previousFailures": 3,
      "retrySuccessRate": 0.88,
      "preferredMethod": "upi",
      "averageTransactionPaise": 4205800,
      "accountAgeDays": 634
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0281",
    "amountPaise": 61200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:53:09.790Z",
    "customerHistory": {
      "customerId": "cust_796",
      "previousPayments": 5,
      "successfulPayments": 2,
      "previousFailures": 3,
      "retrySuccessRate": 0.4,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 61200,
      "accountAgeDays": 422
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0284",
    "amountPaise": 383700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:56:09.790Z",
    "customerHistory": {
      "customerId": "cust_449",
      "previousPayments": 4,
      "successfulPayments": 2,
      "previousFailures": 2,
      "retrySuccessRate": 0.5,
      "preferredMethod": "emi",
      "averageTransactionPaise": 383700,
      "accountAgeDays": 546
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0288",
    "amountPaise": 70000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:00:09.790Z",
    "customerHistory": {
      "customerId": "cust_838",
      "previousPayments": 13,
      "successfulPayments": 10,
      "previousFailures": 3,
      "retrySuccessRate": 0.77,
      "preferredMethod": "upi",
      "averageTransactionPaise": 70000,
      "accountAgeDays": 519
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0291",
    "amountPaise": 121700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:03:09.790Z",
    "customerHistory": {
      "customerId": "cust_533",
      "previousPayments": 15,
      "successfulPayments": 6,
      "previousFailures": 9,
      "retrySuccessRate": 0.4,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 121700,
      "accountAgeDays": 556
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0296",
    "amountPaise": 31900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:08:09.790Z",
    "customerHistory": {
      "customerId": "cust_582",
      "previousPayments": 2,
      "successfulPayments": 1,
      "previousFailures": 1,
      "retrySuccessRate": 0.5,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 31900,
      "accountAgeDays": 594
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0306",
    "amountPaise": 1223000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:18:09.790Z",
    "customerHistory": {
      "customerId": "cust_678",
      "previousPayments": 19,
      "successfulPayments": 14,
      "previousFailures": 5,
      "retrySuccessRate": 0.74,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1223000,
      "accountAgeDays": 575
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0307",
    "amountPaise": 224800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:19:09.790Z",
    "customerHistory": {
      "customerId": "cust_193",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "upi",
      "averageTransactionPaise": 224800,
      "accountAgeDays": 579
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0311",
    "amountPaise": 606400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:23:09.790Z",
    "customerHistory": {
      "customerId": "cust_309",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "emi",
      "averageTransactionPaise": 606400,
      "accountAgeDays": 22
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0325",
    "amountPaise": 2479000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:37:09.790Z",
    "customerHistory": {
      "customerId": "cust_653",
      "previousPayments": 8,
      "successfulPayments": 3,
      "previousFailures": 5,
      "retrySuccessRate": 0.38,
      "preferredMethod": "upi",
      "averageTransactionPaise": 2479000,
      "accountAgeDays": 553
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0332",
    "amountPaise": 1765200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:44:09.790Z",
    "customerHistory": {
      "customerId": "cust_444",
      "previousPayments": 13,
      "successfulPayments": 6,
      "previousFailures": 7,
      "retrySuccessRate": 0.46,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 1765200,
      "accountAgeDays": 277
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0334",
    "amountPaise": 148900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:46:09.790Z",
    "customerHistory": {
      "customerId": "cust_783",
      "previousPayments": 11,
      "successfulPayments": 9,
      "previousFailures": 2,
      "retrySuccessRate": 0.82,
      "preferredMethod": "upi",
      "averageTransactionPaise": 148900,
      "accountAgeDays": 673
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0335",
    "amountPaise": 161200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:47:09.790Z",
    "customerHistory": {
      "customerId": "cust_622",
      "previousPayments": 21,
      "successfulPayments": 9,
      "previousFailures": 12,
      "retrySuccessRate": 0.43,
      "preferredMethod": "emi",
      "averageTransactionPaise": 161200,
      "accountAgeDays": 63
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0343",
    "amountPaise": 1417500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T13:55:09.790Z",
    "customerHistory": {
      "customerId": "cust_132",
      "previousPayments": 16,
      "successfulPayments": 7,
      "previousFailures": 9,
      "retrySuccessRate": 0.44,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1417500,
      "accountAgeDays": 283
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0351",
    "amountPaise": 214200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:03:09.790Z",
    "customerHistory": {
      "customerId": "cust_393",
      "previousPayments": 20,
      "successfulPayments": 9,
      "previousFailures": 11,
      "retrySuccessRate": 0.45,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 214200,
      "accountAgeDays": 475
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0353",
    "amountPaise": 1319100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:05:09.790Z",
    "customerHistory": {
      "customerId": "cust_482",
      "previousPayments": 24,
      "successfulPayments": 18,
      "previousFailures": 6,
      "retrySuccessRate": 0.75,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1319100,
      "accountAgeDays": 99
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0354",
    "amountPaise": 30900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:06:09.791Z",
    "customerHistory": {
      "customerId": "cust_599",
      "previousPayments": 7,
      "successfulPayments": 3,
      "previousFailures": 4,
      "retrySuccessRate": 0.43,
      "preferredMethod": "emi",
      "averageTransactionPaise": 30900,
      "accountAgeDays": 429
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0359",
    "amountPaise": 150700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:11:09.791Z",
    "customerHistory": {
      "customerId": "cust_476",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "upi",
      "averageTransactionPaise": 150700,
      "accountAgeDays": 637
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0372",
    "amountPaise": 97100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:24:09.791Z",
    "customerHistory": {
      "customerId": "cust_459",
      "previousPayments": 21,
      "successfulPayments": 19,
      "previousFailures": 2,
      "retrySuccessRate": 0.9,
      "preferredMethod": "card",
      "averageTransactionPaise": 97100,
      "accountAgeDays": 342
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0397",
    "amountPaise": 9559600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T14:49:09.791Z",
    "customerHistory": {
      "customerId": "cust_195",
      "previousPayments": 11,
      "successfulPayments": 7,
      "previousFailures": 4,
      "retrySuccessRate": 0.64,
      "preferredMethod": "emi",
      "averageTransactionPaise": 9559600,
      "accountAgeDays": 163
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0410",
    "amountPaise": 174500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:02:09.791Z",
    "customerHistory": {
      "customerId": "cust_820",
      "previousPayments": 21,
      "successfulPayments": 11,
      "previousFailures": 10,
      "retrySuccessRate": 0.52,
      "preferredMethod": "upi",
      "averageTransactionPaise": 174500,
      "accountAgeDays": 367
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0412",
    "amountPaise": 173200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:04:09.791Z",
    "customerHistory": {
      "customerId": "cust_578",
      "previousPayments": 6,
      "successfulPayments": 3,
      "previousFailures": 3,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 173200,
      "accountAgeDays": 222
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0415",
    "amountPaise": 168500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:07:09.791Z",
    "customerHistory": {
      "customerId": "cust_817",
      "previousPayments": 9,
      "successfulPayments": 5,
      "previousFailures": 4,
      "retrySuccessRate": 0.56,
      "preferredMethod": "card",
      "averageTransactionPaise": 168500,
      "accountAgeDays": 358
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0426",
    "amountPaise": 9715700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:18:09.791Z",
    "customerHistory": {
      "customerId": "cust_283",
      "previousPayments": 7,
      "successfulPayments": 3,
      "previousFailures": 4,
      "retrySuccessRate": 0.43,
      "preferredMethod": "emi",
      "averageTransactionPaise": 9715700,
      "accountAgeDays": 28
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0428",
    "amountPaise": 1598400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:20:09.791Z",
    "customerHistory": {
      "customerId": "cust_294",
      "previousPayments": 13,
      "successfulPayments": 6,
      "previousFailures": 7,
      "retrySuccessRate": 0.46,
      "preferredMethod": "card",
      "averageTransactionPaise": 1598400,
      "accountAgeDays": 686
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0445",
    "amountPaise": 147100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:37:09.791Z",
    "customerHistory": {
      "customerId": "cust_284",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 147100,
      "accountAgeDays": 638
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0453",
    "amountPaise": 1483200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:45:09.791Z",
    "customerHistory": {
      "customerId": "cust_407",
      "previousPayments": 12,
      "successfulPayments": 9,
      "previousFailures": 3,
      "retrySuccessRate": 0.75,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1483200,
      "accountAgeDays": 666
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0458",
    "amountPaise": 1605100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:50:09.792Z",
    "customerHistory": {
      "customerId": "cust_455",
      "previousPayments": 20,
      "successfulPayments": 16,
      "previousFailures": 4,
      "retrySuccessRate": 0.8,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1605100,
      "accountAgeDays": 263
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0459",
    "amountPaise": 403600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:51:09.792Z",
    "customerHistory": {
      "customerId": "cust_366",
      "previousPayments": 19,
      "successfulPayments": 10,
      "previousFailures": 9,
      "retrySuccessRate": 0.53,
      "preferredMethod": "upi",
      "averageTransactionPaise": 403600,
      "accountAgeDays": 221
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0463",
    "amountPaise": 950000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:55:09.792Z",
    "customerHistory": {
      "customerId": "cust_740",
      "previousPayments": 14,
      "successfulPayments": 10,
      "previousFailures": 4,
      "retrySuccessRate": 0.71,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 950000,
      "accountAgeDays": 704
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0467",
    "amountPaise": 135800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T15:59:09.792Z",
    "customerHistory": {
      "customerId": "cust_677",
      "previousPayments": 21,
      "successfulPayments": 16,
      "previousFailures": 5,
      "retrySuccessRate": 0.76,
      "preferredMethod": "upi",
      "averageTransactionPaise": 135800,
      "accountAgeDays": 498
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0478",
    "amountPaise": 814100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:10:09.792Z",
    "customerHistory": {
      "customerId": "cust_681",
      "previousPayments": 5,
      "successfulPayments": 2,
      "previousFailures": 3,
      "retrySuccessRate": 0.4,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 814100,
      "accountAgeDays": 350
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0479",
    "amountPaise": 3621800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:11:09.792Z",
    "customerHistory": {
      "customerId": "cust_330",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "emi",
      "averageTransactionPaise": 3621800,
      "accountAgeDays": 296
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0497",
    "amountPaise": 187000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:29:09.792Z",
    "customerHistory": {
      "customerId": "cust_256",
      "previousPayments": 4,
      "successfulPayments": 2,
      "previousFailures": 2,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 187000,
      "accountAgeDays": 556
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0498",
    "amountPaise": 503400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:30:09.792Z",
    "customerHistory": {
      "customerId": "cust_433",
      "previousPayments": 7,
      "successfulPayments": 6,
      "previousFailures": 1,
      "retrySuccessRate": 0.86,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 503400,
      "accountAgeDays": 108
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0511",
    "amountPaise": 646500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:43:09.792Z",
    "customerHistory": {
      "customerId": "cust_836",
      "previousPayments": 18,
      "successfulPayments": 12,
      "previousFailures": 6,
      "retrySuccessRate": 0.67,
      "preferredMethod": "emi",
      "averageTransactionPaise": 646500,
      "accountAgeDays": 61
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0512",
    "amountPaise": 466000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:44:09.792Z",
    "customerHistory": {
      "customerId": "cust_202",
      "previousPayments": 7,
      "successfulPayments": 3,
      "previousFailures": 4,
      "retrySuccessRate": 0.43,
      "preferredMethod": "emi",
      "averageTransactionPaise": 466000,
      "accountAgeDays": 230
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0522",
    "amountPaise": 243500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T16:54:09.792Z",
    "customerHistory": {
      "customerId": "cust_297",
      "previousPayments": 9,
      "successfulPayments": 3,
      "previousFailures": 6,
      "retrySuccessRate": 0.33,
      "preferredMethod": "emi",
      "averageTransactionPaise": 243500,
      "accountAgeDays": 575
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0528",
    "amountPaise": 180100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:00:09.792Z",
    "customerHistory": {
      "customerId": "cust_422",
      "previousPayments": 21,
      "successfulPayments": 15,
      "previousFailures": 6,
      "retrySuccessRate": 0.71,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 180100,
      "accountAgeDays": 520
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0529",
    "amountPaise": 51100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:01:09.792Z",
    "customerHistory": {
      "customerId": "cust_215",
      "previousPayments": 22,
      "successfulPayments": 16,
      "previousFailures": 6,
      "retrySuccessRate": 0.73,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 51100,
      "accountAgeDays": 229
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0544",
    "amountPaise": 8440700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:16:09.792Z",
    "customerHistory": {
      "customerId": "cust_582",
      "previousPayments": 11,
      "successfulPayments": 4,
      "previousFailures": 7,
      "retrySuccessRate": 0.36,
      "preferredMethod": "card",
      "averageTransactionPaise": 8440700,
      "accountAgeDays": 317
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0545",
    "amountPaise": 11854700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:17:09.792Z",
    "customerHistory": {
      "customerId": "cust_460",
      "previousPayments": 13,
      "successfulPayments": 7,
      "previousFailures": 6,
      "retrySuccessRate": 0.54,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 11854700,
      "accountAgeDays": 141
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0548",
    "amountPaise": 8699600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:20:09.792Z",
    "customerHistory": {
      "customerId": "cust_825",
      "previousPayments": 10,
      "successfulPayments": 5,
      "previousFailures": 5,
      "retrySuccessRate": 0.5,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 8699600,
      "accountAgeDays": 615
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0551",
    "amountPaise": 10729300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:23:09.792Z",
    "customerHistory": {
      "customerId": "cust_158",
      "previousPayments": 20,
      "successfulPayments": 9,
      "previousFailures": 11,
      "retrySuccessRate": 0.45,
      "preferredMethod": "emi",
      "averageTransactionPaise": 10729300,
      "accountAgeDays": 727
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0552",
    "amountPaise": 116300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:24:09.792Z",
    "customerHistory": {
      "customerId": "cust_613",
      "previousPayments": 10,
      "successfulPayments": 4,
      "previousFailures": 6,
      "retrySuccessRate": 0.4,
      "preferredMethod": "card",
      "averageTransactionPaise": 116300,
      "accountAgeDays": 720
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0553",
    "amountPaise": 165400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:25:09.793Z",
    "customerHistory": {
      "customerId": "cust_376",
      "previousPayments": 8,
      "successfulPayments": 4,
      "previousFailures": 4,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 165400,
      "accountAgeDays": 403
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0558",
    "amountPaise": 8366000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:30:09.793Z",
    "customerHistory": {
      "customerId": "cust_606",
      "previousPayments": 6,
      "successfulPayments": 5,
      "previousFailures": 1,
      "retrySuccessRate": 0.83,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 8366000,
      "accountAgeDays": 150
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0562",
    "amountPaise": 1575900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:34:09.793Z",
    "customerHistory": {
      "customerId": "cust_255",
      "previousPayments": 11,
      "successfulPayments": 5,
      "previousFailures": 6,
      "retrySuccessRate": 0.45,
      "preferredMethod": "card",
      "averageTransactionPaise": 1575900,
      "accountAgeDays": 456
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0564",
    "amountPaise": 73100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:36:09.793Z",
    "customerHistory": {
      "customerId": "cust_768",
      "previousPayments": 3,
      "successfulPayments": 2,
      "previousFailures": 1,
      "retrySuccessRate": 0.67,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 73100,
      "accountAgeDays": 598
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0568",
    "amountPaise": 1639600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:40:09.793Z",
    "customerHistory": {
      "customerId": "cust_535",
      "previousPayments": 16,
      "successfulPayments": 10,
      "previousFailures": 6,
      "retrySuccessRate": 0.63,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1639600,
      "accountAgeDays": 327
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0570",
    "amountPaise": 794000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T17:42:09.793Z",
    "customerHistory": {
      "customerId": "cust_195",
      "previousPayments": 5,
      "successfulPayments": 3,
      "previousFailures": 2,
      "retrySuccessRate": 0.6,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 794000,
      "accountAgeDays": 683
    },
    "riskScore": 0.15
  }
];

export const BENCHMARK_ALL_TRANSACTIONS: ObservableTransaction[] = [
  {
    "transactionId": "txn_salv_0008",
    "amountPaise": 10939100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:20:09.785Z",
    "customerHistory": {
      "customerId": "cust_517",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "emi",
      "averageTransactionPaise": 10939100,
      "accountAgeDays": 46
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0014",
    "amountPaise": 10253600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:26:09.785Z",
    "customerHistory": {
      "customerId": "cust_559",
      "previousPayments": 3,
      "successfulPayments": 1,
      "previousFailures": 2,
      "retrySuccessRate": 0.33,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 10253600,
      "accountAgeDays": 545
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0018",
    "amountPaise": 202500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:30:09.785Z",
    "customerHistory": {
      "customerId": "cust_585",
      "previousPayments": 8,
      "successfulPayments": 3,
      "previousFailures": 5,
      "retrySuccessRate": 0.38,
      "preferredMethod": "card",
      "averageTransactionPaise": 202500,
      "accountAgeDays": 132
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0030",
    "amountPaise": 1614000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:42:09.786Z",
    "customerHistory": {
      "customerId": "cust_779",
      "previousPayments": 16,
      "successfulPayments": 10,
      "previousFailures": 6,
      "retrySuccessRate": 0.63,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 1614000,
      "accountAgeDays": 52
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0036",
    "amountPaise": 103100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:48:09.786Z",
    "customerHistory": {
      "customerId": "cust_620",
      "previousPayments": 18,
      "successfulPayments": 9,
      "previousFailures": 9,
      "retrySuccessRate": 0.5,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 103100,
      "accountAgeDays": 270
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0059",
    "amountPaise": 3408700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:11:09.786Z",
    "customerHistory": {
      "customerId": "cust_583",
      "previousPayments": 2,
      "successfulPayments": 1,
      "previousFailures": 1,
      "retrySuccessRate": 0.5,
      "preferredMethod": "emi",
      "averageTransactionPaise": 3408700,
      "accountAgeDays": 516
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0062",
    "amountPaise": 808700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:14:09.786Z",
    "customerHistory": {
      "customerId": "cust_333",
      "previousPayments": 19,
      "successfulPayments": 9,
      "previousFailures": 10,
      "retrySuccessRate": 0.47,
      "preferredMethod": "card",
      "averageTransactionPaise": 808700,
      "accountAgeDays": 432
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0063",
    "amountPaise": 11613700,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:15:09.786Z",
    "customerHistory": {
      "customerId": "cust_570",
      "previousPayments": 14,
      "successfulPayments": 8,
      "previousFailures": 6,
      "retrySuccessRate": 0.57,
      "preferredMethod": "card",
      "averageTransactionPaise": 11613700,
      "accountAgeDays": 418
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0067",
    "amountPaise": 222600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:19:09.786Z",
    "customerHistory": {
      "customerId": "cust_128",
      "previousPayments": 20,
      "successfulPayments": 17,
      "previousFailures": 3,
      "retrySuccessRate": 0.85,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 222600,
      "accountAgeDays": 590
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0070",
    "amountPaise": 941000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:22:09.787Z",
    "customerHistory": {
      "customerId": "cust_274",
      "previousPayments": 11,
      "successfulPayments": 5,
      "previousFailures": 6,
      "retrySuccessRate": 0.45,
      "preferredMethod": "card",
      "averageTransactionPaise": 941000,
      "accountAgeDays": 79
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0074",
    "amountPaise": 155100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:26:09.787Z",
    "customerHistory": {
      "customerId": "cust_265",
      "previousPayments": 6,
      "successfulPayments": 3,
      "previousFailures": 3,
      "retrySuccessRate": 0.5,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 155100,
      "accountAgeDays": 661
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0080",
    "amountPaise": 438500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:32:09.787Z",
    "customerHistory": {
      "customerId": "cust_750",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "upi",
      "averageTransactionPaise": 438500,
      "accountAgeDays": 675
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0081",
    "amountPaise": 1036900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:33:09.787Z",
    "customerHistory": {
      "customerId": "cust_383",
      "previousPayments": 24,
      "successfulPayments": 10,
      "previousFailures": 14,
      "retrySuccessRate": 0.42,
      "preferredMethod": "card",
      "averageTransactionPaise": 1036900,
      "accountAgeDays": 726
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0082",
    "amountPaise": 1024900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:34:09.787Z",
    "customerHistory": {
      "customerId": "cust_145",
      "previousPayments": 10,
      "successfulPayments": 7,
      "previousFailures": 3,
      "retrySuccessRate": 0.7,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 1024900,
      "accountAgeDays": 130
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0087",
    "amountPaise": 940500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:39:09.787Z",
    "customerHistory": {
      "customerId": "cust_160",
      "previousPayments": 6,
      "successfulPayments": 4,
      "previousFailures": 2,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 940500,
      "accountAgeDays": 528
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0090",
    "amountPaise": 63500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:42:09.787Z",
    "customerHistory": {
      "customerId": "cust_613",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "emi",
      "averageTransactionPaise": 63500,
      "accountAgeDays": 689
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0099",
    "amountPaise": 9126900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:51:09.787Z",
    "customerHistory": {
      "customerId": "cust_589",
      "previousPayments": 21,
      "successfulPayments": 11,
      "previousFailures": 10,
      "retrySuccessRate": 0.52,
      "preferredMethod": "upi",
      "averageTransactionPaise": 9126900,
      "accountAgeDays": 551
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0105",
    "amountPaise": 8755200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:57:09.787Z",
    "customerHistory": {
      "customerId": "cust_613",
      "previousPayments": 3,
      "successfulPayments": 2,
      "previousFailures": 1,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 8755200,
      "accountAgeDays": 593
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0106",
    "amountPaise": 1066500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T09:58:09.787Z",
    "customerHistory": {
      "customerId": "cust_429",
      "previousPayments": 24,
      "successfulPayments": 10,
      "previousFailures": 14,
      "retrySuccessRate": 0.42,
      "preferredMethod": "card",
      "averageTransactionPaise": 1066500,
      "accountAgeDays": 602
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0120",
    "amountPaise": 309800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:12:09.787Z",
    "customerHistory": {
      "customerId": "cust_220",
      "previousPayments": 11,
      "successfulPayments": 6,
      "previousFailures": 5,
      "retrySuccessRate": 0.55,
      "preferredMethod": "card",
      "averageTransactionPaise": 309800,
      "accountAgeDays": 460
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0123",
    "amountPaise": 475000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:15:09.787Z",
    "customerHistory": {
      "customerId": "cust_620",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "upi",
      "averageTransactionPaise": 475000,
      "accountAgeDays": 699
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0132",
    "amountPaise": 10303200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:24:09.787Z",
    "customerHistory": {
      "customerId": "cust_423",
      "previousPayments": 14,
      "successfulPayments": 8,
      "previousFailures": 6,
      "retrySuccessRate": 0.57,
      "preferredMethod": "upi",
      "averageTransactionPaise": 10303200,
      "accountAgeDays": 537
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0142",
    "amountPaise": 1705500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:34:09.788Z",
    "customerHistory": {
      "customerId": "cust_774",
      "previousPayments": 22,
      "successfulPayments": 13,
      "previousFailures": 9,
      "retrySuccessRate": 0.59,
      "preferredMethod": "card",
      "averageTransactionPaise": 1705500,
      "accountAgeDays": 206
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0145",
    "amountPaise": 1325900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T10:37:09.788Z",
    "customerHistory": {
      "customerId": "cust_756",
      "previousPayments": 23,
      "successfulPayments": 11,
      "previousFailures": 12,
      "retrySuccessRate": 0.48,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1325900,
      "accountAgeDays": 340
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0174",
    "amountPaise": 588800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:06:09.788Z",
    "customerHistory": {
      "customerId": "cust_465",
      "previousPayments": 4,
      "successfulPayments": 1,
      "previousFailures": 3,
      "retrySuccessRate": 0.25,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 588800,
      "accountAgeDays": 265
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0176",
    "amountPaise": 60200,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:08:09.788Z",
    "customerHistory": {
      "customerId": "cust_583",
      "previousPayments": 10,
      "successfulPayments": 4,
      "previousFailures": 6,
      "retrySuccessRate": 0.4,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 60200,
      "accountAgeDays": 712
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0181",
    "amountPaise": 780100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:13:09.788Z",
    "customerHistory": {
      "customerId": "cust_100",
      "previousPayments": 6,
      "successfulPayments": 5,
      "previousFailures": 1,
      "retrySuccessRate": 0.83,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 780100,
      "accountAgeDays": 321
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0191",
    "amountPaise": 61000,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:23:09.788Z",
    "customerHistory": {
      "customerId": "cust_188",
      "previousPayments": 1,
      "successfulPayments": 0,
      "previousFailures": 1,
      "retrySuccessRate": 0,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 61000,
      "accountAgeDays": 707
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0198",
    "amountPaise": 711900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:30:09.789Z",
    "customerHistory": {
      "customerId": "cust_375",
      "previousPayments": 17,
      "successfulPayments": 12,
      "previousFailures": 5,
      "retrySuccessRate": 0.71,
      "preferredMethod": "emi",
      "averageTransactionPaise": 711900,
      "accountAgeDays": 687
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0203",
    "amountPaise": 3916300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:35:09.789Z",
    "customerHistory": {
      "customerId": "cust_758",
      "previousPayments": 20,
      "successfulPayments": 12,
      "previousFailures": 8,
      "retrySuccessRate": 0.6,
      "preferredMethod": "card",
      "averageTransactionPaise": 3916300,
      "accountAgeDays": 466
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0205",
    "amountPaise": 246600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:37:09.789Z",
    "customerHistory": {
      "customerId": "cust_371",
      "previousPayments": 12,
      "successfulPayments": 8,
      "previousFailures": 4,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 246600,
      "accountAgeDays": 309
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0206",
    "amountPaise": 183800,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:38:09.789Z",
    "customerHistory": {
      "customerId": "cust_108",
      "previousPayments": 12,
      "successfulPayments": 4,
      "previousFailures": 8,
      "retrySuccessRate": 0.33,
      "preferredMethod": "emi",
      "averageTransactionPaise": 183800,
      "accountAgeDays": 617
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0207",
    "amountPaise": 506500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:39:09.789Z",
    "customerHistory": {
      "customerId": "cust_392",
      "previousPayments": 16,
      "successfulPayments": 7,
      "previousFailures": 9,
      "retrySuccessRate": 0.44,
      "preferredMethod": "card",
      "averageTransactionPaise": 506500,
      "accountAgeDays": 275
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0217",
    "amountPaise": 101500,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:49:09.789Z",
    "customerHistory": {
      "customerId": "cust_393",
      "previousPayments": 2,
      "successfulPayments": 0,
      "previousFailures": 2,
      "retrySuccessRate": 0,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 101500,
      "accountAgeDays": 445
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0221",
    "amountPaise": 9419100,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:53:09.789Z",
    "customerHistory": {
      "customerId": "cust_568",
      "previousPayments": 23,
      "successfulPayments": 9,
      "previousFailures": 14,
      "retrySuccessRate": 0.39,
      "preferredMethod": "card",
      "averageTransactionPaise": 9419100,
      "accountAgeDays": 184
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0224",
    "amountPaise": 10222300,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T11:56:09.789Z",
    "customerHistory": {
      "customerId": "cust_793",
      "previousPayments": 16,
      "successfulPayments": 8,
      "previousFailures": 8,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 10222300,
      "accountAgeDays": 715
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0231",
    "amountPaise": 55400,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:03:09.789Z",
    "customerHistory": {
      "customerId": "cust_765",
      "previousPayments": 4,
      "successfulPayments": 2,
      "previousFailures": 2,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 55400,
      "accountAgeDays": 119
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0233",
    "amountPaise": 773600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:05:09.789Z",
    "customerHistory": {
      "customerId": "cust_795",
      "previousPayments": 22,
      "successfulPayments": 11,
      "previousFailures": 11,
      "retrySuccessRate": 0.5,
      "preferredMethod": "upi",
      "averageTransactionPaise": 773600,
      "accountAgeDays": 720
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0237",
    "amountPaise": 458900,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:09:09.789Z",
    "customerHistory": {
      "customerId": "cust_101",
      "previousPayments": 5,
      "successfulPayments": 3,
      "previousFailures": 2,
      "retrySuccessRate": 0.6,
      "preferredMethod": "card",
      "averageTransactionPaise": 458900,
      "accountAgeDays": 395
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0241",
    "amountPaise": 9759600,
    "currency": "INR",
    "status": "failed",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T12:13:09.789Z",
    "customerHistory": {
      "customerId": "cust_168",
      "previousPayments": 15,
      "successfulPayments": 8,
      "previousFailures": 7,
      "retrySuccessRate": 0.53,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 9759600,
      "accountAgeDays": 22
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0001",
    "amountPaise": 1711600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:13:09.783Z",
    "customerHistory": {
      "customerId": "cust_750",
      "previousPayments": 4,
      "successfulPayments": 1,
      "previousFailures": 3,
      "retrySuccessRate": 0.25,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1711600,
      "accountAgeDays": 100
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0002",
    "amountPaise": 111400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:14:09.784Z",
    "customerHistory": {
      "customerId": "cust_463",
      "previousPayments": 17,
      "successfulPayments": 9,
      "previousFailures": 8,
      "retrySuccessRate": 0.53,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 111400,
      "accountAgeDays": 480
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0003",
    "amountPaise": 66300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:15:09.785Z",
    "customerHistory": {
      "customerId": "cust_231",
      "previousPayments": 16,
      "successfulPayments": 8,
      "previousFailures": 8,
      "retrySuccessRate": 0.5,
      "preferredMethod": "emi",
      "averageTransactionPaise": 66300,
      "accountAgeDays": 257
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0004",
    "amountPaise": 10401800,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:16:09.785Z",
    "customerHistory": {
      "customerId": "cust_344",
      "previousPayments": 5,
      "successfulPayments": 3,
      "previousFailures": 2,
      "retrySuccessRate": 0.6,
      "preferredMethod": "card",
      "averageTransactionPaise": 10401800,
      "accountAgeDays": 190
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0005",
    "amountPaise": 191400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:17:09.785Z",
    "customerHistory": {
      "customerId": "cust_188",
      "previousPayments": 7,
      "successfulPayments": 4,
      "previousFailures": 3,
      "retrySuccessRate": 0.57,
      "preferredMethod": "upi",
      "averageTransactionPaise": 191400,
      "accountAgeDays": 597
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0006",
    "amountPaise": 100000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:18:09.785Z",
    "customerHistory": {
      "customerId": "cust_235",
      "previousPayments": 23,
      "successfulPayments": 21,
      "previousFailures": 2,
      "retrySuccessRate": 0.91,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 100000,
      "accountAgeDays": 71
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0007",
    "amountPaise": 114600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:19:09.785Z",
    "customerHistory": {
      "customerId": "cust_273",
      "previousPayments": 8,
      "successfulPayments": 4,
      "previousFailures": 4,
      "retrySuccessRate": 0.5,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 114600,
      "accountAgeDays": 123
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0009",
    "amountPaise": 679500,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:21:09.785Z",
    "customerHistory": {
      "customerId": "cust_238",
      "previousPayments": 24,
      "successfulPayments": 17,
      "previousFailures": 7,
      "retrySuccessRate": 0.71,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 679500,
      "accountAgeDays": 207
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0010",
    "amountPaise": 1312700,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:22:09.785Z",
    "customerHistory": {
      "customerId": "cust_448",
      "previousPayments": 23,
      "successfulPayments": 15,
      "previousFailures": 8,
      "retrySuccessRate": 0.65,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 1312700,
      "accountAgeDays": 474
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0011",
    "amountPaise": 29200,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:23:09.785Z",
    "customerHistory": {
      "customerId": "cust_250",
      "previousPayments": 7,
      "successfulPayments": 3,
      "previousFailures": 4,
      "retrySuccessRate": 0.43,
      "preferredMethod": "upi",
      "averageTransactionPaise": 29200,
      "accountAgeDays": 523
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0012",
    "amountPaise": 6938600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:24:09.785Z",
    "customerHistory": {
      "customerId": "cust_366",
      "previousPayments": 23,
      "successfulPayments": 20,
      "previousFailures": 3,
      "retrySuccessRate": 0.87,
      "preferredMethod": "emi",
      "averageTransactionPaise": 6938600,
      "accountAgeDays": 728
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0013",
    "amountPaise": 87000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:25:09.785Z",
    "customerHistory": {
      "customerId": "cust_284",
      "previousPayments": 13,
      "successfulPayments": 8,
      "previousFailures": 5,
      "retrySuccessRate": 0.62,
      "preferredMethod": "upi",
      "averageTransactionPaise": 87000,
      "accountAgeDays": 464
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0015",
    "amountPaise": 1072000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:27:09.785Z",
    "customerHistory": {
      "customerId": "cust_521",
      "previousPayments": 24,
      "successfulPayments": 17,
      "previousFailures": 7,
      "retrySuccessRate": 0.71,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1072000,
      "accountAgeDays": 678
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0016",
    "amountPaise": 52500,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:28:09.785Z",
    "customerHistory": {
      "customerId": "cust_558",
      "previousPayments": 18,
      "successfulPayments": 14,
      "previousFailures": 4,
      "retrySuccessRate": 0.78,
      "preferredMethod": "emi",
      "averageTransactionPaise": 52500,
      "accountAgeDays": 549
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0017",
    "amountPaise": 188200,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:29:09.785Z",
    "customerHistory": {
      "customerId": "cust_479",
      "previousPayments": 23,
      "successfulPayments": 14,
      "previousFailures": 9,
      "retrySuccessRate": 0.61,
      "preferredMethod": "card",
      "averageTransactionPaise": 188200,
      "accountAgeDays": 613
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0019",
    "amountPaise": 926600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:31:09.785Z",
    "customerHistory": {
      "customerId": "cust_300",
      "previousPayments": 22,
      "successfulPayments": 19,
      "previousFailures": 3,
      "retrySuccessRate": 0.86,
      "preferredMethod": "emi",
      "averageTransactionPaise": 926600,
      "accountAgeDays": 542
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0020",
    "amountPaise": 6528500,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:32:09.785Z",
    "customerHistory": {
      "customerId": "cust_323",
      "previousPayments": 14,
      "successfulPayments": 9,
      "previousFailures": 5,
      "retrySuccessRate": 0.64,
      "preferredMethod": "upi",
      "averageTransactionPaise": 6528500,
      "accountAgeDays": 468
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0021",
    "amountPaise": 185100,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:33:09.785Z",
    "customerHistory": {
      "customerId": "cust_140",
      "previousPayments": 2,
      "successfulPayments": 1,
      "previousFailures": 1,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 185100,
      "accountAgeDays": 572
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0022",
    "amountPaise": 200000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:34:09.785Z",
    "customerHistory": {
      "customerId": "cust_198",
      "previousPayments": 22,
      "successfulPayments": 14,
      "previousFailures": 8,
      "retrySuccessRate": 0.64,
      "preferredMethod": "card",
      "averageTransactionPaise": 200000,
      "accountAgeDays": 198
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0023",
    "amountPaise": 939300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:35:09.785Z",
    "customerHistory": {
      "customerId": "cust_724",
      "previousPayments": 21,
      "successfulPayments": 17,
      "previousFailures": 4,
      "retrySuccessRate": 0.81,
      "preferredMethod": "upi",
      "averageTransactionPaise": 939300,
      "accountAgeDays": 37
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0024",
    "amountPaise": 117800,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:36:09.785Z",
    "customerHistory": {
      "customerId": "cust_656",
      "previousPayments": 9,
      "successfulPayments": 6,
      "previousFailures": 3,
      "retrySuccessRate": 0.67,
      "preferredMethod": "upi",
      "averageTransactionPaise": 117800,
      "accountAgeDays": 58
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0025",
    "amountPaise": 72900,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:37:09.786Z",
    "customerHistory": {
      "customerId": "cust_323",
      "previousPayments": 18,
      "successfulPayments": 12,
      "previousFailures": 6,
      "retrySuccessRate": 0.67,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 72900,
      "accountAgeDays": 245
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0026",
    "amountPaise": 148400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:38:09.786Z",
    "customerHistory": {
      "customerId": "cust_165",
      "previousPayments": 11,
      "successfulPayments": 7,
      "previousFailures": 4,
      "retrySuccessRate": 0.64,
      "preferredMethod": "card",
      "averageTransactionPaise": 148400,
      "accountAgeDays": 585
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0027",
    "amountPaise": 1021300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:39:09.786Z",
    "customerHistory": {
      "customerId": "cust_821",
      "previousPayments": 22,
      "successfulPayments": 19,
      "previousFailures": 3,
      "retrySuccessRate": 0.86,
      "preferredMethod": "upi",
      "averageTransactionPaise": 1021300,
      "accountAgeDays": 706
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0028",
    "amountPaise": 395600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:40:09.786Z",
    "customerHistory": {
      "customerId": "cust_353",
      "previousPayments": 17,
      "successfulPayments": 10,
      "previousFailures": 7,
      "retrySuccessRate": 0.59,
      "preferredMethod": "emi",
      "averageTransactionPaise": 395600,
      "accountAgeDays": 235
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0029",
    "amountPaise": 213400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:41:09.786Z",
    "customerHistory": {
      "customerId": "cust_590",
      "previousPayments": 23,
      "successfulPayments": 21,
      "previousFailures": 2,
      "retrySuccessRate": 0.91,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 213400,
      "accountAgeDays": 244
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0031",
    "amountPaise": 209400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:43:09.786Z",
    "customerHistory": {
      "customerId": "cust_526",
      "previousPayments": 23,
      "successfulPayments": 17,
      "previousFailures": 6,
      "retrySuccessRate": 0.74,
      "preferredMethod": "upi",
      "averageTransactionPaise": 209400,
      "accountAgeDays": 294
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0032",
    "amountPaise": 5077400,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:44:09.786Z",
    "customerHistory": {
      "customerId": "cust_501",
      "previousPayments": 6,
      "successfulPayments": 3,
      "previousFailures": 3,
      "retrySuccessRate": 0.5,
      "preferredMethod": "card",
      "averageTransactionPaise": 5077400,
      "accountAgeDays": 419
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0033",
    "amountPaise": 1754600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:45:09.786Z",
    "customerHistory": {
      "customerId": "cust_820",
      "previousPayments": 4,
      "successfulPayments": 3,
      "previousFailures": 1,
      "retrySuccessRate": 0.75,
      "preferredMethod": "netbanking",
      "averageTransactionPaise": 1754600,
      "accountAgeDays": 316
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0034",
    "amountPaise": 1505000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:46:09.786Z",
    "customerHistory": {
      "customerId": "cust_569",
      "previousPayments": 20,
      "successfulPayments": 14,
      "previousFailures": 6,
      "retrySuccessRate": 0.7,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 1505000,
      "accountAgeDays": 131
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0035",
    "amountPaise": 1675600,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:47:09.786Z",
    "customerHistory": {
      "customerId": "cust_786",
      "previousPayments": 18,
      "successfulPayments": 13,
      "previousFailures": 5,
      "retrySuccessRate": 0.72,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 1675600,
      "accountAgeDays": 238
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0037",
    "amountPaise": 1648800,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:49:09.786Z",
    "customerHistory": {
      "customerId": "cust_104",
      "previousPayments": 19,
      "successfulPayments": 9,
      "previousFailures": 10,
      "retrySuccessRate": 0.47,
      "preferredMethod": "emi",
      "averageTransactionPaise": 1648800,
      "accountAgeDays": 376
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0038",
    "amountPaise": 87000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:50:09.786Z",
    "customerHistory": {
      "customerId": "cust_764",
      "previousPayments": 11,
      "successfulPayments": 7,
      "previousFailures": 4,
      "retrySuccessRate": 0.64,
      "preferredMethod": "card",
      "averageTransactionPaise": 87000,
      "accountAgeDays": 64
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0039",
    "amountPaise": 166900,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:51:09.786Z",
    "customerHistory": {
      "customerId": "cust_640",
      "previousPayments": 7,
      "successfulPayments": 5,
      "previousFailures": 2,
      "retrySuccessRate": 0.71,
      "preferredMethod": "upi",
      "averageTransactionPaise": 166900,
      "accountAgeDays": 357
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0040",
    "amountPaise": 85200,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:52:09.786Z",
    "customerHistory": {
      "customerId": "cust_366",
      "previousPayments": 5,
      "successfulPayments": 3,
      "previousFailures": 2,
      "retrySuccessRate": 0.6,
      "preferredMethod": "emi",
      "averageTransactionPaise": 85200,
      "accountAgeDays": 637
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0041",
    "amountPaise": 125300,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:53:09.786Z",
    "customerHistory": {
      "customerId": "cust_321",
      "previousPayments": 21,
      "successfulPayments": 16,
      "previousFailures": 5,
      "retrySuccessRate": 0.76,
      "preferredMethod": "card",
      "averageTransactionPaise": 125300,
      "accountAgeDays": 730
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0042",
    "amountPaise": 121100,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:54:09.786Z",
    "customerHistory": {
      "customerId": "cust_709",
      "previousPayments": 14,
      "successfulPayments": 12,
      "previousFailures": 2,
      "retrySuccessRate": 0.86,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 121100,
      "accountAgeDays": 586
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0043",
    "amountPaise": 244900,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:55:09.786Z",
    "customerHistory": {
      "customerId": "cust_213",
      "previousPayments": 7,
      "successfulPayments": 4,
      "previousFailures": 3,
      "retrySuccessRate": 0.57,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 244900,
      "accountAgeDays": 331
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0044",
    "amountPaise": 98800,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:56:09.786Z",
    "customerHistory": {
      "customerId": "cust_504",
      "previousPayments": 16,
      "successfulPayments": 9,
      "previousFailures": 7,
      "retrySuccessRate": 0.56,
      "preferredMethod": "upi",
      "averageTransactionPaise": 98800,
      "accountAgeDays": 418
    },
    "riskScore": 0.15
  },
  {
    "transactionId": "txn_salv_0045",
    "amountPaise": 99000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "errorCode": "BANK_TIMEOUT",
    "errorDescription": "Issuer bank timeout during transaction processing",
    "createdAt": "2026-08-25T08:57:09.786Z",
    "customerHistory": {
      "customerId": "cust_295",
      "previousPayments": 6,
      "successfulPayments": 4,
      "previousFailures": 2,
      "retrySuccessRate": 0.67,
      "preferredMethod": "wallet",
      "averageTransactionPaise": 99000,
      "accountAgeDays": 159
    },
    "riskScore": 0.15
  }
];

export const BENCHMARK_AUDIT_LOGS: AuditLogDocument[] = [
  {
    "eventId": "evt_txn_demo_scen_05_limit_pol_2330befb",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_2bc27f92",
      "strategy": "smart_retry",
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.796Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_exec_f197775f",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_scen_f_3fail_d3c4022e",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim__3fail_smar_1"
    },
    "timestamp": "2026-08-24T05:50:22.796Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_comp_ca8f1df5",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_scen_f_3fail_d3c4022e",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.796Z"
  },
  {
    "eventId": "evt_txn_demo_scen_05_limit_blk_7ab39131",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_2bc27f92",
      "strategy": "smart_retry",
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt."
    },
    "timestamp": "2026-08-24T05:50:22.801Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_157bf24b",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.811Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_ff8ba634",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.816Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_f732e61b",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.817Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_08f4435f",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.817Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_e30e5d8a",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "smart_retry",
      "selectedFallbackStrategy": "payment_method_switch",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.824Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_34a03c21",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.829Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_b139328a",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.833Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_07ff7b2c",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.835Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_324cfe66",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.835Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_f122cd8e",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "payment_method_switch",
      "selectedFallbackStrategy": "payment_link",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.840Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_564ba74c",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
      "strategy": "payment_link",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:22.844Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_336ece32",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
      "strategy": "payment_link",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:22.848Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_63bb7ade",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.849Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_d6693fe6",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.849Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_pol_7a657647",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_58ad0be1",
      "strategy": "no_action",
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.859Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_blk_a5daf767",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_58ad0be1",
      "strategy": "no_action",
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    },
    "timestamp": "2026-08-24T05:50:22.863Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_pol_750e1206",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.868Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_329d9e73",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.871Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_start_3283f5d8",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.873Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_1dc601e9",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-24T05:50:22.873Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_d463543a",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.873Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_bb6d678f",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.883Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_3c2ff730",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.886Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_3a403891",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.889Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_3af87826",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.889Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_ec6e993e",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "smart_retry",
      "selectedFallbackStrategy": "payment_method_switch",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.896Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_00df2913",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.900Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_aaadfbd7",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.905Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_d7d31a40",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.907Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_2e772c18",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.907Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_9fd285f5",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "payment_method_switch",
      "selectedFallbackStrategy": "payment_link",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:22.912Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_5f0ab5b8",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
      "strategy": "payment_link",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:22.917Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_9f41b309",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
      "strategy": "payment_link",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:22.922Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_631c4d92",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.923Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_b7dced6e",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:22.923Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_pol_6768f1f0",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.934Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_a480fa9d",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.938Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_start_35b34bcf",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.940Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_8fb2c39b",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-24T05:50:22.940Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_178f572f",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.940Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_pol_c3e5c5a6",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.950Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_1c8020b9",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.954Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_start_d470cd65",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.956Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_b5d2f3da",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-24T05:50:22.956Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_934ba31e",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.956Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_pol_919ce07f",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.973Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_ea09f304",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.977Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_start_2f5f12c4",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.979Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_994f9111",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-24T05:50:22.979Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_3af9a50c",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.979Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_pol_09d24b31",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.989Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_app_7fdda3ef",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:22.994Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_start_ea35e3a7",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 380000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:22.996Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_exec_a1b10dd5",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    },
    "timestamp": "2026-08-24T05:50:22.996Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_fb_500d7de9",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "smart_retry",
      "selectedFallbackStrategy": "payment_method_switch",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.002Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_pol_14db1d1a",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.007Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_app_1a3b566b",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.013Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_start_6d261434",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 380000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:23.015Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_exec_42d3ab6c",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "success": true,
      "recoveredAmountPaise": 290700,
      "providerReference": "rzp_test_sim_llback_paym_2"
    },
    "timestamp": "2026-08-24T05:50:23.015Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_comp_e5053ccf",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "strategy": "payment_method_switch",
      "recoveredAmountPaise": 290700,
      "totalTransactionAmountPaise": 380000,
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.015Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_pol_02732544",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_8253bfce",
      "strategy": "no_action",
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.026Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_blk_5c658a70",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_8253bfce",
      "strategy": "no_action",
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    },
    "timestamp": "2026-08-24T05:50:23.031Z"
  },
  {
    "eventId": "evt_txn_demo_scen_04_lowconf_pol_093d5044",
    "transactionId": "txn_demo_scen_04_lowconf",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_04_lowconf_a8b8c438",
      "strategy": "smart_retry",
      "allowed": false,
      "reasonCode": "CONFIDENCE_TOO_LOW",
      "reason": "Diagnosis confidence is below deterministic minimum threshold.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.036Z"
  },
  {
    "eventId": "evt_txn_demo_scen_04_lowconf_blk_ca268fca",
    "transactionId": "txn_demo_scen_04_lowconf",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_04_lowconf_a8b8c438",
      "strategy": "smart_retry",
      "reasonCode": "CONFIDENCE_TOO_LOW",
      "reason": "Diagnosis confidence is below deterministic minimum threshold."
    },
    "timestamp": "2026-08-24T05:50:23.042Z"
  },
  {
    "eventId": "evt_txn_demo_scen_05_limit_pol_7ee29780",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_ed4b3fb2",
      "strategy": "smart_retry",
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.048Z"
  },
  {
    "eventId": "evt_txn_demo_scen_05_limit_blk_9e6ed2f8",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_ed4b3fb2",
      "strategy": "smart_retry",
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt."
    },
    "timestamp": "2026-08-24T05:50:23.052Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_f8f7c1a7",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_9078867c",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.058Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_527691ef",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_9078867c",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.062Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_24fe9de8",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_9078867c",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:23.064Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_e437ecdd",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_9078867c",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:23.064Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_d33c78d4",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "smart_retry",
      "selectedFallbackStrategy": "payment_method_switch",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-24T05:50:23.071Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_aebdaf91",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.077Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_f0686702",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.082Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_41e1b252",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:23.084Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_8e60ff67",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:23.084Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_3549aa7d",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "payment_method_switch",
      "selectedFallbackStrategy": "payment_link",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-24T05:50:23.090Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_a367d73d",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
      "strategy": "payment_link",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:23.096Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_00b22770",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
      "strategy": "payment_link",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-24T05:50:23.100Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_dee1c111",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-24T05:50:23.103Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_dc520abd",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-24T05:50:23.103Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_start_c3988ee9",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637940217",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:05:40.217Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_exec_ce1db00b",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637940217",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    },
    "timestamp": "2026-08-25T06:05:40.217Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_comp_9d44db9e",
    "transactionId": "txn_test_exec_01",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637940217",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:05:40.217Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_blk_6eaad7cb",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_blocked",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637955431",
      "strategy": "smart_retry",
      "policyStatus": "pending",
      "reason": "Execution refused: Action has not been approved by Policy Gate."
    },
    "timestamp": "2026-08-25T06:05:55.431Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_blk_e98bc18b",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_blocked",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637955431",
      "strategy": "smart_retry",
      "policyStatus": "blocked",
      "reason": "Execution refused: Action has not been approved by Policy Gate."
    },
    "timestamp": "2026-08-25T06:06:00.456Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_start_38896f25",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637965477",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:06:05.477Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_exec_043e7db4",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637965477",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    },
    "timestamp": "2026-08-25T06:06:05.477Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_comp_3b4148fa",
    "transactionId": "txn_test_exec_01",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787637965477",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:06:05.477Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_pol_a92e0de9",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_aee97017",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:06:22.379Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_start_c7413e9e",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639136522",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:25:36.522Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_exec_26110d19",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639136522",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    },
    "timestamp": "2026-08-25T06:25:36.522Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_comp_e966e57d",
    "transactionId": "txn_test_exec_01",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639136522",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:25:36.522Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_blk_f2dc453c",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_blocked",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639151624",
      "strategy": "smart_retry",
      "policyStatus": "pending",
      "reason": "Execution refused: Action has not been approved by Policy Gate."
    },
    "timestamp": "2026-08-25T06:25:51.624Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_blk_ae1e2579",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_blocked",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639151624",
      "strategy": "smart_retry",
      "policyStatus": "blocked",
      "reason": "Execution refused: Action has not been approved by Policy Gate."
    },
    "timestamp": "2026-08-25T06:25:56.647Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_949e53bf",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639144391",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:26:04.579Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_exec_93761020",
    "transactionId": "txn_test_exec_01",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639161665",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    },
    "timestamp": "2026-08-25T06:26:01.665Z"
  },
  {
    "eventId": "evt_txn_test_exec_01_comp_70d1b07b",
    "transactionId": "txn_test_exec_01",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_test_1787639161665",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:26:01.665Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_975db70c",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639144391",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-25T06:26:09.594Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_b4309208",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639144391",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:26:09.594Z"
  },
  {
    "eventId": "evt_txn_scen_a_01_pol_5a67939a",
    "transactionId": "txn_scen_a_01",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_a_01_2092969a",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:26:59.160Z"
  },
  {
    "eventId": "evt_txn_scen_a_01_app_499c3a4c",
    "transactionId": "txn_scen_a_01",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_a_01_2092969a",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:27:09.219Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_pol_530ea099",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:27:17.259Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_app_003e3758",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:27:27.303Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_start_ad594ea8",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 380000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:27:32.316Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_exec_f15960c1",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    },
    "timestamp": "2026-08-25T06:27:32.316Z"
  },
  {
    "eventId": "evt_txn_scen_b_fb_app_63fe1672",
    "transactionId": "txn_scen_b_fb",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_b_fb_ec88db99",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:27:50.154Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_pol_13d91ecd",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_81ebe7aa_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-25T06:27:57.545Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_app_dc51ba81",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_81ebe7aa_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-25T06:28:07.605Z"
  },
  {
    "eventId": "evt_txn_demo_scen_02_fallback_start_9ca162fe",
    "transactionId": "txn_demo_scen_02_fallback",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_02_fallback_fb_81ebe7aa_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 380000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:28:12.632Z"
  },
  {
    "eventId": "evt_txn_scen_c_risk_pol_8d336559",
    "transactionId": "txn_scen_c_risk",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_c_risk_f84ddd54",
      "strategy": "no_action",
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:28:23.000Z"
  },
  {
    "eventId": "evt_txn_scen_c_risk_blk_dba75224",
    "transactionId": "txn_scen_c_risk",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_c_risk_f84ddd54",
      "strategy": "no_action",
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    },
    "timestamp": "2026-08-25T06:28:33.046Z"
  },
  {
    "eventId": "evt_txn_scen_d_limit_diag_010ae26b",
    "transactionId": "txn_scen_d_limit",
    "eventType": "diagnosis_created",
    "actor": "gemini_agent",
    "details": {
      "actionId": "act_txn_scen_d_limit_1787639331437",
      "failureType": "temporary",
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "recoverability": 0.9,
      "predictedRecoveryPaise": 405000,
      "model": "openrouter/free",
      "evidenceCount": 4
    },
    "timestamp": "2026-08-25T06:28:51.437Z"
  },
  {
    "eventId": "evt_txn_scen_d_limit_pol_cf0a7590",
    "transactionId": "txn_scen_d_limit",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_d_limit_1787639331437",
      "strategy": "smart_retry",
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:29:01.482Z"
  },
  {
    "eventId": "evt_txn_scen_d_limit_blk_89f6e735",
    "transactionId": "txn_scen_d_limit",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_d_limit_1787639331437",
      "strategy": "smart_retry",
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt."
    },
    "timestamp": "2026-08-25T06:29:11.520Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_diag_12f3b875",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "diagnosis_created",
    "actor": "gemini_agent",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "failureType": "temporary",
      "recommendedStrategy": "smart_retry",
      "confidence": 0.82,
      "recoverability": 0.85,
      "predictedRecoveryPaise": 382500,
      "model": "openrouter/free",
      "evidenceCount": 3
    },
    "timestamp": "2026-08-25T06:29:22.477Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_pol_48b6d7db",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:29:32.515Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_app_1fc0454d",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:29:42.557Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_start_0ba7b981",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:29:47.581Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_exec_50d2e912",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 382500,
      "providerReference": "rzp_test_sim__3fail_smar_1"
    },
    "timestamp": "2026-08-25T06:29:47.581Z"
  },
  {
    "eventId": "evt_txn_scen_f_3fail_comp_ca9d05f0",
    "transactionId": "txn_scen_f_3fail",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 382500,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:29:47.581Z"
  },
  {
    "eventId": "evt_txn_demo_scen_05_limit_pol_c26ef2ab",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_13fd81c4",
      "strategy": "smart_retry",
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:30:22.511Z"
  },
  {
    "eventId": "evt_txn_demo_scen_05_limit_blk_e470193a",
    "transactionId": "txn_demo_scen_05_limit",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_05_limit_13fd81c4",
      "strategy": "smart_retry",
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt."
    },
    "timestamp": "2026-08-25T06:30:32.576Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_0690ee59",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:30:54.813Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_99679e22",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:31:04.864Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_b5b537a4",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:31:09.882Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_b6c3c4cc",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-25T06:31:09.882Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_c46f0775",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "smart_retry",
      "selectedFallbackStrategy": "payment_method_switch",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:31:24.979Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_1d8abc8c",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
      "strategy": "payment_method_switch",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-25T06:31:35.024Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_69d72d9a",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-25T06:31:45.068Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_189da23f",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:31:50.092Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_deb0ae1f",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
      "strategy": "payment_method_switch",
      "attemptNumber": 2,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-25T06:31:50.092Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_fb_43425300",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "fallback_selected",
    "actor": "system",
    "details": {
      "failedStrategy": "payment_method_switch",
      "selectedFallbackStrategy": "payment_link",
      "attemptNumber": 2
    },
    "timestamp": "2026-08-25T06:32:05.165Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_pol_215212e4",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
      "strategy": "payment_link",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-25T06:32:15.208Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_app_7f9bbfc8",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
      "strategy": "payment_link",
      "attemptNumber": 3
    },
    "timestamp": "2026-08-25T06:32:25.358Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_start_a3711296",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "amountPaise": 320000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:32:30.388Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_exec_601ed683",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "execution_failed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
      "strategy": "payment_link",
      "attemptNumber": 3,
      "success": false,
      "recoveredAmountPaise": 0,
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    },
    "timestamp": "2026-08-25T06:32:30.388Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_diag_fe07cb4f",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "diagnosis_created",
    "actor": "gemini_agent",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_1787639572354",
      "failureType": "risk",
      "recommendedStrategy": "no_action",
      "confidence": 0.9,
      "recoverability": 0.1,
      "predictedRecoveryPaise": 0,
      "model": "openrouter/free",
      "evidenceCount": 2
    },
    "timestamp": "2026-08-25T06:32:52.354Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_pol_7e1b5071",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_1787639572354",
      "strategy": "no_action",
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:33:02.396Z"
  },
  {
    "eventId": "evt_txn_demo_scen_03_risk_blk_b259e1be",
    "transactionId": "txn_demo_scen_03_risk",
    "eventType": "action_blocked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_03_risk_1787639572354",
      "strategy": "no_action",
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    },
    "timestamp": "2026-08-25T06:33:12.434Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_diag_374f1fbc",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "diagnosis_created",
    "actor": "gemini_agent",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "failureType": "temporary",
      "recommendedStrategy": "smart_retry",
      "confidence": 0.96,
      "recoverability": 0.95,
      "predictedRecoveryPaise": 450000,
      "model": "openrouter/free",
      "evidenceCount": 3
    },
    "timestamp": "2026-08-25T06:33:28.135Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_pol_f1858395",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "policy_checked",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "strategy": "smart_retry",
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:33:38.205Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_app_4e67d497",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_approved",
    "actor": "policy_gate",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "strategy": "smart_retry",
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:33:48.291Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_start_bc824809",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_execution_started",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "amountPaise": 450000,
      "mode": "test",
      "isSimulation": true
    },
    "timestamp": "2026-08-25T06:33:53.317Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_exec_518519c0",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "action_executed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "strategy": "smart_retry",
      "attemptNumber": 1,
      "success": true,
      "recoveredAmountPaise": 450000,
      "providerReference": "rzp_test_sim_uccess_smar_1"
    },
    "timestamp": "2026-08-25T06:33:53.317Z"
  },
  {
    "eventId": "evt_txn_demo_scen_01_success_comp_8588b083",
    "transactionId": "txn_demo_scen_01_success",
    "eventType": "recovery_completed",
    "actor": "razorpay_executor",
    "details": {
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "strategy": "smart_retry",
      "recoveredAmountPaise": 450000,
      "totalTransactionAmountPaise": 450000,
      "attemptNumber": 1
    },
    "timestamp": "2026-08-25T06:33:53.317Z"
  },
  {
    "eventId": "evt_txn_demo_scen_06_3fail_diag_3ee2645d",
    "transactionId": "txn_demo_scen_06_3fail",
    "eventType": "diagnosis_created",
    "actor": "gemini_agent",
    "details": {
      "actionId": "act_txn_demo_scen_06_3fail_1787639666201",
      "failureType": "payment_method",
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.7,
      "recoverability": 0.6,
      "predictedRecoveryPaise": 320000,
      "model": "openrouter/free",
      "evidenceCount": 3
    },
    "timestamp": "2026-08-25T06:34:26.201Z"
  }
];

export const BENCHMARK_RECOVERY_ACTIONS: RecoveryActionDocument[] = [
  {
    "actionId": "act_txn_demo_scen_02_fallback_57a2ae47",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 323000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 323000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.728Z",
    "executedAt": "2026-08-24T05:50:22.741Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.732Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_57a2ae47:1",
    "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
    "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_02_fallback_57a2ae47",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.741Z",
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    }
  },
  {
    "actionId": "act_txn_scen_b_fb_d0e1aa65",
    "transactionId": "txn_scen_b_fb",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_b_fb",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.742Z",
    "executedAt": "2026-08-24T05:50:22.755Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.745Z",
      "transactionId": "txn_scen_b_fb",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_scen_b_fb_d0e1aa65:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_scen_b_fb_d0e1aa65",
      "transactionId": "txn_scen_b_fb",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.755Z",
      "providerReference": "rzp_test_sim_n_b_fb_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_fb_01573879_2",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 290700,
    "actualRecoveryPaise": 290700,
    "interventionCostPaise": 450,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.765,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.85,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 290700,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-24T05:50:22.752Z",
    "executedAt": "2026-08-24T05:50:22.764Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.755Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_fb_01573879_2:2",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_02_fallback_fb_01573879_2",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 290700,
      "executedAt": "2026-08-24T05:50:22.764Z",
      "providerReference": "rzp_test_sim_llback_paym_2"
    }
  },
  {
    "actionId": "act_txn_scen_c_risk_7e51d808",
    "transactionId": "txn_scen_c_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.92,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_c_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-24T05:50:22.763Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.765Z",
      "transactionId": "txn_scen_c_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_demo_scen_03_risk_4ffd1bdf",
    "transactionId": "txn_demo_scen_03_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.98,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_03_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.98,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-24T05:50:22.771Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.774Z",
      "transactionId": "txn_demo_scen_03_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_scen_d_limit_7475bc4d",
    "transactionId": "txn_scen_d_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_d_limit",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.774Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.777Z",
      "transactionId": "txn_scen_d_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_demo_scen_04_lowconf_2e944288",
    "transactionId": "txn_demo_scen_04_lowconf",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 356000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.45,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: TRANSACTION_REJECTED_UNKNOWN"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_04_lowconf",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.45,
      "evidence": [
        "Observable failure code: TRANSACTION_REJECTED_UNKNOWN"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 356000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.782Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "CONFIDENCE_TOO_LOW",
      "reason": "Diagnosis confidence is below deterministic minimum threshold.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": false,
          "reason": "Diagnosis confidence (45.0%) is below required minimum threshold (60%)."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.784Z",
      "transactionId": "txn_demo_scen_04_lowconf",
      "verdict": "blocked",
      "triggeredRules": [
        "CONFIDENCE_THRESHOLD_CHECK"
      ],
      "explanation": "Diagnosis confidence is below deterministic minimum threshold."
    }
  },
  {
    "actionId": "act_txn_scen_f_3fail_d3c4022e",
    "transactionId": "txn_scen_f_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_f_3fail",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.784Z",
    "executedAt": "2026-08-24T05:50:22.796Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.787Z",
      "transactionId": "txn_scen_f_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_scen_f_3fail_d3c4022e:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_scen_f_3fail_d3c4022e",
      "transactionId": "txn_scen_f_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.796Z",
      "providerReference": "rzp_test_sim__3fail_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_05_limit_2bc27f92",
    "transactionId": "txn_demo_scen_05_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 208000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_05_limit",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 208000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.794Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.796Z",
      "transactionId": "txn_demo_scen_05_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 128000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.85,
      "evidence": [
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 128000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.804Z",
    "executedAt": "2026-08-24T05:50:22.817Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.810Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_6513d9fd:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_6513d9fd",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.817Z",
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 115200,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.81,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.36000000000000004,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.81,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 115200,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-24T05:50:22.826Z",
    "executedAt": "2026-08-24T05:50:22.835Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.829Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_41e09597_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_41e09597_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.835Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 103680,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.77,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.32400000000000007,
      "recommendedStrategy": "payment_link",
      "confidence": 0.77,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 103680,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-24T05:50:22.842Z",
    "executedAt": "2026-08-24T05:50:22.849Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.844Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_219ecabb_3:3",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_219ecabb_3",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.849Z",
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_03_risk_58ad0be1",
    "transactionId": "txn_demo_scen_03_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.98,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_03_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.98,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-24T05:50:22.856Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.859Z",
      "transactionId": "txn_demo_scen_03_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_9906b54b",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.866Z",
    "executedAt": "2026-08-24T05:50:22.873Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.868Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_9906b54b:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_9906b54b",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.873Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 128000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.85,
      "evidence": [
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 128000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.881Z",
    "executedAt": "2026-08-24T05:50:22.889Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.883Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_02ef03d7:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_02ef03d7",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.889Z",
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 115200,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.81,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.36000000000000004,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.81,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 115200,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-24T05:50:22.898Z",
    "executedAt": "2026-08-24T05:50:22.907Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.900Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_0a0ebfc2_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.907Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 103680,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.77,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.32400000000000007,
      "recommendedStrategy": "payment_link",
      "confidence": 0.77,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 103680,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-24T05:50:22.915Z",
    "executedAt": "2026-08-24T05:50:22.923Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.917Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_8fabe502_3:3",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_8fabe502_3",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.923Z",
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_66068a0b",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.931Z",
    "executedAt": "2026-08-24T05:50:22.940Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.934Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_66068a0b:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_66068a0b",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.940Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.948Z",
    "executedAt": "2026-08-24T05:50:22.956Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.950Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_9d8dfa86:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_9d8dfa86",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.956Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.970Z",
    "executedAt": "2026-08-24T05:50:22.979Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.972Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_6d8a8c34:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_6d8a8c34",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-24T05:50:22.979Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 323000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 323000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:22.987Z",
    "executedAt": "2026-08-24T05:50:22.996Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:22.989Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_a33b209d:1",
    "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
    "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_02_fallback_a33b209d",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:22.996Z",
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 290700,
    "actualRecoveryPaise": 290700,
    "interventionCostPaise": 450,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.765,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.85,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 290700,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-24T05:50:23.005Z",
    "executedAt": "2026-08-24T05:50:23.015Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.007Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_fb_e1838175_2:2",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_02_fallback_fb_e1838175_2",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 290700,
      "executedAt": "2026-08-24T05:50:23.015Z",
      "providerReference": "rzp_test_sim_llback_paym_2"
    }
  },
  {
    "actionId": "act_txn_demo_scen_03_risk_8253bfce",
    "transactionId": "txn_demo_scen_03_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.98,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_03_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.98,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-24T05:50:23.023Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.026Z",
      "transactionId": "txn_demo_scen_03_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_demo_scen_04_lowconf_a8b8c438",
    "transactionId": "txn_demo_scen_04_lowconf",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 356000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.45,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: TRANSACTION_REJECTED_UNKNOWN"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_04_lowconf",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.45,
      "evidence": [
        "Observable failure code: TRANSACTION_REJECTED_UNKNOWN"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 356000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:23.033Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "CONFIDENCE_TOO_LOW",
      "reason": "Diagnosis confidence is below deterministic minimum threshold.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": false,
          "reason": "Diagnosis confidence (45.0%) is below required minimum threshold (60%)."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.036Z",
      "transactionId": "txn_demo_scen_04_lowconf",
      "verdict": "blocked",
      "triggeredRules": [
        "CONFIDENCE_THRESHOLD_CHECK"
      ],
      "explanation": "Diagnosis confidence is below deterministic minimum threshold."
    }
  },
  {
    "actionId": "act_txn_demo_scen_05_limit_ed4b3fb2",
    "transactionId": "txn_demo_scen_05_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 208000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_05_limit",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 208000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:23.045Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.047Z",
      "transactionId": "txn_demo_scen_05_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_9078867c",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 128000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.85,
      "evidence": [
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 128000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-24T05:50:23.055Z",
    "executedAt": "2026-08-24T05:50:23.064Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.058Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_9078867c:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_9078867c",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:23.064Z",
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 115200,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.81,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.36000000000000004,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.81,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 115200,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-24T05:50:23.075Z",
    "executedAt": "2026-08-24T05:50:23.084Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.077Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_80d53bce_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_80d53bce_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:23.084Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 103680,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.77,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.32400000000000007,
      "recommendedStrategy": "payment_link",
      "confidence": 0.77,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 103680,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-24T05:50:23.093Z",
    "executedAt": "2026-08-24T05:50:23.103Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-24T05:50:23.096Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_485f59e1_3:3",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_485f59e1_3",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-24T05:50:23.103Z",
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_test_1787637940217",
    "transactionId": "txn_test_exec_01",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observed GATEWAY_TIMEOUT"
    ],
    "reasoning": "Transient network failure",
    "createdAt": "2026-08-25T06:05:40.217Z",
    "executedAt": "2026-08-25T06:05:40.217Z",
    "idempotencyKey": "salvo:act_test_1787637940217:1",
    "executionResult": {
      "success": true,
      "actionId": "act_test_1787637940217",
      "transactionId": "txn_test_exec_01",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:05:40.217Z",
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_df6dd6ce",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:05:41.277Z",
    "executedAt": null,
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:05:46.324Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    }
  },
  {
    "actionId": "act_test_1787637965477",
    "transactionId": "txn_test_exec_01",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observed GATEWAY_TIMEOUT"
    ],
    "reasoning": "Transient network failure",
    "createdAt": "2026-08-25T06:06:05.477Z",
    "executedAt": "2026-08-25T06:06:05.477Z",
    "idempotencyKey": "salvo:act_test_1787637965477:1",
    "executionResult": {
      "success": true,
      "actionId": "act_test_1787637965477",
      "transactionId": "txn_test_exec_01",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:06:05.477Z",
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    }
  },
  {
    "actionId": "act_txn_scen_a_01_e0c72c54",
    "transactionId": "txn_scen_a_01",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "pending",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_a_01",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:06:21.435Z",
    "executedAt": null
  },
  {
    "actionId": "act_txn_demo_scen_01_success_1787639144391",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 0,
    "confidence": 0.95,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Gateway failure code indicates a temporary network timeout on the primary HDFC gateway route.",
      "Customer has a strong payment history with 11 successful transactions out of 12 and a 92% historical retry success rate.",
      "Retry count is 0, suggesting this is the first attempt and no recovery action has been taken yet.",
      "Failure category is explicitly marked as temporary_network_failure, aligning with transient gateway issues."
    ],
    "reasoning": "The transaction failed due to a temporary network timeout on the acquiring switch, which is a transient issue. Given the customer's high historical retry success rate and clean payment history, a smart retry on an alternate gateway route is the safest and most effective recovery strategy.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.92,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.95,
      "evidence": [
        "Gateway failure code indicates a temporary network timeout on the primary HDFC gateway route.",
        "Customer has a strong payment history with 11 successful transactions out of 12 and a 92% historical retry success rate.",
        "Retry count is 0, suggesting this is the first attempt and no recovery action has been taken yet.",
        "Failure category is explicitly marked as temporary_network_failure, aligning with transient gateway issues."
      ],
      "reasoning": "The transaction failed due to a temporary network timeout on the acquiring switch, which is a transient issue. Given the customer's high historical retry success rate and clean payment history, a smart retry on an alternate gateway route is the safest and most effective recovery strategy.",
      "predictedRecoveryPaise": 450000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:25:44.391Z",
    "executedAt": "2026-08-25T06:26:09.594Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:25:54.504Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_1787639144391:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_1787639144391",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:26:09.594Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_test_1787639161665",
    "transactionId": "txn_test_exec_01",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observed GATEWAY_TIMEOUT"
    ],
    "reasoning": "Transient network failure",
    "createdAt": "2026-08-25T06:26:01.665Z",
    "executedAt": "2026-08-25T06:26:01.665Z",
    "idempotencyKey": "salvo:act_test_1787639161665:1",
    "executionResult": {
      "success": true,
      "actionId": "act_test_1787639161665",
      "transactionId": "txn_test_exec_01",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:26:01.665Z",
      "providerReference": "rzp_test_sim_xec_01_smar_1"
    }
  },
  {
    "actionId": "act_txn_scen_a_01_2092969a",
    "transactionId": "txn_scen_a_01",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_a_01",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:26:54.131Z",
    "executedAt": null,
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:26:59.160Z",
      "transactionId": "txn_scen_a_01",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 323000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 323000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:27:12.225Z",
    "executedAt": "2026-08-25T06:27:32.316Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:27:17.258Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_087ba93a:1",
    "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
    "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_02_fallback_087ba93a",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:27:32.316Z",
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    }
  },
  {
    "actionId": "act_txn_scen_b_fb_ec88db99",
    "transactionId": "txn_scen_b_fb",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.92,
    "policyStatus": "approved",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_b_fb",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:27:35.063Z",
    "executedAt": null,
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:27:40.082Z",
      "transactionId": "txn_scen_b_fb",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_fb_81ebe7aa_2",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 290700,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "not_executed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.765,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.85,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 290700,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-25T06:27:52.517Z",
    "executedAt": null,
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:27:57.544Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    }
  },
  {
    "actionId": "act_txn_scen_c_risk_f84ddd54",
    "transactionId": "txn_scen_c_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.92,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_scen_c_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.92,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:28:17.984Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:28:22.999Z",
      "transactionId": "txn_scen_c_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_scen_d_limit_1787639331437",
    "transactionId": "txn_scen_d_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 405000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Gateway failure code GATEWAY_TIMEOUT indicates temporary network issue",
      "Failure category temporary_network_failure",
      "Historical retry success rate 90% suggests retry likely to succeed",
      "Retry count 2 is low, allowing another safe attempt"
    ],
    "reasoning": "The timeout points to a transient upstream issue; with strong historical retry success, a smart retry is the safest recovery action.",
    "diagnosis": {
      "transactionId": "txn_scen_d_limit",
      "failureType": "temporary",
      "recoverability": 0.9,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Gateway failure code GATEWAY_TIMEOUT indicates temporary network issue",
        "Failure category temporary_network_failure",
        "Historical retry success rate 90% suggests retry likely to succeed",
        "Retry count 2 is low, allowing another safe attempt"
      ],
      "reasoning": "The timeout points to a transient upstream issue; with strong historical retry success, a smart retry is the safest recovery action.",
      "predictedRecoveryPaise": 405000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:28:51.437Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:29:01.482Z",
      "transactionId": "txn_scen_d_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_scen_f_3fail_1787639362477",
    "transactionId": "txn_scen_f_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 50,
    "confidence": 0.82,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Gateway failure code GATEWAY_TIMEOUT indicates transient upstream acquirer latency, not a hard decline.",
      "Failure category 'insufficient_funds' is inconsistent with a pure timeout, suggesting either a soft hold that timed out or a transient issuer-side resource issue recoverable on retry.",
      "Customer has 9/10 historical successes (90% retry success rate) with preferred payment method matching current instrument, indicating reliable payer."
    ],
    "reasoning": "The primary signal is a GATEWAY_TIMEOUT at the upstream acquirer, which is a classic transient failure well-suited for a smart retry with backoff. The mismatch with the 'insufficient_funds' category leans toward a soft/ambiguous failure rather than a definitive hard decline. Given the customer's strong 90% historical retry success rate, preferred card on file, and no prior risk flags, a smart retry offers the highest expected recovery with low intervention cost.",
    "diagnosis": {
      "transactionId": "txn_scen_f_3fail",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.82,
      "evidence": [
        "Gateway failure code GATEWAY_TIMEOUT indicates transient upstream acquirer latency, not a hard decline.",
        "Failure category 'insufficient_funds' is inconsistent with a pure timeout, suggesting either a soft hold that timed out or a transient issuer-side resource issue recoverable on retry.",
        "Customer has 9/10 historical successes (90% retry success rate) with preferred payment method matching current instrument, indicating reliable payer."
      ],
      "reasoning": "The primary signal is a GATEWAY_TIMEOUT at the upstream acquirer, which is a classic transient failure well-suited for a smart retry with backoff. The mismatch with the 'insufficient_funds' category leans toward a soft/ambiguous failure rather than a definitive hard decline. Given the customer's strong 90% historical retry success rate, preferred card on file, and no prior risk flags, a smart retry offers the highest expected recovery with low intervention cost.",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 50
    },
    "createdAt": "2026-08-25T06:29:22.477Z",
    "executedAt": "2026-08-25T06:29:47.581Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:29:32.515Z",
      "transactionId": "txn_scen_f_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_scen_f_3fail_1787639362477:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_scen_f_3fail_1787639362477",
      "transactionId": "txn_scen_f_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-25T06:29:47.581Z",
      "providerReference": "rzp_test_sim__3fail_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_05_limit_13fd81c4",
    "transactionId": "txn_demo_scen_05_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 208000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_05_limit",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 208000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:30:17.462Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:30:22.510Z",
      "transactionId": "txn_demo_scen_05_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 128000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.85,
      "evidence": [
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 128000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:30:49.786Z",
    "executedAt": "2026-08-25T06:31:09.882Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:30:54.813Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_196fb38a:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_196fb38a",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:31:09.882Z",
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 115200,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.81,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.36000000000000004,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.81,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 115200,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-25T06:31:30.004Z",
    "executedAt": "2026-08-25T06:31:50.092Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:31:35.024Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_98f93c84_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_98f93c84_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:31:50.092Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 103680,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.77,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.32400000000000007,
      "recommendedStrategy": "payment_link",
      "confidence": 0.77,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 103680,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-25T06:32:10.191Z",
    "executedAt": "2026-08-25T06:32:30.388Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:32:15.208Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_4fea466c_3:3",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_4fea466c_3",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:32:30.388Z",
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_03_risk_1787639572354",
    "transactionId": "txn_demo_scen_03_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Transaction flagged by HIGH_RISK_SUSPICIOUS_VELOCITY due to velocity rules (3 attempts in 60s from untrusted ASN)",
      "Customer has 0% historical retry success and only 1 prior transaction, indicating high risk of fraud"
    ],
    "reasoning": "The failure is classified as suspected_risk with no technical or payment method issue; retrying would likely be blocked and could increase fraud exposure, so no action is safest.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_03_risk",
      "failureType": "risk",
      "recoverability": 0.1,
      "recommendedStrategy": "no_action",
      "confidence": 0.9,
      "evidence": [
        "Transaction flagged by HIGH_RISK_SUSPICIOUS_VELOCITY due to velocity rules (3 attempts in 60s from untrusted ASN)",
        "Customer has 0% historical retry success and only 1 prior transaction, indicating high risk of fraud"
      ],
      "reasoning": "The failure is classified as suspected_risk with no technical or payment method issue; retrying would likely be blocked and could increase fraud exposure, so no action is safest.",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:32:52.354Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:33:02.395Z",
      "transactionId": "txn_demo_scen_03_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_1787639608135",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 0,
    "confidence": 0.96,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Gateway returned GATEWAY_TIMEOUT indicating transient network issue",
      "Customer has 92% historical retry success rate",
      "Only 0 retries attempted so far"
    ],
    "reasoning": "The failure is a temporary network timeout on the acquiring switch with no prior retries; given the high historical success rate on retries, a smart retry is likely to succeed.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.95,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.96,
      "evidence": [
        "Gateway returned GATEWAY_TIMEOUT indicating transient network issue",
        "Customer has 92% historical retry success rate",
        "Only 0 retries attempted so far"
      ],
      "reasoning": "The failure is a temporary network timeout on the acquiring switch with no prior retries; given the high historical success rate on retries, a smart retry is likely to succeed.",
      "predictedRecoveryPaise": 450000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:33:28.135Z",
    "executedAt": "2026-08-25T06:33:53.317Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:33:38.204Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_1787639608135:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_1787639608135",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:33:53.317Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_1787639666201",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 320000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.7,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Persistent issuer decline across card and alternative switch attempts",
      "Customer has 2 failed payments out of 3 previous transactions",
      "Historical retry success rate only 33%"
    ],
    "reasoning": "Issuer consistently declines the transaction across multiple routing attempts, indicating a card-level issue such as expiration, block, or limit exceeded. Switching to an alternative payment method (e.g., UPI, net banking, or different card) is the safest recovery path.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "payment_method",
      "recoverability": 0.6,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.7,
      "evidence": [
        "Persistent issuer decline across card and alternative switch attempts",
        "Customer has 2 failed payments out of 3 previous transactions",
        "Historical retry success rate only 33%"
      ],
      "reasoning": "Issuer consistently declines the transaction across multiple routing attempts, indicating a card-level issue such as expiration, block, or limit exceeded. Switching to an alternative payment method (e.g., UPI, net banking, or different card) is the safest recovery path.",
      "predictedRecoveryPaise": 320000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:34:26.201Z",
    "executedAt": "2026-08-25T06:34:51.304Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:34:36.240Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_1787639666201:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_1787639666201",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:34:51.304Z",
      "providerReference": "rzp_test_sim__3fail_paym_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_30af252d_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 172800,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.66,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "payment_method",
      "recoverability": 0.54,
      "recommendedStrategy": "payment_link",
      "confidence": 0.66,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 172800,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-25T06:35:11.406Z",
    "executedAt": "2026-08-25T06:35:31.504Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:35:16.421Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_30af252d_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_30af252d_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:35:31.504Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_1787639752383",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 405000,
    "actualRecoveryPaise": 405000,
    "interventionCostPaise": 0,
    "confidence": 0.95,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Gateway failure code GATEWAY_TIMEOUT indicates temporary network issue",
      "Failure category temporary_network_failure",
      "Customer historical retry success rate is 92%",
      "No prior retries attempted (retry count = 0)"
    ],
    "reasoning": "The timeout is a transient network issue; smart retry has high likelihood of success given customer's strong history.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.9,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.95,
      "evidence": [
        "Gateway failure code GATEWAY_TIMEOUT indicates temporary network issue",
        "Failure category temporary_network_failure",
        "Customer historical retry success rate is 92%",
        "No prior retries attempted (retry count = 0)"
      ],
      "reasoning": "The timeout is a transient network issue; smart retry has high likelihood of success given customer's strong history.",
      "predictedRecoveryPaise": 405000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:35:52.383Z",
    "executedAt": "2026-08-25T06:36:17.528Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:36:02.451Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_1787639752383:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_1787639752383",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 405000,
      "executedAt": "2026-08-25T06:36:17.528Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_1787639797921",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 450000,
    "actualRecoveryPaise": 450000,
    "interventionCostPaise": 0,
    "confidence": 0.95,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Gateway timeout on primary HDFC route (GATEWAY_TIMEOUT)",
      "Failure categorized as temporary_network_failure",
      "Customer has 92% historical retry success rate",
      "Zero retries attempted so far"
    ],
    "reasoning": "Transient acquiring switch timeout with strong customer retry history indicates high probability of success on immediate retry via alternate gateway route.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.95,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.95,
      "evidence": [
        "Gateway timeout on primary HDFC route (GATEWAY_TIMEOUT)",
        "Failure categorized as temporary_network_failure",
        "Customer has 92% historical retry success rate",
        "Zero retries attempted so far"
      ],
      "reasoning": "Transient acquiring switch timeout with strong customer retry history indicates high probability of success on immediate retry via alternate gateway route.",
      "predictedRecoveryPaise": 450000,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:36:37.921Z",
    "executedAt": "2026-08-25T06:37:03.042Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:36:47.959Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_1787639797921:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_1787639797921",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 450000,
      "executedAt": "2026-08-25T06:37:03.042Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_01_success_f69eb20c",
    "transactionId": "txn_demo_scen_01_success",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 382500,
    "actualRecoveryPaise": 382500,
    "interventionCostPaise": 150,
    "confidence": 0.94,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_01_success",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.94,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 382500,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:37:19.577Z",
    "executedAt": "2026-08-25T06:37:39.674Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:37:24.598Z",
      "transactionId": "txn_demo_scen_01_success",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_01_success_f69eb20c:1",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_01_success_f69eb20c",
      "transactionId": "txn_demo_scen_01_success",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 382500,
      "executedAt": "2026-08-25T06:37:39.674Z",
      "providerReference": "rzp_test_sim_uccess_smar_1"
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_1787639880071",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 323000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 50,
    "confidence": 0.9,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Gateway failure code ISSUER_SWITCH_UNAVAILABLE indicates a transient issuing bank switch outage, not a card or account issue.",
      "Customer has 7 successful payments out of 8 prior transactions (88% historical retry success rate), indicating a healthy, reliable customer profile.",
      "Average transaction volume (\u20b93,800) matches the failed amount, consistent with typical customer behavior \u2014 no anomaly suggesting fraud or account change.",
      "Retry count is 0, meaning a safe automated retry window is still available before customer friction increases."
    ],
    "reasoning": "The failure is rooted in a temporary infrastructure outage at the issuing bank switch, which is a classic transient condition ideal for smart retry with backoff. The customer's strong history (88% retry success) and no signs of risk confirm recovery is highly likely via a retried card attempt; however, since the customer's preferred method is UPI, a follow-up payment link with UPI as the default rail could further lift recovery odds. Initial intervention should be a low-cost smart retry.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.85,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Gateway failure code ISSUER_SWITCH_UNAVAILABLE indicates a transient issuing bank switch outage, not a card or account issue.",
        "Customer has 7 successful payments out of 8 prior transactions (88% historical retry success rate), indicating a healthy, reliable customer profile.",
        "Average transaction volume (\u20b93,800) matches the failed amount, consistent with typical customer behavior \u2014 no anomaly suggesting fraud or account change.",
        "Retry count is 0, meaning a safe automated retry window is still available before customer friction increases."
      ],
      "reasoning": "The failure is rooted in a temporary infrastructure outage at the issuing bank switch, which is a classic transient condition ideal for smart retry with backoff. The customer's strong history (88% retry success) and no signs of risk confirm recovery is highly likely via a retried card attempt; however, since the customer's preferred method is UPI, a follow-up payment link with UPI as the default rail could further lift recovery odds. Initial intervention should be a low-cost smart retry.",
      "predictedRecoveryPaise": 323000,
      "recommendedInterventionCostPaise": 50
    },
    "createdAt": "2026-08-25T06:38:00.071Z",
    "executedAt": "2026-08-25T06:38:25.185Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:38:10.116Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_1787639880071:1",
    "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
    "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_02_fallback_1787639880071",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:38:25.185Z",
      "providerReference": "rzp_test_sim_llback_smar_1",
      "errorCode": "SUBOPTIMAL_STRATEGY_DECLINE",
      "errorMessage": "Execution with \"smart_retry\" was rejected by payment switch. Alternative method required."
    }
  },
  {
    "actionId": "act_txn_demo_scen_02_fallback_fb_7a8384eb_2",
    "transactionId": "txn_demo_scen_02_fallback",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 290700,
    "actualRecoveryPaise": 290700,
    "interventionCostPaise": 450,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "succeeded",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_02_fallback",
      "failureType": "temporary",
      "recoverability": 0.765,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.85,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_SWITCH_UNAVAILABLE"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 290700,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-25T06:38:45.375Z",
    "executedAt": "2026-08-25T06:39:05.463Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:38:50.397Z",
      "transactionId": "txn_demo_scen_02_fallback",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_02_fallback_fb_7a8384eb_2:2",
    "executionResult": {
      "success": true,
      "actionId": "act_txn_demo_scen_02_fallback_fb_7a8384eb_2",
      "transactionId": "txn_demo_scen_02_fallback",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "succeeded",
      "recoveredAmountPaise": 290700,
      "executedAt": "2026-08-25T06:39:05.463Z",
      "providerReference": "rzp_test_sim_llback_paym_2"
    }
  },
  {
    "actionId": "act_txn_demo_scen_03_risk_aec9ebe9",
    "transactionId": "txn_demo_scen_03_risk",
    "strategy": "no_action",
    "predictedRecoveryPaise": 0,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 0,
    "confidence": 0.98,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_03_risk",
      "failureType": "risk",
      "recoverability": 0,
      "recommendedStrategy": "no_action",
      "confidence": 0.98,
      "evidence": [
        "Observable failure code: HIGH_RISK_SUSPICIOUS_VELOCITY"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 0,
      "recommendedInterventionCostPaise": 0
    },
    "createdAt": "2026-08-25T06:39:49.373Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RISK_BLOCK",
      "reason": "Anti-fraud policy gate blocked recovery on suspected risk transaction.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": false,
          "reason": "Suspected fraud or high-risk velocity anomaly detected. Automated recovery prohibited."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": false,
          "reason": "Terminal decline or unrecoverable instrument. No automated intervention permitted."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:39:54.391Z",
      "transactionId": "txn_demo_scen_03_risk",
      "verdict": "blocked",
      "triggeredRules": [
        "RISK_SAFETY_CHECK",
        "UNRECOVERABLE_SAFETY_CHECK"
      ],
      "explanation": "Anti-fraud policy gate blocked recovery on suspected risk transaction."
    }
  },
  {
    "actionId": "act_txn_demo_scen_04_lowconf_1787640020295",
    "transactionId": "txn_demo_scen_04_lowconf",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 445000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.5,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Gateway status shows 'failed' with 'TRANSACTION_REJECTED_UNKNOWN' code",
      "Failure category explicitly labeled as 'temporary_network_failure'",
      "Customer has 50% historical retry success rate with card payments",
      "No prior risk indicators or payment method issues detected"
    ],
    "reasoning": "Ambiguous decline with temporary_network_failure classification suggests transient gateway issue. Low confidence due to insufficient telemetry, but retry is appropriate given customer's 50% historical success rate with retries.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_04_lowconf",
      "failureType": "temporary",
      "recoverability": 0.5,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.5,
      "evidence": [
        "Gateway status shows 'failed' with 'TRANSACTION_REJECTED_UNKNOWN' code",
        "Failure category explicitly labeled as 'temporary_network_failure'",
        "Customer has 50% historical retry success rate with card payments",
        "No prior risk indicators or payment method issues detected"
      ],
      "reasoning": "Ambiguous decline with temporary_network_failure classification suggests transient gateway issue. Low confidence due to insufficient telemetry, but retry is appropriate given customer's 50% historical success rate with retries.",
      "predictedRecoveryPaise": 445000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:40:20.295Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "CONFIDENCE_TOO_LOW",
      "reason": "Diagnosis confidence is below deterministic minimum threshold.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": false,
          "reason": "Diagnosis confidence (50.0%) is below required minimum threshold (60%)."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:40:30.375Z",
      "transactionId": "txn_demo_scen_04_lowconf",
      "verdict": "blocked",
      "triggeredRules": [
        "CONFIDENCE_THRESHOLD_CHECK"
      ],
      "explanation": "Diagnosis confidence is below deterministic minimum threshold."
    }
  },
  {
    "actionId": "act_txn_demo_scen_05_limit_7b81e41c",
    "transactionId": "txn_demo_scen_05_limit",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 208000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.9,
    "policyStatus": "blocked",
    "executionStatus": "not_executed",
    "evidence": [
      "Observable failure code: GATEWAY_TIMEOUT"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_05_limit",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.9,
      "evidence": [
        "Observable failure code: GATEWAY_TIMEOUT"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 208000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:41:29.091Z",
    "executedAt": null,
    "policyResult": {
      "allowed": false,
      "reasonCode": "RETRY_LIMIT_EXCEEDED",
      "reason": "Automated retry limit reached for this payment attempt.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": false,
          "reason": "Maximum automated retry attempts (2) reached for this transaction."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:41:34.141Z",
      "transactionId": "txn_demo_scen_05_limit",
      "verdict": "blocked",
      "triggeredRules": [
        "RETRY_LIMIT_CHECK"
      ],
      "explanation": "Automated retry limit reached for this payment attempt."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_ca6a2dfd",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "smart_retry",
    "predictedRecoveryPaise": 128000,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 150,
    "confidence": 0.85,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Autonomous recovery offline diagnostic initialization",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.4,
      "recommendedStrategy": "smart_retry",
      "confidence": 0.85,
      "evidence": [
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Autonomous recovery offline diagnostic initialization",
      "predictedRecoveryPaise": 128000,
      "recommendedInterventionCostPaise": 150
    },
    "createdAt": "2026-08-25T06:41:51.358Z",
    "executedAt": "2026-08-25T06:42:11.458Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:41:56.402Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_ca6a2dfd:1",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_ca6a2dfd",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "smart_retry",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:42:11.458Z",
      "providerReference": "rzp_test_sim__3fail_smar_1",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_1a5eec94_2",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_method_switch",
    "predictedRecoveryPaise": 115200,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 450,
    "confidence": 0.81,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"smart_retry\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.36000000000000004,
      "recommendedStrategy": "payment_method_switch",
      "confidence": 0.81,
      "evidence": [
        "Automated fallback selected after initial strategy \"smart_retry\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_method_switch\" to maximize recovery probability.",
      "predictedRecoveryPaise": 115200,
      "recommendedInterventionCostPaise": 450
    },
    "createdAt": "2026-08-25T06:42:31.559Z",
    "executedAt": "2026-08-25T06:42:51.692Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:42:36.586Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_1a5eec94_2:2",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_1a5eec94_2",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_method_switch",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:42:51.692Z",
      "providerReference": "rzp_test_sim__3fail_paym_2",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  },
  {
    "actionId": "act_txn_demo_scen_06_3fail_fb_a1883b4a_3",
    "transactionId": "txn_demo_scen_06_3fail",
    "strategy": "payment_link",
    "predictedRecoveryPaise": 103680,
    "actualRecoveryPaise": 0,
    "interventionCostPaise": 250,
    "confidence": 0.77,
    "policyStatus": "approved",
    "executionStatus": "failed",
    "evidence": [
      "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
      "Observable failure code: ISSUER_DECLINED"
    ],
    "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
    "diagnosis": {
      "transactionId": "txn_demo_scen_06_3fail",
      "failureType": "temporary",
      "recoverability": 0.32400000000000007,
      "recommendedStrategy": "payment_link",
      "confidence": 0.77,
      "evidence": [
        "Automated fallback selected after initial strategy \"payment_method_switch\" failed",
        "Observable failure code: ISSUER_DECLINED"
      ],
      "reasoning": "Deterministic fallback execution: transitioning to \"payment_link\" to maximize recovery probability.",
      "predictedRecoveryPaise": 103680,
      "recommendedInterventionCostPaise": 250
    },
    "createdAt": "2026-08-25T06:43:11.782Z",
    "executedAt": "2026-08-25T06:43:31.929Z",
    "policyResult": {
      "allowed": true,
      "reasonCode": "ALLOWED",
      "reason": "All deterministic policy gate safety checks passed successfully.",
      "checks": [
        {
          "name": "RISK_SAFETY_CHECK",
          "passed": true,
          "reason": "No fraud or risk anomalies detected."
        },
        {
          "name": "UNRECOVERABLE_SAFETY_CHECK",
          "passed": true,
          "reason": "Failure is classified as potentially recoverable."
        },
        {
          "name": "RETRY_LIMIT_CHECK",
          "passed": true,
          "reason": "Retry count is within permissible limits."
        },
        {
          "name": "CONFIDENCE_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Diagnosis confidence meets or exceeds safety threshold."
        },
        {
          "name": "POSITIVE_EXPECTED_VALUE_CHECK",
          "passed": true,
          "reason": "Intervention maintains positive net expected financial value."
        },
        {
          "name": "AMOUNT_VALIDITY_CHECK",
          "passed": true,
          "reason": "Predicted recovery amount is structurally valid."
        },
        {
          "name": "AMOUNT_THRESHOLD_CHECK",
          "passed": true,
          "reason": "Transaction amount is within automated execution limits."
        },
        {
          "name": "STRATEGY_PERMISSIBILITY_CHECK",
          "passed": true,
          "reason": "Strategy is compatible with failure mode."
        },
        {
          "name": "CONTACT_LIMIT_CHECK",
          "passed": true,
          "reason": "Customer contact attempt limit respected."
        }
      ],
      "evaluatedAt": "2026-08-25T06:43:16.827Z",
      "transactionId": "txn_demo_scen_06_3fail",
      "verdict": "approved",
      "triggeredRules": [],
      "explanation": "All deterministic policy gate safety checks passed successfully."
    },
    "idempotencyKey": "salvo:act_txn_demo_scen_06_3fail_fb_a1883b4a_3:3",
    "errorCode": "UNRECOVERABLE_DECLINE",
    "errorMessage": "Instrument declined permanently by issuer.",
    "executionResult": {
      "success": false,
      "actionId": "act_txn_demo_scen_06_3fail_fb_a1883b4a_3",
      "transactionId": "txn_demo_scen_06_3fail",
      "strategy": "payment_link",
      "provider": "razorpay_test",
      "status": "failed",
      "recoveredAmountPaise": 0,
      "executedAt": "2026-08-25T06:43:31.929Z",
      "providerReference": "rzp_test_sim__3fail_paym_3",
      "errorCode": "UNRECOVERABLE_DECLINE",
      "errorMessage": "Instrument declined permanently by issuer."
    }
  }
];
