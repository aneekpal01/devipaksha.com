import { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_FALLBACK_MESSAGES = [
  { id: 101, name: 'সৌম্যদীপ', text: 'মহালয়ার সকালে রেডিওতে বীরেন্দ্রকৃষ্ণ ভদ্র না শুনলে পুজোই মনে হয় না! 📻', time: '10:15 AM' },
  { id: 102, name: 'অনন্যা', text: 'কাশফুল আর শিউলি ফুলের গন্ধ মানেই মা আসছেন। শুভ দেবীপক্ষ সবাইকে! 🌸', time: '11:30 AM' },
  { id: 103, name: 'দেবাঞ্জন', text: 'অষ্টমীর সকালে অঞ্জলি আর ধুনুচি নাচ — মিস করা যায় না! 🔥🥁', time: '01:45 PM' }
];

const PRESENCE_STORAGE_KEY = 'pujo_active_tabs_map';
const CHAT_STORAGE_KEY = 'pujo_chat_messages_v2';
const CHAI_STORAGE_KEY = 'pujo_chai_total_count';

export function useLivePresence() {
  const [onlineCount, setOnlineCount] = useState(1);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_FALLBACK_MESSAGES;
  });

  const [chaiCount, setChaiCount] = useState(() => {
    try {
      const stored = localStorage.getItem(CHAI_STORAGE_KEY);
      if (stored) return parseInt(stored, 10) || 14;
    } catch (e) {}
    return 14;
  });

  // Unique tab ID for this browser tab session
  const tabSenderIdRef = useRef(() => {
    let id = sessionStorage.getItem('pujo_tab_sender_id');
    if (!id) {
      id = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('pujo_tab_sender_id', id);
    }
    return id;
  });

  const tabSenderId = typeof tabSenderIdRef.current === 'function' ? tabSenderIdRef.current() : tabSenderIdRef.current;

  // Real-time Multi-Tab Presence & Heartbeat Registry Engine
  useEffect(() => {
    const tabId = tabSenderId;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pujo_live_presence_channel') : null;

    const updateHeartbeatAndCount = () => {
      try {
        const now = Date.now();
        let tabs = {};
        const stored = localStorage.getItem(PRESENCE_STORAGE_KEY);
        if (stored) {
          try {
            tabs = JSON.parse(stored) || {};
          } catch (e) {
            tabs = {};
          }
        }

        // Register / update current tab's active heartbeat
        tabs[tabId] = now;

        // Prune expired tabs (inactive for > 3500ms)
        const activeTabs = {};
        let activeCount = 0;
        for (const [id, lastSeen] of Object.entries(tabs)) {
          if (now - lastSeen < 3500) {
            activeTabs[id] = lastSeen;
            activeCount++;
          }
        }

        localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(activeTabs));

        // When multiple tabs are open (e.g. user opens 25 tabs), display exact active tabs count
        // Minimum 1 online
        const totalLive = Math.max(1, activeCount);
        setOnlineCount(totalLive);

        if (channel) {
          channel.postMessage({ type: 'presence_pulse', count: totalLive, tabId });
        }
      } catch (err) {
        console.warn('Presence heartbeat update error:', err);
      }
    };

    // Immediate initial pulse
    updateHeartbeatAndCount();

    // Pulse every 1.2 seconds
    const interval = setInterval(updateHeartbeatAndCount, 1200);

    // Cross-tab storage change listener
    const handleStorageChange = (e) => {
      if (e.key === PRESENCE_STORAGE_KEY && e.newValue) {
        try {
          const tabs = JSON.parse(e.newValue) || {};
          const now = Date.now();
          const activeCount = Object.values(tabs).filter(t => now - t < 3500).length;
          setOnlineCount(Math.max(1, activeCount));
        } catch (err) {}
      }
      if (e.key === CHAT_STORAGE_KEY && e.newValue) {
        try {
          const newMsgs = JSON.parse(e.newValue);
          if (Array.isArray(newMsgs)) setMessages(newMsgs);
        } catch (err) {}
      }
      if (e.key === CHAI_STORAGE_KEY && e.newValue) {
        try {
          const newChai = parseInt(e.newValue, 10);
          if (!isNaN(newChai)) setChaiCount(newChai);
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // BroadcastChannel listener
    if (channel) {
      channel.onmessage = (e) => {
        if (!e.data) return;
        if (e.data.type === 'presence_pulse' && e.data.count) {
          setOnlineCount(e.data.count);
        }
        if (e.data.type === 'new_message' && e.data.message) {
          setMessages((prev) => {
            if (prev.some(m => m.id === e.data.message.id)) return prev;
            return [...prev, e.data.message];
          });
        }
        if (e.data.type === 'chai_update' && e.data.count !== undefined) {
          setChaiCount(e.data.count);
        }
      };
    }

    // Cleanup on tab close / reload
    const handleBeforeUnload = () => {
      try {
        const stored = localStorage.getItem(PRESENCE_STORAGE_KEY);
        if (stored) {
          const tabs = JSON.parse(stored) || {};
          delete tabs[tabId];
          localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(tabs));
        }
        if (channel) {
          channel.postMessage({ type: 'tab_closed', tabId });
        }
      } catch (err) {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
      if (channel) channel.close();
    };
  }, [tabSenderId]);

  // Send message with multi-tab storage & broadcast sync
  const sendMessage = useCallback((name, text, senderId) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: name || 'বাঙালি পুজোপ্রেমী',
      text: text,
      time: formattedTime || 'Just now',
      senderId: senderId || tabSenderId,
      timestamp: Date.now()
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('pujo_live_presence_channel');
        ch.postMessage({ type: 'new_message', message: newMsg });
        ch.close();
      }
    } catch (e) {}

    return newMsg;
  }, [tabSenderId]);

  // Buy chai with multi-tab sync
  const buyChai = useCallback(() => {
    setChaiCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(CHAI_STORAGE_KEY, next.toString());
      } catch (e) {}
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const ch = new BroadcastChannel('pujo_live_presence_channel');
          ch.postMessage({ type: 'chai_update', count: next });
          ch.close();
        }
      } catch (e) {}
      return next;
    });
  }, []);

  return {
    onlineCount,
    messages,
    chaiCount,
    sendMessage,
    buyChai,
    tabSenderId
  };
}
