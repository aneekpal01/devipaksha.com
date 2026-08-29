import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Drum } from 'lucide-react';
import { playDhakDha, playDhakKring, playKansor } from '../utils/audioEngine';

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  setIsPlaying,
  onNext,
  onNextTrack,
  onPrev,
  onPrevTrack,
  onOpenDhak,
  onOpenPlaylist,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const ytPlayerInstance = useRef(null);
  const isPlayerReady = useRef(false);
  const prevTrackId = useRef(currentTrack?.id);
  const lastEndedTrackId = useRef(null);
  const isInitialMount = useRef(true);

  // Normalize callbacks
  const nextCallback = onNextTrack || onNext;
  const prevCallback = onPrevTrack || onPrev;

  // Fresh refs to prevent closure staleness
  const onNextRef = useRef(nextCallback);
  const onPrevRef = useRef(prevCallback);
  const isRepeatRef = useRef(isRepeat);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    onNextRef.current = nextCallback;
    onPrevRef.current = prevCallback;
    isRepeatRef.current = isRepeat;
    isPlayingRef.current = isPlaying;
  });

  // Initialize YouTube Iframe Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !ytPlayerInstance.current) {
        ytPlayerInstance.current = new window.YT.Player('yt-audio-host', {
          height: '100',
          width: '100',
          videoId: currentTrack?.id || 'xlElO06nQy8',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              isPlayerReady.current = true;
              if (isPlayingRef.current) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING, 5 = CUED, -1 = UNSTARTED
              if (event.data === 1) {
                setIsPlaying(true);
                lastEndedTrackId.current = null;
                const dur = ytPlayerInstance.current?.getDuration();
                if (dur && dur > 0) setDuration(dur);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                if (isRepeatRef.current) {
                  ytPlayerInstance.current?.seekTo(0);
                  ytPlayerInstance.current?.playVideo();
                } else {
                  if (onNextRef.current) {
                    onNextRef.current();
                  }
                }
              }
            },
            onError: (err) => {
              console.warn('YouTube playback notice, advancing to next song:', err);
              if (isPlayingRef.current && onNextRef.current) {
                setTimeout(() => onNextRef.current(), 400);
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, []);

  // Handle song change & respect autoplay only after initial mount
  useEffect(() => {
    if (!currentTrack || !currentTrack.id) return;

    if (prevTrackId.current !== currentTrack.id) {
      prevTrackId.current = currentTrack.id;
      setCurrentTime(0);
      lastEndedTrackId.current = null;

      // If this is the initial load, do not auto-play
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      setIsPlaying(true);

      if (ytPlayerInstance.current && isPlayerReady.current) {
        if (typeof ytPlayerInstance.current.loadVideoById === 'function') {
          ytPlayerInstance.current.loadVideoById({
            videoId: currentTrack.id,
            startSeconds: 0
          });
          ytPlayerInstance.current.playVideo();
          setTimeout(() => {
            if (ytPlayerInstance.current && typeof ytPlayerInstance.current.playVideo === 'function') {
              ytPlayerInstance.current.playVideo();
            }
          }, 350);
        }
      }
    } else {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
    }
  }, [currentTrack]);

  // Track progress timer & fallback auto-next trigger
  useEffect(() => {
    const interval = setInterval(() => {
      if (ytPlayerInstance.current && isPlayerReady.current && isPlaying) {
        try {
          const cur = ytPlayerInstance.current.getCurrentTime();
          const dur = ytPlayerInstance.current.getDuration();
          if (cur !== undefined && !isNaN(cur)) setCurrentTime(Math.floor(cur));
          if (dur !== undefined && !isNaN(dur) && dur > 0) setDuration(Math.floor(dur));

          if (dur && dur > 5 && cur >= (dur - 0.9)) {
            if (lastEndedTrackId.current !== currentTrack?.id) {
              lastEndedTrackId.current = currentTrack?.id;
              if (isRepeatRef.current) {
                ytPlayerInstance.current.seekTo(0);
                ytPlayerInstance.current.playVideo();
              } else {
                if (onNextRef.current) onNextRef.current();
              }
            }
          }
        } catch (e) {}
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (ytPlayerInstance.current && isPlayerReady.current) {
        if (typeof ytPlayerInstance.current.playVideo === 'function') {
          ytPlayerInstance.current.playVideo();
        }
      }
    } else {
      setIsPlaying(false);
      if (ytPlayerInstance.current && isPlayerReady.current) {
        if (typeof ytPlayerInstance.current.pauseVideo === 'function') {
          ytPlayerInstance.current.pauseVideo();
        }
      }
    }
  };

  const handleNextClick = () => {
    if (nextCallback) {
      nextCallback();
    }
  };

  const handlePrevClick = () => {
    if (prevCallback) {
      prevCallback();
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (ytPlayerInstance.current && isPlayerReady.current) {
      if (typeof ytPlayerInstance.current.seekTo === 'function') {
        ytPlayerInstance.current.seekTo(newTime, true);
      }
    }
  };

  const handleDhakQuickTrigger = () => {
    playDhakDha(1.0);
    setTimeout(() => playDhakKring(1.0), 120);
    setTimeout(() => playKansor(0.9), 200);
    setTimeout(() => playDhakDha(1.0), 300);
    onOpenDhak();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const trackThumbnail = currentTrack?.thumbnail || (currentTrack?.id ? `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg` : null);
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div className="relative z-30 w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-4 pb-2 sm:pb-3 select-none">
      {/* Active YouTube Iframe Audio Host */}
      <div
        style={{
          position: 'fixed',
          bottom: '0px',
          right: '0px',
          width: '120px',
          height: '80px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1
        }}
      >
        <div id="yt-audio-host" />
      </div>

      {/* Sleek, Thin, Compact Liquid Glass Music Player Card */}
      <div className="liquid-glass-card rounded-[24px] p-2.5 sm:p-3 border border-white/20 shadow-2xl backdrop-blur-2xl">
        {/* Top Info & Play Controls Row */}
        <div className="flex items-center gap-2.5">
          {/* Song Thumbnail */}
          <div
            onClick={onOpenPlaylist}
            title="Click to view all songs"
            className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl p-0.5 flex items-center justify-center liquid-glass-btn border-white/30 shadow-md cursor-pointer group overflow-hidden"
          >
            {trackThumbnail ? (
              <img
                src={trackThumbnail}
                alt={currentTrack?.title || 'Song Cover'}
                className={`w-full h-full object-cover rounded-[10px] transition-transform duration-300 ${
                  isPlaying ? 'scale-105 filter brightness-105' : 'group-hover:scale-105'
                }`}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl">🪔</span>
              </div>
            )}

            {/* Soundwave equalizer indicator */}
            {isPlaying && (
              <div className="absolute bottom-0.5 right-0.5 flex items-end gap-0.5 h-2.5 px-1 rounded bg-black/70 backdrop-blur-md">
                <span className="w-0.5 bg-[#ffd873] eq-bar-1"></span>
                <span className="w-0.5 bg-[#ffd873] eq-bar-2"></span>
                <span className="w-0.5 bg-[#ffd873] eq-bar-3"></span>
              </div>
            )}
          </div>

          {/* Title & Artist */}
          <div
            onClick={onOpenPlaylist}
            className="flex-1 min-w-0 cursor-pointer group"
          >
            <h3 className="text-xs sm:text-sm font-bold text-[#fdf3e2] truncate group-hover:text-[#ffd873] transition-colors leading-tight">
              {currentTrack?.title || 'Dugga Elo'}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#fdf3e2]/70 truncate font-medium mt-0.5">
              {currentTrack?.artist || 'Bengali Pujo Hit'}
            </p>
          </div>

          {/* Transport Controls: Previous, Compact White Play Button, Next */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button
              onClick={handlePrevClick}
              title="Previous Track"
              className="p-1 text-[#fdf3e2]/80 hover:text-[#ffd873] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>

            {/* Compact White Circular Play/Pause Button */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-white via-white/95 to-slate-100 text-[#1a0e08] shadow-[0_6px_18px_rgba(255,255,255,0.22),0_3px_12px_rgba(0,0,0,0.5)] border border-white hover:scale-106 active:scale-94 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-[#120805]" />
              ) : (
                <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-[#120805] ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextClick}
              title="Next Track"
              className="p-1 text-[#fdf3e2]/80 hover:text-[#ffd873] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Compact Dynamic Golden Filled Progress Bar */}
        <div className="mt-2 w-full">
          <div className="relative flex items-center h-3 group cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              style={{
                background: `linear-gradient(to right, #ffd873 0%, #f59e0b ${progressPercent}%, rgba(255, 255, 255, 0.18) ${progressPercent}%, rgba(255, 255, 255, 0.18) 100%)`
              }}
              className="w-full cursor-pointer transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#fdf3e2]/75 mt-0.5 px-0.5">
            <span className="text-[#ffd873] font-bold tabular-nums">
              {formatTime(currentTime)}
            </span>
            <span className="text-[#fdf3e2]/60 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Compact Bottom Action Controls */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10 text-[11px] text-[#fdf3e2]/85">
          <button
            onClick={() => {
              if (!isShuffle) {
                setIsShuffle(true);
                setIsRepeat(false);
              } else {
                setIsShuffle(false);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-btn transition-all cursor-pointer ${
              isShuffle
                ? 'border-[#ffd873] text-[#ffd873] font-bold bg-[#ffd873]/20 shadow-[0_0_10px_rgba(255,216,115,0.3)]'
                : 'text-[#fdf3e2]/75 hover:text-[#ffd873]'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={() => {
              if (!isRepeat) {
                setIsRepeat(true);
                setIsShuffle(false);
              } else {
                setIsRepeat(false);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-btn transition-all cursor-pointer ${
              isRepeat
                ? 'border-[#ffd873] text-[#ffd873] font-bold bg-[#ffd873]/20 shadow-[0_0_10px_rgba(255,216,115,0.3)]'
                : 'text-[#fdf3e2]/75 hover:text-[#ffd873]'
            }`}
          >
            <Repeat className="w-3 h-3" />
            <span>Repeat</span>
          </button>

          {/* '🎵 Dhak' Button */}
          <button
            onClick={handleDhakQuickTrigger}
            title="Play Dhak rhythm & open soundboard"
            className="flex items-center gap-1 px-3 py-1 rounded-full liquid-glass-btn border-[#ffd873]/50 text-[#ffd873] font-bold shadow-[0_0_12px_rgba(255,216,115,0.25)] hover:border-[#ffd873] cursor-pointer"
          >
            <Drum className="w-3 h-3 text-[#ffd873]" />
            <span>🎵 Dhak</span>
          </button>
        </div>
      </div>
    </div>
  );
}
