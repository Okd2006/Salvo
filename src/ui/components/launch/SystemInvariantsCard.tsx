/**
 * src/ui/components/launch/SystemInvariantsCard.tsx
 *
 * Explains the 7 deterministic safety invariants enforced in Policy Gate
 */
import React from 'react';
import { Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';

export const SystemInvariantsCard: React.FC = () => {
  const invariants = [
    {
      name: '1. Zero Risk Leakage',
      code: 'RISK_BLOCK',
      why: 'Strictly prohibits recovery execution on transactions flagged with fraud, stolen cards, or suspicious velocity.',
      enforced: 'policyGate.ts & orchestrator.ts',
    },
    {
      name: '2. Confidence Floor (≥ 60%)',
      code: 'CONFIDENCE_TOO_LOW',
      why: 'Prevents autonomous action on ambiguous decline codes where AI model confidence falls below 0.60.',
      enforced: 'policyGate.ts',
    },
    {
      name: '3. Financial Clamping (0 ≤ Recovery ≤ Amount)',
      code: 'FINANCIAL_BOUNDS',
      why: 'Enforces that predicted gross recovery cannot be negative or exceed the original transaction order value.',
      enforced: 'schema.ts & policyGate.ts',
    },
    {
      name: '4. Retry Velocity Limit (Max 2 Retries)',
      code: 'RETRY_LIMIT_EXCEEDED',
      why: 'Protects customers and acquiring switches from repeated failed retry attempts.',
      enforced: 'policyGate.ts & executor.ts',
    },
    {
      name: '5. Positive Expected Net Value (EV > 0)',
      code: 'NEGATIVE_EXPECTED_VALUE',
      why: 'Blocks interventions where estimated API surcharge cost exceeds predicted recovery value.',
      enforced: 'policyGate.ts',
    },
    {
      name: '6. Strategy Permissibility',
      code: 'STRATEGY_NOT_PERMITTED',
      why: 'Ensures recovery strategy matches the specific decline vector (e.g. unrecoverable failures cannot retry).',
      enforced: 'policyGate.ts',
    },
    {
      name: '7. Customer Fatigue Guard (Max 2 Contacts)',
      code: 'CONTACT_LIMIT_EXCEEDED',
      why: 'Caps automated SMS/WhatsApp payment link notifications to avoid spamming the customer.',
      enforced: 'policyGate.ts',
    },
  ];

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-recovered" />
            <span>7 Deterministic Safety Invariants</span>
          </CardTitle>
          <Badge variant="success" className="text-[10px]">
            100% PASS ENFORCED
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-2.5">
        {invariants.map((inv) => (
          <div
            key={inv.code}
            className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-white font-bold text-xs">{inv.name}</span>
                <span className="text-text-tertiary text-[10px]">({inv.code})</span>
              </div>
              <p className="text-text-secondary text-[11.5px] leading-snug">{inv.why}</p>
            </div>

            <div className="font-mono text-[10px] text-ai-signal bg-primary/10 border border-primary/30 px-2 py-1 rounded-[8px] shrink-0 self-start sm:self-center">
              {inv.enforced}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
