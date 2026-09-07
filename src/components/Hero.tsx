import React from 'react';
import { motion } from 'motion/react';
import { CommunityFollowersBadge } from './CommunityFollowersBadge';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center justify-center text-center pt-2 sm:pt-4 pb-2 z-10"
      aria-label="Streamer Identity"
    >
      {/* Streamer Avatar Frame with Atmospheric Neon Glow */}
      <motion.div
        className="relative group mb-5 sm:mb-6 lg:mb-8"
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ambient Neon Backlight Halo */}
        <div
          className="absolute -inset-2 sm:-inset-3 lg:-inset-4 rounded-full blur-xl lg:blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5A00 0%, #FFC400 60%, transparent 80%)',
          }}
        />

        {/* Outer Glowing Border Ring */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full p-[2px] lg:p-[3px] bg-gradient-to-b from-[#FF7A00] via-[#FFD84D]/60 to-[#FF5A00]/30 shadow-[0_0_35px_rgba(255,90,0,0.35)] lg:shadow-[0_0_55px_rgba(255,90,0,0.45)]">
          {/* Inner Glass Disc */}
          <div className="w-full h-full rounded-full bg-[#090909]/90 backdrop-blur-md p-1.5 lg:p-2 flex items-center justify-center overflow-hidden border border-white/10">
            <img
              src="/7naka_avatar.png"
              alt="7NAKA Official Avatar"
              className="w-full h-full object-cover rounded-full filter contrast-105 transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
          </div>
        </div>

        {/* Floating Neon Accent Tag */}
        <div className="absolute -bottom-1.5 lg:-bottom-2 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 lg:px-4 py-0.5 lg:py-1 rounded-full bg-[#050505]/95 border border-[#FF7A00]/50 shadow-[0_0_12px_rgba(255,90,0,0.4)] backdrop-blur-md">
          <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-widest text-[#FFD84D] uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#FF7A00] animate-pulse" />
            OFFICIAL
          </span>
        </div>
      </motion.div>

      {/* Main Display Name: 7NAKA */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          id="streamer-name"
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF6E5] to-[#FFA834] select-none"
          style={{
            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
            filter: 'drop-shadow(0 0 45px rgba(255, 90, 0, 0.35))',
          }}
        >
          7NAKA
        </h1>

        {/* Ambient Underglow */}
        <div
          className="absolute -inset-x-12 lg:-inset-x-24 top-1/2 -translate-y-1/2 h-10 lg:h-16 rounded-full blur-2xl lg:blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, #FF5A00 0%, #FFC400 50%, transparent 80%)',
          }}
        />
      </motion.div>

      {/* Secondary Subtitle: STREAMER • CONTENT CREATOR */}
      <motion.div
        className="mt-2 sm:mt-3 lg:mt-4 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      >
        <p
          id="streamer-role"
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-[0.25em] sm:tracking-[0.35em] lg:tracking-[0.45em] text-[#FFC400]/90 uppercase"
        >
          STREAMER <span className="text-[#FF5A00] px-1 lg:px-2">•</span> CONTENT CREATOR
        </p>
      </motion.div>

      {/* Combined Followers Badge: Kick & TikTok */}
      <CommunityFollowersBadge />
    </section>
  );
};
