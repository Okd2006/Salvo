# Salvo — Autonomous AI Revenue Recovery Platform

> **"Gemini recommends. Deterministic policy code decides. Execution code acts."**

Built for the **Razorpay AI Buildathon**.

---

## 1. Architecture Overview

Salvo finds revenue lost through failed and abandoned payments, diagnoses why the revenue was lost using Gemini agent reasoning, plans recovery actions, gates every action through deterministic safety policies, executes approved recovery actions through Razorpay APIs, and records an immutable, auditable compliance trail.

```text
React Frontend (Stitch-Generated UI)
          ↓
  Node.js API Shell
          ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Gemini API    │  MongoDB Atlas  │  Razorpay Test  │
│ (Diagnose/Plan) │ (State/Ledger)  │  (Executions)   │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 2. Environment Configuration

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `GEMINI_MODEL` | Gemini model for diagnosis & structured reasoning | `gemini-2.5-flash` |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | Database name | `salvo` |
| `RAZORPAY_KEY_ID` | Razorpay Test Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Key Secret | `...` |
| `DATASET_SEED` | Seed key for reproducible synthetic dataset | `salvo-buildathon-v1` |
| `DATASET_SIZE` | Total number of transactions generated | `1350` |
| `DIAGNOSIS_LIMIT` | Optional limit for batch diagnosis during development | `10` |

---

## 3. Gemini AI Intelligence Layer (Phase 2)

Salvo uses Google Gemini (`@google/genai` SDK) to perform structured root-cause diagnosis and recommend safe recovery vectors.

### 3.1 Model Selection (`AI_CONFIG`)
* **Diagnosis & Classification Model:** `gemini-2.5-flash` (low latency, high-accuracy structured reasoning, native JSON schema support).
* **Narrative Explanation Model:** `gemini-2.5-flash` (merchant-facing contextual notes).

### 3.2 Native Structured Output Architecture
Salvo uses Gemini's native `responseSchema` to guarantee strict JSON output without parsing markdown fences or free-form prose.

```ts
export interface RecoveryRecommendation {
  transactionId: string;
  failureType: 'temporary' | 'customer' | 'payment_method' | 'risk' | 'unrecoverable';
  recoverability: number; // 0.0 to 1.0
  recommendedStrategy: 'smart_retry' | 'payment_method_switch' | 'payment_link' | 'reminder' | 'no_action';
  confidence: number; // 0.0 to 1.0
  evidence: string[]; // Minimum 1 item
  reasoning: string;
  predictedRecoveryPaise: number; // Integer paise, 0 <= predicted <= amountPaise
  recommendedInterventionCostPaise: number; // Integer paise >= 0
}
```

### 3.3 Observation Boundary & Ground Truth Protection
To ensure evaluation integrity, Gemini receives **only** observable transaction metadata:
* **Allowed:** `transactionId`, `amountPaise`, `paymentMethod`, `status`, `failureCode`, `failureCategory`, `failureDescription`, `customerHistory` (past success/failure counts, retry success rate, preferred method), `retryCount`, `merchantName`.
* **FORBIDDEN (Never Sent):** `groundTruth.recoverable`, `groundTruth.optimalStrategy`, `groundTruth.expectedRecoveryPaise`, `groundTruth.shouldIntervene`, `groundTruth.riskScore`.
* Ground truth is stripped via `toObservableTransaction()` and verified by `assertNoGroundTruthLeakage()`.

### 3.4 Financial Arithmetic Invariant
* Gemini is **never** trusted for raw financial calculations.
* Predicted recovery amounts are deterministically derived and clamped:
  $$0 \le \text{predictedRecoveryPaise} \le \text{transaction.amountPaise}$$
* All monetary values are strictly maintained as **integer paise** (`1 INR = 100 paise`).

### 3.5 Bounded Retries & Error Handling
* Transient Gemini API errors (rate limits, network timeouts) are retried with exponential backoff up to a **maximum of 2 attempts**.
* Config errors and schema validation errors fail immediately without retries.
* If Gemini fails, Salvo returns a typed `GeminiError` and **never** fabricates fake AI results or falls back to ground truth.

---

## 4. Database Collections & Persistence

1. **`transactions`**: Complete ledger of payments, customer history, failure taxonomy, hidden ground truth, and simulation traces.
2. **`recovery_actions`**: Generated after AI diagnosis with initial state:
   * `policyStatus: "pending"` (Policy Gate has not run yet)
   * `executionStatus: "not_executed"` (Razorpay has not run yet)
3. **`audit_logs`**: Event trail logging `diagnosis_created` with model name, recommendation telemetry, and timestamp.

---

## 5. API Endpoints

### Diagnose Transaction
```http
POST /api/diagnose
Content-Type: application/json

{
  "transactionId": "txn_salv_0001"
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "transactionId": "txn_salv_0001",
    "failureType": "temporary",
    "recoverability": 0.85,
    "recommendedStrategy": "smart_retry",
    "confidence": 0.92,
    "evidence": [
      "Acquiring switch timeout GATEWAY_TIMEOUT",
      "Customer history shows 94% success rate over 16 payments"
    ],
    "reasoning": "Transient gateway latency observed during peak authorization window.",
    "predictedRecoveryPaise": 482350,
    "recommendedInterventionCostPaise": 150
  },
  "actionId": "act_txn_salv_0001_1724391200000",
  "diagnosedAt": "2026-08-23T11:08:00.000Z"
}
```

---

## 6. Execution Commands

```bash
# 1. Run Automated Unit Test Suite (28 unit tests)
npm run test

# 2. Seed 1,350 Synthetic Transactions
npm run seed

# 3. Run Gemini AI Batch Diagnosis (e.g. 10 development transactions)
DIAGNOSIS_LIMIT=10 npm run diagnose

# 4. Run Full Batch Revenue Evaluation
npm run evaluate

# 5. TypeScript Typecheck
npm run typecheck

# 6. ESLint Code Quality Verification
npm run lint

# 7. Production Bundle Build
npm run build
```

---

## 7. Synthetic Dataset & Ground Truth

> **"The dataset is synthetic and deterministic."**

Generated using a seeded Mulberry32 PRNG across 9 failure categories:
* `temporary_network_failure` (`smart_retry`, 85% base yield)
* `bank_decline` (`smart_retry`, 52% base yield)
* `insufficient_funds` (`payment_link`, 58% base yield)
* `authentication_failure` (`reminder`, 72% base yield)
* `payment_method_issue` (`payment_method_switch`, 66% base yield)
* `customer_abandonment` (`payment_link`, 42% base yield)
* `expired_payment` (`payment_link`, 46% base yield)
* `suspected_risk` (`no_action`, **0% yield — Policy Gate blocked**)
* `unrecoverable` (`no_action`, **0% yield — Policy Gate blocked**)
