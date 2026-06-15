'use client';

import dynamic from 'next/dynamic';

const LaserFlow = dynamic(() => import('./LaserFlow'), { ssr: false });

/**
 * GlobalBackground renders the LaserFlow WebGL animation as a fixed full-viewport
 * backdrop behind every page of the site. It stays below all content (z-index: 0)
 * and is not interactive (pointer-events: none).
 */
export default function GlobalBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // Dark base so the laser beam is always visible
        backgroundColor: '#0d0b12',
      }}
    >
      <LaserFlow
        color="#CF9EFF"
        horizontalBeamOffset={0.0}
        verticalBeamOffset={0.0}
        horizontalSizing={0.7}
        verticalSizing={2.2}
        wispDensity={0.8}
        wispSpeed={12}
        wispIntensity={4}
        flowSpeed={0.3}
        flowStrength={0.22}
        fogIntensity={0.18}
        fogScale={0.28}
        fogFallSpeed={0.55}
        decay={1.15}
        falloffStart={1.2}
        mouseSmoothTime={0.08}
        mouseTiltStrength={0.4}
      />
    </div>
  );
}
