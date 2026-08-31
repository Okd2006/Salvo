import * as React from 'react';
import { cn } from '../../lib/utils.js';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn('animate-pulse rounded-[10px] bg-surface-elevated/70 border border-border-hairline/40', className)}
      {...props}
    />
  );
}
