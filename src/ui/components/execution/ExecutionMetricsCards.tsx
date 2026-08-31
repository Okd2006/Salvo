/**
 * src/ui/components/execution/ExecutionMetricsCards.tsx
 *
 * Real-time operational metric cards for live execution
 */
import React from 'react';
import { CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import type { OverviewMetrics } from '../../lib/api.js';

export interface ExecutionMetricsCardsProps {
  metrics: OverviewMetrics | null;
  isExecuting: boolean;
}

export const ExecutionMetricsCards: React.FC<ExecutionMetricsCardsProps> = ({
  metrics,
  isExecuting,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Total Recovered */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Recovered in Session
            </span>
            <CheckCircle2 className="w-4 h-4 text-recovered" />
          </div>

          <div>
            <CurrencyValue
              paise={metrics?.grossRecoveredPaise || 0}
              size="lg"
              variant="recovered"
              prefix="+"
            />
            <p className="font-sans text-xs text-text-secondary mt-1">
              Settled via Razorpay smart retries & payment links
            </p>
          </div>

          <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
            <span>RECOVERY YIELD</span>
            <span className="text-recovered font-semibold">
              {metrics?.recoveryYield ? metrics.recoveryYield.toFixed(1) : '0.0'}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Pipeline State */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Pipeline State
            </span>
            <Zap className={`w-4 h-4 text-ai-signal ${isExecuting ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <div className="font-mono text-sm font-bold text-ai-signal uppercase tracking-wider truncate">
              {isExecuting ? 'EXECUTING AUTONOMOUS RECOVERY' : 'ENGINE STANDBY • ARMED'}
            </div>
            <p className="font-sans text-xs text-text-secondary mt-1">
              {isExecuting
                ? 'Active transaction processing through Razorpay Test API'
                : 'Deterministic policy gate active and listening'}
            </p>
          </div>

          <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
            <span>DISPATCH MODE</span>
            <span className="text-ai-signal font-semibold">RAZORPAY TEST API</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Policy Blocks */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Deterministic Policy Blocks
            </span>
            <ShieldCheck className="w-4 h-4 text-recovered" />
          </div>

          <div>
            <div className="font-mono text-2xl font-bold text-risk">
              {metrics?.policyBlocks || 0}
            </div>
            <p className="font-sans text-xs text-text-secondary mt-1">
              Suspected fraud & terminal decline isolations
            </p>
          </div>

          <div className="pt-2 border-t border-border-hairline/60 flex items-center justify-between text-xs font-mono text-text-tertiary">
            <span>ZERO RISK LEAK</span>
            <span className="text-recovered font-semibold">100% ENFORCED</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
