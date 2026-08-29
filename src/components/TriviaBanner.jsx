import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, BookOpen } from 'lucide-react';
import { PUJO_DAYS } from '../data/pujoData';

export default function TriviaBanner({ selectedDayKey }) {
  const currentDay = PUJO_DAYS[selectedDayKey] || PUJO_DAYS.mahalaya;
  const [factIndex, setFactIndex] = useState(0);

  // Rotate trivia facts periodically
  useEffect(() => {
    setFactIndex(0);
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % currentDay.facts.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [selectedDayKey, currentDay]);

  const nextFact = () => {
    setFactIndex((prev) => (prev + 1) % currentDay.facts.length);
  };

  return (
    <div
      onClick={nextFact}
      title="Click to view next Durga Puja fact"
      className="relative z-20 w-full max-w-md mx-auto px-4 mb-2 select-none cursor-pointer group"
    >
      <div className="glass-panel bg-[#1a0e08]/70 hover:bg-[#25150c]/85 rounded-2xl p-3 border border-[#e8b64b]/25 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#ffd873]">
            <Sparkles className="w-3 h-3 text-[#ffd873]" />
            <span>Did You Know? • {currentDay.english}</span>
          </div>

          <div className="flex items-center gap-1">
            {currentDay.facts.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  factIndex === idx ? 'bg-[#ffd873] scale-125' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-[#fdf3e2]/90 leading-relaxed font-medium">
          {currentDay.facts[factIndex]}
        </p>
      </div>
    </div>
  );
}
