/**
 * SideNavBar — persistent navigation for Salvo Financial Command Center.
 */
import React from 'react';

export type NavTab =
  | 'overview'
  | 'diagnosis'
  | 'simulator'
  | 'execution'
  | 'audit'
  | 'launch';

export interface SideNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRunRecovery?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: string; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'diagnosis', label: 'AI Diagnosis', icon: 'psychology' },
  { id: 'simulator', label: 'Simulator', icon: 'model_training' },
  { id: 'execution', label: 'Live Execution', icon: 'timeline', badge: 'LIVE' },
  { id: 'audit', label: 'Audit Trail', icon: 'receipt_long' },
  { id: 'launch', label: 'About Salvo', icon: 'rocket_launch' },
];

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onTabChange,
  onRunRecovery,
}) => {
  return (
    <nav
      aria-label="Sidebar Navigation"
      className="w-sidebar_width h-screen sticky left-0 top-0 bg-[#020626] border-r border-border-hairline flex flex-col py-6 px-4 z-50 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div
        className="mb-8 px-2 flex items-center gap-3 cursor-pointer group"
        onClick={() => onTabChange('overview')}
      >
        <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
          <span
            className="material-symbols-outlined text-white text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            token
          </span>
        </div>
        <div>
          <div className="font-sans text-[18px] font-medium text-white tracking-tight leading-none">
            Salvo
          </div>
          <div className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.08em] mt-1">
            Autonomous Recovery
          </div>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-left transition-all duration-150 ${
                isActive
                  ? 'text-white font-medium bg-primary/20 border border-primary/40'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[19px] ${
                    isActive ? 'text-primary' : 'text-text-tertiary'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-sans text-[14px]">{item.label}</span>
              </div>

              {item.badge && (
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[6px] bg-ai-signal/15 text-ai-signal border border-ai-signal/30 font-semibold tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer CTA & Actions */}
      <div className="mt-auto pt-4 flex flex-col gap-3">
        <button
          onClick={onRunRecovery}
          className="w-full bg-primary hover:bg-primary-hover text-white font-sans text-sm font-medium py-3 rounded-[48px] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Run Recovery</span>
        </button>

        <div className="space-y-1 pt-2 border-t border-border-hairline">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-[12px] text-text-tertiary hover:bg-surface-elevated hover:text-white transition-colors text-left font-sans text-xs">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-[12px] text-text-tertiary hover:bg-surface-elevated hover:text-white transition-colors text-left font-sans text-xs">
            <span className="material-symbols-outlined text-[16px]">help_outline</span>
            <span>API Docs & Support</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
