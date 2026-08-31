import React, { useState, useEffect } from 'react';
import { X, Share2, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function PujoGreetingModal({ isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(() => t('greetingMsg1'));
  const [isCopied, setIsCopied] = useState(false);

  // Sync selected message when language switches
  useEffect(() => {
    setSelectedMessage(t('greetingMsg1'));
  }, [lang]);

  if (!isOpen) return null;

  const messages = [
    t('greetingMsg1'),
    t('greetingMsg2'),
    t('greetingMsg3')
  ];

  const handleShareWhatsApp = () => {
    const greetingHeader = lang === 'bn' ? '🪔 *শুভ শারদীয়া ও শুভ দুর্গোৎসব* 🪔' : '🪔 *Shubho Sharodiya & Durga Puja Wishes* 🪔';
    const dearPrefix = lang === 'bn' ? 'প্রিয় ' : 'Dear ';
    const fullText = `${greetingHeader}\n\n${receiverName ? `${dearPrefix}${receiverName},\n` : ''}${selectedMessage}\n\n${t('wishesFrom')} *${senderName || t('defaultSender')}*\n\n✨ ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, '_blank');

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd873', '#e8b64b', '#ff6b1a', '#ffffff']
    });
  };

  const handleCopyLink = () => {
    const fullText = `🪔 ${t('previewCardHeader')} — Devi Paksha: ${window.location.href}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl h-full max-h-[92vh] rounded-[36px] liquid-glass-card p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 overflow-y-auto">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title={t('closeBtn')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 pr-12">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-[#ffd873] shadow-md border border-amber-500/40 flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bengali-title text-lg sm:text-2xl font-bold text-[#ffd873] px-1 leading-snug">
                {t('greetingTitle')}
              </h2>
              <p className="text-xs text-[#fdf3e2]/70 font-medium px-1">
                {t('greetingSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          {/* Left: Input Form & Message Selectors */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#ffd873] block mb-1">
                  {t('receiverLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('receiverPlaceholder')}
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#ffd873]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#ffd873] block mb-1">
                  {t('senderLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('senderPlaceholder')}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#ffd873]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#ffd873] block mb-1.5">
                {t('chooseWishLabel')}
              </label>
              <div className="space-y-2">
                {messages.map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full p-2.5 rounded-2xl text-left font-bengali text-xs transition-all border ${
                      selectedMessage === msg
                        ? 'liquid-glass-btn border-[#ffd873] text-[#ffd873] bg-white/15 shadow-md'
                        : 'border-white/10 hover:border-white/20 text-[#fdf3e2]/75 bg-white/5'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Card Preview */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#2a0e08] via-[#1a0804] to-black border border-[#ffd873]/50 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden">
            <div className="text-3xl mb-2">🪔</div>
            <div>
              <div className="font-bengali-title text-xl font-bold text-[#ffd873] mb-1">
                {t('previewCardHeader')}
              </div>
              {receiverName && (
                <div className="font-bengali text-sm text-[#ffd873]/90 font-bold mb-2">
                  {lang === 'bn' ? `প্রিয় ${receiverName},` : `Dear ${receiverName},`}
                </div>
              )}
              <p className="font-bengali text-xs sm:text-sm text-[#fdf3e2] leading-relaxed italic px-2">
                "{selectedMessage}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#ffd873] font-bold">
              {t('wishesFrom')} {senderName || t('defaultSender')}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl liquid-glass-btn text-xs text-[#fdf3e2] font-bold cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? t('copied') : t('copySiteLink')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareOnWhatsApp')}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-2xl liquid-glass-btn text-[#ffd873] font-bold text-xs shadow-md cursor-pointer"
            >
              {t('closeBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
