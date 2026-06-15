'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import AnimatedDashboardPreview from './AnimatedDashboardPreview';

/**
 * HeroClient — the homepage hero section.
 * The LaserFlow background is now provided globally via GlobalBackground in layout.tsx.
 * This section is fully transparent so the global laser beam shows through.
 * We keep the mouse-reveal image overlay from the original LaserFlow example.
 */
export default function HeroClient() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Transparent — global LaserFlow background shows through
        backgroundColor: 'transparent',
      }}
    >
      {/* Mouse-reveal image overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={revealImgRef}
        src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=1600"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '100%',
          top: '-50%',
          zIndex: 2,
          mixBlendMode: 'lighten',
          opacity: 0.25,
          pointerEvents: 'none',
          ['--mx' as string]: '-9999px',
          ['--my' as string]: '-9999px',
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* Hero text content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          padding: '7rem 1rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.9rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            backgroundColor: 'rgba(168,85,247,0.18)',
            color: '#d8b4fe',
            border: '1px solid rgba(168,85,247,0.35)',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles size={12} /> Next-Gen Hardware
        </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textShadow: '0 0 40px rgba(207,158,255,0.35)',
            }}
          >
            Organize Your Work. <span style={{ background: 'linear-gradient(135deg,#CF9EFF,#a855f7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Achieve More.</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'rgba(207,158,255,0.75)',
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Manage tasks, track progress, and stay productive with a modern task management experience.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                color: '#fff',
                boxShadow: '0 0 32px rgba(6,182,212,0.25)',
                textDecoration: 'none',
              }}
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <a
              href="#demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '1rem',
                background: 'rgba(207,158,255,0.06)',
                color: '#d8b4fe',
                border: '1px solid rgba(207,158,255,0.18)',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
              }}
            >
              View Demo
            </a>
          </div>

          {/* Animated preview below CTAs */}
          <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center' }}>
            <AnimatedDashboardPreview />
          </div>
      </div>

      {/* Bottom fade — blends into the next section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, rgba(13,11,18,0.85))',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
