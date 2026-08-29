import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { PLAYLISTS_DATA, TOTAL_TRACKS_COUNT } from '../data/pujoData';

export default function DaySelectorDropdown({
  currentPlaylistKey = 'durga_puja',
  onSelectPlaylist,
  onOpenAboutMahalaya
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentPlaylist = PLAYLISTS_DATA[currentPlaylistKey] || PLAYLISTS_DATA.durga_puja;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-30 inline-block text-left" ref={dropdownRef}>
      {/* Apple Liquid Glass Pill Button: ≡ DURGA ⌵ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2 rounded-full liquid-glass-pill text-[#fdf3e2] font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all hover:scale-104 active:scale-96"
      >
        <span className="text-[#ffd873] text-sm">≡</span>
        <span className="font-serif-display font-bold tracking-wider text-[#ffd873]">
          {currentPlaylist.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#ffd873] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Apple Liquid Glass Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 sm:w-96 rounded-3xl liquid-glass-card p-3.5 z-50 animate-fadeIn select-none">
          {/* 5 Playlists Selector */}
          <div className="mb-2.5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#ffd873] mb-2 flex items-center justify-between">
              <span>🎵 Playlists ({Object.keys(PLAYLISTS_DATA).length} Collections)</span>
              <span className="text-[9px] text-[#fdf3e2]/60 font-mono">{TOTAL_TRACKS_COUNT}+ tracks</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(PLAYLISTS_DATA).map(([key, pl]) => {
                const isActive = currentPlaylistKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectPlaylist(key);
                      setIsOpen(false);
                    }}
                    className={`py-2 px-1.5 rounded-2xl text-center transition-all ${
                      isActive
                        ? 'liquid-glass-btn border-[#ffd873]/80 text-[#ffd873] font-bold scale-102 bg-white/15'
                        : 'liquid-glass-btn border-transparent text-[#fdf3e2]/80 text-[10px]'
                    }`}
                  >
                    <div className="text-sm mb-0.5">{pl.icon}</div>
                    <div className="text-[10px] truncate font-bold">{pl.name.split(' ')[0]}</div>
                    <div className="text-[8px] font-bengali text-[#fdf3e2]/60 truncate">
                      {pl.tracks?.length || 0} songs
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learn About Mahalaya Guide Button */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAboutMahalaya();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl liquid-glass-btn text-[#ffd873] font-bold text-xs"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>📖 All About Mahalaya (মহালয়া কথা)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
