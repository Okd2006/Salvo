/**
 * src/ui/screens/DiagnosisScreen.tsx
 *
 * Salvo AI Recovery Diagnosis Workspace
 * Connects directly to POST /api/diagnose, POST /api/policy-gate, and GET /api/transactions
 */
import React, { useEffect, useState, useCallback } from 'react';
import { SalvoApi, SalvoApiError } from '../lib/api.js';
import type {
  ObservableTransaction,
  RecoveryRecommendation,
  PolicyResult,
} from '../../types/index.js';
import {
  DiagnosisHeader,
  TransactionSelector,
  TransactionContextCard,
  DiagnosisResultCard,
  DecisionEvidenceCard,
  PolicyGateCard,
  RecoveryActionCard,
} from '../components/diagnosis/index.js';
import { Card, CardContent } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { BrainCircuit, AlertCircle } from 'lucide-react';

export interface DiagnosisScreenProps {
  onNavigate?: (route: string) => void;
  initialTransactionId?: string;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({
  onNavigate,
  initialTransactionId,
}) => {
  const [transactions, setTransactions] = useState<ObservableTransaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<ObservableTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [recommendation, setRecommendation] = useState<RecoveryRecommendation | null>(null);
  const [diagnosedAt, setDiagnosedAt] = useState<string | undefined>(undefined);
  const [policyResult, setPolicyResult] = useState<PolicyResult | null>(null);

  const [isLoadingTxns, setIsLoadingTxns] = useState<boolean>(true);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [isEvaluatingPolicy, setIsEvaluatingPolicy] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch available observable transactions on mount
  const loadTransactions = useCallback(async () => {
    setIsLoadingTxns(true);
    setErrorMessage(null);
    try {
      const txns = await SalvoApi.getTransactions(50, undefined, 'failed');
      setTransactions(txns);

      if (txns.length > 0) {
        // Match initialTransactionId or default to first
        const matched = initialTransactionId
          ? txns.find((t) => t.transactionId === initialTransactionId)
          : txns[0];
        setSelectedTxn(matched || txns[0]);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load observable transactions'
      );
    } finally {
      setIsLoadingTxns(false);
    }
  }, [initialTransactionId]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  // 2. Select transaction and reset prior diagnosis state
  const handleSelectTransaction = (txn: ObservableTransaction) => {
    setSelectedTxn(txn);
    setRecommendation(null);
    setPolicyResult(null);
    setErrorMessage(null);
  };

  // 3. Run AI Diagnosis via POST /api/diagnose
  const handleRunDiagnosis = async () => {
    if (!selectedTxn || isDiagnosing) return;

    setIsDiagnosing(true);
    setErrorMessage(null);
    setRecommendation(null);
    setPolicyResult(null);

    try {
      const diagRes = await SalvoApi.diagnose(selectedTxn.transactionId);
      if (diagRes.success && diagRes.recommendation) {
        setRecommendation(diagRes.recommendation);
        setDiagnosedAt(diagRes.diagnosedAt);

        // Auto-evaluate Deterministic Policy Gate
        setIsEvaluatingPolicy(true);
        try {
          const polRes = await SalvoApi.evaluatePolicy(
            selectedTxn.transactionId,
            diagRes.recommendation
          );
          if (polRes.success) {
            setPolicyResult(polRes.policyResult);
          }
        } catch {
          // Policy check will remain available manually
        } finally {
          setIsEvaluatingPolicy(false);
        }
      }
    } catch (err: unknown) {
      if (err instanceof SalvoApiError) {
        setErrorMessage(`Diagnosis Engine Error: ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to complete AI diagnosis on transaction.');
      }
    } finally {
      setIsDiagnosing(false);
    }
  };

  // 4. Manually trigger policy evaluation
  const handleEvaluatePolicy = async () => {
    if (!selectedTxn || !recommendation || isEvaluatingPolicy) return;
    setIsEvaluatingPolicy(true);
    try {
      const polRes = await SalvoApi.evaluatePolicy(selectedTxn.transactionId, recommendation);
      if (polRes.success) {
        setPolicyResult(polRes.policyResult);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Policy Gate evaluation failed'
      );
    } finally {
      setIsEvaluatingPolicy(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <DiagnosisHeader onRefresh={loadTransactions} isRefreshing={isLoadingTxns} />

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
            onClick={() => setErrorMessage(null)}
            className="h-7 text-xs border-risk/40 hover:bg-risk/20 text-white"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Workspace 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 Cols): Transaction Selector */}
        <div className="lg:col-span-4 space-y-4">
          <TransactionSelector
            transactions={transactions}
            selectedTxnId={selectedTxn?.transactionId || ''}
            onSelect={handleSelectTransaction}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right Column (8 Cols): Context, Diagnosis & Policy Workflow */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTxn ? (
            <>
              {/* Selected Transaction Context */}
              <TransactionContextCard
                transaction={selectedTxn}
                onDiagnose={handleRunDiagnosis}
                isLoading={isDiagnosing}
              />

              {/* In-Progress Diagnosis Skeleton */}
              {isDiagnosing && (
                <Card className="border-border-hairline bg-[#020626]/95 p-6 text-center space-y-4 animate-pulse">
                  <div className="w-12 h-12 rounded-[14px] bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto">
                    <BrainCircuit className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-sans">
                      Analyzing Telemetry & Reasoning Root Cause...
                    </h3>
                    <p className="text-xs text-text-secondary font-mono mt-1">
                      Querying Groq GPT-OSS • Isolating Ground Truth • Evaluating Error Codes
                    </p>
                  </div>
                  <Skeleton className="h-24 rounded-[14px]" />
                </Card>
              )}

              {/* Diagnosis Result */}
              {recommendation && (
                <div className="space-y-6 animate-fadeIn">
                  <DiagnosisResultCard
                    recommendation={recommendation}
                    diagnosedAt={diagnosedAt}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Decision Evidence */}
                    <DecisionEvidenceCard evidence={recommendation.evidence} />

                    {/* Policy Gate Verification */}
                    <PolicyGateCard
                      policyResult={policyResult}
                      onEvaluatePolicy={handleEvaluatePolicy}
                      isEvaluating={isEvaluatingPolicy}
                    />
                  </div>

                  {/* Recovery Action Dispatch */}
                  <RecoveryActionCard
                    recommendation={recommendation}
                    policyResult={policyResult}
                    onNavigate={onNavigate}
                  />
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <Card className="border-border-hairline bg-[#020626]/95 p-12 text-center">
              <CardContent className="space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  Select a Failed Transaction
                </h3>
                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  Choose an observable transaction from the list on the left to run AI failure diagnosis, inspect decision evidence, and verify deterministic policy authorization.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisScreen;
