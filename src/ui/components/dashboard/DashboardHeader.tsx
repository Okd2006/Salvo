/**
 * src/ui/components/dashboard/DashboardHeader.tsx
 *
 * Command Center Header with real-time status and refresh control
 */
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface DashboardHeaderProps {
  systemHealthy: boolean;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  systemHealthy,
  lastUpdated,
  isRefreshing,
  onRefresh,
}) => {
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      {/* Title & Eyebrow */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-ai-signal uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
            SALVO // RECOVERY CONTROL
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">RAZORPAY TESTNET</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Payment Recovery Command Center
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Autonomous recovery intelligence for failed payment flows. Real-time diagnosis, policy-controlled execution, and cryptographic audit.
        </p>
      </div>

      {/* System Status & Actions */}
      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        {/* Real-time Health Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#020626] border border-border-hairline">
          {systemHealthy ? (
            <>
              <span className="w-2 h-2 rounded-full bg-recovered animate-pulse" />
              <span className="font-mono text-xs text-recovered font-medium">HEALTHY</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-risk animate-pulse" />
              <span className="font-mono text-xs text-risk font-medium">DEGRADED</span>
            </>
          )}
          <span className="text-border-hairline">|</span>
          <span className="font-mono text-[10px] text-text-tertiary">{formattedTime} UTC</span>
        </div>

        {/* Manual Refresh Button */}
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
      </div>
    </div>
  );
};
