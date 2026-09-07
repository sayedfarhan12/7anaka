import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { IntroAnimation } from './components/IntroAnimation';
import { Hero } from './components/Hero';
import { LiveStatus } from './components/LiveStatus';
import { SocialLinks } from './components/SocialLinks';
import { InstaPaySupport } from './components/InstaPaySupport';
import { Footer } from './components/Footer';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#FF5A00]/30 selection:text-[#FFD84D]">
      {/* Cinematic Animated Background Lighting */}
      <AnimatedBackground />

      {/* Cinematic Opening Experience */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Main Single-Page Streamer Stage */}
      <motion.main
        id="main-content"
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-16 pb-6 lg:pb-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: showIntro ? 0 : 1,
          y: showIntro ? 15 : 0,
        }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Streamer Identity Reveal */}
        <Hero />

        {/* Dynamic Live Status System */}
        <LiveStatus />

        {/* Social Media Circular / Rounded Glass Icons */}
        <SocialLinks />

        {/* InstaPay Support Section */}
        <InstaPaySupport />
      </motion.main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
