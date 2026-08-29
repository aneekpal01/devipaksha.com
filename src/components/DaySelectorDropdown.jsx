import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PLAYLISTS_DATA } from '../data/pujoData';

export default function DaySelectorDropdown({
  currentPlaylistKey = 'durga_puja',
  onOpenPlaylist
}) {
  const currentPlaylist = PLAYLISTS_DATA[currentPlaylistKey] || PLAYLISTS_DATA.durga_puja;

  return (
    <div className="relative z-30 inline-block text-left mt-2.5">
      {/* Exact Match Amber/Gold Frosted Capsule Button: ≡   DURGA   ⌵ -> Opens Full Song List */}
      <button
        onClick={onOpenPlaylist}
        title="Click to view all songs & playlists"
        className="flex items-center gap-2.5 px-6 py-2 rounded-full liquid-glass-pill text-[#ffd873] font-bold text-xs sm:text-sm uppercase tracking-widest transition-all hover:scale-104 active:scale-95 shadow-lg border border-[#ffd873]/40 bg-gradient-to-r from-amber-500/25 via-amber-600/20 to-orange-500/20 cursor-pointer"
      >
        <span className="text-[#ffd873] text-sm font-black">≡</span>
        <span className="font-serif-display font-black tracking-wider text-[#ffd873]">
          {currentPlaylist.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#ffd873]" />
      </button>
    </div>
  );
}
