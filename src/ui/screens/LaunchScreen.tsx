import React from 'react';
import { ScrollStoryThree } from '../components/ScrollStoryThree.js';

interface LaunchScreenProps {
  onNavigate?: (tab: string) => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 overflow-y-auto min-w-0 bg-background text-on-surface">
      {/* Hero Section */}
      <div className="relative border-b border-outline-variant p-xl lg:p-24 flex flex-col items-center text-center gap-lg max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-xs px-md py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-xs uppercase tracking-widest">
            Salvo AI — Autonomous Revenue Recovery
          </span>
        </div>

        <h1 className="font-display-lg text-4xl lg:text-6xl font-bold tracking-tight text-on-surface max-w-3xl leading-tight">
          Salvo doesn't tell merchants what went wrong.{' '}
          <span className="text-primary">It takes responsibility for what happens next.</span>
        </h1>

        <p className="font-body-md text-lg text-on-surface-variant max-w-2xl">
          An autonomous AI agent designed for Razorpay merchants to diagnose payment failures, proposal deterministic recovery strategies, enforce strict safety gates, and execute recovery actions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-md mt-md">
          <button
            onClick={() => onNavigate?.('overview')}
            className="px-xl py-md bg-primary-container text-background font-semibold rounded-DEFAULT hover:opacity-90 transition-all flex items-center gap-xs shadow-lg"
          >
            <span>Launch Telemetry Dashboard</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={() => onNavigate?.('simulator')}
            className="px-xl py-md bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface font-medium rounded-DEFAULT transition-all flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">model_training</span>
            <span>Open Recovery Simulator</span>
          </button>
        </div>
      </div>

      {/* Architecture Lock Section */}
      <div className="p-xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
        {/* Step 1 */}
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
          <div className="font-mono text-xs text-primary font-bold">01 / DIAGNOSE & PLAN</div>
          <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Gemini AI Engine</h3>
          <p className="font-body-sm text-on-surface-variant">
            Analyzes transaction metadata, failure codes, and customer history to determine root cause and recoverability score.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
          <div className="font-mono text-xs text-tertiary font-bold">02 / POLICY GATE</div>
          <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Deterministic Policy Gate</h3>
          <p className="font-body-sm text-on-surface-variant">
            Strict TypeScript rules inspect Gemini proposals. LLMs recommend but NEVER execute without explicit gate approval.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
          <div className="font-mono text-xs text-primary font-bold">03 / EXECUTE</div>
          <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Razorpay Test APIs</h3>
          <p className="font-body-sm text-on-surface-variant">
            Executes approved recovery actions: Smart Retries, Payment Links, or Customer Notifications via Razorpay Test APIs.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
          <div className="font-mono text-xs text-on-surface-variant font-bold">04 / AUDIT TRAIL</div>
          <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Immutable Audit Log</h3>
          <p className="font-body-sm text-on-surface-variant">
            Append-only record capturing diagnosis rationale, policy verdicts, API payloads, and execution receipts.
          </p>
        </div>
      </div>

      {/* Interactive Scroll Story Section */}
      <ScrollStoryThree />
    </main>
  );
};
