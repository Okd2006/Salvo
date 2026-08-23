/**
 * EmptyState, ErrorState, LoadingSkeleton — state feedback components
 * conforming to Salvo's 35px architectural panel styling.
 */
import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'inbox',
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-border-hairline rounded-[35px] p-12 text-center flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-[20px] bg-[#03081A] border border-border-hairline flex items-center justify-center text-text-tertiary">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div className="max-w-md">
        <h3 className="font-sans text-[20px] font-medium text-white mb-1">{title}</h3>
        <p className="font-sans text-[14px] text-text-secondary">{description}</p>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-2 px-6 py-2.5 rounded-[48px] bg-primary text-white font-sans text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title: string;
  description: string;
  systemResponse?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  systemResponse,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-risk/40 rounded-[35px] p-8 flex flex-col gap-4 ${className}`}
    >
      <div className="flex items-center gap-3 text-risk">
        <span className="material-symbols-outlined text-[24px]">error</span>
        <h3 className="font-sans text-[18px] font-medium text-white">{title}</h3>
      </div>
      <p className="font-sans text-sm text-text-secondary">{description}</p>
      {systemResponse && (
        <div className="bg-[#03081A] p-4 rounded-[16px] border border-border-hairline text-xs font-mono text-text-tertiary">
          SYSTEM ACTION: <span className="text-white">{systemResponse}</span>
        </div>
      )}
      {onRetry && (
        <div className="flex justify-end">
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-[48px] border border-border-hairline text-white text-xs font-mono hover:bg-surface-elevated transition-colors"
          >
            Retry Verification
          </button>
        </div>
      )}
    </div>
  );
};

export interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-border-hairline rounded-[35px] p-6 flex flex-col gap-4 animate-pulse ${className}`}
    >
      <div className="h-5 w-48 bg-surface-elevated rounded-full" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-[#03081A] rounded-[14px] border border-border-hairline/40" />
        ))}
      </div>
    </div>
  );
};
