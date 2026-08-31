/**
 * src/ui/components/dashboard/RecentTransactions.tsx
 *
 * Recent Monitored Transactions table backed by GET /api/transactions
 */
import React from 'react';
import { ArrowRight, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { StatusBadge } from '../StatusBadge.js';
import type { ObservableTransaction } from '../../../types/index.js';

export interface RecentTransactionsProps {
  transactions: ObservableTransaction[];
  onNavigate?: (route: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onNavigate,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-ai-signal" />
              <span>Recent Failure Telemetry Stream</span>
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary mt-0.5">
              Live observable transaction feed from payment gateways with zero ground-truth leakage.
            </CardDescription>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('execution')}
              className="text-xs font-mono text-ai-signal hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View in Live Execution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-text-tertiary text-xs font-mono">
            No transactions currently recorded in repository.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-y border-border-hairline bg-[#03081A] font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary font-semibold">
                <th className="py-3 px-6">Transaction ID</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Method & Gateway</th>
                <th className="py-3 px-4">Failure Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline/50 font-sans text-xs">
              {transactions.slice(0, 8).map((txn) => (
                <tr
                  key={txn.transactionId}
                  className="hover:bg-surface-elevated transition-colors"
                >
                  <td className="py-3.5 px-6 font-mono text-xs font-medium text-white">
                    <span className="hover:text-primary transition-colors cursor-pointer">
                      {txn.transactionId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <CurrencyValue paise={txn.amountPaise} size="sm" variant="default" />
                  </td>

                  <td className="py-3.5 px-4 font-mono text-text-secondary text-[11px]">
                    <span className="uppercase">{txn.paymentMethod}</span>
                    <span className="text-text-tertiary"> / {txn.gateway}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-text-secondary px-2 py-0.5 rounded bg-[#03081A] border border-border-hairline">
                      {txn.failureCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={txn.failureCategory} size="sm" />
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate?.('diagnosis')}
                      className="px-2.5 py-1 rounded-[8px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-mono transition-all font-semibold inline-flex items-center gap-1"
                    >
                      <span>Diagnose</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
