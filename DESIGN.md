# Salvo Design System

> **Product:** Salvo — Autonomous AI Revenue Recovery Platform (Razorpay AI Buildathon)  
> **Visual Concept:** Deep-Space Financial Command Center  
> **Status:** Authoritative Design System Lock  
> **Target Experience:** Institutional, restrained, high-trust fintech infrastructure

---

## 1. Visual Identity & Brand Philosophy

Salvo finds revenue lost through failed and abandoned payments, diagnoses why the revenue was lost, proposes recovery actions, enforces deterministic safety policies, executes approved recovery actions through Razorpay APIs, and records an immutable audit trail.

The visual language reflects **"Deep-space financial command center"**:
* **Institutional Authority:** Flat elevation, hairline structural boundaries, generous spatial breathing room.
* **Calm Precision:** Elimination of decorative glows, rainbow gradients, or cartoonish chatbot widgets.
* **Uncompromising Trust:** Clear distinction between AI intelligence (`#05E0E0`), primary action (`#3D50FC`), positive recovered revenue (`#00C896`), and at-risk decline states (`#FF6B4A`).

```
REVENUE LOST → DIAGNOSIS → RECOVERY PLAN → POLICY GATE → EXECUTION → RECOVERY → AUDIT
```

---

## 2. Color System & Semantic Rules

### 2.1 Core Palette Tokens

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `background` | `#03081A` | Main application canvas / deep-space backdrop |
| `surface` | `#020626` | Architectural surface for cards, panels, modules |
| `border-hairline` | `#292F66` | Primary structural border (1px solid) |
| `border-secondary` | `#4D5499` | Hovered, active, or focused boundary border |
| `primary` | `#3D50FC` | Primary action button, active tab indicator, brand accent |
| `ai-signal` | `#05E0E0` | AI activity, Gemini agent reasoning, system intelligence |
| `text-primary` | `#FFFFFF` | Primary headings, major metrics, high-emphasis text |
| `text-secondary` | `#AAB1F2` | Body descriptions, subheaders, active metadata |
| `text-tertiary` | `#7A83CC` | Low-emphasis labels, column headers, micro-copy |
| `recovered` | `#00C896` | **Semantic ONLY:** Successfully recovered money, approved state |
| `risk` | `#FF6B4A` | **Semantic ONLY:** Failed transactions, lost revenue, safety blocks |

### 2.2 Semantic Color Rules (Strict)
* **`#3D50FC` (Primary Cobalt):** Used for primary buttons, active tabs, focus rings, and primary interactive controls.
* **`#05E0E0` (AI Cyan):** Used for Gemini reasoning chips, automated telemetry badges, agent insight markers, and AI status indicators.
* **`#00C896` (Recovered Green):** **NEVER** used as a generic decorative color. Used **ONLY** for realized recovered revenue, approved policy verdicts, and successful executions.
* **`#FF6B4A` (At-Risk Coral):** **NEVER** used decoratively. Used **ONLY** for declined payments, revenue leakage, policy blocks, and execution failures.

---

## 3. Surface & Elevation Architecture

Salvo follows a **flat elevation philosophy**. Elevation is communicated through surface contrast and hairline borders, not heavy drop shadows.

```
┌─────────────────────────────────────────────────────────────┐
│ Application Canvas (#03081A)                                │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Architectural Surface (#020626)                     │   │
│   │ Border: 1px solid #292F66                           │   │
│   │ Corner Radius: 35px                                 │   │
│   │                                                     │   │
│   │   [ Padded Content Area: 24px–32px ]                │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

* **Canvas:** `#03081A` — infinite dark void.
* **Panels / Cards:** `#020626` — structured architectural surface.
* **Border:** `1px solid #292F66` — subtle midnight cobalt outline.
* **Hover State:** `border-color: #4D5499` with smooth `150ms` transition.
* **Shadows:** Minimal to none. Flat and architectural.

---

## 4. Geometric Curvature (Border Radii)

Salvo adopts generous, organic curvature that softens high-density financial data:

* **Cards & Panels:** `35px` (`rounded-[35px]`)
* **Input Fields & Search:** `35px` (`rounded-[35px]`)
* **Primary & Secondary Buttons:** `48px` (`rounded-[48px]`)
* **Tags, Badges & Status Chips:** `17px` (`rounded-[17px]`)
* **Inner Sub-elements (Cells, Icons):** `8px–12px`

---

## 5. Typography Scale & Hierarchy

Salvo utilizes a **thin display typography philosophy** paired with high-legibility interface fonts and tabular monospace for financial numbers.

* **Primary Interface Font:** `Geist` or `Inter` (sans-serif)
* **Financial & Technical Font:** `JetBrains Mono` (monospace / tabular figures)

| Level | Size / Line-Height | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `72px–96px / 1.05` | Thin (300) | `-0.03em` | Launch narrative & high-impact statements |
| **Page Title** | `42px–52px / 1.15` | Light (300–400) | `-0.02em` | Screen headers (Overview, Diagnosis, etc.) |
| **Section Title** | `24px–32px / 1.25` | Normal (400) | `-0.01em` | Major module & ledger titles |
| **Metric Large** | `32px–48px / 1.1` | Mono Medium (500) | `-0.02em` | Key financial totals (`₹84,50,210`) |
| **Metric Medium**| `16px–20px / 1.2` | Mono Medium (500) | `0em` | Table row figures & balances |
| **Body Standard** | `14px–15px / 1.5` | Regular (400) | `0em` | Explanations, analyst notes, logs |
| **Eyebrow / Caps**| `11px–12px / 1.3` | Mono SemiBold (600)| `+0.08em`| Uppercase categories & telemetry tags |

---

## 6. Financial Numbers & Currency Formatting

* **Single Source of Truth:** All monetary calculations use integer paise (`1 INR = 100 paise`).
* **Formatting Function:** `formatPaise(paise)` from `src/lib/currency.ts`.
* **Standard Format:** Indian numbering system with standard grouping:
  ```text
  ₹4,82,350     (Correct)
  ₹482,350      (Incorrect — Western grouping)
  482350        (Incorrect — Missing currency symbol)
  ```
* **Tabular Figures:** Always render monetary values in `font-mono` (`JetBrains Mono`) to ensure numerical alignment across rows.
* **Component Usage:** `<CurrencyValue paise={value} variant="recovered" />`

---

## 7. AI Visual Language (Gemini Intelligence)

* **Telemetry & Insight Accent:** `#05E0E0` (Electric Cyan).
* **AI Processing Indicator:** Subtle pulsing cyan orb or badge:
  ```html
  <div className="flex items-center gap-2 bg-[#05E0E0]/10 border border-[#05E0E0]/30 text-[#05E0E0] px-3 py-1 rounded-[17px] text-xs font-mono">
    <span className="w-1.5 h-1.5 rounded-full bg-[#05E0E0] animate-pulse" />
    <span>GEMINI ANALYST ENGINE</span>
  </div>
  ```
* **Analyst Note Cards:** Structured insights with root causes, confidence scores, and deterministically calculated projected recoveries.

---

## 8. Core Component Specifications

### 8.1 Buttons
* **Primary Button:** `#3D50FC` background, `#FFFFFF` text, `48px` border radius, `px-6 py-2.5`, clean medium weight typography.
* **Secondary Button:** Transparent background, `1px solid #292F66`, `#AAB1F2` text, `48px` border radius, hover `border-[#4D5499] text-white`.
* **Action Accent Button:** `#00C896` background, `#03081A` text (for explicit "Execute Recovery" actions).

### 8.2 Architectural Cards
* `bg-[#020626] border border-[#292F66] rounded-[35px] p-6 lg:p-8`

### 8.3 Execution Timeline (Signature Component)
* Step progression: `QUEUED` → `POLICY CHECK` → `EXECUTING` → `RECOVERED` (or `FAILED` → `FALLBACK`).
* Ledger row format with timestamp, transaction hash, error vector, status badge, and dynamic currency tally upon confirmed execution.

---

## 9. Layout & Section Architecture

* **Viewport Shell:** Two-column layout with persistent fixed-width left navigation (`240px`) and responsive top app bar (`64px` height).
* **Max Width Enclosures:** Content centered inside `max-w-[1280px]` with generous vertical padding (`py-8 lg:py-12`).
* **Responsive Breakpoints:** Fully adaptive from mobile (`360px+`), tablet (`768px+`), laptop (`1024px+`), to 4K displays (`1536px+`).

---

*Salvo Design System v2.0 — Deep-Space Financial Command Center.*
