import React, { useState } from 'react';
import { formatPaise } from '../../lib/currency.js';

interface DiagnosisScreenProps {
  onNavigate?: (tab: string) => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; diagnosis?: any }[]
  >([
    {
      role: 'user',
      text: 'Why did my revenue drop yesterday for order_992182?',
    },
    {
      role: 'assistant',
      text: 'Analysis complete for transaction pay_NpX8172k (order_992182). Gemini AI Diagnosis Engine identified a transient bank gateway timeout on HDFC UPI.',
      diagnosis: {
        transactionId: 'pay_NpX8172k',
        orderId: 'order_992182',
        amountPaise: 4823500, // ₹48,235.00
        failureType: 'temporary',
        recoverability: 0.82,
        recommendedStrategy: 'smart_retry',
        confidence: 0.94,
        evidence: [
          'HDFC UPI gateway latency spiked to >4500ms at 14:22 UTC.',
          'Customer account has 94% successful historical payment record.',
          'No fraud flags or velocity limit breaches detected.',
        ],
        expectedRecoveryPaise: 3955270,
        merchantNarrative:
          'Transaction failed due to temporary issuer bank timeout rather than insufficient funds or customer intent. A delayed smart retry at 14:45 UTC has an 82% probability of successful recovery.',
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');

  const handleSend = () => {
    if (!inputPrompt.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: inputPrompt },
      {
        role: 'assistant',
        text: `Executing diagnosis scan for prompt: "${inputPrompt}". Diagnosing transaction patterns and verifying policy rules...`,
      },
    ]);
    setInputPrompt('');
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden text-on-surface">
      {/* Page Header */}
      <div className="p-lg lg:px-xl border-b border-outline-variant flex items-center justify-between">
        <div>
          <h1 className="font-display-lg text-2xl font-semibold text-on-surface">AI Diagnosis Engine</h1>
          <p className="font-body-sm text-on-surface-variant">
            Structured Gemini analysis & diagnostic evidence ledger for payment failures.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="font-label-caps text-xs text-on-surface-variant uppercase">Model:</span>
          <span className="font-mono text-xs text-primary px-sm py-0.5 rounded bg-primary/10 border border-primary/20">
            gemini-1.5-flash
          </span>
        </div>
      </div>

      {/* Chat Canvas & Thread */}
      <div className="flex-1 overflow-y-auto p-lg lg:p-xl flex flex-col items-center">
        <div className="w-full max-w-[840px] flex flex-col gap-xl pb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className="w-full">
              {msg.role === 'user' ? (
                <div className="flex justify-end w-full">
                  <div className="bg-surface-container-high border border-outline-variant rounded-lg rounded-tr-none p-md max-w-[80%] shadow-sm">
                    <p className="font-body-md text-on-surface">{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-md w-full">
                  {/* Avatar / Label */}
                  <div className="flex items-center gap-sm text-primary">
                    <span className="material-symbols-outlined text-[20px]" data-weight="fill">
                      psychology
                    </span>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                      Salvo Gemini Analyst Engine
                    </span>
                  </div>

                  {/* Diagnosis Card */}
                  <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg">
                    <div className="p-md border-b border-outline-variant bg-surface-container-high flex flex-wrap items-center justify-between gap-sm">
                      <div className="flex items-center gap-md">
                        <span className="font-mono text-sm font-bold text-on-surface">
                          {msg.diagnosis?.transactionId || 'pay_NpX8172k'}
                        </span>
                        <span className="px-sm py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase font-semibold">
                          {msg.diagnosis?.failureType || 'temporary'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-label-caps text-xs text-on-surface-variant uppercase mr-xs">
                          Recoverability:
                        </span>
                        <span className="font-mono text-sm font-bold text-primary">
                          {((msg.diagnosis?.recoverability || 0.82) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="p-lg flex flex-col gap-md">
                      <p className="font-body-md text-on-surface leading-relaxed">
                        {msg.text}
                      </p>

                      {msg.diagnosis && (
                        <>
                          <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant">
                            <div className="font-label-caps text-xs text-on-surface-variant uppercase mb-xs font-semibold">
                              Merchant Narrative Rationale
                            </div>
                            <p className="font-body-sm text-on-surface text-sm">
                              {msg.diagnosis.merchantNarrative}
                            </p>
                          </div>

                          {/* Evidence Ledger */}
                          <div>
                            <div className="font-label-caps text-xs text-on-surface-variant uppercase mb-sm font-semibold">
                              Diagnostic Evidence Ledger
                            </div>
                            <ul className="space-y-xs">
                              {msg.diagnosis.evidence.map((ev: string, eIdx: number) => (
                                <li key={eIdx} className="flex items-start gap-sm text-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                                    check_circle
                                  </span>
                                  <span>{ev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Financial Impact Bar */}
                          <div className="flex flex-wrap items-center justify-between pt-md border-t border-outline-variant gap-md">
                            <div>
                              <div className="font-label-caps text-xs text-on-surface-variant uppercase">
                                Expected Recovery Value
                              </div>
                              <div className="font-mono text-xl font-bold text-primary">
                                {formatPaise(msg.diagnosis.expectedRecoveryPaise)}
                              </div>
                            </div>

                            <button
                              onClick={() => onNavigate?.('simulator')}
                              className="px-lg py-sm bg-primary-container text-background font-semibold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center gap-xs text-sm"
                            >
                              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                              <span>Simulate Strategy</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Prompt Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-md bg-background/95 backdrop-blur border-t border-outline-variant flex items-center justify-center z-20">
        <div className="w-full max-w-[800px] flex items-center gap-sm bg-surface-container-high border border-outline-variant rounded-lg p-sm">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini to diagnose a payment failure or order ID..."
            className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant outline-none font-body-md px-sm"
          />
          <button
            onClick={handleSend}
            className="px-md py-sm bg-primary-container text-background rounded-DEFAULT font-semibold flex items-center gap-xs hover:opacity-90 transition-opacity text-sm"
          >
            <span>Diagnose</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </main>
  );
};
