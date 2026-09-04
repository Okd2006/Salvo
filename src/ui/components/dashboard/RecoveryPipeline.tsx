/**
 * src/ui/components/dashboard/RecoveryPipeline.tsx
 *
 * Operational Stage Funnel Visualization:
 * FAILED -> DIAGNOSED -> POLICY APPROVED -> EXECUTED -> RECOVERED
 */
import React from 'react';
import { AlertCircle, BrainCircuit, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import type { OverviewMetrics } from '../../lib/api.js';

export interface RecoveryPipelineProps {
  metrics: OverviewMetrics;
}

export const RecoveryPipeline: React.FC<RecoveryPipelineProps> = ({ metrics }) => {
  const total = metrics.totalMonitored || 1;
  const diagnosedCount = total;
  const approvedCount = Math.max(0, total - metrics.policyBlocks);
  const executedCount = approvedCount;
  const recoveredCount = metrics.successfulRecoveries;

  const stages = [
    {
      id: 'failed',
      label: '1. FAILED',
      title: 'Payment Decline',
      count: total,
      subtext: 'Observed Transactions',
      icon: AlertCircle,
      color: 'text-risk',
      bg: 'bg-risk/10',
      border: 'border-risk/30',
      rate: '100%',
    },
    {
      id: 'diagnosed',
      label: '2. DIAGNOSED',
      title: 'AI Root Cause',
      count: diagnosedCount,
      subtext: `${(metrics.avgConfidence * 100).toFixed(0)}% Avg Confidence`,
      icon: BrainCircuit,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      rate: '100%',
    },
    {
      id: 'approved',
      label: '3. POLICY GATE',
      title: 'Safety Invariant',
      count: approvedCount,
      subtext: `${metrics.policyBlocks} Blocked (Risk)`,
      icon: ShieldCheck,
      color: 'text-ai-signal',
      bg: 'bg-ai-signal/10',
      border: 'border-ai-signal/30',
      rate: `${((approvedCount / total) * 100).toFixed(0)}% Pass`,
    },
    {
      id: 'executed',
      label: '4. EXECUTED',
      title: 'Razorpay Action',
      count: executedCount,
      subtext: 'API Dispatch Links',
      icon: Zap,
      color: 'text-caution',
      bg: 'bg-caution/10',
      border: 'border-caution/30',
      rate: '100%',
    },
    {
      id: 'recovered',
      label: '5. RECOVERED',
      title: 'Revenue Saved',
      count: recoveredCount,
      subtext: (
        <CurrencyValue paise={metrics.grossRecoveredPaise} size="sm" variant="recovered" />
      ),
      icon: CheckCircle2,
      color: 'text-recovered',
      bg: 'bg-recovered/10',
      border: 'border-recovered/30',
      rate: `${(metrics.netRecoveryRate * 100).toFixed(1)}% Yield`,
    },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-ai-signal" />
              <span>Autonomous Recovery Pipeline Funnel</span>
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary mt-0.5">
              Live progression of failed payment flows across observation, LLM reasoning, deterministic policy gates, and gateway execution.
            </CardDescription>
          </div>
          <div className="font-mono text-xs text-recovered bg-recovered/10 px-2.5 py-1 rounded-[8px] border border-recovered/30 font-semibold self-start sm:self-auto">
            {(metrics.netRecoveryRate * 100).toFixed(1)}% End-to-End Conversion
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stages.map((st) => {
            const Icon = st.icon;
            
            return (
              <div
                key={st.id}
                className={`p-4 rounded-[16px] bg-[#03081A] border ${st.border} flex flex-col justify-between relative transition-all hover:scale-[1.02]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                      {st.label}
                    </span>
                    <div className={`p-1.5 rounded-[8px] ${st.bg} ${st.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="font-sans text-sm font-semibold text-white mb-1">
                    {st.title}
                  </div>

                  <div className="font-mono text-xl font-bold text-white">
                    {typeof st.count === 'number' ? st.count.toLocaleString('en-IN') : st.count}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border-hairline/60 flex items-center justify-between text-xs">
                  <span className="text-text-secondary text-[11px] truncate">{st.subtext}</span>
                  <span className={`font-mono text-[11px] font-semibold ${st.color}`}>
                    {st.rate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
