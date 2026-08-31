import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MapPin,
  Coffee,
  Music,
  BookOpen,
  Flower2,
  Users,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar({
  isNight,
  setIsNight,
  onOpenAdda,
  onOpenAboutMahalaya,
  onOpenSpotify,
  onOpenAnjali,
  onOpenPandalGuide,
  onOpenGreeting,
  onOpenCreators,
  onOpenBuyChai,
  onlineCount = 1
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { lang, toggleLanguage, t } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuresList = [
    {
      id: 'anjali',
      title: t('feature_anjali_title'),
      desc: t('feature_anjali_desc'),
      icon: <Flower2 className="w-4 h-4 text-rose-300" />,
      iconBg: 'bg-rose-950/60 border border-rose-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenAnjali();
      }
    },
    {
      id: 'pandal',
      title: t('feature_pandal_title'),
      desc: t('feature_pandal_desc'),
      icon: <MapPin className="w-4 h-4 text-amber-300" />,
      iconBg: 'bg-amber-950/60 border border-amber-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenPandalGuide();
      }
    },
    {
      id: 'adda',
      title: t('feature_adda_title'),
      desc: t('feature_adda_desc'),
      icon: <Coffee className="w-4 h-4 text-orange-300" />,
      iconBg: 'bg-orange-950/60 border border-orange-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenAdda();
      }
    },
    {
      id: 'spotify',
      title: t('feature_spotify_title'),
      desc: t('feature_spotify_desc'),
      icon: <Music className="w-4 h-4 text-emerald-300" />,
      iconBg: 'bg-emerald-950/60 border border-emerald-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenSpotify();
      }
    },
    {
      id: 'mahalaya',
      title: t('feature_mahalaya_title'),
      desc: t('feature_mahalaya_desc'),
      icon: <BookOpen className="w-4 h-4 text-yellow-300" />,
      iconBg: 'bg-yellow-950/60 border border-yellow-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenAboutMahalaya();
      }
    },
    {
      id: 'greeting',
      title: t('feature_greeting_title'),
      desc: t('feature_greeting_desc'),
      icon: <Sparkles className="w-4 h-4 text-purple-300" />,
      iconBg: 'bg-purple-950/60 border border-purple-500/25',
      action: () => {
        setIsMenuOpen(false);
        onOpenGreeting();
      }
    }
  ];

  return (
    <header className="relative z-40 w-full px-3 sm:px-6 pt-2.5 sm:pt-4 flex items-center justify-between pointer-events-auto box-border overflow-visible">
      {/* 🟢 1. Left: Sleek Live Online Badge */}
      <button
        onClick={onOpenAdda}
        title="Click to join live community adda!"
        className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full liquid-glass-pill text-emerald-300 font-bold text-xs shadow-lg hover:scale-103 active:scale-95 transition-all cursor-pointer flex-shrink-0"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
        </span>
        <span className="tabular-nums font-bold text-xs">{onlineCount}</span>
        <span className="text-[11px] text-[#fdf3e2]/75 font-medium">{t('online')}</span>
      </button>

      {/* 🏝️ 2. Right: Unified Glass Capsule [ 🌐 ENG  │  ☀️ / 🌙  │  👑 পুজো স্পেশাল ⌵ ] */}
      <div className="relative flex items-center rounded-full liquid-glass-pill p-0.5 sm:p-1 border border-white/20 shadow-lg flex-shrink-0" ref={menuRef}>
        {/* 🌐 1-Click Language Switcher (বাংলা <-> ENG) */}
        <button
          onClick={toggleLanguage}
          title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[#ffd873] hover:bg-white/15 transition-all font-bold text-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
          <span className="font-sans text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            {lang === 'bn' ? 'ENG' : 'বাংলা'}
          </span>
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

        {/* Day / Night Ambience Toggle (☀️ / 🌙) */}
        <button
          onClick={setIsNight}
          title={isNight ? 'Switch to Day ambience' : 'Switch to Night ambience'}
          className="flex items-center justify-center p-1.5 rounded-full text-[#ffd873] hover:bg-yellow-400/20 transition-all active:scale-95 cursor-pointer flex-shrink-0"
        >
          {isNight ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />}
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

        {/* Floating Menu Button: [ 👑 পুজো স্পেশাল / Pujo Special ⌵ ] */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer active:scale-95 flex-shrink-0 whitespace-nowrap ${
            isMenuOpen
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/25 text-[#ffd873]'
              : 'text-[#fdf3e2] hover:bg-white/15'
          }`}
        >
          <img
            src="/durga-logo.png"
            alt="Maa Durga"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow-[0_0_8px_rgba(255,216,115,0.8)] flex-shrink-0"
          />
          <span className="font-bengali text-xs font-bold tracking-wide whitespace-nowrap">
            {t('pujoSpecial')}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#ffd873] transition-transform duration-200 flex-shrink-0 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* 3. 👑 Masterpiece Handcrafted Dropdown Card (All 9 Luxury Improvements) */}
        {isMenuOpen && (
          <div className="absolute right-0 top-11 sm:top-12 z-50 w-[calc(100vw-24px)] max-w-sm sm:w-92 rounded-[30px] bg-gradient-to-b from-[#241308]/92 via-[#180d06]/94 to-[#0e0602]/96 backdrop-blur-2xl border border-[#ffd873]/25 p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_8px_16px_rgba(0,0,0,0.6),0_0_35px_rgba(234,179,8,0.08),inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_0_24px_rgba(255,216,115,0.03)] animate-fadeIn box-border">
            {/* Header with 12% Gold Hairline Separator */}
            <div className="px-1 py-0.5 mb-3 border-b border-[#ffd873]/15 pb-2.5 flex items-center justify-between">
              <span className="font-bengali text-xs sm:text-sm font-bold text-[#ffd873] tracking-wide flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd873]" />
                {t('deviPakshaExplorer')}
              </span>
              <span className="text-[11px] font-semibold text-[#fdf3e2]/60 font-mono">
                {t('featuresCount')}
              </span>
            </div>

            {/* 6 Interactive Object Feature Cards with Chevron (›) */}
            <div className="space-y-1.5 sm:space-y-2">
              {featuresList.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[#281509]/60 hover:bg-[#361d0d]/80 border border-white/10 hover:border-[#ffd873]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200 text-left active:scale-[0.985] active:brightness-95 cursor-pointer"
                >
                  {/* Left: Consistent 36x36 Icon Container + Clean Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="font-bengali text-xs sm:text-[13px] font-bold text-[#fdf3e2] group-hover:text-[#ffd873] leading-tight truncate transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: Soft Gold Chevron Arrow (›) */}
                  <ChevronRight className="w-4 h-4 text-[#ffd873]/40 group-hover:text-[#ffd873] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Secondary Subordinate Section (Creator 👥 & Buy Chai ☕) */}
            <div className="mt-3 pt-2.5 border-t border-[#ffd873]/15">
              <div className="grid grid-cols-2 gap-2">
                {/* 👥 Creator Profile */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCreators();
                  }}
                  className="group p-2 rounded-xl bg-black/35 hover:bg-white/10 border border-white/10 hover:border-[#ffd873]/30 transition-all text-left flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#ffd873]/80 group-hover:text-[#ffd873] transition-colors">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-[#fdf3e2]/90 leading-tight truncate group-hover:text-[#ffd873] transition-colors">
                      {lang === 'bn' ? 'নির্মাতা' : 'Creator'}
                    </div>
                    <div className="text-[9px] text-[#fdf3e2]/50 font-medium truncate">
                      Aneek Pal
                    </div>
                  </div>
                </button>

                {/* ☕ Buy Me A Chai */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenBuyChai();
                  }}
                  className="group p-2 rounded-xl bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/20 hover:border-amber-400/40 transition-all text-left flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0 text-amber-300 group-hover:scale-105 transition-transform">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-amber-300/90 leading-tight truncate group-hover:text-amber-200 transition-colors">
                      {lang === 'bn' ? 'চা খাওয়ান' : 'Buy Chai'}
                    </div>
                    <div className="text-[9px] text-amber-200/60 font-medium truncate">
                      UPI Support ☕
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-footer with Refined Gold Tone & Breathing Space */}
            <div className="mt-3 pt-1 text-center text-[10px] sm:text-[11px] text-[#ffd873]/50 font-medium font-bengali tracking-wider">
              {t('footerFestival')}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
