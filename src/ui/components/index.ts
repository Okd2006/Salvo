/**
 * src/ui/components/index.ts
 *
 * Salvo UI Component Registry
 *
 * This file defines the prop types for all reusable UI components.
 * Actual implementations live in their respective component files.
 *
 * Component inventory (per spec):
 *  - AnimatedMetric      — count-up animation for financial metrics
 *  - CurrencyValue       — typed currency display (paise input)
 *  - StatusBadge         — semantic status indicator
 *  - TransactionRow      — single transaction entry in the ledger
 *  - RecoveryStrategyRow — single recovery action row
 *  - ExecutionTimeline   — live recovery execution feed (signature component)
 *  - PolicyResultPanel   — policy gate verdict display
 *  - WhyPanel            — audit reasoning panel
 *  - SkeletonMetric      — loading skeleton matching MetricCard geometry
 *  - EmptyState          — no-data state with message
 *  - ErrorState          — error state with context
 *  - AuditEventRow       — single audit log entry
 *
 * Implementation: Phase 6
 */

import type { StatusToken } from '../tokens.js';
import type {
  Transaction,
  DiagnosisResult,
  RecoveryAction,
  PolicyResult,
  AuditEvent,
} from '../../types/index.js';

// ─── AnimatedMetric ───────────────────────────────────────────────────────────

export interface AnimatedMetricProps {
  /** Value in paise */
  valuePaise: number;
  /** Animation duration in ms (default: 800) */
  durationMs?: number;
  /** Color token for the displayed value */
  color?: 'recovered' | 'risk' | 'muted' | 'foreground';
  /** Optional label above the metric */
  label?: string;
  /** Optional secondary compact value shown below */
  showCompact?: boolean;
}

// ─── CurrencyValue ────────────────────────────────────────────────────────────

export interface CurrencyValueProps {
  /** Amount in paise */
  paise: number;
  /** Display size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Semantic color */
  color?: 'recovered' | 'risk' | 'muted' | 'foreground';
  /** Show sign prefix (+/−) */
  showSign?: boolean;
  /** Show compact secondary representation */
  showCompact?: boolean;
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  status: StatusToken;
  /** Override display label */
  label?: string;
}

// ─── TransactionRow ───────────────────────────────────────────────────────────

export interface TransactionRowProps {
  transaction: Transaction;
  diagnosis?: DiagnosisResult;
  onClick?: (transaction: Transaction) => void;
  isSelected?: boolean;
}

// ─── RecoveryStrategyRow ──────────────────────────────────────────────────────

export interface RecoveryStrategyRowProps {
  action: RecoveryAction;
  policyResult?: PolicyResult;
  isRecommended?: boolean;
}

// ─── ExecutionTimeline ────────────────────────────────────────────────────────

export type ExecutionState =
  | 'queued'
  | 'policy_check'
  | 'executing'
  | 'recovered'
  | 'blocked'
  | 'failed'
  | 'fallback_selected'
  | 'fallback_executing';

export interface TimelineEntry {
  transactionId: string;
  action: RecoveryAction;
  state: ExecutionState;
  /** Amount in paise — only shown when state === 'recovered' */
  recoveredPaise?: number;
  policyResult?: PolicyResult;
  timestamp: string; // ISO-8601
  /** Failure reason if state === 'failed' */
  failureReason?: string;
  /** Fallback action if one was selected */
  fallbackAction?: RecoveryAction;
}

export interface ExecutionTimelineProps {
  entries: TimelineEntry[];
  /** Whether the timeline is actively receiving new entries */
  isLive?: boolean;
}

// ─── PolicyResultPanel ────────────────────────────────────────────────────────

export interface PolicyResultPanelProps {
  policyResult: PolicyResult;
}

// ─── WhyPanel ─────────────────────────────────────────────────────────────────

export interface WhyPanelProps {
  diagnosis: DiagnosisResult;
  policyResult: PolicyResult;
  transaction: Transaction;
}

// ─── SkeletonMetric ───────────────────────────────────────────────────────────

export interface SkeletonMetricProps {
  /** Number of skeleton rows to render */
  rows?: number;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  title: string;
  description: string;
  /** Optional action button label */
  actionLabel?: string;
  onAction?: () => void;
}

// ─── ErrorState ───────────────────────────────────────────────────────────────

export interface ErrorStateProps {
  title: string;
  description: string;
  /** What the system did in response to the error */
  systemResponse?: string;
  onRetry?: () => void;
}

// ─── AuditEventRow ────────────────────────────────────────────────────────────

export interface AuditEventRowProps {
  event: AuditEvent;
  onClick?: (event: AuditEvent) => void;
}

// Re-export token types for convenience
export type { StatusToken };
