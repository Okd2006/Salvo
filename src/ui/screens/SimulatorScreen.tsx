import React, { useState } from 'react';
import { formatPaise } from '../../lib/currency.js';

interface SimulatorScreenProps {
  onNavigate?: (tab: string) => void;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({ onNavigate }) => {
  const [strategy, setStrategy] = useState<'smart_retry' | 'payment_link' | 'notify'>('smart_retry');
  const [minProbability, setMinProbability] = useState(0.4);
  const [maxRetries, setMaxRetries] = useState(3);
  const [simulatedVerdict, setSimulatedVerdict] = useState<'approved' | 'blocked' | 'needs_review'>('approved');

  const handleSimulate = () => {
    if (minProbability > 0.75) {
      setSimulatedVerdict('blocked');
    } else if (minProbability > 0.5) {
      setSimulatedVerdict('needs_review');
    } else {
      setSimulatedVerdict('approved');
    }
  };

  return (
    <main className="flex-1 p-xl flex flex-col gap-xl overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Header */}
      <div className="flex flex-col gap-xs mb-sm">
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Recovery Policy Simulator
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Dry-run deterministic safety policy rules against Gemini recovery proposals before production execution.
        </p>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Policy Configuration Controls */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col gap-lg">
          <div className="flex items-center gap-xs text-primary pb-sm border-b border-outline-variant">
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <h2 className="font-headline-sm text-base font-semibold text-on-surface">
              Policy Gate Controls
            </h2>
          </div>

          {/* Strategy Selection */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
              Proposed Strategy
            </label>
            <div className="grid grid-cols-3 gap-xs">
              <button
                onClick={() => setStrategy('smart_retry')}
                className={`py-sm px-xs rounded text-xs font-mono font-medium transition-colors ${
                  strategy === 'smart_retry'
                    ? 'bg-primary-container text-background font-bold'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
                }`}
              >
                Retry
              </button>
              <button
                onClick={() => setStrategy('payment_link')}
                className={`py-sm px-xs rounded text-xs font-mono font-medium transition-colors ${
                  strategy === 'payment_link'
                    ? 'bg-primary-container text-background font-bold'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
                }`}
              >
                Link Switch
              </button>
              <button
                onClick={() => setStrategy('notify')}
                className={`py-sm px-xs rounded text-xs font-mono font-medium transition-colors ${
                  strategy === 'notify'
                    ? 'bg-primary-container text-background font-bold'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
                }`}
              >
                Reminder
              </button>
            </div>
          </div>

          {/* Probability Threshold Slider */}
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
                Min Probability Threshold
              </label>
              <span className="font-mono text-sm font-bold text-primary">
                {(minProbability * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={minProbability}
              onChange={(e) => setMinProbability(parseFloat(e.target.value))}
              className="w-full accent-primary bg-surface-container-high h-2 rounded cursor-pointer"
            />
          </div>

          {/* Max Retries Limit */}
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
                Max Allowed Retry Attempts
              </label>
              <span className="font-mono text-sm font-bold text-on-surface">{maxRetries}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={maxRetries}
              onChange={(e) => setMaxRetries(parseInt(e.target.value))}
              className="w-full accent-primary bg-surface-container-high h-2 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={handleSimulate}
            className="w-full py-md bg-primary-container text-background font-semibold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center justify-center gap-xs mt-md shadow"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Run Policy Simulation</span>
          </button>
        </div>

        {/* Policy Verdict & Rules Evaluation Preview */}
        <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl p-lg flex flex-col gap-lg">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant">
            <h2 className="font-headline-sm text-base font-semibold text-on-surface">
              Deterministic Policy Gate Verdict
            </h2>
            <div className="flex items-center gap-xs">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">Status:</span>
              <span
                className={`font-mono text-xs px-md py-0.5 rounded font-bold uppercase ${
                  simulatedVerdict === 'approved'
                    ? 'bg-recovered/10 text-recovered border border-recovered/30'
                    : simulatedVerdict === 'blocked'
                    ? 'bg-risk/10 text-risk border border-risk/30'
                    : 'bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/30'
                }`}
              >
                {simulatedVerdict}
              </span>
            </div>
          </div>

          {/* Rule Evaluation Cards */}
          <div className="space-y-md">
            <div className="p-md bg-surface-container-high rounded-lg border border-outline-variant flex items-start gap-md">
              <span
                className={`material-symbols-outlined text-[20px] mt-0.5 ${
                  minProbability <= 0.75 ? 'text-primary' : 'text-risk'
                }`}
              >
                {minProbability <= 0.75 ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <div className="font-mono text-sm font-semibold text-on-surface">
                  RULE_MIN_RECOVERABILITY
                </div>
                <div className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Action recoverability probability (82%) meets or exceeds minimum threshold ({(minProbability * 100).toFixed(0)}%).
                </div>
              </div>
            </div>

            <div className="p-md bg-surface-container-high rounded-lg border border-outline-variant flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                check_circle
              </span>
              <div>
                <div className="font-mono text-sm font-semibold text-on-surface">
                  RULE_UNRECOVERABLE_BLOCK
                </div>
                <div className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Confirmed failure classification is 'temporary'. Unrecoverable fraud rule did not trigger.
                </div>
              </div>
            </div>

            <div className="p-md bg-surface-container-high rounded-lg border border-outline-variant flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                check_circle
              </span>
              <div>
                <div className="font-mono text-sm font-semibold text-on-surface">
                  RULE_RETRY_COUNT_LIMIT
                </div>
                <div className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Prior retry attempts (1) is strictly within merchant limit ({maxRetries}).
                </div>
              </div>
            </div>
          </div>

          {/* Dry Run Outcome Action */}
          <div className="pt-md border-t border-outline-variant flex items-center justify-between">
            <div>
              <div className="font-label-caps text-xs text-on-surface-variant uppercase">
                Simulated Execution Impact
              </div>
              <div className="font-mono text-lg font-bold text-primary">
                {formatPaise(4823500)} Expected Recovery
              </div>
            </div>

            <button
              onClick={() => onNavigate?.('execution')}
              className="px-lg py-sm bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface font-medium rounded-DEFAULT text-sm transition-colors flex items-center gap-xs"
            >
              <span>View Execution Timeline</span>
              <span className="material-symbols-outlined text-[16px]">timeline</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
