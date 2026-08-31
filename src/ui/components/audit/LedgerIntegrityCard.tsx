/**
 * src/ui/components/audit/LedgerIntegrityCard.tsx
 *
 * Displays neutral, enterprise verification details for the audit ledger
 */
import React from 'react';
import { ShieldCheck, Database, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';

export const LedgerIntegrityCard: React.FC = () => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-4 pb-2 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-recovered" />
            <span>Compliance & Ledger Architecture</span>
          </CardTitle>
          <Badge variant="success" className="text-[10px]">
            ACTIVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
          <div className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 space-y-1">
            <div className="font-mono text-[10px] uppercase text-text-tertiary font-semibold flex items-center gap-1">
              <Database className="w-3 h-3 text-primary" />
              <span>Storage Layer</span>
            </div>
            <div className="text-white font-medium">MongoDB Atlas Ledger</div>
            <p className="text-text-secondary text-[11px]">Append-only compliance log collection with ISO timestamps.</p>
          </div>

          <div className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 space-y-1">
            <div className="font-mono text-[10px] uppercase text-text-tertiary font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-recovered" />
              <span>Observation Boundary</span>
            </div>
            <div className="text-white font-medium">Zero Ground-Truth Leakage</div>
            <p className="text-text-secondary text-[11px]">Strict runtime stripping of simulation parameters before audit.</p>
          </div>

          <div className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 space-y-1">
            <div className="font-mono text-[10px] uppercase text-text-tertiary font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-ai-signal" />
              <span>Deterministic Policy</span>
            </div>
            <div className="text-white font-medium">7 Safety Invariants</div>
            <p className="text-text-secondary text-[11px]">Every recovery decision logged with invariant check results.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
