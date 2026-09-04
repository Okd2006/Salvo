/**
 * src/ui/screens/TermsConditionsScreen.tsx
 *
 * Salvo Platform Terms & Conditions of Operation
 * Explains platform usage terms, autonomous recovery policy boundaries, and benchmark sandbox rules.
 */
import React from 'react';
import { FileText, Shield, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Badge } from '../components/ui/badge.js';

export interface TermsConditionsScreenProps {
  onNavigate: (route: string) => void;
}

export const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border-hairline/60">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('overview')}
            className="rounded-[10px] gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-text-secondary mt-0.5 font-sans">
              Operational Invariants & Autonomous Recovery Governance
            </p>
          </div>
        </div>

        <Badge variant="cyan" className="gap-1.5 px-2.5 py-1">
          <Shield className="w-3.5 h-3.5 text-ai-signal" />
          <span>POLICY ENFORCED</span>
        </Badge>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        {/* Section 1: Scope of Service */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>1. Service Scope & Autonomous Agency</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              Salvo provides autonomous diagnostic classification and recovery execution for failed and abandoned digital payments. The software operates as an intelligent middleware layer between merchant payment infrastructure and acquirer gateways (specifically Razorpay).
            </p>
            <p>
              By accessing the Salvo platform, operators acknowledge that autonomous actions are strictly constrained by the mathematical Policy Gate and that no unverified or out-of-bounds actions may execute.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Deterministic Policy Gate Invariants */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-recovered" />
              <span>2. Immutable Safety Invariants & Recovery Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              All automated actions executed by Salvo are legally and technically bound by four immutable policy invariants:
            </p>
            <div className="space-y-2.5 pt-1 font-mono text-xs">
              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-recovered shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Amount Bounds:</strong> Minimum ₹10 (1,000 paise), maximum ₹50,000 (5,000,000 paise). Transactions outside these bounds are halted automatically.
                </div>
              </div>

              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-recovered shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Risk Ceiling:</strong> Maximum acceptable risk score is ≤ 0.40 (40%). Transactions exceeding 0.40 risk are hard-blocked to protect merchant reputation.
                </div>
              </div>

              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-recovered shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Confidence Gate:</strong> Diagnostic recoverability confidence must be ≥ 0.65 (65%) before any intervention is dispatched.
                </div>
              </div>

              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-recovered shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Attempt Limit:</strong> Maximum 3 autonomous recovery attempts per transaction to prevent customer dunning fatigue.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Auditability & Ledger Integrity */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ai-signal" />
              <span>3. Immutable Audit Logging & Non-Repudiation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              Every observation, diagnosis, policy approval, block, and gateway dispatch is recorded to Salvo’s immutable audit ledger. Audit entries cannot be deleted, modified, or overwritten by operators, ensuring non-repudiation for financial compliance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="pt-4 text-center text-xs text-text-tertiary font-mono">
        Salvo Operating Invariants • Razorpay Buildathon 2026 Evaluation Standards
      </div>
    </div>
  );
};
