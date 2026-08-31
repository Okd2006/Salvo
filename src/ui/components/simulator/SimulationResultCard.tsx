/**
 * src/ui/components/simulator/SimulationResultCard.tsx
 *
 * Full summary and attempt ledger of the simulation session result
 */
import React from 'react';
import {
  CheckCircle2,
  ShieldAlert,
  XCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { CurrencyValue } from '../CurrencyValue.js';
import type { RecoverySessionResult } from '../../../types/index.js';

export interface SimulationResultCardProps {
  sessionResult: RecoverySessionResult;
}

export const SimulationResultCard: React.FC<SimulationResultCardProps> = ({
  sessionResult,
}) => {
  const isRecovered = sessionResult.finalStatus === 'succeeded';
  const isBlocked = sessionResult.finalStatus === 'blocked';

  return (
    <div className="space-y-6">
      {/* Primary Result Banner Card */}
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
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Simulation Outcome:</span>
                  <span
                    className={
                      isRecovered ? 'text-recovered' : isBlocked ? 'text-risk' : 'text-caution'
                    }
                  >
                    {isRecovered ? 'RECOVERED' : isBlocked ? 'POLICY BLOCKED' : sessionResult.finalStatus.toUpperCase()}
                  </span>
                </CardTitle>
                <div className="text-xs font-mono text-text-tertiary">
                  Transaction: {sessionResult.transactionId} • Completed at {new Date(sessionResult.completedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <Badge
              variant={isRecovered ? 'success' : isBlocked ? 'destructive' : 'warning'}
              className="text-xs px-2.5 py-1"
            >
              {isRecovered ? 'RECOVERED' : isBlocked ? 'POLICY BLOCKED' : sessionResult.finalStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[16px] bg-[#03081A] border border-border-hairline">
            <div>
              <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                Total Recovered
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
                {sessionResult.attempts} / 3
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
                Policy Decisions
              </span>
              <span className="font-mono text-base font-bold text-white">
                {sessionResult.policyDecisions.length} Evaluated
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Decisions & Checks Trail */}
      {sessionResult.policyDecisions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono text-xs font-semibold text-text-tertiary uppercase tracking-wider px-1">
            Deterministic Policy Gate Evaluations ({sessionResult.policyDecisions.length})
          </h3>

          <div className="space-y-3">
            {sessionResult.policyDecisions.map((pol, idx) => (
              <Card key={idx} className="border-border-hairline bg-[#020626]/95">
                <CardHeader className="p-4 pb-3 border-b border-border-hairline/60 bg-[#03081A]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
                        Decision #{idx + 1}
                      </span>
                      <span className="font-mono text-xs text-text-secondary">
                        Reason Code: <strong className="text-white">{pol.reasonCode}</strong>
                      </span>
                    </div>

                    <Badge variant={pol.allowed ? 'success' : 'destructive'}>
                      {pol.allowed ? 'APPROVED' : 'BLOCKED'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 font-sans text-xs">
                  <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60">
                    <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-text-tertiary uppercase font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-recovered" />
                      <span>Policy Evaluation Result</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{pol.reason}</p>
                  </div>

                  {pol.checks && pol.checks.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {pol.checks.map((chk, cIdx) => (
                        <span
                          key={cIdx}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-[8px] border ${
                            chk.passed
                              ? 'bg-recovered/10 border-recovered/30 text-recovered'
                              : 'bg-risk/10 border-risk/30 text-risk'
                          }`}
                        >
                          {chk.name}: {chk.passed ? 'PASS' : 'FAIL'}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dispatched Actions Ledger */}
      {sessionResult.actions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono text-xs font-semibold text-text-tertiary uppercase tracking-wider px-1">
            Dispatched Gateway Executions ({sessionResult.actions.length})
          </h3>

          <div className="space-y-3">
            {sessionResult.actions.map((act, idx) => (
              <Card key={idx} className="border-border-hairline bg-[#020626]/95">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="text-white font-medium flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-ai-signal" />
                      <span>Attempt {idx + 1} • {act.strategy.toUpperCase()}</span>
                    </div>
                    <div className="text-text-tertiary text-[11px]">
                      Provider Reference: {act.providerReference || 'sim_trace'}
                    </div>
                    {act.errorMessage && (
                      <div className="text-risk text-[11px]">{act.errorMessage}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-text-tertiary block text-[10px] text-right">RECOVERED</span>
                      <CurrencyValue
                        paise={act.recoveredAmountPaise}
                        size="sm"
                        variant={act.success ? 'recovered' : 'neutral'}
                      />
                    </div>
                    <Badge variant={act.success ? 'success' : 'destructive'}>
                      {act.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
