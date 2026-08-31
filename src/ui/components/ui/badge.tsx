import * as React from 'react';
import { cn } from '../../lib/utils.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'cyan' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps): React.JSX.Element {
  const base =
    'inline-flex items-center rounded-[8px] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wider';

  const variants = {
    default: 'bg-primary/20 text-primary border border-primary/40',
    secondary: 'bg-surface-elevated text-text-secondary border border-border-hairline',
    destructive: 'bg-risk/15 text-risk border border-risk/40',
    outline: 'text-text-secondary border border-border-hairline',
    success: 'bg-recovered/15 text-recovered border border-recovered/40',
    cyan: 'bg-ai-signal/15 text-ai-signal border border-ai-signal/40',
    warning: 'bg-caution/15 text-caution border border-caution/40',
  };

  return <div className={cn(base, variants[variant], className)} {...props} />;
}
