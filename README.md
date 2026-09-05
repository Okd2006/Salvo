# Salvo — Autonomous AI Revenue Recovery Platform

> **"Gemini recommends. Deterministic policy code decides. Execution code acts."**

Built for the **Razorpay AI Buildathon**.

---

## ⚡ Quick Start (Run Locally in 60 Seconds)

Salvo runs **100% out of the box** with zero mandatory API keys or external database setup required. It embeds a verified, deterministic Buildathon benchmark dataset (1,350 transactions, 208 failure traces, 7,264 immutable cryptographic audit events, and autonomous recovery strategies).

```bash
# 1. Clone the repository
git clone https://github.com/Okd2006/Salvo.git
cd Salvo

# 2. Install dependencies
npm install

# 3. (Optional) Set up environment variables for live Groq/Razorpay integrations
cp .env.example .env

# 4. Launch the platform (Frontend & API middleware automatically mount on port 3000)
npm run dev
```

Open **`http://localhost:3000`** in your browser.

```bash
# Run the complete test suite (114/114 passing tests)
npm test

# Run TypeScript typecheck
npm run typecheck

# Build production bundle
npm run build
```

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

## 2. Safety Invariants & Rules

> [!IMPORTANT]
> **No production payment execution is enabled in Phase 4.**
> All payment interactions are strictly restricted to Razorpay Test Mode (`RAZORPAY_MODE=test`) or deterministic test simulations. Production mode is hard-blocked at the application layer.

1. **Autonomous Separation of Powers:**
   * **Gemini recommends:** Diagnoses failure root causes and predicts recovery vectors.
   * **Policy Gate decides:** Pure deterministic TypeScript safety checks (`ALLOW` or `BLOCK`).
   * **Executor acts:** Executes only approved actions via Razorpay Test APIs or test simulation.
2. **Policy Enforcement Gate:** Blocked actions **NEVER** reach the execution layer.
3. **Idempotency & Anti-Replay:** Guaranteed via unique idempotency keys (`salvo:{actionId}:{attemptNumber}`).
4. **Strict Integer Paise:** All monetary calculations are performed in strictly non-negative integer paise ($1\text{ INR} = 100\text{ paise}$).
5. **Observation Boundary:** Hidden ground-truth evaluation metrics are never passed into AI prompt contexts.

---

## 3. Environment Configuration

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
| `RAZORPAY_MODE` | Razorpay environment mode (**must be test**) | `test` |
| `EXECUTION_SIMULATION` | Deterministic failure injection & simulation toggle | `true` |
| `MAX_RECOVERY_ATTEMPTS` | Maximum recovery action attempts per session | `3` |
| `DATASET_SEED` | Seed key for reproducible synthetic dataset | `salvo-buildathon-v1` |
| `DATASET_SIZE` | Total number of transactions generated | `1350` |
| `DIAGNOSIS_LIMIT` | Optional limit for batch diagnosis during development | `10` |

---

## 4. System Components

### 4.1 Gemini AI Intelligence Layer (Phase 2)
* **Model:** `gemini-2.5-flash` via `@google/genai` SDK (`v2.18.0`).
* **Structured Output:** Enforced via native JSON `responseSchema` (`RecoveryRecommendation`).
* **Observation Boundary:** `toObservableTransaction()` strictly strips ground truth; prompt payloads verified by `assertNoGroundTruthLeakage()`.

### 4.2 Deterministic Policy Gate (Phase 3)
* **Zero LLM Calls:** Pure TypeScript rule evaluation engine.
* **9 Deterministic Checks:** `RISK_SAFETY_CHECK`, `UNRECOVERABLE_SAFETY_CHECK`, `RETRY_LIMIT_CHECK`, `CONFIDENCE_THRESHOLD_CHECK`, `POSITIVE_EXPECTED_VALUE_CHECK`, `AMOUNT_VALIDITY_CHECK`, `AMOUNT_THRESHOLD_CHECK`, `STRATEGY_PERMISSIBILITY_CHECK`, `CONTACT_LIMIT_CHECK`.
* **Reason Codes:** `ALLOWED`, `RISK_BLOCK`, `UNRECOVERABLE_BLOCK`, `CONFIDENCE_TOO_LOW`, `RETRY_LIMIT_EXCEEDED`, `CONTACT_LIMIT_EXCEEDED`, `AMOUNT_THRESHOLD_EXCEEDED`, `STRATEGY_NOT_PERMITTED`, `NEGATIVE_EXPECTED_VALUE`, `INVALID_RECOVERY_AMOUNT`.

### 4.3 Razorpay Test Execution & Fallback Engine (Phase 4)
* **Execution State Machine:** `not_executed` $\rightarrow$ `queued` $\rightarrow$ `executing` $\rightarrow$ `succeeded` / `failed` / `blocked`.
* **Deterministic Failure Injection:** Seeded hashing (`transactionId + strategy + attempt`) produces reproducible demo execution traces without uncontrolled randomness.
* **Fallback Progression:** When an approved attempt fails, the engine deterministically transitions (`smart_retry` $\rightarrow$ `payment_method_switch` $\rightarrow$ `payment_link` $\rightarrow$ `reminder` $\rightarrow$ `no_action`) and evaluates the Policy Gate on every fallback action.

---

## 5. API Endpoints

### 5.1 Autonomous Recovery Orchestrator
`POST /api/recover`
```json
{
  "transactionId": "txn_salv_0001"
}
```
**Response (`RecoverySessionResult`):**
```json
{
  "success": true,
  "recoverySession": {
    "transactionId": "txn_salv_0001",
    "success": true,
    "attempts": 1,
    "totalRecoveredPaise": 482350,
    "finalStrategy": "smart_retry",
    "finalStatus": "succeeded",
    "actions": [
      {
        "success": true,
        "actionId": "act_txn_salv_0001_1724391200000",
        "transactionId": "txn_salv_0001",
        "strategy": "smart_retry",
        "provider": "razorpay_test",
        "providerReference": "rzp_test_sim_000001_smar_1",
        "status": "succeeded",
        "recoveredAmountPaise": 482350,
        "executedAt": "2026-08-23T11:38:00.000Z"
      }
    ],
    "policyDecisions": [
      {
        "allowed": true,
        "reasonCode": "ALLOWED",
        "reason": "All deterministic policy gate safety checks passed successfully.",
        "checks": [ ... ],
        "evaluatedAt": "2026-08-23T11:38:00.000Z"
      }
    ],
    "completedAt": "2026-08-23T11:38:01.000Z"
  }
}
```

### 5.2 Direct Execution Endpoint
`POST /api/execute`
```json
{
  "actionId": "act_txn_salv_0001_1724391200000"
}
```

### 5.3 Diagnostic Endpoint
`POST /api/diagnose`
```json
{
  "transactionId": "txn_salv_0001"
}
```

### 5.4 Policy Gate Endpoint
`POST /api/policy-gate`
```json
{
  "transactionId": "txn_salv_0001"
}
```

---

## 6. Execution Commands

### Development
```bash
# Start frontend dev server (Vite on port 3000)
npm run dev

# Start backend API server (Node on port 3001)
npm run dev:server

# Both servers must run concurrently for full OAuth flow
```

### Testing & Validation
```bash
# Run automated unit test suite
npm run test

# TypeScript type checking
npm run typecheck

# ESLint code quality verification
npm run lint
```

### Data & AI Operations
```bash
# Seed 1,350 synthetic transactions to MongoDB
npm run seed

# Run Gemini AI batch diagnosis (development subset)
DIAGNOSIS_LIMIT=10 npm run diagnose

# Run full batch revenue evaluation
npm run evaluate
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Google OAuth Setup

To enable Google OAuth authentication:

1. **Google Cloud Console** → APIs & Services → Credentials
2. Create **OAuth 2.0 Web Application** credential
3. Add **Authorized redirect URIs**:
   - `http://localhost:3000/login` (local development)
   - `https://your-production-domain.com/login` (production)
4. Copy **Client ID** and **Client Secret** to `.env`:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your_secret
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

**Note:** The frontend uses `VITE_GOOGLE_CLIENT_ID` (public), while the backend uses both ID and secret (private) for token exchange.

---

## 8. Deployment (Vercel)

This project is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables:** Add all `.env` variables to Vercel project settings, except don't expose `GOOGLE_CLIENT_SECRET` publicly.
