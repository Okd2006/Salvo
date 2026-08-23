/**
 * AuditScreen — Comprehensive ledger of transaction compliance and policy outcomes.
 *
 * Matches Stitch screen: "Audit Trail | Salvo AI"
 * Shows audit stats header, search bar, and compliance data table.
 *
 * Demo data from demo.ts. Wire to real MongoDB queries in later phases.
 */
import React, { useState } from 'react';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { DEMO_AUDIT_RECORDS } from '../data/demo.js';

interface AuditScreenProps {
  onNavigate?: (tab: string) => void;
}

const FAILURE_COLOR: Record<string, string> = {
  BAD_REQUEST_HEADER: 'bg-error/20 text-error',
  INVALID_CURRENCY_CODE: 'bg-error/20 text-error',
  RATE_LIMIT_EXCEEDED: 'bg-surface-container-highest text-on-surface-variant',
  SUSPICIOUS_VELOCITY: 'bg-error/20 text-error',
};

const POLICY_DOT: Record<string, string> = {
  'Override Applied': 'bg-primary-container',
  'Queued for Retry': 'bg-tertiary-container',
  'Blocked by Safety Gate': 'bg-error',
  'Hard Reject': 'bg-error',
  'Recovered Route B': 'bg-primary-container',
  'Pass-through': 'bg-on-surface-variant',
};

export const AuditScreen: React.FC<AuditScreenProps> = ({ onNavigate: _onNavigate }) => {
  const [query, setQuery] = useState('');
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const filtered = DEMO_AUDIT_RECORDS.filter(
    (r) =>
      query === '' ||
      r.txnId.toLowerCase().includes(query.toLowerCase()) ||
      r.failureCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-background text-on-surface overflow-hidden">
      <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-lg">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Audit Trail</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Comprehensive ledger of transaction compliance and policy execution outcomes.
            </p>
          </div>
          <div className="flex items-center gap-sm">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID or Code..."
                className="bg-surface-container border border-outline-variant rounded pl-xl pr-sm py-xs text-on-surface font-metric-md text-sm w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <button className="bg-surface-container border border-outline-variant text-on-surface font-label-caps text-label-caps px-md py-xs rounded hover:bg-surface-container-high transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="bg-surface-container border border-outline-variant text-on-surface font-label-caps text-label-caps px-md py-xs rounded hover:bg-surface-container-high transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-sm">
          <div className="bg-surface border border-outline-variant rounded p-sm flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
              Total Records Analyzed
            </span>
            <span className="font-metric-lg text-metric-lg text-on-surface">1.2M</span>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-sm flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
              Compliance Exceptions
            </span>
            <span className="font-metric-lg text-metric-lg text-error">3,492</span>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-sm flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
              Auto-Remediated
            </span>
            <span className="font-metric-lg text-metric-lg text-primary-container">2,810</span>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-sm flex flex-col justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
              Pending Review
            </span>
            <span className="font-metric-lg text-metric-lg text-tertiary-container">682</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface border border-outline-variant rounded overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  {[
                    'Transaction ID',
                    'Timestamp (UTC)',
                    'Failure Code',
                    'Confidence',
                    'Policy Result',
                    'Expected (INR)',
                    'Actual (INR)',
                    'Action',
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-sm px-md font-label-caps text-label-caps text-on-surface-variant font-semibold sticky top-0 bg-surface-container-low z-10"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-metric-md text-metric-md text-on-surface">
                {filtered.map((r) => {
                  const isExpanded = expandedTxn === r.txnId;
                  const failureColor = FAILURE_COLOR[r.failureCode] ?? 'bg-surface-container-highest text-on-surface-variant';
                  const policyDot = POLICY_DOT[r.policyResult] ?? 'bg-on-surface-variant';

                  return (
                    <React.Fragment key={r.txnId}>
                      <tr className="border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors group">
                        <td className="py-sm px-md text-on-surface-variant text-sm">{r.txnId}</td>
                        <td className="py-sm px-md text-on-surface-variant text-sm">{r.timestamp}</td>
                        <td className="py-sm px-md">
                          <span className={`${failureColor} px-xs py-1 rounded text-xs`}>
                            {r.failureCode}
                          </span>
                        </td>
                        <td className={`py-sm px-md text-right ${r.confidence >= 0.95 ? 'text-primary-container' : 'text-tertiary-container'}`}>
                          {r.confidence.toFixed(2)}
                        </td>
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-xs">
                            <div className={`w-2 h-2 rounded-full ${policyDot}`} />
                            <span className="font-body-sm text-body-sm">{r.policyResult}</span>
                          </div>
                        </td>
                        <td className="py-sm px-md text-right">
                          <CurrencyValue paise={r.expectedPaise} variant="neutral" size="sm" />
                        </td>
                        <td className="py-sm px-md text-right">
                          <CurrencyValue
                            paise={r.actualPaise}
                            variant={r.actualPaise > 0 ? 'recovered' : 'risk'}
                            size="sm"
                          />
                        </td>
                        <td className="py-sm px-md text-center">
                          <button
                            onClick={() => setExpandedTxn(isExpanded ? null : r.txnId)}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {isExpanded ? 'expand_less' : 'open_in_new'}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                          <td colSpan={8} className="px-lg py-md">
                            <div className="font-body-sm text-body-sm text-on-surface-variant space-y-xs">
                              <div>
                                <span className="text-on-surface-variant/60 uppercase font-label-caps text-label-caps">
                                  Audit Hash:{' '}
                                </span>
                                <span className="font-mono text-primary">{r.hash}</span>
                              </div>
                              <div>
                                <span className="text-on-surface-variant/60 uppercase font-label-caps text-label-caps">
                                  Policy Passed:{' '}
                                </span>
                                <span className={r.policyPassed ? 'text-primary-container' : 'text-error'}>
                                  {r.policyPassed ? 'YES' : 'NO — Safety Gate Enforced'}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="mt-auto border-t border-outline-variant bg-surface-container-low p-sm flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing 1–{filtered.length} of 3,492 exceptions
            </span>
            <div className="flex items-center gap-xs">
              <button
                disabled
                className="p-xs rounded hover:bg-surface-container-highest text-on-surface-variant disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {[1, 2, 3].map((p) => (
                <span
                  key={p}
                  className={`font-metric-md text-metric-md text-sm px-sm ${p === 1 ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  {p}
                </span>
              ))}
              <span className="font-metric-md text-metric-md text-on-surface-variant text-sm px-sm">
                ...
              </span>
              <button className="p-xs rounded hover:bg-surface-container-highest text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
