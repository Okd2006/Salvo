/**
 * ErrorBoundary.tsx - Global error boundary to catch React errors
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#03081A] flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-4">Application Error</h1>
          <div className="max-w-2xl w-full bg-surface-low rounded-xl p-6 border border-outline-variant">
            <div className="font-mono text-sm text-red-400 mb-4">
              {this.state.error?.toString()}
            </div>
            {this.state.errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                  Component Stack
                </summary>
                <pre className="mt-2 text-xs text-text-tertiary overflow-auto p-4 bg-[#03081A] rounded-lg">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
