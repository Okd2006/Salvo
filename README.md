# Salvo — AI Revenue Recovery Agent

> Salvo doesn't tell merchants what went wrong. It takes responsibility for what happens next.

Built for the **Razorpay AI Buildathon**.

---

## What is Salvo?

Salvo is an AI-powered revenue recovery agent that:

1. **Finds** revenue lost through failed and abandoned payments
2. **Diagnoses** why the revenue was lost using LLM-driven root-cause analysis
3. **Plans** recovery actions (retries, payment-link re-issuance, routing changes)
4. **Gates** every action through deterministic safety policies — the LLM never directly executes a payment action
5. **Executes** approved recovery actions via Razorpay APIs
6. **Records** a full auditable trail of every decision and action

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                         Salvo                            │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │ Diagnose &   │──▶│ Policy Gate  │──▶│   Execute   │  │
│  │    Plan      │   │(deterministic│   │  (Razorpay  │  │
│  │  (GPT-4o /   │   │    code)     │   │    APIs)    │  │
│  │ gpt-4o-mini) │   └──────────────┘   └─────────────┘  │
│  └──────────────┘                                        │
│         │                                                │
│         ▼                                                │
│  ┌──────────────┐                                        │
│  │  Audit Log   │  (Supabase / Postgres)                 │
│  └──────────────┘                                        │
└──────────────────────────────────────────────────────────┘
```

### Key Design Rules

- **Policy Gate is always deterministic code.** The LLM proposes actions; the gate approves or blocks them based on hard rules. No LLM call can directly trigger a payment mutation.
- `gpt-4o-mini` — structured classification and failure-code reasoning (cost-efficient, high-volume)
- `gpt-4o` — merchant-facing explanations and narratives (quality-critical, low-volume)

---

## Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Recharts |
| Backend   | Node.js · TypeScript                |
| Database  | Supabase / Postgres                 |
| AI        | OpenAI API (gpt-4o, gpt-4o-mini)    |
| Payments  | Razorpay Test Mode APIs             |

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd salvo
cp .env.example .env        # fill in your keys
npm install
```

### 2. Database setup

Apply the schema to your Supabase project:

```bash
# In the Supabase SQL editor, run:
src/db/schema.sql
```

### 3. Seed test transactions

```bash
npm run seed
```

### 4. Run the agent

```bash
npm run dev
```

### 5. Evaluate

```bash
npm run evaluate
```

---

## Available Scripts

| Script           | Description                                      |
|------------------|--------------------------------------------------|
| `npm run dev`    | Start the agent in watch mode (tsx)              |
| `npm run build`  | Compile TypeScript to `dist/`                    |
| `npm run lint`   | Run ESLint over all `.ts` files                  |
| `npm run format` | Format with Prettier                             |
| `npm run seed`   | Seed synthetic failed transactions into Supabase |
| `npm run evaluate` | Run recovery evaluation against seeded data   |
| `npm run typecheck` | Type-check without emitting files            |

---

## Repository Structure

```
salvo/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── scripts/
│   ├── seed_transactions.ts   # Seed synthetic Razorpay-style failed transactions
│   └── evaluate.ts            # Evaluate recovery rate against seeded data
├── src/
│   ├── index.ts               # Entry point
│   ├── types/
│   │   └── index.ts           # Shared typed interfaces
│   ├── agents/
│   │   ├── diagnosePlan.ts    # LLM-driven diagnosis + recovery plan
│   │   ├── policyGate.ts      # Deterministic safety gate
│   │   └── execute.ts         # Razorpay action executor
│   ├── lib/
│   │   ├── openai.ts          # OpenAI client + helpers
│   │   └── razorpay.ts        # Razorpay client + helpers
│   └── db/
│       └── schema.sql         # Postgres schema (Supabase)
└── data/
    └── .gitkeep
```

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

---

## License

MIT
