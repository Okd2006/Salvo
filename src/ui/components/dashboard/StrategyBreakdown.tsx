/**
 * src/ui/components/dashboard/StrategyBreakdown.tsx
 *
 * Visualization of recovery strategy distribution from GET /api/dashboard
 */
import React from 'react';
import { Sliders, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { formatPercent } from '../../../lib/currency.js';
import type { OverviewMetrics } from '../../lib/api.js';

export interface StrategyBreakdownProps {
  strategies: OverviewMetrics['strategies'];
  onNavigate?: (route: string) => void;
}

export const StrategyBreakdown: React.FC<StrategyBreakdownProps> = ({
  strategies,
  onNavigate,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Recovery Strategy Distribution</span>
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary mt-0.5">
              Targeted remediation vectors selected based on failure archetype & policy rules.
            </CardDescription>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('diagnosis')}
              className="text-xs font-mono text-ai-signal hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explain in AI Diagnosis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-y border-border-hairline bg-[#03081A] font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary font-semibold">
              <th className="py-3 px-6">Strategy Vector</th>
              <th className="py-3 px-4 text-right">Affected Volume</th>
              <th className="py-3 px-4 text-right">Potential Yield</th>
              <th className="py-3 px-6 text-right">Success Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline/50 font-sans text-xs">
            {strategies.map((s) => (
              <tr
                key={s.id}
                onClick={() => onNavigate?.('diagnosis')}
                className="hover:bg-surface-elevated transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-[8px] bg-[#03081A] border border-border-hairline flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white group-hover:text-primary transition-colors block">
                        {s.label}
                      </span>
                      <span className="font-mono text-[10px] text-text-tertiary">
                        strategy: {s.strategy}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right font-mono text-text-secondary">
                  {s.affectedVolume.toLocaleString('en-IN')}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <CurrencyValue paise={s.potentialRecoveryPaise} variant="recovered" size="sm" />
                </td>

                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="w-20 h-1.5 bg-[#03081A] rounded-full overflow-hidden border border-border-hairline">
                      <div
                        className="h-full bg-recovered rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, s.successRate))}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white font-medium w-12 text-right">
                      {formatPercent(s.successRate / 100)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
