/**
 * ExecutionTimeline — signature component for the Live Execution screen.
 *
 * Renders a high-density financial execution ledger showing the autonomous pipeline:
 * QUEUED → POLICY CHECK → EXECUTING → RECOVERED / FAILED.
 *
 * Rules:
 *  - 35px border radius on container
 *  - 17px status badges
 *  - Tabular JetBrains Mono numerical alignment
 *  - Restrained animation on active executing threads
 */
import React from 'react';
import type { ExecutionRow } from '../data/demo.js';
import { StatusBadge } from './StatusBadge.js';
import { CurrencyValue } from './CurrencyValue.js';

export interface ExecutionTimelineProps {
  rows: ExecutionRow[];
  className?: string;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  rows,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface rounded-[35px] border border-border-hairline overflow-hidden flex flex-col ${className}`}
    >
      {/* Ledger Header */}
      <div className="grid grid-cols-[140px_1fr_140px_130px] gap-4 px-6 py-4 bg-[#03081A] border-b border-border-hairline items-center font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-semibold">
        <div>Timestamp</div>
        <div>Transaction ID</div>
        <div className="text-right">Amount</div>
        <div className="text-center">Pipeline State</div>
      </div>

      {/* Ledger Rows */}
      <div className="divide-y divide-border-hairline/40 flex flex-col">
        {rows.map((row, idx) => {
          const isRecovered = row.status === 'RECOVERED';
          const isFailed = row.status === 'FAILED';
          const isExecuting = row.status === 'EXECUTING';

          return (
            <div
              key={idx}
              className={`grid grid-cols-[140px_1fr_140px_130px] gap-4 px-6 py-3.5 hover:bg-surface-elevated transition-colors duration-150 items-center font-mono text-[13px] ${
                isExecuting ? 'bg-ai-signal/5 border-l-2 border-l-ai-signal' : ''
              } ${isFailed ? 'opacity-75' : ''}`}
            >
              {/* Timestamp */}
              <div className="text-text-tertiary text-xs">{row.timestamp}</div>

              {/* Transaction ID */}
              <div className="text-white font-medium truncate flex items-center gap-2">
                <span className="text-text-tertiary">#</span>
                <span>{row.txnId}</span>
              </div>

              {/* Amount */}
              <div className="text-right">
                <CurrencyValue
                  paise={row.amountPaise}
                  variant={isRecovered ? 'recovered' : isFailed ? 'risk' : 'neutral'}
                  size="sm"
                />
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <StatusBadge status={row.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
