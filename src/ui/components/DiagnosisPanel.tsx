/**
 * DiagnosisPanel — detailed multi-dimensional failure classification panel.
 */
import React from 'react';
import { CurrencyValue } from './CurrencyValue.js';
import { Eyebrow } from './Eyebrow.js';

export interface DiagnosisPanelProps {
  category: 'temporary' | 'customer' | 'payment_method' | 'unrecoverable';
  recoverabilityPercent: number;
  recommendedAction: string;
  expectedPaise: number;
  interventionCostPaise: number;
  netPaise: number;
  className?: string;
}

export const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({
  category,
  recoverabilityPercent,
  recommendedAction,
  expectedPaise,
  interventionCostPaise,
  netPaise,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-border-hairline rounded-[35px] p-6 lg:p-8 flex flex-col gap-6 ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-border-hairline">
        <Eyebrow variant="ai">AI Recovery Projection</Eyebrow>
        <span className="font-mono text-xs uppercase text-text-tertiary">
          Category: <span className="text-white font-medium">{category.replace('_', ' ')}</span>
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="font-sans text-sm text-text-secondary">Recommended Strategy</span>
          <span className="font-sans text-sm text-white font-medium">{recommendedAction}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-tertiary">RECOVERABILITY PROBABILITY</span>
            <span className="text-ai-signal font-semibold">{recoverabilityPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#03081A] rounded-full overflow-hidden border border-border-hairline">
            <div
              className="h-full bg-ai-signal transition-all duration-500 rounded-full"
              style={{ width: `${recoverabilityPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 rounded-[20px] bg-[#03081A] border border-border-hairline text-center">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase text-text-tertiary">Expected Yield</span>
          <CurrencyValue paise={expectedPaise} variant="neutral" size="sm" />
        </div>
        <div className="flex flex-col gap-1 border-x border-border-hairline">
          <span className="font-mono text-[10px] uppercase text-text-tertiary">API Surcharge</span>
          <CurrencyValue paise={interventionCostPaise} variant="risk" size="sm" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase text-text-tertiary">Net Recovered</span>
          <CurrencyValue paise={netPaise} variant="recovered" size="sm" />
        </div>
      </div>
    </div>
  );
};
