/**
 * src/ui/components/launch/LaunchActions.tsx
 *
 * Bottom action CTA bar with direct routes across all Salvo features
 */
import React from 'react';
import { LayoutDashboard, BrainCircuit, Sliders, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card.js';
import { Button } from '../ui/button.js';

export interface LaunchActionsProps {
  onNavigate?: (route: string) => void;
}

export const LaunchActions: React.FC<LaunchActionsProps> = ({ onNavigate }) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-base font-bold text-white">
            Ready to Explore Salvo Autonomous Recovery?
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Launch into any workspace in the platform to investigate failures, evaluate safety, or run live test execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('overview')}
            className="rounded-[12px] gap-1.5 text-xs font-mono"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('diagnosis')}
            className="rounded-[12px] gap-1.5 text-xs font-mono"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Diagnosis</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('simulator')}
            className="rounded-[12px] gap-1.5 text-xs font-mono"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </Button>

          <Button
            variant="glow"
            size="sm"
            onClick={() => onNavigate?.('execution')}
            className="rounded-[12px] gap-1.5 text-xs font-semibold"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Execution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
