/**
 * src/ui/screens/AuditScreen.tsx
 *
 * Salvo Audit Trail & Immutable Compliance Ledger
 * Connects directly to GET /api/audit
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SalvoApi, SalvoApiError } from '../lib/api.js';
import type { AuditLogDocument } from '../../types/index.js';
import {
  AuditHeader,
  AuditSummaryCards,
  AuditFilters,
  AuditTable,
  TransactionInvestigationTimeline,
  LedgerIntegrityCard,
} from '../components/audit/index.js';
import { Card } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { AlertCircle } from 'lucide-react';

export const AuditScreen: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [selectedActor, setSelectedActor] = useState<string>('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [investigatedTxnId, setInvestigatedTxnId] = useState<string | null>(null);

  // 1. Fetch audit logs from GET /api/audit
  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const auditLogs = await SalvoApi.getAuditLogs(200);
      setLogs(auditLogs);
    } catch (err: unknown) {
      if (err instanceof SalvoApiError) {
        setErrorMessage(`Audit Ledger API Error: ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to connect to Salvo Audit Ledger.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAuditLogs();
  }, [loadAuditLogs]);

  // 2. Filtered logs computation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search query filter (matches transactionId or eventId)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTxn = log.transactionId.toLowerCase().includes(q);
        const matchesEventId = log.eventId.toLowerCase().includes(q);
        if (!matchesTxn && !matchesEventId) return false;
      }

      // Event type filter
      if (selectedEventType !== 'ALL' && log.eventType !== selectedEventType) {
        return false;
      }

      // Actor filter
      if (selectedActor !== 'ALL' && log.actor !== selectedActor) {
        return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedEventType, selectedActor]);

  // 3. Filtered logs for single transaction investigation
  const investigatedLogs = useMemo(() => {
    if (!investigatedTxnId) return [];
    return logs.filter((l) => l.transactionId === investigatedTxnId);
  }, [logs, investigatedTxnId]);

  // 4. Handle export JSON
  const handleExportJson = () => {
    if (logs.length === 0) return;
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salvo-audit-ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEventType('ALL');
    setSelectedActor('ALL');
    setInvestigatedTxnId(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header */}
      <AuditHeader
        totalCount={logs.length}
        onRefresh={loadAuditLogs}
        onExport={handleExportJson}
        isRefreshing={loading}
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
            onClick={loadAuditLogs}
            className="h-7 text-xs border-risk/40 hover:bg-risk/20 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 2. Overview Summary Cards */}
      <AuditSummaryCards logs={logs} />

      {/* 3. Search & Filter Bar */}
      <AuditFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEventType={selectedEventType}
        onEventTypeChange={setSelectedEventType}
        selectedActor={selectedActor}
        onActorChange={setSelectedActor}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Single Transaction Investigation Timeline */}
      {investigatedTxnId && (
        <div className="animate-fadeIn">
          <TransactionInvestigationTimeline
            transactionId={investigatedTxnId}
            logs={investigatedLogs}
            onClear={() => setInvestigatedTxnId(null)}
          />
        </div>
      )}

      {/* 5. Primary Audit Ledger Table */}
      {loading && logs.length === 0 ? (
        <Card className="border-border-hairline bg-[#020626]/95 p-6 space-y-3">
          <Skeleton className="h-10 rounded-[10px]" />
          <Skeleton className="h-12 rounded-[10px]" />
          <Skeleton className="h-12 rounded-[10px]" />
          <Skeleton className="h-12 rounded-[10px]" />
        </Card>
      ) : (
        <AuditTable
          logs={filteredLogs}
          expandedEventId={expandedEventId}
          onToggleExpand={(id) =>
            setExpandedEventId(expandedEventId === id ? null : id)
          }
          onSelectTransaction={(txnId) => {
            setInvestigatedTxnId(txnId);
            setSearchQuery(txnId);
          }}
        />
      )}

      {/* 6. Ledger Integrity Architecture */}
      <LedgerIntegrityCard />
    </div>
  );
};

export default AuditScreen;
