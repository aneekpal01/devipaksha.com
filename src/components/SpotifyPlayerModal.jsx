import React, { useState } from 'react';
import { X, Search, Play, Globe, Music2, RefreshCw, LogIn, Disc, Sparkles } from 'lucide-react';
import { PLAYLISTS_DATA, TOTAL_TRACKS_COUNT } from '../data/pujoData';
import { ENGLISH_SONGS_DATA, ENGLISH_TRACKS } from '../data/englishSongsData';

export default function SpotifyPlayerModal({
  isOpen,
  onClose,
  onPlayFullTrack,
  currentPlayingTrackId,
  isPlaying
}) {
  const [hubMode, setHubMode] = useState('english');

  // Clean English Categories (Zero emoji clutter)
  const englishCategories = [
    {
      id: 'all_english',
      name: 'All English',
      count: (ENGLISH_TRACKS || []).length,
      subtitle: 'Global Top Hits',
      tracks: ENGLISH_TRACKS || [],
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0'
    },
    {
      id: 'the_weeknd',
      name: 'The Weeknd',
      count: 11,
      subtitle: 'Blinding Lights, Starboy',
      tracks: (ENGLISH_TRACKS || []).filter((t) => t.category === 'the_weeknd'),
      embedUrl: 'https://open.spotify.com/embed/artist/1Xyo4u8uXC1ZmMpatF05PJ?utm_source=generator&theme=0'
    },
    {
      id: 'billie_eilish',
      name: 'Billie Eilish',
      count: 11,
      subtitle: 'Birds of a Feather, Bad Guy',
      tracks: (ENGLISH_TRACKS || []).filter((t) => t.category === 'billie_eilish'),
      embedUrl: 'https://open.spotify.com/embed/artist/6qqNVTkY8uBg9cP3Jd7DAH?utm_source=generator&theme=0'
    },
    {
      id: 'lana_del_rey',
      name: 'Lana Del Rey',
      count: 11,
      subtitle: 'Summertime Sadness',
      tracks: (ENGLISH_TRACKS || []).filter((t) => t.category === 'lana_del_rey'),
      embedUrl: 'https://open.spotify.com/embed/artist/00FQb4jTyendYWaN8pK0wa?utm_source=generator&theme=0'
    },
    {
      id: 'pop_superstars',
      name: 'Pop Superstars',
      count: 32,
      subtitle: 'Taylor, Sabrina, Bruno',
      tracks: (ENGLISH_TRACKS || []).filter((t) => t.category === 'pop_superstars'),
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0kbFH3YI5Re?utm_source=generator&theme=0'
    },
    {
      id: 'indie_rock_chill',
      name: 'Rock & Chill',
      count: 32,
      subtitle: 'Coldplay, Arctic Monkeys',
      tracks: (ENGLISH_TRACKS || []).filter((t) => t.category === 'indie_rock_chill'),
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX889U0CLMr1v?utm_source=generator&theme=0'
    }
  ];

  // Clean Bengali Categories (Zero emoji clutter)
  const bengaliCategories = [
    {
      id: 'all_bengali',
      name: 'All Bengali',
      count: TOTAL_TRACKS_COUNT || 65,
      subtitle: 'সব গান একসাথে',
      tracks: Object.values(PLAYLISTS_DATA || {}).flatMap((pl) => pl?.tracks || []),
      embedUrl: 'https://open.spotify.com/embed/playlist/1VgQ7AoHslvr06hyVXvi1O?utm_source=generator&theme=0'
    },
    {
      id: 'durga_puja',
      name: 'Durga Puja Hits',
      count: 34,
      subtitle: 'সেরা দুর্গাপূজার গান',
      tracks: PLAYLISTS_DATA?.durga_puja?.tracks || [],
      embedUrl: 'https://open.spotify.com/embed/playlist/1VgQ7AoHslvr06hyVXvi1O?utm_source=generator&theme=0'
    },
    {
      id: 'mahalaya',
      name: 'Mahalaya & Chandi Path',
      count: 18,
      subtitle: 'বীরেন্দ্রকৃষ্ণ ভদ্র ও স্তোত্র',
      tracks: PLAYLISTS_DATA?.mahalaya?.tracks || [],
      embedUrl: 'https://open.spotify.com/embed/playlist/3KyL2XNn1kxFjXAatEqY05?utm_source=generator&theme=0'
    },
    {
      id: 'dhak_ambience',
      name: 'Dhak & Pandal Aarti',
      count: 13,
      subtitle: 'বিশুদ্ধ ঢাক ও আরতি',
      tracks: PLAYLISTS_DATA?.dhak_ambience?.tracks || [],
      embedUrl: 'https://open.spotify.com/embed/playlist/7oHLN83pQ9DbUADN1hXDHt?utm_source=generator&theme=0'
    }
  ];

  const categories = hubMode === 'english' ? englishCategories : bengaliCategories;
  const [activeCategoryId, setActiveCategoryId] = useState(hubMode === 'english' ? 'all_english' : 'all_bengali');
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState(englishCategories[0]?.embedUrl || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [iframeKey, setIframeKey] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSpotifyIframe, setShowSpotifyIframe] = useState(false);

  const currentCategory = categories.find((c) => c.id === activeCategoryId) || categories[0] || { tracks: [] };
  const tracksList = currentCategory?.tracks || [];

  // Open compact centered popup window for Spotify Login & Auto-Reload on Close
  const handleOpenLoginPopup = () => {
    const width = 480;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      'https://accounts.spotify.com/login',
      'SpotifyLoginPopup',
      `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0,location=0,resizable=yes`
    );

    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setIframeKey((prev) => prev + 1);
      }
    }, 800);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSelectCategory = (cat) => {
    setActiveCategoryId(cat.id);
    if (cat.embedUrl) {
      setCurrentEmbedUrl(cat.embedUrl);
    }
  };

  const handleSwitchMode = (mode) => {
    setHubMode(mode);
    if (mode === 'english') {
      setActiveCategoryId('all_english');
      setCurrentEmbedUrl(englishCategories[0]?.embedUrl || '');
    } else {
      setActiveCategoryId('all_bengali');
      setCurrentEmbedUrl(bengaliCategories[0]?.embedUrl || '');
    }
    setSearchQuery('');
  };

  const filteredTracks = tracksList.filter(
    (t) =>
      t?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t?.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackClick = (track) => {
    if (onPlayFullTrack) {
      onPlayFullTrack(track);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl transition-all duration-300 select-none overflow-hidden ${
        isOpen
          ? 'opacity-100 pointer-events-auto scale-100'
          : 'opacity-0 pointer-events-none scale-95'
      }`}
    >
      <div className="relative w-full max-w-5xl mx-auto h-full rounded-[32px] sm:rounded-[36px] liquid-glass-card p-3.5 sm:p-6 shadow-2xl overflow-hidden flex flex-col border border-white/15 box-border">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title="Close Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Clean Header with Login on the Right */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 pr-12 gap-3 min-w-0">
          {/* Left Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#1db954]/20 text-[#1db954] shadow-md border border-[#1db954]/30 flex-shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <div className="min-w-0">
              <h1 className="font-sans font-bold text-base sm:text-xl text-white tracking-tight truncate">
                Spotify Music Hub
              </h1>
              <p className="text-[10px] sm:text-xs text-[#fdf3e2]/60 font-medium truncate">
                110+ English Global Hits & 65 Bengali Durga Puja Classics
              </p>
            </div>
          </div>

          {/* Right: Login & Sync Button (Where it was originally!) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleManualRefresh}
              title="Sync Session"
              className={`p-2 rounded-xl liquid-glass-btn text-[#1db954] hover:text-white transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenLoginPopup}
              title="Spotify Login"
              className="px-3.5 py-1.5 rounded-xl bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        </div>

        {/* 2. Sleek Segmented Switcher & Search Bar */}
        <div className="my-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 w-full sm:w-auto box-border">
            <button
              onClick={() => handleSwitchMode('english')}
              className={`flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                hubMode === 'english'
                  ? 'bg-[#1db954] text-black shadow-md'
                  : 'text-[#fdf3e2]/70 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>English Hits ({(ENGLISH_TRACKS || []).length})</span>
            </button>

            <button
              onClick={() => handleSwitchMode('bengali')}
              className={`flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                hubMode === 'bengali'
                  ? 'bg-[#ffd873] text-black shadow-md'
                  : 'text-[#fdf3e2]/70 hover:text-white'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Bengali & Pujo ({TOTAL_TRACKS_COUNT})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder={`Search in ${currentCategory.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-white/5 border border-white/15 text-xs text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#1db954] transition-colors"
            />
          </div>
        </div>

        {/* 3. Category Filter Ribbon (Strictly inside boundaries) */}
        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 scrollbar-none w-full box-border">
          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'liquid-glass-btn border-[#1db954] text-[#1db954] bg-[#1db954]/20 shadow-sm font-bold'
                    : 'liquid-glass-btn border-transparent text-[#fdf3e2]/70 hover:text-[#fdf3e2]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-60 font-mono">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* 4. Expansive Song Grid (Safe horizontal padding so no cards are clipped) */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1 overflow-x-hidden w-full box-border">
          {filteredTracks.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#fdf3e2]/60">
              No tracks found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full box-border">
              {filteredTracks.map((track, idx) => {
                const isThisPlaying = currentPlayingTrackId === track.id && isPlaying;
                return (
                  <div
                    key={track.id + '_' + idx}
                    onClick={() => handleTrackClick(track)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border w-full box-border ${
                      isThisPlaying
                        ? 'liquid-glass-btn border-[#1db954] text-[#1db954] bg-[#1db954]/20 shadow-md'
                        : 'hover:bg-white/10 text-[#fdf3e2] border-transparent bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-11 h-10 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 border border-white/15 shadow-sm">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          {isThisPlaying ? (
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-0.5 bg-[#1db954] eq-bar-1"></span>
                              <span className="w-0.5 bg-[#1db954] eq-bar-2"></span>
                              <span className="w-0.5 bg-[#1db954] eq-bar-3"></span>
                            </div>
                          ) : (
                            <Play className="w-3 h-3 fill-current text-white/90" />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate">{track.title}</div>
                        <div className="text-[11px] text-[#fdf3e2]/60 truncate">{track.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                      <span className="text-xs font-mono text-[#fdf3e2]/60">{track.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Optional Embedded Spotify Web Player */}
        {showSpotifyIframe && (
          <div className="mt-2.5 w-full h-36 rounded-2xl overflow-hidden border border-[#1db954]/40 shadow-inner bg-black/60 animate-fadeIn">
            <iframe
              key={`${currentEmbedUrl}_${iframeKey}`}
              src={currentEmbedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Web Player"
              className="rounded-2xl"
            />
          </div>
        )}

        {/* 6. Footer Controls */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#fdf3e2]/75">
          <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{filteredTracks.length} tracks ready • Background play</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSpotifyIframe(!showSpotifyIframe)}
              className="text-[11px] text-[#ffd873] hover:underline cursor-pointer"
            >
              {showSpotifyIframe ? 'Hide Spotify Player' : 'Show Spotify Player'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full liquid-glass-btn text-[#ffd873] font-bold text-xs shadow-md cursor-pointer"
            >
              Close Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
