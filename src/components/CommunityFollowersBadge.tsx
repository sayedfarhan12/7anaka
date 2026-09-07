import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';
import { CommunityStats } from '../types';

export const CommunityFollowersBadge: React.FC = () => {
  const [stats, setStats] = useState<CommunityStats>({
    kickFollowers: 15828,
    tiktokFollowers: 8457,
    totalFollowers: 24285,
    formattedTotal: '24,285',
  });
  const [loading, setLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/community-stats');
        if (res.ok) {
          const data: CommunityStats = await res.json();
          if (isMounted && data.totalFollowers) {
            setStats(data);
          }
        }
      } catch {
        // Silently keep fallback state
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    // Refresh community stats every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatShort = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <motion.div
      id="community-followers-badge"
      className="relative mt-3 sm:mt-4 lg:mt-6 inline-flex flex-col items-center select-none group"
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setShowBreakdown(true)}
      onMouseLeave={() => setShowBreakdown(false)}
      onClick={() => setShowBreakdown((prev) => !prev)}
    >
      {/* Ambient Neon Backlight Glow (Kick green + 7NAKA amber + TikTok rose) */}
      <div
        className="absolute -inset-1 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(83,252,24,0.15) 0%, rgba(255,196,0,0.25) 50%, rgba(254,44,85,0.18) 100%)',
        }}
      />

      {/* Main Glass Capsule */}
      <div className="relative flex items-center gap-2 sm:gap-3 lg:gap-4 px-3.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full bg-[#08080a]/90 backdrop-blur-xl border border-white/[0.08] group-hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer">
        {/* Community Users Icon with glowing dot */}
        <div className="relative flex items-center justify-center w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/[0.05] border border-white/[0.06] text-[#FFC400]">
          <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#53FC18] shadow-[0_0_6px_#53FC18] animate-pulse" />
        </div>

        {/* Total Follower Count */}
        <div className="flex items-baseline gap-1.5 lg:gap-2">
          <span className="font-mono text-sm sm:text-base lg:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF6E5] to-[#FFD84D] tracking-tight">
            +{formatShort(stats.totalFollowers)}
          </span>
          <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            متابع
          </span>
        </div>

        {/* Minimal Divider */}
        <span className="h-3 lg:h-4 w-px bg-white/10" />

        {/* Platform Breakdown Mini Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 text-[11px] lg:text-xs font-medium">
          {/* Kick Badge */}
          <a
            href="https://kick.com/7naka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-1.5 sm:px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-md bg-[#53FC18]/10 border border-[#53FC18]/20 text-neutral-300 hover:text-white hover:border-[#53FC18]/50 transition-colors"
            title={`Kick: ${stats.kickFollowers.toLocaleString()} followers`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-[#53FC18]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h5.5v6.5l4-6.5h6.5l-5.8 7.8L20 21h-6.5l-5-7.5V21H3V3z" />
            </svg>
            <span className="font-semibold text-white/90 text-[10px] sm:text-[11px] lg:text-xs">
              {formatShort(stats.kickFollowers)}
            </span>
          </a>

          <span className="text-neutral-600 text-[10px] lg:text-xs">+</span>

          {/* TikTok Badge */}
          <a
            href="https://www.tiktok.com/@7naka4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-1.5 sm:px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-md bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-neutral-300 hover:text-white hover:border-[#FE2C55]/50 transition-colors"
            title={`TikTok: ${stats.tiktokFollowers.toLocaleString()} followers`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-[#FE2C55]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.92 1.6V6.9a4.79 4.79 0 0 1-1-.21z" />
            </svg>
            <span className="font-semibold text-white/90 text-[10px] sm:text-[11px] lg:text-xs">
              {formatShort(stats.tiktokFollowers)}
            </span>
          </a>
        </div>
      </div>

      {/* Floating Detailed Hover Card */}
      <motion.div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-200 ${
          showBreakdown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-neutral-900/95 border border-white/10 text-neutral-300 shadow-xl flex items-center gap-1.5 backdrop-blur-md">
          <TrendingUp className="w-3 h-3 text-[#FFC400]" />
          <span>Kick: {stats.kickFollowers.toLocaleString()}</span>
          <span className="text-neutral-600">•</span>
          <span>TikTok: {stats.tiktokFollowers.toLocaleString()}</span>
        </span>
      </motion.div>
    </motion.div>
  );
};
