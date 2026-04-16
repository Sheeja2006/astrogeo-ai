import { useState } from 'react';

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false);
  const isBot = message.role === 'bot';

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      flexDirection: isBot ? 'row' : 'row-reverse',
      animation: 'slideUp 0.3s ease-out both',
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: isBot ? 'rgba(167,139,250,0.15)' : 'rgba(93,202,165,0.15)',
        border: `1px solid ${isBot ? 'rgba(167,139,250,0.4)' : 'rgba(93,202,165,0.4)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', flexShrink: 0,
      }}>
        {isBot ? '🌌' : '👤'}
      </div>

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Bubble */}
        <div style={{
          background: isBot ? 'rgba(255,255,255,0.06)' : 'rgba(93,202,165,0.1)',
          border: `1px solid ${isBot ? 'rgba(167,139,250,0.2)' : 'rgba(93,202,165,0.25)'}`,
          borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
          padding: '10px 14px',
        }}>
          {message.isLoading ? (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#a78bfa',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          ) : (
            <p style={{
              color: isBot ? '#e2d9f3' : '#9fe1cb',
              fontSize: '13px', lineHeight: '1.6', margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {message.text}
            </p>
          )}
        </div>

        {/* Sources toggle */}
        {isBot && message.sources && message.sources.length > 0 && (
          <div>
            <button
              onClick={() => setShowSources(!showSources)}
              style={{
                background: 'none', border: 'none',
                color: '#7c6fa0', fontSize: '11px',
                cursor: 'pointer', padding: '2px 4px',
              }}
            >
              {showSources ? '▲ Hide sources' : `▼ View ${message.sources.length} sources`}
            </button>
            {showSources && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '8px 12px',
                marginTop: '4px',
              }}>
                {message.sources.map((src, i) => (
                  <p key={i} style={{
                    fontSize: '11px', color: '#7c6fa0',
                    borderLeft: '2px solid rgba(167,139,250,0.4)',
                    paddingLeft: '8px',
                    marginBottom: i < message.sources.length - 1 ? '6px' : 0,
                    lineHeight: '1.4',
                  }}>
                    {src.length > 180 ? src.slice(0, 180) + '...' : src}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}