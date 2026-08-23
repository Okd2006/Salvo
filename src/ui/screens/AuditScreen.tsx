/**
 * AuditScreen — Immutable Compliance Ledger & Audit Trail.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - 35px architectural ledger enclosure
 *  - 48px export/filter buttons
 *  - 35px search input field
 *  - Cryptographic verification traces per transaction
 */
import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader.js';
import { TransactionRow } from '../components/TransactionRow.js';
import { DEMO_AUDIT_RECORDS } from '../data/demo.js';

interface AuditScreenProps {
  onNavigate?: (tab: string) => void;
}

export const AuditScreen: React.FC<AuditScreenProps> = () => {
  const [query, setQuery] = useState('');
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const filtered = DEMO_AUDIT_RECORDS.filter(
    (r) =>
      query === '' ||
      r.txnId.toLowerCase().includes(query.toLowerCase()) ||
      r.failureCode.toLowerCase().includes(query.toLowerCase()) ||
      r.hash.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto min-w-0 bg-[#03081A] text-white">
      <div className="max-w-[1280px] w-full mx-auto space-y-8">
        {/* Screen Header */}
        <PageHeader
          eyebrow="Immutable Compliance Ledger"
          eyebrowVariant="ai"
          title="Audit Trail"
          subtitle="Comprehensive cryptographic record of transaction diagnoses, safety policy validations, and execution hashes."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input with 35px radius */}
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-text-tertiary text-sm pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by ID, Code, Hash..."
                  className="bg-surface border border-border-hairline rounded-[35px] pl-10 pr-4 py-2 text-xs font-mono text-white focus:border-primary focus:outline-none w-56 transition-colors placeholder:text-text-tertiary"
                />
              </div>
              <button className="px-5 py-2 rounded-[48px] border border-border-hairline hover:border-border-secondary text-text-secondary hover:text-white font-sans text-xs font-medium transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                <span>Filter</span>
              </button>
              <button className="px-5 py-2 rounded-[48px] border border-border-hairline hover:border-border-secondary text-text-secondary hover:text-white font-sans text-xs font-medium transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Ledger</span>
              </button>
            </div>
          }
        />

        {/* High-Density Stats Grid (35px Radius) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border-hairline rounded-[35px] p-5 flex flex-col justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Total Records Analyzed
            </span>
            <span className="font-mono text-3xl text-white font-medium">1.2M</span>
            <span className="font-sans text-xs text-text-secondary">Historical transaction pool</span>
          </div>

          <div className="bg-surface border border-border-hairline rounded-[35px] p-5 flex flex-col justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Policy Exceptions
            </span>
            <span className="font-mono text-3xl text-risk font-medium">3,492</span>
            <span className="font-sans text-xs text-text-secondary">Flagged for safety review</span>
          </div>

          <div className="bg-surface border border-border-hairline rounded-[35px] p-5 flex flex-col justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Auto-Remediated
            </span>
            <span className="font-mono text-3xl text-recovered font-medium">2,810</span>
            <span className="font-sans text-xs text-text-secondary">Deterministic overrides applied</span>
          </div>

          <div className="bg-surface border border-border-hairline rounded-[35px] p-5 flex flex-col justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Pending Validation
            </span>
            <span className="font-mono text-3xl text-ai-signal font-medium">682</span>
            <span className="font-sans text-xs text-text-secondary">Active policy pipeline</span>
          </div>
        </div>

        {/* Audit Data Table Container (35px Radius) */}
        <div className="bg-surface border border-border-hairline rounded-[35px] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead>
                <tr className="border-b border-border-hairline bg-[#03081A] font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-semibold">
                  <th className="py-4 px-5">Transaction ID</th>
                  <th className="py-4 px-5">Timestamp (UTC)</th>
                  <th className="py-4 px-5">Failure Code</th>
                  <th className="py-4 px-5 text-right">Confidence</th>
                  <th className="py-4 px-5">Policy Decision</th>
                  <th className="py-4 px-5 text-right">Expected (INR)</th>
                  <th className="py-4 px-5 text-right">Actual (INR)</th>
                  <th className="py-4 px-5 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline/40">
                {filtered.map((r) => (
                  <TransactionRow
                    key={r.txnId}
                    txnId={r.txnId}
                    timestamp={r.timestamp}
                    failureCode={r.failureCode}
                    confidence={r.confidence}
                    policyResult={r.policyResult}
                    policyPassed={r.policyPassed}
                    expectedPaise={r.expectedPaise}
                    actualPaise={r.actualPaise}
                    hash={r.hash}
                    isExpanded={expandedTxn === r.txnId}
                    onToggleExpand={(id) => setExpandedTxn(expandedTxn === id ? null : id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-border-hairline bg-[#03081A] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-text-tertiary">
            <span>
              Showing {filtered.length} of 3,492 compliance events
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1 rounded-[8px] hover:bg-surface text-text-tertiary disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <span className="px-3 py-1 rounded-[8px] bg-primary/20 text-white font-medium">1</span>
              <span className="px-3 py-1 rounded-[8px] hover:bg-surface text-text-secondary cursor-pointer">
                2
              </span>
              <span className="px-3 py-1 rounded-[8px] hover:bg-surface text-text-secondary cursor-pointer">
                3
              </span>
              <span className="px-2">...</span>
              <button className="p-1 rounded-[8px] hover:bg-surface text-text-secondary">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
