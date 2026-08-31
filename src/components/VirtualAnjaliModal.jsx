import React, { useState, useEffect } from 'react';
import { X, Sparkles, Award, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const FLOWERS = [
  {
    id: 'jaba',
    name: 'রক্তজবা (Red Hibiscus)',
    desc: 'মা দুর্গার পরম প্রিয় লাল রক্তজবা ফুল',
    emoji: '🌺',
    colors: ['#ef4444', '#dc2626', '#b91c1c', '#ffd873']
  },
  {
    id: 'belpata',
    name: 'বিল্বপত্র ও চন্দন (Bel Pata)',
    desc: 'পবিত্র চন্দন লেপিত ত্রিদল বেলপাতা',
    emoji: '🍃',
    colors: ['#10b981', '#059669', '#34d399', '#fef08a']
  },
  {
    id: 'aparajita',
    name: 'অপরাজিতা ও শিউলি (Shiuli)',
    desc: 'নীল অপরাজিতা ও শরৎকালের সুবাসিত শিউলি',
    emoji: '🌼',
    colors: ['#3b82f6', '#1d4ed8', '#ffffff', '#fb923c']
  },
  {
    id: 'arati',
    name: 'ধূপ ও পঞ্চপ্রদীপ (Arati Deepam)',
    desc: 'সুগন্ধি ধূপ ও ঘৃতপ্রদীপের সন্ধ্যারতি',
    emoji: '🪔',
    colors: ['#f59e0b', '#d97706', '#fbbf24', '#ef4444']
  }
];

const MANTRAS = [
  {
    phase: 'প্রথম অঞ্জলি (1ST ANJALI MANTRA)',
    sanskrit: 'ওঁ মহিষঘ্নি মহামায়ে চামুণ্ডে মুণ্ডমালিনী। আয়ুরারোগ্য বিজয়ং দেহি দেবি নমোঽস্তুতে॥',
    phonetic: 'Om Mahishaghni Mahamaye Chamunde Mundamalini / Ayurarogyam Vijayang Dehi Devi Namostute',
    meaning: 'হে মহিষাসুরমর্দিনী, হে মহামায়া, তুমি আমাদের দীর্ঘায়ু, আরোগ্য ও বিজয় দান করো।'
  },
  {
    phase: 'দ্বিতীয় অঞ্জলি (2ND ANJALI MANTRA)',
    sanskrit: 'ওঁ সর্বমঙ্গল মঙ্গল্যে শিবে সর্বার্থ সাধিকে। শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তুতে॥',
    phonetic: 'Om Sarva Mangala Mangalye Shive Sarvartha Sadhike / Sharanye Tryambake Gauri Narayani Namostute',
    meaning: 'হে সর্বমঙ্গলা, সর্বার্থসাধিকা, শরণদাত্রী গৌরী নারায়ণী, তোমাকে প্রণাম জানাই।'
  },
  {
    phase: 'প্রণাম মন্ত্র (FINAL PRANAM MANTRA)',
    sanskrit: 'ওঁ জয়ন্তী মঙ্গলা কালী ভদ্রকালী কপালিনী। দুর্গা শিবা ক্ষমা ধাত্রী স্বাহা স্বধা নমোঽস্তুতে॥',
    phonetic: 'Om Jayanti Mangala Kali Bhadrakali Kapalini / Durga Shiva Kshama Dhatri Swaha Swadha Namostute',
    meaning: 'হে জয়দাত্রী, মঙ্গলা, দুর্গা, ধাত্রী — হে জগন্মাতা, তোমার চরণে ভক্তিপূর্ণ প্রণাম।'
  }
];

export default function VirtualAnjaliModal({ isOpen, onClose }) {
  const [selectedFlower, setSelectedFlower] = useState(FLOWERS[0]);
  const [currentMantraIdx, setCurrentMantraIdx] = useState(0);
  const [isOffering, setIsOffering] = useState(false);
  const [anjaliCount, setAnjaliCount] = useState(() => {
    const saved = localStorage.getItem('pujo_anjali_count');
    return saved ? parseInt(saved, 10) : 1293;
  });
  const [hasOffered, setHasOffered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasOffered(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMantra = MANTRAS[currentMantraIdx];

  const handleOfferPushpanjali = () => {
    if (isOffering) return;
    setIsOffering(true);

    // Dynamic Flower Petal Particle Explosion (Silent - No Sound)
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors: selectedFlower.colors,
      ticks: 200,
      gravity: 0.8
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#ffd873', '#ff6b1a', '#ffffff']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#ef4444', '#10b981', '#ffd873']
      });
    }, 250);

    // Increment count & save
    const newCount = anjaliCount + 1;
    setAnjaliCount(newCount);
    localStorage.setItem('pujo_anjali_count', newCount.toString());
    setHasOffered(true);

    // Cycle to next mantra on subsequent Anjalis
    setCurrentMantraIdx((prev) => (prev + 1) % MANTRAS.length);

    setTimeout(() => {
      setIsOffering(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* 3D Liquid Glass Modal (Spacious & Responsive) */}
      <div className="relative w-full max-w-2xl md:h-[86vh] h-full max-h-[92vh] rounded-[32px] sm:rounded-[36px] liquid-glass-card p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 box-border">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 pr-12 gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/25 to-rose-500/25 text-[#ffd873] shadow-md border border-[#ffd873]/30 flex-shrink-0">
              <img src="/durga-logo.png" alt="Maa Durga" className="w-6 h-6 object-contain drop-shadow" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bengali-title text-base sm:text-xl font-bold text-[#ffd873] tracking-wide px-1">
                  ভার্চুয়াল পুষ্পাঞ্জলি
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans font-bold flex-shrink-0">
                  Live Ritual
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#fdf3e2]/65 font-medium px-1">
                মায়ের চরণে ভক্তিভরে ফুল ও বেলপাতা নিবেদন করুন
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-[#ffd873] shadow-inner flex-shrink-0">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{anjaliCount.toLocaleString()} ভক্ত অঞ্জলি দিয়েছেন</span>
          </div>
        </div>

        {/* 2. Scrollable Sacred Ritual Center Stage */}
        <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-3.5 overflow-x-hidden w-full box-border">
          {/* Enhanced Visually Powerful Sanskrit Mantra Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2a1308]/90 via-[#180a04]/95 to-[#240c06]/90 border-2 border-[#ffd873]/45 shadow-[0_12px_32px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,216,115,0.4),0_0_24px_rgba(245,158,11,0.2)] relative overflow-hidden box-border">
            {/* Top Phase Header */}
            <div className="flex items-center justify-center mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-[#ffd873] tracking-wider font-bengali uppercase flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd873]" />
                {currentMantra.phase}
              </span>
            </div>

            {/* Sacred Sanskrit Shloka in Bold Golden Display */}
            <p className="font-bengali text-sm sm:text-base md:text-lg text-[#ffd873] font-black leading-relaxed tracking-wide text-center drop-shadow-[0_2px_12px_rgba(255,216,115,0.5)] my-2">
              {currentMantra.sanskrit}
            </p>

            {/* Phonetic Pronunciation in Elegant Gold Italic */}
            <p className="text-[11px] sm:text-xs text-[#fdf3e2]/85 italic text-center font-serif leading-relaxed my-2 px-2 max-w-xl mx-auto">
              "{currentMantra.phonetic}"
            </p>

            {/* Bengali Meaning Banner */}
            <div className="mt-3 pt-2.5 border-t border-[#ffd873]/20 text-center">
              <span className="text-[11px] text-amber-300 font-bold mr-1 font-bengali">অর্থ:</span>
              <span className="text-[11px] sm:text-xs text-[#fdf3e2]/75 font-bengali leading-relaxed">
                {currentMantra.meaning}
              </span>
            </div>
          </div>

          {/* Floral & Offering Choice Grid (2x2) */}
          <div>
            <label className="block text-xs font-bold text-[#ffd873] mb-2 font-bengali">
              ১. অর্ঘ্য বা ফুল নির্বাচন করুন (Choose Offering):
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {FLOWERS.map((f) => {
                const isSelected = selectedFlower.id === f.id;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFlower(f)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center gap-3 box-border ${
                      isSelected
                        ? 'liquid-glass-btn border-[#ffd873] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-[#ffd873] shadow-lg'
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-[#fdf3e2]/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl flex-shrink-0">
                      {f.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {f.name}
                      </div>
                      <div className="text-[10px] text-[#fdf3e2]/55 truncate">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Devotional Greeting Banner */}
          {hasOffered && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between animate-fadeIn shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>মা দুর্গার আশীর্বাদ আপনার ও আপনার পরিবারের উপর সদাসর্বদা বর্ষিত হোক! 🌸🙏</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Bottom Action Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 box-border">
          <div className="text-[11px] text-[#fdf3e2]/60 sm:block hidden font-bengali">
            অর্ঘ্য নিবেদন করতে নিচের বোতামটি স্পর্শ করুন 🌺
          </div>

          <button
            type="button"
            onClick={handleOfferPushpanjali}
            disabled={isOffering}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 cursor-pointer disabled:opacity-75"
          >
            <Flower2 className={`w-5 h-5 ${isOffering ? 'animate-spin' : 'animate-bounce'}`} />
            <span>
              {isOffering ? 'অঞ্জলি প্রদান হচ্ছে... 🌸' : `${selectedFlower.name.split(' ')[0]} দিয়ে অঞ্জলি দিন 🌺`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
