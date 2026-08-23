/**
 * WhyPanel — explainable AI reasoning & policy verdict card.
 *
 * Visual spec:
 *  - 35px border radius (`rounded-[35px]`)
 *  - Flat architectural dark surface (`bg-surface border border-border-hairline`)
 *  - Displays root cause, evidence trace, safety policy verdict, and projected recovery.
 */
import React from 'react';
import { CurrencyValue } from './CurrencyValue.js';
import { Eyebrow } from './Eyebrow.js';
import { StatusBadge } from './StatusBadge.js';

export interface WhyPanelProps {
  diagnosisId: string;
  rootCause: string;
  failureVector: string;
  affectedTransactions: number;
  grossValuePaise: number;
  projectedRecoveryPaise: number;
  confidenceScore: number;
  policyVerdict: string;
  policyPassed: boolean;
  rationale: string;
  className?: string;
}

export const WhyPanel: React.FC<WhyPanelProps> = ({
  diagnosisId,
  rootCause,
  failureVector,
  affectedTransactions,
  grossValuePaise,
  projectedRecoveryPaise,
  confidenceScore,
  policyVerdict: _policyVerdict,
  policyPassed,
  rationale,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col gap-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div className="flex items-center gap-3">
          <Eyebrow variant="ai">Gemini Analyst Engine</Eyebrow>
          <span className="font-mono text-xs text-text-tertiary">
            ID: <span className="text-white">{diagnosisId}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-tertiary">CONFIDENCE:</span>
          <span className="font-mono text-xs text-ai-signal font-semibold">
            {(confidenceScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Primary Root Cause */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Primary Root Cause & Diagnosis
        </span>
        <div className="bg-[#03081A] border-l-2 border-ai-signal p-4 rounded-r-[16px] text-[14px] leading-[22px] text-white">
          {rootCause}
        </div>
      </div>

      {/* Telemetry Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-[24px] bg-[#03081A] border border-border-hairline">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            Affected Volume
          </span>
          <span className="font-mono text-[20px] text-white font-medium">
            {affectedTransactions.toLocaleString('en-IN')} txns
          </span>
          <span className="font-sans text-xs text-text-secondary">{failureVector}</span>
        </div>

        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border-hairline pt-3 sm:pt-0 sm:pl-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            Gross Value at Risk
          </span>
          <CurrencyValue paise={grossValuePaise} variant="risk" size="md" />
          <span className="font-sans text-xs text-text-secondary">Terminal decline baseline</span>
        </div>

        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border-hairline pt-3 sm:pt-0 sm:pl-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            Projected Recovery
          </span>
          <CurrencyValue paise={projectedRecoveryPaise} variant="recovered" size="md" />
          <span className="font-sans text-xs text-text-secondary">Autonomous execution yield</span>
        </div>
      </div>

      {/* Policy Gate Check & Safety Verification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[20px] bg-surface-elevated border border-border-hairline">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">
            verified_user
          </span>
          <div>
            <div className="font-sans text-sm text-white font-medium">
              Deterministic Policy Gate Check
            </div>
            <div className="font-sans text-xs text-text-secondary">{rationale}</div>
          </div>
        </div>
        <StatusBadge status={policyPassed ? 'APPROVED' : 'BLOCKED'} />
      </div>
    </div>
  );
};
