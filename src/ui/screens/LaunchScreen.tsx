/**
 * LaunchScreen — Salvo Launch | Autonomous Recovery.
 *
 * Visual Concept: Deep-Space Financial Command Center
 *  - Hero Typography: 76px–92px Thin (300 weight)
 *  - Generous negative whitespace and architectural spatial flow
 *  - High-precision count-up metric telemetry
 *  - 48px action controls
 */
import React, { useEffect, useRef } from 'react';
import { Eyebrow } from '../components/Eyebrow.js';

interface LaunchScreenProps {
  onNavigate?: (tab: string) => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal observer
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll<HTMLElement>('.scroll-reveal');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Metric count-up observer
  useEffect(() => {
    const metrics = containerRef.current?.querySelectorAll<HTMLElement>('.metric-counter');
    if (!metrics) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.dataset['counted']) return;
          el.dataset['counted'] = 'true';

          const target = parseFloat(el.dataset['target'] ?? '0');
          const prefix = el.dataset['prefix'] ?? '';
          const suffix = el.dataset['suffix'] ?? '';
          const decimals = parseInt(el.dataset['decimals'] ?? '1', 10);
          const duration = 1800;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = (ease * target).toFixed(decimals);
            el.textContent = `${prefix}${Number(value).toLocaleString('en-IN')}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 }
    );

    metrics.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto min-w-0 bg-[#03081A] text-white relative selection:bg-primary/40"
    >
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes pulseLine {
          0% { left: -25%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10 pt-24 pb-28">
        <div className="max-w-4xl mx-auto space-y-6 scroll-reveal">
          <Eyebrow variant="ai">Autonomous Revenue Recovery Infrastructure</Eyebrow>
          <h1 className="font-sans text-[52px] sm:text-[72px] md:text-[88px] leading-[1.05] font-light tracking-[-0.03em] text-white">
            Step into the world of recovered revenue.
          </h1>
          <p className="text-text-secondary font-sans text-lg sm:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Every failed transaction, diagnosed by Gemini and autonomously resolved in milliseconds.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate?.('overview')}
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-[48px] text-base font-medium transition-all shadow-md flex items-center gap-2"
            >
              <span>Enter Command Center</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate?.('diagnosis')}
              className="px-8 py-3.5 bg-surface border border-border-hairline hover:border-border-secondary text-text-secondary hover:text-white rounded-[48px] text-base font-medium transition-all"
            >
              Explore AI Diagnosis
            </button>
          </div>
        </div>
      </section>

      {/* The Problem Narrative Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6 relative z-10 border-t border-border-hairline/40 py-24">
        <div className="w-full max-w-5xl mx-auto space-y-8 scroll-reveal">
          <Eyebrow variant="risk">The Problem</Eyebrow>
          <h2 className="font-sans text-[34px] sm:text-[46px] font-light text-white tracking-[-0.02em]">
            Payments fail in a hundred different ways.
          </h2>
          <p className="font-sans text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Network latency, issuing bank throttles, expired cards, and transient 2FA drops silently drain merchant EBITDA every second.
          </p>

          {/* Precision Pulse Vector Visualization */}
          <div className="w-full h-24 relative flex items-center justify-center pt-8">
            <div className="w-full max-w-2xl h-[1px] bg-border-hairline relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full w-1/3 bg-ai-signal"
                style={{ animation: 'pulseLine 3s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Scrub Reveal Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative z-10 border-t border-border-hairline/40 bg-[#020626] py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 scroll-reveal">
          <Eyebrow variant="primary">The Solution</Eyebrow>
          <div className="font-mono text-[56px] sm:text-[84px] md:text-[110px] leading-none text-recovered font-light tracking-tight">
            ₹42,850
          </div>
          <p className="font-sans text-lg sm:text-2xl text-text-secondary font-light max-w-xl mx-auto">
            The first autonomous AI revenue recovery agent purpose-built for Razorpay merchants.
          </p>
        </div>
      </section>

      {/* Compounding Results Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 relative z-10 bg-[#03081A] border-t border-border-hairline/40 py-32">
        <div className="max-w-[1280px] mx-auto w-full space-y-16">
          <div className="space-y-3 scroll-reveal">
            <Eyebrow variant="ai">Performance Metrics</Eyebrow>
            <h2 className="font-sans text-[36px] sm:text-[50px] font-light text-white tracking-[-0.02em]">
              Compounding Autonomous Results
            </h2>
            <p className="font-sans text-base text-text-secondary max-w-2xl">
              Proven algorithmic performance benchmarks running across live high-velocity transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Metric 1 */}
            <div className="bg-surface border border-border-hairline rounded-[35px] p-8 lg:p-10 flex flex-col justify-between gap-6 scroll-reveal">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                Telemetry Yield
              </span>
              <div
                className="font-mono text-5xl lg:text-6xl text-recovered font-medium metric-counter tracking-tight"
                data-target="94.2"
                data-suffix="%"
                data-decimals="1"
              >
                0.0%
              </div>
              <div className="font-sans text-sm text-text-secondary border-t border-border-hairline pt-4">
                Recovery Rate Improvement on transient gateway timeouts
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-surface border border-border-hairline rounded-[35px] p-8 lg:p-10 flex flex-col justify-between gap-6 scroll-reveal">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                Processing Throughput
              </span>
              <div
                className="font-mono text-5xl lg:text-6xl text-white font-medium metric-counter tracking-tight"
                data-target="1204"
                data-suffix=" / Sec"
                data-decimals="0"
              >
                0
              </div>
              <div className="font-sans text-sm text-text-secondary border-t border-border-hairline pt-4">
                Autonomous transaction failure classifications per second
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-surface border border-border-hairline rounded-[35px] p-8 lg:p-10 flex flex-col justify-between gap-6 scroll-reveal">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                Safety Verification
              </span>
              <div
                className="font-mono text-5xl lg:text-6xl text-ai-signal font-medium metric-counter tracking-tight"
                data-target="42"
                data-suffix="% Drop"
                data-decimals="0"
              >
                0%
              </div>
              <div className="font-sans text-sm text-text-secondary border-t border-border-hairline pt-4">
                False-positive decline reduction through deterministic policy gating
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-surface border border-border-hairline rounded-[35px] p-8 lg:p-10 flex flex-col justify-between gap-6 scroll-reveal">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                Net Cumulative Yield
              </span>
              <div
                className="font-mono text-5xl lg:text-6xl text-recovered font-medium metric-counter tracking-tight"
                data-prefix="₹"
                data-target="84.5"
                data-suffix="L"
                data-decimals="1"
              >
                ₹0.0L
              </div>
              <div className="font-sans text-sm text-text-secondary border-t border-border-hairline pt-4">
                Net recovered revenue directly deposited into merchant accounts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6 relative z-20 bg-[#020626] border-t border-border-hairline py-28">
        <div className="max-w-3xl mx-auto space-y-8 scroll-reveal">
          <h2 className="font-sans text-[44px] sm:text-[64px] font-light text-white tracking-[-0.03em] leading-tight">
            Recover what&apos;s already yours.
          </h2>
          <button
            onClick={() => onNavigate?.('overview')}
            className="px-10 py-4 bg-primary hover:bg-primary-hover text-white text-base font-medium rounded-[48px] transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>Launch Salvo Telemetry</span>
          </button>
        </div>
      </section>
    </div>
  );
};
