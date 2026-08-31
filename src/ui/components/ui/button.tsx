import * as React from 'react';
import { cn } from '../../lib/utils.js';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow' | 'cyber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      default: 'bg-primary text-white shadow hover:bg-primary-hover active:scale-[0.99]',
      destructive: 'bg-risk text-white shadow-sm hover:bg-risk/90',
      outline:
        'border border-border-hairline bg-transparent hover:bg-surface-elevated hover:text-white text-text-secondary',
      secondary: 'bg-surface-elevated text-white hover:bg-surface-hover border border-border-hairline',
      ghost: 'hover:bg-surface-elevated hover:text-white text-text-secondary',
      link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-normal',
      glow: 'bg-primary text-white shadow-[0_0_20px_rgba(61,80,252,0.4)] hover:shadow-[0_0_25px_rgba(61,80,252,0.6)] hover:bg-primary-hover',
      cyber:
        'bg-[#03081A] border border-ai-signal/40 text-ai-signal hover:bg-ai-signal/10 hover:border-ai-signal shadow-[0_0_15px_rgba(5,224,224,0.15)] font-mono',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-[10px] px-3 text-xs',
      lg: 'h-12 rounded-[16px] px-8 text-base',
      icon: 'h-9 w-9 rounded-[10px] p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
