import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyChallenge from '../components/DailyChallenge.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const PAGE_SIZE = 20;

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
  const [page, setPage]             = useState(1);
  const [solved]                    = useState(new Set());

  // Reset to page 1 whenever filter changes
  useEffect(() => { setPage(1); }, [filter]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
    if (filter !== 'All') params.set('difficulty', filter.toLowerCase());

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
  }, [filter, page]);

  // Client-side search filter (within the current page's results)
  const filtered = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.toLowerCase();
    return problems.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [problems, search]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: 'var(--text)', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Problems</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '6px 0 0' }}>
            Sharpen your skills one problem at a time
            {pagination && (
              <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· {totalItems} problems</span>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate('/practice/leaderboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text)', padding: '8px 16px', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Daily Challenge Banner */}
      {!loading && problems.length > 0 && page === 1 && (
        <div style={{ marginBottom: 28 }}>
          <DailyChallenge />
        </div>
      )}

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems by title or tag…"
            style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px 10px 40px',
              color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
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
      <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 160px 120px 40px',
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
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
              onClick={() => navigate(`/practice/problems/${problem.id}`)}
              isLast={idx === filtered.length - 1}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
      )}
    </div>
  );
}

// ─── Pagination Bar ────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, onPageChange }) {
  // Build page number list with ellipsis
  const pages = buildPageList(page, totalPages);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end   = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginTop: 20, flexWrap: 'wrap', gap: 12,
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        Showing {start}–{end} of {totalItems} problems
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Prev */}
        <PageBtn label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} />

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} style={{ padding: '0 6px', color: 'var(--text-muted)', fontSize: 14 }}>…</span>
          ) : (
            <PageBtn key={p} label={String(p)} active={p === page} onClick={() => onPageChange(p)} />
          )
        )}

        {/* Next */}
        <PageBtn label="›" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} />
      </div>
    </div>
  );
}

function PageBtn({ label, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 36, height: 36, padding: '0 10px',
        borderRadius: 8, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13, fontWeight: active ? 600 : 400,
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

/** Returns an array like [1, 2, '…', 7, 8, 9, '…', 20] */
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
    result.push(sorted[i]);
  }
  return result;
}

// ─── Problem Row ───────────────────────────────────────────────────────────────
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
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        background: hovered ? 'var(--accent-bg)' : idx % 2 === 0 ? 'transparent' : 'var(--surface-2)',
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
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{problem.id}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? 'var(--accent-text)' : 'var(--text)', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' }}>
          {problem.title}
        </span>
        {(problem.tags || []).slice(0, 2).map(tag => (
          <span key={tag} style={{
            background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: 11,
            padding: '2px 8px', borderRadius: 6, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      <div><DifficultyBadge difficulty={problem.difficulty} /></div>

      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        {typeof problem.acceptanceRate === 'number'
          ? `${problem.acceptanceRate.toFixed(1)}%`
          : 'N/A'}
      </span>

      <span style={{ color: hovered ? 'var(--accent)' : 'var(--text-muted)', fontSize: 18, transition: 'color 0.15s' }}>›</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
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
        background: active ? 'var(--accent)' : 'var(--surface)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        color: active ? '#fff' : 'var(--text-muted)',
        padding: '8px 16px', borderRadius: 20,
        cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}