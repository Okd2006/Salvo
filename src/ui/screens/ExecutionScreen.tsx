/**
 * src/ui/screens/ExecutionScreen.tsx
 *
 * Salvo Live Recovery Execution Console
 * Connects directly to POST /api/recover, GET /api/transactions, GET /api/actions, and GET /api/metrics
 */
import React, { useState, useEffect, useCallback } from 'react';
import { SalvoApi, SalvoApiError, type OverviewMetrics } from '../lib/api.js';
import type {
  ObservableTransaction,
  RecoverySessionResult,
  RecoveryActionDocument,
} from '../../types/index.js';
import {
  ExecutionHeader,
  ExecutionMetricsCards,
  ExecutionControlCard,
  ExecutionSessionResultCard,
} from '../components/execution/index.js';
import { ExecutionTimeline, type TimelineRow } from '../components/ExecutionTimeline.js';
import { Card } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { AlertCircle, Zap } from 'lucide-react';

export interface ExecutionScreenProps {
  onNavigate?: (route: string) => void;
  initialTransactionId?: string;
}

export const ExecutionScreen: React.FC<ExecutionScreenProps> = ({
  initialTransactionId,
}) => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [transactions, setTransactions] = useState<ObservableTransaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<ObservableTransaction | null>(null);
  const [historyActions, setHistoryActions] = useState<RecoveryActionDocument[]>([]);

  const [sessionResult, setSessionResult] = useState<RecoverySessionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch initial transactions, metrics, and recent actions
  const loadConsoleData = useCallback(async () => {
    setIsLoadingInitial(true);
    setErrorMessage(null);

    try {
      const [m, txns, acts] = await Promise.all([
        SalvoApi.getMetrics().catch(() => null),
        SalvoApi.getTransactions(30).catch(() => []),
        SalvoApi.getRecoveryActions(20).catch(() => []),
      ]);

      if (m) setMetrics(m);
      setTransactions(txns);
      setHistoryActions(acts);

      if (txns.length > 0) {
        const matched = initialTransactionId
          ? txns.find((t) => t.transactionId === initialTransactionId)
          : txns[0];
        setSelectedTxn(matched || txns[0]);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to connect to Salvo Live Execution Engine.'
      );
    } finally {
      setIsLoadingInitial(false);
    }
  }, [initialTransactionId]);

  useEffect(() => {
    void loadConsoleData();
  }, [loadConsoleData]);

  // 2. Dispatch live autonomous recovery via POST /api/recover
  const handleExecuteLive = async () => {
    if (!selectedTxn || isExecuting) return;

    setIsExecuting(true);
    setErrorMessage(null);
    setSessionResult(null);

    try {
      const res = await SalvoApi.recover(selectedTxn.transactionId);
      if (res.success && res.recoverySession) {
        setSessionResult(res.recoverySession);

        // Refresh metrics and recovery actions
        const [updatedMetrics, updatedActions] = await Promise.all([
          SalvoApi.getMetrics().catch(() => null),
          SalvoApi.getRecoveryActions(20).catch(() => []),
        ]);
        if (updatedMetrics) setMetrics(updatedMetrics);
        if (updatedActions) setHistoryActions(updatedActions);
      } else {
        setErrorMessage('Execution completed with unexpected status.');
      }
    } catch (err: unknown) {
      if (err instanceof SalvoApiError) {
        setErrorMessage(`Execution Engine Error: ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to execute autonomous recovery on target transaction.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  // Convert actions to TimelineRow format
  const timelineRows: TimelineRow[] = historyActions.map((act) => {
    const isSuccess = act.status === 'succeeded';
    const isBlocked = act.status === 'blocked';

    return {
      timestamp: act.createdAt
        ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'LIVE',
      transactionId: act.transactionId,
      triggerType: act.strategy.replace(/_/g, ' '),
      interventionCostPaise: act.interventionCostPaise,
      recoveredPaise: act.recoveredAmountPaise || 0,
      confidenceScore: act.confidence,
      status: (isSuccess ? 'RECOVERED' : isBlocked ? 'POLICY BLOCKED' : 'FAILED') as 'RECOVERED' | 'POLICY BLOCKED' | 'FAILED',
    };
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <ExecutionHeader
        onRefresh={loadConsoleData}
        isRefreshing={isLoadingInitial}
        isExecuting={isExecuting}
      />

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-[16px] bg-risk/10 border border-risk/40 text-risk text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-sans font-medium">{errorMessage}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExecuteLive}
            className="h-7 text-xs border-risk/40 hover:bg-risk/20 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 2. Real-time Telemetry Metrics */}
      <ExecutionMetricsCards metrics={metrics} isExecuting={isExecuting} />

      {/* 3. Target Transaction & Dispatch Control */}
      <ExecutionControlCard
        transactions={transactions}
        selectedTxn={selectedTxn}
        onSelectTxn={setSelectedTxn}
        onExecute={handleExecuteLive}
        isExecuting={isExecuting}
      />

      {/* 4. In-Progress Dispatch Skeleton */}
      {isExecuting && (
        <Card className="border-border-hairline bg-[#020626]/95 p-8 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-[14px] bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto">
            <Zap className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Dispatching Autonomous Recovery Loop...
            </h3>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Observing Failure Trace &rarr; LLM Reasoning &rarr; Policy Gate Check &rarr; Razorpay Test Execution &rarr; MongoDB Ledger Audit
            </p>
          </div>
          <Skeleton className="h-28 rounded-[14px]" />
        </Card>
      )}

      {/* 5. Execution Session Outcome */}
      {sessionResult && !isExecuting && (
        <div className="animate-fadeIn">
          <ExecutionSessionResultCard sessionResult={sessionResult} />
        </div>
      )}

      {/* 6. Live Execution Timeline Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-sans text-base font-bold text-white">
            Autonomous Execution Ledger
          </h2>
          <span className="font-mono text-[11px] text-text-tertiary">
            LIVE OBSERVABILITY STREAM
          </span>
        </div>

        {timelineRows.length === 0 ? (
          <Card className="border-border-hairline bg-[#020626]/95 p-8 text-center text-xs font-mono text-text-tertiary">
            No recovery actions executed yet. Select a transaction and click &quot;Dispatch Live Recovery&quot;.
          </Card>
        ) : (
          <ExecutionTimeline rows={timelineRows} />
        )}
      </div>
    </div>
  );
};

export default ExecutionScreen;
