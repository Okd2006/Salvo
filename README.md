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

---

## 4. Deterministic Policy Gate (Phase 3)

The Policy Gate is the **mandatory safety boundary** between AI recommendations and any real execution.

### 4.1 Policy Invariants
* **Zero LLM Calls:** Evaluated entirely in deterministic TypeScript.
* **Independent Authority:** Gemini proposes; the Policy Gate enforces rules and decides `ALLOW` or `BLOCK`.
* **Zero Payment Mutations:** The Policy Gate evaluates permissions and produces an auditable `PolicyResult`.

### 4.2 `PolicyResult` & `PolicyCheck` Schemas
```ts
export interface PolicyCheck {
  name: string;
  passed: boolean;
  reason: string;
}

export interface PolicyResult {
  allowed: boolean;
  reasonCode: PolicyReasonCode;
  reason: string;
  checks: PolicyCheck[];
  evaluatedAt: string;
}
```

### 4.3 Deterministic Reason Codes & Rules

| Reason Code | Trigger Condition | Safety Rule |
| :--- | :--- | :--- |
| **`ALLOWED`** | All checks pass | Recovery intervention is safe and authorized for execution |
| **`RISK_BLOCK`** | `failureCategory === 'suspected_risk'` or fraud error code | Prohibits automated recovery on suspected compromised accounts |
| **`UNRECOVERABLE_BLOCK`** | `failureType === 'unrecoverable'` or `no_action` | Blocks execution on terminal instrument declines |
| **`RETRY_LIMIT_EXCEEDED`** | `retryCount >= 2` on `smart_retry` | Prevents retry storms and card brand throttling |
| **`CONFIDENCE_TOO_LOW`** | `confidence < 0.60` | Requires high model certainty before automated action |
| **`NEGATIVE_EXPECTED_VALUE`** | $\text{Predicted Yield} \le \text{Intervention Cost}$ | Prevents loss-making recovery interventions |
| **`INVALID_RECOVERY_AMOUNT`** | $\text{Yield} \le 0 \lor \text{Yield} > \text{Amount}$ | Enforces financial boundary invariants |
| **`AMOUNT_THRESHOLD_EXCEEDED`** | High-ticket volume ($> \text{₹50k}$ retry or $> \text{₹80k}$ with low confidence) | Caps automated risk exposure on high-ticket payments |
| **`STRATEGY_NOT_PERMITTED`** | Incompatible strategy/failure mode (e.g. retry on expired card) | Enforces logical consistency |
| **`CONTACT_LIMIT_EXCEEDED`** | `retryCount >= 3` on reminder/payment link | Prevents customer harassment and compliance violations |

---

## 5. Database Collections & Persistence

1. **`transactions`**: Complete ledger of payments, customer history, failure taxonomy, hidden ground truth, and simulation traces.
2. **`recovery_actions`**: Generated after AI diagnosis with:
   * `policyStatus`: `'pending'` (initial) $\rightarrow$ `'approved'` or `'blocked'` (after Policy Gate)
   * `executionStatus`: `'not_executed'` (Razorpay has not run yet)
3. **`audit_logs`**: Chronological event trail tracking `diagnosis_created`, `action_approved`, and `action_blocked`.

---

## 6. API Endpoints

### 6.1 Diagnose Transaction
`POST /api/diagnose`
```json
{
  "transactionId": "txn_salv_0001"
}
```

### 6.2 Evaluate Policy Gate
`POST /api/policy-gate`
```json
{
  "transactionId": "txn_salv_0001"
}
```

**Response:**
```json
{
  "success": true,
  "policyResult": {
    "allowed": true,
    "reasonCode": "ALLOWED",
    "reason": "All deterministic policy gate safety checks passed successfully.",
    "checks": [
      { "name": "RISK_SAFETY_CHECK", "passed": true, "reason": "No fraud or risk anomalies detected." },
      { "name": "UNRECOVERABLE_SAFETY_CHECK", "passed": true, "reason": "Failure is classified as potentially recoverable." },
      { "name": "RETRY_LIMIT_CHECK", "passed": true, "reason": "Retry count is within permissible limits." },
      { "name": "CONFIDENCE_THRESHOLD_CHECK", "passed": true, "reason": "Diagnosis confidence meets or exceeds safety threshold." },
      { "name": "POSITIVE_EXPECTED_VALUE_CHECK", "passed": true, "reason": "Intervention maintains positive net expected financial value." },
      { "name": "AMOUNT_VALIDITY_CHECK", "passed": true, "reason": "Predicted recovery amount is structurally valid." },
      { "name": "AMOUNT_THRESHOLD_CHECK", "passed": true, "reason": "Transaction amount is within automated execution limits." },
      { "name": "STRATEGY_PERMISSIBILITY_CHECK", "passed": true, "reason": "Strategy is compatible with failure mode." },
      { "name": "CONTACT_LIMIT_CHECK", "passed": true, "reason": "Customer contact attempt limit respected." }
    ],
    "evaluatedAt": "2026-08-23T11:26:00.000Z"
  }
}
```

---

## 7. Execution Commands

```bash
# 1. Run Automated Unit Test Suite (39 unit tests)
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
