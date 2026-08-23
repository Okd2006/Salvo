/**
 * TopAppBar — persistent header matching the Stitch design across all screens.
 */
import React from 'react';

interface TopAppBarProps {
  onSearch?: (query: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onSearch }) => {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-background border-b border-outline-variant flex justify-between items-center px-lg shrink-0">
      <div className="flex items-center gap-xl">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-sm text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-DEFAULT py-1 pl-xl pr-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none w-64 transition-all"
          />
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-lg">
          <a
            href="#"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors duration-150 uppercase tracking-widest"
          >
            Merchant Portal
          </a>
          <a
            href="#"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors duration-150 uppercase tracking-widest"
          >
            API Docs
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-lg">
        {/* System Active chip */}
        <div className="flex items-center gap-xs text-primary-container bg-primary-container/10 px-sm py-1 rounded-DEFAULT border border-primary-container/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-caps text-label-caps uppercase">System Active</span>
        </div>

        {/* Support */}
        <button className="font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors duration-150 border border-outline-variant px-md py-1.5 rounded-DEFAULT uppercase">
          Support
        </button>

        {/* Icon buttons */}
        <div className="flex items-center gap-sm text-on-surface-variant">
          <button className="p-xs hover:text-on-surface transition-colors rounded-DEFAULT hover:bg-surface-container">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-xs hover:text-on-surface transition-colors rounded-DEFAULT hover:bg-surface-container">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
