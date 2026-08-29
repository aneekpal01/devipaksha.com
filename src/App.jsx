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
import { PUJO_DAYS, PLAYLISTS_DATA } from './data/pujoData';
import { useLivePresence } from './utils/useLivePresence';

export const TIME_PHASES = ['dawn', 'day', 'sunset', 'evening', 'night'];

// Real-time 24-Hour Diurnal Phase Detector
export const getRealTimePhase = () => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  // 1. Dawn / ভোর: 4:00 AM — 6:59 AM (240 to 419 mins)
  if (minutes >= 240 && minutes < 420) return 'dawn';
  // 2. Day / সকাল ও দুপুর: 7:00 AM — 3:59 PM (420 to 959 mins)
  if (minutes >= 420 && minutes < 960) return 'day';
  // 3. Sunset (Golden Hour) / বিকেল ও গোধূলি: 4:00 PM — 6:29 PM (960 to 1109 mins)
  if (minutes >= 960 && minutes < 1110) return 'sunset';
  // 4. Evening (Aarti) / সন্ধ্যা ও মেলা: 6:30 PM — 10:29 PM (1110 to 1349 mins)
  if (minutes >= 1110 && minutes < 1350) return 'evening';
  // 5. Midnight / গভীর রাত ও পূর্ণিমা: 10:30 PM — 3:59 AM
  return 'night';
};

export default function App() {
  const [selectedDayKey, setSelectedDayKey] = useState('mahalaya');
  const [currentPlaylistKey, setCurrentPlaylistKey] = useState('durga_puja');

  // Real-time 5-Phase Time of Day Engine
  const [timePhase, setTimePhase] = useState(getRealTimePhase);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Auto-sync time phase with real clock every 30 seconds (if user hasn't manually overridden in session)
  useEffect(() => {
    const checkTime = () => {
      const manualOverride = sessionStorage.getItem('pujo_manual_phase_toggle');
      if (!manualOverride) {
        setTimePhase(getRealTimePhase());
      }
    };

    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Manual cycle through all 5 diurnal time phases on button click
  const handleCycleTimePhase = () => {
    setTimePhase((prev) => {
      const curIdx = TIME_PHASES.indexOf(prev);
      const nextPhase = TIME_PHASES[(curIdx + 1) % TIME_PHASES.length];
      sessionStorage.setItem('pujo_manual_phase_toggle', 'true');
      return nextPhase;
    });
  };

  const isNight = timePhase === 'evening' || timePhase === 'night' || timePhase === 'dawn';

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
    if (tracks.length === 0) return;
    const curIdx = tracks.findIndex((t) => t.id === currentTrack.id);
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
      if (nextIdx === curIdx && tracks.length > 1) {
        nextIdx = (curIdx + 1) % tracks.length;
      }
    } else {
      nextIdx = (curIdx + 1) % tracks.length;
    }
    setCurrentTrack(tracks[nextIdx]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const tracks = getActiveTracks();
    if (tracks.length === 0) return;
    const curIdx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (curIdx - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIdx]);
    setIsPlaying(true);
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
      {/* 1. Dynamic 5-Phase Time-of-Day Pandal Background */}
      <BackgroundStage timePhase={timePhase} isNight={isNight} />

      {/* 2. Top Bar with 5-Phase Celestial Switch & Floating Hub */}
      <TopBar
        timePhase={timePhase}
        isNight={isNight}
        onCycleTimePhase={handleCycleTimePhase}
        onlineCount={onlineCount}
        onOpenAdda={() => setIsAddaOpen(true)}
        onOpenGreeting={() => setIsGreetingOpen(true)}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenAboutMahalaya={() => setIsAboutMahalayaOpen(true)}
        onOpenSpotify={() => setIsSpotifyOpen(true)}
        onOpenAnjali={() => setIsAnjaliOpen(true)}
        onOpenPandalGuide={() => setIsPandalGuideOpen(true)}
      />

      {/* 3. Center Hero Stage: Bengali Title, Countdown, and Day Switcher */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-2 my-auto">
        <CountdownHeader selectedDayKey={selectedDayKey} />
        <DaySelectorDropdown
          currentPlaylistKey={currentPlaylistKey}
          onSelectPlaylist={handleSelectPlaylist}
          onOpenAboutMahalaya={() => setIsAboutMahalayaOpen(true)}
        />
      </main>

      {/* 4. Bottom Floating Music Player */}
      <footer className="relative z-30 pb-4 pt-1 px-4 w-full flex flex-col items-center">
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
    </div>
  );
}
