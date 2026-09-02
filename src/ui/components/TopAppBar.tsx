/**
 * src/ui/components/TopAppBar.tsx
 *
 * Salvo Command Center Persistent Header
 * Includes route breadcrumbs, live telemetry status, notifications, search, user dropdown.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Avatar } from './ui/avatar.js';
import { Badge } from './ui/badge.js';
import { Separator } from './ui/separator.js';
import type { NavTab } from './SideNavBar.js';

export interface TopAppBarProps {
  activeTab?: NavTab;
  onSearch?: (query: string) => void;
  onNavigate?: (route: string) => void;
  onToggleMobileMenu?: () => void;
}

const ROUTE_LABELS: Record<NavTab, { section: string; title: string }> = {
  overview: { section: 'Core', title: 'Dashboard' },
  diagnosis: { section: 'Core', title: 'AI Diagnosis & Reasoning' },
  simulator: { section: 'Core', title: 'Recovery Simulator' },
  execution: { section: 'Operations', title: 'Live Razorpay Execution' },
  audit: { section: 'Operations', title: 'Cryptographic Audit Trail' },
  launch: { section: 'Operations', title: 'Platform Architecture' },
};

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab = 'overview',
  onSearch,
  onNavigate,
  onToggleMobileMenu,
}) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    logout();
    onNavigate?.('login');
  };

  const breadcrumb = ROUTE_LABELS[activeTab] || { section: 'Core', title: 'Dashboard' };

  return (
    <header className="w-full h-16 sticky top-0 z-20 bg-[#03081A]/90 backdrop-blur-md border-b border-border-hairline flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      {/* Left: Mobile Menu Toggle & Route Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-[10px] bg-surface border border-border-hairline text-text-secondary hover:text-white hover:bg-surface-elevated transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Logo */}
        <div className="md:hidden flex items-center shrink-0">
          <img src="/salvo-logo.png" alt="Salvo" className="w-7 h-7 rounded-[8px] object-cover border border-primary/30" />
        </div>

        {/* Breadcrumb Context */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-text-tertiary hidden sm:inline">Salvo</span>
          <span className="text-border-secondary hidden sm:inline">/</span>
          <span className="text-text-tertiary hidden md:inline">{breadcrumb.section}</span>
          <span className="text-border-secondary hidden md:inline">/</span>
          <span className="text-white font-semibold font-sans text-sm truncate">
            {breadcrumb.title}
          </span>
        </div>
      </div>

      {/* Center: Search & Command Shortcut Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions, error codes, traces... (Ctrl+K)"
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-[#020626] border border-border-hairline text-white font-sans text-xs rounded-[35px] py-2 pl-9 pr-12 focus:border-primary focus:outline-none transition-all placeholder:text-text-tertiary"
          />
          <kbd className="absolute right-3 top-2 px-1.5 py-0.5 rounded bg-surface-elevated border border-border-hairline font-mono text-[9px] text-text-tertiary">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Telemetry Badge, Portal Link, Notifications & User Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* System Active Badge */}
        <div className="hidden xl:flex items-center gap-2 text-ai-signal bg-ai-signal/10 px-3 py-1 rounded-[14px] border border-ai-signal/30 font-mono text-[10.5px] uppercase tracking-wider font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
          <span>AUTONOMOUS ENGINE ACTIVE</span>
        </div>

        {/* Razorpay Portal Link */}
        <a
          href="https://dashboard.razorpay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-surface hover:bg-surface-elevated border border-border-hairline text-text-secondary hover:text-white transition-colors text-xs font-mono"
        >
          <span>Razorpay Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
        </a>

        {/* Notifications Affordance */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-[10px] bg-surface hover:bg-surface-elevated border border-border-hairline text-text-secondary hover:text-white transition-colors"
            aria-label="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-recovered ring-2 ring-[#03081A]" />
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-[20px] bg-[#020626] border border-border-hairline shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline/60">
                <div className="font-sans text-xs font-semibold text-white">System Telemetry</div>
                <Badge variant="success" className="text-[9px] px-1.5 py-0">
                  Healthy
                </Badge>
              </div>

              <div className="space-y-2.5 pt-3">
                <div className="p-2.5 rounded-[10px] bg-[#03081A] border border-border-hairline/50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-recovered shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-white">Razorpay Test Gateway Connected</div>
                    <div className="text-[10px] font-mono text-text-tertiary mt-0.5">
                      Authenticated API active in test mode
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-[10px] bg-[#03081A] border border-border-hairline/50 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-white">Policy Gate Enforcing Invariants</div>
                    <div className="text-[10px] font-mono text-text-tertiary mt-0.5">
                      Ground truth isolation active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-[24px] bg-[#020626] border border-border-hairline hover:border-border-secondary transition-colors text-left"
            title="User Profile & Settings"
            aria-expanded={isUserMenuOpen}
          >
            <Avatar
              src={user?.avatarUrl}
              fallback={user?.name ? user.name.charAt(0) : 'U'}
              size="sm"
              className="border-primary/40"
            />
            <div className="hidden sm:block text-left pr-1">
              <div className="font-sans text-xs font-medium text-white leading-tight truncate max-w-[120px]">
                {user?.name || 'Operator'}
              </div>
              <div className="font-mono text-[9px] text-ai-signal uppercase tracking-wider">
                {user?.role || 'merchant'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-[20px] bg-[#020626] border border-border-hairline shadow-2xl p-3 z-50 animate-fadeIn">
              {/* User Identity Info */}
              <div className="px-3 py-2.5 border-b border-border-hairline/60">
                <div className="font-sans text-sm font-semibold text-white leading-snug truncate">
                  {user?.name || 'Authorized Operator'}
                </div>
                <div className="font-mono text-xs text-text-tertiary truncate mt-0.5">
                  {user?.email || 'operator@salvo.local'}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-medium">
                  <span>Workspace: {user?.organization || 'Production'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate?.('overview');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-sans text-text-secondary hover:bg-surface-elevated hover:text-white transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  <span>Dashboard Overview</span>
                </button>

                <Separator className="my-1" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-xs font-sans text-risk hover:bg-risk/10 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out of Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
