import React from 'react';
import { X, BookOpen, Radio, Sparkles, Volume2 } from 'lucide-react';
import { MAHALAYA_ABOUT_DATA } from '../data/pujoData';
import { playShankha } from '../utils/audioEngine';
import { useLanguage } from '../context/LanguageContext';

export default function MahalayaAboutModal({ isOpen, onClose, onPlayMahalaya }) {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl rounded-[36px] liquid-glass-card p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 max-h-[92vh]">
        {/* Pinned Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full liquid-glass-btn text-[#fdf3e2] hover:bg-white/20 cursor-pointer"
          title={t('closeBtn')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 pr-12">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-[#ffd873] shadow-md border border-amber-500/40 flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bengali-title text-lg sm:text-2xl font-bold text-[#ffd873] px-1 leading-snug">
                {lang === 'bn' ? MAHALAYA_ABOUT_DATA.title : MAHALAYA_ABOUT_DATA.englishTitle}
              </h2>
              <p className="text-xs text-[#fdf3e2]/70 font-medium px-1">
                {lang === 'bn' ? MAHALAYA_ABOUT_DATA.englishTitle : 'Sacred Lore, Chandi Path & Cultural Heritage'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onPlayMahalaya();
              onClose();
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#ffd873] hover:bg-[#ffe18d] text-black font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Radio className="w-4 h-4 text-black" />
            <span>{t('playMahalayaBtn')}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1 text-[#fdf3e2] overflow-x-hidden">
          {/* Poetic Intro & Mobile Play Button */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/15 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-bengali text-xs sm:text-sm leading-relaxed text-[#ffd873] italic">
              "{lang === 'bn' ? MAHALAYA_ABOUT_DATA.intro : MAHALAYA_ABOUT_DATA.englishIntro}"
            </p>
            <button
              onClick={() => {
                onPlayMahalaya();
                onClose();
              }}
              className="sm:hidden flex items-center justify-center gap-1.5 w-full py-2 rounded-2xl bg-[#ffd873] text-black font-bold text-xs shadow-md cursor-pointer"
            >
              <Radio className="w-4 h-4 text-black" />
              <span>{t('playMahalayaBtn')}</span>
            </button>
          </div>

          {/* 2-Column Grid for Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MAHALAYA_ABOUT_DATA.sections.map((section) => {
              const headingText = lang === 'bn' ? section.heading : section.englishHeading;
              const subText = lang === 'bn' ? section.englishHeading : section.heading;
              const contentParagraphs = lang === 'bn' ? section.content : section.englishContent || section.content;

              return (
                <div
                  key={section.id}
                  className="p-4 rounded-2xl liquid-glass-btn border-white/10 hover:border-[#ffd873]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl flex-shrink-0">{section.icon}</span>
                      <div>
                        <h3 className="font-bengali font-bold text-sm sm:text-base text-[#ffd873]">
                          {headingText}
                        </h3>
                        <div className="text-[10px] text-[#fdf3e2]/60 uppercase tracking-wider">
                          {subText}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {contentParagraphs.map((para, pIdx) => (
                        <p key={pIdx} className="font-bengali text-xs sm:text-sm text-[#fdf3e2]/85 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-[#fdf3e2]/70">
          <span>{t('mahalayaFooter')}</span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full liquid-glass-btn text-[#ffd873] font-bold text-xs shadow-md cursor-pointer"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
