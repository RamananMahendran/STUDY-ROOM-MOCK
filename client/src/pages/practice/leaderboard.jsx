import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const IcoTrophy = ({ s = 22, color = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
);

const difficultyStyle = {
  H: { background: "#ef4444", color: "#fff" },
  M: { background: "#f59e0b", color: "#fff" },
  E: { background: "#22c55e", color: "#fff" },
};

const rankBadge = (i) => {
  if (i === 0) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥇</span>;
  if (i === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥈</span>;
  if (i === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥉</span>;
  return (
    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", minWidth: 32, textAlign: "center", display: "inline-block" }}>
      #{i + 1}
    </span>
  );
};

// ── Leaderboard Page ──────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedProblemName, setSelectedProblemName] = useState("");
  const [entries, setEntries] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Search, filter, and collapse state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [expandedTags, setExpandedTags] = useState({});

  const toggleTag = (tag) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  const isTagExpanded = (tag) => {
    if (searchQuery.trim() !== "") return true;
    return !!expandedTags[tag];
  };

  // Load current user for self-highlighting
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj && userObj.username) {
          setCurrentUserName(userObj.username);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  // Fetch problems on mount
  useEffect(() => {
    fetch(`${API}/api/problems?limit=1000`)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(p => ({
            id: p.id,
            name: p.title,
            label: p.difficulty ? p.difficulty.charAt(0).toUpperCase() : "E",
            tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ["General"]
          }));
          setProblems(mapped);
          if (mapped.length > 0) {
            setSelectedProblemId(mapped[0].id);
            setSelectedProblemName(mapped[0].name);
          }
        }
        setLoadingProblems(false);
      })
      .catch(err => {
        console.error("Error fetching problems:", err);
        setLoadingProblems(false);
      });
  }, []);

  // Fetch leaderboard when selected problem changes
  useEffect(() => {
    if (!selectedProblemId) return;

    setLoadingEntries(true);
    fetch(`${API}/api/problems/${selectedProblemId}/leaderboard`)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success && Array.isArray(resData.data)) {
          setEntries(resData.data);
        } else {
          setEntries([]);
        }
        setLoadingEntries(false);
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err);
        setEntries([]);
        setLoadingEntries(false);
      });
  }, [selectedProblemId]);

  // Filter problems based on search query and difficulty filter
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.label === difficultyFilter.charAt(0);
    return matchesSearch && matchesDifficulty;
  });

  // Group filtered problems by tags
  const tagGroups = {};
  filteredProblems.forEach(p => {
    p.tags.forEach(tag => {
      if (!tagGroups[tag]) {
        tagGroups[tag] = [];
      }
      if (!tagGroups[tag].some(existing => existing.id === p.id)) {
        tagGroups[tag].push(p);
      }
    });
  });

  // Sort tags alphabetically, putting "General" at the end if it exists
  const sortedTags = Object.keys(tagGroups).sort((a, b) => {
    if (a === "General") return 1;
    if (b === "General") return -1;
    return a.localeCompare(b);
  });

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%", overflow: "hidden",
      backgroundColor: "var(--bg)",
    }}>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Custom Header */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 20, 
          padding: '16px 24px', borderBottom: '1px solid var(--border)', 
          background: 'var(--surface)' 
        }}>
          <button 
            onClick={() => navigate('/practice/problems')} 
            style={{ 
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', 
              gap: 8, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', 
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit'
            }}
          >
            <span style={{ fontSize: 14 }}>←</span> Problems
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IcoTrophy s={24} color="#f59e0b" />
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>Leaderboard</span>
          </div>
        </div>

        {/* Body */}
        <div className="leaderboard-body" style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ── Problem list ── */}
          <div className="problem-list-panel" style={{
            width: 240, flexShrink: 0, overflowY: "auto",
            borderRight: "1px solid var(--border)",
            borderBottom: "1px solid transparent",
            background: "var(--surface)",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--text-muted)",
              padding: "16px 20px 8px",
            }}>
              Select Problem
            </div>

            {/* Search Input */}
            <div style={{ padding: "0 12px 10px" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 28px 6px 10px",
                    borderRadius: 6,
                    border: "1.5px solid var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--text)",
                    fontSize: 12,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 8,
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div style={{ display: "flex", gap: 4, padding: "0 12px 12px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
              {["All", "Easy", "Medium", "Hard"].map(diff => {
                const isActive = difficultyFilter === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border)",
                      backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
                      color: isActive ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>

            {loadingProblems ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Loading problems...</span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>No matching problems</span>
              </div>
            ) : (
              <div style={{ padding: "8px 8px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
                {sortedTags.map(tag => {
                  const items = tagGroups[tag] || [];
                  const isExpanded = isTagExpanded(tag);
                  return (
                    <div key={tag} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleTag(tag)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                          {/* Chevron Icon */}
                          <span style={{
                            fontSize: 8,
                            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease",
                            display: "inline-block",
                          }}>
                            ▶
                          </span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tag}
                          </span>
                        </div>
                        {/* Count Badge */}
                        <span style={{
                          fontSize: 9,
                          fontWeight: 800,
                          backgroundColor: "var(--surface-2)",
                          color: "var(--text-muted)",
                          padding: "1px 5px",
                          borderRadius: 99,
                          minWidth: 16,
                          textAlign: "center",
                        }}>
                          {items.length}
                        </span>
                      </button>

                      {/* Collapsible Problems List */}
                      {isExpanded && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 1, paddingLeft: 10 }}>
                          {items.map(p => {
                            const isSelected = selectedProblemId === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setSelectedProblemId(p.id);
                                  setSelectedProblemName(p.name);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "5px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontFamily: "inherit",
                                  cursor: "pointer",
                                  fontWeight: isSelected ? 600 : 400,
                                  color: isSelected ? "var(--accent)" : "var(--text-muted)",
                                  background: isSelected ? "var(--surface-2)" : "transparent",
                                  border: "none",
                                  transition: "all 0.12s",
                                }}
                              >
                                <span style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 3,
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 8,
                                  fontWeight: 900,
                                  ...difficultyStyle[p.label],
                                }}>
                                  {p.label}
                                </span>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {p.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Leaderboard panel ── */}
          <div className="leaderboard-main-panel" style={{ flex: 1, overflowY: "auto", padding: "28px 36px", background: "var(--bg)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
              {selectedProblemName}
            </h2>

            {loadingEntries ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Loading leaderboard...
                </span>
              </div>
            ) : entries.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  No accepted solutions yet. Be the first!
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {entries.map((entry, i) => {
                  const isCurrentUser = entry.name === currentUserName || entry.name.includes("SIVASABARI");
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 20px", borderRadius: 12,
                      background: isCurrentUser ? "rgba(232, 93, 4, 0.05)" : "var(--surface)",
                      border: isCurrentUser ? "1px solid rgba(232, 93, 4, 0.2)" : "1px solid var(--border)",
                    }}>
                      {/* Rank */}
                      <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {rankBadge(i)}
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 14, color: "#fff",
                        background: entry.avatarBg || "#6366f1",
                      }}>
                        {entry.initial || entry.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name */}
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {entry.name}
                      </span>

                      {/* Lang */}
                      <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
                        {entry.lang} {entry.runtime !== null && entry.runtime !== undefined ? `(${entry.runtime} ms)` : ""}
                      </span>

                      {/* Score */}
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", flexShrink: 0 }}>{entry.score}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


      <style>{`
        @media (max-width: 768px) {
          .leaderboard-body { flex-direction: column !important; }
          .problem-list-panel { 
            width: 100% !important; 
            max-height: 220px !important; 
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .leaderboard-main-panel {
            padding: 20px 16px 80px !important;
          }
        }
      `}</style>
    </div>
  );
}