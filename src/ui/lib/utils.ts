/**
 * src/ui/lib/utils.ts
 *
 * Standard Shadcn / Watermelon UI Classname Merger Utility
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
