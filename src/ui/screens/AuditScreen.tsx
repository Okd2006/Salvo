import React, { useState } from 'react';
import { formatPaise } from '../../lib/currency.js';

interface AuditScreenProps {
  onNavigate?: (tab: string) => void;
}

export const AuditScreen: React.FC<AuditScreenProps> = () => {
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const auditRecords = [
    {
      txnId: 'pay_NpX8172k',
      timestamp: '14:22:11.094 UTC',
      failureCode: 'GATEWAY_TIMEOUT',
      confidence: '0.94',
      policyResult: 'Smart Retry Approved',
      status: 'success',
      expectedPaise: 4823500,
      actualPaise: 4823500,
      hash: 'sha256:8f91b42c99a01e3b',
      payload: {
        diagnosis: { failureType: 'temporary', recoverability: 0.82 },
        policyVerdict: { passed: true, rule: 'RULE_MIN_RECOVERABILITY' },
        razorpayApi: { method: 'paymentLink.create', status: 'created' },
      },
    },
    {
      txnId: 'pay_MpK9921b',
      timestamp: '14:21:54.810 UTC',
      failureCode: 'INSUFFICIENT_FUNDS',
      confidence: '0.88',
      policyResult: 'Payment Link Created',
      status: 'queued',
      expectedPaise: 1450000,
      actualPaise: 0,
      hash: 'sha256:7a42c11b88e12d4a',
      payload: {
        diagnosis: { failureType: 'payment_method', recoverability: 0.64 },
        policyVerdict: { passed: true, rule: 'RULE_PAYMENT_LINK_ALLOW' },
        razorpayApi: { method: 'paymentLink.create', shortUrl: 'https://rzp.io/i/Xk91a' },
      },
    },
    {
      txnId: 'pay_LpQ4412z',
      timestamp: '14:20:12.340 UTC',
      failureCode: 'EXPIRED_MANDATE',
      confidence: '0.76',
      policyResult: 'Reminder Scheduled',
      status: 'success',
      expectedPaise: 320000,
      actualPaise: 320000,
      hash: 'sha256:3b19f04c22a101ee',
      payload: {
        diagnosis: { failureType: 'customer', recoverability: 0.41 },
        policyVerdict: { passed: true, rule: 'RULE_REENGAGEMENT_ALLOW' },
        razorpayApi: { notificationSent: true },
      },
    },
    {
      txnId: 'pay_JpA1109m',
      timestamp: '14:18:05.112 UTC',
      failureCode: 'SUSPICIOUS_VELOCITY',
      confidence: '0.99',
      policyResult: 'Blocked by Safety Gate',
      status: 'blocked',
      expectedPaise: 4500000,
      actualPaise: 0,
      hash: 'sha256:91c002ff11a88c2b',
      payload: {
        diagnosis: { failureType: 'unrecoverable', recoverability: 0.05 },
        policyVerdict: { passed: false, rule: 'RULE_UNRECOVERABLE_BLOCK' },
      },
    },
  ];

  const filteredRecords = auditRecords.filter(
    (r) =>
      r.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.failureCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-xl flex flex-col gap-lg overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xs">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Cryptographically verifiable audit log of diagnoses, policy verdicts, and API receipts.
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TXN ID or Code..."
              className="bg-surface-container border border-outline-variant rounded pl-[32px] pr-sm py-xs text-on-surface font-mono text-sm w-64 outline-none focus:border-primary"
            />
          </div>
          <button className="bg-surface-container border border-outline-variant text-on-surface font-label-caps text-label-caps px-md py-xs rounded hover:bg-surface-container-high transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
        <div className="bg-surface-container border border-outline-variant rounded p-sm flex flex-col justify-between">
          <span className="font-label-caps text-xs text-on-surface-variant mb-xs">Total Records</span>
          <span className="font-mono text-xl font-bold text-on-surface">12,842</span>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded p-sm flex flex-col justify-between">
          <span className="font-label-caps text-xs text-on-surface-variant mb-xs">Safety Blocks</span>
          <span className="font-mono text-xl font-bold text-risk">1,492</span>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded p-sm flex flex-col justify-between">
          <span className="font-label-caps text-xs text-on-surface-variant mb-xs">Auto-Remediated</span>
          <span className="font-mono text-xl font-bold text-primary">8,410</span>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded p-sm flex flex-col justify-between">
          <span className="font-label-caps text-xs text-on-surface-variant mb-xs">Pending Retries</span>
          <span className="font-mono text-xl font-bold text-tertiary-container">682</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container border border-outline-variant rounded overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high">
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold">
                  Transaction ID
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold">
                  Timestamp (UTC)
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold">
                  Failure Code
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold text-right">
                  Confidence
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold">
                  Policy Result
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold text-right">
                  Expected (INR)
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold text-right">
                  Actual (INR)
                </th>
                <th className="py-sm px-md font-label-caps text-xs text-on-surface-variant font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm text-on-surface">
              {filteredRecords.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors group"
                >
                  <td className="py-sm px-md text-primary font-bold">{r.txnId}</td>
                  <td className="py-sm px-md text-on-surface-variant text-xs">{r.timestamp}</td>
                  <td className="py-sm px-md">
                    <span className="bg-surface-container-high border border-outline-variant text-on-surface px-xs py-0.5 rounded text-xs">
                      {r.failureCode}
                    </span>
                  </td>
                  <td className="py-sm px-md text-right text-primary">{r.confidence}</td>
                  <td className="py-sm px-md">
                    <div className="flex items-center gap-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          r.status === 'success'
                            ? 'bg-primary'
                            : r.status === 'blocked'
                            ? 'bg-risk'
                            : 'bg-tertiary-container'
                        }`}
                      />
                      <span className="font-body-sm text-sm">{r.policyResult}</span>
                    </div>
                  </td>
                  <td className="py-sm px-md text-right">{formatPaise(r.expectedPaise)}</td>
                  <td
                    className={`py-sm px-md text-right ${
                      r.actualPaise > 0 ? 'text-primary' : 'text-risk'
                    }`}
                  >
                    {formatPaise(r.actualPaise)}
                  </td>
                  <td className="py-sm px-md text-center">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-lg max-w-2xl w-full flex flex-col gap-md shadow-2xl">
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
              <div>
                <div className="font-mono text-lg font-bold text-primary">
                  {selectedRecord.txnId} Audit Record
                </div>
                <div className="font-mono text-xs text-on-surface-variant">
                  Hash: {selectedRecord.hash}
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-md rounded border border-outline-variant overflow-x-auto">
              <div className="font-label-caps text-xs text-on-surface-variant uppercase mb-xs font-semibold">
                Payload Proof
              </div>
              <pre className="font-mono text-xs text-on-surface leading-relaxed">
                {JSON.stringify(selectedRecord.payload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-md py-sm bg-surface-container-high border border-outline-variant text-on-surface rounded text-sm hover:bg-surface-container-highest"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
