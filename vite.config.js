import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite plugin for real-time live visitor tracking & shared community chat via Server-Sent Events (SSE)
function livePresenceAndChatPlugin() {
  const activeClients = new Set();
  
  // Real shared community messages store (Chronological: Oldest -> Newest)
  let communityMessages = [
    { id: 101, name: 'সৌম্যদীপ', text: 'মহালয়ার সকালে রেডিওতে বীরেন্দ্রকৃষ্ণ ভদ্র না শুনলে পুজোই মনে হয় না! 📻', time: '10:15 AM' },
    { id: 102, name: 'অনন্যা', text: 'কাশফুল আর শিউলি ফুলের গন্ধ মানেই মা আসছেন। শুভ দেবীপক্ষ সবাইকে! 🌸', time: '11:30 AM' },
    { id: 103, name: 'দেবাঞ্জন', text: 'অষ্টমীর সকালে অঞ্জলি আর ধুনুচি নাচ — মিস করা যায় না! 🔥🥁', time: '01:45 PM' }
  ];

  let sharedChaiCount = 14;

  const broadcast = (dataObj) => {
    const payload = `data: ${JSON.stringify(dataObj)}\n\n`;
    for (const client of activeClients) {
      try {
        client.write(payload);
      } catch (err) {
        activeClients.delete(client);
      }
    }
  };

  const broadcastPresence = () => {
    const exactOnline = Math.max(1, activeClients.size);
    broadcast({
      type: 'presence',
      online: exactOnline,
      timestamp: Date.now()
    });
  };

  return {
    name: 'live-presence-and-chat',
    configureServer(server) {
      // 1. Server-Sent Events Stream Endpoint
      server.middlewares.use('/api/live-presence', (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        });

        activeClients.add(res);

        // Send initial presence & initial messages
        const initialData = JSON.stringify({
          type: 'init',
          online: Math.max(1, activeClients.size),
          messages: communityMessages,
          chaiCount: sharedChaiCount
        });
        res.write(`data: ${initialData}\n\n`);

        // Broadcast updated presence to everyone
        broadcastPresence();

        // Keep-alive heartbeat every 15s
        const heartbeat = setInterval(() => {
          try {
            res.write(`: heartbeat\n\n`);
          } catch (e) {
            clearInterval(heartbeat);
            activeClients.delete(res);
            broadcastPresence();
          }
        }, 15000);

        // Handle disconnect
        req.on('close', () => {
          clearInterval(heartbeat);
          activeClients.delete(res);
          broadcastPresence();
        });
      });

      // 2. REST API: Post new community message
      server.middlewares.use('/api/messages', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed && parsed.text) {
                const now = new Date();
                const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const newMsg = {
                  id: Date.now() + Math.floor(Math.random() * 1000),
                  name: parsed.name?.trim() || 'বাঙালি পুজোপ্রেমী',
                  text: parsed.text?.trim(),
                  time: formattedTime || 'Just now',
                  senderId: parsed.senderId || null,
                  timestamp: Date.now()
                };

                // Append to bottom (chronological) & keep latest 100
                communityMessages = [...communityMessages.slice(-99), newMsg];

                // Broadcast new message to all live connected clients
                broadcast({
                  type: 'new_message',
                  message: newMsg,
                  messages: communityMessages
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: newMsg, messages: communityMessages }));
                return;
              }
            } catch (err) {
              console.error('Error handling message post:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid message body' }));
          });
        } else if (req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ messages: communityMessages, chaiCount: sharedChaiCount }));
        }
      });

      // 3. REST API: Buy a real shared Chai
      server.middlewares.use('/api/chai', (req, res) => {
        if (req.method === 'POST') {
          sharedChaiCount += 1;
          broadcast({
            type: 'chai_update',
            chaiCount: sharedChaiCount
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, chaiCount: sharedChaiCount }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ chaiCount: sharedChaiCount }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    livePresenceAndChatPlugin()
  ],
})
