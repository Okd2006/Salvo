/**
 * src/ui/components/launch/ArchitectureLayers.tsx
 *
 * The 7 logical architectural layers of Salvo
 */
import React from 'react';
import {
  Lock,
  BrainCircuit,
  ShieldCheck,
  Sliders,
  Zap,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';

export const ArchitectureLayers: React.FC = () => {
  const layers = [
    {
      num: 'LAYER 01',
      title: 'Observation Layer',
      subtitle: 'Observable Telemetry & Ground-Truth Isolation',
      desc: 'Ingests transaction failure telemetry while stripping all simulation and ground-truth fields (`toObservableTransaction`), preventing evaluation leakage.',
      icon: Lock,
      badge: 'INPUT BOUNDARY',
    },
    {
      num: 'LAYER 02',
      title: 'Intelligence Layer',
      subtitle: 'Multi-Model Root Cause Reasoning',
      desc: 'Employs Groq GPT-OSS (`llama-3.3-70b-versatile`), OpenRouter, and Google Gemini to infer root cause, recoverability probability, and estimated cost.',
      icon: BrainCircuit,
      badge: 'AI REASONING',
    },
    {
      num: 'LAYER 03',
      title: 'Governance Layer',
      subtitle: 'Deterministic Policy Gate (7 Safety Invariants)',
      desc: 'The authoritative gatekeeper. Evaluates AI recommendations against 7 zero-exception safety invariants before any execution is permitted.',
      icon: ShieldCheck,
      badge: 'AUTHORIZATION',
    },
    {
      num: 'LAYER 04',
      title: 'Recovery Strategy Engine',
      subtitle: 'Algorithmic Remediation Mapping',
      desc: 'Dispatches tailored remediation actions: Smart Retry with backoff, Payment Method Switch, Customer Payment Links, or No-Action hold.',
      icon: Sliders,
      badge: 'REMEDIATION',
    },
    {
      num: 'LAYER 05',
      title: 'Execution Infrastructure',
      subtitle: 'Razorpay Test API Dispatcher',
      desc: 'Executes policy-approved recovery actions via server-side Razorpay Test Mode API with strict idempotency and zero live money transfers.',
      icon: Zap,
      badge: 'RAZORPAY TEST API',
    },
    {
      num: 'LAYER 06',
      title: 'Verification & Fallback Loop',
      subtitle: 'Multi-Step Autonomous Fallbacks',
      desc: 'Verifies recovery execution outcome and automatically cascades to alternative fallback strategies if the primary method encounters transient declines.',
      icon: CheckCircle2,
      badge: 'ADAPTIVE FALLBACK',
    },
    {
      num: 'LAYER 07',
      title: 'Audit & Compliance Layer',
      subtitle: 'Append-Only MongoDB Ledger',
      desc: 'Records an immutable event log for every observation, diagnosis, policy invariant evaluation, and gateway response with ISO-8601 timestamps.',
      icon: Database,
      badge: 'MONGODB AUDIT',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-mono text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          7 Architectural Layers
        </h2>
        <span className="font-mono text-[10px] text-text-tertiary">
          Defense-in-Depth Design
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((lay) => {
          const Icon = lay.icon;

          return (
            <Card key={lay.num} className="border-border-hairline bg-[#020626]/95">
              <CardHeader className="p-4 pb-2 border-b border-border-hairline/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ai-signal font-bold">
                      {lay.num}
                    </span>
                    <span className="text-border-hairline">•</span>
                    <CardTitle className="text-sm font-bold text-white font-sans">
                      {lay.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[9.5px]">
                    {lay.badge}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-1.5 font-sans text-xs">
                <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{lay.subtitle}</span>
                </div>
                <p className="text-text-secondary text-[11.5px] leading-relaxed">
                  {lay.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
