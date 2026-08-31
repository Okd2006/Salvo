/**
 * src/ui/components/simulator/ScenarioSelector.tsx
 *
 * 6-card interactive selector for the deterministic failure scenarios
 */
import React from 'react';
import { Badge } from '../ui/badge.js';
import { CurrencyValue } from '../CurrencyValue.js';

export type DemoScenarioName =
  | 'success'
  | 'fallback'
  | 'risk_block'
  | 'confidence_block'
  | 'retry_limit'
  | 'max_attempts';

export interface ScenarioDefinition {
  id: DemoScenarioName;
  title: string;
  category: string;
  errorCode: string;
  amountPaise: number;
  description: string;
  expectedOutcome: string;
  expectedVerdict: 'approved' | 'blocked';
  expectedStatus: 'recovered' | 'blocked' | 'failed';
  badgeColor: 'success' | 'cyan' | 'destructive' | 'warning';
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'success',
    title: '1. Network Timeout',
    category: 'Temporary Latency',
    errorCode: 'GATEWAY_TIMEOUT',
    amountPaise: 450000,
    description: 'Acquiring switch latency during peak traffic.',
    expectedOutcome: 'Smart retry succeeds on 1st attempt.',
    expectedVerdict: 'approved',
    expectedStatus: 'recovered',
    badgeColor: 'success',
  },
  {
    id: 'fallback',
    title: '2. Bank Switch Decline',
    category: 'Multi-Step Fallback',
    errorCode: 'ISSUER_SWITCH_UNAVAILABLE',
    amountPaise: 380000,
    description: 'Primary switch fails; falls back to payment link.',
    expectedOutcome: 'Recovers via method switch fallback.',
    expectedVerdict: 'approved',
    expectedStatus: 'recovered',
    badgeColor: 'cyan',
  },
  {
    id: 'risk_block',
    title: '3. Suspected Velocity Risk',
    category: 'Fraud Prevention',
    errorCode: 'HIGH_RISK_SUSPICIOUS_VELOCITY',
    amountPaise: 1250000,
    description: 'Velocity threshold exceeded from untrusted ASN.',
    expectedOutcome: 'Policy Gate blocks execution (Zero Risk Leak).',
    expectedVerdict: 'blocked',
    expectedStatus: 'blocked',
    badgeColor: 'destructive',
  },
  {
    id: 'confidence_block',
    title: '4. Low AI Confidence',
    category: 'Confidence Safety',
    errorCode: 'TRANSACTION_REJECTED_UNKNOWN',
    amountPaise: 890000,
    description: 'Ambiguous decline code with insufficient telemetry.',
    expectedOutcome: 'Policy blocks low-confidence recommendation (<60%).',
    expectedVerdict: 'blocked',
    expectedStatus: 'blocked',
    badgeColor: 'warning',
  },
  {
    id: 'retry_limit',
    title: '5. Retry Limit Exceeded',
    category: 'Velocity Invariant',
    errorCode: 'GATEWAY_TIMEOUT',
    amountPaise: 520000,
    description: 'Transaction already exhausted 2 prior retry attempts.',
    expectedOutcome: 'Policy Gate blocks to prevent customer spam.',
    expectedVerdict: 'blocked',
    expectedStatus: 'blocked',
    badgeColor: 'destructive',
  },
  {
    id: 'max_attempts',
    title: '6. Persistent Decline',
    category: 'Max Attempts Cap',
    errorCode: 'ISSUER_DECLINED',
    amountPaise: 320000,
    description: 'Persistent issuer decline across 3 attempts.',
    expectedOutcome: 'Pipeline halts safely at MAX_RECOVERY_ATTEMPTS (3).',
    expectedVerdict: 'approved',
    expectedStatus: 'failed',
    badgeColor: 'warning',
  },
];

export interface ScenarioSelectorProps {
  selectedScenario: DemoScenarioName;
  onSelect: (scenario: DemoScenarioName) => void;
  isSimulating: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  onSelect,
  isSimulating,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          Select Simulation Scenario (6 Available)
        </span>
        <span className="font-mono text-[10px] text-text-tertiary">
          Deterministic Test Archetypes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario === sc.id;

          return (
            <div
              key={sc.id}
              onClick={() => !isSimulating && onSelect(sc.id)}
              className={`p-4 rounded-[18px] border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#020626] border-primary shadow-[0_0_20px_rgba(61,80,252,0.25)] ring-1 ring-primary'
                  : 'bg-[#020626]/80 hover:bg-[#020626] border-border-hairline hover:border-border-secondary'
              } ${isSimulating ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-sans text-sm font-bold text-white leading-tight">
                    {sc.title}
                  </span>
                  <Badge variant={sc.badgeColor} className="text-[9px] px-1.5 py-0 shrink-0">
                    {sc.expectedStatus.toUpperCase()}
                  </Badge>
                </div>

                <p className="font-sans text-xs text-text-secondary line-clamp-2 mb-3">
                  {sc.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-border-hairline/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-text-tertiary truncate">{sc.errorCode}</span>
                <CurrencyValue paise={sc.amountPaise} size="xs" variant="default" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
