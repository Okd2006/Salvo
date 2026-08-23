/**
 * SideNavBar — persistent left navigation matching the Stitch design.
 *
 * Navigation covers the six core Salvo screens only.
 * Shader / Three.js screens are not included in the main navigation.
 */
import React from 'react';

export type NavTab = 'overview' | 'diagnosis' | 'simulator' | 'execution' | 'audit' | 'launch';

interface SideNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRunRecovery?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'diagnosis', label: 'Diagnosis', icon: 'psychology' },
  { id: 'simulator', label: 'Simulator', icon: 'model_training' },
  { id: 'execution', label: 'Execution', icon: 'timeline' },
  { id: 'audit', label: 'Audit', icon: 'receipt_long' },
  { id: 'launch', label: 'About', icon: 'rocket_launch' },
];

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onTabChange,
  onRunRecovery,
}) => {
  return (
    <nav className="w-sidebar_width h-screen sticky left-0 top-0 bg-surface-container-high border-r border-outline-variant flex flex-col py-md px-sm z-50 shrink-0">
      {/* Brand */}
      <div
        className="mb-xl px-sm flex items-center gap-md cursor-pointer"
        onClick={() => onTabChange('overview')}
      >
        <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-on-primary text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            token
          </span>
        </div>
        <div>
          <div className="font-headline-md text-[18px] font-bold text-primary tracking-tight">
            Salvo AI
          </div>
          <div className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
            Institutional Recovery
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 space-y-xs overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-DEFAULT text-left transition-colors duration-150 ${
                isActive
                  ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-highest opacity-90'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-auto pt-md">
        <button
          onClick={onRunRecovery}
          className="w-full bg-primary-container text-background font-headline-sm text-headline-sm py-sm rounded-DEFAULT mb-md hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-xs shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Run Recovery</span>
        </button>

        <div className="space-y-xs pt-xs border-t border-outline-variant">
          <button className="w-full flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-surface-variant font-medium hover:bg-surface-container-highest hover:text-on-surface transition-colors duration-150 text-left">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="font-label-caps text-label-caps uppercase">Settings</span>
          </button>
          <button className="w-full flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-surface-variant font-medium hover:bg-surface-container-highest hover:text-on-surface transition-colors duration-150 text-left">
            <span className="material-symbols-outlined text-[18px]">contact_support</span>
            <span className="font-label-caps text-label-caps uppercase">Support</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
