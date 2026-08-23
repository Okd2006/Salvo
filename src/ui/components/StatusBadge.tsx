/**
 * StatusBadge — displays execution/policy status with semantic color.
 *
 * Usage:
 *   <StatusBadge status="RECOVERED" />
 *   <StatusBadge status="EXECUTING" />
 *   <StatusBadge status="QUEUED" />
 *   <StatusBadge status="FAILED" />
 *   <StatusBadge status="POLICY_CHECK" />
 *   <StatusBadge status="BLOCKED" />
 */
import React from 'react';
import type { ExecutionStatus } from '../data/demo.js';

type BadgeStatus = ExecutionStatus | 'BLOCKED' | 'APPROVED';

interface StatusBadgeProps {
  status: BadgeStatus;
  /** Show as pill chip (default) or icon-only */
  mode?: 'chip' | 'icon';
}

const CONFIG: Record<
  BadgeStatus,
  { icon: string; label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  RECOVERED: {
    icon: 'check_circle',
    label: 'RECOVERED',
    textClass: 'text-primary-container',
    bgClass: 'bg-primary-container/10',
    borderClass: 'border-primary-container/30',
  },
  EXECUTING: {
    icon: 'sync',
    label: 'EXECUTING',
    textClass: 'text-on-surface-variant',
    bgClass: 'bg-surface-container-high',
    borderClass: 'border-outline-variant',
  },
  QUEUED: {
    icon: 'hourglass_empty',
    label: 'QUEUED',
    textClass: 'text-on-surface-variant',
    bgClass: 'bg-surface-container',
    borderClass: 'border-outline-variant',
  },
  FAILED: {
    icon: 'cancel',
    label: 'FAILED',
    textClass: 'text-error',
    bgClass: 'bg-error/10',
    borderClass: 'border-error/30',
  },
  POLICY_CHECK: {
    icon: 'policy',
    label: 'POLICY',
    textClass: 'text-on-surface-variant',
    bgClass: 'bg-surface-container',
    borderClass: 'border-outline-variant',
  },
  BLOCKED: {
    icon: 'block',
    label: 'BLOCKED',
    textClass: 'text-error',
    bgClass: 'bg-error/10',
    borderClass: 'border-error/30',
  },
  APPROVED: {
    icon: 'verified',
    label: 'APPROVED',
    textClass: 'text-primary-container',
    bgClass: 'bg-primary-container/10',
    borderClass: 'border-primary-container/30',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, mode = 'chip' }) => {
  const cfg = CONFIG[status];
  const isSpinning = status === 'EXECUTING';

  if (mode === 'icon') {
    return (
      <span
        className={`material-symbols-outlined ${cfg.textClass} ${isSpinning ? 'animate-spin' : ''}`}
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
      >
        {cfg.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-xs py-0.5 rounded-DEFAULT border font-label-caps text-label-caps uppercase ${cfg.textClass} ${cfg.bgClass} ${cfg.borderClass}`}
    >
      <span
        className={`material-symbols-outlined ${isSpinning ? 'animate-spin' : ''}`}
        style={{ fontSize: '12px' }}
      >
        {cfg.icon}
      </span>
      {cfg.label}
    </span>
  );
};
