import React from 'react';

interface TopAppBarProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title, onSearch }) => {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-lg shrink-0">
      <div className="flex items-center gap-xl">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-sm text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search telemetry..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-DEFAULT py-1 pl-[32px] pr-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64 transition-all"
          />
        </div>

        {/* Title badge & Nav Links */}
        <nav className="hidden md:flex items-center gap-lg">
          {title && (
            <span className="font-mono text-xs text-primary uppercase border border-primary/20 bg-primary/10 px-xs py-0.5 rounded font-semibold">
              {title}
            </span>
          )}
          <span className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer uppercase tracking-widest">
            Merchant Portal
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer uppercase tracking-widest">
            API Docs
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-md">
        {/* System Active Badge */}
        <div className="flex items-center gap-xs text-primary bg-primary/10 px-sm py-1 rounded-DEFAULT border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-label-caps uppercase">System Active</span>
        </div>

        <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface border border-outline-variant px-md py-1 rounded-DEFAULT uppercase transition-colors">
          Support
        </button>

        <div className="h-4 w-px bg-outline-variant mx-xs" />

        <button className="p-xs text-on-surface-variant hover:text-on-surface transition-colors rounded-DEFAULT hover:bg-surface-container">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>

        <div className="flex items-center gap-xs cursor-pointer p-xs hover:bg-surface-container rounded-DEFAULT transition-colors">
          <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold text-xs">
            RZP
          </div>
        </div>
      </div>
    </header>
  );
};
