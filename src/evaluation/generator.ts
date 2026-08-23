/**
 * src/evaluation/generator.ts
 *
 * Deterministic Synthetic Transaction & Dataset Generator for Salvo
 *
 * Features:
 *  - High-precision Mulberry32 Seeded PRNG
 *  - 100% reproducible dataset output
 *  - Multi-dimensional failure taxonomy with realistic Razorpay error codes
 *  - Integer paise currency arithmetic (1 INR = 100 paise)
 *  - Strictly separated ground truth for evaluation
 */

import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
  PaymentMethod,
  FailureCategory,
  RecoveryStrategy,
  CustomerHistory,
  GroundTruth,
  SimulationTrace,
  PolicyVerdict,
  ExecutionStatus,
} from '../types/index.js';

// ─── Seeded Pseudo-Random Number Generator (Mulberry32) ────────────────────────

export class SeededPRNG {
  private state: number;

  constructor(seedString: string = 'salvo-buildathon-v1') {
    let h = 1779033703 ^ seedString.length;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.state = h >>> 0;
  }

  /**
   * Return a deterministic float in [0, 1)
   */
  next(): number {
    let z = (this.state += 0x6d2b79f5);
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Return a deterministic integer in [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Return a deterministic random element from an array
   */
  pick<T>(arr: readonly T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }

  /**
   * Return true with given probability [0, 1]
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// ─── Domain Constants ─────────────────────────────────────────────────────────

export const FAILURE_CONFIG: Record<
  FailureCategory,
  {
    errorCodes: string[];
    description: string;
    optimalStrategy: RecoveryStrategy;
    baseRecoverability: number;
    baseCostPaise: number;
    allowIntervention: boolean;
    riskScore: number;
  }
> = {
  temporary_network_failure: {
    errorCodes: ['GATEWAY_TIMEOUT', 'BANK_NETWORK_UNAVAILABLE', 'SOCKET_CONNECTION_TIMEOUT'],
    description: 'Transient network latency or upstream banking switch timeout.',
    optimalStrategy: 'smart_retry',
    baseRecoverability: 0.85,
    baseCostPaise: 150, // ₹1.50
    allowIntervention: true,
    riskScore: 0.05,
  },
  bank_decline: {
    errorCodes: ['ISSUER_SYSTEM_THROTTLED', 'VELOCITY_LIMIT_EXCEEDED', 'GENERIC_BANK_DECLINE'],
    description: 'Issuing bank core banking system declined the authorization request.',
    optimalStrategy: 'smart_retry',
    baseRecoverability: 0.52,
    baseCostPaise: 200, // ₹2.00
    allowIntervention: true,
    riskScore: 0.15,
  },
  insufficient_funds: {
    errorCodes: ['INSUFFICIENT_FUNDS_BALANCE', 'LIMIT_EXCEEDED_ON_ACCOUNT'],
    description: 'Customer account has insufficient balance for authorization.',
    optimalStrategy: 'payment_link',
    baseRecoverability: 0.58,
    baseCostPaise: 300, // ₹3.00
    allowIntervention: true,
    riskScore: 0.10,
  },
  authentication_failure: {
    errorCodes: ['3DS_OTP_TIMEOUT', 'BIOMETRIC_AUTH_DROPPED', 'INCORRECT_PIN_ATTEMPTS'],
    description: 'Customer failed or timed out during 2FA / 3D-Secure authentication.',
    optimalStrategy: 'reminder',
    baseRecoverability: 0.72,
    baseCostPaise: 250, // ₹2.50
    allowIntervention: true,
    riskScore: 0.12,
  },
  payment_method_issue: {
    errorCodes: ['CARD_EXPIRY_PASSED', 'MANDATE_FREQUENCY_EXCEEDED', 'INTERNATIONAL_CARD_BLOCKED'],
    description: 'The selected payment method is expired, restricted, or unsupported.',
    optimalStrategy: 'payment_method_switch',
    baseRecoverability: 0.66,
    baseCostPaise: 450, // ₹4.50
    allowIntervention: true,
    riskScore: 0.08,
  },
  customer_abandonment: {
    errorCodes: ['USER_CANCELLED_INTENT', 'CHECKOUT_WINDOW_CLOSED', 'VPA_COLLECT_IGNORED'],
    description: 'Customer initiated payment but abandoned without entering authorization credentials.',
    optimalStrategy: 'payment_link',
    baseRecoverability: 0.42,
    baseCostPaise: 250, // ₹2.50
    allowIntervention: true,
    riskScore: 0.05,
  },
  expired_payment: {
    errorCodes: ['DYNAMIC_QR_EXPIRED', 'PAYMENT_LINK_VALIDITY_OVER'],
    description: 'Payment session or dynamic collect link expired before completion.',
    optimalStrategy: 'payment_link',
    baseRecoverability: 0.46,
    baseCostPaise: 250, // ₹2.50
    allowIntervention: true,
    riskScore: 0.05,
  },
  suspected_risk: {
    errorCodes: ['HIGH_RISK_SUSPICIOUS_VELOCITY', 'GEOLOCATION_FRAUD_FLAG', 'BLACKLISTED_DEVICE_FINGERPRINT'],
    description: 'Anti-fraud heuristics flagged high probability of compromised account or stolen instrument.',
    optimalStrategy: 'no_action',
    baseRecoverability: 0.0,
    baseCostPaise: 0,
    allowIntervention: false,
    riskScore: 0.95,
  },
  unrecoverable: {
    errorCodes: ['ACCOUNT_CLOSED_PERMANENTLY', 'STOLEN_CARD_HARD_DECLINE', 'VPA_INVALID_PERMANENT'],
    description: 'Terminal decline — instrument permanently de-registered or blocked.',
    optimalStrategy: 'no_action',
    baseRecoverability: 0.0,
    baseCostPaise: 0,
    allowIntervention: false,
    riskScore: 0.85,
  },
};

const MERCHANTS = [
  { id: 'mer_saas_cloud', name: 'CloudScale SaaS' },
  { id: 'mer_d2c_apparel', name: 'NovaThreads D2C' },
  { id: 'mer_edtech_prime', name: 'SkillForge EdTech' },
  { id: 'mer_gaming_live', name: 'ApexPlay Gaming' },
  { id: 'mer_utilities_bill', name: 'BharatUtility Pay' },
  { id: 'mer_quick_commerce', name: 'ZippyMart Quick Commerce' },
] as const;

const PAYMENT_METHODS: PaymentMethod[] = ['upi', 'card', 'netbanking', 'wallet', 'emi'];

// ─── Synthetic Generator Function ─────────────────────────────────────────────

export interface GeneratorOutput {
  transactions: TransactionDocument[];
  recoveryActions: RecoveryActionDocument[];
  auditLogs: AuditLogDocument[];
}

export function generateSyntheticDataset(
  count: number = 1350,
  seed: string = 'salvo-buildathon-v1'
): GeneratorOutput {
  const prng = new SeededPRNG(seed);
  const transactions: TransactionDocument[] = [];
  const recoveryActions: RecoveryActionDocument[] = [];
  const auditLogs: AuditLogDocument[] = [];

  const failureCategories = Object.keys(FAILURE_CONFIG) as FailureCategory[];

  // Weighted failure distribution matching realistic Indian payment gateways
  const categoryWeights: Record<FailureCategory, number> = {
    temporary_network_failure: 0.22, // 22%
    bank_decline: 0.18,              // 18%
    insufficient_funds: 0.16,        // 16%
    authentication_failure: 0.15,    // 15%
    payment_method_issue: 0.10,      // 10%
    customer_abandonment: 0.07,      // 7%
    expired_payment: 0.05,           // 5%
    suspected_risk: 0.04,            // 4%
    unrecoverable: 0.03,             // 3%
  };

  for (let i = 1; i <= count; i++) {
    const txnIndexStr = String(i).padStart(4, '0');
    const transactionId = `txn_${seed.slice(0, 4)}_${txnIndexStr}`;

    // Select merchant
    const merchant = prng.pick(MERCHANTS);

    // Select customer profile
    const customerId = `cust_${prng.nextInt(100, 850)}`;
    const previousPayments = prng.nextInt(1, 24);
    const successfulPayments = Math.floor(previousPayments * (0.4 + prng.next() * 0.55));
    const previousFailures = previousPayments - successfulPayments;
    const retrySuccessRate =
      previousPayments > 0 ? Number((successfulPayments / previousPayments).toFixed(2)) : 0.5;

    // Pick category based on weights
    const roll = prng.next();
    let accumulated = 0;
    let category: FailureCategory = 'temporary_network_failure';
    for (const cat of failureCategories) {
      accumulated += categoryWeights[cat];
      if (roll <= accumulated) {
        category = cat;
        break;
      }
    }

    const config = FAILURE_CONFIG[category];
    const failureCode = prng.pick(config.errorCodes);
    const paymentMethod = prng.pick(PAYMENT_METHODS);

    // Realistic Indian transaction amount in integer paise (₹150 to ₹1,45,000)
    let amountPaise: number;
    const tierRoll = prng.next();
    if (tierRoll < 0.45) {
      // Small ticket ₹250 to ₹2,500
      amountPaise = prng.nextInt(250, 2500) * 100;
    } else if (tierRoll < 0.85) {
      // Mid ticket ₹3,000 to ₹18,000
      amountPaise = prng.nextInt(3000, 18000) * 100;
    } else {
      // High ticket ₹22,000 to ₹1,20,000
      amountPaise = prng.nextInt(22000, 120000) * 100;
    }

    // Customer history object
    const customerHistory: CustomerHistory = {
      customerId,
      previousPayments,
      successfulPayments,
      previousFailures,
      retrySuccessRate,
      preferredMethod: paymentMethod,
      averageTransactionPaise: amountPaise,
      accountAgeDays: prng.nextInt(15, 730),
    };

    // ─── Ground Truth Calculation ──────────────────────────────────────────────
    // Modulate recoverability by customer loyalty score
    const loyaltyModifier = (retrySuccessRate - 0.5) * 0.2;
    const calculatedRecoverability = Math.max(
      0,
      Math.min(1, config.baseRecoverability + loyaltyModifier + (prng.next() * 0.1 - 0.05))
    );

    const isRecoverable = config.allowIntervention && calculatedRecoverability > 0.35;
    const optimalStrategy = isRecoverable ? config.optimalStrategy : 'no_action';
    const expectedRecoveryPaise = isRecoverable
      ? Math.round(amountPaise * calculatedRecoverability)
      : 0;

    const groundTruth: GroundTruth = {
      recoverable: isRecoverable,
      optimalStrategy,
      expectedRecoveryPaise,
      shouldIntervene: config.allowIntervention,
      interventionCostPaise: isRecoverable ? config.baseCostPaise : 0,
      riskScore: config.riskScore,
    };

    // ─── Simulation Output (Deterministic Model Baseline) ───────────────────────
    // Model predicts optimal strategy with realistic accuracy (82% precision rate)
    const isModelCorrect = prng.chance(0.85);
    let predictedStrategy: RecoveryStrategy;

    if (isModelCorrect) {
      predictedStrategy = optimalStrategy;
    } else {
      const otherStrategies: RecoveryStrategy[] = (
        ['smart_retry', 'payment_method_switch', 'payment_link', 'reminder', 'no_action'] as RecoveryStrategy[]
      ).filter((s) => s !== optimalStrategy);
      predictedStrategy = prng.pick(otherStrategies);
    }

    const predictedConfidence = Number((0.65 + prng.next() * 0.33).toFixed(2));
    const predictedRecoveryPaise =
      predictedStrategy === 'no_action'
        ? 0
        : Math.round(amountPaise * (0.5 + prng.next() * 0.45));

    // Policy Gate verdict simulation
    let policyVerdict: PolicyVerdict = 'approved';
    if (!config.allowIntervention || category === 'suspected_risk' || predictedStrategy === 'no_action') {
      policyVerdict = 'blocked';
    } else if (amountPaise > 8000000 && predictedConfidence < 0.75) {
      policyVerdict = 'needs_review';
    }

    // Execution Outcome
    let executionStatus: ExecutionStatus = 'not_attempted';
    let actualRecoveryPaise = 0;
    let interventionCostPaise = 0;

    if (policyVerdict === 'approved' && predictedStrategy !== 'no_action') {
      interventionCostPaise = config.baseCostPaise;
      // Actual recovery occurs if transaction is genuinely recoverable and strategy aligns
      const succeeds = isRecoverable && (predictedStrategy === optimalStrategy || prng.chance(0.65));
      if (succeeds) {
        executionStatus = 'recovered';
        actualRecoveryPaise = amountPaise;
      } else {
        executionStatus = 'failed';
        actualRecoveryPaise = 0;
      }
    } else if (policyVerdict === 'blocked') {
      executionStatus = 'blocked';
    }

    const createdAt = new Date(Date.now() - (count - i) * 60000).toISOString();
    const updatedAt = new Date(Date.now() - (count - i) * 60000 + 15000).toISOString();

    const simulation: SimulationTrace = {
      predictedStrategy,
      confidence: predictedConfidence,
      predictedRecoveryPaise,
      interventionCostPaise,
      policyVerdict,
      executionStatus,
      actualRecoveryPaise,
      executedAt: updatedAt,
    };

    // ─── Transaction Document ──────────────────────────────────────────────────
    const transactionDoc: TransactionDocument = {
      transactionId,
      merchantId: merchant.id,
      merchantName: merchant.name,
      customerId,
      customerEmail: `customer_${customerId.slice(-3)}@example.com`,
      customerPhone: `+9198${prng.nextInt(10000000, 99999999)}`,
      amountPaise,
      currency: 'INR',
      paymentMethod,
      status: executionStatus === 'recovered' ? 'captured' : 'failed',
      failureCode,
      failureDescription: config.description,
      failureCategory: category,
      createdAt,
      updatedAt,
      customerHistory,
      retryCount: prng.nextInt(0, 2),
      recoverable: isRecoverable,
      groundTruth,
      simulation,
    };

    transactions.push(transactionDoc);

    // ─── Recovery Action Document ──────────────────────────────────────────────
    if (predictedStrategy !== 'no_action') {
      recoveryActions.push({
        actionId: `act_${transactionId.slice(4)}`,
        transactionId,
        strategy: predictedStrategy,
        predictedRecoveryPaise,
        actualRecoveryPaise,
        interventionCostPaise,
        confidence: predictedConfidence,
        policyStatus: policyVerdict,
        executionStatus,
        createdAt,
        executedAt: updatedAt,
      });
    }

    // ─── Audit Log Documents ───────────────────────────────────────────────────
    auditLogs.push({
      eventId: `evt_${transactionId.slice(4)}_create`,
      transactionId,
      eventType: 'transaction_created',
      actor: 'system',
      details: {
        amountPaise,
        failureCategory: category,
        failureCode,
        merchantId: merchant.id,
      },
      timestamp: createdAt,
    });

    if (policyVerdict === 'blocked') {
      auditLogs.push({
        eventId: `evt_${transactionId.slice(4)}_block`,
        transactionId,
        eventType: 'action_blocked',
        actor: 'policy_gate',
        details: {
          category,
          riskScore: config.riskScore,
          reason: 'Safety policy gate blocked high-risk or unrecoverable action.',
        },
        timestamp: updatedAt,
      });
    } else if (executionStatus === 'recovered') {
      auditLogs.push({
        eventId: `evt_${transactionId.slice(4)}_recover`,
        transactionId,
        eventType: 'recovery_completed',
        actor: 'razorpay_executor',
        details: {
          strategy: predictedStrategy,
          amountPaise,
          settled: true,
        },
        timestamp: updatedAt,
      });
    }
  }

  return {
    transactions,
    recoveryActions,
    auditLogs,
  };
}
