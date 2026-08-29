import React, { useState, useEffect, useRef } from 'react';
import {
  Coffee,
  Moon,
  Sun,
  BookOpen,
  Flower2,
  MapPin,
  Sparkles,
  ChevronDown,
  Music,
  Send,
  Heart,
  ExternalLink
} from 'lucide-react';

export default function TopBar({
  timePhase = 'day',
  onCycleTimePhase,
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

  const menuItems = [
    {
      id: 'anjali',
      title: 'ভার্চুয়াল পুষ্পাঞ্জলি',
      subtitle: 'মায়ের চরণে ফুল নিবেদন ও শঙ্খধ্বনি',
      icon: Flower2,
      badge: 'Live Ritual',
      badgeColor: 'bg-rose-500/30 text-rose-950 font-black border-rose-400/50',
      iconBg: 'bg-rose-500/35 text-rose-900 border-rose-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenAnjali) onOpenAnjali();
      }
    },
    {
      id: 'pandal',
      title: 'সেরা পুজো পরিক্রমা',
      subtitle: 'কলকাতার ৩২টি বিখ্যাত মণ্ডপ ও মেট্রো গাইড',
      icon: MapPin,
      badge: '৩২টি মণ্ডপ',
      badgeColor: 'bg-amber-500/35 text-amber-950 font-black border-amber-400/50',
      iconBg: 'bg-amber-500/35 text-amber-900 border-amber-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenPandalGuide) onOpenPandalGuide();
      }
    },
    {
      id: 'adda',
      title: 'লাইভ পুজোর আড্ডা ও চা',
      subtitle: 'রিয়েল-টাইম কমিউনিটি চ্যাট ও মাটির ভাঁড়ের চা',
      icon: Coffee,
      badge: 'WhatsApp UI',
      badgeColor: 'bg-orange-500/35 text-orange-950 font-black border-orange-400/50',
      iconBg: 'bg-orange-500/35 text-orange-900 border-orange-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenAdda) onOpenAdda();
      }
    },
    {
      id: 'spotify',
      title: 'Spotify Music Hub',
      subtitle: '১৮০+ পুজো হিটস, আগমনী ও বীরেন্দ্রকৃষ্ণ ভদ্র',
      icon: Music,
      badge: '180+ Tracks',
      badgeColor: 'bg-emerald-500/35 text-emerald-950 font-black border-emerald-400/50',
      iconBg: 'bg-emerald-500/35 text-emerald-900 border-emerald-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenSpotify) onOpenSpotify();
      }
    },
    {
      id: 'mahalaya',
      title: 'মহালয়া ও দেবীপক্ষের ইতিহাস',
      subtitle: 'মহিষাসুরমর্দিনী, বীরেন্দ্রকৃষ্ণ ও চণ্ডীপাঠের কথা',
      icon: BookOpen,
      badge: 'Lore & Story',
      badgeColor: 'bg-yellow-500/35 text-yellow-950 font-black border-yellow-400/50',
      iconBg: 'bg-yellow-500/35 text-yellow-900 border-yellow-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenAboutMahalaya) onOpenAboutMahalaya();
      }
    },
    {
      id: 'greeting',
      title: 'শারদীয় শুভেচ্ছা কার্ড',
      subtitle: 'কাস্টমাইজড পুজো গ্রিটিং কার্ড তৈরি ও ডাউনলোড',
      icon: Sparkles,
      badge: 'Card Maker',
      badgeColor: 'bg-purple-500/35 text-purple-950 font-black border-purple-400/50',
      iconBg: 'bg-purple-500/35 text-purple-900 border-purple-400/50',
      onClick: () => {
        setIsMenuOpen(false);
        if (onOpenGreeting) onOpenGreeting();
      }
    }
  ];

  return (
    <header className="relative z-40 flex items-center justify-between w-full max-w-lg px-4 py-2.5 mx-auto select-none">
      {/* 1. Left: Real Live Online Visitors */}
      <div
        title="Real live online visitors"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-medium text-[#fdf3e2]/90 select-none cursor-default shadow-md"
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
        {/* 5-Phase Real-Time Celestial Diurnal Switch (🌅 Dawn ➔ ☀️ Day ➔ 🌇 Sunset ➔ 🏮 Evening ➔ 🌙 Night) */}
        <button
          onClick={onCycleTimePhase || (() => setIsNight(!isNight))}
          title={
            timePhase === 'dawn'
              ? 'ভোর (Dawn: ৪:০০ AM — ৬:৫৯ AM) • ক্লিক করে সময় পরিবর্তন করুন'
              : timePhase === 'day'
              ? 'সকাল ও দুপুর (Day: ৭:০০ AM — ৩:৫৯ PM) • ক্লিক করে সময় পরিবর্তন করুন'
              : timePhase === 'sunset'
              ? 'বিকেল ও গোধূলি (Golden Hour: ৪:০০ PM — ৬:২৯ PM) • ক্লিক করে সময় পরিবর্তন করুন'
              : timePhase === 'evening'
              ? 'সন্ধ্যা ও আরতি (Evening: ৬:৩০ PM — ১০:২৯ PM) • ক্লিক করে সময় পরিবর্তন করুন'
              : 'গভীর রাত ও পূর্ণিমা (Midnight: ১০:৩০ PM — ৩:৫৯ AM) • ক্লিক করে সময় পরিবর্তন করুন'
          }
          className="flex items-center justify-center w-8 h-8 rounded-full liquid-glass-btn text-[#ffd873] hover:bg-yellow-400/20 shadow-md transition-all active:scale-95 cursor-pointer text-sm"
        >
          {timePhase === 'dawn' ? (
            <span className="text-sm">🌅</span>
          ) : timePhase === 'day' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : timePhase === 'sunset' ? (
            <span className="text-sm">🌇</span>
          ) : timePhase === 'evening' ? (
            <span className="text-sm">🏮</span>
          ) : (
            <Moon className="w-4 h-4 text-amber-200" />
          )}
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

        {/* 3. Exact Image 2 Style Frosted 3D Liquid Glass Dropdown Menu */}
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
              <span className="text-[10px] text-white/80 font-mono font-extrabold drop-shadow">
                {menuItems.length} Features
              </span>
            </div>

            {/* Menu Items with Image 2 Translucent Glass Plates & Solid Dark Typography */}
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-white/40 via-white/30 to-white/25 hover:from-white/55 hover:to-white/40 backdrop-blur-xl border border-white/50 hover:border-[#ffd873] transition-all flex items-center gap-3 text-left group cursor-pointer box-border shadow-md"
                  >
                    {/* Soft Pastel Glass Icon Badge */}
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm ${item.iconBg}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        {/* Ultra-Sharp Dark Title */}
                        <span className="font-bengali text-xs sm:text-[13px] font-black text-[#150702] group-hover:text-black transition-colors leading-tight">
                          {item.title}
                        </span>
                        {/* Saturated Glass Badge */}
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full border font-sans font-black flex-shrink-0 shadow-sm ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Clear Dark Subtitle */}
                      <p className="font-bengali text-[11px] font-bold text-[#2d1105] group-hover:text-black leading-normal">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/15 text-center text-[10px] sm:text-[11px] font-medium text-[#fdf3e2]/70 tracking-wider font-bengali">
              দেবীপক্ষ (Devi Paksha) • শারদীয় উৎসব
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
