import React, { useState } from 'react';
import { SideNavBar, NavTab } from './components/SideNavBar.js';
import { TopAppBar } from './components/TopAppBar.js';

// Screens
import { OverviewScreen } from './screens/OverviewScreen.js';
import { LaunchScreen } from './screens/LaunchScreen.js';
import { DiagnosisScreen } from './screens/DiagnosisScreen.js';
import { SimulatorScreen } from './screens/SimulatorScreen.js';
import { ShaderScreen } from './screens/ShaderScreen.js';
import { ThreejsScreen } from './screens/ThreejsScreen.js';
import { AuditScreen } from './screens/AuditScreen.js';
import { ExecutionScreen } from './screens/ExecutionScreen.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as NavTab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewScreen onNavigate={handleNavigate} />;
      case 'launch':
        return <LaunchScreen onNavigate={handleNavigate} />;
      case 'diagnosis':
        return <DiagnosisScreen onNavigate={handleNavigate} />;
      case 'simulator':
        return <SimulatorScreen onNavigate={handleNavigate} />;
      case 'shader':
        return <ShaderScreen />;
      case 'threejs':
        return <ThreejsScreen />;
      case 'audit':
        return <AuditScreen onNavigate={handleNavigate} />;
      case 'execution':
        return <ExecutionScreen onNavigate={handleNavigate} />;
      default:
        return <OverviewScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex font-body-md text-body-md antialiased min-h-screen bg-background text-on-surface">
      {/* Shared Side Navigation Bar */}
      <SideNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRunRecovery={() => setActiveTab('simulator')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Shared Top App Bar */}
        <TopAppBar title={activeTab.toUpperCase()} />

        {/* Screen Canvas */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {renderActiveScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
