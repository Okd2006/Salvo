/**
 * src/ui/components/launch/GovernanceSection.tsx
 *
 * Core architectural principle: AI Recommends, Policy Authorizes, Engine Executes, Audit Records
 */
import React from 'react';
import { BrainCircuit, ShieldCheck, Zap, ScrollText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';

export const GovernanceSection: React.FC = () => {
  const pillars = [
    {
      title: 'AI RECOMMENDS',
      role: 'Advisory Intelligence',
      desc: 'LLM reasoning determines the probable root cause, recoverability probability, and proposed recovery strategy.',
      icon: BrainCircuit,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/30',
    },
    {
      title: 'POLICY AUTHORIZES',
      role: 'Deterministic Gatekeeper',
      desc: 'Policy Gate evaluates 7 deterministic safety invariants. Rejects low confidence, high risk, and excessive retries.',
      icon: ShieldCheck,
      color: 'text-recovered',
      bg: 'bg-recovered/10',
      border: 'border-recovered/30',
    },
    {
      title: 'ENGINE EXECUTES',
      role: 'Controlled Action',
      desc: 'Only policy-approved actions proceed to execution via Razorpay Test API. Strict idempotency prevents double charging.',
      icon: Zap,
      color: 'text-ai-signal',
      bg: 'bg-ai-signal/10',
      border: 'border-ai-signal/30',
    },
    {
      title: 'AUDIT RECORDS',
      role: 'Compliance Ledger',
      desc: 'The entire chain of reasoning, invariant checks, and execution results is committed to MongoDB Atlas.',
      icon: ScrollText,
      color: 'text-caution',
      bg: 'bg-caution/10',
      border: 'border-caution/30',
    },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-recovered" />
            <span>AI Governance & Safety Hierarchy</span>
          </CardTitle>
          <span className="font-mono text-xs text-text-tertiary">
            SEPARATION OF CONCERNS
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;

            return (
              <div
                key={p.title}
                className={`p-4 rounded-[16px] bg-[#03081A] border ${p.border} space-y-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-[10px] ${p.bg} ${p.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] text-text-tertiary">
                      {p.role}
                    </span>
                  </div>

                  <h3 className="font-mono text-xs font-bold text-white mb-1">
                    {p.title}
                  </h3>
                  <p className="font-sans text-xs text-text-secondary leading-relaxed">
                    {p.desc}
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
