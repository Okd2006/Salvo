/**
 * src/ui/components/simulator/SimulatorHeader.tsx
 *
 * Header for Recovery Simulation Lab
 */
import React from 'react';
import { RefreshCw, FlaskConical } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface SimulatorHeaderProps {
  onReset?: () => void;
  isSimulating?: boolean;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({
  onReset,
  isSimulating = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-caution uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-caution" />
            SALVO // SIMULATION LAB
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">DETERMINISTIC TEST SUITE</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Recovery Simulation Lab
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Test autonomous payment recovery against 6 deterministic failure scenarios without touching production traffic.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-caution/10 border border-caution/30">
          <span className="w-2 h-2 rounded-full bg-caution animate-pulse" />
          <span className="font-mono text-xs text-caution font-semibold">TEST MODE • ISOLATED</span>
        </div>

        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isSimulating}
            className="gap-1.5 rounded-[12px] h-9 text-xs font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-primary' : 'text-text-secondary'}`} />
            <span>Reset Lab</span>
          </Button>
        )}
      </div>
    </div>
  );
};
