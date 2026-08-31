/**
 * src/ui/components/diagnosis/DecisionEvidenceCard.tsx
 *
 * Displays observable decision evidence signals returned by LLM
 */
import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';

export interface DecisionEvidenceCardProps {
  evidence: string[];
}

export const DecisionEvidenceCard: React.FC<DecisionEvidenceCardProps> = ({ evidence }) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-4 pb-2 border-b border-border-hairline/60">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span>Decision Evidence Signals ({evidence.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        {evidence.map((ev, i) => (
          <div
            key={i}
            className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-ai-signal shrink-0 mt-0.5" />
            <span className="font-mono text-xs text-text-secondary leading-snug">{ev}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
