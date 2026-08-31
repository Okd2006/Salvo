/**
 * src/ui/components/simulator/SimulationPipeline.tsx
 *
 * Operational stage progression:
 * FAILURE -> DIAGNOSIS -> POLICY GATE -> RECOVERY STRATEGY -> EXECUTION -> OUTCOME
 */
import React from 'react';
import {
  AlertCircle,
  BrainCircuit,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import type { RecoverySessionResult } from '../../../types/index.js';

export interface SimulationPipelineProps {
  sessionResult: RecoverySessionResult | null;
  isSimulating: boolean;
}

export const SimulationPipeline: React.FC<SimulationPipelineProps> = ({
  sessionResult,
  isSimulating,
}) => {
  const isCompleted = sessionResult !== null;
  const isRecovered = sessionResult?.finalStatus === 'succeeded';
  const isBlocked = sessionResult?.finalStatus === 'blocked';

  const stages = [
    {
      id: 'failure',
      label: '1. FAILURE',
      title: 'Payment Decline',
      status: isCompleted || isSimulating ? 'COMPLETE' : 'PENDING',
      icon: AlertCircle,
      color: 'text-risk',
      bg: 'bg-risk/10',
      border: 'border-risk/30',
    },
    {
      id: 'diagnosis',
      label: '2. DIAGNOSIS',
      title: 'AI Root Cause',
      status: isCompleted ? 'COMPLETE' : isSimulating ? 'RUNNING' : 'PENDING',
      icon: BrainCircuit,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
    },
    {
      id: 'policy',
      label: '3. POLICY GATE',
      title: 'Invariant Check',
      status: isCompleted ? (isBlocked ? 'BLOCKED' : 'APPROVED') : isSimulating ? 'RUNNING' : 'PENDING',
      icon: isBlocked ? ShieldAlert : ShieldCheck,
      color: isBlocked ? 'text-risk' : 'text-ai-signal',
      bg: isBlocked ? 'bg-risk/10' : 'bg-ai-signal/10',
      border: isBlocked ? 'border-risk/40' : 'border-ai-signal/30',
    },
    {
      id: 'execution',
      label: '4. EXECUTION',
      title: 'Gateway Dispatch',
      status: isCompleted ? (isBlocked ? 'SKIPPED' : isRecovered ? 'SUCCESS' : 'FAILED') : isSimulating ? 'RUNNING' : 'PENDING',
      icon: Zap,
      color: isBlocked ? 'text-text-tertiary' : isRecovered ? 'text-recovered' : 'text-caution',
      bg: isBlocked ? 'bg-surface-elevated' : 'bg-caution/10',
      border: 'border-border-hairline',
    },
    {
      id: 'outcome',
      label: '5. OUTCOME',
      title: 'Final Settlement',
      status: isCompleted ? (isRecovered ? 'RECOVERED' : isBlocked ? 'POLICY BLOCKED' : 'NOT RECOVERED') : isSimulating ? 'PROCESSING' : 'PENDING',
      icon: isRecovered ? CheckCircle2 : isBlocked ? ShieldAlert : XCircle,
      color: isRecovered ? 'text-recovered' : isBlocked ? 'text-risk' : 'text-caution',
      bg: isRecovered ? 'bg-recovered/10' : isBlocked ? 'bg-risk/10' : 'bg-caution/10',
      border: isRecovered ? 'border-recovered/40' : isBlocked ? 'border-risk/40' : 'border-border-hairline',
    },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-ai-signal" />
            <span>Autonomous Recovery Pipeline Stages</span>
          </CardTitle>
          <span className="font-mono text-xs text-text-tertiary">
            {isCompleted ? 'Pipeline Complete' : isSimulating ? 'Executing Pipeline...' : 'Ready'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stages.map((st) => {
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-[14px] bg-[#03081A] border ${st.border} flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9.5px] font-semibold text-text-tertiary uppercase tracking-wider">
                      {st.label}
                    </span>
                    <div className={`p-1.5 rounded-[8px] ${st.bg} ${st.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="font-sans text-xs font-semibold text-white mb-1">
                    {st.title}
                  </div>
                </div>

                <div className="pt-2 border-t border-border-hairline/50 mt-2 flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-bold ${st.color}`}>
                    {st.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
