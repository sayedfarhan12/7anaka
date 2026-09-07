import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, RefreshCw, Radio, Users, Flame } from 'lucide-react';
import { LiveStatusResponse, PlatformStreamInfo } from '../types';

interface PlatformMeta {
  name: string;
  channelHandle: string;
  defaultUrl: string;
  brandColor: string;
  accentGradient: string;
  badgeBorder: string;
  renderIcon: (className?: string) => React.ReactNode;
}

const PLATFORMS_META: Record<'kick' | 'twitch' | 'youtube' | 'tiktok', PlatformMeta> = {
  kick: {
    name: 'Kick',
    channelHandle: '7naka',
    defaultUrl: 'https://kick.com/7naka',
    brandColor: '#53FC18',
    accentGradient: 'from-[#53FC18]/25 via-[#53FC18]/10 to-transparent',
    badgeBorder: 'border-[#53FC18]/40 text-[#53FC18] bg-[#53FC18]/10',
    renderIcon: (className = 'w-4 h-4') => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h5.5v6.5l4-6.5h6.5l-5.8 7.8L20 21h-6.5l-5-7.5V21H3V3z" />
      </svg>
    ),
  },
  tiktok: {
    name: 'TikTok',
    channelHandle: '@7naka4',
    defaultUrl: 'https://www.tiktok.com/@7naka4/live',
    brandColor: '#00F2FE',
    accentGradient: 'from-[#00F2FE]/25 via-[#FE2C55]/10 to-transparent',
    badgeBorder: 'border-[#00F2FE]/40 text-[#00F2FE] bg-[#00F2FE]/10',
    renderIcon: (className = 'w-4 h-4') => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.02-.03 1.98-.55 2.56-1.38.45-.63.68-1.4.68-2.18V.02z" />
      </svg>
    ),
  },
  twitch: {
    name: 'Twitch',
    channelHandle: '7naka_',
    defaultUrl: 'https://www.twitch.tv/7naka_',
    brandColor: '#9146FF',
    accentGradient: 'from-[#9146FF]/25 via-[#9146FF]/10 to-transparent',
    badgeBorder: 'border-[#9146FF]/40 text-[#BF94FF] bg-[#9146FF]/10',
    renderIcon: (className = 'w-4 h-4') => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.836V2.149h16.478v11.463zM16.478 5.731h-2.149v6.448h2.149V5.731zm-6.09 0H8.239v6.448h2.149V5.731z" />
      </svg>
    ),
  },
  youtube: {
    name: 'YouTube',
    channelHandle: '@7NAKA1',
    defaultUrl: 'https://www.youtube.com/@7NAKA1/live',
    brandColor: '#FF0000',
    accentGradient: 'from-[#FF0000]/25 via-[#FF0000]/10 to-transparent',
    badgeBorder: 'border-[#FF0000]/40 text-[#FF6B6B] bg-[#FF0000]/10',
    renderIcon: (className = 'w-4 h-4') => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
};

const ORDERED_PLATFORMS: Array<'kick' | 'tiktok' | 'twitch' | 'youtube'> = ['kick', 'tiktok', 'twitch', 'youtube'];

export const LiveStatus: React.FC = () => {
  const [data, setData] = useState<LiveStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLiveStatus = useCallback(async (force = false) => {
    try {
      const res = await fetch(`/api/live-status${force ? '?force=true' : ''}`);
      if (res.ok) {
        const json: LiveStatusResponse = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Could not reach live status API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveStatus();
    // Refresh live status automatically every 35 seconds
    const interval = setInterval(() => {
      fetchLiveStatus();
    }, 35000);
    return () => clearInterval(interval);
  }, [fetchLiveStatus]);

  // Find all platforms currently streaming live
  const activeLivePlatforms = ORDERED_PLATFORMS.filter(
    (platKey) => Boolean(data?.platforms?.[platKey]?.isLive)
  );

  const isAnyLive = activeLivePlatforms.length > 0;

  return (
    <div id="live-status-container" className="w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 lg:mt-8 z-20 space-y-4">
      <AnimatePresence mode="wait">
        {isAnyLive ? (
          /* ============================================================== */
          /* ACTIVE LIVE BROADCAST CARDS                                    */
          /* ============================================================== */
          <motion.div
            key="live-broadcast-group"
            className="space-y-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            {/* Cards Container: Side-by-side (2 columns) on mobile and desktop when multiple are live */}
            <div className={activeLivePlatforms.length > 1 ? "grid grid-cols-2 gap-2 sm:gap-3.5" : "space-y-3"}>
              {activeLivePlatforms.map((platKey) => {
                const streamInfo: PlatformStreamInfo = data?.platforms?.[platKey] || {
                  platform: platKey,
                  isLive: true,
                  configured: true,
                  channelName: PLATFORMS_META[platKey].channelHandle,
                  streamUrl: PLATFORMS_META[platKey].defaultUrl,
                };

                const meta = PLATFORMS_META[platKey];
                const streamUrl = streamInfo.streamUrl || meta.defaultUrl;
                const isMultiCard = activeLivePlatforms.length > 1;

                return (
                  <div
                    key={platKey}
                    id={`live-card-${platKey}`}
                    className="relative rounded-2xl p-[1.5px] overflow-hidden h-full flex flex-col"
                  >
                    {/* Ambient Glowing Aura */}
                    <div
                      className="absolute -inset-1 rounded-2xl blur-xl opacity-60 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at top, ${meta.brandColor}55 0%, rgba(255, 90, 0, 0.3) 45%, transparent 75%)`,
                      }}
                    />

                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF5A00] via-[#FFD84D]/70 to-[#FF7A00] opacity-80" />

                    {/* Glassmorphic Card Body */}
                    <div
                      className={`relative rounded-2xl bg-[#090909]/95 backdrop-blur-2xl border border-white/10 shadow-2xl h-full flex ${
                        isMultiCard
                          ? 'flex-col justify-between p-2.5 sm:p-4 gap-2 sm:gap-3'
                          : 'flex-row items-center justify-between p-3 sm:p-4.5 lg:p-5 gap-2.5 sm:gap-4'
                      }`}
                    >
                      {/* Left/Top: Stream Info & Badges */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5 text-left">
                        {/* Status Badges Row */}
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                          {/* Pulsing Live Beacon */}
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-black tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.35)] shrink-0">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                            </span>
                            LIVE
                          </span>

                          {/* Platform Indicator */}
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/5 border border-white/10 text-white shrink-0">
                            <span style={{ color: meta.brandColor }}>{meta.renderIcon('w-3 h-3 sm:w-3.5 sm:h-3.5')}</span>
                            <span>{meta.name}</span>
                          </span>

                          {/* Viewers Badge */}
                          {Boolean(streamInfo.viewers) && (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-xs font-medium text-neutral-300 shrink-0">
                              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFC400]" />
                              <span>{streamInfo.viewers?.toLocaleString()}</span>
                            </span>
                          )}
                        </div>

                        {/* Stream Title & Category */}
                        <div className="space-y-0.5 min-w-0">
                          <p className={`font-semibold text-white/95 leading-tight ${
                            isMultiCard ? 'text-[11px] sm:text-xs md:text-sm line-clamp-1' : 'text-xs sm:text-sm lg:text-base line-clamp-1 sm:line-clamp-2'
                          }`}>
                            {streamInfo.title || `Live stream on ${meta.name}`}
                          </p>
                          {streamInfo.category && (
                            <p className="text-[9px] sm:text-xs text-[#FFC400] font-medium flex items-center gap-1 truncate">
                              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF5A00] shrink-0" />
                              <span className="truncate">{streamInfo.category}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right/Bottom: Direct Stream CTA Button */}
                      <div className={isMultiCard ? 'w-full pt-0.5' : 'shrink-0 flex items-center'}>
                        <a
                          id={`watch-cta-${platKey}`}
                          href={streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group relative flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl font-extrabold tracking-wide text-black bg-gradient-to-r from-[#FF5A00] via-[#FF7A00] to-[#FFC400] hover:from-[#FF7A00] hover:to-[#FFD84D] shadow-[0_0_16px_rgba(255,90,0,0.45)] hover:shadow-[0_0_24px_rgba(255,122,0,0.65)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden ${
                            isMultiCard
                              ? 'w-full py-1.5 sm:py-2.5 px-2 text-[10px] sm:text-xs'
                              : 'py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 lg:px-6 text-[11px] sm:text-xs md:text-sm whitespace-nowrap'
                          }`}
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                          <Radio className="w-3 h-3 text-black shrink-0 animate-pulse" />
                          <span>شاهد على {meta.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ============================================================== */
          /* OFFLINE STATUS CARD                                            */
          /* ============================================================== */
          <motion.div
            key="offline-status"
            id="offline-status-card"
            className="relative rounded-2xl p-[1px] max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 border border-white/[0.08] shadow-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-500/60" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm lg:text-base font-bold tracking-wider text-neutral-300 uppercase">
                    CURRENTLY OFFLINE
                  </span>
                  <p className="text-[11px] sm:text-xs lg:text-sm text-neutral-500 font-normal">
                    Streaming channels listed below
                  </p>
                </div>
              </div>

              <button
                onClick={() => fetchLiveStatus(true)}
                disabled={loading}
                title="تحديث حالة البث"
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-[#FFC400] hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Refresh stream status"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin text-[#FF7A00]' : ''}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

