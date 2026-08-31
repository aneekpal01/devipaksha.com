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
    <header className="relative z-40 w-full px-2.5 sm:px-6 pt-2.5 sm:pt-3.5 flex justify-center pointer-events-auto box-border">
      {/* 🌟 Continuous Full-Width Floating Liquid Glass Top Bar (Plan 3) */}
      <div className="w-full max-w-5xl rounded-[28px] sm:rounded-full liquid-glass-card p-1 sm:p-1.5 border border-white/20 shadow-2xl flex items-center justify-between backdrop-blur-2xl box-border">
        {/* Left Side: Live Online + Creators + Buy Chai */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {/* Live Online Badge */}
          <button
            onClick={onOpenAdda}
            title="Click to join live community adda!"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full hover:bg-white/15 transition-all text-emerald-300 font-bold text-xs cursor-pointer active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
            </span>
            <span className="tabular-nums font-bold text-xs">{onlineCount}</span>
            <span className="hidden sm:inline text-[11px] text-[#fdf3e2]/70 font-medium">{t('online')}</span>
          </button>

          <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

          {/* Creators */}
          <button
            onClick={onOpenCreators}
            title="Made with Bhalobasha by Aneek Pal"
            className="p-1.5 sm:px-2 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 transition-all cursor-pointer active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
          </button>

          <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

          {/* Buy Chai */}
          <button
            onClick={onOpenBuyChai}
            title="Buy Me A Chai (UPI Support)"
            className="p-1.5 sm:px-2 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 transition-all cursor-pointer active:scale-95"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Right Side: Language + Ambience + Pujo Special Menu */}
        <div className="relative flex items-center gap-0.5 sm:gap-1 flex-shrink-0" ref={menuRef}>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[#ffd873] hover:bg-white/15 transition-all font-bold text-xs cursor-pointer active:scale-95"
          >
            <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span className="font-sans text-[10px] sm:text-[11px] font-black uppercase">{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
          </button>

          <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

          {/* Ambience Toggle */}
          <button
            onClick={setIsNight}
            title={isNight ? 'Switch to Day ambience' : 'Switch to Night ambience'}
            className="p-1.5 rounded-full text-[#ffd873] hover:bg-yellow-400/20 transition-all active:scale-95 cursor-pointer"
          >
            {isNight ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />}
          </button>

          <span className="w-[1px] h-3.5 bg-white/20 my-auto mx-0.5" />

          {/* Pujo Special Dropdown Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
              isMenuOpen
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/25 text-[#ffd873]'
                : 'text-[#fdf3e2] hover:bg-white/15'
            }`}
          >
            <img src="/durga-logo.png" alt="Maa Durga" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow flex-shrink-0" />
            <span className="font-bengali text-xs font-bold whitespace-nowrap">{t('pujoSpecial')}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#ffd873] transition-transform duration-200 flex-shrink-0 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 3. Golden Liquid Glass Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-11 sm:top-12 z-50 w-[calc(100vw-24px)] max-w-sm sm:w-92 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#8c6227]/95 via-[#533013]/95 to-[#241308]/98 backdrop-blur-3xl border-2 border-[#ffd873]/50 p-3 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(234,179,8,0.25)] animate-fadeIn box-border">
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

              {/* 6 Full-Width Horizontal Feature Rows */}
              <div className="space-y-1.5 sm:space-y-2">
                {featuresList.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="group w-full flex items-center p-2 sm:p-2.5 rounded-2xl bg-white/25 hover:bg-white/35 border border-white/35 hover:border-[#ffd873]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all duration-200 text-left active:scale-97 cursor-pointer"
                  >
                    {/* Left: Icon Tile + Title/Subtitle */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bengali text-xs sm:text-[13px] font-black text-[#150702] group-hover:text-[#801200] leading-tight truncate">
                          {item.title}
                        </h3>
                        <p className="font-bengali text-[10px] sm:text-[11px] text-[#2d1105]/90 font-bold leading-snug mt-0.5 truncate">
                          {item.desc}
                        </p>
                      </div>
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
      </div>
    </header>
  );
}
