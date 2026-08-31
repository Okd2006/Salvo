/**
 * src/ui/components/diagnosis/RecoveryActionCard.tsx
 *
 * Action dispatch card bridging Policy Approval to Live Execution or Simulator
 */
import React from 'react';
import { Zap, Sliders, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card.js';
import { Button } from '../ui/button.js';
import type { RecoveryRecommendation, PolicyResult } from '../../../types/index.js';

export interface RecoveryActionCardProps {
  recommendation: RecoveryRecommendation;
  policyResult: PolicyResult | null;
  onNavigate?: (route: string) => void;
}

export const RecoveryActionCard: React.FC<RecoveryActionCardProps> = ({
  recommendation,
  policyResult,
  onNavigate,
}) => {
  const isApproved = policyResult?.allowed === true;

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-tertiary mb-1">
            <span>OBSERVE</span>
            <span>&rarr;</span>
            <span>DIAGNOSE</span>
            <span>&rarr;</span>
            <span className={isApproved ? 'text-recovered font-bold' : 'text-text-tertiary'}>
              POLICY {isApproved ? 'APPROVED' : 'PENDING'}
            </span>
            <span>&rarr;</span>
            <span className="text-primary font-bold">RECOVER</span>
          </div>

          <div className="font-sans text-sm font-semibold text-white">
            {isApproved
              ? `Authorized for Automated ${recommendation.recommendedStrategy.replace(/_/g, ' ').toUpperCase()}`
              : 'Policy Gate Check Required Prior to Execution'}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('simulator')}
            className="rounded-[12px] gap-1.5 text-xs font-mono"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Fallbacks</span>
          </Button>

          {isApproved && (
            <Button
              variant="glow"
              size="sm"
              onClick={() => onNavigate?.('execution')}
              className="rounded-[12px] gap-1.5 text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Proceed to Execution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
