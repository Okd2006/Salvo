/**
 * src/ui/components/launch/DemoFlowCard.tsx
 *
 * 9-step demo guide for hackathon judges & operators
 */
import React from 'react';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';

export interface DemoFlowCardProps {
  onNavigate?: (route: string) => void;
}

export const DemoFlowCard: React.FC<DemoFlowCardProps> = ({ onNavigate }) => {
  const steps = [
    { num: '1', title: 'Open Command Center', desc: 'Inspect live financial recovery yield and real-time monitored transaction failures.', route: 'overview' },
    { num: '2', title: 'Select Failed Transaction', desc: 'Pick any observable failure trace (e.g. txn_salv_0001) from the stream.', route: 'diagnosis' },
    { num: '3', title: 'Run AI Diagnosis', desc: 'Query Groq LLM to isolate root cause, confidence score, and recoverability probability.', route: 'diagnosis' },
    { num: '4', title: 'Inspect Decision Evidence', desc: 'Review observable telemetry signals without private model hallucination.', route: 'diagnosis' },
    { num: '5', title: 'Verify Policy Gate', desc: 'Observe deterministic evaluation against 7 safety invariants (Zero Risk Leak).', route: 'diagnosis' },
    { num: '6', title: 'Dispatch Live Execution', desc: 'Trigger autonomous execution through Razorpay Test API with idempotency.', route: 'execution' },
    { num: '7', title: 'Watch Autonomous Recovery', desc: 'Monitor adaptive retries, payment links, and multi-step fallbacks in real time.', route: 'execution' },
    { num: '8', title: 'Verify Audit Ledger', desc: 'Inspect immutable MongoDB compliance logs with complete chronological history.', route: 'audit' },
    { num: '9', title: 'Test 6 Archetypes in Lab', desc: 'Run all 6 failure scenarios in Recovery Simulation Lab to prove deterministic bounds.', route: 'simulator' },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-ai-signal" />
            <span>How to Demo Salvo (9-Step Operational Guide)</span>
          </CardTitle>
          <span className="font-mono text-xs text-text-tertiary">
            EVALUATION RUNBOOK
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => onNavigate?.(st.route)}
              className="p-3.5 rounded-[14px] bg-[#03081A] border border-border-hairline/60 hover:border-primary/60 transition-all cursor-pointer group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-[10px] font-bold">
                    {st.num}
                  </span>
                  <span className="font-mono text-[10px] text-text-tertiary uppercase group-hover:text-primary transition-colors flex items-center gap-1">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <h3 className="font-sans text-xs font-bold text-white group-hover:text-primary transition-colors">
                  {st.title}
                </h3>
                <p className="font-sans text-[11px] text-text-secondary leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
