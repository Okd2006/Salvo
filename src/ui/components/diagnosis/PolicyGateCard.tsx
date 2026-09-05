/**
 * src/ui/components/diagnosis/PolicyGateCard.tsx
 *
 * Displays Deterministic Policy Gate Verification results
 */
import React from 'react';
import { ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import type { PolicyResult } from '../../../types/index.js';

export interface PolicyGateCardProps {
  policyResult: PolicyResult | null;
  onEvaluatePolicy: () => void;
  isEvaluating: boolean;
}

export const PolicyGateCard: React.FC<PolicyGateCardProps> = ({
  policyResult,
  onEvaluatePolicy,
  isEvaluating,
}) => {
  if (!policyResult) {
    return (
      <Card className="border-border-hairline bg-[#020626]/95">
        <CardHeader className="p-4 pb-2 border-b border-border-hairline/60">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-recovered" />
            <span>Deterministic Policy Gate</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-center space-y-3">
          <p className="text-xs text-text-secondary font-sans">
            Evaluate the diagnosis recommendation against 7 deterministic safety invariants.
          </p>
          <Button
            onClick={onEvaluatePolicy}
            disabled={isEvaluating}
            variant="cyber"
            size="sm"
            className="w-full gap-2 rounded-[12px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating Invariants...' : 'Evaluate Policy Gate'}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isAllowed = policyResult.allowed;
  const checks = policyResult.checks || (policyResult as any).ruleEvaluations?.map((r: any) => ({
    name: r.ruleName || r.ruleId,
    passed: r.passed,
  })) || [];
  const reasonCode = policyResult.reasonCode || (policyResult as any).ruleEvaluations?.[0]?.ruleId || (isAllowed ? 'INVARIANTS_PASSED' : 'INVARIANTS_FAILED');

  return (
    <Card
      className={`border-border-hairline bg-[#020626]/95 ${
        isAllowed ? 'border-recovered/40' : 'border-risk/40'
      }`}
    >
      <CardHeader className="p-4 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            {isAllowed ? (
              <ShieldCheck className="w-4 h-4 text-recovered" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-risk" />
            )}
            <span>Policy Gate Verdict</span>
          </CardTitle>

          <Badge variant={isAllowed ? 'success' : 'destructive'} className="text-[10px]">
            {isAllowed ? 'ALLOWED' : 'BLOCKED'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Reason Banner */}
        <div
          className={`p-3 rounded-[12px] border text-xs font-sans ${
            isAllowed
              ? 'bg-recovered/10 border-recovered/30 text-white'
              : 'bg-risk/10 border-risk/30 text-risk'
          }`}
        >
          <span className="font-mono text-[10px] font-semibold block uppercase tracking-wider mb-0.5">
            Reason Code: {reasonCode}
          </span>
          {policyResult.reason}
        </div>

        {/* Invariant Checks List */}
        {checks.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider block">
              Safety Checks ({checks.length})
            </span>
            {checks.map((chk, i) => (
              <div
                key={i}
                className="p-2 rounded-[8px] bg-[#03081A] border border-border-hairline/40 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-text-secondary">{chk.name}</span>
                {chk.passed ? (
                  <span className="text-recovered flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="text-risk flex items-center gap-1 font-semibold">
                    <X className="w-3 h-3" /> FAIL
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
