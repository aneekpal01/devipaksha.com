import { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_FALLBACK_MESSAGES = [
  { id: 101, name: 'সৌম্যদীপ', text: 'মহালয়ার সকালে রেডিওতে বীরেন্দ্রকৃষ্ণ ভদ্র না শুনলে পুজোই মনে হয় না! 📻', time: '10:15 AM' },
  { id: 102, name: 'অনন্যা', text: 'কাশফুল আর শিউলি ফুলের গন্ধ মানেই মা আসছেন। শুভ দেবীপক্ষ সবাইকে! 🌸', time: '11:30 AM' },
  { id: 103, name: 'দেবাঞ্জন', text: 'অষ্টমীর সকালে অঞ্জলি আর ধুনুচি নাচ — মিস করা যায় না! 🔥🥁', time: '01:45 PM' }
];

const PRESENCE_TOPIC = 'https://ntfy.sh/devipaksha_pujo_global_hub_2026';
const PRESENCE_SSE = 'https://ntfy.sh/devipaksha_pujo_global_hub_2026/sse';
const LOCAL_PRESENCE_KEY = 'pujo_local_tabs_registry';
const CHAT_STORAGE_KEY = 'pujo_chat_history_v3';
const CHAI_STORAGE_KEY = 'pujo_chai_total_count_v3';

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

  // Unique client/tab ID for this session
  const [tabSenderId] = useState(() => {
    let id = sessionStorage.getItem('pujo_tab_sender_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('pujo_tab_sender_id', id);
    }
    return id;
  });

  // Global active peers map: tabId -> timestamp
  const globalPeersRef = useRef(new Map());

  // Helper to publish to global cloud relay
  const publishGlobal = useCallback(async (payload) => {
    try {
      await fetch(PRESENCE_TOPIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Graceful fallback on network glitch
    }
  }, []);

  useEffect(() => {
    const tabId = tabSenderId;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pujo_global_sync_channel') : null;

    // Register self in local peer map
    globalPeersRef.current.set(tabId, Date.now());

    // 1. Send initial heartbeat to global cloud and local channel
    publishGlobal({ type: 'presence_heartbeat', tabId, timestamp: Date.now() });

    // 2. Setup Real-time SSE Stream (Global Cross-Device & Cross-Browser)
    let eventSource = null;
    try {
      eventSource = new EventSource(PRESENCE_SSE);

      eventSource.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (!raw || !raw.message) return;

          const data = typeof raw.message === 'string' ? JSON.parse(raw.message) : raw.message;
          if (!data || !data.type) return;

          // A) Heartbeat from another browser/device (Brave, Chrome, Mobile, etc.)
          if (data.type === 'presence_heartbeat' && data.tabId) {
            globalPeersRef.current.set(data.tabId, Date.now());
            updateLiveCount();
          }

          // B) Tab closed notification
          if (data.type === 'tab_closed' && data.tabId) {
            globalPeersRef.current.delete(data.tabId);
            updateLiveCount();
          }

          // C) Global chat message from any device
          if (data.type === 'chat_message' && data.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.message.id)) return prev;
              const updated = [...prev, data.message];
              try {
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          }

          // D) Global Chai counter update
          if (data.type === 'chai_click' && data.count !== undefined) {
            setChaiCount(data.count);
            try {
              localStorage.setItem(CHAI_STORAGE_KEY, data.count.toString());
            } catch (e) {}
          }
        } catch (e) {
          // Non-JSON or keep-alive message
        }
      };

      eventSource.onerror = () => {
        // SSE auto-reconnects natively
      };
    } catch (err) {
      console.warn('SSE global sync unavailable, relying on local sync:', err);
    }

    // 3. Update Local Heartbeat & Prune stale peers
    const updateLiveCount = () => {
      const now = Date.now();
      // Keep self alive
      globalPeersRef.current.set(tabId, now);

      // Prune inactive peers (> 35 seconds without heartbeat)
      for (const [peerId, lastSeen] of globalPeersRef.current.entries()) {
        if (now - lastSeen > 35000) {
          globalPeersRef.current.delete(peerId);
        }
      }

      // Sync with localStorage tabs on same machine
      try {
        let localTabs = {};
        const stored = localStorage.getItem(LOCAL_PRESENCE_KEY);
        if (stored) localTabs = JSON.parse(stored) || {};
        localTabs[tabId] = now;

        // Prune local tabs
        const cleanLocal = {};
        for (const [id, seen] of Object.entries(localTabs)) {
          if (now - seen < 5000) {
            cleanLocal[id] = seen;
            globalPeersRef.current.set(id, seen);
          }
        }
        localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(cleanLocal));
      } catch (e) {}

      const totalCount = Math.max(1, globalPeersRef.current.size);
      setOnlineCount(totalCount);
    };

    // Periodic Heartbeat to Global Cloud (every 12 seconds)
    const heartbeatInterval = setInterval(() => {
      publishGlobal({ type: 'presence_heartbeat', tabId, timestamp: Date.now() });
      updateLiveCount();
    }, 12000);

    // Frequent local update (every 1.5 seconds)
    const localTickInterval = setInterval(updateLiveCount, 1500);

    // 4. Local BroadcastChannel Listener (Fast sync on same browser)
    if (channel) {
      channel.onmessage = (e) => {
        if (!e.data) return;
        if (e.data.type === 'local_pulse' && e.data.tabId) {
          globalPeersRef.current.set(e.data.tabId, Date.now());
          updateLiveCount();
        }
        if (e.data.type === 'chat_message' && e.data.message) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === e.data.message.id)) return prev;
            return [...prev, e.data.message];
          });
        }
      };
      channel.postMessage({ type: 'local_pulse', tabId });
    }

    // 5. Cleanup on tab close
    const handleBeforeUnload = () => {
      try {
        publishGlobal({ type: 'tab_closed', tabId });
        const stored = localStorage.getItem(LOCAL_PRESENCE_KEY);
        if (stored) {
          const tabs = JSON.parse(stored) || {};
          delete tabs[tabId];
          localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(tabs));
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(localTickInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
      if (eventSource) eventSource.close();
      if (channel) channel.close();
    };
  }, [tabSenderId, publishGlobal]);

  // Send message across all devices in real-time
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

    // Update local state immediately
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Broadcast globally to all other devices & browsers
    publishGlobal({ type: 'chat_message', message: newMsg });

    // Broadcast locally
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('pujo_global_sync_channel');
        ch.postMessage({ type: 'chat_message', message: newMsg });
        ch.close();
      }
    } catch (e) {}

    return newMsg;
  }, [tabSenderId, publishGlobal]);

  // Buy Chai with global real-time synchronization
  const buyChai = useCallback(() => {
    setChaiCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(CHAI_STORAGE_KEY, next.toString());
      } catch (e) {}
      publishGlobal({ type: 'chai_click', count: next });
      return next;
    });
  }, [publishGlobal]);

  return {
    onlineCount,
    messages,
    chaiCount,
    sendMessage,
    buyChai,
    tabSenderId
  };
}
