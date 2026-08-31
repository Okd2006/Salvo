import * as React from 'react';
import { cn } from '../../lib/utils.js';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex items-center gap-2 select-none">
        <input
          id={inputId}
          type="checkbox"
          ref={ref}
          className={cn(
            'h-4 w-4 rounded-[4px] border border-border-hairline bg-[#03081A] text-primary focus:ring-1 focus:ring-primary focus:ring-offset-0 transition-colors accent-primary cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-xs text-text-secondary font-sans cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
