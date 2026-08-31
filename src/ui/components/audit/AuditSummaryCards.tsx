/**
 * src/ui/components/audit/AuditSummaryCards.tsx
 *
 * Summary KPIs for the compliance audit ledger
 */
import React from 'react';
import { ScrollText, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/card.js';
import type { AuditLogDocument } from '../../../types/index.js';

export interface AuditSummaryCardsProps {
  logs: AuditLogDocument[];
}

export const AuditSummaryCards: React.FC<AuditSummaryCardsProps> = ({ logs }) => {
  const totalEvents = logs.length;
  const policyBlocks = logs.filter(
    (l) => l.eventType.includes('blocked') || (l.details?.allowed === false)
  ).length;
  const policyApprovals = logs.filter(
    (l) => l.eventType.includes('approved') || (l.details?.allowed === true)
  ).length;
  const executions = logs.filter(
    (l) => l.eventType.includes('executed') || l.eventType.includes('started') || l.actor === 'razorpay_executor'
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Events */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Total Audit Events
            </span>
            <ScrollText className="w-4 h-4 text-ai-signal" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl text-white font-bold">
            {totalEvents.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-xs text-text-secondary">
            Immutable trace records
          </span>
        </CardContent>
      </Card>

      {/* Policy Approvals */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Policy Invariant Approvals
            </span>
            <ShieldCheck className="w-4 h-4 text-recovered" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl text-recovered font-bold">
            {policyApprovals.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-xs text-text-secondary">
            Verified compliant recoveries
          </span>
        </CardContent>
      </Card>

      {/* Policy Blocks */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Policy Safety Blocks
            </span>
            <ShieldAlert className="w-4 h-4 text-risk" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl text-risk font-bold">
            {policyBlocks.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-xs text-text-secondary">
            Zero-risk isolation blocks
          </span>
        </CardContent>
      </Card>

      {/* Gateway Dispatches */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardContent className="p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary">
              Gateway Dispatches
            </span>
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono text-2xl sm:text-3xl text-ai-signal font-bold">
            {executions.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-xs text-text-secondary">
            Razorpay test API operations
          </span>
        </CardContent>
      </Card>
    </div>
  );
};
