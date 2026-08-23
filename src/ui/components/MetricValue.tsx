/**
 * MetricValue — displays tabular numerical metrics with consistent typography.
 */
import React from 'react';

export interface MetricValueProps {
  value: string | number;
  label?: string;
  sublabel?: string;
  prefix?: string;
  suffix?: string;
  variant?: 'neutral' | 'recovered' | 'risk' | 'primary' | 'ai' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

const sizeClass: Record<NonNullable<MetricValueProps['size']>, string> = {
  sm: 'font-mono text-[14px] leading-[18px] font-medium',
  md: 'font-mono text-[18px] leading-[24px] font-medium',
  lg: 'font-mono text-[32px] md:text-[38px] leading-[38px] md:leading-[44px] font-medium tracking-tight',
  hero: 'font-mono text-[56px] md:text-[72px] leading-[1.05] font-light tracking-tighter',
};

const colorClass: Record<NonNullable<MetricValueProps['variant']>, string> = {
  neutral: 'text-white',
  recovered: 'text-recovered',
  risk: 'text-risk',
  primary: 'text-primary',
  ai: 'text-ai-signal',
  muted: 'text-text-secondary',
};

export const MetricValue: React.FC<MetricValueProps> = ({
  value,
  label,
  sublabel,
  prefix = '',
  suffix = '',
  variant = 'neutral',
  size = 'lg',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          {label}
        </span>
      )}
      <div className={`tabular-nums ${sizeClass[size]} ${colorClass[variant]}`}>
        {prefix}
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        {suffix}
      </div>
      {sublabel && (
        <span className="font-sans text-[13px] text-text-secondary">
          {sublabel}
        </span>
      )}
    </div>
  );
};
