/**
 * src/ui/components/launch/LaunchHeader.tsx
 *
 * Header for Autonomous Recovery Engine / Platform Architecture
 */
import React from 'react';
import { Rocket, Sliders, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface LaunchHeaderProps {
  onNavigate?: (route: string) => void;
  systemHealthy?: boolean;
}

export const LaunchHeader: React.FC<LaunchHeaderProps> = ({
  onNavigate,
  systemHealthy = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[11px] text-ai-signal uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-ai-signal" />
            SALVO // AUTONOMOUS ENGINE
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">PLATFORM ARCHITECTURE</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Autonomous Recovery Engine
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          A policy-governed intelligence layer for autonomously diagnosing, authorizing, recovering, and auditing failed payment flows.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#020626] border border-border-hairline">
          <span className={`w-2 h-2 rounded-full ${systemHealthy ? 'bg-recovered animate-pulse' : 'bg-risk'}`} />
          <span className="font-mono text-xs text-white font-medium">
            {systemHealthy ? 'SYSTEM OPERATIONAL' : 'SYSTEM DEGRADED'}
          </span>
        </div>

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
          variant="glow"
          size="sm"
          onClick={() => onNavigate?.('simulator')}
          className="rounded-[12px] gap-1.5 text-xs font-semibold px-4"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Run Simulator</span>
        </Button>
      </div>
    </div>
  );
};
