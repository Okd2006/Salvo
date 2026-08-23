/**
 * PageHeader — standard screen header with thin display typography,
 * eyebrow badge, description, and optional action buttons with 48px radius.
 */
import React from 'react';
import { Eyebrow } from './Eyebrow.js';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  eyebrowVariant?: 'primary' | 'ai' | 'neutral' | 'recovered' | 'risk';
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  eyebrowVariant = 'ai',
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-hairline ${className}`}
    >
      <div className="flex flex-col gap-2 max-w-3xl">
        {eyebrow && <Eyebrow variant={eyebrowVariant}>{eyebrow}</Eyebrow>}
        <h1 className="font-sans text-[38px] md:text-[48px] leading-[1.12] font-light tracking-[-0.02em] text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[15px] leading-[22px] text-text-secondary font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
};
