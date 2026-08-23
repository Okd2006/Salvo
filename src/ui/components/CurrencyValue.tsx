/**
 * CurrencyValue — renders a paise amount in JetBrains Mono with semantic color.
 *
 * Usage:
 *   <CurrencyValue paise={48235000} />                // ₹4,82,350  (neutral)
 *   <CurrencyValue paise={48235000} variant="recovered" />   // green
 *   <CurrencyValue paise={48235000} variant="risk" />        // coral/red
 */
import React from 'react';
import { formatPaise } from '../../lib/currency.js';

interface CurrencyValueProps {
  paise: number;
  variant?: 'neutral' | 'recovered' | 'risk' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass: Record<NonNullable<CurrencyValueProps['size']>, string> = {
  sm: 'font-metric-md text-metric-md',
  md: 'font-metric-md text-metric-md text-base',
  lg: 'font-metric-lg text-metric-lg',
};

const colorClass: Record<NonNullable<CurrencyValueProps['variant']>, string> = {
  neutral: 'text-on-surface',
  recovered: 'text-primary-container',
  risk: 'text-error',
  muted: 'text-on-surface-variant',
};

export const CurrencyValue: React.FC<CurrencyValueProps> = ({
  paise,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  return (
    <span className={`${sizeClass[size]} ${colorClass[variant]} ${className}`}>
      {formatPaise(paise)}
    </span>
  );
};
