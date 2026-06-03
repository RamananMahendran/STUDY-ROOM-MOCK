import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const IcoFlame = ({ s = 24, style: st }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={st}>
    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
  </svg>
);

const IcoChevRight = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function DailyChallenge() {
  const navigate = useNavigate();
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    // Fetch problems to select one deterministically based on the current day of the year
    fetch(`${API}/api/problems`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const problems = data.data;
          // Calculate day of the year
          const now = new Date();
          const start = new Date(now.getFullYear(), 0, 0);
          const diff = now - start;
          const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
          
          // Select problem based on day of year so it changes daily but is consistent for all users
          const index = dayOfYear % problems.length;
          setProblem(problems[index]);
        }
      })
      .catch(err => console.error("Failed to fetch daily challenge", err));
  }, []);

  if (!problem) return null;

  return (
    <div
      className="flex-shrink-0 cursor-pointer overflow-hidden"
      style={{
        borderRadius: 14,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
        boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
        position: "relative",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 24px,#fff 24px,#fff 25px), repeating-linear-gradient(90deg,transparent,transparent 24px,#fff 24px,#fff 25px)",
        }}
      />
      <div className="relative flex items-center flex-wrap" style={{ padding: "18px 22px", gap: 16 }}>
        {/* Flame icon */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <IcoFlame s={24} style={{ color: "rgb(251,191,36)" }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap" style={{ gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
              Daily Challenge · {day}, {date}
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {problem.title}
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", textTransform: "capitalize" }}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Solve button */}
        <div
          onClick={() => navigate(`/practice/problems/${problem.slug}`)}
          className="flex-shrink-0 flex items-center cursor-pointer"
          style={{ gap: 6, backgroundColor: "#fff", color: "#4f46e5", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700 }}
        >
          <IcoFlame s={14} style={{ color: "#4f46e5" }} />
          Solve now
          <IcoChevRight s={14} />
        </div>
      </div>
    </div>
  );
}
