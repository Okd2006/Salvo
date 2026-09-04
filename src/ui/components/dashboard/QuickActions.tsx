/**
 * src/ui/components/dashboard/QuickActions.tsx
 *
 * Direct action shortcuts into core Salvo execution and diagnosis screens.
 */
import React from 'react';
import { BrainCircuit, Sliders, Zap, ScrollText } from 'lucide-react';

export interface QuickActionsProps {
  onNavigate?: (route: string) => void;
  onSimulateClick?: () => void;
  onDiagnosisClick?: () => void;
  onLiveFeedClick?: () => void;
  onAuditLedgerClick?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'diagnosis',
      title: 'AI Diagnosis Engine',
      desc: 'Run multi-model reasoning on failure traces',
      icon: BrainCircuit,
      color: 'text-primary',
      bg: 'hover:border-primary/50',
      route: 'diagnosis',
    },
    {
      id: 'simulator',
      title: 'Recovery Simulator',
      desc: 'Evaluate 6 failure archetypes & fallbacks',
      icon: Sliders,
      color: 'text-caution',
      bg: 'hover:border-caution/50',
      route: 'simulator',
    },
    {
      id: 'execution',
      title: 'Live Execution Feed',
      desc: 'Inspect Razorpay test-mode recovery links',
      icon: Zap,
      color: 'text-ai-signal',
      bg: 'hover:border-ai-signal/50',
      route: 'execution',
    },
    {
      id: 'audit',
      title: 'Audit Compliance Ledger',
      desc: 'Verify immutable state logs & policies',
      icon: ScrollText,
      color: 'text-recovered',
      bg: 'hover:border-recovered/50',
      route: 'audit',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            type="button"
            onClick={() => onNavigate?.(act.route)}
            className={`p-4 rounded-[18px] bg-[#020626] border border-border-hairline text-left transition-all ${act.bg} hover:bg-surface-elevated/80 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#03081A] border border-border-hairline flex items-center justify-center">
                <Icon className={`w-4 h-4 ${act.color}`} />
              </div>
              <span className="material-symbols-outlined text-text-tertiary text-[18px] group-hover:text-white transition-colors">
                arrow_forward
              </span>
            </div>
            <div>
              <div className="font-sans text-xs font-semibold text-white group-hover:text-primary transition-colors">
                {act.title}
              </div>
              <div className="font-sans text-[11px] text-text-secondary mt-0.5 leading-snug">
                {act.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
