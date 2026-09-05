/**
 * StatusBadge — displays execution/policy/transaction status.
 *
 * Rules:
 *  - 17px border radius (`rounded-[17px]`)
 *  - Semantic color mappings:
 *      - RECOVERED / APPROVED: #00C896 (positive financial outcome)
 *      - FAILED / BLOCKED: #FF6B4A (failed state / safety block)
 *      - EXECUTING / ACTIVE: #05E0E0 (system intelligence/action)
 *      - QUEUED / POLICY_CHECK: #AAB1F2 / #7A83CC (neutral pipeline)
 */
import React from 'react';
import type { ExecutionStatus } from '../data/demo.js';

export type BadgeStatus =
  | ExecutionStatus
  | 'BLOCKED'
  | 'APPROVED'
  | 'NEEDS_REVIEW'
  | 'PENDING';

export interface StatusBadgeProps {
  status: BadgeStatus | string;
  mode?: 'chip' | 'icon';
  className?: string;
}

const CONFIG: Record<
  string,
  { icon: string; label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  RECOVERED: {
    icon: 'check_circle',
    label: 'RECOVERED',
    textClass: 'text-recovered',
    bgClass: 'bg-recovered/10',
    borderClass: 'border-recovered/30',
  },
  APPROVED: {
    icon: 'verified',
    label: 'APPROVED',
    textClass: 'text-recovered',
    bgClass: 'bg-recovered/10',
    borderClass: 'border-recovered/30',
  },
  EXECUTING: {
    icon: 'sync',
    label: 'EXECUTING',
    textClass: 'text-ai-signal',
    bgClass: 'bg-ai-signal/10',
    borderClass: 'border-ai-signal/30',
  },
  POLICY_CHECK: {
    icon: 'policy',
    label: 'POLICY CHECK',
    textClass: 'text-text-secondary',
    bgClass: 'bg-surface',
    borderClass: 'border-border-hairline',
  },
  QUEUED: {
    icon: 'hourglass_empty',
    label: 'QUEUED',
    textClass: 'text-text-tertiary',
    bgClass: 'bg-surface',
    borderClass: 'border-border-hairline',
  },
  FAILED: {
    icon: 'cancel',
    label: 'FAILED',
    textClass: 'text-risk',
    bgClass: 'bg-risk/10',
    borderClass: 'border-risk/30',
  },
  BLOCKED: {
    icon: 'block',
    label: 'BLOCKED',
    textClass: 'text-risk',
    bgClass: 'bg-risk/10',
    borderClass: 'border-risk/30',
  },
  NEEDS_REVIEW: {
    icon: 'warning',
    label: 'NEEDS REVIEW',
    textClass: 'text-warning',
    bgClass: 'bg-warning/10',
    borderClass: 'border-warning/30',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  mode = 'chip',
  className = '',
}) => {
  const safeStatus = (status || 'UNKNOWN').toString();
  const upperStatus = safeStatus.toUpperCase().replace(/\s+/g, '_');
  const cfg = CONFIG[upperStatus] ?? {
    icon: 'info',
    label: safeStatus.toUpperCase(),
    textClass: 'text-text-secondary',
    bgClass: 'bg-surface',
    borderClass: 'border-border-hairline',
  };

  const isSpinning = upperStatus === 'EXECUTING';

  if (mode === 'icon') {
    return (
      <span
        className={`material-symbols-outlined ${cfg.textClass} ${
          isSpinning ? 'animate-spin' : ''
        } ${className}`}
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
        title={cfg.label}
      >
        {cfg.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[17px] border font-mono text-[11px] uppercase tracking-[0.08em] font-semibold ${cfg.textClass} ${cfg.bgClass} ${cfg.borderClass} ${className}`}
    >
      <span
        className={`material-symbols-outlined text-[13px] ${isSpinning ? 'animate-spin' : ''}`}
      >
        {cfg.icon}
      </span>
      <span>{cfg.label}</span>
    </span>
  );
};
