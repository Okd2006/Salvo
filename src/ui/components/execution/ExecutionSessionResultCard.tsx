/**
 * src/ui/components/execution/ExecutionSessionResultCard.tsx
 *
 * Displays outcome banner and ledger of the live recovery execution
 */
import React from 'react';
import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { CurrencyValue } from '../CurrencyValue.js';
import type { RecoverySessionResult } from '../../../types/index.js';

export interface ExecutionSessionResultCardProps {
  sessionResult: RecoverySessionResult;
}

export const ExecutionSessionResultCard: React.FC<ExecutionSessionResultCardProps> = ({
  sessionResult,
}) => {
  const isRecovered = sessionResult.finalStatus === 'succeeded';
  const isBlocked = sessionResult.finalStatus === 'blocked';

  return (
    <Card
      className={`border-border-hairline bg-[#020626]/95 ${
        isRecovered ? 'border-recovered/40' : isBlocked ? 'border-risk/40' : 'border-caution/40'
      }`}
    >
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
                isRecovered
                  ? 'bg-recovered/20 text-recovered border border-recovered/40'
                  : isBlocked
                  ? 'bg-risk/20 text-risk border border-risk/40'
                  : 'bg-caution/20 text-caution border border-caution/40'
              }`}
            >
              {isRecovered ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isBlocked ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>

            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Execution Verdict:</span>
                <span
                  className={
                    isRecovered ? 'text-recovered' : isBlocked ? 'text-risk' : 'text-caution'
                  }
                >
                  {isRecovered
                    ? 'RECOVERED VIA RAZORPAY'
                    : isBlocked
                    ? 'BLOCKED BY POLICY GATE'
                    : (sessionResult.finalStatus ? sessionResult.finalStatus.toUpperCase() : "PENDING")}
                </span>
              </CardTitle>
              <div className="text-xs font-mono text-text-tertiary">
                Target: {sessionResult.transactionId} • Strategy: {(sessionResult.finalStrategy ? sessionResult.finalStrategy.toUpperCase() : "AUTOMATED_RECOVERY")}
              </div>
            </div>
          </div>

          <Badge
            variant={isRecovered ? 'success' : isBlocked ? 'destructive' : 'warning'}
            className="text-xs px-2.5 py-1"
          >
            {isRecovered ? 'RECOVERED' : isBlocked ? 'BLOCKED' : (sessionResult.finalStatus ? sessionResult.finalStatus.toUpperCase() : "PENDING")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[14px] bg-[#03081A] border border-border-hairline">
          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Recovered Amount
            </span>
            <CurrencyValue
              paise={sessionResult.totalRecoveredPaise}
              size="md"
              variant={sessionResult.totalRecoveredPaise > 0 ? 'recovered' : 'neutral'}
            />
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Attempts Dispatched
            </span>
            <span className="font-mono text-base font-bold text-white">
              {sessionResult.attempts} of 3
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Final Strategy
            </span>
            <span className="font-mono text-xs font-bold text-ai-signal uppercase truncate block">
              {sessionResult.finalStrategy.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase text-text-tertiary block">
              Policy Checks
            </span>
            <span className="font-mono text-base font-bold text-white">
              {sessionResult.policyDecisions.length} Evaluated
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
