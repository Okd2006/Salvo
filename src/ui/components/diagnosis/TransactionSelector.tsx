/**
 * src/ui/components/diagnosis/TransactionSelector.tsx
 *
 * Benchmark telemetry transaction browser for AI failure diagnosis
 * Displays observable metadata: ID, amount, failure code, payment method, synthetic customer ID, timestamp.
 */
import React from 'react';
import { Search, Receipt, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { Badge } from '../ui/badge.js';
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
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.failureCode.toLowerCase().includes(q) ||
      t.failureCategory.toLowerCase().includes(q) ||
      t.paymentMethod.toLowerCase().includes(q) ||
      (t.syntheticCustomerId && t.syntheticCustomerId.toLowerCase().includes(q))
    );
  });

  return (
    <Card className="border-border-hairline bg-[#020626]/95 flex flex-col h-[640px]">
      <CardHeader className="p-4 pb-3 border-b border-border-hairline/60 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Receipt className="w-4 h-4 text-ai-signal" />
            <span>Select Failed Transaction</span>
          </CardTitle>
          <Badge variant="cyan" className="text-[10px] font-mono px-2 py-0.5">
            {transactions.length} observable
          </Badge>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search txn ID, failure code, method..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#03081A] border border-border-hairline text-white font-sans text-xs rounded-[10px] py-2 pl-8 pr-3 focus:border-primary focus:outline-none transition-all placeholder:text-text-tertiary"
          />
        </div>
      </CardHeader>

      <CardContent className="p-2 flex-1 overflow-y-auto space-y-2 divide-y divide-border-hairline/20">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-text-tertiary text-xs font-sans space-y-2">
            <AlertTriangle className="w-6 h-6 mx-auto text-text-tertiary/60" />
            <p className="font-medium text-white/70">No failed payments matching filter.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-primary hover:underline text-[11px] font-mono"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          filtered.map((txn) => {
            const isSelected = txn.transactionId === selectedTxnId;
            // Deterministic synthetic customer identifier from transaction ID
            const customerId = txn.syntheticCustomerId || `CUS_${txn.transactionId.replace(/[^0-9]/g, '').slice(-4) || '81D4'}`;
            const formattedTime = txn.timestamp
              ? new Date(txn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : '10:42 AM';

            return (
              <div
                key={txn.transactionId}
                onClick={() => onSelect(txn)}
                className={`p-3 rounded-[12px] cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/20 border border-primary/50 text-white shadow-md'
                    : 'bg-[#03081A]/70 hover:bg-surface-elevated border border-border-hairline/30 text-text-secondary hover:text-white'
                }`}
              >
                {/* Top Row: Transaction ID & Amount */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-semibold text-white tracking-tight">
                    {txn.transactionId}
                  </span>
                  <CurrencyValue paise={txn.amountPaise} size="sm" variant="neutral" />
                </div>

                {/* Middle Row: Failure Code & Category Badge */}
                <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                  <span className="font-mono text-text-secondary truncate text-[10.5px]">
                    {txn.failureCode}
                  </span>
                  <Badge
                    variant={txn.failureCategory === 'technical' ? 'cyan' : txn.failureCategory === 'temporary' ? 'warning' : 'destructive'}
                    className="text-[9px] px-1.5 py-0 uppercase shrink-0"
                  >
                    {txn.failureCategory}
                  </Badge>
                </div>

                {/* Bottom Row: Customer ID & Method & Time */}
                <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary pt-1 border-t border-border-hairline/20">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-text-tertiary" />
                    {customerId}
                  </span>
                  <span>{txn.paymentMethod.toUpperCase()}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-text-tertiary" />
                    {formattedTime}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
