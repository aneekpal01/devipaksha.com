import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { PLAYLISTS_DATA } from '../data/pujoData';

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

  // Filter songs by search query if typed
  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: 'durga_puja', label: 'DURGA PUJA', desc: 'The main curated Durga Puja playlist.' },
    { key: 'mahalaya', label: 'MAHALAYA', desc: 'Sacred Birendra Krishna Bhadra Chandi Path & Mahalaya.' },
    { key: 'dhak_ambience', label: 'MAHALAYA SONGS', desc: 'Classic Sharodiya Agomoni songs & festive Dhak beats.' }
  ];

  const currentDesc = tabs.find((t) => t.key === activeTab)?.desc || currentPlaylist.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      {/* Sleek Minimalist Dark Frosted Dialog (Matching exact reference image) */}
      <div className="relative w-full max-w-md md:max-w-lg h-full max-h-[85vh] rounded-[28px] bg-[#181617]/96 backdrop-blur-3xl p-4 sm:p-5 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/10 box-border">
        {/* 1. Header: PLAYLISTS + Close X */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <span className="text-[11px] font-mono tracking-widest text-stone-400 font-bold uppercase">
            PLAYLISTS
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Segmented Pill Controls */}
        <div className="mt-3">
          <div className="flex items-center gap-1 p-1 bg-[#232021] rounded-full w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (onSelectPlaylist) onSelectPlaylist(tab.key);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-full text-[10px] sm:text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer ${
                    isActive
                      ? 'bg-[#383536] text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Subtitle description */}
          <p className="text-[11px] text-stone-400 mt-2.5 px-1 font-medium truncate">
            {currentDesc}
          </p>
        </div>

        {/* 3. Single-Column Track List */}
        <div className="flex-1 overflow-y-auto my-2.5 space-y-1 pr-1 overflow-x-hidden">
          {filteredTracks.length === 0 ? (
            <div className="py-16 text-center text-xs text-stone-400">
              No tracks found
            </div>
          ) : (
            filteredTracks.map((track, idx) => {
              const isSelected = currentTrack?.id === track.id;
              const thumb = track.thumbnail || `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;
              const trackNum = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={track.id + '_' + idx}
                  onClick={() => {
                    if (onSelectTrack) onSelectTrack(track, activeTab);
                  }}
                  className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#2f2b2c] border-white/10 shadow-md text-white'
                      : 'hover:bg-white/5 border-transparent text-stone-300'
                  }`}
                >
                  {/* Left: Indicator + Thumbnail + Title/Artist */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    {/* Index / Playing ♪ Indicator */}
                    <div className="w-5 text-center flex-shrink-0">
                      {isSelected ? (
                        <span className="text-[#ffd873] font-bold text-sm">♪</span>
                      ) : (
                        <span className="text-stone-500 font-mono text-xs">{trackNum}</span>
                      )}
                    </div>

                    {/* Album Thumbnail */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/60 flex-shrink-0 border border-white/10 shadow-sm">
                      <img
                        src={thumb}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Title & Artist */}
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs sm:text-[13px] font-bold truncate leading-tight ${
                          isSelected ? 'text-[#ffd873]' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate leading-snug mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Right: Duration */}
                  <span className="text-xs font-mono text-stone-400 flex-shrink-0">
                    {track.duration}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Bottom Footer Info */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-500 font-medium">
          <span>{filteredTracks.length} tracks available</span>
          <span className="text-stone-400">Devi Paksha Playlist</span>
        </div>
      </div>
    </div>
  );
}
