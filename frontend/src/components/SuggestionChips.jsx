const SUGGESTIONS = [
  { icon: '🌋', text: 'Which volcano erupted in 1980?' },
  { icon: '🚀', text: 'When was the first space mission?' },
  { icon: '🌍', text: 'What is the capital of Japan?' },
  { icon: '🏔️', text: 'What is the height of Mount Everest?' },
  { icon: '🌊', text: 'Which is the deepest lake in the world?' },
  { icon: '☀️', text: 'What is a solar flare?' },
  { icon: '🌐', text: 'Which countries border India?' },
  { icon: '💫', text: 'What was the Apollo 11 mission?' },
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap',
      gap: '8px', justifyContent: 'center',
      padding: '0 12px',
    }}>
      {SUGGESTIONS.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.text)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#b8a9d9',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(167,139,250,0.15)';
            e.currentTarget.style.color = '#e2d9f3';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#b8a9d9';
          }}
        >
          <span style={{ fontSize: '14px' }}>{s.icon}</span>
          {s.text}
        </button>
      ))}
    </div>
  );
}