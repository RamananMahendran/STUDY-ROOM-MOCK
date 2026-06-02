import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DIFFICULTY_COLORS = {
  Easy:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  Medium: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  Hard:   { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
};

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems]     = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [solved]                    = useState(new Set());

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (filter !== 'All') params.set('difficulty', filter);
    console.log('Fetching problems with params:', params.toString());
    console.log('Using auth headers:', authHeaders());
    console.log('API URL:', `${API}/api/problems?${params}`);
    fetch(`${API}/api/problems?${params}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProblems(data.data || []);
          setPagination(data.pagination || null);
        } else {
          setError(data.error || 'Failed to load problems');
        }
      })
      .catch(() => setError('Network error. Is the server running?'))
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = useMemo(() => {
    if (!search) return problems;
    const q = search.toLowerCase();
    return problems.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [problems, search]);

  const dailyProblem = filtered[0] || null;

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', background: '#0d0e17' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#f0f0fa', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Problems</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '6px 0 0' }}>
            Sharpen your skills one problem at a time
            {pagination && (
              <span style={{ color: '#4b5563', marginLeft: 8 }}>· {pagination.total} problems</span>
            )}
          </p>
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
      {dailyProblem && !loading && (
        <div style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #2d1057 50%, #3b1577 100%)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 20,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(124,58,237,0.25)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div style={{
            width: 52, height: 52, background: 'rgba(255,255,255,0.1)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>🔥</div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>
              Daily Challenge
            </div>
            <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {dailyProblem.title}
            </div>
            <DifficultyBadge difficulty={dailyProblem.difficulty} />
          </div>
          <button
            onClick={() => navigate(`/practice/problems/${dailyProblem.slug}`)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, flexShrink: 0, transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            ⚡ Solve now →
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems by title or tag…"
            style={{
              width: '100%', background: '#13141f', border: '1px solid #2d2e3d',
              borderRadius: 10, padding: '10px 14px 10px 40px',
              color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#2d2e3d')}
          />
        </div>
        {['All', 'Easy', 'Medium', 'Hard'].map(f => (
          <FilterBtn key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#f87171', fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Problems Table */}
      <div style={{ background: '#13141f', borderRadius: 12, border: '1px solid #1e1f2e', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 40px',
          padding: '12px 20px', borderBottom: '1px solid #1e1f2e',
          color: '#4b5563', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
        }}>
          <span>#</span><span>Title</span><span>Difficulty</span><span>Acceptance</span><span />
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            Loading problems…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            No problems match your search.
          </div>
        ) : (
          filtered.map((problem, idx) => (
            <ProblemRow
              key={problem.id}
              problem={problem}
              idx={idx}
              solved={solved.has(problem.id)}

              onClick={ () => {
                console.log(problem)
                navigate(`/practice/problems/${problem.slug}`)
              }
              }
              isLast={idx === filtered.length - 1}
            />
          ))
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
        display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 40px',
        padding: '14px 20px', cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #0d0e17',
        background: hovered ? 'rgba(124,58,237,0.05)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
        transition: 'background 0.15s', alignItems: 'center',
      }}
    >
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
        <span style={{ color: '#4b5563', fontSize: 13 }}>{problem.id}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? '#a78bfa' : '#e0e0f0', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' }}>
          {problem.title}
        </span>
        {(problem.tags || []).slice(0, 2).map(tag => (
          <span key={tag} style={{
            background: '#1a1b2e', color: '#4b5563', fontSize: 11,
            padding: '2px 8px', borderRadius: 6, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      <div><DifficultyBadge difficulty={problem.difficulty} /></div>

      <span style={{ color: '#6b7280', fontSize: 13 }}>
        {typeof problem.acceptanceRate === 'number'
          ? `${problem.acceptanceRate.toFixed(1)}%`
          : 'N/A'}
      </span>

      <span style={{ color: hovered ? '#7c3aed' : '#2d2e3d', fontSize: 18, transition: 'color 0.15s' }}>›</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  // Normalize difficulty string (e.g., 'easy' -> 'Easy')
  const normalized = difficulty ? (difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()) : 'Easy';
  const c = DIFFICULTY_COLORS[normalized] || DIFFICULTY_COLORS.Easy;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    }}>
      {normalized}
    </span>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#7c3aed' : '#13141f',
        border: `1px solid ${active ? '#7c3aed' : '#2d2e3d'}`,
        color: active ? '#fff' : '#6b7280',
        padding: '8px 16px', borderRadius: 20,
        cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}