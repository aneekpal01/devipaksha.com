import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  ChevronDown
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
      }
    },
    {
      id: 'pandal',
      title: 'কলকাতা প্যান্ডেল পরিক্রমা',
      desc: '৩২টি সেরা পুজো ও মেট্রো...',
      icon: '🏛️',
      tag: 'GUIDE',
      action: () => {
        setIsMenuOpen(false);
        onOpenPandalGuide();
      }
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
      }
    },
    {
      id: 'spotify',
      title: 'স্পটিফাই মিউজিক হাব',
      desc: 'অফিসিয়াল পুজো ট্র্যাক ও...',
      icon: '🎵',
      tag: 'AUDIO',
      action: () => {
        setIsMenuOpen(false);
        onOpenSpotify();
      }
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
      }
    },
    {
      id: 'greeting',
      title: 'শারদ শুভেচ্ছা কার্ড',
      desc: 'ডিজিটাল কার্ড বানিয়ে...',
      icon: '💌',
      tag: 'SHARE',
      action: () => {
        setIsMenuOpen(false);
        onOpenGreeting();
      }
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

        {/* 3. Exact Match Dark Slate Frosted Glass Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-11 z-50 w-80 sm:w-88 rounded-[32px] bg-[#1a1d26]/96 p-3.5 shadow-2xl border border-white/20 backdrop-blur-3xl animate-fadeIn box-border">
            {/* Header: 👑 দেবীপক্ষ এক্সপ্লোরার | Sharod 2026 */}
            <div className="px-2 py-1 mb-2.5 border-b border-white/10 flex items-center justify-between">
              <span className="font-bengali text-xs font-black text-[#ffd873] tracking-wide flex items-center gap-1.5">
                <img
                  src="/durga-logo.png"
                  alt="Maa Durga"
                  className="w-4 h-4 object-contain drop-shadow"
                />
                দেবীপক্ষ এক্সপ্লোরার
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/70 text-[#ffd873] font-bold border border-white/15 font-sans">
                Sharod 2026
              </span>
            </div>

            {/* 6 Feature Button Tiles (Matching Exact Reference Screenshot) */}
            <div className="grid grid-cols-2 gap-2">
              {featuresList.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group flex flex-col justify-between p-2.5 rounded-2xl bg-[#424754]/80 hover:bg-[#4d5363]/90 border border-white/15 shadow-sm transition-all text-left active:scale-96 cursor-pointer"
                >
                  {/* Top row: Light Square Icon Tile + Black Tag Badge */}
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-9 h-9 rounded-xl bg-[#cbced6] flex items-center justify-center text-lg shadow-inner group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-black text-[#ffd873] border border-white/10 font-sans tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  {/* Bottom: Title & Subtitle */}
                  <div>
                    <h3 className="font-bengali text-xs font-black text-white group-hover:text-[#ffd873] leading-tight transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-stone-300 font-medium leading-snug mt-0.5 truncate">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Sub-footer: দেবীপক্ষ (Devi Paksha) | শারদীয় উৎসব */}
            <div className="mt-3 pt-2 border-t border-white/10 px-2 flex items-center justify-between text-[10px]">
              <span className="font-bengali text-stone-300 font-medium">দেবীপক্ষ (Devi Paksha)</span>
              <span className="font-bengali text-[#ffd873] font-bold">শারদীয় উৎসব</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
