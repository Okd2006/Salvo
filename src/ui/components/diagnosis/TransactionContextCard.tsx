import { Badge } from '../ui/badge.js';
/**
 * src/ui/components/diagnosis/TransactionContextCard.tsx
 *
 * Displays full observable context for the selected failed transaction
 */
import React from 'react';
import { Play, ShieldAlert, CreditCard, Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { CurrencyValue } from '../CurrencyValue.js';
import { Button } from '../ui/button.js';
import type { ObservableTransaction } from '../../../types/index.js';

export interface TransactionContextCardProps {
  transaction: ObservableTransaction;
  onDiagnose: () => void;
  isLoading: boolean;
}

export const TransactionContextCard: React.FC<TransactionContextCardProps> = ({
  transaction,
  onDiagnose,
  isLoading,
}) => {
  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-5 pb-3 border-b border-border-hairline/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold font-mono text-white">
                {transaction.transactionId}
              </CardTitle>
              <Badge variant="default">{transaction.failureCategory}</Badge>
            </div>
            <div className="text-xs font-mono text-text-tertiary mt-0.5">
              Observed Failure Trace • Ground-Truth Isolated
            </div>
          </div>

          <Button
            onClick={onDiagnose}
            disabled={isLoading}
            variant="glow"
            size="sm"
            className="gap-2 rounded-[12px] font-semibold text-xs h-9 px-4 shrink-0"
          >
            {isLoading ? (
              <div className="mr-1 h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isLoading ? 'Diagnosing...' : 'Run AI Diagnosis'}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {/* Context Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[16px] bg-[#03081A] border border-border-hairline/70 mb-4">
          <div className="space-y-1">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary block">
              Gross Amount
            </span>
            <CurrencyValue paise={transaction.amountPaise} size="md" variant="neutral" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary block">
              Payment Gateway
            </span>
            <div className="font-mono text-xs font-semibold text-white uppercase flex items-center gap-1">
              <Network className="w-3 h-3 text-ai-signal" />
              <span>{transaction.paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary block">
              Method
            </span>
            <div className="font-mono text-xs font-semibold text-white uppercase flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-primary" />
              <span>{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-tertiary block">
              Retry Count
            </span>
            <div className="font-mono text-xs font-semibold text-white">
              {transaction.retryCount} of 3 attempts
            </div>
          </div>
        </div>

        {/* Error Code & Message */}
        <div className="p-3 rounded-[12px] bg-[#03081A] border border-border-hairline/60 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-risk shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white">
                {transaction.failureCode}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase">
                ({transaction.failureCategory})
              </span>
            </div>
            <div className="font-sans text-xs text-text-secondary mt-0.5">
              {transaction.failureDescription || 'Issuer or gateway decline code observed.'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
