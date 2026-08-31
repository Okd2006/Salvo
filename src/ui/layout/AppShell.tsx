/**
 * src/ui/layout/AppShell.tsx
 *
 * Salvo Reusable Authenticated Shell Layout
 * Combines SideNavBar + TopAppBar + Scrollable Viewport without double scrollbars.
 */
import React, { useState } from 'react';
import { SideNavBar, NavTab } from '../components/SideNavBar.js';
import { TopAppBar } from '../components/TopAppBar.js';

export interface AppShellProps {
  activeTab: NavTab;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onNavigate,
  children,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex font-sans antialiased min-h-screen h-screen w-screen overflow-hidden bg-[#03081A] text-white">
      {/* Persistent Sidebar / Mobile Drawer */}
      <SideNavBar
        activeTab={activeTab}
        onTabChange={(tab) => onNavigate(tab)}
        onRunRecovery={() => onNavigate('simulator')}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#03081A]">
        {/* Persistent Top App Bar */}
        <TopAppBar
          activeTab={activeTab}
          onNavigate={onNavigate}
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* Scrollable Screen Canvas (Single Scrollbar) */}
        <main className="flex-1 overflow-y-auto min-h-0 flex flex-col focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
