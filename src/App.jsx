import React, { useState, useEffect } from 'react';
import BackgroundStage from './components/BackgroundStage';
import TopBar from './components/TopBar';
import CountdownHeader from './components/CountdownHeader';
import DaySelectorDropdown from './components/DaySelectorDropdown';
import MusicPlayer from './components/MusicPlayer';
import DhakSoundboard from './components/DhakSoundboard';
import PlaylistModal from './components/PlaylistModal';
import PujoGreetingModal from './components/PujoGreetingModal';
import ChaiAddaModal from './components/ChaiAddaModal';
import MahalayaAboutModal from './components/MahalayaAboutModal';
import SpotifyPlayerModal from './components/SpotifyPlayerModal';
import VirtualAnjaliModal from './components/VirtualAnjaliModal';
import PandalGuideModal from './components/PandalGuideModal';
import CreatorsModal from './components/CreatorsModal';
import BuyChaiModal from './components/BuyChaiModal';
import { PUJO_DAYS, PLAYLISTS_DATA } from './data/pujoData';
import { useLivePresence } from './utils/useLivePresence';

export default function App() {
  const [selectedDayKey, setSelectedDayKey] = useState('shashthi');
  const [currentPlaylistKey, setCurrentPlaylistKey] = useState('durga_puja');

  // Automatic Real-Time Day & Night Engine (6 AM to 6 PM is Day, 6 PM to 6 AM is Night)
  const getInitialIsNight = () => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  };

  const [isNight, setIsNight] = useState(getInitialIsNight);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Auto-sync Day & Night with real local clock every minute (if not manually overridden)
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const autoNight = hour < 6 || hour >= 18;
      const manualOverride = sessionStorage.getItem('pujo_manual_theme_toggle');
      if (!manualOverride) {
        setIsNight(autoNight);
      }
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleNight = () => {
    setIsNight((prev) => {
      const next = !prev;
      sessionStorage.setItem('pujo_manual_theme_toggle', 'true');
      return next;
    });
  };

  // 100% Real live presence and live community chat hook
  const { onlineCount, messages, chaiCount, sendMessage, buyChai, tabSenderId } = useLivePresence();

  // Modals state
  const [isDhakOpen, setIsDhakOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isGreetingOpen, setIsGreetingOpen] = useState(false);
  const [isAddaOpen, setIsAddaOpen] = useState(false);
  const [isAboutMahalayaOpen, setIsAboutMahalayaOpen] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isAnjaliOpen, setIsAnjaliOpen] = useState(false);
  const [isPandalGuideOpen, setIsPandalGuideOpen] = useState(false);
  const [isCreatorsOpen, setIsCreatorsOpen] = useState(false);
  const [isBuyChaiOpen, setIsBuyChaiOpen] = useState(false);

  // Current track state
  const [currentTrack, setCurrentTrack] = useState(
    PLAYLISTS_DATA.durga_puja.tracks[0] || {
      id: 'xlElO06nQy8',
      title: 'Dugga Elo (দুগ্গা এলো)',
      artist: 'Monali Thakur',
      duration: '3:52'
    }
  );

  // When playlist category changes (Durga Puja, Mahalaya, Dhak/Ambience)
  const handleSelectPlaylist = (playlistKey) => {
    setCurrentPlaylistKey(playlistKey);
    const pl = PLAYLISTS_DATA[playlistKey];
    if (pl && pl.tracks.length > 0) {
      setCurrentTrack(pl.tracks[0]);
      setIsPlaying(true);
    }
  };

  // Get current active track list
  const getActiveTracks = () => {
    const pl = PLAYLISTS_DATA[currentPlaylistKey] || PLAYLISTS_DATA.durga_puja;
    return pl.tracks || [];
  };

  const handleNextTrack = () => {
    const tracks = getActiveTracks();
    if (!tracks || tracks.length === 0) return;
    const curIdx = tracks.findIndex((t) => t.id === currentTrack?.id);
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
      if (nextIdx === curIdx && tracks.length > 1) {
        nextIdx = (curIdx + 1) % tracks.length;
      }
    } else {
      if (curIdx === -1 || curIdx >= tracks.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = curIdx + 1;
      }
    }
    const targetTrack = tracks[nextIdx];
    if (targetTrack) {
      setCurrentTrack(targetTrack);
      setIsPlaying(true);
    }
  };

  const handlePrevTrack = () => {
    const tracks = getActiveTracks();
    if (!tracks || tracks.length === 0) return;
    const curIdx = tracks.findIndex((t) => t.id === currentTrack?.id);
    let prevIdx;
    if (curIdx <= 0) {
      prevIdx = tracks.length - 1;
    } else {
      prevIdx = curIdx - 1;
    }
    const targetTrack = tracks[prevIdx];
    if (targetTrack) {
      setCurrentTrack(targetTrack);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track, playlistKey) => {
    if (playlistKey) setCurrentPlaylistKey(playlistKey);
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsPlaylistOpen(false);
  };

  const handlePlaySpotifyFullTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayMahalayaDirectly = () => {
    setCurrentPlaylistKey('mahalaya');
    const mahalayaTrack = PLAYLISTS_DATA.mahalaya.tracks[0];
    if (mahalayaTrack) {
      setCurrentTrack(mahalayaTrack);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-[#fdf3e2]">
      {/* 1. Day & Night Background Stage */}
      <BackgroundStage isNight={isNight} />

      {/* 2. Top Bar with Day/Night Switch & Floating Hub */}
      <TopBar
        isNight={isNight}
        setIsNight={handleToggleNight}
        onlineCount={onlineCount}
        onOpenAdda={() => setIsAddaOpen(true)}
        onOpenGreeting={() => setIsGreetingOpen(true)}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenAboutMahalaya={() => setIsAboutMahalayaOpen(true)}
        onOpenSpotify={() => setIsSpotifyOpen(true)}
        onOpenAnjali={() => setIsAnjaliOpen(true)}
        onOpenPandalGuide={() => setIsPandalGuideOpen(true)}
        onOpenCreators={() => setIsCreatorsOpen(true)}
        onOpenBuyChai={() => setIsBuyChaiOpen(true)}
      />

      {/* 3. Hero Top Section: Big Bengali Title & Countdown Subtitle (Moved lower for perfect sky framing) */}
      <section className="relative z-20 w-full flex flex-col items-center justify-start px-4 pt-16 sm:pt-22 md:pt-26">
        <CountdownHeader selectedDayKey={selectedDayKey} />
      </section>

      {/* Middle open spacer allowing full view of Maa Durga idol in the pandal */}
      <div className="flex-1 min-h-[40px]" />

      {/* 4. Bottom Section: Day/Playlist Dropdown Capsule & Floating Music Player */}
      <footer className="relative z-30 pb-4 pt-1 px-4 w-full flex flex-col items-center">
        <div className="mb-2 sm:mb-3">
          <DaySelectorDropdown
            currentPlaylistKey={currentPlaylistKey}
            onOpenPlaylist={() => setIsPlaylistOpen(true)}
          />
        </div>

        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          isShuffle={isShuffle}
          setIsShuffle={setIsShuffle}
          isRepeat={isRepeat}
          setIsRepeat={setIsRepeat}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          onOpenDhak={() => setIsDhakOpen(true)}
        />
      </footer>

      {/* 5. Modals & Dialogs */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentPlaylistKey={currentPlaylistKey}
        onSelectPlaylist={handleSelectPlaylist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
      />

      <DhakSoundboard
        isOpen={isDhakOpen}
        onClose={() => setIsDhakOpen(false)}
      />

      <PujoGreetingModal
        isOpen={isGreetingOpen}
        onClose={() => setIsGreetingOpen(false)}
      />

      <ChaiAddaModal
        isOpen={isAddaOpen}
        onClose={() => setIsAddaOpen(false)}
        messages={messages}
        onSendMessage={sendMessage}
        chaiCount={chaiCount}
        onBuyChai={buyChai}
        mySenderId={tabSenderId}
        onlineCount={onlineCount}
      />

      <MahalayaAboutModal
        isOpen={isAboutMahalayaOpen}
        onClose={() => setIsAboutMahalayaOpen(false)}
        onPlayMahalaya={handlePlayMahalayaDirectly}
      />

      <SpotifyPlayerModal
        isOpen={isSpotifyOpen}
        onClose={() => setIsSpotifyOpen(false)}
        onPlayFullTrack={handlePlaySpotifyFullTrack}
      />

      <VirtualAnjaliModal
        isOpen={isAnjaliOpen}
        onClose={() => setIsAnjaliOpen(false)}
      />

      <PandalGuideModal
        isOpen={isPandalGuideOpen}
        onClose={() => setIsPandalGuideOpen(false)}
      />

      <CreatorsModal
        isOpen={isCreatorsOpen}
        onClose={() => setIsCreatorsOpen(false)}
      />

      <BuyChaiModal
        isOpen={isBuyChaiOpen}
        onClose={() => setIsBuyChaiOpen(false)}
      />
    </div>
  );
}
