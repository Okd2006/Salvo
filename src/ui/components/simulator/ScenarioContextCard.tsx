/**
 * src/ui/components/simulator/ScenarioContextCard.tsx
 *
 * Displays simulated transaction inputs and primary "Run Simulation" trigger
 */
import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Button } from '../ui/button.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { SCENARIOS, type DemoScenarioName } from './ScenarioSelector.js';

export interface ScenarioContextCardProps {
  scenario: DemoScenarioName;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const ScenarioContextCard: React.FC<ScenarioContextCardProps> = ({
  scenario,
  onRunSimulation,
  onReset,
  isSimulating,
}) => {
  const def = SCENARIOS.find((s) => s.id === scenario) || SCENARIOS[0];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-caution font-semibold uppercase">
                SCENARIO ARCHETYPE:
              </span>
              <CardTitle className="text-base font-bold text-white font-sans">
                {def.title}
              </CardTitle>
            </div>
            <p className="font-sans text-xs text-text-secondary mt-0.5">
              {def.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={isSimulating}
              className="rounded-[12px] gap-1.5 text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={onRunSimulation}
              disabled={isSimulating}
              className="rounded-[12px] gap-2 text-xs font-semibold px-5"
            >
              {isSimulating ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isSimulating ? 'Executing Pipeline...' : 'Run Simulation'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[16px] bg-[#03081A] border border-border-hairline">
          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Simulated Amount
            </span>
            <CurrencyValue paise={def.amountPaise} size="sm" variant="default" />
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Failure Code
            </span>
            <span className="font-mono text-xs font-semibold text-white truncate block">
              {def.errorCode}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Decline Category
            </span>
            <span className="font-sans text-xs font-medium text-text-secondary block">
              {def.category}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Expected Pipeline Result
            </span>
            <span className="font-mono text-xs font-semibold text-ai-signal block">
              {def.expectedOutcome}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
