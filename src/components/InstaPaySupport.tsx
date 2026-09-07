import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Copy, Check, X, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

interface InstaPaySupportProps {
  ipaAddress?: string;
  accountName?: string;
}

export const InstaPaySupport: React.FC<InstaPaySupportProps> = ({
  ipaAddress = '7naka@instapay',
  accountName = '7NAKA (حسام)',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ipaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
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
    <>
      {/* Trigger Button - Sits cleanly and chicly on the page */}
      <motion.div
        id="instapay-support-trigger-container"
        className="w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto px-4 mt-8 sm:mt-10 lg:mt-12 z-20 flex justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button
          id="instapay-support-btn"
          onClick={() => setIsOpen(true)}
          className="group relative w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 lg:py-4 rounded-2xl bg-gradient-to-r from-[#14061a]/90 via-[#0e0414]/90 to-[#14061a]/90 hover:from-[#20082b]/90 hover:to-[#240a32]/90 border border-[#A12586]/30 hover:border-[#C035A2]/60 shadow-[0_4px_25px_rgba(142,27,136,0.15)] hover:shadow-[0_4px_35px_rgba(192,53,162,0.3)] backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
        >
          {/* Subtle Ambient Backlight */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#79287B]/40 via-[#FF5A00]/20 to-[#A12586]/40 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

          {/* Left: InstaPay Signature Icon */}
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-[#79287B] to-[#501354] border border-white/20 shadow-[0_0_15px_rgba(161,37,134,0.5)] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <span className="font-black text-sm sm:text-base tracking-tighter text-white font-mono">
                ipa
              </span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm lg:text-base font-bold text-white group-hover:text-[#F3A4E6] transition-colors">
                  دعم القناة عبر InstaPay
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#FFC400] animate-pulse" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">
                تحويل فوري ومباشر لدعم وتطوير البثوث
              </p>
            </div>
          </div>

          {/* Right: Action Pill */}
          <div className="relative shrink-0 flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 group-hover:bg-[#A12586]/20 border border-white/10 group-hover:border-[#A12586]/40 text-[11px] sm:text-xs font-bold text-white transition-colors">
            <Heart className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]" />
            <span>ادعم الآن</span>
          </div>
        </button>
      </motion.div>

      {/* Elegant Glassmorphic Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="instapay-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              id="instapay-modal-card"
              dir="rtl"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-[#0d0912] border border-[#A12586]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-7 overflow-hidden text-white"
            >
              {/* Modal Decorative Atmospheric Gradient */}
              <div
                className="absolute top-0 right-0 left-0 h-32 opacity-25 pointer-events-none blur-2xl"
                style={{
                  background: 'radial-gradient(ellipse at top, #A12586 0%, #FF5A00 40%, transparent 70%)',
                }}
              />

              {/* Close Button */}
              <button
                id="close-instapay-modal"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8A2185] via-[#65156B] to-[#450A49] border border-white/20 shadow-[0_0_20px_rgba(161,37,134,0.6)] flex items-center justify-center text-white shrink-0">
                  <span className="font-black text-lg tracking-tighter text-white font-mono">
                    ipa
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                    <span>دعم 7NAKA عبر InstaPay</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    شبكة المدفوعات اللحظية المصرية (Instant Payment Network)
                  </p>
                </div>
              </div>

              {/* Account / IPA Box */}
              <div className="rounded-2xl bg-[#140c1a] border border-[#A12586]/25 p-4 sm:p-5 mb-5 relative">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-medium mb-1.5">
                  <span>عنوان الدفع اللحظي (IPA)</span>
                  <span className="text-[11px] text-[#FFC400] font-semibold">{accountName}</span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-black/60 rounded-xl p-2.5 sm:p-3 border border-white/10">
                  <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wider select-all">
                    {ipaAddress}
                  </span>

                  <button
                    id="copy-ipa-btn"
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'bg-gradient-to-r from-[#A12586] to-[#79287B] hover:from-[#B82B9B] hover:to-[#8E2F90] text-white shadow-[0_0_15px_rgba(161,37,134,0.4)] active:scale-95'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ المعرف</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-neutral-300">
                <p className="text-xs font-bold text-[#FFD84D] uppercase tracking-wider mb-2">
                  طريقة التحويل السريع:
                </p>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p>افتح تطبيق <strong className="text-white">InstaPay</strong> على هاتفك المحمول.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    اختر <strong className="text-white">إرسال نقود (Send Money)</strong> ثم حدد{' '}
                    <strong className="text-white">عنوان الدفع اللحظي (IPA)</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    الصق المعرف <code className="text-[#F3A4E6] font-mono bg-white/5 px-1 py-0.5 rounded">{ipaAddress}</code> واكتب رسالتك الجميلة للستريمر.
                  </p>
                </div>
              </div>

              {/* Safety & Appreciation Note */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>دعمك يساهم بشكل مباشر في تحسين جودة البث والأجهزة وتقديم محتوى أفضل دائماً. شكراً لك! ❤️</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
