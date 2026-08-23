/**
 * DiagnosisScreen — AI Diagnosis & Financial Analyst Engine.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - 35px architectural note cards
 *  - 48px action buttons
 *  - 35px command input field
 *  - High-trust explainable Gemini AI telemetry
 */
import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader.js';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { Eyebrow } from '../components/Eyebrow.js';
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
    text: 'Why did my subscription renewal revenue drop yesterday morning?',
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
        text: 'Analyzing telemetry via Gemini agent... Historical retry models show high probability of recovery via Smart Routing.',
      },
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#03081A] text-white relative overflow-hidden">
      {/* Scrollable Chat & Telemetry Viewport */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center">
        <div className="max-w-[960px] w-full space-y-8 pb-28">
          {/* Screen Header */}
          <PageHeader
            eyebrow="Explainable AI Telemetry"
            eyebrowVariant="ai"
            title="AI Diagnosis & Root Cause"
            subtitle="Deep inspection of transaction failure vectors, issuing bank anomalies, and autonomous recuperation plans."
          />

          {/* Conversation & Analyst Notes Thread */}
          <div className="flex flex-col gap-8">
            {messages.map((msg, idx) => {
              if (msg.role === 'user') {
                return (
                  <div key={idx} className="flex justify-end w-full">
                    <div className="bg-surface border border-border-hairline rounded-[24px] rounded-tr-[4px] px-6 py-4 max-w-[80%] text-sm leading-relaxed text-white">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              // Assistant message
              return (
                <div key={idx} className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <Eyebrow variant="ai">Salvo Gemini Analyst</Eyebrow>
                    <span className="font-mono text-xs text-text-tertiary">
                      EXECUTION POLICY PASS
                    </span>
                  </div>

                  {msg.isDiagnosis ? (
                    /* Financial Analyst Note Card with 35px radius */
                    <div className="bg-surface border border-border-hairline rounded-[35px] overflow-hidden">
                      {/* Header */}
                      <div className="border-b border-border-hairline px-8 py-5 bg-[#03081A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <h2 className="font-sans text-[20px] font-normal text-white">
                            Financial Analyst Note
                          </h2>
                        </div>
                        <span className="font-mono text-xs text-text-tertiary">
                          INCIDENT ID:{' '}
                          <span className="text-white font-medium">{DEMO_DIAGNOSIS.id}</span>
                        </span>
                      </div>

                      {/* Content Grid */}
                      <div className="p-8 flex flex-col gap-6">
                        {/* Primary Root Cause */}
                        <div className="space-y-2">
                          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-semibold">
                            Primary Root Cause Vector
                          </span>
                          <div className="bg-[#03081A] border-l-2 border-risk p-4 rounded-r-[16px] font-sans text-sm leading-relaxed text-white">
                            {DEMO_DIAGNOSIS.rootCause}
                          </div>
                        </div>

                        {/* Affected Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-[24px] bg-[#03081A] border border-border-hairline">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                              Affected Volume
                            </span>
                            <span className="font-mono text-2xl text-white font-medium">
                              {DEMO_DIAGNOSIS.affectedTransactions.toLocaleString('en-IN')}{' '}
                              <span className="text-sm font-normal text-text-secondary">txns</span>
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border-hairline pt-3 sm:pt-0 sm:pl-5">
                            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                              Gross Value Impact
                            </span>
                            <CurrencyValue
                              paise={Math.abs(DEMO_DIAGNOSIS.grossValueImpactPaise)}
                              variant="risk"
                              size="lg"
                              prefix="-"
                            />
                          </div>
                        </div>

                        {/* Recovery Projection Box */}
                        <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/20 flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary font-semibold">
                                Estimated Autonomous Recovery
                              </span>
                              <div className="mt-1">
                                <CurrencyValue
                                  paise={DEMO_DIAGNOSIS.estimatedRecoverablePaise}
                                  variant="recovered"
                                  size="xl"
                                />
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <span className="font-mono text-xs text-ai-signal bg-ai-signal/10 border border-ai-signal/30 px-3 py-1 rounded-[17px] font-semibold">
                                {formatPercent(DEMO_DIAGNOSIS.successRatePercent / 100)} Projected
                                Confidence
                              </span>
                            </div>
                          </div>
                          <p className="font-sans text-xs text-text-secondary border-t border-primary/20 pt-3">
                            {DEMO_DIAGNOSIS.rationale}
                          </p>
                        </div>

                        {/* Action CTA with 48px radius */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => onNavigate?.('audit')}
                            className="px-6 py-2.5 rounded-[48px] border border-border-hairline hover:border-border-secondary text-text-secondary hover:text-white font-sans text-xs font-medium transition-colors"
                          >
                            View Audit Ledger
                          </button>
                          <button
                            onClick={() => onNavigate?.('simulator')}
                            className="px-6 py-2.5 rounded-[48px] bg-primary hover:bg-primary-hover text-white font-sans text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">bolt</span>
                            <span>Simulate Recovery Plan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Plain assistant response */
                    <div className="bg-surface border border-border-hairline rounded-[24px] p-6 text-sm text-text-secondary">
                      {msg.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Command Input Bar with 35px radius */}
      <div className="sticky bottom-0 bg-[#03081A]/90 backdrop-blur-md border-t border-border-hairline p-4 flex justify-center z-20">
        <div className="w-full max-w-[960px] relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini to diagnose a specific transaction ID or decline spike..."
            className="w-full bg-surface border border-border-hairline rounded-[35px] py-3.5 pl-6 pr-14 text-sm text-white focus:border-primary focus:outline-none transition-colors placeholder:text-text-tertiary"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-primary hover:bg-primary-hover text-white rounded-full transition-all shadow-sm"
            title="Send query"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
