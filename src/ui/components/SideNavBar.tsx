/**
 * src/ui/components/SideNavBar.tsx
 *
 * Salvo Global Navigation Sidebar — Fintech & Autonomous Operations
 * Features grouped navigation (Core & Operations), Lucide icons, responsive mobile drawer.
 */
import React from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  Sliders,
  Zap,
  ScrollText,
  Rocket,
  LogOut,
  X,
  Shield,
  Coins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Badge } from './ui/badge.js';
import { Avatar } from './ui/avatar.js';

export type NavTab =
  | 'overview'
  | 'diagnosis'
  | 'simulator'
  | 'execution'
  | 'audit'
  | 'launch';

export interface NavItemConfig {
  id: NavTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'default' | 'cyan' | 'success' | 'destructive' | 'secondary' | 'warning';
  };
}

export interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    title: 'CORE',
    items: [
      {
        id: 'overview',
        label: 'Dashboard',
        description: 'Recovery telemetry & metrics',
        icon: LayoutDashboard,
      },
      {
        id: 'diagnosis',
        label: 'AI Diagnosis',
        description: 'Multi-model failure analysis',
        icon: BrainCircuit,
      },
      {
        id: 'simulator',
        label: 'Simulator',
        description: 'Scenario & policy evaluation',
        icon: Sliders,
      },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      {
        id: 'execution',
        label: 'Live Execution',
        description: 'Razorpay recovery feed',
        icon: Zap,
        badge: { text: 'LIVE', variant: 'cyan' },
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        description: 'Cryptographic compliance logs',
        icon: ScrollText,
      },
      {
        id: 'launch',
        label: 'Platform Architecture',
        description: 'System invariants & engine',
        icon: Rocket,
      },
    ],
  },
];

export interface SideNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRunRecovery?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onTabChange,
  onRunRecovery,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between py-5 px-3 select-none">
      {/* Top Section: Brand & Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div
            onClick={() => handleSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#03081A] border border-primary/40 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 overflow-hidden transition-transform group-hover:scale-105">
              <img src="/salvo-logo.png" alt="Salvo Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-sans text-[17px] font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
                <span>Salvo</span>
                <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
                  v2.1
                </span>
              </div>
              <div className="font-mono text-[9.5px] text-text-tertiary uppercase tracking-[0.08em] mt-1 truncate">
                Autonomous Recovery
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-[8px] text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 py-1 font-mono text-[10px] font-semibold text-text-tertiary tracking-widest uppercase">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-left transition-all duration-150 group relative ${
                        isActive
                          ? 'bg-primary/15 text-white font-medium border border-primary/35 shadow-[0_0_15px_rgba(61,80,252,0.15)]'
                          : 'text-text-secondary hover:bg-surface-elevated/70 hover:text-white border border-transparent'
                      }`}
                    >
                      {/* Active Indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-white'
                          }`}
                        />
                        <div className="truncate">
                          <span className="font-sans text-sm block leading-tight">{item.label}</span>
                        </div>
                      </div>

                      {item.badge && (
                        <Badge variant={item.badge.variant} className="text-[9px] px-1.5 py-0 shrink-0">
                          {item.badge.text}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Policy Status, CTA & User Profile */}
      <div className="space-y-3 pt-4 border-t border-border-hairline/70">
        {/* Quick Simulator CTA */}
        {onRunRecovery && (
          <button
            type="button"
            onClick={() => handleSelectTab('simulator')}
            className="w-full bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white font-sans text-xs font-semibold py-2.5 px-3 rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Recovery Simulator</span>
          </button>
        )}

        {/* Trust Invariant Pill */}
        <div className="px-3 py-2 rounded-[10px] bg-[#03081A] border border-border-hairline/60 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-recovered shrink-0" />
          <div className="text-[10.5px] font-mono text-text-secondary truncate">
            Policy Gate: <span className="text-recovered font-semibold">Deterministic</span>
          </div>
        </div>

        {/* User Mini Bar */}
        {user && (
          <div className="p-2 rounded-[12px] bg-[#03081A] border border-border-hairline flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar
                src={user.avatarUrl}
                fallback={user.name.charAt(0)}
                size="sm"
                className="shrink-0 border-primary/30"
              />
              <div className="min-w-0">
                <div className="font-sans text-xs font-medium text-white truncate leading-tight">
                  {user.name}
                </div>
                <div className="font-mono text-[9px] text-text-tertiary truncate">
                  {user.organization || user.role}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="p-1.5 text-text-tertiary hover:text-risk hover:bg-risk/10 rounded-[8px] transition-colors shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Width 250px) */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:flex w-64 h-screen sticky top-0 left-0 bg-[#020626] border-r border-border-hairline flex-col shrink-0 z-30"
      >
        {navContent}
      </aside>

      {/* Mobile Drawer (Sheet) with Animated Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Canvas */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#020626] border-r border-border-hairline shadow-2xl z-50 animate-slideIn">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
