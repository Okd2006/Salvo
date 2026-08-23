/**
 * ExecutionScreen — Live Execution timeline.
 *
 * Matches Stitch screen: "Live Execution | Salvo AI"
 * Shows a real-time grid table of recovery operations.
 *
 * Demo data from demo.ts. Wire to real WebSocket/SSE stream in later phases.
 */
import React from 'react';
import { ExecutionTimeline } from '../components/ExecutionTimeline.js';
import { CurrencyValue } from '../components/CurrencyValue.js';
import {
  DEMO_EXECUTION_ROWS,
  DEMO_ACTIVE_THREADS,
  DEMO_RECOVERY_RATE,
} from '../data/demo.js';

interface ExecutionScreenProps {
  onNavigate?: (tab: string) => void;
}

export const ExecutionScreen: React.FC<ExecutionScreenProps> = ({ onNavigate: _onNavigate }) => {
  return (
    <main className="flex-1 overflow-y-auto p-lg bg-background text-on-surface">
      <div className="max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-lg flex justify-between items-end border-b border-outline-variant pb-sm">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">
              Live Execution
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Real-time recovery operations and status.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                Active Threads
              </p>
              <p className="font-metric-md text-metric-md text-primary">
                {DEMO_ACTIVE_THREADS.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                Recovery Rate
              </p>
              <p className="font-metric-md text-metric-md text-on-surface">
                {DEMO_RECOVERY_RATE}%
              </p>
            </div>
          </div>
        </div>

        {/* Live Timeline */}
        <ExecutionTimeline rows={DEMO_EXECUTION_ROWS} />

        {/* Summary footer */}
        <div className="mt-lg grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Recovered
            </span>
            <CurrencyValue
              paise={DEMO_EXECUTION_ROWS.filter((r) => r.status === 'RECOVERED').reduce(
                (s, r) => s + r.amountPaise,
                0
              )}
              variant="recovered"
              size="lg"
            />
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              In Progress
            </span>
            <CurrencyValue
              paise={DEMO_EXECUTION_ROWS.filter((r) =>
                ['EXECUTING', 'POLICY_CHECK', 'QUEUED'].includes(r.status)
              ).reduce((s, r) => s + r.amountPaise, 0)}
              variant="neutral"
              size="lg"
            />
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Failed
            </span>
            <CurrencyValue
              paise={DEMO_EXECUTION_ROWS.filter((r) => r.status === 'FAILED').reduce(
                (s, r) => s + r.amountPaise,
                0
              )}
              variant="risk"
              size="lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
};
