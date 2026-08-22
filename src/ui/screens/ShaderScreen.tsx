import React from 'react';
import { ShaderCanvas } from '../components/ShaderCanvas.js';

export const ShaderScreen: React.FC = () => {
  return (
    <main className="flex-1 relative w-full h-full bg-black overflow-hidden flex flex-col">
      <ShaderCanvas className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 p-xl pointer-events-none flex flex-col justify-between h-full">
        <div>
          <div className="inline-flex items-center gap-xs px-sm py-1 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase mb-xs">
            WebGL Shader Mesh
          </div>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">Ambient Recovery Field</h1>
          <p className="font-body-md text-on-surface-variant max-w-md mt-xs">
            Dynamic low-frequency background animation for Salvo financial telemetry canvas.
          </p>
        </div>

        <div className="bg-surface-container/80 backdrop-blur border border-outline-variant p-md rounded-lg max-w-sm pointer-events-auto">
          <div className="font-label-caps text-xs text-on-surface-variant uppercase mb-xs font-semibold">
            Shader Uniforms
          </div>
          <div className="font-mono text-xs space-y-1 text-on-surface">
            <div>u_time: active</div>
            <div>u_resolution: 100% x 100%</div>
            <div>u_mouse: active tracker</div>
            <div>Base: #0B0F14 | Accent: #131922</div>
          </div>
        </div>
      </div>
    </main>
  );
};
