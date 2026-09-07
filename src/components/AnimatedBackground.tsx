import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const AnimatedBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.4 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth;
      const y = e.clientY / innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      id="animated-bg-root"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#050505]"
      aria-hidden="true"
    >
      {/* Deep atmospheric radial background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#050505] to-[#030303]" />

      {/* Main Core Ambient Glow - Center Top */}
      <motion.div
        className="absolute w-[600px] sm:w-[900px] h-[500px] sm:h-[650px] rounded-full blur-[140px] sm:blur-[180px] opacity-25 sm:opacity-30"
        style={{
          background: 'radial-gradient(circle, #FF5A00 0%, #FF7A00 40%, rgba(255, 90, 0, 0) 70%)',
          top: '-15%',
          left: '50%',
          x: '-50%',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.08, 0.98, 1],
                opacity: [0.25, 0.35, 0.28, 0.25],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Golden Yellow Accent Orb - Center Behind Hero */}
      <motion.div
        className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #FFD84D 0%, #FFC400 35%, rgba(255, 196, 0, 0) 65%)',
          top: '25%',
          left: '50%',
          x: '-50%',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [0.95, 1.15, 1],
                opacity: [0.15, 0.25, 0.15],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Bottom Subtle Amber Reflection */}
      <div
        className="absolute w-[600px] sm:w-[800px] h-[300px] rounded-full blur-[120px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #FF5A00 0%, rgba(255, 90, 0, 0) 70%)',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Subtle Mouse-Following Glow (Desktop Only, Extremely Delicate) */}
      {!isTouchDevice && !shouldReduceMotion && (
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full blur-[120px] opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF7A00 0%, #FFC400 45%, rgba(255, 90, 0, 0) 70%)',
          }}
          animate={{
            x: mousePos.x * window.innerWidth - 225,
            y: mousePos.y * window.innerHeight - 225,
          }}
          transition={{
            type: 'spring',
            damping: 40,
            stiffness: 90,
            mass: 0.8,
          }}
        />
      )}

      {/* Atmospheric Subtle Dust/Embers */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          { top: '18%', left: '22%', size: 3, duration: 9, delay: 0 },
          { top: '35%', left: '78%', size: 2.5, duration: 11, delay: 1.5 },
          { top: '65%', left: '15%', size: 2, duration: 13, delay: 2.5 },
          { top: '75%', left: '82%', size: 3, duration: 10, delay: 3 },
          { top: '45%', left: '30%', size: 2, duration: 14, delay: 4 },
          { top: '28%', left: '68%', size: 2.5, duration: 8, delay: 2 },
        ].map((particle, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full bg-[#FFD84D]"
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              boxShadow: '0 0 8px 2px rgba(255, 196, 0, 0.4)',
            }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.3 }
                : {
                    y: [0, -25, 0],
                    x: [0, (idx % 2 === 0 ? 12 : -12), 0],
                    opacity: [0.15, 0.6, 0.15],
                    scale: [0.8, 1.2, 0.8],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Ultra-fine Glass Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
