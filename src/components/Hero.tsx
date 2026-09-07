import React from 'react';
import { motion } from 'motion/react';
import { CommunityFollowersBadge } from './CommunityFollowersBadge';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center justify-center text-center pt-1 sm:pt-2 pb-1 z-10"
      aria-label="Streamer Identity"
    >
      {/* Streamer Avatar Frame with Atmospheric Neon Glow */}
      <motion.div
        className="relative group mb-2.5 sm:mb-3 lg:mb-3.5"
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ambient Neon Backlight Halo */}
        <div
          className="absolute -inset-2 sm:-inset-2.5 lg:-inset-3 rounded-full blur-xl lg:blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5A00 0%, #FFC400 60%, transparent 80%)',
          }}
        />

        {/* Outer Glowing Border Ring */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full p-[2px] bg-gradient-to-b from-[#FF7A00] via-[#FFD84D]/60 to-[#FF5A00]/30 shadow-[0_0_28px_rgba(255,90,0,0.35)] lg:shadow-[0_0_40px_rgba(255,90,0,0.45)]">
          {/* Inner Glass Disc */}
          <div className="w-full h-full rounded-full bg-[#090909]/90 backdrop-blur-md p-1 sm:p-1.5 flex items-center justify-center overflow-hidden border border-white/10">
            <img
              src="/7naka_avatar.png"
              alt="7NAKA Official Avatar"
              className="w-full h-full object-cover rounded-full filter contrast-105 transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
          </div>
        </div>

        {/* Floating Neon Accent Tag */}
        <div className="absolute -bottom-1.5 lg:-bottom-2 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#050505]/95 border border-[#FF7A00]/50 shadow-[0_0_12px_rgba(255,90,0,0.4)] backdrop-blur-md">
          <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-widest text-[#FFD84D] uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
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
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF6E5] to-[#FFA834] select-none"
          style={{
            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
            filter: 'drop-shadow(0 0 35px rgba(255, 90, 0, 0.35))',
          }}
        >
          7NAKA
        </h1>

        {/* Ambient Underglow */}
        <div
          className="absolute -inset-x-10 lg:-inset-x-16 top-1/2 -translate-y-1/2 h-8 lg:h-12 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, #FF5A00 0%, #FFC400 50%, transparent 80%)',
          }}
        />
      </motion.div>

      {/* Secondary Subtitle: STREAMER • CONTENT CREATOR */}
      <motion.div
        className="mt-1.5 sm:mt-2 lg:mt-2.5 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      >
        <p
          id="streamer-role"
          className="text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-[0.22em] sm:tracking-[0.3em] lg:tracking-[0.38em] text-[#FFC400]/90 uppercase"
        >
          STREAMER <span className="text-[#FF5A00] px-1">•</span> CONTENT CREATOR
        </p>
      </motion.div>

      {/* Combined Followers Badge: Kick & TikTok */}
      <CommunityFollowersBadge />
    </section>
  );
};
