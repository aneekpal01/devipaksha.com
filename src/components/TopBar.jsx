import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
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
      icon: <Flower2 className="w-5 h-5 text-rose-950" />,
      iconBg: 'bg-rose-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenAnjali();
      }
    },
    {
      id: 'pandal',
      title: t('feature_pandal_title'),
      desc: t('feature_pandal_desc'),
      icon: <MapPin className="w-5 h-5 text-amber-950" />,
      iconBg: 'bg-amber-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenPandalGuide();
      }
    },
    {
      id: 'adda',
      title: t('feature_adda_title'),
      desc: t('feature_adda_desc'),
      icon: <Coffee className="w-5 h-5 text-orange-950" />,
      iconBg: 'bg-orange-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenAdda();
      }
    },
    {
      id: 'spotify',
      title: t('feature_spotify_title'),
      desc: t('feature_spotify_desc'),
      icon: <Music className="w-5 h-5 text-emerald-950" />,
      iconBg: 'bg-emerald-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenSpotify();
      }
    },
    {
      id: 'mahalaya',
      title: t('feature_mahalaya_title'),
      desc: t('feature_mahalaya_desc'),
      icon: <BookOpen className="w-5 h-5 text-amber-950" />,
      iconBg: 'bg-yellow-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenAboutMahalaya();
      }
    },
    {
      id: 'greeting',
      title: t('feature_greeting_title'),
      desc: t('feature_greeting_desc'),
      icon: <Sparkles className="w-5 h-5 text-purple-950" />,
      iconBg: 'bg-purple-300/90',
      action: () => {
        setIsMenuOpen(false);
        onOpenGreeting();
      }
    }
  ];

  return (
    <header className="relative z-40 w-full px-2 sm:px-6 pt-2 sm:pt-4 flex items-center justify-between pointer-events-auto box-border overflow-visible">
      {/* 🏝️ 1. Left Island: [ 🟢 Live Online  │  👥 Creators  │  ☕ Buy Chai ] */}
      <div className="flex items-center rounded-full liquid-glass-pill p-0.5 sm:p-1 border border-white/20 shadow-lg flex-shrink-0">
        {/* Live Online Badge / Button */}
        <button
          onClick={onOpenAdda}
          title="Click to join live community adda!"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
          </span>
          <span className="tabular-nums font-bold text-emerald-300 text-xs">
            {onlineCount}
          </span>
          <span className="hidden sm:inline text-[11px] text-[#fdf3e2]/70 font-medium">
            {t('online')}
          </span>
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

        {/* 👥 Creators Button */}
        <button
          onClick={onOpenCreators}
          title="Made with Bhalobasha by Aneek Pal"
          className="flex items-center justify-center p-1.5 sm:px-2 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

        {/* ☕ Buy Us A Chai Button */}
        <button
          onClick={onOpenBuyChai}
          title="Buy Me A Chai (UPI Support)"
          className="flex items-center justify-center p-1.5 sm:px-2 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
        >
          <Coffee className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>

      {/* 🏝️ 2. Right Island: [ 🌐 ENG  │  ☀️ / 🌙  │  👑 পুজো স্পেশাল ⌵ ] */}
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

        {/* 3. Golden Liquid Glass Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-11 sm:top-12 z-50 w-[calc(100vw-20px)] max-w-sm sm:w-92 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#8c6227]/95 via-[#533013]/95 to-[#241308]/98 backdrop-blur-3xl border-2 border-[#ffd873]/50 p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(234,179,8,0.25)] animate-fadeIn box-border">
            {/* Header */}
            <div className="px-2 py-1 mb-2.5 border-b border-[#ffd873]/20 flex items-center justify-between">
              <span className="font-bengali text-xs sm:text-sm font-black text-[#ffd873] tracking-wide flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd873]" />
                {t('deviPakshaExplorer')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#fdf3e2]/80">
                {t('featuresCount')}
              </span>
            </div>

            {/* 6 Full-Width Horizontal Feature Rows (Title only, no subtext) */}
            <div className="space-y-1.5 sm:space-y-2">
              {featuresList.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group w-full flex items-center p-2 sm:p-2.5 rounded-2xl bg-white/25 hover:bg-white/35 border border-white/35 hover:border-[#ffd873]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all duration-200 text-left active:scale-97 cursor-pointer"
                >
                  {/* Left: Icon Tile + Clean Title */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="font-bengali text-xs sm:text-sm font-black text-[#150702] group-hover:text-[#801200] leading-tight truncate">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Sub-footer */}
            <div className="mt-2.5 pt-2 border-t border-[#ffd873]/20 text-center text-[10px] sm:text-[11px] text-[#ffd873]/90 font-bold font-bengali tracking-wide">
              {t('footerFestival')}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
