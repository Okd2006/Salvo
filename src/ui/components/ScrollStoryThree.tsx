import React, { useEffect, useRef, useState } from 'react';

export const ScrollStoryThree: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = containerRef.current.offsetHeight - window.innerHeight;
      if (height <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / height));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolate color from #FF6B4A (Coral) to #00C896 (Teal)
  const coral = { r: 255, g: 107, b: 74 };
  const teal = { r: 0, g: 200, b: 150 };
  const r = Math.round(coral.r + (teal.r - coral.r) * scrollProgress);
  const g = Math.round(coral.g + (teal.g - coral.g) * scrollProgress);
  const b = Math.round(coral.b + (teal.b - coral.b) * scrollProgress);
  const scrubColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <div ref={containerRef} className="w-full min-h-[150vh] bg-background text-on-surface p-xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col gap-24 py-16">
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-xs text-primary">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-label-caps uppercase tracking-widest text-xs">Autonomous Telemetry</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Interactive Recovery Scrubbing</h2>
          <p className="font-body-md text-on-surface-variant max-width-xl">
            Scroll down to watch revenue transitioning from at-risk failure (coral) to verified recovery (teal).
          </p>
        </div>

        {/* Scrubbing Canvas Card */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center gap-lg relative min-h-[400px]">
          <div className="font-label-caps text-on-surface-variant uppercase text-xs tracking-widest">
            Recovery Transition Vector
          </div>
          <div
            className="font-metric-lg text-[64px] font-bold transition-colors duration-75 text-center"
            style={{ color: scrubColor }}
          >
            ₹{Math.round(482350 * scrollProgress).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-md">
            <span className="px-md py-1 rounded bg-risk/20 text-risk font-mono text-xs font-semibold">
              At Risk (#FF6B4A)
            </span>
            <span className="text-on-surface-variant font-mono text-xs">→</span>
            <span className="px-md py-1 rounded bg-recovered/20 text-recovered font-mono text-xs font-semibold">
              Recovered (#00C896)
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-md">
            <div
              className="h-full transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%`, backgroundColor: scrubColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
