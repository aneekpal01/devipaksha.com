import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Check, CheckCheck, Trash2 } from 'lucide-react';

export default function ChaiAddaModal({
  isOpen,
  onClose,
  messages = [],
  onSendMessage,
  onDeleteMessage,
  tabSenderId,
  onlineCount = 1
}) {
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatScrollContainerRef = useRef(null);

  // Tab-unique sender ID fallback
  const mySenderId = tabSenderId || sessionStorage.getItem('pujo_tab_sender_id') || 'tab_local';

  // User Profile Name State (Once set, locked permanently)
  const [savedName, setSavedName] = useState(() => {
    return sessionStorage.getItem('pujo_tab_name') || localStorage.getItem('pujo_user_name') || '';
  });
  const [tempNameInput, setTempNameInput] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('pujo_tab_name') || localStorage.getItem('pujo_user_name');
    if (stored) setSavedName(stored);
  }, []);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Scroll to bottom on open and when messages update
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom('auto'), 50);
      setTimeout(() => scrollToBottom('smooth'), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages.length, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    '🌸 সবাইকে শারদীয় শুভেচ্ছা!',
    '🥁 অষ্টমীর অঞ্জলির সময় কখন?',
    '☕ এক কাপ চা আর পুজোর আড্ডা!',
    '✨ ঢাকের কাঠি বাজলো বলে!'
  ];

  const handleSaveName = (e) => {
    e?.preventDefault();
    const clean = tempNameInput.trim();
    if (!clean) return;
    sessionStorage.setItem('pujo_tab_name', clean);
    localStorage.setItem('pujo_user_name', clean);
    setSavedName(clean);
  };

  const handleSendComment = async (e) => {
    e?.preventDefault();
    if (!newComment.trim() || isSending) return;

    setIsSending(true);
    const finalName = savedName.trim() || 'বাঙালি পুজোপ্রেমী';
    if (!savedName) {
      sessionStorage.setItem('pujo_tab_name', finalName);
      localStorage.setItem('pujo_user_name', finalName);
      setSavedName(finalName);
    }

    if (onSendMessage) {
      await onSendMessage(finalName, newComment.trim(), mySenderId);
    }

    setNewComment('');
    setIsSending(false);

    setTimeout(() => scrollToBottom('smooth'), 60);
  };

  const handleDelete = (messageId) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
  };

  const firstLetter = savedName ? savedName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* Web Style Dialog (max-w-3xl on PC with full vertical chat height) */}
      <div className="relative w-full max-w-3xl md:h-[86vh] h-full max-h-[90vh] rounded-[32px] sm:rounded-[36px] liquid-glass-card p-3.5 sm:p-5 shadow-2xl overflow-hidden flex flex-col justify-between border border-white/20 box-border">
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
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#00a884]/20 text-[#00a884] shadow-md border border-[#00a884]/30 flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bengali-title text-base sm:text-xl font-bold text-[#ffd873] tracking-wide px-1">
                  লাইভ পুজোর আড্ডা
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"></span>
                  <span className="tabular-nums font-bold text-emerald-200">{onlineCount}</span>
                  <span>Online</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#fdf3e2]/65 font-medium px-1">
                শারদীয় স্মৃতি ও আড্ডা
              </p>
            </div>
          </div>
        </div>

        {/* 2. Top Profile Identity Banner (User sets name ONCE, then permanently locked) */}
        <div className="my-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-inner gap-2 flex-wrap sm:flex-nowrap box-border">
          <div className="flex items-center gap-2.5 min-w-0">
            {savedName ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-black font-extrabold text-xs flex items-center justify-center shadow-md border border-white/30 flex-shrink-0 font-mono">
                  {firstLetter}
                </div>
                <div className="min-w-0 flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#ffd873] truncate">
                    {savedName}
                  </span>
                  <span className="text-[9px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30 font-medium">
                    You
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন..."
                  value={tempNameInput}
                  onChange={(e) => setTempNameInput(e.target.value)}
                  autoFocus
                  className="px-3 py-1 rounded-xl bg-white/10 border border-[#ffd873] text-xs text-[#fdf3e2] outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-xl bg-[#ffd873] text-black font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>সেভ</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. Message Thread with Delete Option on Own Messages */}
        <div
          ref={chatScrollContainerRef}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3 overflow-x-hidden w-full box-border rounded-2xl bg-black/30 border border-white/5 shadow-inner"
        >
          {messages.map((item) => {
            // Determine if message is sent by current user in this tab
            const isMeBySenderId = item.senderId && mySenderId && item.senderId === mySenderId;
            const isMeByName = savedName && item.name?.trim().toLowerCase() === savedName.trim().toLowerCase();
            const isMe = isMeBySenderId || (!item.senderId && isMeByName);
            const letter = item.name ? item.name.charAt(0).toUpperCase() : 'U';

            return (
              <div
                key={item.id}
                className={`group flex items-end gap-2 w-full ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {/* Left Avatar for other people (LEFT SIDE) */}
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/25 text-amber-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 font-mono shadow-sm border border-amber-500/30 mb-0.5">
                    {letter}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] px-3.5 py-2 rounded-2xl shadow-md transition-all ${
                    isMe
                      ? 'bg-gradient-to-r from-[#005c4b]/95 to-[#024a3c]/95 text-[#fdf3e2] border border-emerald-500/30 rounded-br-xs'
                      : 'bg-white/10 backdrop-blur-md text-[#fdf3e2] border border-white/15 rounded-bl-xs'
                  }`}
                >
                  {/* Author Name for incoming messages (LEFT SIDE) */}
                  {!isMe && (
                    <div className="text-[11px] font-bold text-[#ffd873] mb-0.5 leading-tight">
                      {item.name}
                    </div>
                  )}

                  {/* Message Text */}
                  <div className="font-bengali text-xs sm:text-sm leading-relaxed break-words">
                    {item.text}
                  </div>

                  {/* Message Bottom Row: Timestamp, Double Check, & Delete Button */}
                  <div
                    className={`flex items-center gap-1.5 justify-end text-[9px] font-mono mt-0.5 ${
                      isMe ? 'text-emerald-200/80' : 'text-[#fdf3e2]/50'
                    }`}
                  >
                    <span>{item.time || 'Just now'}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                    {isMe && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete message"
                        className="ml-1 opacity-70 hover:opacity-100 text-rose-300 hover:text-rose-400 p-0.5 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Avatar for current user (RIGHT SIDE) */}
                {isMe && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-black font-extrabold text-[10px] flex items-center justify-center flex-shrink-0 font-mono shadow-sm border border-white/30 mb-0.5">
                    {firstLetter}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-2 mb-1.5 scrollbar-none w-full box-border">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setNewComment(q)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] sm:text-xs text-[#ffd873] whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 5. Bottom Input Bar */}
        <form onSubmit={handleSendComment} className="pt-1.5 border-t border-white/10 w-full box-border">
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder={savedName ? `${savedName} হিসেবে বার্তা লিখুন...` : 'পুজোর বার্তা বা স্মৃতি লিখুন...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-[#fdf3e2] placeholder-[#fdf3e2]/40 outline-none focus:border-[#00a884] focus:bg-white/15 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !newComment.trim()}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#02be96] text-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0 cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
