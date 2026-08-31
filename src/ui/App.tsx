/**
 * App.tsx — Salvo Financial Command Center Shell & Authentication Routing
 */
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { AppShell } from './layout/AppShell.js';
import type { NavTab } from './components/SideNavBar.js';

import { OverviewScreen } from './screens/OverviewScreen.js';
import { LaunchScreen } from './screens/LaunchScreen.js';
import { DiagnosisScreen } from './screens/DiagnosisScreen.js';
import { SimulatorScreen } from './screens/SimulatorScreen.js';
import { AuditScreen } from './screens/AuditScreen.js';
import { ExecutionScreen } from './screens/ExecutionScreen.js';

import { LoginScreen } from './screens/LoginScreen.js';
import { RegisterScreen } from './screens/RegisterScreen.js';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen.js';

type AppRoute = NavTab | 'login' | 'register' | 'forgot-password' | 'dashboard';

const MainShell: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'login' || path === 'register' || path === 'forgot-password') {
        return path;
      }
      if (path === 'dashboard') return 'overview';
      if (['overview', 'diagnosis', 'simulator', 'execution', 'audit', 'launch'].includes(path)) {
        return path as NavTab;
      }
    }
    return 'overview';
  });

  // Sync route with browser history
  const handleNavigate = (route: string) => {
    const targetRoute = (route === 'dashboard' ? 'overview' : route) as AppRoute;
    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined' && window.history) {
      const urlPath = targetRoute === 'overview' ? '/dashboard' : `/${targetRoute}`;
      window.history.pushState(null, '', urlPath);
    }
  };

  // Listen to popstate (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'login' || path === 'register' || path === 'forgot-password') {
        setCurrentRoute(path);
      } else if (path === 'dashboard') {
        setCurrentRoute('overview');
      } else if (['overview', 'diagnosis', 'simulator', 'execution', 'audit', 'launch'].includes(path)) {
        setCurrentRoute(path as NavTab);
      } else {
        setCurrentRoute('overview');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Loading Splash Screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#03081A] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25 animate-pulse">
          <span className="material-symbols-outlined text-white text-[22px]">token</span>
        </div>
        <div className="font-mono text-xs text-text-tertiary uppercase tracking-widest flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Verifying Workspace Security...</span>
        </div>
      </div>
    );
  }

  // If user is NOT authenticated, only allow auth screens
  if (!isAuthenticated) {
    switch (currentRoute) {
      case 'register':
        return <RegisterScreen onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onNavigate={handleNavigate} />;
      case 'login':
      default:
        return <LoginScreen onNavigate={handleNavigate} />;
    }
  }

  // If user IS authenticated and on an auth screen, automatically forward to dashboard
  const activeNavTab: NavTab =
    currentRoute === 'dashboard' ||
    currentRoute === 'login' ||
    currentRoute === 'register' ||
    currentRoute === 'forgot-password'
      ? 'overview'
      : (currentRoute as NavTab);

  const renderProtectedScreen = () => {
    switch (activeNavTab) {
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
    <AppShell activeTab={activeNavTab} onNavigate={handleNavigate}>
      {renderProtectedScreen()}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainShell />
    </AuthProvider>
  );
};

export default App;
