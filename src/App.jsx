import React, { useState } from 'react';
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

export default function App() {
  const [selectedDayKey, setSelectedDayKey] = useState('mahalaya');
  const [currentPlaylistKey, setCurrentPlaylistKey] = useState('durga_puja');
  const [isNight, setIsNight] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

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
      {/* 1. Background Pandal Art & Interactive Particle Engine */}
      <BackgroundStage isNight={isNight} />

      {/* 2. Top Bar (🟢 100% Real Live Online, Pushpanjali, Pandal Guide, Spotify, Adda, About Mahalaya) */}
      <TopBar
        isNight={isNight}
        setIsNight={setIsNight}
        onlineCount={onlineCount}
        onOpenAdda={() => setIsAddaOpen(true)}
        onOpenGreeting={() => setIsGreetingOpen(true)}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenAboutMahalaya={() => setIsAboutMahalayaOpen(true)}
        onOpenSpotify={() => setIsSpotifyOpen(true)}
        onOpenAnjali={() => setIsAnjaliOpen(true)}
        onOpenPandalGuide={() => setIsPandalGuideOpen(true)}
      />

      {/* 3. Center Section: Bengali Header & Clean Unobstructed Pandal Stage */}
      <main className="relative z-20 flex flex-col items-center justify-start flex-1 w-full max-w-lg mx-auto pointer-events-auto pt-1">
        <CountdownHeader
          selectedDayKey={selectedDayKey}
        />
      </main>

      {/* 4. Bottom Controls Section: Day Selector Pill + Floating Glassmorphic Music Player */}
      <div className="relative z-30 flex flex-col items-center w-full max-w-lg mx-auto">
        {/* The Exact Pill: ≡ MAHALAYA ⌵ / ≡ DURGA ⌵ */}
        <div className="mb-2">
          <DaySelectorDropdown
            currentPlaylistKey={currentPlaylistKey}
            onSelectPlaylist={handleSelectPlaylist}
            onOpenAboutMahalaya={() => setIsAboutMahalayaOpen(true)}
          />
        </div>

        {/* Pixel-Perfect Glassmorphic Player */}
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onOpenDhak={() => setIsDhakOpen(true)}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          isShuffle={isShuffle}
          setIsShuffle={setIsShuffle}
          isRepeat={isRepeat}
          setIsRepeat={setIsRepeat}
        />
      </div>

      {/* Modals & Interactive Overlays */}
      <DhakSoundboard
        isOpen={isDhakOpen}
        onClose={() => setIsDhakOpen(false)}
      />

      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentPlaylistKey={currentPlaylistKey}
        onSelectPlaylist={handleSelectPlaylist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
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
        currentPlayingTrackId={currentTrack?.id}
        isPlaying={isPlaying}
      />

      <PujoGreetingModal
        isOpen={isGreetingOpen}
        onClose={() => setIsGreetingOpen(false)}
      />

      <ChaiAddaModal
        isOpen={isAddaOpen}
        onClose={() => setIsAddaOpen(false)}
        messages={messages}
        chaiCount={chaiCount}
        onSendMessage={sendMessage}
        onBuyChai={buyChai}
        tabSenderId={tabSenderId}
      />

      {/* 🌺 Virtual Pushpanjali & Sacred Conch Modal */}
      <VirtualAnjaliModal
        isOpen={isAnjaliOpen}
        onClose={() => setIsAnjaliOpen(false)}
      />

      {/* 🏛️ Kolkata Iconic Pandal Parikrama Guide Modal */}
      <PandalGuideModal
        isOpen={isPandalGuideOpen}
        onClose={() => setIsPandalGuideOpen(false)}
      />
    </div>
  );
}
