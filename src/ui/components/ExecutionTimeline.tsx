/**
 * ExecutionTimeline — signature component for the Live Execution screen.
 *
 * Renders a ledger-style grid table of recovery operations showing the
 * QUEUED → POLICY_CHECK → EXECUTING → RECOVERED / FAILED flow.
 *
 * This component is intentionally visual-only. It accepts rows as props
 * and has no internal API calls. Wire it to real data in a later phase.
 */
import React from 'react';
import type { ExecutionRow } from '../data/demo.js';
import { StatusBadge } from './StatusBadge.js';
import { CurrencyValue } from './CurrencyValue.js';

interface ExecutionTimelineProps {
  rows: ExecutionRow[];
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ rows }) => {
  return (
    <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="grid grid-cols-[130px_1fr_130px_56px] gap-sm px-md py-sm bg-surface-container-low border-b border-outline-variant items-center">
        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
          Timestamp
        </div>
        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
          Transaction ID
        </div>
        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
          Amount
        </div>
        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase text-center">
          Status
        </div>
      </div>

      {/* Timeline Rows */}
      <div className="flex flex-col">
        {rows.map((row, idx) => {
          const isRecovered = row.status === 'RECOVERED';
          const isFailed = row.status === 'FAILED';
          const isExecuting = row.status === 'EXECUTING';

          return (
            <div
              key={idx}
              className={`grid grid-cols-[130px_1fr_130px_56px] gap-sm px-md py-sm border-b border-outline-variant/50 hover:bg-surface-container-highest transition-colors items-center ${
                isFailed ? 'opacity-70' : ''
              } ${isExecuting ? 'bg-surface-container-low/30' : ''}`}
            >
              <div className="font-metric-md text-metric-md text-on-surface-variant text-sm">
                {row.timestamp}
              </div>
              <div
                className={`font-metric-md text-metric-md text-sm truncate ${
                  isFailed ? 'text-on-surface opacity-70' : 'text-on-surface'
                }`}
              >
                {row.txnId}
              </div>
              <div className="text-right">
                <CurrencyValue
                  paise={row.amountPaise}
                  variant={isRecovered ? 'recovered' : isFailed ? 'risk' : 'neutral'}
                  size="sm"
                />
              </div>
              <div className="flex justify-center">
                <StatusBadge status={row.status} mode="icon" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
