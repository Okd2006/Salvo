import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import './globals.css';

console.log('🚀 Salvo AI initializing...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('✅ Root element found, creating React root...');

  const root = ReactDOM.createRoot(rootElement);
  
  console.log('✅ React root created, rendering App...');

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Fatal error during initialization:', error);
  document.body.innerHTML = `
    <div style="min-height: 100vh; background: #03081A; display: flex; align-items: center; justify-content: center; color: white; font-family: system-ui; padding: 2rem;">
      <div style="max-width: 600px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 1rem;">⚠️</div>
        <h1 style="font-size: 24px; margin-bottom: 1rem;">Failed to Initialize Application</h1>
        <pre style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: left; overflow: auto; font-size: 12px;">${error}</pre>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">Reload Page</button>
      </div>
    </div>
  `;
}
