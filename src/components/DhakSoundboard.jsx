import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, Sparkles, Disc, Drum, Flame } from 'lucide-react';
import {
  playDhakDha,
  playDhakKring,
  playDhakTing,
  playKansor,
  playShankha,
  startRhythmLoop,
  stopRhythmLoop,
  RHYTHM_PATTERNS
} from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function DhakSoundboard({ isOpen, onClose }) {
  const [activePattern, setActivePattern] = useState('dhunuchi');
  const [isLooping, setIsLooping] = useState(false);
  const [bpm, setBpm] = useState(138);
  const [activePad, setActivePad] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'd') {
        triggerPad('dha');
      } else if (key === 'k') {
        triggerPad('kring');
      } else if (key === 't') {
        triggerPad('ting');
      } else if (key === 'g' || key === 'c') {
        triggerPad('kansor');
      } else if (key === 's') {
        triggerPad('shankha');
      } else if (key === ' ') {
        e.preventDefault();
        toggleLoop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLooping, activePattern, bpm]);

  // Clean up loop on modal close
  useEffect(() => {
    if (!isOpen) {
      stopRhythmLoop();
      setIsLooping(false);
    }
  }, [isOpen]);

  const triggerPad = (type) => {
    setActivePad(type);
    setTimeout(() => setActivePad(null), 150);

    if (type === 'dha') {
      playDhakDha(1.0);
    } else if (type === 'kring') {
      playDhakKring(1.0);
    } else if (type === 'ting') {
      playDhakTing(1.0);
    } else if (type === 'kansor') {
      playKansor(1.0);
    } else if (type === 'shankha') {
      playShankha();
    }
  };

  const toggleLoop = () => {
    if (isLooping) {
      stopRhythmLoop();
      setIsLooping(false);
    } else {
      setIsLooping(true);
      startRhythmLoop(activePattern, bpm, (step, hits) => {
        setCurrentStep(step);
        if (hits.length > 0) {
          setActivePad(hits[0]);
          setTimeout(() => setActivePad(null), 120);
        }
      });
      // Small celebratory festive sparkle
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#ffd873', '#ff6b1a', '#e8b64b']
      });
    }
  };

  const handlePatternChange = (patternKey) => {
    setActivePattern(patternKey);
    const newBpm = RHYTHM_PATTERNS[patternKey].bpm;
    setBpm(newBpm);

    if (isLooping) {
      startRhythmLoop(patternKey, newBpm, (step, hits) => {
        setCurrentStep(step);
        if (hits.length > 0) {
          setActivePad(hits[0]);
          setTimeout(() => setActivePad(null), 120);
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl h-full max-h-[92vh] rounded-[36px] liquid-glass-card p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-[#ffd873] shadow-md border border-amber-500/40">
              <Drum className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bengali-title text-xl sm:text-2xl font-bold text-[#ffd873]">
                পূজোর ঢাক ও কাঁসর
              </h2>
              <p className="text-xs text-[#fdf3e2]/70 font-medium">
                Interactive Dhak Soundboard & Dhunuchi Naach Rhythms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Animated Dhak Drum Centerpiece */}
        <div className="relative my-4 flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-b from-[#2a140d]/90 to-[#120704]/90 border border-[#e8b64b]/30 shadow-inner">
          {/* Feather Plumes (ঢাকের বকের পালক) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-90">
            <span className="w-3 h-7 bg-white/90 rounded-full rotate-[-25deg] shadow-sm"></span>
            <span className="w-3.5 h-9 bg-white rounded-full rotate-[-10deg] shadow-md"></span>
            <span className="w-4 h-10 bg-amber-100 rounded-full shadow-lg"></span>
            <span className="w-3.5 h-9 bg-white rounded-full rotate-[10deg] shadow-md"></span>
            <span className="w-3 h-7 bg-white/90 rounded-full rotate-[25deg] shadow-sm"></span>
          </div>

          {/* Dhak Drum Body */}
          <div
            className={`relative w-48 sm:w-56 h-28 sm:h-32 rounded-3xl bg-gradient-to-r from-[#6b2512] via-[#8c3218] to-[#4e1b0d] border-4 border-[#ffd873]/60 shadow-[0_8px_28px_rgba(0,0,0,0.8)] flex items-center justify-between px-3 transition-transform ${
              activePad ? 'scale-103' : ''
            }`}
          >
            {/* Left drumhead: Dha */}
            <button
              onClick={() => triggerPad('dha')}
              className={`w-14 sm:w-16 h-20 sm:h-24 rounded-2xl bg-[#e5cfb3] border-2 border-[#592b15] shadow-inner flex flex-col items-center justify-center cursor-pointer transition-all ${
                activePad === 'dha'
                  ? 'bg-[#ffd873] scale-105 shadow-[0_0_15px_rgba(255,216,115,0.8)]'
                  : 'hover:brightness-110 active:scale-95'
              }`}
            >
              <span className="font-bengali font-black text-lg sm:text-xl text-[#3b1708]">
                ধা
              </span>
              <span className="text-[9px] font-bold text-[#592b15]/80 uppercase">
                [Key D]
              </span>
            </button>

            {/* Middle cords & tension ropes */}
            <div className="flex flex-col items-center justify-center gap-1.5 flex-1 px-2">
              <div className="w-full h-0.5 bg-[#ffd873]/40"></div>
              <div className="w-full h-0.5 bg-[#ffd873]/60"></div>
              <div className="text-[10px] font-mono tracking-widest text-[#ffd873] font-bold">
                {isLooping ? 'RHYTHM ON' : 'DHAK'}
              </div>
              <div className="w-full h-0.5 bg-[#ffd873]/60"></div>
              <div className="w-full h-0.5 bg-[#ffd873]/40"></div>
            </div>

            {/* Right drumhead: Kring */}
            <button
              onClick={() => triggerPad('kring')}
              className={`w-14 sm:w-16 h-20 sm:h-24 rounded-2xl bg-[#e5cfb3] border-2 border-[#592b15] shadow-inner flex flex-col items-center justify-center cursor-pointer transition-all ${
                activePad === 'kring'
                  ? 'bg-[#ffd873] scale-105 shadow-[0_0_15px_rgba(255,216,115,0.8)]'
                  : 'hover:brightness-110 active:scale-95'
              }`}
            >
              <span className="font-bengali font-black text-lg sm:text-xl text-[#3b1708]">
                ক্রিং
              </span>
              <span className="text-[9px] font-bold text-[#592b15]/80 uppercase">
                [Key K]
              </span>
            </button>
          </div>
        </div>

        {/* 5 Instrument Tap Pads */}
        <div className="grid grid-cols-5 gap-2 my-3">
          <button
            onClick={() => triggerPad('dha')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
              activePad === 'dha'
                ? 'bg-[#ffd873]/30 border-[#ffd873] text-[#ffd873] scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#fdf3e2]'
            }`}
          >
            <span className="font-bengali font-bold text-base">ধা</span>
            <span className="text-[9px] text-[#fdf3e2]/60 uppercase">Dha (D)</span>
          </button>

          <button
            onClick={() => triggerPad('kring')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
              activePad === 'kring'
                ? 'bg-[#ffd873]/30 border-[#ffd873] text-[#ffd873] scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#fdf3e2]'
            }`}
          >
            <span className="font-bengali font-bold text-base">ক্রিং</span>
            <span className="text-[9px] text-[#fdf3e2]/60 uppercase">Kring (K)</span>
          </button>

          <button
            onClick={() => triggerPad('ting')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
              activePad === 'ting'
                ? 'bg-[#ffd873]/30 border-[#ffd873] text-[#ffd873] scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#fdf3e2]'
            }`}
          >
            <span className="font-bengali font-bold text-base">তিং</span>
            <span className="text-[9px] text-[#fdf3e2]/60 uppercase">Ting (T)</span>
          </button>

          <button
            onClick={() => triggerPad('kansor')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
              activePad === 'kansor'
                ? 'bg-[#ffd873]/30 border-[#ffd873] text-[#ffd873] scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#fdf3e2]'
            }`}
          >
            <span className="font-bengali font-bold text-base">কাঁসর</span>
            <span className="text-[9px] text-[#fdf3e2]/60 uppercase">Gong (G)</span>
          </button>

          <button
            onClick={() => triggerPad('shankha')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
              activePad === 'shankha'
                ? 'bg-[#ffd873]/30 border-[#ffd873] text-[#ffd873] scale-105'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#fdf3e2]'
            }`}
          >
            <span className="font-bengali font-bold text-base">শঙ্খ</span>
            <span className="text-[9px] text-[#fdf3e2]/60 uppercase">Conch (S)</span>
          </button>
        </div>

        {/* Auto Rhythm Generator Section */}
        <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-[#e8b64b]/20">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffd873] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#ff6b1a]" />
              Auto Rhythm Machine
            </span>

            <button
              onClick={toggleLoop}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all ${
                isLooping
                  ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                  : 'bg-gradient-to-r from-[#ffd873] to-[#e8b64b] text-[#1a0e08] hover:brightness-110'
              }`}
            >
              {isLooping ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Beat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Loop</span>
                </>
              )}
            </button>
          </div>

          {/* Rhythm Presets */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.entries(RHYTHM_PATTERNS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handlePatternChange(key)}
                className={`px-2.5 py-2 rounded-xl text-left border transition-all ${
                  activePattern === key
                    ? 'bg-[#e8b64b]/25 border-[#ffd873] text-[#ffd873] shadow-md'
                    : 'bg-white/5 border-transparent hover:bg-white/10 text-[#fdf3e2]/75'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{config.name}</div>
                <div className="text-[9px] text-[#fdf3e2]/50">{config.bpm} BPM</div>
              </button>
            ))}
          </div>

          {/* Tempo (BPM) Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold text-[#fdf3e2]/70 w-16">
              Tempo: {bpm}
            </span>
            <input
              type="range"
              min="90"
              max="200"
              value={bpm}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setBpm(val);
                if (isLooping) {
                  startRhythmLoop(activePattern, val, (step, hits) => {
                    setCurrentStep(step);
                  });
                }
              }}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
