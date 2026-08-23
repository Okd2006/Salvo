/**
 * OverviewScreen — Recovery Telemetry dashboard.
 *
 * Matches Stitch screen: "Overview | Salvo AI"
 * Demo values sourced from src/ui/data/demo.ts — replace with API data in later phases.
 */
import React from 'react';
import { CurrencyValue } from '../components/CurrencyValue.js';
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
    <main className="flex-1 p-xl flex flex-col gap-xl overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Page Header */}
      <div className="flex flex-col gap-xs mb-md">
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Recovery Telemetry
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Real-time analysis of systemic payment failures and autonomous recuperation vectors.
        </p>
      </div>

      {/* High-Density Metrics Spine — no cards, direct grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-outline-variant">
        {/* Total Failed Revenue */}
        <div className="py-lg pr-lg flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Total Failed Revenue
          </span>
          <CurrencyValue paise={DEMO_TOTAL_FAILED_PAISE} size="lg" variant="neutral" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Baseline failure volume over 30 days.
          </span>
        </div>

        {/* Recoverable Revenue */}
        <div className="py-lg px-lg border-l border-outline-variant flex flex-col gap-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-container/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Recoverable Revenue
            </span>
            <CurrencyValue paise={DEMO_RECOVERABLE_PAISE} size="lg" variant="recovered" />
            <div className="inline-flex items-center gap-xs bg-primary-container/10 border border-primary-container/20 px-sm py-1 rounded-DEFAULT w-max mt-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              <span className="font-label-caps text-label-caps text-primary-container uppercase">
                Active Optimization
              </span>
            </div>
          </div>
        </div>

        {/* Unrecoverable Revenue */}
        <div className="py-lg pl-lg border-l border-outline-variant flex flex-col gap-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-error/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Unrecoverable Revenue
            </span>
            <CurrencyValue paise={DEMO_UNRECOVERABLE_PAISE} size="lg" variant="risk" />
            <div className="inline-flex items-center gap-xs bg-error/10 border border-error/20 px-sm py-1 rounded-DEFAULT w-max mt-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-error" />
              <span className="font-label-caps text-label-caps text-error uppercase">
                Terminal State
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Recovery Trend Chart */}
      <div className="mt-lg">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            30-Day Recovery Performance
          </h2>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Cumulative Yield
          </span>
        </div>
        <div className="w-full h-[240px] border-y border-outline-variant relative flex items-end bg-surface-container-low/30">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-md pointer-events-none">
            <div className="w-full border-t border-outline-variant/30" />
            <div className="w-full border-t border-outline-variant/30" />
            <div className="w-full border-t border-outline-variant/30" />
            <div className="w-full border-t border-outline-variant/30" />
          </div>
          {/* SVG trend line */}
          <svg
            className="w-full h-full relative z-10 drop-shadow-md"
            preserveAspectRatio="none"
            viewBox="0 0 1000 240"
          >
            {/* Background dashed trendline */}
            <polyline
              fill="none"
              points="0,220 100,210 200,190 300,195 400,160 500,140 600,150 700,90 800,70 900,40 1000,20"
              stroke="#283643"
              strokeDasharray="4 4"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Primary recovery line */}
            <polyline
              fill="none"
              points="0,230 100,215 200,180 300,160 400,165 500,120 600,105 700,60 800,80 900,30 1000,10"
              stroke="#00c896"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Axis labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between px-xs py-xs text-[10px] font-metric-md text-on-surface-variant/50 pointer-events-none">
            <span>T-30</span>
            <span>T-15</span>
            <span>T-0 (LIVE)</span>
          </div>
        </div>
      </div>

      {/* Recovery Strategy Breakdown Table */}
      <div className="mt-lg mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Recovery Strategy Breakdown
          </h2>
          <button className="font-label-caps text-label-caps text-primary hover:text-primary-fixed transition-colors flex items-center gap-xs uppercase">
            Export CSV{' '}
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto border border-outline-variant rounded-DEFAULT bg-surface-container-lowest">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-high/50">
              <tr className="border-b border-outline-variant">
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold w-1/4">
                  Strategy Vector
                </th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold text-right w-1/4">
                  Affected Volume
                </th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold text-right w-1/4">
                  Potential Recovery
                </th>
                <th className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold text-right w-1/4">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/40">
              {DEMO_STRATEGIES.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-surface-container transition-colors duration-150 group cursor-pointer"
                  onClick={() => onNavigate?.('diagnosis')}
                >
                  <td className="py-md px-md border-r border-outline-variant/20">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary-container text-sm">
                        {s.icon}
                      </span>
                      <span className="font-medium text-on-surface group-hover:text-primary-container transition-colors">
                        {s.label}
                      </span>
                    </div>
                  </td>
                  <td className="py-md px-md text-right font-metric-md text-metric-md text-on-surface-variant border-r border-outline-variant/20">
                    {s.affectedVolume.toLocaleString('en-IN')}
                  </td>
                  <td className="py-md px-md text-right border-r border-outline-variant/20">
                    <CurrencyValue paise={s.potentialRecoveryPaise} variant="recovered" size="sm" />
                  </td>
                  <td className="py-md px-md text-right">
                    <div className="flex items-center justify-end gap-md">
                      <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-container"
                          style={{ width: `${s.successRate}%` }}
                        />
                      </div>
                      <span className="font-metric-md text-metric-md w-12 text-right">
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
    </main>
  );
};
