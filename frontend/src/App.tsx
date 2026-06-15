import React from 'react'
import { motion } from 'framer-motion'
import { Music2, Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

export default function App(): JSX.Element {
  return (
    <main className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white">
      {/* background video removed */}

      <div className="max-w-7xl w-full z-10 mx-auto flex-1 flex flex-col px-6 md:px-8">
        <div className="py-24">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">Welcome to Lumina</h1>
          <p className="mt-4 text-white/80 max-w-xl">Placeholder CTA area — immersive headline and call to action goes here.</p>
          <div className="mt-8">
            <button className="px-5 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition">Get Started</button>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64 bg-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor"><path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" /></svg>
                <span className="text-xl font-medium">LUMINA</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mt-4">Lumina provides premium clarity on global events and cosmic wonders - shared with all for free.</p>
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
                <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Music"><Music2 size={16} /></a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Facebook"><Facebook size={16} /></a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Twitter"><Twitter size={16} /></a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="YouTube"><Youtube size={16} /></a>
                <a href="#" className="opacity-70 hover:opacity-100 transition-colors hover:text-white" aria-label="Instagram"><Instagram size={16} /></a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}
