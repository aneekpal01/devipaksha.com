import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Train, Sparkles, ExternalLink } from 'lucide-react';
import { KOLKATA_PANDALS, PANDAL_ZONES } from '../data/pandalData';

export default function PandalGuideModal({ isOpen, onClose }) {
  const [activeZone, setActiveZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredPandals = KOLKATA_PANDALS.filter((pandal) => {
    const matchesZone = activeZone === 'all' || pandal.zone === activeZone;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesZone;

    const matchesSearch =
      pandal.name.toLowerCase().includes(q) ||
      pandal.tag.toLowerCase().includes(q) ||
      pandal.description.toLowerCase().includes(q) ||
      pandal.metro.toLowerCase().includes(q) ||
      pandal.zoneName.toLowerCase().includes(q);

    return matchesZone && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* 3D Liquid Glass Modal (Large & Spacious for PC) */}
      <div className="relative w-full max-w-4xl md:h-[86vh] h-full max-h-[90vh] rounded-[32px] sm:rounded-[36px] liquid-glass-card p-3.5 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 box-border">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header (Clean wrapping, zero truncation) */}
        <div className="flex items-start sm:items-center justify-between pb-2.5 border-b border-white/10 pr-12 gap-2.5 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#ffd873]/20 text-[#ffd873] shadow-md border border-[#ffd873]/30 flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bengali-title text-base sm:text-xl font-bold text-[#ffd873] tracking-wide">
                  সেরা পুজো পরিক্রমা
                </h1>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold flex-shrink-0">
                  {KOLKATA_PANDALS.length}টি মণ্ডপ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#fdf3e2]/65 font-medium leading-tight">
                কলকাতার বিখ্যাত মণ্ডপ, নিকটতম মেট্রো রুট ও গুগল ম্যাপস
              </p>
            </div>
          </div>
        </div>

        {/* 2. Controls: Zone Filter Tabs & Search Bar */}
        <div className="my-2 space-y-2 box-border">
          {/* Zone Filter Ribbon */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full box-border">
            {PANDAL_ZONES.map((zone) => (
              <button
                key={zone.key}
                type="button"
                onClick={() => setActiveZone(zone.key)}
                className={`px-3 py-1.5 rounded-2xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer border ${
                  activeZone === zone.key
                    ? 'liquid-glass-btn border-[#ffd873] text-[#ffd873] bg-white/20 shadow-md'
                    : 'border-white/10 hover:border-white/20 text-[#fdf3e2]/70 bg-white/5'
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="প্যান্ডেলের নাম, মেট্রো স্টেশন বা থিম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs sm:text-sm text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#ffd873] focus:bg-white/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* 3. 2-Column Responsive Pandal Grid (Full Title Visibility, Zero Box Clipping) */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-3 overflow-x-hidden w-full box-border">
          {filteredPandals.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#fdf3e2]/60">
              No pandals found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPandals.map((pandal) => (
                <div
                  key={pandal.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 hover:border-[#ffd873]/50 transition-all shadow-lg flex flex-col justify-between group box-border relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    {/* Top Row: Emoji, Full Non-Truncated Name, Zone Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-xl flex-shrink-0 mt-0.5">{pandal.iconEmoji}</span>
                        <h3 className="font-bengali text-sm sm:text-base font-bold text-[#ffd873] leading-snug break-words">
                          {pandal.name}
                        </h3>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/75 font-mono border border-white/10 flex-shrink-0">
                        {pandal.zoneName}
                      </span>
                    </div>

                    {/* Tagline */}
                    <div className="text-[11px] font-bold text-amber-300/90 font-bengali flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#ffd873] flex-shrink-0" />
                      <span className="break-words leading-tight">{pandal.tag}</span>
                    </div>

                    {/* Description */}
                    <p className="font-bengali text-xs text-[#fdf3e2]/75 leading-relaxed">
                      {pandal.description}
                    </p>
                  </div>

                  {/* Bottom Row: Metro Station Info & Google Maps Button */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#fdf3e2]/65 font-medium truncate">
                      <Train className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{pandal.metro}</span>
                    </div>

                    <a
                      href={pandal.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#ffd873] hover:bg-[#ffe59e] text-black font-bold text-[11px] flex items-center gap-1 shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer ml-auto"
                    >
                      <Navigation className="w-3 h-3 fill-black" />
                      <span>ম্যাপ দেখুন</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Bottom Footer Info */}
        <div className="pt-2 border-t border-white/10 text-center text-[10px] text-[#fdf3e2]/50 font-bengali">
          শারদীয় শুভ পরিক্রমা • Kolkata Police Helpline: 100 / 112
        </div>
      </div>
    </div>
  );
}
