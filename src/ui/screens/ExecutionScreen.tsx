/**
 * ExecutionScreen — Signature Live Execution Ledger.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - 35px architectural enclosures
 *  - 17px status chips
 *  - Real-time pipeline state telemetry (QUEUED → POLICY CHECK → EXECUTING → RECOVERED)
 *  - Strict financial color semantics (Recovered: #00C896, Failed: #FF6B4A)
 */
import React from 'react';
import { PageHeader } from '../components/PageHeader.js';
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

export const ExecutionScreen: React.FC<ExecutionScreenProps> = () => {
  const recoveredTotal = DEMO_EXECUTION_ROWS.filter((r) => r.status === 'RECOVERED').reduce(
    (s, r) => s + r.amountPaise,
    0
  );

  const inProgressTotal = DEMO_EXECUTION_ROWS.filter((r) =>
    ['EXECUTING', 'POLICY_CHECK', 'QUEUED'].includes(r.status)
  ).reduce((s, r) => s + r.amountPaise, 0);

  const failedTotal = DEMO_EXECUTION_ROWS.filter((r) => r.status === 'FAILED').reduce(
    (s, r) => s + r.amountPaise,
    0
  );

  return (
    <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto min-w-0 bg-[#03081A] text-white">
      <div className="max-w-[1280px] w-full mx-auto space-y-8">
        {/* Screen Header */}
        <PageHeader
          eyebrow="Autonomous Execution Feed"
          eyebrowVariant="ai"
          title="Live Execution"
          subtitle="Real-time autonomous transaction recovery operations, Razorpay API executions, and deterministic safety checks."
          actions={
            <div className="flex items-center gap-4 bg-surface border border-border-hairline px-5 py-2.5 rounded-[48px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ai-signal animate-pulse" />
                <span className="font-mono text-xs text-ai-signal font-semibold">LIVE PIPELINE</span>
              </div>
              <div className="h-3 w-[1px] bg-border-hairline" />
              <div className="font-mono text-xs text-text-tertiary">
                ACTIVE THREADS: <span className="text-white font-medium">{DEMO_ACTIVE_THREADS.toLocaleString('en-IN')}</span>
              </div>
            </div>
          }
        />

        {/* Real-time Summary Cards (35px Radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Recovered Amount */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                Recovered in Session
              </span>
              <span className="material-symbols-outlined text-recovered text-[20px]">
                check_circle
              </span>
            </div>
            <div>
              <CurrencyValue paise={recoveredTotal} size="xl" variant="recovered" prefix="+" />
              <p className="font-sans text-xs text-text-secondary mt-1">
                Settled through Razorpay smart retries & fallback routes
              </p>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>SUCCESS RATE</span>
              <span className="text-recovered font-medium">{DEMO_RECOVERY_RATE}%</span>
            </div>
          </div>

          {/* In Progress Amount */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                Pipeline In-Flight
              </span>
              <span className="material-symbols-outlined text-ai-signal text-[20px] animate-spin">
                sync
              </span>
            </div>
            <div>
              <CurrencyValue paise={inProgressTotal} size="xl" variant="neutral" />
              <p className="font-sans text-xs text-text-secondary mt-1">
                Queued, undergoing policy verification or gateway retry
              </p>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>PIPELINE STAGES</span>
              <span className="text-white font-medium">3 QUEUED / 1 EXECUTING</span>
            </div>
          </div>

          {/* Blocked / Terminal Failed Amount */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                Policy Blocked / Failed
              </span>
              <span className="material-symbols-outlined text-risk text-[20px]">
                block
              </span>
            </div>
            <div>
              <CurrencyValue paise={failedTotal} size="xl" variant="risk" />
              <p className="font-sans text-xs text-text-secondary mt-1">
                Hard declines & security gate policy protections
              </p>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>SAFETY GATE VERDICT</span>
              <span className="text-risk font-medium">1 TERMINAL DECLINE</span>
            </div>
          </div>
        </div>

        {/* Live Execution Timeline (Signature Interaction) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-ai-signal text-[20px]">
                table_rows
              </span>
              <h2 className="font-sans text-[20px] font-normal text-white">
                Live Transaction Execution Ledger
              </h2>
            </div>
            <span className="font-mono text-xs text-text-tertiary">
              AUTO-REFRESHING STREAM
            </span>
          </div>

          <ExecutionTimeline rows={DEMO_EXECUTION_ROWS} />
        </div>
      </div>
    </main>
  );
};
