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
  Send,
  Flower2,
  Users
} from 'lucide-react';

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
      title: 'ভার্চুয়াল পুষ্পাঞ্জলি',
      desc: 'মায়ের চরণে ফুল নিবেদন ও শঙ্খধ্বনি',
      icon: <Flower2 className="w-5 h-5 text-rose-950" />,
      iconBg: 'bg-rose-300/90',
      tag: 'Live Ritual',
      tagStyle: 'bg-rose-400/40 text-rose-950 border-rose-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenAnjali();
      }
    },
    {
      id: 'pandal',
      title: 'সেরা পুজো পরিক্রমা',
      desc: 'কলকাতার ৩২টি বিখ্যাত মণ্ডপ ও মেট্রো গাইড',
      icon: <MapPin className="w-5 h-5 text-amber-950" />,
      iconBg: 'bg-amber-300/90',
      tag: '৩২টি মণ্ডপ',
      tagStyle: 'bg-amber-400/40 text-amber-950 border-amber-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenPandalGuide();
      }
    },
    {
      id: 'adda',
      title: 'লাইভ পুজোর আড্ডা ও চা',
      desc: 'রিয়েল-টাইম কমিউনিটি চ্যাট ও মাটির ভাঁড়ের চা',
      icon: <Coffee className="w-5 h-5 text-orange-950" />,
      iconBg: 'bg-orange-300/90',
      tag: 'WhatsApp UI',
      tagStyle: 'bg-orange-400/40 text-orange-950 border-orange-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenAdda();
      }
    },
    {
      id: 'spotify',
      title: 'Spotify Music Hub',
      desc: '১৮০+ পুজো হিটস, আগমনী ও বীরেন্দ্রকৃষ্ণ ভদ্র',
      icon: <Music className="w-5 h-5 text-emerald-950" />,
      iconBg: 'bg-emerald-300/90',
      tag: '180+ Tracks',
      tagStyle: 'bg-emerald-400/40 text-emerald-950 border-emerald-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenSpotify();
      }
    },
    {
      id: 'mahalaya',
      title: 'মহালয়া ও দেবীপক্ষের ইতিহাস',
      desc: 'মহিষাসুরমর্দিনী, বীরেন্দ্রকৃষ্ণ ও চণ্ডীপাঠের কথা',
      icon: <BookOpen className="w-5 h-5 text-amber-950" />,
      iconBg: 'bg-yellow-300/90',
      tag: 'Lore & Story',
      tagStyle: 'bg-yellow-400/40 text-yellow-950 border-yellow-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenAboutMahalaya();
      }
    },
    {
      id: 'greeting',
      title: 'শারদীয় শুভেচ্ছা কার্ড',
      desc: 'কাস্টমাইজড পুজো গ্রিটিং কার্ড তৈরি ও ডাউনলোড',
      icon: <Sparkles className="w-5 h-5 text-purple-950" />,
      iconBg: 'bg-purple-300/90',
      tag: 'Card Maker',
      tagStyle: 'bg-purple-400/40 text-purple-950 border-purple-400/60',
      action: () => {
        setIsMenuOpen(false);
        onOpenGreeting();
      }
    }
  ];

  return (
    <header className="relative z-40 w-full px-3 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between pointer-events-auto">
      {/* 1. Left: 🟢 Live Online Indicator & Dual Capsule [ 👥 | ☕ ] */}
      <div className="flex items-center gap-2">
        <div
          onClick={onOpenAdda}
          title="Click to join live community adda!"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill cursor-pointer shadow-md hover:scale-103 active:scale-95 transition-all group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
          </span>
          <span className="tabular-nums font-bold text-emerald-300 text-xs">
            {onlineCount}
          </span>
          <span className="text-[11px] text-[#fdf3e2]/70 font-medium">online</span>
        </div>

        {/* Dual Capsule Pill: [ 👥 Creators | ☕ Buy Chai ] matching user screenshot */}
        <div className="flex items-center rounded-full liquid-glass-pill p-0.5 border border-white/20 shadow-md">
          {/* 👥 Creators Button */}
          <button
            onClick={onOpenCreators}
            title="Made with Bhalobasha by Aneek Pal"
            className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <span className="w-[1px] h-3.5 bg-white/20 my-auto" />

          {/* ☕ Buy Us A Chai Button */}
          <button
            onClick={onOpenBuyChai}
            title="Buy Me A Chai (UPI Support)"
            className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-full text-[#fdf3e2]/85 hover:text-[#ffd873] hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* 2. Right: Ambience Switch & Floating Menu */}
      <div className="relative flex items-center gap-2" ref={menuRef}>
        {/* Day / Night Ambience Toggle (☀️ / 🌙) */}
        <button
          onClick={setIsNight}
          title={isNight ? 'Switch to Day ambience' : 'Switch to Night ambience'}
          className="flex items-center justify-center w-8 h-8 rounded-full liquid-glass-btn text-[#ffd873] hover:bg-yellow-400/20 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {isNight ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
        </button>

        {/* Floating Menu Button: [ 👑 পুজো স্পেশাল ⌵ ] */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill transition-all cursor-pointer shadow-lg active:scale-95 ${
            isMenuOpen
              ? 'border-[#ffd873] bg-gradient-to-r from-amber-500/30 to-orange-500/25 text-[#ffd873] shadow-[0_0_16px_rgba(255,216,115,0.35)]'
              : 'hover:border-white/30 text-[#fdf3e2]'
          }`}
        >
          <img
            src="/durga-logo.png"
            alt="Maa Durga"
            className="w-4 h-4 object-contain drop-shadow-[0_0_8px_rgba(255,216,115,0.8)]"
          />
          <span className="font-bengali text-xs font-bold tracking-wide">
            পুজো স্পেশাল
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#ffd873] transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* 3. Golden Liquid Glass Dropdown Menu (Clean Rows Without Stickers) */}
        {isMenuOpen && (
          <div className="absolute right-0 top-11 z-50 w-80 sm:w-92 rounded-[32px] bg-gradient-to-b from-[#8c6227]/95 via-[#533013]/95 to-[#241308]/98 backdrop-blur-3xl border-2 border-[#ffd873]/50 p-3.5 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(234,179,8,0.25)] animate-fadeIn box-border">
            {/* Header: ✨ দেবীপক্ষ এক্সপ্লোরার | 6 Features */}
            <div className="px-2 py-1 mb-3 border-b border-[#ffd873]/20 flex items-center justify-between">
              <span className="font-bengali text-sm font-black text-[#ffd873] tracking-wide flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="w-4 h-4 text-[#ffd873]" />
                দেবীপক্ষ এক্সপ্লোরার
              </span>
              <span className="text-xs font-semibold text-[#fdf3e2]/80">
                6 Features
              </span>
            </div>

            {/* 6 Full-Width Horizontal Feature Rows (Clean Without Stickers) */}
            <div className="space-y-2">
              {featuresList.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group w-full flex items-center p-2.5 rounded-2xl bg-white/25 hover:bg-white/35 border border-white/35 hover:border-[#ffd873]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all duration-200 text-left active:scale-97 cursor-pointer"
                >
                  {/* Left: Icon Tile + Title/Subtitle */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
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

            {/* Sub-footer: দেবীপক্ষ (Devi Paksha) • শারদীয় উৎসব */}
            <div className="mt-3 pt-2 border-t border-[#ffd873]/20 text-center text-[11px] text-[#ffd873]/90 font-bold font-bengali tracking-wide">
              দেবীপক্ষ (Devi Paksha) • শারদীয় উৎসব
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
