import React, { useState } from 'react';
import { X, Check, Heart, Mail } from 'lucide-react';

export default function CreatorsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const email = 'aneekpal@proton.me';

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-md rounded-[32px] liquid-glass-card p-5 sm:p-6 shadow-2xl border border-white/20 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full liquid-glass-btn text-[#fdf3e2]/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title: MADE WITH BHALOBASHA BY */}
        <div className="text-[11px] font-mono tracking-widest text-[#ffd873] uppercase font-bold mb-5 flex items-center justify-center gap-1.5">
          <span>MADE WITH BHALOBASHA BY</span>
          <Heart className="w-3.5 h-3.5 fill-[#ff4d4d] text-[#ff4d4d]" />
        </div>

        {/* Aneek Pal Creator Card */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/15 shadow-inner flex flex-col items-center">
          {/* Avatar with Glow Bezel */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-[#ffd873] to-rose-500 shadow-[0_0_24px_rgba(255,216,115,0.45)] mb-3.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#1e130c] overflow-hidden flex items-center justify-center border-2 border-[#120805]">
              <img
                src="/aneek-avatar.jpg"
                alt="Aneek Pal"
                className="w-full h-full object-cover object-center filter brightness-105"
                onError={(e) => {
                  e.target.src = '/durga-logo.png';
                }}
              />
            </div>
          </div>

          {/* Name & Tagline */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#fdf3e2] tracking-wide">
            Aneek Pal
          </h3>
          <p className="text-xs sm:text-[13px] text-[#ffd873]/90 font-medium mt-1 font-bengali">
            বাঙালির শ্রেষ্ঠ উৎসবের জন্য ভালোবাসা দিয়ে তৈরি
          </p>

          {/* Social Links: LinkedIn & Instagram */}
          <div className="flex items-center gap-3.5 mt-4">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/aneekpal-47-71-111apal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full liquid-glass-btn text-[#fdf3e2] hover:text-[#0077b5] hover:border-[#0077b5]/60 hover:scale-108 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Aneek Pal on LinkedIn"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/w_izard_47/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full liquid-glass-btn text-[#fdf3e2] hover:text-[#e4405f] hover:border-[#e4405f]/60 hover:scale-108 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Aneek Pal (@w_izard_47) on Instagram"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Email Pill */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col items-center">
          <span className="text-[11px] text-[#fdf3e2]/60 font-medium mb-2">
            Want to get in touch?
          </span>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/15 hover:border-[#ffd873]/50 text-xs text-[#fdf3e2]/90 hover:text-[#ffd873] transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-[#ffd873]" />
            <span className="font-mono text-[11px]">{email}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 uppercase tracking-wider text-[#ffd873]">
              {copied ? <Check className="w-3 h-3 text-emerald-400 inline" /> : 'COPY'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
