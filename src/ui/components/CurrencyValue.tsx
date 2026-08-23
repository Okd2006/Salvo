/**
 * CurrencyValue — renders a paise amount in JetBrains Mono with strict semantic color.
 *
 * Rules:
 *  - Input is always in integer paise (1 INR = 100 paise)
 *  - Uses formatPaise from src/lib/currency.ts (en-IN locale ₹4,82,350)
 *  - Semantic color variants:
 *      - "recovered": #00C896 (recovered money ONLY)
 *      - "risk": #FF6B4A (lost/declined/at-risk money ONLY)
 *      - "primary": #3D50FC (primary interactive/focus)
 *      - "ai": #05E0E0 (AI telemetry/projection)
 *      - "neutral": #FFFFFF (standard high emphasis)
 *      - "muted": #AAB1F2 (secondary emphasis)
 */
import React from 'react';
import { formatPaise } from '../../lib/currency.js';

export interface CurrencyValueProps {
  paise: number;
  variant?: 'neutral' | 'recovered' | 'risk' | 'primary' | 'ai' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  prefix?: string;
}

const sizeClass: Record<NonNullable<CurrencyValueProps['size']>, string> = {
  sm: 'font-mono text-[13px] leading-[18px] font-medium tracking-normal',
  md: 'font-mono text-[15px] leading-[20px] font-medium tracking-normal',
  lg: 'font-mono text-[24px] leading-[30px] font-medium tracking-tight',
  xl: 'font-mono text-[36px] md:text-[44px] leading-[44px] md:leading-[52px] font-medium tracking-tight',
};

const colorClass: Record<NonNullable<CurrencyValueProps['variant']>, string> = {
  neutral: 'text-white',
  recovered: 'text-recovered',
  risk: 'text-risk',
  primary: 'text-primary',
  ai: 'text-ai-signal',
  muted: 'text-text-secondary',
};

export const CurrencyValue: React.FC<CurrencyValueProps> = ({
  paise,
  variant = 'neutral',
  size = 'md',
  className = '',
  prefix = '',
}) => {
  return (
    <span className={`tabular-nums ${sizeClass[size]} ${colorClass[variant]} ${className}`}>
      {prefix}{formatPaise(paise)}
    </span>
  );
};
