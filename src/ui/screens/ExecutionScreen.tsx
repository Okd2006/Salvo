import React, { useState } from 'react';
import { formatPaise } from '../../lib/currency.js';

interface ExecutionScreenProps {
  onNavigate?: (tab: string) => void;
}

export const ExecutionScreen: React.FC<ExecutionScreenProps> = () => {
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  const liveEvents = [
    {
      id: 'pay_NpX8172k',
      strategy: 'Smart Retry Engine',
      method: 'UPI Auto-Retry',
      amountPaise: 4823500,
      status: 'SUCCESS',
      timestamp: 'Just now (14:22:11 UTC)',
      steps: [
        { label: 'Gemini Diagnosis Complete', status: 'done', time: '14:22:05' },
        { label: 'Policy Gate Check Approved', status: 'done', time: '14:22:07' },
        { label: 'Razorpay API Payment Link Generated', status: 'done', time: '14:22:09' },
        { label: 'Webhook Confirmed Settlement', status: 'done', time: '14:22:11' },
      ],
      razorpayPayload: {
        entity: 'event',
        account_id: 'acc_7a1109m',
        event: 'payment_link.paid',
        contains: ['payment_link', 'payment'],
        payload: {
          payment_link: {
            id: 'plink_NpX8172k',
            amount: 4823500,
            currency: 'INR',
            status: 'paid',
          },
        },
      },
    },
    {
      id: 'pay_MpK9921b',
      strategy: 'Payment Link Switch',
      method: 'SMS + WhatsApp Link',
      amountPaise: 1450000,
      status: 'QUEUED',
      timestamp: '2 mins ago (14:20:00 UTC)',
      steps: [
        { label: 'Gemini Diagnosis Complete', status: 'done', time: '14:19:55' },
        { label: 'Policy Gate Check Approved', status: 'done', time: '14:19:58' },
        { label: 'Dispatching Payment Link SMS', status: 'active', time: '14:20:00' },
        { label: 'Awaiting Merchant Payment', status: 'pending', time: '--:--' },
      ],
      razorpayPayload: {
        id: 'plink_MpK9921b',
        short_url: 'https://rzp.io/i/Xk91a',
        status: 'created',
      },
    },
    {
      id: 'pay_LpQ4412z',
      strategy: 'Customer Re-engagement',
      method: 'Mandate Expiry Prompt',
      amountPaise: 320000,
      status: 'SUCCESS',
      timestamp: '5 mins ago (14:17:12 UTC)',
      steps: [
        { label: 'Gemini Diagnosis Complete', status: 'done', time: '14:17:00' },
        { label: 'Policy Gate Check Approved', status: 'done', time: '14:17:02' },
        { label: 'Notification Sent to Customer', status: 'done', time: '14:17:05' },
        { label: 'Mandate Updated & Charged', status: 'done', time: '14:17:12' },
      ],
      razorpayPayload: {
        id: 'pay_LpQ4412z',
        status: 'captured',
        method: 'card',
      },
    },
  ];

  return (
    <main className="flex-1 p-xl flex flex-col gap-xl overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Header */}
      <div className="flex flex-col gap-xs mb-sm">
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Live Execution Engine
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Real-time execution pipeline dispatching recovery actions to Razorpay Test APIs.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container border border-outline-variant p-md rounded-lg flex flex-col gap-xs">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase">
            Active Executions
          </span>
          <span className="font-mono text-2xl font-bold text-primary">14 Running</span>
        </div>
        <div className="bg-surface-container border border-outline-variant p-md rounded-lg flex flex-col gap-xs">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase">
            API Webhook Latency
          </span>
          <span className="font-mono text-2xl font-bold text-on-surface">142 ms</span>
        </div>
        <div className="bg-surface-container border border-outline-variant p-md rounded-lg flex flex-col gap-xs">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase">
            Execution Success Rate
          </span>
          <span className="font-mono text-2xl font-bold text-primary">94.2%</span>
        </div>
      </div>

      {/* Live Timeline List */}
      <div className="space-y-lg">
        {liveEvents.map((evt, idx) => (
          <div
            key={idx}
            className="bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col gap-md"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-md pb-sm border-b border-outline-variant">
              <div className="flex items-center gap-md">
                <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div>
                  <div className="flex items-center gap-sm">
                    <span className="font-mono text-base font-bold text-on-surface">
                      {evt.id}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      ({evt.strategy})
                    </span>
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    {evt.timestamp} • {evt.method}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-lg">
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-primary">
                    {formatPaise(evt.amountPaise)}
                  </div>
                  <div
                    className={`font-label-caps text-xs uppercase font-bold ${
                      evt.status === 'SUCCESS' ? 'text-primary' : 'text-tertiary-container'
                    }`}
                  >
                    {evt.status}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTxn(evt)}
                  className="px-md py-sm bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface font-mono text-xs rounded transition-colors flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>Inspect API</span>
                </button>
              </div>
            </div>

            {/* Execution Steps Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-md pt-xs">
              {evt.steps.map((st, sIdx) => (
                <div key={sIdx} className="flex flex-col gap-xs">
                  <div className="flex items-center gap-xs">
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        st.status === 'done'
                          ? 'bg-primary'
                          : st.status === 'active'
                          ? 'bg-tertiary-container animate-pulse'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-on-surface-variant">
                      {st.time}
                    </span>
                  </div>
                  <span className="font-body-sm text-xs text-on-surface font-medium">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Razorpay Payload Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-lg max-w-2xl w-full flex flex-col gap-md shadow-2xl">
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
              <div>
                <div className="font-mono text-lg font-bold text-primary">
                  Razorpay Test API Payload ({selectedTxn.id})
                </div>
                <div className="font-mono text-xs text-on-surface-variant">
                  Method: {selectedTxn.method}
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-md rounded border border-outline-variant overflow-x-auto">
              <pre className="font-mono text-xs text-on-surface leading-relaxed">
                {JSON.stringify(selectedTxn.razorpayPayload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-md py-sm bg-surface-container-high border border-outline-variant text-on-surface rounded text-sm hover:bg-surface-container-highest"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
