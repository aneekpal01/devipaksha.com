import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Music,
  MapPin,
  MessageCircle,
  BookOpen,
  Send,
  Radio,
  Drum,
  Flame,
  CheckCircle2
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
      desc: 'পূজার অঞ্জলি, শঙ্খ ও মন্ত্র',
      icon: '🌺',
      tag: 'NEW',
      action: () => {
        setIsMenuOpen(false);
        onOpenAnjali();
      },
      gradient: 'from-amber-500/25 to-rose-500/25 border-amber-500/30'
    },
    {
      id: 'pandal',
      title: 'কলকাতা প্যান্ডেল পরিক্রমা',
      desc: '৩২টি সেরা পুজো ও মেট্রো রুট',
      icon: '🏛️',
      tag: 'GUIDE',
      action: () => {
        setIsMenuOpen(false);
        onOpenPandalGuide();
      },
      gradient: 'from-amber-500/20 to-orange-500/20 border-orange-500/30'
    },
    {
      id: 'adda',
      title: 'লাইভ পুজোর আড্ডা',
      desc: 'সবার সাথে রিয়েল-টাইম চ্যাট',
      icon: '☕',
      tag: 'LIVE',
      action: () => {
        setIsMenuOpen(false);
        onOpenAdda();
      },
      gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
    },
    {
      id: 'spotify',
      title: 'স্পটিফাই মিউজিক হাব',
      desc: 'অফিসিয়াল পুজো ট্র্যাক ও প্লেলিস্ট',
      icon: '🎵',
      tag: 'AUDIO',
      action: () => {
        setIsMenuOpen(false);
        onOpenSpotify();
      },
      gradient: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    },
    {
      id: 'mahalaya',
      title: 'মহালয়া ও দেবীপক্ষ কথা',
      desc: 'বীরেন্দ্রকৃষ্ণ ভদ্র ও ইতিহাস',
      icon: '📖',
      tag: 'STORY',
      action: () => {
        setIsMenuOpen(false);
        onOpenAboutMahalaya();
      },
      gradient: 'from-orange-500/20 to-amber-500/20 border-amber-500/30'
    },
    {
      id: 'greeting',
      title: 'শারদ শুভেচ্ছা কার্ড',
      desc: 'ডিজিটাল কার্ড বানিয়ে শেয়ার করুন',
      icon: '💌',
      tag: 'SHARE',
      action: () => {
        setIsMenuOpen(false);
        onOpenGreeting();
      },
      gradient: 'from-pink-500/20 to-rose-500/20 border-pink-500/30'
    }
  ];

  return (
    <header className="relative z-40 w-full px-3 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between pointer-events-auto">
      {/* 1. Left: 🟢 Live Online Indicator */}
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

      {/* 2. Right: Dynamic Floating Menu Capsule */}
      <div className="relative flex items-center gap-2" ref={menuRef}>
        {/* Day / Night Theme Ambience Switch (☀️ / 🌙) */}
        <button
          onClick={setIsNight}
          title={isNight ? 'Switch to Day ambience (দিনের আলো)' : 'Switch to Night ambience (রাতের আলো)'}
          className="flex items-center justify-center w-8 h-8 rounded-full liquid-glass-btn text-[#ffd873] hover:bg-yellow-400/20 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {isNight ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
        </button>

        {/* Dynamic Island Floating Feature Hub Pill with Cute Maa Durga Logo */}
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

        {/* 3. Frosted 3D Liquid Glass Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-11 z-50 w-80 sm:w-88 rounded-[30px] liquid-glass-card p-3.5 shadow-2xl border border-white/35 backdrop-blur-3xl animate-fadeIn box-border">
            {/* Header */}
            <div className="px-2.5 py-1.5 mb-2 border-b border-black/15 flex items-center justify-between">
              <span className="font-bengali text-xs font-black text-[#ffd873] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] uppercase tracking-wider flex items-center gap-1.5">
                <img
                  src="/durga-logo.png"
                  alt="Maa Durga"
                  className="w-4 h-4 object-contain drop-shadow"
                />
                দেবীপক্ষ এক্সপ্লোরার
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#ffd873] font-bold border border-white/20">
                Sharod 2026
              </span>
            </div>

            {/* 6 Feature Button Tiles */}
            <div className="grid grid-cols-2 gap-2">
              {featuresList.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group relative flex flex-col justify-between p-2.5 rounded-2xl bg-gradient-to-b from-white/40 via-white/30 to-white/25 hover:from-white/50 hover:to-white/35 border border-white/50 hover:border-[#ffd873]/80 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 text-left active:scale-96 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xl p-1 rounded-xl bg-white/50 shadow-sm border border-white/40 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#1a0802] text-[#ffd873] border border-amber-400/40 shadow-xs font-sans tracking-wide">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bengali text-xs font-black text-[#150702] group-hover:text-[#801200] leading-tight transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[#2d1105] font-bold leading-snug mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Sub-footer */}
            <div className="mt-2.5 pt-2 border-t border-black/15 px-2 flex items-center justify-between text-[10px] text-[#fdf3e2]/70 font-semibold">
              <span className="font-bengali">দেবীপক্ষ (Devi Paksha)</span>
              <span className="font-bengali text-[#ffd873]/90">শারদীয় উৎসব</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
