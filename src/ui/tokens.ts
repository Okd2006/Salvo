/**
 * src/ui/tokens.ts
 *
 * Salvo Design System — Authoritative Token Definitions
 * "Deep-Space Financial Command Center"
 */

// ─── Color Tokens ─────────────────────────────────────────────────────────────

export const COLOR = {
  /** Canvas background — Deep space void */
  background: '#03081A',
  /** Architectural dark surface for cards and panels */
  surface: '#020626',
  /** Primary structural hairline border (1px) */
  borderHairline: '#292F66',
  /** Secondary border for hover / active / focused states */
  borderSecondary: '#4D5499',
  /** Primary action — Vibrant Cobalt */
  primary: '#3D50FC',
  /** Primary action hover state */
  primaryHover: '#5264FF',
  /** AI Telemetry / System Signal — Electric Cyan */
  aiSignal: '#05E0E0',
  /** Primary text — Pure white */
  textPrimary: '#FFFFFF',
  /** Secondary text — Soft periwinkle */
  textSecondary: '#AAB1F2',
  /** Tertiary text / metadata — Muted indigo */
  textTertiary: '#7A83CC',
  /**
   * Recovered / positive financial outcome.
   * STRICT SEMANTIC ONLY: successfully recovered money, approved policy, successful execution.
   */
  recovered: '#00C896',
  /**
   * At-risk / failed / blocked.
   * STRICT SEMANTIC ONLY: failed transactions, at-risk revenue, policy safety blocks.
   */
  risk: '#FF6B4A',
  /** Neutral caution / warning */
  caution: '#F5A623',
} as const;

export type ColorToken = keyof typeof COLOR;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FONT = {
  /** Primary interface font: Geist / Inter */
  sans: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
  /** Financial / technical monospace: JetBrains Mono */
  mono: "'JetBrains Mono', monospace",
} as const;

// ─── Border Radii ─────────────────────────────────────────────────────────────

export const RADIUS = {
  /** Architectural cards & panels */
  card: '35px',
  /** Input fields & search */
  input: '35px',
  /** Buttons */
  button: '48px',
  /** Status tags & chips */
  tag: '17px',
  /** Inner elements */
  sm: '8px',
  md: '12px',
} as const;

// ─── Semantic Status → Color Mapping ─────────────────────────────────────────

export const STATUS_COLOR = {
  // Transaction & Recovery states
  recovered: COLOR.recovered,
  failed: COLOR.risk,
  blocked: COLOR.risk,
  executing: COLOR.aiSignal,
  policy_check: COLOR.textSecondary,
  queued: COLOR.textTertiary,
  approved: COLOR.recovered,
  needs_review: COLOR.caution,
} as const;

export type StatusToken = keyof typeof STATUS_COLOR;
