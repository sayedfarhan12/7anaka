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
            className="absolute w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 90, 0, 0.45) 0%, rgba(255, 196, 0, 0.15) 35%, rgba(0,0,0,0) 70%)',
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
                className="absolute w-1.5 h-1.5 rounded-full bg-[#FFD84D]"
                style={{
                  top: `${30 + (i * 7)}%`,
                  left: `${20 + (i * 10)}%`,
                  boxShadow: '0 0 10px #FF7A00',
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  y: [15, -20],
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
            className="absolute w-24 h-24 rounded-full border border-[#FF7A00]/40 pointer-events-none"
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
              className="w-14 h-14 mb-4 rounded-2xl p-[1px] bg-gradient-to-tr from-[#FF5A00] via-[#FFD84D] to-transparent shadow-[0_0_25px_rgba(255,90,0,0.5)] flex items-center justify-center"
              initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'backOut' }}
            >
              <div className="w-full h-full rounded-2xl bg-[#090909] flex items-center justify-center overflow-hidden">
                <img
                  src="/7naka_avatar.png"
                  alt="7NAKA Logo"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,122,0,0.6)]"
                />
              </div>
            </motion.div>

            {/* Letter by Letter "7NAKA" */}
            <div className="relative flex items-center justify-center tracking-tight font-black">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF3D6] to-[#FFC400]"
                  style={{
                    fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
                    textShadow: '0 0 35px rgba(255, 90, 0, 0.45)',
                  }}
                  initial={{
                    opacity: 0,
                    filter: 'blur(14px)',
                    y: 8,
                    scale: 0.9,
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
                  className="absolute inset-y-0 w-16 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                    filter: 'blur(4px)',
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
              className="mt-3 text-xs sm:text-sm font-medium tracking-[0.35em] text-[#FFC400]/80 uppercase"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              STREAMER • CONTENT CREATOR
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
