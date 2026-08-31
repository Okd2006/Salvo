/**
 * src/ui/components/execution/ExecutionControlCard.tsx
 *
 * Target transaction selector and live dispatch control button
 */
import React from 'react';
import { Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Button } from '../ui/button.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { StatusBadge } from '../StatusBadge.js';
import type { ObservableTransaction } from '../../../types/index.js';

export interface ExecutionControlCardProps {
  transactions: ObservableTransaction[];
  selectedTxn: ObservableTransaction | null;
  onSelectTxn: (txn: ObservableTransaction) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export const ExecutionControlCard: React.FC<ExecutionControlCardProps> = ({
  transactions,
  selectedTxn,
  onSelectTxn,
  onExecute,
  isExecuting,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <span>Target Transaction:</span>
              <span className="font-mono text-ai-signal">
                {selectedTxn?.transactionId || 'None Selected'}
              </span>
            </CardTitle>
            <p className="font-sans text-xs text-text-secondary mt-0.5">
              Select an observable failure to execute the full autonomous recovery loop.
            </p>
          </div>

          <Button
            onClick={onExecute}
            disabled={!selectedTxn || isExecuting}
            variant="glow"
            size="sm"
            className="gap-2 rounded-[12px] font-semibold text-xs h-9 px-5 shrink-0"
          >
            {isExecuting ? (
              <div className="mr-1 h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isExecuting ? 'Executing Recovery...' : 'Dispatch Live Recovery'}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="font-mono text-xs text-text-tertiary uppercase tracking-wider shrink-0">
            Target:
          </label>
          <select
            value={selectedTxn?.transactionId || ''}
            onChange={(e) => {
              const matched = transactions.find((t) => t.transactionId === e.target.value);
              if (matched) onSelectTxn(matched);
            }}
            disabled={isExecuting}
            className="bg-[#03081A] border border-border-hairline rounded-[12px] px-3.5 py-2 text-xs font-mono text-white focus:border-primary focus:outline-none w-full"
          >
            {transactions.map((t) => (
              <option key={t.transactionId} value={t.transactionId}>
                {t.transactionId} • {t.failureCode} (₹{(t.amountPaise / 100).toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Context Bar */}
        {selectedTxn && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[14px] bg-[#03081A] border border-border-hairline">
            <div>
              <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                Amount at Risk
              </span>
              <CurrencyValue paise={selectedTxn.amountPaise} size="sm" variant="default" />
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                Failure Code
              </span>
              <span className="font-mono text-xs font-bold text-white truncate block">
                {selectedTxn.failureCode}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                Gateway & Method
              </span>
              <span className="font-mono text-xs font-semibold text-text-secondary uppercase block">
                {selectedTxn.gateway} • {selectedTxn.paymentMethod}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                Decline Vector
              </span>
              <StatusBadge status={selectedTxn.failureCategory} size="sm" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
