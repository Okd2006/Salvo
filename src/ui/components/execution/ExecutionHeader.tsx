/**
 * src/ui/components/execution/ExecutionHeader.tsx
 *
 * Header for Live Recovery Execution Console
 */
import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface ExecutionHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isExecuting?: boolean;
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  isExecuting = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-ai-signal uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-ai-signal" />
            SALVO // LIVE OPERATIONS
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">POLICY-GUARDED EXECUTION</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Recovery Execution Console
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Monitor and dispatch autonomous payment recoveries with real-time Razorpay Test Mode execution and deterministic policy gates.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-primary/10 border border-primary/30">
          <span className="w-2 h-2 rounded-full bg-ai-signal animate-pulse" />
          <span className="font-mono text-xs text-ai-signal font-semibold">
            LIVE CONTROL • RAZORPAY TEST MODE
          </span>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing || isExecuting}
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
