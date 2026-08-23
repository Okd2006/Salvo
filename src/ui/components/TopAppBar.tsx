/**
 * TopAppBar — persistent header matching Salvo's deep space command center.
 */
import React from 'react';

export interface TopAppBarProps {
  onSearch?: (query: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onSearch }) => {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-[#03081A]/95 backdrop-blur-md border-b border-border-hairline flex justify-between items-center px-8 shrink-0">
      <div className="flex items-center gap-8">
        {/* Search Input with 35px radius */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-tertiary text-sm pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions, codes, hashes..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-surface border border-border-hairline text-white font-sans text-sm rounded-[35px] py-1.5 pl-11 pr-4 focus:border-primary focus:outline-none w-72 transition-all placeholder:text-text-tertiary"
          />
        </div>

        {/* Technical Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <a
            href="#"
            className="font-mono text-xs text-text-secondary hover:text-white transition-colors uppercase tracking-wider"
          >
            Razorpay Merchant Portal
          </a>
          <a
            href="#"
            className="font-mono text-xs text-text-secondary hover:text-white transition-colors uppercase tracking-wider"
          >
            Policy Engine v2.1
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* AI Telemetry Active Chip with 17px radius */}
        <div className="flex items-center gap-2 text-ai-signal bg-ai-signal/10 px-3 py-1 rounded-[17px] border border-ai-signal/30 font-mono text-[11px] uppercase tracking-wider font-semibold">
          <div className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
          <span>AUTONOMOUS ENGINE ACTIVE</span>
        </div>

        {/* Secondary Action */}
        <button className="hidden sm:block font-mono text-xs text-text-secondary hover:text-white border border-border-hairline hover:border-border-secondary px-4 py-1.5 rounded-[48px] transition-colors uppercase">
          Support
        </button>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 text-text-secondary">
          <button
            className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors rounded-full hover:bg-surface border border-transparent hover:border-border-hairline"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors rounded-full hover:bg-surface border border-transparent hover:border-border-hairline"
            title="Merchant Account"
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
