import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialLink } from '../types';

interface SocialIconProps {
  social: SocialLink;
  index: number;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ social, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Official authentic platform SVG icons with original multi-color brand design
  const renderIcon = () => {
    switch (social.id) {
      case 'instagram':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-md"
            viewBox="0 0 24 24"
            fill="none"
          >
            <defs>
              <radialGradient id="ig-grad-full" cx="20%" cy="115%" r="140%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="10%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="65%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad-full)" />
            <rect x="5.5" y="5.5" width="13" height="13" rx="3.6" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
            <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
          </svg>
        );

      case 'tiktok':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-md"
            viewBox="0 0 24 24"
          >
            {/* Authentic TikTok chromatic glitch layers */}
            <path
              fill="#00F2FE"
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.92 1.6V6.9a4.79 4.79 0 0 1-1-.21z"
              transform="translate(-0.8, -0.6)"
              opacity="0.85"
            />
            <path
              fill="#FE0979"
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.92 1.6V6.9a4.79 4.79 0 0 1-1-.21z"
              transform="translate(0.8, 0.6)"
              opacity="0.85"
            />
            <path
              fill="#FFFFFF"
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.92 1.6V6.9a4.79 4.79 0 0 1-1-.21z"
            />
          </svg>
        );

      case 'kick':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-[0_0_8px_rgba(83,252,24,0.6)]"
            viewBox="0 0 24 24"
            fill="#53FC18"
          >
            {/* Authentic Kick Neon Green Logo */}
            <path d="M3 3h5.5v6.5l4-6.5h6.5l-5.8 7.8L20 21h-6.5l-5-7.5V21H3V3z" />
          </svg>
        );

      case 'youtube':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
            viewBox="0 0 24 24"
          >
            {/* Official YouTube Red badge with crisp white play button */}
            <path
              fill="#FF0000"
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            />
            <polygon fill="#FFFFFF" points="9.545,15.568 15.818,12 9.545,8.432" />
          </svg>
        );

      case 'twitch':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-[0_0_8px_rgba(145,70,255,0.6)]"
            viewBox="0 0 24 24"
            fill="#9146FF"
          >
            {/* Official Twitch Purple Logo */}
            <path d="M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.836V2.149h16.478v11.463zM16.478 5.731h-2.149v6.448h2.149V5.731zm-6.09 0H8.239v6.448h2.149V5.731z" />
          </svg>
        );

      case 'discord':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-[0_0_8px_rgba(88,101,242,0.6)]"
            viewBox="0 0 24 24"
            fill="#5865F2"
          >
            {/* Official Discord Clyde in Blurple */}
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        );

      case 'whatsapp':
        return (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11 drop-shadow-[0_0_8px_rgba(37,211,102,0.5)]"
            viewBox="0 0 24 24"
          >
            {/* Official WhatsApp Green badge with white phone handset */}
            <path
              fill="#25D366"
              d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.372c1.458.796 3.102 1.215 4.775 1.216h.004c5.505 0 9.99-4.478 9.991-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2z"
            />
            <path
              fill="#FFFFFF"
              d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.476-.15-.676.15s-.776.98-.952 1.181c-.175.201-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.493-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376s-1.052 1.028-1.052 2.507 1.077 2.908 1.227 3.109c.15.201 2.12 3.237 5.136 4.54.717.311 1.277.496 1.713.635.72.229 1.376.197 1.895.12.578-.087 1.782-.728 2.032-1.43.25-.702.25-1.303.175-1.43-.075-.126-.275-.201-.576-.352z"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        delay: 0.35 + index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip popping up on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            id={`tooltip-${social.id}`}
            className="absolute -top-10 lg:-top-12 z-30 px-2.5 lg:px-3 py-1 rounded-lg bg-[#0e0e0e]/95 border border-white/15 text-white text-xs lg:text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl whitespace-nowrap pointer-events-none flex items-center gap-1.5"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <span
              className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full"
              style={{ backgroundColor: social.brandColor }}
            />
            <span>{social.name}</span>
            <span className="text-[10px] lg:text-xs text-neutral-400 font-normal">{social.username}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Circular / Rounded Glass Button */}
      <motion.a
        id={`social-link-${social.id}`}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${social.name} - ${social.username}`}
        className="group relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-xl sm:rounded-2xl lg:rounded-2xl p-[1px] flex items-center justify-center cursor-pointer select-none transition-transform duration-200 active:scale-95"
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Dynamic Brand Color Glow Backdrop - permanently subtle, radiates on hover */}
        <div
          className="absolute -inset-1 rounded-xl sm:rounded-2xl lg:rounded-2xl blur-md lg:blur-lg transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundColor: social.brandColor,
            opacity: isHovered ? 0.55 : 0.18,
          }}
        />

        {/* Outer subtle border matching brand color */}
        <div
          className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-2xl transition-all duration-300 pointer-events-none"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${social.brandColor} 0%, rgba(255, 255, 255, 0.5) 50%, ${social.brandColor} 100%)`
              : `linear-gradient(135deg, ${social.brandColor}40 0%, rgba(255, 255, 255, 0.1) 50%, ${social.brandColor}20 100%)`,
          }}
        />

        {/* Inner Glass Disc Surface */}
        <div
          className="relative w-full h-full rounded-xl sm:rounded-2xl lg:rounded-2xl bg-[#0c0c0c]/85 backdrop-blur-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: isHovered ? 'rgba(18, 18, 18, 0.92)' : 'rgba(12, 12, 12, 0.82)',
          }}
        >
          {/* Subtle light sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Authentic Brand Icon */}
          <div className="transition-transform duration-300 group-hover:scale-110 flex items-center justify-center scale-90 sm:scale-95 lg:scale-100">
            {renderIcon()}
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
};

