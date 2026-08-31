import * as React from 'react';
import { cn } from '../../lib/utils.js';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback = 'U', size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: 'h-7 w-7 text-xs',
      md: 'h-9 w-9 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full border border-border-hairline bg-[#020626] font-medium text-white items-center justify-center select-none',
          sizes[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            onError={() => setImageError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span className="font-mono uppercase text-text-secondary">{fallback}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
