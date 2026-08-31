/**
 * src/ui/components/audit/AuditTable.tsx
 *
 * Primary tabular view for immutable compliance audit logs
 */
import React from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import type { AuditLogDocument } from '../../../types/index.js';

export interface AuditTableProps {
  logs: AuditLogDocument[];
  expandedEventId: string | null;
  onToggleExpand: (id: string) => void;
  onSelectTransaction?: (txnId: string) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  expandedEventId,
  onToggleExpand,
  onSelectTransaction,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-border-hairline bg-[#03081A] font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary font-semibold">
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Subsystem Actor</th>
              <th className="py-3 px-4">Result / Rule</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline/40 font-mono text-xs">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-tertiary font-mono">
                  No compliance audit records match the selected filters.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedEventId === log.eventId;
                const d = new Date(log.timestamp);
                const timeFormatted = d.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });
                const dateFormatted = d.toLocaleDateString();

                const isBlocked = log.eventType.includes('blocked') || (log.details?.allowed === false);
                const isApproved = log.eventType.includes('approved') || (log.details?.allowed === true);
                const isExecuted = log.eventType.includes('executed') || log.actor === 'razorpay_executor';

                return (
                  <React.Fragment key={log.eventId}>
                    <tr
                      onClick={() => onToggleExpand(log.eventId)}
                      className="hover:bg-surface-elevated transition-colors cursor-pointer"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-5 text-text-secondary whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-text-tertiary" />
                          <span>{timeFormatted}</span>
                          <span className="text-text-tertiary text-[10px]">({dateFormatted})</span>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            isBlocked
                              ? 'destructive'
                              : isApproved
                              ? 'success'
                              : isExecuted
                              ? 'cyan'
                              : 'secondary'
                          }
                          className="text-[10px] uppercase font-mono"
                        >
                          {log.eventType.replace(/_/g, ' ')}
                        </Badge>
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTransaction?.(log.transactionId);
                          }}
                          className="hover:text-primary hover:underline cursor-pointer"
                        >
                          {log.transactionId}
                        </span>
                      </td>

                      {/* Subsystem Actor */}
                      <td className="py-3.5 px-4 text-ai-signal text-[11px]">
                        {log.actor}
                      </td>

                      {/* Result / Rule */}
                      <td className="py-3.5 px-4 text-text-secondary text-[11px] truncate max-w-[200px]">
                        {(log.details?.reasonCode as string) ||
                          (log.details?.strategy as string) ||
                          (log.details?.status as string) ||
                          'Recorded'}
                      </td>

                      {/* Details toggle */}
                      <td className="py-3.5 px-4 text-right text-text-tertiary">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 inline-block" />
                        ) : (
                          <ChevronDown className="w-4 h-4 inline-block" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-[#03081A]/90 border-b border-border-hairline">
                        <td colSpan={6} className="p-4 sm:p-5">
                          <div className="p-4 rounded-[14px] bg-[#020626] border border-border-hairline space-y-3">
                            <div className="flex items-center justify-between text-text-tertiary border-b border-border-hairline/60 pb-2 text-[11px]">
                              <span>EVENT ID: <strong className="text-white font-mono">{log.eventId}</strong></span>
                              <span>SUBSYSTEM: <strong className="text-ai-signal font-mono">{log.actor}</strong></span>
                            </div>

                            <pre className="text-ai-signal text-xs overflow-x-auto p-3 bg-[#03081A] rounded-[10px] border border-border-hairline/50 font-mono">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
