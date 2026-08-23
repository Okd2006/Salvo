/**
 * RecoveryStrategyRow — ledger row for strategy simulation and comparison.
 */
import React from 'react';
import { CurrencyValue } from './CurrencyValue.js';

export interface RecoveryStrategyRowProps {
  id: string;
  icon: string;
  label: string;
  sublabel: string;
  transactionsAffected: number;
  predictedRecoveryPaise: number;
  interventionCostPaise: number;
  netRecoveryPaise: number;
  recommended?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const RecoveryStrategyRow: React.FC<RecoveryStrategyRowProps> = ({
  id,
  icon,
  label,
  sublabel,
  transactionsAffected,
  predictedRecoveryPaise,
  interventionCostPaise,
  netRecoveryPaise,
  recommended = false,
  isSelected = false,
  onSelect,
}) => {
  return (
    <tr
      onClick={() => onSelect?.(id)}
      className={`group cursor-pointer transition-colors duration-150 border-b border-border-hairline/60 ${
        isSelected
          ? 'bg-primary/10 border-l-4 border-l-primary'
          : 'hover:bg-surface-elevated'
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-9 h-9 rounded-[12px] flex items-center justify-center border transition-colors ${
              isSelected
                ? 'bg-primary border-primary text-white'
                : 'bg-[#03081A] border-border-hairline text-text-secondary group-hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[15px] text-white font-medium">{label}</span>
              {recommended && (
                <span className="px-2 py-0.5 rounded-[17px] bg-ai-signal/15 text-ai-signal border border-ai-signal/30 font-mono text-[9px] uppercase tracking-wider font-semibold">
                  RECOMMENDED
                </span>
              )}
            </div>
            <div className="font-sans text-xs text-text-tertiary mt-0.5">{sublabel}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right font-mono text-sm text-text-secondary">
        {transactionsAffected.toLocaleString('en-IN')}
      </td>

      <td className="px-6 py-4 text-right">
        <CurrencyValue paise={predictedRecoveryPaise} variant="neutral" size="sm" />
      </td>

      <td className="px-6 py-4 text-right">
        <CurrencyValue paise={interventionCostPaise} variant="risk" size="sm" />
      </td>

      <td className="px-6 py-4 text-right">
        <CurrencyValue
          paise={netRecoveryPaise}
          variant="recovered"
          size={isSelected ? 'md' : 'sm'}
          className={isSelected ? 'font-bold' : ''}
        />
      </td>
    </tr>
  );
};
