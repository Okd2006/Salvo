/**
 * src/ui/components/launch/ArchitectureFlow.tsx
 *
 * Central operational lifecycle flow diagram
 */
import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  Zap,
  ScrollText,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';

export const ArchitectureFlow: React.FC = () => {
  const steps = [
    {
      id: 'observe',
      num: '01',
      title: 'Observation Boundary',
      desc: 'Telemetry ingested with strict ground-truth isolation',
      icon: Lock,
      color: 'text-text-secondary',
      border: 'border-border-hairline',
    },
    {
      id: 'diagnose',
      num: '02',
      title: 'AI Diagnosis',
      desc: 'Groq GPT-OSS multi-model root cause reasoning',
      icon: BrainCircuit,
      color: 'text-primary',
      border: 'border-primary/40',
    },
    {
      id: 'policy',
      num: '03',
      title: 'Deterministic Policy Gate',
      desc: '7 safety invariants strictly verify authorization',
      icon: ShieldCheck,
      color: 'text-recovered',
      border: 'border-recovered/40',
    },
    {
      id: 'execute',
      num: '04',
      title: 'Razorpay Test Execution',
      desc: 'Smart retry, switch & payment link dispatch',
      icon: Zap,
      color: 'text-ai-signal',
      border: 'border-ai-signal/40',
    },
    {
      id: 'audit',
      num: '05',
      title: 'Immutable Audit Ledger',
      desc: 'MongoDB Atlas append-only compliance trace',
      icon: ScrollText,
      color: 'text-caution',
      border: 'border-caution/40',
    },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-ai-signal" />
            <span>Autonomous Recovery Lifecycle Pipeline</span>
          </CardTitle>
          <span className="font-mono text-xs text-text-tertiary">
            END-TO-END ORCHESTRATION
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((st) => {
            const Icon = st.icon;

            return (
              <div
                key={st.id}
                className={`p-4 rounded-[16px] bg-[#03081A] border ${st.border} flex flex-col justify-between space-y-3 relative group hover:border-primary transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-text-tertiary">
                      PHASE {st.num}
                    </span>
                    <div className={`p-1.5 rounded-[8px] bg-surface-elevated ${st.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-sans text-xs sm:text-sm font-bold text-white mb-1">
                    {st.title}
                  </h3>
                  <p className="font-sans text-[11px] text-text-secondary leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
