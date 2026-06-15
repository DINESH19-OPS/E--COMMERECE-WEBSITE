"use client";

import React from 'react';

export default function ImmersivePage() {
  return (
    <main className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white">
      {/* background video removed */}

      <div className="max-w-7xl w-full z-10 mx-auto flex-1 flex flex-col px-6 md:px-8" style={{paddingTop: '4rem'}}>
        <section style={{padding: '4rem 0'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'white'}}>Welcome to <span style={{background: 'linear-gradient(135deg,#CF9EFF,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Lumina</span></h1>
          <p style={{color: 'rgba(255,255,255,0.85)', maxWidth: 720, marginTop: '1rem'}}>Placeholder CTA area — immersive headline and call to action goes here.</p>
          <div style={{marginTop: '1.25rem'}}>
            <button style={{padding: '0.75rem 1.5rem', borderRadius: 9999, background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.04)'}}>Get Started</button>
          </div>
        </section>

        <div style={{flex: 1}} />

        <footer className="w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64 bg-transparent" style={{transition: 'opacity 650ms cubic-bezier(.16,.8,.28,1), transform 650ms cubic-bezier(.16,.8,.28,1)', opacity: 1, transform: 'translateY(0)'}}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
            <div className="md:col-span-5">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
                </svg>
                <span className="text-xl" style={{fontWeight: 600}}>LUMINA</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm" style={{marginTop: '0.75rem'}}>Lumina provides premium clarity on global events and cosmic wonders - shared with all for free.</p>
            </div>

            <div className="md:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">Discover</h4>
                  <div className="text-xs space-y-2 hover:text-white transition-colors">
                    <div>Labs &amp; Workshops</div>
                    <div>Deep Dive Series</div>
                    <div>Global Circle</div>
                    <div>Resource Vault</div>
                    <div>Future Roadmap</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">The Mission</h4>
                  <div className="text-xs space-y-2 hover:text-white transition-colors">
                    <div>Origin Story</div>
                    <div>The Collective</div>
                    <div>Newsroom Hub</div>
                    <div>Join the Team</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">Concierge</h4>
                  <div className="text-xs space-y-2 hover:text-white transition-colors">
                    <div>Get in Touch</div>
                    <div>Legal Privacy</div>
                    <div>User Agreement</div>
                    <div>Report Concern</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50">Curated by @GotInGeorgiG</p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest opacity-50 mr-2">Join the Journey:</span>
                <div className="flex items-center gap-3">
                  <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Music">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17v-6l10-2v6"></path><circle cx="6" cy="18" r="3"></circle></svg>
                  </a>
                  <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H20l-1 3.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>
                  </a>
                  <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Twitter">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.4.6-2.2.7.8-.5 1.4-1.3 1.6-2.3-.8.5-1.6.8-2.6 1-1.1-1.1-2.9-1.2-4.2-.3-1.3.9-1.8 2.6-1.1 4.1C8.4 9.5 6 8.3 4.5 6.4c-.9 1.5-.4 3.5 1.1 4.4-.6 0-1.1-.2-1.6-.4v.1c0 1.6 1.1 3 2.6 3.3-.5.1-1 .1-1.5 0 .4 1.2 1.5 2 2.8 2-1.1.9-2.4 1.5-3.8 1.5 1.3.8 2.8 1.3 4.4 1.3 5.3 0 8.5-4.4 8.5-8.3v-.4c.6-.4 1.2-.9 1.6-1.5-.6.3-1.2.6-1.9.7z"/></svg>
                  </a>
                  <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="YouTube">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a2.9 2.9 0 0 0-2-2C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.7a2.9 2.9 0 0 0-2 2C0 8 0 12 0 12s0 4 0.5 5.8a2.9 2.9 0 0 0 2 2c1.9.7 9.5.7 9.5.7s7.6 0 9.5-.7a2.9 2.9 0 0 0 2-2c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.8 15.5V8.5l6.1 3.5-6.1 3.5z"/></svg>
                  </a>
                  <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.5-3a1.2 1.2 0 1 0 1.2 1.2A1.2 1.2 0 0 0 18.5 5.2z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
