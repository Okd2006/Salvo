/**
 * SimulatorScreen — Algorithmic Recovery Simulator.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - 35px architectural comparison ledger
 *  - 48px plan approval controls
 *  - 17px recommended badges
 *  - High-precision JetBrains Mono numerical ledger
 */
import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader.js';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { RecoveryStrategyRow } from '../components/RecoveryStrategyRow.js';
import { DEMO_SIMULATOR_STRATEGIES } from '../data/demo.js';

interface SimulatorScreenProps {
  onNavigate?: (tab: string) => void;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('preemptive-verify');

  const selectedStrategy =
    DEMO_SIMULATOR_STRATEGIES.find((s) => s.id === selectedId) ??
    DEMO_SIMULATOR_STRATEGIES[0];

  return (
    <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto min-w-0 bg-[#03081A] text-white">
      <div className="max-w-[1280px] w-full mx-auto space-y-8">
        {/* Screen Header */}
        <PageHeader
          eyebrow="Algorithmic Simulation"
          eyebrowVariant="ai"
          title="Recovery Simulator"
          subtitle="Compare algorithmic recovery strategies against your pending decline volume. Projections are computed from 30-day historical conversion models."
          actions={
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 rounded-[48px] border border-border-hairline hover:border-border-secondary text-text-secondary hover:text-white font-sans text-xs font-medium transition-colors">
                Export Simulation Data
              </button>
              <button
                onClick={() => onNavigate?.('execution')}
                className="px-6 py-2.5 rounded-[48px] bg-primary hover:bg-primary-hover text-white font-sans text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Approve Recovery Plan</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          }
        />

        {/* Selected Strategy KPI Summary Cards (35px Radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 flex flex-col justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Selected Strategy Vector
            </span>
            <div className="font-sans text-[20px] font-medium text-white">
              {selectedStrategy.label}
            </div>
            <div className="font-mono text-xs text-text-secondary">
              {selectedStrategy.transactionsAffected.toLocaleString('en-IN')} transactions targeted
            </div>
          </div>

          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 flex flex-col justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Gross Predicted Yield
            </span>
            <CurrencyValue paise={selectedStrategy.predictedRecoveryPaise} size="lg" variant="neutral" />
            <div className="font-sans text-xs text-text-secondary">
              Baseline algorithmic recovery rate
            </div>
          </div>

          <div className="bg-surface border border-border-hairline rounded-[35px] p-6 flex flex-col justify-between gap-3 relative overflow-hidden">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              Projected Net Gain
            </span>
            <CurrencyValue paise={selectedStrategy.netRecoveryPaise} size="lg" variant="recovered" />
            <div className="font-mono text-xs text-recovered">
              Less API cost: -₹{(selectedStrategy.interventionCostPaise / 100).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Strategy Comparison Ledger Table */}
        <div className="bg-surface rounded-[35px] border border-border-hairline overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="px-6 lg:px-8 py-5 border-b border-border-hairline bg-[#03081A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[20px] font-normal text-white">
                Strategy Evaluation Matrix
              </h2>
              <p className="font-sans text-xs text-text-secondary">
                Select a strategy row to review net algorithmic yield against pending decline queues
              </p>
            </div>
            <div className="flex items-center gap-2 text-text-tertiary font-mono text-xs">
              <span className="material-symbols-outlined text-[16px] text-ai-signal">
                update
              </span>
              <span>Models updated: 14:30 UTC</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="bg-[#03081A] border-b border-border-hairline font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-semibold">
                <tr>
                  <th className="px-6 py-4">Strategy Model</th>
                  <th className="px-6 py-4 text-right">Transactions Affected</th>
                  <th className="px-6 py-4 text-right">Predicted Recovery</th>
                  <th className="px-6 py-4 text-right">Intervention Cost</th>
                  <th className="px-6 py-4 text-right text-white">NET Projected Recovery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline/40">
                {DEMO_SIMULATOR_STRATEGIES.map((s) => (
                  <RecoveryStrategyRow
                    key={s.id}
                    id={s.id}
                    icon={s.icon}
                    label={s.label}
                    sublabel={s.sublabel}
                    transactionsAffected={s.transactionsAffected}
                    predictedRecoveryPaise={s.predictedRecoveryPaise}
                    interventionCostPaise={s.interventionCostPaise}
                    netRecoveryPaise={s.netRecoveryPaise}
                    recommended={s.recommended}
                    isSelected={selectedId === s.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </tbody>
              <tfoot className="bg-[#03081A] border-t border-border-hairline">
                <tr>
                  <td
                    className="px-6 py-5 text-right font-mono text-xs uppercase tracking-wider text-text-tertiary"
                    colSpan={4}
                  >
                    Total Projected Net Gain ({selectedStrategy.label}):
                  </td>
                  <td className="px-6 py-5 text-right">
                    <CurrencyValue
                      paise={selectedStrategy.netRecoveryPaise}
                      variant="recovered"
                      size="lg"
                      className="font-bold"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};
