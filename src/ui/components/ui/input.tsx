import * as React from 'react';
import { cn } from '../../lib/utils.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[14px] border bg-[#03081A] px-3.5 py-2 text-sm text-white font-sans transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-risk focus-visible:ring-1 focus-visible:ring-risk/60'
            : 'border-border-hairline focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
