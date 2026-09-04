/**
 * src/ui/components/dashboard/DashboardKpiGrid.tsx
 *
 * 6-Card Responsive KPI Grid rendering real metrics from GET /api/dashboard
 */
import React from 'react';
import {
  TrendingUp,
  Percent,
  AlertCircle,
  BrainCircuit,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import type { OverviewMetrics } from '../../lib/api.js';

export interface DashboardKpiGridProps {
  metrics: OverviewMetrics;
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ metrics }) => {
  const cards = [
    {
      id: 'recovered_value',
      label: 'Recovered Revenue',
      primaryContent: (
        <CurrencyValue
          paise={metrics.grossRecoveredPaise}
          size="lg"
          variant="recovered"
        />
      ),
      subtext: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
          <span>Net:</span>
          <CurrencyValue paise={metrics.netRecoveredPaise} size="sm" variant="neutral" />
          <span className="text-text-tertiary">after costs</span>
        </div>
      ),
      icon: TrendingUp,
      iconColor: 'text-recovered',
      accentBorder: 'hover:border-recovered/40',
      badge: `${(metrics.recoveryYield * 100).toFixed(1)}% Yield`,
      badgeVariant: 'bg-recovered/15 text-recovered border-recovered/30',
    },
    {
      id: 'recovery_rate',
      label: 'Recovery Rate',
      primaryContent: (
        <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {(metrics.netRecoveryRate * 100).toFixed(1)}%
        </div>
      ),
      subtext: (
        <div className="text-xs text-text-secondary font-sans">
          {metrics.successfulRecoveries.toLocaleString('en-IN')} successful autonomous recoveries
        </div>
      ),
      icon: Percent,
      iconColor: 'text-ai-signal',
      accentBorder: 'hover:border-ai-signal/40',
      badge: 'Autonomous',
      badgeVariant: 'bg-ai-signal/15 text-ai-signal border-ai-signal/30',
    },
    {
      id: 'failed_payments',
      label: 'Monitored Failures',
      primaryContent: (
        <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {metrics.totalMonitored.toLocaleString('en-IN')}
        </div>
      ),
      subtext: (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
          <span>Total Pool:</span>
          <CurrencyValue paise={metrics.totalFailedPaise} size="sm" variant="risk" />
        </div>
      ),
      icon: AlertCircle,
      iconColor: 'text-risk',
      accentBorder: 'hover:border-risk/40',
      badge: 'Declines',
      badgeVariant: 'bg-risk/15 text-risk border-risk/30',
    },
    {
      id: 'ai_diagnoses',
      label: 'AI Diagnoses & Confidence',
      primaryContent: (
        <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {(metrics.avgConfidence * 100).toFixed(1)}%
        </div>
      ),
      subtext: (
        <div className="text-xs text-text-secondary font-sans">
          Groq GPT-OSS multi-model reasoning confidence
        </div>
      ),
      icon: BrainCircuit,
      iconColor: 'text-primary',
      accentBorder: 'hover:border-primary/40',
      badge: 'LLM Active',
      badgeVariant: 'bg-primary/20 text-primary border-primary/40',
    },
    {
      id: 'policy_decisions',
      label: 'Policy Gate Enforcement',
      primaryContent: (
        <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {metrics.policyBlocks.toLocaleString('en-IN')}
        </div>
      ),
      subtext: (
        <div className="text-xs text-text-secondary font-sans">
          Fraud & terminal decline blocks enforced
        </div>
      ),
      icon: ShieldCheck,
      iconColor: 'text-recovered',
      accentBorder: 'hover:border-recovered/40',
      badge: 'Zero Risk Leak',
      badgeVariant: 'bg-recovered/15 text-recovered border-recovered/30',
    },
    {
      id: 'system_operations',
      label: 'Audit & Telemetry',
      primaryContent: (
        <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {metrics.auditEventsCount.toLocaleString('en-IN')}
        </div>
      ),
      subtext: (
        <div className="text-xs text-text-secondary font-sans">
          Immutable events written to MongoDB Atlas
        </div>
      ),
      icon: Zap,
      iconColor: 'text-ai-signal',
      accentBorder: 'hover:border-ai-signal/40',
      badge: 'Ledger Verified',
      badgeVariant: 'bg-surface-elevated text-text-secondary border-border-hairline',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className={`transition-all duration-200 border-border-hairline bg-[#020626]/95 ${card.accentBorder} group`}
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              {/* Card Header: Label & Icon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs text-text-secondary font-medium uppercase tracking-wider">
                  {card.label}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[9.5px] uppercase font-semibold px-2 py-0.5 rounded-[6px] border ${card.badgeVariant}`}
                  >
                    {card.badge}
                  </span>
                  <div className="w-8 h-8 rounded-[10px] bg-[#03081A] border border-border-hairline flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
              </div>

              {/* Primary Value */}
              <div className="mb-2">{card.primaryContent}</div>

              {/* Subtext Context */}
              <div className="pt-2 border-t border-border-hairline/60 mt-auto">
                {card.subtext}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
