/**
 * DiagnosisScreen — AI Analyst chat interface.
 *
 * Matches Stitch screen: "AI Diagnosis | Salvo AI"
 * Shows the "Financial Analyst Note" card format from the Stitch source.
 *
 * No Gemini calls are made here. The demo response is sourced from demo.ts.
 * Replace the demo message with a real API call in a later phase.
 */
import React, { useState } from 'react';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { DEMO_DIAGNOSIS } from '../data/demo.js';
import { formatPercent } from '../../lib/currency.js';

interface DiagnosisScreenProps {
  onNavigate?: (tab: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text?: string;
  isDiagnosis?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'user',
    text: 'Why did my revenue drop yesterday?',
  },
  {
    role: 'assistant',
    isDiagnosis: true,
  },
];

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'assistant',
        text: 'Diagnosis request received. Connect Gemini API in Phase 2 to process this query.',
      },
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-background text-on-surface relative overflow-hidden">
      {/* Chat Canvas */}
      <div className="flex-1 overflow-y-auto p-lg lg:p-xl flex flex-col gap-lg items-center relative z-10">
        <div className="w-full max-w-[800px] flex flex-col gap-xl pb-24">
          {messages.map((msg, idx) => {
            if (msg.role === 'user') {
              return (
                <div key={idx} className="flex justify-end w-full">
                  <div className="bg-surface-container border border-outline-variant rounded-lg rounded-tr-none p-md max-w-[80%]">
                    <p className="font-body-md text-body-md text-on-surface">{msg.text}</p>
                  </div>
                </div>
              );
            }

            // Assistant message
            return (
              <div key={idx} className="flex flex-col gap-md w-full">
                {/* Avatar / label */}
                <div className="flex items-center gap-sm text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest">
                    Salvo Analyst Engine
                  </span>
                </div>

                {msg.isDiagnosis ? (
                  /* Financial Analyst Note card — Stitch pattern */
                  <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    {/* Note header */}
                    <div className="border-b border-outline-variant px-lg py-md bg-surface-container-low flex justify-between items-center">
                      <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                        Financial Analyst Note
                      </h2>
                      <span className="font-metric-md text-metric-md text-on-surface-variant text-sm">
                        ID:{' '}
                        <span className="text-on-surface">{DEMO_DIAGNOSIS.id}</span>
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-lg flex flex-col gap-lg">
                      {/* Root Cause */}
                      <div className="flex flex-col gap-sm">
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Primary Root Cause
                        </h3>
                        <div className="bg-surface-container-high border-l-2 border-error p-md rounded-r-md">
                          <p className="font-body-md text-body-md text-on-surface">
                            {DEMO_DIAGNOSIS.rootCause}
                          </p>
                        </div>
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-2 gap-md border-y border-outline-variant py-md my-sm">
                        <div className="flex flex-col gap-xs">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                            Affected Transactions
                          </span>
                          <span className="font-metric-lg text-metric-lg text-on-surface">
                            {DEMO_DIAGNOSIS.affectedTransactions.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex flex-col gap-xs items-end">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                            Gross Value Impact
                          </span>
                          <CurrencyValue
                            paise={Math.abs(DEMO_DIAGNOSIS.grossValueImpactPaise)}
                            variant="risk"
                            size="lg"
                          />
                        </div>
                      </div>

                      {/* Recovery Projection */}
                      <div className="flex flex-col gap-sm bg-primary/5 rounded-lg border border-primary/20 p-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />
                        <div className="flex justify-between items-end relative z-10">
                          <div className="flex flex-col gap-xs">
                            <span className="font-label-caps text-label-caps text-primary uppercase">
                              Estimated Recoverable
                            </span>
                            <CurrencyValue
                              paise={DEMO_DIAGNOSIS.estimatedRecoverablePaise}
                              variant="recovered"
                              size="lg"
                            />
                          </div>
                          <div className="text-right">
                            <span className="font-metric-md text-metric-md text-primary bg-primary/10 px-2 py-1 rounded text-sm">
                              {formatPercent(DEMO_DIAGNOSIS.successRatePercent / 100)} Success Rate
                            </span>
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm relative z-10">
                          {DEMO_DIAGNOSIS.rationale}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-md pt-sm">
                        <button className="px-md py-2 border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-DEFAULT hover:bg-surface-container-high transition-colors">
                          View Logs
                        </button>
                        <button
                          onClick={() => onNavigate?.('execution')}
                          className="px-md py-2 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center gap-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">bolt</span>
                          Initialize Recovery Protocol
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Plain assistant text response */
                  <div className="bg-surface-container border border-outline-variant rounded-lg p-md">
                    <p className="font-body-md text-body-md text-on-surface">{msg.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed chat input bar */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur-md border-t border-outline-variant p-md flex justify-center z-20">
        <div className="w-full max-w-[800px] relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask another question or type a command..."
            className="w-full bg-surface-container border border-outline-variant rounded-lg py-md pl-md pr-xl text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder:text-on-surface-variant/50"
          />
          <button
            onClick={handleSend}
            className="absolute right-sm top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container rounded-DEFAULT hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
