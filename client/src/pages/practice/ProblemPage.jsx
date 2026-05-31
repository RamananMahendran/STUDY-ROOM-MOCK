import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript', monacoLang: 'javascript', ext: 'js' },
  { label: 'Python',     value: 'python',     monacoLang: 'python',     ext: 'py' },
  { label: 'Java',       value: 'java',       monacoLang: 'java',       ext: 'java' },
  { label: 'C++',        value: 'cpp',        monacoLang: 'cpp',        ext: 'cpp' },
  { label: 'C',          value: 'c',          monacoLang: 'c',          ext: 'c' },
];

const STARTER_CODE = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var solution = function(nums, target) {
    // Write your solution here
};`,
  python: `class Solution:
    def solution(self, nums, target):
        # Write your solution here
        pass`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
  c: `#include <stdio.h>

void solution() {
    // Write your solution here
}`,
};

const DIFFICULTY_STYLE = {
  Easy:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  Hard:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
};

const STATUS_META = {
  accepted:            { color: '#4ade80', icon: '✓', label: 'Accepted' },
  wrong_answer:        { color: '#f87171', icon: '✗', label: 'Wrong Answer' },
  runtime_error:       { color: '#fb923c', icon: '⚠', label: 'Runtime Error' },
  compile_error:       { color: '#f87171', icon: '⚠', label: 'Compile Error' },
  time_limit_exceeded: { color: '#fbbf24', icon: '⏱', label: 'Time Limit Exceeded' },
  pending:             { color: '#a78bfa', icon: '…', label: 'Pending' },
  error:               { color: '#f87171', icon: '✗', label: 'Error' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getUserId() {
  try {
    const token = getToken();
    if (!token) return 1;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || 1;
  } catch {
    return 1;
  }
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Shared Badges ────────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }) {
  const s = DIFFICULTY_STYLE[difficulty] || DIFFICULTY_STYLE.Easy;
  return (
    <span style={{
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    }}>
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { color: '#9ca3af', icon: '?', label: status };
  return (
    <span style={{
      color: m.color, background: `${m.color}18`, border: `1px solid ${m.color}30`,
      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {m.icon} {m.label}
    </span>
  );
}

// ─── Description Panel ───────────────────────────────────────────────────────

function DescriptionPanel({ problem }) {
  const testCases = (problem.testCases || []).slice(0, 3);

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 style={{ color: '#f0f0fa', fontSize: 22, fontWeight: 700, margin: 0 }}>{problem.title}</h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {(problem.tags || []).map(tag => (
          <span key={tag} style={{
            background: '#1e1f30', color: '#8b8fa8', border: '1px solid #2d2e3d',
            padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 24, padding: '12px 16px', background: '#1a1b2e', borderRadius: 10, border: '1px solid #2d2e3d' }}>
        <div>
          <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>Acceptance</div>
          <div style={{ color: '#e0e0f0', fontSize: 14, fontWeight: 600 }}>
            {typeof problem.acceptanceRate === 'number' ? `${problem.acceptanceRate.toFixed(1)}%` : 'N/A'}
          </div>
        </div>
        <div style={{ width: 1, background: '#2d2e3d' }} />
        <div>
          <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>Topics</div>
          <div style={{ color: '#e0e0f0', fontSize: 14, fontWeight: 600 }}>{(problem.tags || []).length}</div>
        </div>
      </div>

      <div
        style={{ color: '#c9cad8', fontSize: 14, lineHeight: 1.75, marginBottom: 28 }}
        dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }}
      />

      {testCases.length > 0 && (
        <div>
          <h3 style={{ color: '#e0e0f0', fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Examples
          </h3>
          {testCases.map((tc, i) => (
            <div key={i} style={{
              background: '#13141f', border: '1px solid #2d2e3d',
              borderRadius: 10, padding: '14px 16px', marginBottom: 12, fontFamily: 'monospace',
            }}>
              <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>EXAMPLE {i + 1}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: '#6b7280', fontSize: 12 }}>Input: </span>
                <span style={{ color: '#a5f3fc', fontSize: 13 }}>
                  {typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)}
                </span>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: 12 }}>Output: </span>
                <span style={{ color: '#86efac', fontSize: 13 }}>
                  {typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Submissions Panel ────────────────────────────────────────────────────────

function SubmissionsPanel({ problemId, selectedSubmission, onSelect }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/submissions/user/history?problemId=${problemId}&limit=20`, {
      headers: authHeaders(),
    })
      .then(r => r.json())
      .then(data => { if (data.success) setSubmissions(data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
      Loading submissions…
    </div>
  );

  if (selectedSubmission) {
    const s = selectedSubmission;
    return (
      <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        <button
          onClick={() => onSelect(null)}
          style={{ background: 'none', border: '1px solid #2d2e3d', color: '#9ca3af', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, marginBottom: 20 }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <StatusBadge status={s.status} />
          <span style={{ color: '#6b7280', fontSize: 13 }}>{s.language} · {timeAgo(s.createdAt)}</span>
          {s.runtimeMs != null && <span style={{ color: '#9ca3af', fontSize: 13 }}>{s.runtimeMs.toFixed(0)}ms</span>}
        </div>

        {s.error_message && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ color: '#f87171', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{s.error_message}</div>
          </div>
        )}

        {s.test_results && s.test_results.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Test Cases</div>
            {s.test_results.map((tr, i) => (
              <div key={i} style={{
                background: tr.passed ? 'rgba(74,222,128,0.05)' : 'rgba(248,113,113,0.05)',
                border: `1px solid ${tr.passed ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}`,
                borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontFamily: 'monospace', fontSize: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#9ca3af' }}>Case {tr.test_case_index}</span>
                  <span style={{ color: tr.passed ? '#4ade80' : '#f87171', fontWeight: 600 }}>{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
                </div>
                <div style={{ color: '#6b7280' }}>
                  Input: <span style={{ color: '#a5f3fc' }}>{typeof tr.input === 'object' ? JSON.stringify(tr.input) : String(tr.input)}</span>
                </div>
                <div style={{ color: '#6b7280' }}>
                  Expected: <span style={{ color: '#86efac' }}>{typeof tr.expected === 'object' ? JSON.stringify(tr.expected) : String(tr.expected)}</span>
                </div>
                <div style={{ color: '#6b7280' }}>
                  Got: <span style={{ color: tr.passed ? '#86efac' : '#f87171' }}>{tr.output || '(empty)'}</span>
                </div>
                {tr.error && <div style={{ color: '#fb923c', marginTop: 4 }}>Error: {tr.error}</div>}
              </div>
            ))}
          </div>
        )}

        <div>
          <div style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Code</div>
          <div style={{ background: '#0d0e17', border: '1px solid #2d2e3d', borderRadius: 10, padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, color: '#c9cad8', whiteSpace: 'pre-wrap', lineHeight: 1.6, overflowX: 'auto' }}>
            {s.code}
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#6b7280' }}>
        <div style={{ fontSize: 32 }}>📭</div>
        <div style={{ fontSize: 14 }}>No submissions yet</div>
        <div style={{ fontSize: 13, color: '#4b5563' }}>Submit your first solution!</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <h3 style={{ color: '#e0e0f0', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>My Submissions</h3>
      {submissions.map(s => (
        <div
          key={s.id}
          onClick={() => onSelect(s)}
          style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            alignItems: 'center', gap: 12,
            padding: '12px 16px', marginBottom: 8,
            background: '#13141f', border: '1px solid #2d2e3d',
            borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c3aed')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2d2e3d')}
        >
          <div>
            <StatusBadge status={s.status} />
            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{s.language} · {timeAgo(s.createdAt)}</div>
          </div>
          {s.runtimeMs != null && <span style={{ color: '#9ca3af', fontSize: 12 }}>{s.runtimeMs.toFixed(0)} ms</span>}
          <span style={{ color: '#374151', fontSize: 16 }}>›</span>
        </div>
      ))}
    </div>
  );
}

// ─── Discussions Panel ────────────────────────────────────────────────────────

function DiscussionsPanel({ problemId }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [content, setContent]         = useState('');
  const [posting, setPosting]         = useState(false);
  const [error, setError]             = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/api/discussions/${problemId}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setDiscussions(data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [problemId]);

  useEffect(() => { load(); }, [load]);

  const post = async () => {
    if (!content.trim()) return;
    setPosting(true); setError('');
    try {
      const res = await fetch(`${API}/api/discussions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ problemId, content }),
      });
      const data = await res.json();
      if (data.success) { setContent(''); load(); }
      else setError(data.error || 'Failed to post');
    } catch {
      setError('Network error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1f2e', flexShrink: 0 }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share your approach, ask a question, or discuss edge cases…"
          rows={3}
          style={{
            width: '100%', background: '#13141f', border: '1px solid #2d2e3d',
            borderRadius: 10, padding: '10px 14px', color: '#e0e0f0', fontSize: 13,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit', lineHeight: 1.6,
          }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = '#2d2e3d')}
        />
        {error && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            onClick={post}
            disabled={posting || !content.trim()}
            style={{
              background: posting || !content.trim() ? '#2d2e3d' : '#7c3aed',
              border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 8,
              cursor: posting || !content.trim() ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600,
            }}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {loading ? (
          <div style={{ color: '#6b7280', textAlign: 'center', paddingTop: 40 }}>Loading…</div>
        ) : discussions.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 40, color: '#6b7280' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
            <div>No discussions yet. Start the conversation!</div>
          </div>
        ) : (
          discussions.map(d => (
            <div key={d.id} style={{ padding: '14px 0', borderBottom: '1px solid #1e1f2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>
                  {d.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ color: '#e0e0f0', fontSize: 13, fontWeight: 600 }}>{d.user?.name || 'User'}</div>
                  <div style={{ color: '#6b7280', fontSize: 11 }}>{timeAgo(d.createdAt)}</div>
                </div>
              </div>
              <div style={{ color: '#c9cad8', fontSize: 13, lineHeight: 1.65, paddingLeft: 40 }}>
                {d.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ result, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 24px', color: '#a78bfa', fontSize: 13 }}>
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
        <span>Running your code…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!result) {
    return <div style={{ padding: '16px 24px', color: '#4b5563', fontSize: 13 }}>Run your code or submit to see results here.</div>;
  }

  if (result.mode === 'run') {
    return (
      <div style={{ padding: '12px 24px', fontFamily: 'monospace' }}>
        {result.stdout && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Output</span>
            <div style={{ color: '#86efac', fontSize: 13, marginTop: 4, whiteSpace: 'pre-wrap' }}>{result.stdout}</div>
          </div>
        )}
        {result.stderr && (
          <div>
            <span style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Error</span>
            <div style={{ color: '#f87171', fontSize: 13, marginTop: 4, whiteSpace: 'pre-wrap' }}>{result.stderr}</div>
          </div>
        )}
        {!result.stdout && !result.stderr && (
          <div style={{ color: '#9ca3af', fontSize: 13 }}>No output</div>
        )}
      </div>
    );
  }

  // submit mode
  const passed = (result.testResults || []).filter(t => t.passed).length;
  const total  = (result.testResults || []).length;

  return (
    <div style={{ padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <StatusBadge status={result.status} />
        {result.runtimeMs != null && <span style={{ color: '#9ca3af', fontSize: 12 }}>{result.runtimeMs.toFixed(0)} ms</span>}
        {result.memoryKb  != null && <span style={{ color: '#9ca3af', fontSize: 12 }}>{(result.memoryKb / 1024).toFixed(1)} MB</span>}
        {total > 0 && (
          <span style={{ color: passed === total ? '#4ade80' : '#f87171', fontSize: 12, fontWeight: 600 }}>
            {passed}/{total} test cases passed
          </span>
        )}
      </div>

      {result.errorMessage && (
        <div style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
          <div style={{ color: '#f87171', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{result.errorMessage}</div>
        </div>
      )}

      {result.testResults && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {result.testResults.map((t, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: t.passed ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
              border: `1.5px solid ${t.passed ? '#4ade80' : '#f87171'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: t.passed ? '#4ade80' : '#f87171', fontWeight: 700,
            }} title={`Case ${t.test_case_index}: ${t.passed ? 'Passed' : 'Failed'}`}>
              {i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProblemPage() {
  const { slug }   = useParams();
  const navigate   = useNavigate();

  const [problem, setProblem]           = useState(null);
  const [loadingProblem, setLoading]    = useState(true);
  const [problemError, setProblemError] = useState('');

  const [language, setLanguage] = useState('javascript');
  const [code, setCode]         = useState(STARTER_CODE['javascript']);

  const [leftTab, setLeftTab] = useState('description');

  const [runLoading, setRunLoading]   = useState(false);
  const [runResult, setRunResult]     = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [leftWidth, setLeftWidth] = useState(45);
  const dragging = useRef(false);

  // Load problem
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/api/problems/slug/${slug}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success) setProblem(data.data);
        else setProblemError(data.error || 'Problem not found');
      })
      .catch(() => setProblemError('Failed to load problem'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Resizer
  const onMouseDown = () => { dragging.current = true; };
  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      const container = document.getElementById('problem-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct  = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(25, Math.min(75, pct)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleLanguageChange = lang => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang] || '// Write your solution here');
  };

  // Run
  const handleRun = async () => {
    if (!problem) return;
    setRunLoading(true); setShowResults(true); setRunResult(null);
    try {
      const firstCase = (problem.testCases || [])[0];
      const stdin = firstCase
        ? (typeof firstCase.input === 'object' ? JSON.stringify(firstCase.input) : String(firstCase.input))
        : '';
      const langMap = { python: 71, javascript: 63, java: 62, cpp: 54, c: 50 };
      const res = await fetch(`${API}/api/code/run`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ sourceCode: code, languageId: langMap[language] || 63, stdin }),
      });
      const data = await res.json();
      setRunResult({
        mode: 'run',
        stdout: data.stdout || data.data?.stdout || '',
        stderr: data.stderr || data.data?.stderr || data.compile_output || data.data?.compile_output || '',
        status: data.status?.description || 'Done',
      });
    } catch {
      setRunResult({ mode: 'run', stdout: '', stderr: 'Network error', status: 'Error' });
    } finally {
      setRunLoading(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitLoading(true); setShowResults(true); setRunResult(null);
    try {
      const res = await fetch(`${API}/api/submissions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ problemId: problem.id, code, language, submittedFrom: 'solo' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const submissionId = data.data.id;

      let attempts = 0;
      const poll = async () => {
        if (attempts++ > 30) { setSubmitLoading(false); return; }
        const r = await fetch(`${API}/api/submissions/${submissionId}`, { headers: authHeaders() });
        const d = await r.json();
        if (!d.success) return;
        const s = d.data;
        if (s.status === 'pending') { setTimeout(poll, 1500); return; }
        setRunResult({
          mode: 'submit',
          submissionId: s.id,
          status: s.status,
          testResults: s.test_results,
          runtimeMs: s.runtimeMs,
          memoryKb: s.memoryKb,
          errorMessage: s.error_message,
        });
        setSubmitLoading(false);
      };
      poll();
    } catch (err) {
      setRunResult({ mode: 'run', stdout: '', stderr: err.message || 'Submission failed', status: 'Error' });
      setSubmitLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loadingProblem) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0e17', color: '#6b7280', fontSize: 14 }}>
        Loading problem…
      </div>
    );
  }

  if (problemError || !problem) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d0e17', gap: 12 }}>
        <div style={{ color: '#f87171', fontSize: 16 }}>Problem not found</div>
        <button onClick={() => navigate('/practice/problems')} style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          ← Back to Problems
        </button>
      </div>
    );
  }

  const langMeta = LANGUAGE_OPTIONS.find(l => l.value === language) || LANGUAGE_OPTIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d0e17', overflow: 'hidden' }}>

      {/* Top Bar */}
      <div style={{
        height: 52, background: '#13141f', borderBottom: '1px solid #1e1f2e',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/practice/problems')}
          style={{ background: 'none', border: '1px solid #2d2e3d', color: '#9ca3af', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
        >
          ← Problems
        </button>
        <div style={{ width: 1, height: 20, background: '#2d2e3d' }} />
        <span style={{ color: '#e0e0f0', fontSize: 14, fontWeight: 600 }}>{problem.title}</span>
        <DifficultyBadge difficulty={problem.difficulty} />
        <div style={{ flex: 1 }} />

        {/* Language selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGUAGE_OPTIONS.map(l => (
            <button
              key={l.value}
              onClick={() => handleLanguageChange(l.value)}
              style={{
                background: language === l.value ? 'rgba(124,58,237,0.2)' : 'transparent',
                border: `1px solid ${language === l.value ? '#7c3aed' : '#2d2e3d'}`,
                color: language === l.value ? '#a78bfa' : '#6b7280',
                padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: '#2d2e3d' }} />

        {/* Run */}
        <button
          onClick={handleRun}
          disabled={runLoading || submitLoading}
          style={{
            background: 'transparent', border: '1px solid #2d2e3d',
            color: '#e0e0f0', padding: '6px 18px', borderRadius: 8,
            cursor: runLoading ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!runLoading && !submitLoading) e.currentTarget.style.borderColor = '#4ade80'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2e3d'; }}
        >
          ▶ Run
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitLoading || runLoading}
          style={{
            background: submitLoading ? '#5b21b6' : '#7c3aed',
            border: 'none', color: '#fff', padding: '6px 20px', borderRadius: 8,
            cursor: submitLoading ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'background 0.15s',
          }}
        >
          {submitLoading ? '⟳ Judging…' : '⚡ Submit'}
        </button>
      </div>

      {/* Split Pane */}
      <div id="problem-container" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left Pane */}
        <div style={{
          width: `${leftWidth}%`, display: 'flex', flexDirection: 'column',
          background: '#13141f', borderRight: '1px solid #1e1f2e',
          overflow: 'hidden', minWidth: 280,
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e1f2e', background: '#0d0e17', flexShrink: 0 }}>
            {['description', 'submissions', 'discussions'].map(tab => (
              <button
                key={tab}
                onClick={() => { setLeftTab(tab); if (tab !== 'submissions') setSelectedSubmission(null); }}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: leftTab === tab ? '2px solid #7c3aed' : '2px solid transparent',
                  color: leftTab === tab ? '#a78bfa' : '#6b7280',
                  padding: '12px 20px', cursor: 'pointer',
                  fontSize: 13, fontWeight: leftTab === tab ? 700 : 400,
                  textTransform: 'capitalize', transition: 'color 0.15s',
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            {leftTab === 'description'  && <DescriptionPanel problem={problem} />}
            {leftTab === 'submissions'  && (
              <SubmissionsPanel
                problemId={problem.id}
                selectedSubmission={selectedSubmission}
                onSelect={setSelectedSubmission}
              />
            )}
            {leftTab === 'discussions' && <DiscussionsPanel problemId={problem.id} />}
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={onMouseDown}
          style={{ width: 5, background: '#1e1f2e', cursor: 'col-resize', flexShrink: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#7c3aed')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1e1f2e')}
        />

        {/* Right Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d0e17', overflow: 'hidden', minWidth: 0 }}>

          {/* Editor header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: '#13141f', borderBottom: '1px solid #1e1f2e', flexShrink: 0,
          }}>
            <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>
              solution.{langMeta.ext}
            </span>
            <button
              onClick={() => setCode(STARTER_CODE[language] || '')}
              style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: 12, cursor: 'pointer', padding: '2px 8px' }}
            >
              Reset
            </button>
          </div>

          {/* Monaco */}
          <div style={{ flex: showResults ? '0 0 calc(100% - 180px)' : '1', minHeight: 200, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={langMeta.monacoLang}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                renderLineHighlight: 'gutter',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Results */}
          {showResults && (
            <div style={{ height: 180, flexShrink: 0, background: '#13141f', borderTop: '1px solid #1e1f2e', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 0', borderBottom: '1px solid #1e1f2e' }}>
                <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {runResult?.mode === 'submit' ? 'Submission Result' : 'Test Output'}
                </span>
                <button onClick={() => setShowResults(false)} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: 16 }}>×</button>
              </div>
              <ResultsPanel result={runResult} loading={runLoading || submitLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}