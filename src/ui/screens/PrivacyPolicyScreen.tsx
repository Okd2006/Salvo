/**
 * src/ui/screens/PrivacyPolicyScreen.tsx
 *
 * Salvo Platform Privacy Policy & Data Governance Statement
 * Explains benchmark data handling, synthetic customer profiles, and test mode isolation.
 */
import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Badge } from '../components/ui/badge.js';

export interface PrivacyPolicyScreenProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onNavigate }) => {
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
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xs text-text-secondary mt-0.5 font-sans">
              Salvo Autonomous Payment Operations • Razorpay AI Buildathon 2026
            </p>
          </div>
        </div>

        <Badge variant="cyan" className="gap-1.5 px-2.5 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-ai-signal" />
          <span>ZERO PII LEAKAGE</span>
        </Badge>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        {/* Section 1: Executive Summary */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>1. Overview & Data Philosophy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              Salvo is an autonomous payment operations and revenue recovery intelligence engine built for the Razorpay AI Buildathon 2026. The platform adheres strictly to non-leaking observation boundaries and zero-trust telemetry ingestion.
            </p>
            <p>
              We treat financial transaction telemetry with institutional-grade privacy safeguards. During all benchmark and sandbox demonstrations, no live consumer bank account credentials, credit card CVVs, or production payment secrets are ingested or stored.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Benchmark Dataset & Synthetic Customer Identities */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-ai-signal" />
              <span>2. Synthetic Customer Data & Non-PII Identifiers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              All customer entities in the Salvo Buildathon Benchmark Dataset (1,350 transactions, 208 failed payments) are deterministically generated synthetic profiles:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-xs font-mono text-slate-300">
              <li><strong className="text-white">Customer Identifiers:</strong> Tokenized pseudonymous keys (e.g. CUS_7F29A, CUS_81D42) with no linkage to personal identity.</li>
              <li><strong className="text-white">Card & Instrument Numbers:</strong> Strictly masked sandbox tokens (e.g. standard RBI test card BINs). Real card numbers or CVVs are never processed.</li>
              <li><strong className="text-white">Contact Channels:</strong> Synthetic routing handles used strictly within Razorpay Test Mode webhooks and simulated links.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3: AI Inference & Boundary Guarantees */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-recovered" />
              <span>3. AI Diagnostic Boundaries & Ground Truth Isolation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              Salvo enforces cryptographic observation boundaries between live telemetry and AI reasoning models (Groq / Gemini):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <CheckCircle className="w-3.5 h-3.5 text-recovered" />
                  <span>Observable Parameters</span>
                </div>
                <p className="text-[11px] text-text-tertiary">
                  Only transaction amount, failure code, payment method, and historical aggregate retry success rates are passed to diagnostic agents.
                </p>
              </div>

              <div className="p-3 rounded-[10px] bg-[#03081A] border border-border-hairline/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <CheckCircle className="w-3.5 h-3.5 text-recovered" />
                  <span>Ground Truth Isolation</span>
                </div>
                <p className="text-[11px] text-text-tertiary">
                  Post-hoc simulation outcomes and internal benchmark labels are cryptographically verified to never leak into inference prompts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Razorpay Test Mode & Fund Isolation */}
        <Card className="border-border-hairline bg-[#020626]/95">
          <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>4. Sandbox Mode & No Live Funds Transfer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <p>
              All payment recovery links, automated retries, and method-switch tokens generated during the submission demo interact exclusively with the official <strong className="text-white">Razorpay Test Gateway (API Test Mode)</strong>.
            </p>
            <p className="text-xs text-text-tertiary">
              No live merchant accounts are debited, no real financial settlement occurs, and no real currency is moved during demonstration operations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer Acknowledgement */}
      <div className="pt-4 text-center text-xs text-text-tertiary font-mono">
        Salvo Compliance Ledger • Cryptographic SHA-256 Provenance Active
      </div>
    </div>
  );
};
