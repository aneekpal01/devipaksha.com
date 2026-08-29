import React, { useState } from 'react';
import { X, Search, Play, Pause, Radio, Drum, Sparkles, Disc, Music } from 'lucide-react';
import { PLAYLISTS_DATA, TOTAL_TRACKS_COUNT } from '../data/pujoData';

export default function PlaylistModal({
  isOpen,
  onClose,
  currentPlaylistKey,
  onSelectPlaylist,
  currentTrack,
  isPlaying,
  onSelectTrack
}) {
  const [activeTab, setActiveTab] = useState(currentPlaylistKey || 'durga_puja');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentPlaylist = PLAYLISTS_DATA[activeTab] || PLAYLISTS_DATA.durga_puja;
  const tracks = currentPlaylist.tracks || [];

  // Filter songs by search query
  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl h-full max-h-[92vh] rounded-[36px] liquid-glass-card p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 pr-12 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl flex-shrink-0">{currentPlaylist.icon}</span>
            <div className="min-w-0">
              <h2 className="font-bengali-title text-lg sm:text-2xl font-bold text-[#ffd873] truncate">
                {currentPlaylist.bengaliName}
              </h2>
              <p className="text-xs text-[#fdf3e2]/70 font-medium truncate">
                {currentPlaylist.name} ({tracks.length} of {TOTAL_TRACKS_COUNT}+ Songs)
              </p>
            </div>
          </div>
        </div>

        {/* 5 Playlist Switcher Tabs */}
        <div className="flex gap-2 p-1.5 bg-black/30 rounded-2xl border border-white/10 my-3 overflow-x-auto">
          {Object.entries(PLAYLISTS_DATA).map(([key, pl]) => {
            const isTabActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  if (onSelectPlaylist) onSelectPlaylist(key);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  isTabActive
                    ? 'liquid-glass-btn border-[#ffd873] text-[#ffd873] shadow-lg scale-102 bg-white/20'
                    : 'text-[#fdf3e2]/70 hover:text-[#fdf3e2] border border-transparent'
                }`}
              >
                <span>{pl.icon}</span>
                <span>{pl.name}</span>
                <span className="text-[10px] opacity-70">({pl.tracks?.length || 0})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffd873]/70" />
          <input
            type="text"
            placeholder={`Search across ${tracks.length} songs in ${currentPlaylist.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-sm text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#ffd873] transition-colors"
          />
        </div>

        {/* Track List: 2-Column Responsive Grid with safe padding */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1">
          {filteredTracks.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#fdf3e2]/60">
              No tracks found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredTracks.map((track, idx) => {
                const isSelected = currentTrack?.id === track.id;
                const thumb = track.thumbnail || `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;

                return (
                  <div
                    key={track.id + '_' + idx}
                    onClick={() => {
                      onSelectTrack(track, activeTab);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'liquid-glass-btn border-[#ffd873] text-[#ffd873] shadow-md bg-white/20'
                        : 'hover:bg-white/10 text-[#fdf3e2] border-transparent bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 border border-white/15 shadow-sm">
                        <img
                          src={thumb}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          {isSelected && isPlaying ? (
                            <div className="flex items-end gap-0.5 h-3.5">
                              <span className="w-0.5 bg-[#ffd873] eq-bar-1"></span>
                              <span className="w-0.5 bg-[#ffd873] eq-bar-2"></span>
                              <span className="w-0.5 bg-[#ffd873] eq-bar-3"></span>
                            </div>
                          ) : (
                            <Play className="w-4 h-4 fill-current text-white/90" />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate">
                          {track.title}
                        </div>
                        <div className="text-[11px] text-[#fdf3e2]/65 truncate font-medium">
                          {track.artist}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] text-[#fdf3e2]/50 font-mono flex-shrink-0 pl-2">
                      {track.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#fdf3e2]/70">
          <span>🔊 Tap any song to play instantly</span>
          <span className="text-[#ffd873] font-bold">{filteredTracks.length} of {TOTAL_TRACKS_COUNT}+ Songs</span>
        </div>
      </div>
    </div>
  );
}
