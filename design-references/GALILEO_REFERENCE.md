# Galileo Design Reference — Visual Language Analysis & Extraction

> **Document Type:** Visual & Architectural Reference  
> **Source:** Galileo-ft design study  
> **Purpose:** Serves as design evidence and architectural inspiration for Salvo's "Deep-Space Financial Command Center" design system.

---

## 1. Core Visual Principles Extracted

### 1.1 Dark-Space Aesthetic & Spatial Depth
* **Deep Space Void:** Canvas uses an ultra-deep navy/space tone (`#03081A`) providing maximum contrast and calm stability.
* **Architectural Planar Surfaces:** Secondary containers sit on dark slate-blue surfaces (`#020626`), elevated not by drop shadows, but through subtle surface luminance shifts and hairline perimeter strokes.
* **Flat Elevation Philosophy:** Minimal to zero drop shadows. Elevation is expressed through surface opacity, crisp hairline boundary lines (`1px`), and structured padding.

### 1.2 Hairline Structural Borders
* **Primary Stroke:** 1px hairline border in `#292F66` (subtle midnight cobalt).
* **Secondary / Active Stroke:** 1px border in `#4D5499` (radiant muted periwinkle) for hovered, selected, or active boundaries.
* **Visual Impact:** Creates a structured, blueprint-like mathematical precision fitting mission-critical financial infrastructure.

### 1.3 Signature Geometric Curvature (Large Radii)
* **Cards & Enclosures:** `35px` corner radius. Softens high-density data and gives an organic, luxury aerospace feel.
* **Input Fields & Search:** `35px` corner radius. Matches panel curvature.
* **Action Buttons:** `48px` pill radius (fully rounded buttons).
* **Tags, Chips & Indicators:** `17px` radius.

### 1.4 Typography Philosophy: Restraint & Thin Elegance
* **Display Weight:** Thin and ultralight (weights 200–300) for large display headlines, avoiding aggressive heavy bolding (600/700).
* **Hierarchy:**
  * Hero Display: `72px – 100px` (light, letter-spacing -0.03em)
  * Page Titles: `42px – 56px` (regular/light, letter-spacing -0.02em)
  * Section Titles: `28px – 42px`
  * Body Text: `14px – 16px` (regular, high readability)
  * Technical / Micro Metadata: `10px – 12px` (uppercase, tracking +0.06em)
* **Generous Negative Space:** Ample breathing room around major headings to project institutional authority.

### 1.5 Color Harmony & Restraint
* **Primary Action:** Vibrant Cobalt (`#3D50FC`) for primary interactions, key CTA buttons, active tabs.
* **AI / System Telemetry:** Electric Cyan / Teal (`#05E0E0`) for AI signals, agent processing, algorithmic telemetry.
* **Semantic Financial Boundaries:**
  * Positive / Recovered: `#00C896` (Used strictly for recovered money and approved executions).
  * Negative / Risk: `#FF6B4A` (Used strictly for lost revenue, failed payments, security blocks).

---

## 2. Adaptation into Salvo (What We Kept vs. Excluded)

| Dimension | Galileo Reference | Salvo Adaptation |
| :--- | :--- | :--- |
| **Theme / Metaphor** | Space exploration & satellite telemetry | **Deep-space financial operations command center** |
| **Primary Palette** | Cobalt + Deep Space | `#03081A` canvas, `#020626` surface, `#3D50FC` primary, `#05E0E0` AI |
| **Financial Elements** | Generic values | **Strict Indian Rupee (INR ₹) paise formatting + JetBrains Mono** |
| **Workflow** | Mission planning | **Autonomous Revenue Recovery lifecycle: Lost → Diagnose → Policy → Execute → Recover → Audit** |
| **Border Radii** | 35px cards, 48px buttons, 17px tags | **Retained 1:1 for luxury fintech architectural feel** |
| **Banned Patterns** | Heavy drop shadows, purple SaaS gradients | **Strictly excluded in favor of flat hairline borders (`#292F66`)** |

---

*Preserved as immutable design evidence for Salvo frontend engineering.*
