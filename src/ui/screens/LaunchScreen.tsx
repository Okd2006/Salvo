/**
 * src/ui/screens/LaunchScreen.tsx
 *
 * Salvo Platform Architecture & Autonomous Recovery Engine
 * Connects to GET /api/health and provides end-to-end architectural guide
 */
import React, { useEffect, useState } from 'react';
import { SalvoApi } from '../lib/api.js';
import {
  LaunchHeader,
  ArchitectureFlow,
  ArchitectureLayers,
  GovernanceSection,
  SystemInvariantsCard,
  TechStackAndApiCard,
  DemoFlowCard,
  LaunchActions,
} from '../components/launch/index.js';

export interface LaunchScreenProps {
  onNavigate?: (route: string) => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onNavigate }) => {
  const [systemHealthy, setSystemHealthy] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    SalvoApi.getHealth()
      .then((res) => {
        if (isMounted) setSystemHealthy(res.status === 'healthy');
      })
      .catch(() => {
        if (isMounted) setSystemHealthy(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* 1. Header with CTAs */}
      <LaunchHeader onNavigate={onNavigate} systemHealthy={systemHealthy} />

      {/* 2. Architecture Lifecycle Flow Diagram */}
      <ArchitectureFlow />

      {/* 3. The 7 Architectural Layers */}
      <ArchitectureLayers />

      {/* 4. AI Governance Principle (AI Recommends, Policy Authorizes) */}
      <GovernanceSection />

      {/* 5. 7 Deterministic Safety Invariants */}
      <SystemInvariantsCard />

      {/* 6. Technology Stack & API Map */}
      <TechStackAndApiCard />

      {/* 7. How to Demo Salvo Runbook */}
      <DemoFlowCard onNavigate={onNavigate} />

      {/* 8. Bottom Navigation Action Bar */}
      <LaunchActions onNavigate={onNavigate} />
    </div>
  );
};

export default LaunchScreen;
