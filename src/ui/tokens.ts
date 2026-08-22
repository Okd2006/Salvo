/**
 * src/ui/tokens.ts
 *
 * Salvo Design System — Token Definitions
 *
 * Single source of truth for:
 *  - Color semantic tokens
 *  - Typography scale
 *  - Spacing system (8px base)
 *  - Status → color mapping
 *
 * These tokens correspond 1:1 with CSS custom properties in globals.css.
 * Import this file in components to get type-safe access to design tokens.
 */

// ─── Color Tokens ─────────────────────────────────────────────────────────────

export const COLOR = {
  /** Primary background — near-black blue-gray */
  background: '#0B0F14',
  /** Primary text — near-white */
  foreground: '#F5F7F9',
  /**
   * Recovered / positive financial outcome.
   * ONLY for: recovered money, successful recovery, positive outcomes.
   * Do NOT use as a generic accent color.
   */
  recovered: '#00C896',
  /**
   * At-risk / failed / blocked.
   * ONLY for: failed transactions, at-risk revenue, blocked execution, warnings.
   * Do NOT use as a generic accent color.
   */
  risk: '#FF6B4A',
  /** Secondary text, labels, descriptions */
  muted: '#7C8B9A',
  /** Subtle borders and dividers */
  border: '#1C2430',
  /** Card / panel surface — slightly lighter than background */
  surface: '#111720',
  /** Elevated surface (modals, dropdowns) */
  surfaceElevated: '#161E28',
  /** Needs-review / neutral warning */
  caution: '#F5A623',
  /** Interactive element hover */
  hover: '#1A2535',
} as const;

export type ColorToken = keyof typeof COLOR;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FONT = {
  /**
   * Interface font — navigation, labels, descriptions, buttons, explanations.
   * Load: Inter from Google Fonts.
   */
  interface: "'Inter', system-ui, -apple-system, sans-serif",
  /**
   * Financial / technical font — amounts, IDs, timestamps, metrics.
   * Load: JetBrains Mono or IBM Plex Mono from Google Fonts.
   * Financial numbers should feel like ledger output.
   */
  mono: "'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', monospace",
} as const;

export type FontToken = keyof typeof FONT;

// ─── Font Sizes ───────────────────────────────────────────────────────────────

export const FONT_SIZE = {
  xs: '11px',
  sm: '13px',
  base: '14px',
  md: '16px',
  lg: '18px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

// ─── Spacing (8px base) ───────────────────────────────────────────────────────

export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
} as const;

export type SpacingToken = keyof typeof SPACING;

// ─── Semantic Status → Color Mapping ─────────────────────────────────────────
// Single place where we decide which color maps to which domain concept.

export const STATUS_COLOR = {
  // Transaction states
  failed: COLOR.risk,
  abandoned: COLOR.risk,
  captured: COLOR.recovered,
  authorized: COLOR.caution,
  refunded: COLOR.muted,

  // Policy verdicts
  approved: COLOR.recovered,
  blocked: COLOR.risk,
  needs_review: COLOR.caution,

  // Recovery states
  queued: COLOR.muted,
  policy_check: COLOR.caution,
  executing: COLOR.caution,
  recovered: COLOR.recovered,
  recovery_failed: COLOR.risk,

  // Generic
  success: COLOR.recovered,
  error: COLOR.risk,
  warning: COLOR.caution,
  neutral: COLOR.muted,
} as const;

export type StatusToken = keyof typeof STATUS_COLOR;

// ─── Animation Durations ──────────────────────────────────────────────────────

export const DURATION = {
  /** Micro-interactions: hover, focus */
  fast: '120ms',
  /** State transitions: panel open/close */
  normal: '240ms',
  /** Orchestrated sequences: page load */
  slow: '480ms',
  /** Count-up animation for financial metrics */
  countUp: '800ms',
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
} as const;
