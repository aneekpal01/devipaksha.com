import React, { useState, useEffect } from 'react';
import { getCountdown, PUJO_DAYS } from '../data/pujoData';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CountdownHeader({ selectedDayKey }) {
  const selectedDay = PUJO_DAYS[selectedDayKey] || PUJO_DAYS.mahalaya;
  const [countdown, setCountdown] = useState(() => getCountdown(selectedDay.dateString));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(selectedDay.dateString));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDay]);

  const handleCelebrateClick = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.25 },
      colors: ['#ffd873', '#e8b64b', '#ff6b1a', '#ffffff', '#dc2626']
    });
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center pt-2 pb-1 text-center select-none px-3">
      {/* Iconic Bengali Headline: পুজো আসছে */}
      <h1
        onClick={handleCelebrateClick}
        title="Click for festive celebration!"
        className="font-bengali-title text-4xl sm:text-5xl md:text-6xl font-black text-[#ffd873] tracking-wide text-festive-glow drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] cursor-pointer hover:scale-103 transition-transform duration-300 active:scale-98"
      >
        পুজো আসছে
      </h1>

      {/* Clean subtitle: 41 days [12h : 49m : 40s] until Durga Pujo */}
      <div
        onClick={handleCelebrateClick}
        className="mt-1 flex items-center justify-center gap-1.5 cursor-pointer group"
      >
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold tracking-wide text-[#fdf3e2]/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {/* Days */}
          <span className="text-[#ffd873] font-bold text-sm sm:text-base tabular-nums">
            {countdown.days}
          </span>
          <span className="text-[#fdf3e2]/80">days</span>

          {/* Time tracker grouped in an Apple Liquid Glass capsule */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full liquid-glass-pill font-mono text-[10px] sm:text-xs mx-0.5">
            <span className="text-[#ffd873] tabular-nums font-bold">
              {String(countdown.hours).padStart(2, '0')}h
            </span>
            <span className="text-[#ffd873]/50">:</span>
            <span className="text-[#ffd873] tabular-nums font-bold">
              {String(countdown.minutes).padStart(2, '0')}m
            </span>
            <span className="text-[#ffd873]/50">:</span>
            <span className="text-[#ffd873] tabular-nums font-bold animate-pulse">
              {String(countdown.seconds).padStart(2, '0')}s
            </span>
          </div>

          {/* Clean 'until Durga Pujo' text with Cute Maa Durga Logo */}
          <span className="text-[#fdf3e2]/85 ml-0.5">
            until Durga Pujo
          </span>
          <img
            src="/durga-logo.png"
            alt="Maa Durga"
            className="w-4 h-4 object-contain inline-block ml-0.5 drop-shadow-[0_0_6px_rgba(255,216,115,0.7)]"
          />
        </div>
      </div>
    </div>
  );
}
