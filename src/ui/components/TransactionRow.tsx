/**
 * TransactionRow — single transaction entry in the audit / recovery ledger.
 */
import React from 'react';
import { CurrencyValue } from './CurrencyValue.js';
import { StatusBadge } from './StatusBadge.js';

export interface TransactionRowProps {
  txnId: string;
  timestamp: string;
  failureCode: string;
  confidence: number;
  policyResult: string;
  policyPassed: boolean;
  expectedPaise: number;
  actualPaise: number;
  hash: string;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  txnId,
  timestamp,
  failureCode,
  confidence,
  policyResult,
  policyPassed,
  expectedPaise,
  actualPaise,
  hash,
  isExpanded = false,
  onToggleExpand,
}) => {
  return (
    <>
      <tr className="border-b border-border-hairline/50 hover:bg-surface-elevated transition-colors duration-150 group font-mono text-[13px]">
        <td className="py-3.5 px-5 text-text-secondary">{txnId}</td>
        <td className="py-3.5 px-5 text-text-tertiary">{timestamp}</td>
        <td className="py-3.5 px-5">
          <span className="bg-[#03081A] border border-border-hairline text-text-secondary px-2 py-0.5 rounded-[8px] text-xs">
            {failureCode}
          </span>
        </td>
        <td className="py-3.5 px-5 text-right font-medium">
          <span className={confidence >= 0.9 ? 'text-ai-signal' : 'text-text-secondary'}>
            {(confidence * 100).toFixed(0)}%
          </span>
        </td>
        <td className="py-3.5 px-5">
          <StatusBadge status={policyPassed ? 'APPROVED' : 'BLOCKED'} />
        </td>
        <td className="py-3.5 px-5 text-right">
          <CurrencyValue paise={expectedPaise} variant="neutral" size="sm" />
        </td>
        <td className="py-3.5 px-5 text-right">
          <CurrencyValue
            paise={actualPaise}
            variant={actualPaise > 0 ? 'recovered' : 'risk'}
            size="sm"
          />
        </td>
        <td className="py-3.5 px-5 text-center">
          <button
            onClick={() => onToggleExpand?.(txnId)}
            className="p-1 rounded-[8px] text-text-tertiary hover:text-white hover:bg-[#03081A] transition-colors"
            title="Inspect audit hash & policy trace"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExpanded ? 'expand_less' : 'open_in_new'}
            </span>
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#03081A] border-b border-border-hairline">
          <td colSpan={8} className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-text-tertiary uppercase tracking-wider">Cryptographic Hash:</span>
                <span className="text-ai-signal bg-surface px-2.5 py-1 rounded-[8px] border border-border-hairline">
                  {hash}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-tertiary uppercase tracking-wider">Policy Trace:</span>
                <span className={policyPassed ? 'text-recovered' : 'text-risk'}>
                  {policyResult}
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
