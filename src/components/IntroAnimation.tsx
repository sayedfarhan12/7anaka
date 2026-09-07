import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'glow' | 'letters' | 'sweep' | 'burst' | 'exit'>('glow');
  const letters = ['7', 'N', 'A', 'K', 'A'];

  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    // Sequence timings (Total ~2.2s)
    const t1 = setTimeout(() => setPhase('letters'), 350);
    const t2 = setTimeout(() => setPhase('sweep'), 1250);
    const t3 = setTimeout(() => setPhase('burst'), 1750);
    const t4 = setTimeout(() => {
      setPhase('exit');
      setTimeout(onComplete, 450);
    }, 2200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          id="cinematic-intro"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Skip button in top corner */}
          <button
            id="intro-skip-btn"
            onClick={onComplete}
            className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer backdrop-blur-md"
            aria-label="Skip introductory animation"
          >
            SKIP →
          </button>

          {/* Central Atmospheric Radial Glow */}
          <motion.div
            className="absolute w-[500px] sm:w-[750px] md:w-[950px] h-[500px] sm:h-[750px] md:h-[950px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 90, 0, 0.48) 0%, rgba(255, 196, 0, 0.18) 35%, rgba(0,0,0,0) 70%)',
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: phase === 'burst' ? 1.6 : 1,
              opacity: phase === 'glow' ? 0.3 : phase === 'burst' ? 0.9 : 0.65,
            }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* Floating light particles during intro */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#FFD84D]"
                style={{
                  top: `${25 + (i * 8)}%`,
                  left: `${18 + (i * 11)}%`,
                  boxShadow: '0 0 12px #FF7A00',
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [15, -25],
                }}
                transition={{
                  duration: 1.6,
                  delay: i * 0.15,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Center glowing focal point ring */}
          <motion.div
            className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-[#FF7A00]/40 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'glow' ? [0, 1.2, 1] : phase === 'burst' ? 2.5 : 1.1,
              opacity: phase === 'burst' ? 0 : 0.5,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Central Logo & Letter Reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Mark Avatar Silhouette / Halo */}
            <motion.div
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-4 sm:mb-6 rounded-3xl p-[2px] bg-gradient-to-tr from-[#FF5A00] via-[#FFD84D] to-transparent shadow-[0_0_35px_rgba(255,90,0,0.6)] flex items-center justify-center"
              initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'backOut' }}
            >
              <div className="w-full h-full rounded-3xl bg-[#090909] flex items-center justify-center overflow-hidden border border-white/10">
                <img
                  src="/7naka_avatar.png"
                  alt="7NAKA Logo"
                  className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-[0_0_12px_rgba(255,122,0,0.7)]"
                />
              </div>
            </motion.div>

            {/* Letter by Letter "7NAKA" */}
            <div className="relative flex items-center justify-center tracking-tight font-black">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF3D6] to-[#FFC400]"
                  style={{
                    fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
                    textShadow: '0 0 45px rgba(255, 90, 0, 0.55)',
                  }}
                  initial={{
                    opacity: 0,
                    filter: 'blur(14px)',
                    y: 12,
                    scale: 0.88,
                  }}
                  animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: 0.35 + index * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}

              {/* Light Sweep Passing Across the Text */}
              {phase === 'sweep' || phase === 'burst' ? (
                <motion.div
                  className="absolute inset-y-0 w-24 sm:w-36 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)',
                    filter: 'blur(6px)',
                    mixBlendMode: 'screen',
                  }}
                  initial={{ left: '-20%', opacity: 0 }}
                  animate={{ left: '120%', opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              ) : null}
            </div>

            {/* Sub-tagline reveal during intro */}
            <motion.p
              className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-semibold tracking-[0.3em] sm:tracking-[0.45em] text-[#FFC400]/90 uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.95, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              STREAMER <span className="text-[#FF5A00] px-1.5">•</span> CONTENT CREATOR
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
