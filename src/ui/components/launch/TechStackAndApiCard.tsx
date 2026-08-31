/**
 * src/ui/components/launch/TechStackAndApiCard.tsx
 *
 * Verified technology stack and API endpoints map
 */
import React from 'react';
import { Cpu, Server, Database, Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';

export const TechStackAndApiCard: React.FC = () => {
  const stack = [
    {
      category: 'Frontend Application',
      items: ['React 19', 'TypeScript 5.5', 'Vite 6', 'Tailwind CSS 3.4', 'Lucide React'],
      icon: Cpu,
    },
    {
      category: 'Backend & Orchestration',
      items: ['Node.js Native HTTP', 'Autonomous Orchestrator', 'Policy Gate Engine', 'Razorpay Test SDK'],
      icon: Server,
    },
    {
      category: 'AI & Inference',
      items: ['Groq (llama-3.3-70b-versatile)', 'Google Gemini', 'OpenRouter Fallback', 'Structured JSON Schema'],
      icon: Network,
    },
    {
      category: 'Data & Telemetry',
      items: ['MongoDB Atlas', 'In-Memory Fallback Store', 'Append-Only Audit Ledger', 'Seeded PRNG Dataset'],
      icon: Database,
    },
  ];

  const apis = [
    { method: 'GET', path: '/api/health', desc: 'System & DB health telemetry' },
    { method: 'GET', path: '/api/dashboard', desc: 'Financial metrics & strategy yield' },
    { method: 'GET', path: '/api/transactions', desc: 'Observable failure transaction traces' },
    { method: 'POST', path: '/api/diagnose', desc: 'Groq LLM root-cause diagnosis' },
    { method: 'POST', path: '/api/policy-gate', desc: 'Deterministic 7-invariant check' },
    { method: 'POST', path: '/api/recover', desc: 'Full autonomous recovery loop' },
    { method: 'POST', path: '/api/demo/recovery', desc: '6 deterministic scenario simulations' },
    { method: 'GET', path: '/api/audit', desc: 'Immutable compliance audit log trail' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tech Stack */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span>Verified Technology Stack</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-3 font-sans text-xs">
          {stack.map((st) => {
            const Icon = st.icon;

            return (
              <div
                key={st.category}
                className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 space-y-1.5"
              >
                <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-ai-signal" />
                  <span>{st.category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {st.items.map((it) => (
                    <span
                      key={it}
                      className="px-2 py-0.5 rounded-[8px] bg-surface-elevated border border-border-hairline text-text-secondary text-[11px] font-mono"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* API Map */}
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-recovered" />
            <span>Active API Surface Map</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-2 font-mono text-xs">
          {apis.map((api) => (
            <div
              key={api.path}
              className="p-2.5 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    api.method === 'POST'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-recovered/20 text-recovered border border-recovered/30'
                  }`}
                >
                  {api.method}
                </span>
                <span className="text-white font-semibold">{api.path}</span>
              </div>
              <span className="text-text-tertiary text-[10.5px] font-sans truncate max-w-[200px]">
                {api.desc}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
