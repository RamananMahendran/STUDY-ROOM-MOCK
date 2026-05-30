import { useState, useMemo } from 'react';
//import { PROBLEMS, DAILY_CHALLENGE } from '../data/problems';

const DIFFICULTY_COLORS = {
  Easy: { bg: '#14532d', color: '#4ade80', border: '#166534' },
  Medium: { bg: '#713f12', color: '#fbbf24', border: '#92400e' },
  Hard: { bg: '#7f1d1d', color: '#f87171', border: '#991b1b' },
};

export default function ProblemsPage({ onSelectProblem }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [solved] = useState(new Set([2, 3, 6, 7, 8, 9])); // demo solved

  const filtered = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.includes(search.toLowerCase()));
      const matchFilter = filter === 'All' || p.difficulty === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', background: '#13141f' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#f0f0fa', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Problems</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '6px 0 0' }}>Sharpen your skills one problem at a time</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: '1px solid #2d2e3d',
          color: '#e8e8f0', padding: '8px 16px', borderRadius: 8,
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          🏆 Leaderboard
        </button>
      </div>

      {/* Daily Challenge Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 20,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, backdropFilter: 'blur(4px)' }}>
          🔥
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
            Daily Challenge · Saturday, May 30
          </div>
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {DAILY_CHALLENGE.title}
          </div>
          <DifficultyBadge difficulty={DAILY_CHALLENGE.difficulty} />
        </div>
        <button
          onClick={() => onSelectProblem(DAILY_CHALLENGE)}
          style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
            transition: 'all 0.2s', position: 'relative',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          ⚡ Solve now →
        </button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${PROBLEMS.length} problems...`}
            style={{
              width: '100%', background: '#1a1b2e', border: '1px solid #2d2e3d',
              borderRadius: 10, padding: '10px 14px 10px 40px',
              color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        {['All', 'Easy', 'Medium', 'Hard'].map(f => (
          <FilterBtn key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {/* Problems Table */}
      <div style={{ background: '#1a1b2e', borderRadius: 12, border: '1px solid #2d2e3d', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '56px 1fr 160px 140px 40px',
          padding: '12px 20px', borderBottom: '1px solid #2d2e3d',
          color: '#6b7280', fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
        }}>
          <span>#</span>
          <span>Title</span>
          <span>Difficulty</span>
          <span>Acceptance</span>
          <span></span>
        </div>

        {filtered.map((problem, idx) => (
          <ProblemRow
            key={problem.id}
            problem={problem}
            idx={idx}
            solved={solved.has(problem.id)}
            onClick={() => onSelectProblem(problem)}
            isLast={idx === filtered.length - 1}
          />
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No problems match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemRow({ problem, idx, solved, onClick, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '56px 1fr 160px 140px 40px',
        padding: '14px 20px', cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #1e1f2e',
        background: hovered ? 'rgba(124,58,237,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
        transition: 'background 0.15s', alignItems: 'center',
      }}
    >
      {/* Number / Check */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: solved ? 'none' : '1.5px solid #374151',
          background: solved ? '#22c55e' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: '#fff', flexShrink: 0,
        }}>
          {solved && '✓'}
        </div>
        <span style={{ color: '#6b7280', fontSize: 13 }}>{problem.id}</span>
      </div>

      {/* Title + Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? '#a78bfa' : '#e0e0f0', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' }}>
          {problem.title}
        </span>
        {problem.tags.map(tag => (
          <span key={tag} style={{
            background: '#1e1f2e', color: '#6b7280', fontSize: 11,
            padding: '2px 8px', borderRadius: 6, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      {/* Difficulty */}
      <div><DifficultyBadge difficulty={problem.difficulty} /></div>

      {/* Acceptance */}
      <span style={{ color: '#9ca3af', fontSize: 13 }}>{problem.acceptance}</span>

      {/* Arrow */}
      <span style={{ color: hovered ? '#7c3aed' : '#374151', fontSize: 16, transition: 'color 0.15s' }}>›</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  const c = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.Easy;
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
    }}>{difficulty}</span>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#7c3aed' : '#1a1b2e',
        border: `1px solid ${active ? '#7c3aed' : '#2d2e3d'}`,
        color: active ? '#fff' : '#9ca3af',
        padding: '8px 16px', borderRadius: 20,
        cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >{label}</button>
  );
}
