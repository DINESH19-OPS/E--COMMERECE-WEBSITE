"use client";
import LaserFlow from '../components/LaserFlow';

export default function Home() {
  return (
    <main style={{minHeight: '100vh', background: '#0d0b12', position: 'relative', overflow: 'hidden'}}>
      <LaserFlow className="laser-flow-global" />
      <div style={{position: 'relative', zIndex: 2, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* Page intentionally minimal — laser flow background only */}
      </div>
    </main>
  )
}
