/**
 * LaunchScreen — "Salvo Launch | Autonomous Recovery" marketing/intro page.
 *
 * Matches Stitch screen: "Salvo Launch | Autonomous Recovery"
 * Implements: shader-like CSS background, hero section, scroll-reveal sections,
 * metric count-up animation, closing CTA.
 *
 * No Three.js or WebGL dependency — uses pure CSS + IntersectionObserver.
 */
import React, { useEffect, useRef } from 'react';

interface LaunchScreenProps {
  onNavigate?: (tab: string) => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-reveal IntersectionObserver (matches launch.html embedded script)
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
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Metric count-up on scroll (matches launch.html metric-counter pattern)
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
          const duration = 2000;
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
      className="flex-1 overflow-y-auto min-w-0 bg-background text-on-surface relative"
    >
      {/* Inline scroll-reveal styles */}
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes slide {
          0% { left: -25%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      {/* Section 1 — Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative z-10 pt-[200px] pb-[200px]">
        <div className="max-w-4xl mx-auto scroll-reveal">
          <h1 className="font-display-lg text-[clamp(40px,6vw,80px)] leading-[1.1] font-semibold mb-6 tracking-tight">
            Step into the world of recovered revenue.
          </h1>
          <p className="text-on-surface-variant font-body-md text-xl max-w-2xl mx-auto font-light">
            Every failed payment, diagnosed and recovered in milliseconds.
          </p>
        </div>
      </section>

      {/* Section 2 — The Problem */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative z-10 border-t border-outline-variant/30">
        <div className="w-full max-w-6xl mx-auto scroll-reveal">
          <h2 className="font-headline-md text-3xl md:text-4xl mb-12 text-on-surface-variant">
            Payments fail in a hundred different ways.
          </h2>
          {/* Animated pulse line */}
          <div className="w-full h-32 relative flex items-center justify-center opacity-70">
            <div className="w-full h-px bg-outline-variant relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full w-1/4 bg-on-surface-variant"
                style={{ animation: 'slide 3s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — The Reveal (pinned scroll scrub) */}
      <section
        className="relative z-10 border-t border-outline-variant/30 bg-background/80 backdrop-blur-sm"
        style={{ height: '200vh' }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{ position: 'sticky', top: 0, height: '100vh' }}
        >
          <div className="text-center w-full max-w-5xl px-4 scroll-reveal">
            <h2 className="font-headline-sm text-on-surface-variant mb-8 uppercase tracking-[0.2em] text-sm">
              Introducing Salvo
            </h2>
            {/* Colour-scrubbing number — static in React; colour could animate via scroll events */}
            <div
              className="font-metric-lg leading-none mb-8 transition-colors duration-500"
              style={{ fontSize: 'clamp(48px, 10vw, 120px)', color: '#00C896' }}
            >
              ₹42,850
            </div>
            <p className="font-body-md text-lg text-on-surface-variant">
              The first autonomous recovery agent built for Razorpay merchants
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — Compounding Results */}
      <section className="min-h-screen flex flex-col justify-center px-4 md:px-24 relative z-10 bg-background border-t border-outline-variant/30 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="font-headline-md text-3xl md:text-5xl mb-24 text-on-surface-variant scroll-reveal">
            Compounding Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 gap-x-12">
            {/* Metric 1 */}
            <div className="scroll-reveal border-l-2 border-outline-variant/50 pl-6">
              <div
                className="font-metric-lg text-primary-container text-5xl md:text-6xl mb-4 metric-counter"
                data-target="94.2"
                data-suffix="%"
                data-decimals="1"
              >
                0.0%
              </div>
              <div className="font-body-sm text-on-surface-variant text-lg">
                Recovery Rate Improvement
              </div>
            </div>
            {/* Metric 2 */}
            <div className="scroll-reveal border-l-2 border-outline-variant/50 pl-6">
              <div
                className="font-metric-lg text-primary-container text-5xl md:text-6xl mb-4 metric-counter"
                data-target="1204"
                data-suffix=" / Sec"
                data-decimals="0"
              >
                0
              </div>
              <div className="font-body-sm text-on-surface-variant text-lg">
                Transactions Diagnosed
              </div>
            </div>
            {/* Metric 3 */}
            <div className="scroll-reveal border-l-2 border-outline-variant/50 pl-6">
              <div
                className="font-metric-lg text-primary-container text-5xl md:text-6xl mb-4 metric-counter"
                data-target="42"
                data-suffix="% reduction"
                data-decimals="0"
              >
                0%
              </div>
              <div className="font-body-sm text-on-surface-variant text-lg">
                False-Positive Reduction
              </div>
            </div>
            {/* Metric 4 */}
            <div className="scroll-reveal border-l-2 border-outline-variant/50 pl-6">
              <div
                className="font-metric-lg text-primary-container text-5xl md:text-6xl mb-4 metric-counter"
                data-prefix="₹"
                data-target="84.5"
                data-suffix="L"
                data-decimals="1"
              >
                ₹0.0L
              </div>
              <div className="font-body-sm text-on-surface-variant text-lg">
                Net Revenue Recovered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Close */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative z-20 bg-black border-t border-outline-variant/30">
        <div className="max-w-3xl mx-auto scroll-reveal">
          <h2 className="font-display-lg text-5xl md:text-7xl font-bold mb-12 tracking-tight">
            Recover what&apos;s already yours.
          </h2>
          <button
            onClick={() => onNavigate?.('overview')}
            className="inline-block bg-primary-container text-background text-lg px-8 py-4 rounded-DEFAULT font-semibold hover:opacity-90 transition-opacity"
          >
            Start Recovery Protocol
          </button>
        </div>
      </section>
    </div>
  );
};
