/**
 * src/ui/components/simulator/ScenarioComparisonTable.tsx
 *
 * Side-by-side comparison table of all 6 deterministic scenarios
 */
import React from 'react';
import { Sliders, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { SCENARIOS, type DemoScenarioName } from './ScenarioSelector.js';

export interface ScenarioComparisonTableProps {
  onSelectScenario: (scenario: DemoScenarioName) => void;
}

export const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({
  onSelectScenario,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sliders className="w-4 h-4 text-ai-signal" />
          <span>Deterministic Scenario Comparison Matrix</span>
        </CardTitle>
        <CardDescription className="text-xs text-text-secondary mt-0.5">
          Demonstrates how Salvo adaptively routes failure vectors through LLM reasoning, deterministic policy gates, and automated fallbacks.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border-hairline bg-[#03081A] font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary font-semibold">
              <th className="py-3 px-5">Scenario</th>
              <th className="py-3 px-4">Failure Vector</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Policy Gate</th>
              <th className="py-3 px-4">Outcome</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline/50 font-sans text-xs">
            {SCENARIOS.map((sc) => (
              <tr
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className="hover:bg-surface-elevated transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5 font-medium text-white group-hover:text-primary transition-colors">
                  {sc.title}
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary">
                  {sc.errorCode}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <CurrencyValue paise={sc.amountPaise} size="xs" variant="default" />
                </td>

                <td className="py-3.5 px-4">
                  <Badge variant={sc.expectedVerdict === 'approved' ? 'success' : 'destructive'} className="text-[9.5px]">
                    {sc.expectedVerdict.toUpperCase()}
                  </Badge>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      sc.expectedStatus === 'recovered'
                        ? 'text-recovered'
                        : sc.expectedStatus === 'blocked'
                        ? 'text-risk'
                        : 'text-caution'
                    }`}
                  >
                    {sc.expectedStatus.toUpperCase()}
                  </span>
                </td>

                <td className="py-3.5 px-5 text-right">
                  <span className="font-mono text-[11px] text-primary group-hover:underline inline-flex items-center gap-1 font-semibold">
                    <span>Simulate</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
