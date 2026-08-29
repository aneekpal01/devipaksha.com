import { useState, useEffect, useCallback } from 'react';

const INITIAL_FALLBACK_MESSAGES = [
  { id: 101, name: 'সৌম্যদীপ', text: 'মহালয়ার সকালে রেডিওতে বীরেন্দ্রকৃষ্ণ ভদ্র না শুনলে পুজোই মনে হয় না! 📻', time: '10:15 AM' },
  { id: 102, name: 'অনন্যা', text: 'কাশফুল আর শিউলি ফুলের গন্ধ মানেই মা আসছেন। শুভ দেবীপক্ষ সবাইকে! 🌸', time: '11:30 AM' },
  { id: 103, name: 'দেবাঞ্জন', text: 'অষ্টমীর সকালে অঞ্জলি আর ধুনুচি নাচ — মিস করা যায় না! 🔥🥁', time: '01:45 PM' }
];

export function useLivePresence() {
  const [onlineCount, setOnlineCount] = useState(1);
  const [messages, setMessages] = useState(INITIAL_FALLBACK_MESSAGES);
  const [chaiCount, setChaiCount] = useState(14);

  // Tab-unique sender ID (guarantees right vs left message alignment across multiple tabs)
  const [tabSenderId] = useState(() => {
    let id = sessionStorage.getItem('pujo_tab_sender_id');
    if (!id) {
      id = 'tab_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('pujo_tab_sender_id', id);
    }
    return id;
  });

  useEffect(() => {
    let eventSource = null;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pujo_live_channel') : null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/live-presence');

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data) {
              if (data.online !== undefined) {
                setOnlineCount(data.online);
              }
              if (data.messages && Array.isArray(data.messages)) {
                setMessages(data.messages);
              }
              if (data.type === 'new_message' && data.message) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === data.message.id)) return prev;
                  return [...prev, data.message];
                });
              }
              if (data.chaiCount !== undefined) {
                setChaiCount(data.chaiCount);
              }

              // Sync to other local tabs
              if (channel) {
                channel.postMessage(data);
              }
            }
          } catch (err) {
            console.error('Error parsing live SSE event:', err);
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            // Auto reconnect after 3 seconds
            setTimeout(connectSSE, 3000);
          }
        };
      } catch (err) {
        console.warn('SSE connection unavailable, using local channel fallback');
      }
    };

    connectSSE();

    // Cross-tab broadcast listener (for immediate multi-tab sync on same machine)
    if (channel) {
      channel.onmessage = (e) => {
        if (e.data) {
          if (e.data.online !== undefined) setOnlineCount(e.data.online);
          if (e.data.messages && Array.isArray(e.data.messages)) setMessages(e.data.messages);
          if (e.data.type === 'new_message' && e.data.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === e.data.message.id)) return prev;
              return [...prev, e.data.message];
            });
          }
          if (e.data.chaiCount !== undefined) setChaiCount(e.data.chaiCount);
        }
      };
    }

    return () => {
      if (eventSource) eventSource.close();
      if (channel) channel.close();
    };
  }, []);

  const sendMessage = useCallback(async (name, text, senderId) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fallbackMsg = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: name || 'বাঙালি পুজোপ্রেমী',
      text: text,
      time: formattedTime || 'Just now',
      senderId: senderId || tabSenderId,
      timestamp: Date.now()
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text, senderId: senderId || tabSenderId })
      });
      const json = await res.json();
      if (json && json.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === json.message.id)) return prev;
          return [...prev, json.message];
        });
        return json.message;
      }
    } catch (err) {
      console.warn('POST /api/messages failed, using local broadcast:', err);
    }

    // Local fallback if offline
    setMessages((prev) => [...prev, fallbackMsg]);
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('pujo_live_channel');
        ch.postMessage({ type: 'new_message', message: fallbackMsg });
        ch.close();
      }
    } catch (e) {}

    return fallbackMsg;
  }, [tabSenderId]);

  const buyChai = useCallback(async () => {
    try {
      const res = await fetch('/api/chai', { method: 'POST' });
      const json = await res.json();
      if (json && json.chaiCount !== undefined) {
        setChaiCount(json.chaiCount);
        return;
      }
    } catch (err) {
      console.warn('POST /api/chai failed, incrementing locally');
    }
    setChaiCount((prev) => prev + 1);
  }, []);

  return { onlineCount, messages, chaiCount, sendMessage, buyChai, tabSenderId };
}
