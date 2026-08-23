/**
 * OverviewScreen — Recovery Telemetry Dashboard.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - Thin typography hierarchy (Page title: 42–48px light)
 *  - 35px architectural panels (`rounded-[35px] bg-surface border border-border-hairline`)
 *  - Strict financial color semantics (Recovered: #00C896, At Risk: #FF6B4A)
 *  - Monospace tabular numbers (JetBrains Mono via CurrencyValue)
 */
import React from 'react';
import { PageHeader } from '../components/PageHeader.js';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { Eyebrow } from '../components/Eyebrow.js';
import {
  DEMO_TOTAL_FAILED_PAISE,
  DEMO_RECOVERABLE_PAISE,
  DEMO_UNRECOVERABLE_PAISE,
  DEMO_STRATEGIES,
} from '../data/demo.js';
import { formatPercent } from '../../lib/currency.js';

interface OverviewScreenProps {
  onNavigate?: (tab: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto min-w-0 bg-[#03081A] text-white">
      <div className="max-w-[1280px] w-full mx-auto space-y-8">
        {/* Screen Header */}
        <PageHeader
          eyebrow="Autonomous Operations"
          eyebrowVariant="ai"
          title="Recovery Telemetry"
          subtitle="Real-time analysis of systemic payment failures and autonomous recuperation vectors across Razorpay infrastructure."
          actions={
            <button
              onClick={() => onNavigate?.('simulator')}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-[48px] text-sm font-medium transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">model_training</span>
              <span>Launch Simulator</span>
            </button>
          }
        />

        {/* High-Density Metrics Spine — 35px Architectural Surface Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Failed Revenue */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
                Total Failed Revenue
              </span>
              <span className="material-symbols-outlined text-text-tertiary text-[20px]">
                trending_down
              </span>
            </div>
            <div>
              <CurrencyValue paise={DEMO_TOTAL_FAILED_PAISE} size="xl" variant="neutral" />
              <p className="font-sans text-xs text-text-secondary mt-1">
                Baseline 30-day transaction failure volume
              </p>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>FAILURES ANALYZED</span>
              <span className="text-white font-medium">1,402 TXNS</span>
            </div>
          </div>

          {/* Recoverable Revenue */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
                Recoverable Revenue
              </span>
              <span className="material-symbols-outlined text-recovered text-[20px]">
                verified
              </span>
            </div>
            <div>
              <CurrencyValue paise={DEMO_RECOVERABLE_PAISE} size="xl" variant="recovered" />
              <div className="mt-2">
                <Eyebrow variant="recovered" dot={true}>
                  Active Recuperation Target (65.8%)
                </Eyebrow>
              </div>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>PROJECTED NET GAIN</span>
              <span className="text-recovered font-medium">+₹84.50L</span>
            </div>
          </div>

          {/* Unrecoverable Revenue */}
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
                Unrecoverable Deficit
              </span>
              <span className="material-symbols-outlined text-risk text-[20px]">
                block
              </span>
            </div>
            <div>
              <CurrencyValue paise={DEMO_UNRECOVERABLE_PAISE} size="xl" variant="risk" />
              <p className="font-sans text-xs text-text-secondary mt-1">
                Fraud blocks, expired cards & terminal declines
              </p>
            </div>
            <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span>POLICY BLOCKED</span>
              <span className="text-risk font-medium">34.2% ISOLATED</span>
            </div>
          </div>
        </div>

        {/* 30-Day Recovery Performance Chart */}
        <div className="bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[22px] font-normal text-white">
                30-Day Cumulative Recovery Yield
              </h2>
              <p className="font-sans text-xs text-text-secondary">
                Autonomous intervention yield vs. merchant baseline decline trajectory
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-recovered rounded-full" />
                <span className="text-text-secondary">Recovered Yield</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-border-secondary rounded-full" />
                <span className="text-text-tertiary">Baseline Churn</span>
              </div>
            </div>
          </div>

          {/* SVG Technical Grid Chart */}
          <div className="w-full h-[220px] rounded-[20px] bg-[#03081A] border border-border-hairline relative flex items-end p-4">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-30">
              <div className="w-full border-t border-border-hairline" />
              <div className="w-full border-t border-border-hairline" />
              <div className="w-full border-t border-border-hairline" />
            </div>

            {/* Vector Lines */}
            <svg
              className="w-full h-full relative z-10"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
            >
              {/* Baseline Churn */}
              <polyline
                fill="none"
                points="0,180 100,175 200,160 300,165 400,135 500,120 600,130 700,80 800,60 900,35 1000,15"
                stroke="#4D5499"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Salvo Recovered Line */}
              <polyline
                fill="none"
                points="0,190 100,178 200,150 300,130 400,140 500,95 600,85 700,45 800,60 900,22 1000,8"
                stroke="#00C896"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Axis Timestamps */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] font-mono text-text-tertiary pointer-events-none">
              <span>T-30 DAYS</span>
              <span>T-15 DAYS</span>
              <span>T-7 DAYS</span>
              <span className="text-recovered font-medium">T-0 (LIVE TELEMETRY)</span>
            </div>
          </div>
        </div>

        {/* Recovery Strategy Matrix Ledger */}
        <div className="bg-surface border border-border-hairline rounded-[35px] overflow-hidden flex flex-col">
          <div className="px-6 lg:px-8 py-5 border-b border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#03081A]/50">
            <div>
              <h2 className="font-sans text-[20px] font-normal text-white">
                Algorithmic Recovery Breakdown
              </h2>
              <p className="font-sans text-xs text-text-secondary">
                Diagnosis breakdown across Razorpay payment decline vectors
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('diagnosis')}
              className="font-mono text-xs text-ai-signal hover:underline uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explain with Gemini AI</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border-hairline bg-[#03081A] font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-semibold">
                  <th className="py-4 px-6 lg:px-8">Recovery Vector</th>
                  <th className="py-4 px-6 text-right">Affected Volume</th>
                  <th className="py-4 px-6 text-right">Potential Yield</th>
                  <th className="py-4 px-6 lg:px-8 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline/40 font-sans text-sm">
                {DEMO_STRATEGIES.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onNavigate?.('diagnosis')}
                    className="hover:bg-surface-elevated transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="py-4 px-6 lg:px-8">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-[10px] bg-[#03081A] border border-border-hairline flex items-center justify-center text-ai-signal group-hover:border-ai-signal transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            {s.icon}
                          </span>
                        </div>
                        <span className="font-medium text-white group-hover:text-ai-signal transition-colors">
                          {s.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-text-secondary text-sm">
                      {s.affectedVolume.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <CurrencyValue
                        paise={s.potentialRecoveryPaise}
                        variant="recovered"
                        size="sm"
                      />
                    </td>
                    <td className="py-4 px-6 lg:px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 h-1.5 bg-[#03081A] rounded-full overflow-hidden border border-border-hairline">
                          <div
                            className="h-full bg-recovered rounded-full"
                            style={{ width: `${s.successRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-white w-12 text-right">
                          {formatPercent(s.successRate / 100)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};
