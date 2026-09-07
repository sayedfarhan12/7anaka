import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface InstaPaySupportProps {
  directPayUrl?: string;
  ipaAddress?: string;
  accountName?: string;
}

export const InstaPaySupport: React.FC<InstaPaySupportProps> = ({
  directPayUrl = 'https://ipn.eg/S/hossamh99/instapay/3BOyKL',
  ipaAddress = 'hossamh99@instapay',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(ipaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = ipaAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      id="instapay-support-trigger-container"
      className="w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto px-4 mt-3 sm:mt-4 lg:mt-5 z-20 flex flex-col items-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Main Card with Direct Link */}
      <a
        id="instapay-support-btn"
        href={directPayUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support Us via InstaPay"
        className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 px-3.5 sm:px-5 py-2.5 sm:py-3 lg:py-3.5 rounded-2xl bg-gradient-to-r from-[#14061a]/90 via-[#0e0414]/90 to-[#14061a]/90 hover:from-[#22072e]/95 hover:via-[#190422]/95 hover:to-[#260835]/95 border border-[#A12586]/35 hover:border-[#C035A2]/60 shadow-[0_4px_25px_rgba(142,27,136,0.18)] hover:shadow-[0_4px_35px_rgba(192,53,162,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
      >
        {/* Subtle Ambient Backlight */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#79287B]/40 via-[#FF5A00]/20 to-[#A12586]/40 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

        {/* Left: Official InstaPay Logo & Title */}
        <div className="relative flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(161,37,134,0.4)] flex items-center justify-center bg-black shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/instapay_logo.png"
              alt="InstaPay"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm lg:text-base font-extrabold tracking-wide text-white group-hover:text-[#F3A4E6] transition-colors">
                Support Us via InstaPay
              </span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFC400] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right: Actions Row (Direct Transfer Button + Quick Copy IPA) */}
        <div className="relative shrink-0 flex items-center gap-1.5 sm:gap-2">
          {/* Quick Copy IPA Button */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'تم النسخ!' : `نسخ المعرف: ${ipaAddress}`}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-white/5 hover:bg-white/15 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Direct Support Button */}
          <div
            id="direct-support-pill"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#A12586] to-[#79287B] group-hover:from-[#B82B9B] group-hover:to-[#8E2F90] shadow-[0_0_15px_rgba(161,37,134,0.4)] group-hover:shadow-[0_0_20px_rgba(192,53,162,0.6)] text-xs sm:text-sm font-bold text-white transition-all"
          >
            <Heart className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]" />
            <span>ادعم الآن</span>
            <ExternalLink className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </a>
    </motion.div>
  );
};


