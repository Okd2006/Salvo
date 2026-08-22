/**
 * src/lib/currency.ts
 *
 * Shared Indian Rupee formatting utilities for Salvo.
 *
 * RULES:
 *  - Always use Indian grouping (e.g. ₹4,82,350 not ₹482,350)
 *  - Never manually concatenate currency strings in components
 *  - Never parse INR amounts from LLM output — use this module only
 *  - Input values are always in paise (INR × 100)
 *
 * This module is shared between server (src/) and UI (src/ui/).
 * It has zero external dependencies.
 */

// ─── Locale Configuration ─────────────────────────────────────────────────────

const INR_LOCALE = 'en-IN';
const INR_CURRENCY = 'INR';

// ─── Core Formatter ───────────────────────────────────────────────────────────

/**
 * Format a paise amount as an Indian Rupee string with ₹ symbol.
 *
 * @example
 * formatPaise(48235000)  // "₹4,82,350"
 * formatPaise(840000)    // "₹8,400"
 * formatPaise(0)         // "₹0"
 */
export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat(INR_LOCALE, {
    style: 'currency',
    currency: INR_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format a paise amount with decimal places (for amounts like ₹8,400.50).
 *
 * @example
 * formatPaiseDecimal(840050)  // "₹8,400.50"
 */
export function formatPaiseDecimal(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat(INR_LOCALE, {
    style: 'currency',
    currency: INR_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format a rupee amount (already in rupees, not paise).
 *
 * @example
 * formatRupees(482350)  // "₹4,82,350"
 */
export function formatRupees(rupees: number): string {
  return new Intl.NumberFormat(INR_LOCALE, {
    style: 'currency',
    currency: INR_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Compact secondary representation for large amounts.
 * Use only as a secondary display element, never as the primary value.
 *
 * @example
 * formatCompact(48235000)  // "₹4.82L"
 * formatCompact(1000000000) // "₹10Cr"
 */
export function formatCompact(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 1_00_00_000) {
    return `₹${(rupees / 1_00_00_000).toFixed(2)}Cr`;
  }
  if (rupees >= 1_00_000) {
    return `₹${(rupees / 1_00_000).toFixed(2)}L`;
  }
  if (rupees >= 1_000) {
    return `₹${(rupees / 1_000).toFixed(1)}K`;
  }
  return formatPaise(paise);
}

/**
 * Format a percentage with a consistent locale.
 *
 * @example
 * formatPercent(0.731)   // "73.1%"
 * formatPercent(0.5)     // "50.0%"
 */
export function formatPercent(ratio: number, decimalPlaces = 1): string {
  return `${(ratio * 100).toFixed(decimalPlaces)}%`;
}

/**
 * Compute expected recovery in paise from a probability.
 * This is the single authoritative implementation — never replicate this inline.
 *
 * @param amountPaise        Original transaction amount in paise
 * @param recoveryProbability 0–1 probability from Gemini
 */
export function computeExpectedRecoveryPaise(
  amountPaise: number,
  recoveryProbability: number,
): number {
  const clamped = Math.min(1, Math.max(0, recoveryProbability));
  return Math.round(amountPaise * clamped);
}
