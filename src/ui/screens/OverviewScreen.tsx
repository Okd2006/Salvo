import React from 'react';
import { formatPaise } from '../../lib/currency.js';

interface OverviewScreenProps {
  onNavigate?: (tab: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 p-xl flex flex-col gap-xl overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Page Header */}
      <div className="flex flex-col gap-xs mb-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Recovery Telemetry</h1>
          <button
            onClick={() => onNavigate?.('launch')}
            className="flex items-center gap-xs px-md py-sm bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface rounded-DEFAULT text-body-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">rocket_launch</span>
            <span>View Launch Story</span>
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Real-time analysis of systemic payment failures and autonomous recuperation vectors.
        </p>
      </div>

      {/* High-Density Metrics Spine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-outline-variant">
        {/* Total Failed Revenue */}
        <div className="py-lg pr-lg flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Total Failed Revenue
            </span>
          </div>
          <span className="font-metric-lg text-metric-lg text-on-surface">
            {formatPaise(1284590000)}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Baseline failure volume over 30 days.
          </span>
        </div>

        {/* Recoverable Revenue */}
        <div className="py-lg px-lg border-l border-outline-variant flex flex-col gap-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-sm">
            <div className="flex items-center gap-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Recoverable Revenue
              </span>
            </div>
            <span className="font-metric-lg text-metric-lg text-primary">
              {formatPaise(845021000)}
            </span>
            <div className="inline-flex items-center gap-xs bg-primary/10 border border-primary/20 px-sm py-1 rounded-DEFAULT w-max mt-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-label-caps text-label-caps text-primary uppercase">
                Active Optimization
              </span>
            </div>
          </div>
        </div>

        {/* Realized Recovery Rate */}
        <div className="py-lg pl-lg border-l border-outline-variant flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Realized Recovery Rate
            </span>
          </div>
          <span className="font-metric-lg text-metric-lg text-on-surface">65.7%</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            +12.4% vs baseline retries.
          </span>
        </div>
      </div>

      {/* Grid Layout: Diagnostic Strategies & Real-time Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Diagnostic Vectors (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Diagnostic Strategy Matrix
            </h2>
            <button
              onClick={() => onNavigate?.('diagnosis')}
              className="font-label-caps text-label-caps text-primary hover:underline uppercase"
            >
              Analyze in Deep Chat →
            </button>
          </div>

          <div className="space-y-md">
            {/* Strategy Row 1 */}
            <div
              onClick={() => onNavigate?.('diagnosis')}
              className="bg-surface-container border border-outline-variant rounded-lg p-md hover:border-primary/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-md"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">refresh</span>
                </div>
                <div>
                  <div className="font-headline-sm text-base font-semibold text-on-surface">Smart Retry Engine</div>
                  <div className="font-body-sm text-on-surface-variant">
                    Transient network drops & bank gateway timeouts
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-lg">
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-primary">{formatPaise(48235000)}</div>
                  <div className="font-label-caps text-xs text-on-surface-variant uppercase">82% Recoverability</div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            </div>

            {/* Strategy Row 2 */}
            <div
              onClick={() => onNavigate?.('simulator')}
              className="bg-surface-container border border-outline-variant rounded-lg p-md hover:border-primary/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-md"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded bg-tertiary-container/10 border border-tertiary-container/20 flex items-center justify-center text-tertiary-container shrink-0">
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div>
                  <div className="font-headline-sm text-base font-semibold text-on-surface">Payment Link Switch</div>
                  <div className="font-body-sm text-on-surface-variant">
                    Issuer card limits & insufficient balance redirects
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-lg">
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-on-surface">{formatPaise(24110000)}</div>
                  <div className="font-label-caps text-xs text-on-surface-variant uppercase">64% Recoverability</div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            </div>

            {/* Strategy Row 3 */}
            <div
              onClick={() => onNavigate?.('execution')}
              className="bg-surface-container border border-outline-variant rounded-lg p-md hover:border-primary/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-md"
            >
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div>
                  <div className="font-headline-sm text-base font-semibold text-on-surface">Customer Re-engagement</div>
                  <div className="font-body-sm text-on-surface-variant">
                    Expired mandate reminders & 2FA retry prompts
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-lg">
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-on-surface">{formatPaise(12157000)}</div>
                  <div className="font-label-caps text-xs text-on-surface-variant uppercase">41% Recoverability</div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Recovery Telemetry Panel (1 col) */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-md flex flex-col gap-md">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">
                Live Execution Stream
              </h3>
            </div>
            <button
              onClick={() => onNavigate?.('execution')}
              className="font-label-caps text-xs text-primary hover:underline uppercase"
            >
              View All →
            </button>
          </div>

          <div className="space-y-sm flex-1">
            <div className="p-sm bg-surface-container-high rounded border border-outline-variant flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-primary font-semibold">pay_NpX8172k</div>
                <div className="font-body-sm text-xs text-on-surface-variant">Smart Retry executed</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-primary">{formatPaise(840000)}</div>
                <div className="font-label-caps text-[10px] text-primary uppercase">SUCCESS</div>
              </div>
            </div>

            <div className="p-sm bg-surface-container-high rounded border border-outline-variant flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-on-surface font-semibold">pay_MpK9921b</div>
                <div className="font-body-sm text-xs text-on-surface-variant">Payment link created</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-on-surface">{formatPaise(1450000)}</div>
                <div className="font-label-caps text-[10px] text-tertiary-container uppercase">QUEUED</div>
              </div>
            </div>

            <div className="p-sm bg-surface-container-high rounded border border-outline-variant flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-on-surface font-semibold">pay_LpQ4412z</div>
                <div className="font-body-sm text-xs text-on-surface-variant">Policy gate check</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-on-surface">{formatPaise(320000)}</div>
                <div className="font-label-caps text-[10px] text-primary uppercase">APPROVED</div>
              </div>
            </div>

            <div className="p-sm bg-surface-container-high rounded border border-outline-variant flex items-center justify-between opacity-75">
              <div>
                <div className="font-mono text-xs text-on-surface-variant font-semibold">pay_JpA1109m</div>
                <div className="font-body-sm text-xs text-on-surface-variant">Unrecoverable fraud block</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-risk">{formatPaise(4500000)}</div>
                <div className="font-label-caps text-[10px] text-risk uppercase">BLOCKED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
