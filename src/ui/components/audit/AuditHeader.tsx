/**
 * src/ui/components/audit/AuditHeader.tsx
 *
 * Header for Audit Trail / Compliance Ledger
 */
import React from 'react';
import { ScrollText, RefreshCw, Database, Download } from 'lucide-react';
import { Button } from '../ui/button.js';

export interface AuditHeaderProps {
  totalCount: number;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({
  totalCount,
  onRefresh,
  onExport,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] text-recovered uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5 text-recovered" />
            SALVO // COMPLIANCE LEDGER
          </span>
          <span className="text-border-secondary">•</span>
          <span className="font-mono text-[11px] text-text-tertiary">MONGODB IMMUTABLE LOGS</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Audit Trail
        </h1>
        <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
          Immutable operational records for every failure observation, AI diagnosis, deterministic policy evaluation, and gateway execution.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#020626] border border-border-hairline">
          <Database className="w-3.5 h-3.5 text-recovered" />
          <span className="font-mono text-xs text-white font-medium">
            {totalCount.toLocaleString('en-IN')} Records
          </span>
        </div>

        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-1.5 rounded-[12px] h-9 text-xs font-mono"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>
        )}

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
