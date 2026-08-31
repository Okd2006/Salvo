/**
 * src/ui/components/AuthLayout.tsx
 *
 * Dedicated Deep-Space Financial Auth Layout Shell for Salvo
 */
import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#03081A] flex flex-col justify-between items-center py-10 px-4 sm:px-6 lg:px-8 select-none overflow-x-hidden">
      {/* Background Decorative Radial Gradient Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-60"
        aria-hidden="true"
      >
        <div className="w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-[#3D50FC]/15 via-[#05E0E0]/8 to-transparent blur-[140px]" />
      </div>

      {/* Subtle Financial Network Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15 bg-[linear-gradient(to_right,#292F66_1px,transparent_1px),linear-gradient(to_bottom,#292F66_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top Header / Brand Logo */}
      <header className="relative z-10 w-full max-w-5xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/40">
            <span
              className="material-symbols-outlined text-white text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              token
            </span>
          </div>
          <div>
            <div className="font-sans text-[20px] font-bold text-white tracking-tight leading-none flex items-center gap-2">
              <span>Salvo</span>
              <span className="font-mono text-[10px] text-ai-signal bg-ai-signal/10 px-2 py-0.5 rounded-[12px] border border-ai-signal/30 font-medium">
                v2.1
              </span>
            </div>
            <div className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.08em] mt-1">
              Autonomous Revenue Recovery
            </div>
          </div>
        </div>

        {/* Security & Test Mode Badges */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-secondary bg-[#020626]/80 px-3 py-1.5 rounded-[17px] border border-border-hairline font-mono text-[11px]">
            <span className="material-symbols-outlined text-recovered text-[14px]">
              verified_user
            </span>
            <span>POLICY-CONTROLLED EXECUTION</span>
          </div>
          <div className="flex items-center gap-1.5 text-ai-signal bg-ai-signal/10 px-3 py-1.5 rounded-[17px] border border-ai-signal/30 font-mono text-[11px] font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
            <span>RAZORPAY TEST GATEWAY</span>
          </div>
        </div>
      </header>

      {/* Main Centered Card Container */}
      <main className="relative z-10 w-full max-w-[460px] my-auto py-6">
        <div className="w-full bg-[#020626]/95 backdrop-blur-xl border border-border-hairline rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Subtle top card glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          {children}
        </div>
      </main>

      {/* Trust & Compliance Footer */}
      <footer className="relative z-10 w-full max-w-xl text-center shrink-0">
        <div className="flex items-center justify-center gap-2 text-text-tertiary font-mono text-xs">
          <span className="material-symbols-outlined text-text-tertiary text-[16px]">
            lock
          </span>
          <span>Secure payment recovery infrastructure with policy-controlled execution.</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-text-tertiary/70 font-sans">
          <span>256-Bit Cryptographic Invariant Ledger</span>
          <span>•</span>
          <span>Non-Custodial Recovery</span>
          <span>•</span>
          <span>Zero Live Money Risk</span>
        </div>
      </footer>
    </div>
  );
};
