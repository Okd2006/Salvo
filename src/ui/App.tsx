/**
 * App.tsx — Salvo Deep-Space Financial Command Center Shell.
 *
 * Tab-based SPA routing via useState:
 *  - Overview: Recovery telemetry dashboard
 *  - Diagnosis: AI Diagnosis & Explainable Gemini Analyst
 *  - Simulator: Algorithmic Recovery Simulator
 *  - Execution: Signature Live Execution Feed
 *  - Audit: Immutable Compliance Ledger & Cryptographic Trace
 *  - Launch: About Salvo & Autonomous Recovery introduction
 */
import React, { useState } from 'react';
import { SideNavBar, NavTab } from './components/SideNavBar.js';
import { TopAppBar } from './components/TopAppBar.js';

import { OverviewScreen } from './screens/OverviewScreen.js';
import { LaunchScreen } from './screens/LaunchScreen.js';
import { DiagnosisScreen } from './screens/DiagnosisScreen.js';
import { SimulatorScreen } from './screens/SimulatorScreen.js';
import { AuditScreen } from './screens/AuditScreen.js';
import { ExecutionScreen } from './screens/ExecutionScreen.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as NavTab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewScreen onNavigate={handleNavigate} />;
      case 'diagnosis':
        return <DiagnosisScreen onNavigate={handleNavigate} />;
      case 'simulator':
        return <SimulatorScreen onNavigate={handleNavigate} />;
      case 'execution':
        return <ExecutionScreen onNavigate={handleNavigate} />;
      case 'audit':
        return <AuditScreen onNavigate={handleNavigate} />;
      case 'launch':
        return <LaunchScreen onNavigate={handleNavigate} />;
      default:
        return <OverviewScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex font-sans antialiased min-h-screen bg-[#03081A] text-white">
      {/* Persistent Side Navigation */}
      <SideNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRunRecovery={() => setActiveTab('simulator')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#03081A]">
        {/* Top Header Bar (hidden on launch screen for cinematic focus) */}
        {activeTab !== 'launch' && <TopAppBar />}

        {/* Screen Canvas */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
