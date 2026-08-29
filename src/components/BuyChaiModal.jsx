import React, { useState } from 'react';
import { X, Check, Coffee } from 'lucide-react';

export default function BuyChaiModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const upiId = 'aneekpal@upi';

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-sm rounded-[32px] liquid-glass-card p-5 sm:p-6 shadow-2xl border border-white/20 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full liquid-glass-btn text-[#fdf3e2]/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title: BUY ME A CHAI */}
        <div className="text-[11px] font-mono tracking-widest text-[#ffd873] uppercase font-bold mb-2 flex items-center justify-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-amber-400" />
          <span>BUY ME A CHAI</span>
        </div>

        {/* Personalized Solo Creator Subtitle */}
        <p className="text-xs text-[#fdf3e2]/85 leading-relaxed max-w-xs mx-auto mb-4 font-medium">
          If Devi Paksha made your Pujo a little more special, consider buying me a cup of chai. It fuels my coding & keeps the adda alive! ☕🪔
        </p>

        {/* UPI QR Code Container with Maa Durga Center Art */}
        <div className="p-3 bg-white rounded-2xl shadow-xl inline-block border-2 border-amber-300/40 relative group">
          <img
            src="/upi-qr.png"
            alt="Aneek Pal UPI QR Code"
            className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
            onError={(e) => {
              e.target.src = '/durga-logo.png';
            }}
          />
        </div>

        {/* Scanner helper text */}
        <p className="text-[11px] text-[#ffd873]/90 font-medium mt-3 font-sans">
          Scan with any UPI app (GPay, PhonePe, Paytm)
        </p>

        {/* Copy UPI Pill */}
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-center">
          <button
            onClick={handleCopyUpi}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/15 hover:border-[#ffd873]/50 text-xs text-[#fdf3e2]/90 hover:text-[#ffd873] transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <span className="font-mono text-[11px]">Scan QR Above</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 uppercase tracking-wider text-[#ffd873]">
              {copied ? <Check className="w-3 h-3 text-emerald-400 inline" /> : '🪔 PUJO'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
