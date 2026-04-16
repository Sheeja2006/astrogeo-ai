import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpaceBackground from './components/SpaceBackground';
import SuggestionChips from './components/SuggestionChips';
import MessageBubble from './components/MessageBubble';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOPIC_TABS = [
  { label: 'All',       icon: '🌌' },
  { label: 'Geography', icon: '🌍' },
  { label: 'Space',     icon: '🚀' },
  { label: 'Climate',   icon: '🌦️' },
  { label: 'Disasters', icon: '🌋' },
];

export default function App() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "Hello, explorer! I'm AstroGeo AI — your guide to Earth's geography and the cosmos. Ask me about countries, rivers, mountains, space missions, planets, and more!",
  }]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;

    setMessages(prev => [...prev,
      { role: 'user', text: query },
      { role: 'bot', isLoading: true, text: '' },
    ]);
    setInput('');
    setLoading(true);

    const timeout = setTimeout(() => {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'bot', text: 'Request timed out. Please try again.', sources: [] },
      ]);
      setLoading(false);
    }, 30000);

    try {
      const res = await axios.post(`${API_URL}/chat`, { message: query });
      clearTimeout(timeout);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'bot', text: res.data.reply, sources: res.data.sources || [] },
      ]);
    } catch (err) {
      clearTimeout(timeout);
      let errText = 'Cannot connect to backend.';
      if (err.response?.status === 429) errText = 'Rate limit reached. Please wait and try again.';
      else if (err.response?.status === 500) errText = 'Server error. Please try again.';
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'bot', text: errText, sources: [] },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <SpaceBackground />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        height: '100dvh',
        padding: '10px 10px 0',
        boxSizing: 'border-box',
      }}>

        {/* Header — compact on mobile */}
        <header style={{
          width: '100%', maxWidth: '760px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.4)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '17px',
              flexShrink: 0,
            }}>🌌</div>
            <div>
              <h1 style={{
                color: '#e2d9f3', fontSize: '17px',
                fontWeight: 700, letterSpacing: '0.5px', margin: 0,
              }}>
                Astro<span style={{ color: '#a78bfa' }}>Geo</span> AI
                <span style={{
                  fontSize: '9px', marginLeft: '6px',
                  background: 'rgba(99,102,241,0.2)',
                  color: '#818cf8', padding: '2px 6px',
                  borderRadius: '10px',
                  border: '1px solid rgba(99,102,241,0.3)',
                  verticalAlign: 'middle',
                }}>LLaMA 3.3</span>
              </h1>
              <p style={{ color: '#7c6fa0', fontSize: '10px', margin: 0 }}>
                Earth · Space · Intelligence
              </p>
            </div>
          </div>
          <span style={{
            fontSize: '10px',
            background: 'rgba(93,202,165,0.1)',
            color: '#5dcaa5', padding: '3px 8px',
            borderRadius: '20px',
            border: '1px solid rgba(93,202,165,0.3)',
            flexShrink: 0,
          }}>● Online</span>
        </header>

        {/* Topic Tabs — scrollable row on mobile */}
        <div style={{
          width: '100%', maxWidth: '760px',
          display: 'flex', gap: '6px',
          marginBottom: '8px',
          overflowX: 'auto',
          flexShrink: 0,
          paddingBottom: '2px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {TOPIC_TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                background: activeTab === tab.label
                  ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === tab.label
                  ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px',
                padding: '5px 12px',
                color: activeTab === tab.label ? '#e2d9f3' : '#7c6fa0',
                fontSize: '11px', cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Chat window — fills remaining height */}
        <div style={{
          width: '100%', maxWidth: '760px',
          background: 'rgba(3,0,30,0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '12px 12px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            WebkitOverflowScrolling: 'touch',
          }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {messages.length === 1 && (
              <div style={{ marginTop: '6px' }}>
                <p style={{
                  color: '#7c6fa0', fontSize: '11px',
                  textAlign: 'center', marginBottom: '10px',
                }}>
                  ✨ Try asking one of these:
                </p>
                <SuggestionChips onSelect={sendMessage} activeTab={activeTab} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            borderTop: '1px solid rgba(167,139,250,0.15)',
            padding: '10px 12px',
            paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
            background: 'rgba(3,0,30,0.6)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={loading ? 'Waiting…' : 'Ask about space or geography…'}
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  borderRadius: '24px',
                  padding: '10px 16px',
                  color: '#e2d9f3',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: loading ? 0.6 : 1,
                  minWidth: 0,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: loading || !input.trim()
                    ? 'rgba(109,40,217,0.25)'
                    : 'linear-gradient(135deg, #6d28d9, #a78bfa)',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {loading ? '⏳' : '🚀'}
              </button>
            </div>
            <p style={{
              color: '#4a3f6b', fontSize: '10px',
              marginTop: '6px', textAlign: 'center',
            }}>
              LLaMA 3.3 · Groq · {messages.filter(m => m.role === 'user').length} questions asked
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        input::placeholder { color: #4a3f6b; }
        input:focus {
          border-color: rgba(167,139,250,0.6) !important;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.08);
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}