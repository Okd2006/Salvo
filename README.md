# Salvo — Autonomous AI Revenue Recovery Platform

> **Salvo doesn't tell merchants what went wrong. It takes responsibility for what happens next.**

Built for the **Razorpay AI Buildathon**.

---

## 1. Product Overview

Salvo is an autonomous revenue recovery agent that finds revenue lost through failed and abandoned payments, diagnoses why the revenue was lost using Gemini agent reasoning, plans recovery actions, gates every action through deterministic safety policies, executes approved recovery actions through Razorpay APIs, and records an immutable, auditable compliance trail.

### Core Architecture

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
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | Database name | `salvo` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `RAZORPAY_KEY_ID` | Razorpay Test Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Key Secret | `...` |
| `DATASET_SEED` | Seed key for reproducible synthetic dataset | `salvo-buildathon-v1` |
| `DATASET_SIZE` | Total number of transactions generated | `1350` |

*Note: If `MONGODB_URI` is not configured, the repository gracefully persists data to high-performance local mirrors in `data/*.json`.*

---

## 3. MongoDB Collections

Salvo structures financial and execution state across three core collections:

1. **`transactions`**: Complete ledger of payments, customer history, failure taxonomy, hidden ground truth, and simulation traces.
2. **`recovery_actions`**: Recovery strategies proposed, intervention costs, execution status, and realized yield.
3. **`audit_logs`**: Chronological event trail tracking diagnosis, deterministic policy checks, and execution states.

---

## 4. Synthetic Dataset Design

> **"The dataset is synthetic and deterministic."**

Running `npm run seed` produces the exact same dataset byte-for-byte across runs using a seeded Mulberry32 PRNG.

### 4.1 Dataset Size & Currency
* **Records:** 1,350 transactions across 6 merchant verticals.
* **Currency:** Indian Rupee (INR), stored strictly as **integer paise** (`1 INR = 100 paise`) to prevent floating-point rounding errors.

### 4.2 Failure Taxonomy
* `temporary_network_failure`: Gateway/acquirer timeout (85% recoverable via `smart_retry`)
* `bank_decline`: Issuer throttling / velocity limits (52% recoverable via `smart_retry`)
* `insufficient_funds`: Balance drop (58% recoverable via `payment_link`)
* `authentication_failure`: 3DS OTP timeout / biometric drop (72% recoverable via `reminder`)
* `payment_method_issue`: Card expiry / mandate limits (66% recoverable via `payment_method_switch`)
* `customer_abandonment`: Checkout drop at UPI intent (42% recoverable via `payment_link`)
* `expired_payment`: QR / Link validity expired (46% recoverable via `payment_link`)
* `suspected_risk`: Fraud flags / velocity spikes (**0% recoverable** — Policy Gate blocks)
* `unrecoverable`: Stolen card / closed account (**0% recoverable** — Policy Gate blocks)

### 4.3 Ground Truth Isolation
Every transaction document contains an evaluation-only `groundTruth` object:
```json
"groundTruth": {
  "recoverable": true,
  "optimalStrategy": "smart_retry",
  "expectedRecoveryPaise": 840000,
  "shouldIntervene": true,
  "interventionCostPaise": 150,
  "riskScore": 0.05
}
```
*Ground truth is strictly isolated from model prompt contexts and exists exclusively for evaluation.*

---

## 5. Deterministic Evaluation Engine

The evaluation engine (`npm run evaluate`) processes the **complete dataset** without sampling.

### 5.1 Financial Formulas
* **Gross Recovery:** Sum of actual recovered amounts from executed actions ($\sum \text{actualRecoveryPaise}$).
* **Intervention Cost:** Sum of API and notification costs incurred ($\sum \text{interventionCostPaise}$).
* **Net Revenue Recovered:** $\text{Gross Recovery} - \text{Intervention Cost}$.
* **Recovery Yield on Loss:** $\frac{\text{Gross Recovery}}{\text{Total Failed Volume}} \times 100$.

### 5.2 Precision & Recall Metrics
* **Positive Prediction ($P$):** Salvo recommends an active recovery action (`strategy !== 'no_action'`).
* **Actual Positive ($A$):** Ground truth indicates transaction is genuinely recoverable (`groundTruth.recoverable === true`).
* **True Positive ($TP$):** Recommended active recovery & transaction is recoverable.
* **False Positive ($FP$):** Recommended active recovery & transaction is unrecoverable.
* **False Negative ($FN$):** Recommended `no_action` & transaction was recoverable.
* **True Negative ($TN$):** Recommended `no_action` & transaction was unrecoverable.
$$\text{Precision} = \frac{TP}{TP + FP} \quad\quad \text{Recall} = \frac{TP}{TP + FN} \quad\quad \text{F1} = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$

---

## 6. Execution Commands

### Seed Dataset
```bash
npm run seed
```

### Run Batch Evaluation
```bash
npm run evaluate
```

### Run Automated Unit Test Suite
```bash
npm run test
```

### Run Production Build
```bash
npm run build
```

### Run Code Quality Linter
```bash
npm run lint
```

---

## 7. Sample Evaluation Terminal Output

```text
========================================
  SALVO BATCH EVALUATION REPORT
========================================

  Transactions Evaluated:   1,350
  Total Failed Revenue:     ₹1,99,21,910
  Actually Recoverable:     ₹1,86,24,129
  Predicted Recovery:       ₹1,29,33,177
  Gross Actual Recovery:    ₹1,55,19,083
  Intervention Cost:        ₹2,901
  ────────────────────────────────────────
  NET REVENUE RECOVERED:    ₹1,55,16,182
  Recovery Yield on Loss:   77.9%
  ────────────────────────────────────────
  Precision:                99.1%
  Recall:                   95.9%
  F1 Score:                 97.5%
  ────────────────────────────────────────
  Safety Policy Blocks:     145
  Successful Recoveries:    1,142
  Failed Recovery Attempts: 45
  Unattempted / Isolated:   163

========================================
  STRATEGY-LEVEL PERFORMANCE BREAKDOWN
========================================

  Strategy                 | Predicted | Optimal | Accuracy |    Gross Yield |       Cost |       Net Gain
  ────────────────────────────────────────────────────────────────────────────────────────────────────
  smart retry              |       491 |     551 |    94.7% |     ₹62,49,809 |       ₹871 |     ₹62,48,938
  payment method switch    |       137 |     128 |    80.3% |     ₹16,84,564 |       ₹532 |     ₹16,84,032
  payment link             |       373 |     386 |    89.3% |     ₹51,95,553 |       ₹983 |     ₹51,94,571
  reminder                 |       214 |     191 |    76.6% |     ₹23,89,157 |       ₹516 |     ₹23,88,642
  no action                |       135 |      94 |    61.5% |             ₹0 |         ₹0 |             ₹0

========================================
  Machine-readable results written to:
  C:\Users\Omkrrish\Salvo\evaluation-results.json
========================================
```
