-- ─────────────────────────────────────────────────────────────────────────────
-- Salvo — Supabase / Postgres Schema
--
-- Apply this in the Supabase SQL editor or via supabase db push.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── transactions ─────────────────────────────────────────────────────────────
-- Mirrors the Razorpay payment object + Salvo-specific fields.
-- Source of truth for all failed/abandoned payments Salvo processes.

CREATE TABLE IF NOT EXISTS transactions (
  id               TEXT PRIMARY KEY,           -- Razorpay payment ID (pay_XXXXX)
  order_id         TEXT NOT NULL,              -- Razorpay order ID
  amount_paise     INTEGER NOT NULL,           -- Amount in paise (INR × 100)
  currency         TEXT NOT NULL DEFAULT 'INR',
  status           TEXT NOT NULL,              -- failed | abandoned | captured | authorized
  method           TEXT NOT NULL DEFAULT 'unknown', -- card | upi | netbanking | wallet | emi
  error_code       TEXT,                       -- Razorpay error code
  error_description TEXT,                      -- Human-readable Razorpay error
  error_reason     TEXT,                       -- Razorpay internal reason
  bank             TEXT,                       -- Issuer bank / VPA / wallet
  email            TEXT,                       -- Customer email
  contact          TEXT,                       -- Customer contact
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       BIGINT NOT NULL,            -- Unix timestamp from Razorpay
  updated_at       BIGINT NOT NULL,
  synced_at        TIMESTAMPTZ DEFAULT NOW()   -- When Salvo last synced this
);

CREATE INDEX IF NOT EXISTS idx_transactions_status    ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id  ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ─── customer_history ─────────────────────────────────────────────────────────
-- Aggregated customer payment history for richer Gemini diagnosis.
-- Populated by the seed script and updated by the recovery pipeline.

CREATE TABLE IF NOT EXISTS customer_history (
  customer_id                  TEXT PRIMARY KEY, -- email or contact as identifier
  total_transactions           INTEGER NOT NULL DEFAULT 0,
  successful_transactions      INTEGER NOT NULL DEFAULT 0,
  failed_transactions          INTEGER NOT NULL DEFAULT 0,
  retry_success_rate           NUMERIC(5,4) NOT NULL DEFAULT 0, -- 0.0000–1.0000
  preferred_method             TEXT NOT NULL DEFAULT 'unknown',
  average_transaction_paise    INTEGER NOT NULL DEFAULT 0,
  last_updated                 TIMESTAMPTZ DEFAULT NOW()
);

-- ─── diagnosis_results ────────────────────────────────────────────────────────
-- Stores Gemini's validated structured output for each transaction.

CREATE TABLE IF NOT EXISTS diagnosis_results (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id         TEXT NOT NULL REFERENCES transactions(id),

  -- Validated Gemini structured output (GeminiDiagnosisPayload)
  failure_type           TEXT NOT NULL, -- temporary | customer | payment_method | unrecoverable
  recoverability         NUMERIC(5,4) NOT NULL,
  recommended_strategy   TEXT NOT NULL, -- smart_retry | payment_method_switch | payment_link | reminder | no_action
  confidence             NUMERIC(5,4) NOT NULL,
  evidence               JSONB NOT NULL DEFAULT '[]',
  predicted_recovery     NUMERIC(5,4) NOT NULL, -- probability 0–1, NOT an INR amount

  -- Deterministic application computation
  expected_recovery_paise INTEGER NOT NULL, -- amount_paise × predicted_recovery

  -- Merchant narrative (presentation only — never used for financial decisions)
  merchant_narrative     TEXT,

  diagnosed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_transaction ON diagnosis_results(transaction_id);

-- ─── recovery_actions ─────────────────────────────────────────────────────────
-- Individual recovery actions proposed by diagnosePlan.

CREATE TABLE IF NOT EXISTS recovery_actions (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnosis_id                  UUID NOT NULL REFERENCES diagnosis_results(id),
  transaction_id                TEXT NOT NULL REFERENCES transactions(id),
  action_type                   TEXT NOT NULL,
  rationale                     TEXT,
  params                        JSONB NOT NULL DEFAULT '{}',
  estimated_success_probability NUMERIC(5,4) NOT NULL,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── policy_results ───────────────────────────────────────────────────────────
-- Deterministic Policy Gate decisions for each proposed action.

CREATE TABLE IF NOT EXISTS policy_results (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id   TEXT NOT NULL REFERENCES transactions(id),
  action_id        UUID NOT NULL REFERENCES recovery_actions(id),
  verdict          TEXT NOT NULL, -- approved | blocked | needs_review
  triggered_rules  JSONB NOT NULL DEFAULT '[]',
  explanation      TEXT NOT NULL,
  evaluated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_transaction ON policy_results(transaction_id);
CREATE INDEX IF NOT EXISTS idx_policy_verdict     ON policy_results(verdict);

-- ─── audit_events ─────────────────────────────────────────────────────────────
-- Immutable audit log of every Salvo decision and action.
-- Append-only — no UPDATE or DELETE on this table.

CREATE TABLE IF NOT EXISTS audit_events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id   TEXT NOT NULL REFERENCES transactions(id),
  event_type       TEXT NOT NULL,
  payload          JSONB NOT NULL DEFAULT '{}',
  razorpay_response JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_transaction ON audit_events(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type  ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_created_at  ON audit_events(created_at);
