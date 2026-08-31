/**
 * src/ui/components/diagnosis/DiagnosisHeader.tsx
 *
 * Header for AI Diagnosis Workspace
 */
import React from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface DiagnosisHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DiagnosisHeader: React.FC<DiagnosisHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-ai-signal uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-ai-signal animate-pulse" />
            SALVO // AI DIAGNOSIS
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">MULTI-MODEL REASONING</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
          AI Recovery Diagnosis
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Understand why a payment failed, inspect decision evidence, and verify deterministic policy authorization before recovery execution.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#020626] border border-border-hairline">
          <span className="w-2 h-2 rounded-full bg-ai-signal animate-pulse" />
          <span className="font-mono text-xs text-ai-signal font-medium">LLM INFERENCE ACTIVE</span>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 rounded-[12px] h-9 text-xs font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-text-secondary'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}
      </div>
    </div>
  );
};
