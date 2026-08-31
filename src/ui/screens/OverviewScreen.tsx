/**
 * src/ui/screens/OverviewScreen.tsx
 *
 * Salvo Payment Recovery Command Center
 * Connects directly to GET /api/dashboard and GET /api/transactions
 */
import React, { useEffect, useState, useCallback } from 'react';
import { SalvoApi, type OverviewMetrics, SalvoApiError } from '../lib/api.js';
import type { ObservableTransaction } from '../../types/index.js';
import {
  DashboardHeader,
  DashboardKpiGrid,
  RecoveryPipeline,
  StrategyBreakdown,
  RecentTransactions,
  QuickActions,
  RazorpayConnectionCard,
} from '../components/dashboard/index.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { Button } from '../components/ui/button.js';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface OverviewScreenProps {
  onNavigate?: (route: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [transactions, setTransactions] = useState<ObservableTransaction[]>([]);
  const [systemHealthy, setSystemHealthy] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorMessage(null);

    try {
      // Parallel fetch metrics, health, and recent transactions
      const [dashboardMetrics, healthRes, txnsRes] = await Promise.all([
        SalvoApi.getDashboard(),
        SalvoApi.getHealth().catch(() => ({ status: 'degraded', timestamp: new Date().toISOString() })),
        SalvoApi.getTransactions(10).catch(() => []),
      ]);

      setMetrics(dashboardMetrics);
      setSystemHealthy(healthRes.status === 'healthy');
      setTransactions(txnsRes);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      if (err instanceof SalvoApiError) {
        setErrorMessage(`API Error (${err.statusCode || 500}): ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to fetch command center metrics.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and 30s auto-refresh interval
  useEffect(() => {
    void fetchDashboardData(false);

    const intervalId = setInterval(() => {
      void fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  // Loading skeleton state
  if (isLoading && !metrics) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40 rounded-[12px]" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-[18px]" />
          ))}
        </div>

        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 rounded-[24px]" />
          ))}
        </div>

        {/* Pipeline Funnel Skeleton */}
        <Skeleton className="h-48 rounded-[24px]" />

        {/* Table Skeleton */}
        <Skeleton className="h-64 rounded-[24px]" />
      </div>
    );
  }

  // Error State
  if (errorMessage && !metrics) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="p-8 rounded-[24px] bg-[#020626] border border-risk/40 text-center max-w-md w-full shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-risk/20 text-risk flex items-center justify-center mx-auto mb-4 border border-risk/40">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-sans mb-1">
            Telemetry Connection Error
          </h2>
          <p className="text-xs text-text-secondary mb-6 font-mono">
            {errorMessage}
          </p>
          <Button
            onClick={() => fetchDashboardData(false)}
            variant="default"
            size="lg"
            className="w-full gap-2 rounded-[48px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header with System Status & Refresh */}
      <DashboardHeader
        systemHealthy={systemHealthy}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchDashboardData(true)}
      />

      {/* 2. Razorpay Merchant Connection Banner */}
      <RazorpayConnectionCard />

      {/* 3. Quick Action Shortcuts */}
      <QuickActions onNavigate={(route) => onNavigate?.(route)} />

      {/* 4. 6-Card Primary KPI Grid */}
      <DashboardKpiGrid metrics={metrics} />

      {/* 5. Operational Recovery Pipeline Funnel */}
      <RecoveryPipeline metrics={metrics} />

      {/* 6. Strategy Breakdown & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Strategy Breakdown */}
        <StrategyBreakdown
          strategies={metrics.strategies}
          onNavigate={(route) => onNavigate?.(route)}
        />

        {/* Recent Monitored Transactions Stream */}
        <RecentTransactions
          transactions={transactions}
          onNavigate={(route) => onNavigate?.(route)}
        />
      </div>
    </div>
  );
};

export default OverviewScreen;
