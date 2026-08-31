/**
 * src/ui/components/audit/TransactionInvestigationTimeline.tsx
 *
 * Chronological investigation chain for a single transaction
 */
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import type { AuditLogDocument } from '../../../types/index.js';

export interface TransactionInvestigationTimelineProps {
  transactionId: string;
  logs: AuditLogDocument[];
  onClear: () => void;
}

export const TransactionInvestigationTimeline: React.FC<TransactionInvestigationTimelineProps> = ({
  transactionId,
  logs,
  onClear,
}) => {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Card className="border-primary/40 bg-[#020626]/95 ring-1 ring-primary/30">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60 bg-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Transaction Investigation Chain:</span>
                <span className="font-mono text-ai-signal">{transactionId}</span>
              </CardTitle>
            </div>
            <p className="font-sans text-xs text-text-secondary mt-0.5">
              Complete chronological audit sequence ({sorted.length} recorded events).
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-8 text-xs font-mono gap-1 text-text-secondary hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Investigation</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {sorted.map((log, idx) => {
          const isBlocked = log.eventType.includes('blocked') || (log.details?.allowed === false);
          const isApproved = log.eventType.includes('approved') || (log.details?.allowed === true);

          return (
            <div
              key={log.eventId}
              className="p-3.5 rounded-[12px] bg-[#03081A] border border-border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold uppercase">
                      {log.eventType.replace(/_/g, ' ')}
                    </span>
                    <Badge
                      variant={isBlocked ? 'destructive' : isApproved ? 'success' : 'secondary'}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {log.actor}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()} • Event ID: {log.eventId}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary sm:text-right max-w-sm">
                {(log.details?.reasonCode as string) ||
                  (log.details?.reason as string) ||
                  (log.details?.strategy as string) ||
                  'Audit event recorded in MongoDB.'}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
