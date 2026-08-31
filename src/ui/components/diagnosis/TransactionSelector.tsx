/**
 * src/ui/components/diagnosis/TransactionSelector.tsx
 *
 * Search and select failed transactions from the observable telemetry stream
 */
import React from 'react';
import { Search, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { StatusBadge } from '../StatusBadge.js';
import type { ObservableTransaction } from '../../../types/index.js';

export interface TransactionSelectorProps {
  transactions: ObservableTransaction[];
  selectedTxnId: string;
  onSelect: (txn: ObservableTransaction) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TransactionSelector: React.FC<TransactionSelectorProps> = ({
  transactions,
  selectedTxnId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const filtered = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.failureCode.toLowerCase().includes(q) ||
      t.paymentMethod.toLowerCase().includes(q)
    );
  });

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-4 pb-3 border-b border-border-hairline/60">
        <div className="flex items-center justify-between gap-2 mb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Receipt className="w-4 h-4 text-ai-signal" />
            <span>Select Failed Transaction</span>
          </CardTitle>
          <span className="font-mono text-[10px] text-text-tertiary">
            {transactions.length} observable
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search txn ID, failure code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#03081A] border border-border-hairline text-white font-sans text-xs rounded-[10px] py-1.5 pl-8 pr-3 focus:border-primary focus:outline-none transition-all placeholder:text-text-tertiary"
          />
        </div>
      </CardHeader>

      <CardContent className="p-2 max-h-[380px] overflow-y-auto space-y-1.5 divide-y divide-border-hairline/30">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-text-tertiary text-xs font-mono">
            No matching transactions found.
          </div>
        ) : (
          filtered.slice(0, 15).map((txn) => {
            const isSelected = txn.transactionId === selectedTxnId;

            return (
              <div
                key={txn.transactionId}
                onClick={() => onSelect(txn)}
                className={`p-3 rounded-[12px] cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/20 border border-primary/40 text-white shadow-md'
                    : 'bg-[#03081A]/60 hover:bg-surface-elevated border border-transparent text-text-secondary hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-white">
                    {txn.transactionId}
                  </span>
                  <CurrencyValue paise={txn.amountPaise} size="xs" variant="default" />
                </div>

                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-text-tertiary">
                    {txn.failureCode} • {txn.paymentMethod.toUpperCase()}
                  </span>
                  <StatusBadge status={txn.failureCategory} size="sm" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
