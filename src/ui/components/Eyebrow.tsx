/**
 * Eyebrow — technical uppercase category / section label.
 */
import React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ai' | 'neutral' | 'recovered' | 'risk';
  dot?: boolean;
  className?: string;
}

const colorMap = {
  primary: 'text-primary border-primary/30 bg-primary/10',
  ai: 'text-ai-signal border-ai-signal/30 bg-ai-signal/10',
  neutral: 'text-text-secondary border-border-hairline bg-surface',
  recovered: 'text-recovered border-recovered/30 bg-recovered/10',
  risk: 'text-risk border-risk/30 bg-risk/10',
};

const dotColorMap = {
  primary: 'bg-primary',
  ai: 'bg-ai-signal',
  neutral: 'bg-text-tertiary',
  recovered: 'bg-recovered',
  risk: 'bg-risk',
};

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  variant = 'ai',
  dot = true,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-[17px] border font-mono text-[11px] uppercase tracking-[0.08em] font-semibold w-max ${colorMap[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColorMap[variant]} ${
            variant === 'ai' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{children}</span>
    </div>
  );
};
