/**
 * SimulatorScreen — Recovery Strategy Simulator.
 *
 * Matches Stitch screen: "Recovery Simulator | Salvo AI"
 * Shows the strategy comparison ledger table with recommended strategy highlighted.
 */
import React, { useState } from 'react';
import { CurrencyValue } from '../components/CurrencyValue.js';
import { DEMO_SIMULATOR_STRATEGIES } from '../data/demo.js';

interface SimulatorScreenProps {
  onNavigate?: (tab: string) => void;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('preemptive-verify');

  const totalNetRecovery = DEMO_SIMULATOR_STRATEGIES.find((s) => s.id === selectedId)
    ?.netRecoveryPaise ?? 0;

  return (
    <main className="flex-1 overflow-y-auto p-gutter bg-background text-on-surface relative">
      {/* Background accent glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto space-y-xl relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface">
              Recovery Simulator
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
              Compare algorithmic strategies against your pending decline volume. Projections are
              based on 30-day historical conversion models.
            </p>
          </div>
          <div className="flex gap-sm">
            <button className="px-4 py-2 border border-outline-variant text-on-surface font-headline-sm text-headline-sm rounded-DEFAULT hover:bg-surface-container-highest transition-colors">
              Export Data
            </button>
            <button
              onClick={() => onNavigate?.('execution')}
              className="px-6 py-2 bg-primary-container text-background font-headline-sm text-headline-sm font-semibold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Approve Recovery Plan
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Strategy Comparison Ledger */}
        <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant bg-surface-container flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Strategy Evaluation
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                update
              </span>
              Data current as of 14:30 UTC
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-surface-container-low border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="px-lg py-4 font-semibold">Strategy Model</th>
                  <th className="px-lg py-4 font-semibold text-right">Transactions Affected</th>
                  <th className="px-lg py-4 font-semibold text-right">Predicted Recovery</th>
                  <th className="px-lg py-4 font-semibold text-right">Intervention Cost</th>
                  <th className="px-lg py-4 font-semibold text-right text-primary-container">
                    NET Recovery
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {DEMO_SIMULATOR_STRATEGIES.map((s) => {
                  const isSelected = selectedId === s.id;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`group cursor-pointer hover:bg-surface-container-highest transition-colors ${
                        isSelected
                          ? 'bg-primary/5 border-l-2 border-primary'
                          : ''
                      }`}
                    >
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-DEFAULT flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-primary/20 border-primary/30 text-primary'
                                : 'bg-surface-container-highest border-outline-variant text-on-surface-variant group-hover:text-primary'
                            }`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '18px' }}
                            >
                              {s.icon}
                            </span>
                          </div>
                          <div>
                            <div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                              {s.label}
                              {s.recommended && (
                                <span className="px-2 py-0.5 rounded-sm bg-primary/20 text-primary font-label-caps text-label-caps text-[9px] border border-primary/30">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                              {s.sublabel}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md text-right font-metric-md text-metric-md text-on-surface">
                        {s.transactionsAffected.toLocaleString('en-IN')}
                      </td>
                      <td className="px-lg py-md text-right">
                        <CurrencyValue paise={s.predictedRecoveryPaise} variant="neutral" size="sm" />
                      </td>
                      <td className="px-lg py-md text-right">
                        <CurrencyValue paise={s.interventionCostPaise} variant="risk" size="sm" />
                      </td>
                      <td className="px-lg py-md text-right">
                        <CurrencyValue
                          paise={s.netRecoveryPaise}
                          variant="recovered"
                          size={isSelected ? 'lg' : 'sm'}
                          className={`font-bold tracking-tight ${isSelected ? 'text-primary-container' : ''}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-surface-container-lowest border-t border-outline-variant">
                <tr>
                  <td
                    className="px-lg py-md text-right font-label-caps text-label-caps text-on-surface-variant uppercase"
                    colSpan={4}
                  >
                    Total Projected Gain (Selected Strategy)
                  </td>
                  <td className="px-lg py-md text-right">
                    <CurrencyValue paise={totalNetRecovery} variant="recovered" size="lg" className="font-bold" />
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
