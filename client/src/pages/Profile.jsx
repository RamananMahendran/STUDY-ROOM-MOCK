import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoDashboard  = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IcoHeadphones = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcoCode       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
const IcoZap        = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const IcoUsers      = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
const IcoBar        = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>;
const IcoGift       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>;
const IcoLogout     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>;
const IcoChevron    = ({s=13, rotate="0"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{transition:"transform var(--dur-fast)", transform:`rotate(${rotate}deg)`}}><path d="m6 9 6 6 6-6"/></svg>;
const IcoLock       = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoSearch     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus       = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IcoBookOpen   = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;
const IcoMsg        = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>;
const IcoShare      = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>;
const IcoClock      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const IcoTarget     = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const IcoStar       = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>;
const IcoSettings   = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IcoAward      = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const IcoTrendingUp = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
const IcoMoreHorizontal = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
const IcoCheck      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IcoFlame      = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const IcoSparkle    = ({s=16, color="currentColor"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 c0 3.5 -2.5 6 -6 6 c3.5 0 6 2.5 6 6 c0 -3.5 2.5 -6 6 -6 c-3.5 0 -6 -2.5 -6 -6 z" />
    <path d="M19 3v4M17 5h4" />
    <circle cx="5" cy="19" r="1" />
  </svg>
);

const IcoGauge      = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 16A10 10 0 1 1 20.66 16"/></svg>;
const IcoGrid       = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>;
const IcoTrend      = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const IcoArrowRight = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, color, gradient }) {
  return (
    <div className="ui-card" style={{ position: "relative", padding: "18px 20px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: gradient || color }}></div>
      <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 17, color: color }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", lineHeight: 1, letterSpacing: "-0.5px" }}>
        {value}{unit && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginLeft: 3 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Badge Card ────────────────────────────────────────────────────────────────
function BadgeCard({ icon, title, desc, earned }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)", opacity: earned ? 1 : 0.4 }}>
      <div style={{ fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", filter: earned ? "none" : "grayscale(100%) opacity(0.6)" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap" }}>{desc}</div>
      </div>
    </div>
  );
}

// ── Settings Section ──────────────────────────────────────────────────────────
const SettingsSection = ({ title, children, noBg = false }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>{title}</div>
    <div style={noBg ? {} : { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
      {children}
    </div>
  </div>
);

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ onClose, username, solvedCount, streak }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    if (window.addNotification) window.addNotification("Stats copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 460,
          background: "#12151c",
          border: "1px solid #1e2433",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          fontFamily: "inherit",
          color: "#e2e8f0",
          overflow: "hidden",
          display: "flex", flexDirection: "column"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Share your stats</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 18, lineHeight: 1, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{
            background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))",
            borderRadius: 16, padding: "36px 24px", display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", color: "white", boxShadow: "0 12px 32px rgba(99, 102, 241, 0.25)"
          }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📚</div>
            
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>{streak || 0}</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>day streak</span>
            </div>
            
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 32 }}>{username || "User"} on Study Room</div>
            
            {/* Stat Boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%", marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>0.4h</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hours</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>1</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sessions</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{solvedCount}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Solved</div>
              </div>
            </div>
            
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>studyroom.co.in</div>
          </div>
          
          <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            Click "Copy stats" to copy your achievement text to clipboard.
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid #1e2433" }}>
          <button
            onClick={onClose}
            style={{
              flex: "0 0 auto", padding: "11px 24px", borderRadius: 10,
              border: "1px solid #1e2433", background: "rgba(255,255,255,0.05)",
              color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minWidth: 100
            }}
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: "11px 24px", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {copied ? <IcoCheck s={14} /> : (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
            {copied ? "Copied!" : "Copy stats"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserProblemsHistory({ onDataLoaded }) { // 👈 2. Lift up state to update parent stats count
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [diffFilter, setDiffFilter] = useState("All");     

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/submissions/user/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });

        if (!response.ok) throw new Error("Failed to load submission history.");

        const data = await response.json();
        const submissions = data.data || data;
        setSubmissions(submissions);
        const solvedCount = submissions.filter(sub => sub.status === "ACCEPTED" || sub.status === "SUCCESS").length;
        if (onDataLoaded) onDataLoaded(solvedCount); // Push count back up to parent
      } catch (err) {
        console.error("Error fetching submission history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesDiff = diffFilter === "All" || sub.problem?.difficulty?.toLowerCase() === diffFilter.toLowerCase();
    const isSolved = sub.status === "ACCEPTED" || sub.status === "SUCCESS"; 
    const matchesStatus = statusFilter === "All" || (statusFilter === "Solved" && isSolved);
    return matchesDiff && matchesStatus;
  });

  if (loading) return <div style={{ color: "var(--text-muted)", padding: "24px", textAlign: "center" }}>Loading your progress...</div>;
  if (error) return <div style={{ color: "#ef4444", padding: "24px", textAlign: "center" }}>Error: {error}</div>;

  const getDiffColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "#22c55e";
      case "medium": return "#eab308";
      case "hard": return "#ef4444";
      default: return "var(--text-muted)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 12 }}>
        <StatCard icon={<IcoCheck s={16}/>} label="Solved" value={submissions.filter(sub => sub.status === "ACCEPTED" || sub.status === "SUCCESS").length} color="#10b981" gradient="linear-gradient(90deg, #10b981, #059669)" />
        <StatCard icon={<IcoCheck s={16} color="#f59e0b" />} label="Attempted" value={submissions.length} color="#f59e0b" gradient="linear-gradient(90deg, #f59e0b, #ea580c)" />
        <StatCard icon={<IcoCheck s={16} color="#8b5cf6" />} label="Accept rate" value={submissions.length > 0 ? Math.round((submissions.filter(sub => sub.status === "ACCEPTED" || sub.status === "SUCCESS").length / submissions.length) * 100) + "%" : "—"} color="#8b5cf6" gradient="linear-gradient(90deg, #8b5cf6, #6366f1)" />
      </div>

      {/* Problems Container */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Problems</span>
          <span onClick={() => navigate("/practice/problems")} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer" }}>View all {">"}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {["All", "✓ Solved", "• In progress"].map((status) => (
            <button
              key={status} onClick={() => setStatusFilter(status === "✓ Solved" ? "Solved" : status)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                backgroundColor: (statusFilter === "All" && status === "All") || (statusFilter === "Solved" && status === "✓ Solved") ? "rgba(99, 102, 241, 0.15)" : "transparent",
                color: (statusFilter === "All" && status === "All") || (statusFilter === "Solved" && status === "✓ Solved") ? "var(--accent)" : "var(--text-muted)",
                border: (statusFilter === "All" && status === "All") || (statusFilter === "Solved" && status === "✓ Solved") ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border)",
                transition: "0.2s"
              }}
            >
              {status}
            </button>
          ))}

          {["All diff", "Easy", "Medium", "Hard"].map((diff) => {
            let activeColor = "var(--accent)";
            let activeBg = "rgba(99, 102, 241, 0.15)";
            let activeBorder = "rgba(99, 102, 241, 0.4)";
            
            if (diff === "Easy") {
              activeColor = "#10b981";
              activeBg = "rgba(16, 185, 129, 0.15)";
              activeBorder = "rgba(16, 185, 129, 0.4)";
            } else if (diff === "Medium") {
              activeColor = "#f59e0b";
              activeBg = "rgba(245, 158, 11, 0.15)";
              activeBorder = "rgba(245, 158, 11, 0.4)";
            } else if (diff === "Hard") {
              activeColor = "#ef4444";
              activeBg = "rgba(239, 68, 68, 0.15)";
              activeBorder = "rgba(239, 68, 68, 0.4)";
            }

            const isActive = (diffFilter === "All" && diff === "All diff") || diffFilter === diff;

            return (
              <button
                key={diff} onClick={() => setDiffFilter(diff === "All diff" ? "All" : diff)}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  backgroundColor: isActive ? activeBg : "transparent",
                  color: isActive ? activeColor : "var(--text-muted)",
                  border: isActive ? `1px solid ${activeBorder}` : "1px solid var(--border)",
                  transition: "0.2s"
                }}
              >
                {diff}
              </button>
            );
          })}
        </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>{"</>"}</div>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>No problems attempted yet</p>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-muted)", maxWidth: 300, lineHeight: 1.55 }}>Start practicing to track your coding progress.</p>
          <button onClick={() => navigate("/practice/problems")} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Browse problems
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Problem</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Difficulty</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Mode</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "var(--text)" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>{sub.problem?.title || `Problem #${sub.problemId}`}</td>
                  <td style={{ padding: "12px 8px" }}><span style={{ color: getDiffColor(sub.problem?.difficulty), fontWeight: 600, fontSize: 11 }}>{sub.problem?.difficulty || "N/A"}</span></td>
                  <td style={{ padding: "12px 8px", color: "var(--text-subtle)", fontSize: 12 }}>{sub.pairSession ? "👥 Pair" : "👤 Solo"}</td>
                  <td style={{ padding: "12px 8px", color: "var(--text-muted)", fontSize: 12 }}>{new Date(sub.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      <div style={{ marginTop: 24, paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", color: "rgb(139, 92, 246)" }}><IcoSparkle s={18} /></span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Advanced Analytics</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", border: "1.5px solid rgba(129, 140, 248, 0.3)", backgroundColor: "rgba(129, 140, 248, 0.1)", padding: "2px 8px", borderRadius: 6, letterSpacing: "0.5px", marginLeft: 4 }}>PRO</span>
        </div>
        
        <div style={{ 
          position: "relative",
          width: "100%",
          borderRadius: 16,
          border: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 20px"
        }}>
          {/* Background Grid Heatmap simulation */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 14, padding: 24 }}>
             {[...Array(12)].map((_, i) => {
               // Generate some random-ish colors based on purple/orange to match the design
               const hue = [280, 290, 260, 270, 340, 350, 250, 310, 290, 270, 280, 330][i];
               const lightness = [10, 12, 15, 14, 11, 10, 16, 13, 14, 12, 11, 15][i];
               return (
                 <div key={i} style={{ backgroundColor: `hsl(${hue}, 40%, ${lightness}%)`, borderRadius: 16 }}></div>
               );
             })}
          </div>
          {/* Fading overlay to make it look blurred/subtle at the edges */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, var(--surface) 80%)" }}></div>

          {/* Content */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 640, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #8b5cf6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", marginBottom: 20 }}>
              <IcoLock s={24} />
            </div>
            
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Advanced Analytics</div>
            
            <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
              Interview readiness score, topic mastery heatmap, difficulty ceiling, 8-week<br/>
              progress curve, and personalised weakness recommendations — see<br/>
              exactly where to focus next.
            </div>

            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <IcoGauge s={14} color="#818cf8"/> <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Readiness score</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <IcoGrid s={14} color="#818cf8"/> <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Topic heatmap</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <IcoTarget s={14} color="#818cf8"/> <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Difficulty ceiling</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <IcoTrend s={14} color="#818cf8"/> <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Weekly trend</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <IcoSparkle s={14} color="#818cf8"/> <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Weakness recs</span>
              </div>
            </div>

            <button style={{ 
              background: "linear-gradient(135deg, rgb(139, 92, 246), rgb(99, 102, 241))", 
              color: "white", border: "none", padding: "12px 28px", borderRadius: 10, 
              fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 
            }}>
              Upgrade to Pro <IcoArrowRight s={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [hoursRange, setHoursRange] = useState("14d");
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [streak, setStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0); // 👈 3. Saved solved count profile state
  const [profileData, setProfileData] = useState(null);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [signOutHover, setSignOutHover] = useState(false);
  
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = (event) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      console.warn("No auth token/user found. Loading as Guest...");
    }

    try {
      const userObj = JSON.parse(storedUser);
      if (userObj) {
        setUsername(userObj.username || "Guest");
        setEmail(userObj.email || "");
        setUserId(userObj.userId || "");
        if (userObj.streak !== undefined) setStreak(userObj.streak);
      }
      
      // Fetch fresh profile data to sync streak
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      fetch(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfileData(data);
          if (data.streak !== undefined) {
            setStreak(data.streak);
            userObj.streak = data.streak;
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        }
      })
      .catch(err => console.error("Error fetching fresh profile:", err));
      
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const heatmapCols = 24;

  const badges = [
    { icon: "🔥", title: "On a Roll", desc: "3-day study streak", earned: streak >= 3 },
    { icon: "⚡", title: "Week Warrior", desc: "7-day study streak", earned: streak >= 7 },
    { icon: "🏆", title: "Unstoppable", desc: "30-day study streak", earned: streak >= 30 },
    { icon: "🍅", title: "Getting Started", desc: "10 focus sessions", earned: (profileData?.focusSessionsCount || 0) >= 10 },
    { icon: "💪", title: "Focused", desc: "50 focus sessions", earned: (profileData?.focusSessionsCount || 0) >= 50 },
    { icon: "💯", title: "Centurion", desc: "100 focus sessions", earned: (profileData?.focusSessionsCount || 0) >= 100 },
    { icon: "☑️", title: "First Blood", desc: "First problem solved", earned: (profileData?.problemsSolved || solvedCount) > 0 },
    { icon: "🧠", title: "Problem Solver", desc: "10 problems solved", earned: (profileData?.problemsSolved || solvedCount) >= 10 },
    { icon: "🥷", title: "Coding Ninja", desc: "25 problems solved", earned: (profileData?.problemsSolved || solvedCount) >= 25 },
    { icon: "📅", title: "Daily Starter", desc: "3-day daily challenge streak", earned: false },
    { icon: "🗓️", title: "Daily Regular", desc: "7-day daily challenge streak", earned: false },
    { icon: "🔥", title: "Daily Devotee", desc: "30-day daily challenge streak", earned: false },
  ];

  return (
    <>
        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} username={username} solvedCount={solvedCount} streak={streak} />}

        <main className="shell-main-content route-transition" style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0, backgroundColor: "var(--bg)" }}>
            
            {/* Header Profile Info */}
            <div className="profile-header" style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0px" }}>
              <div className="profile-hero" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                <div className="ui-avatar ui-avatar-lg" style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#0d9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, border: "none", boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 16px", flexShrink: 0 }}>
                  {username ? username.charAt(0).toUpperCase() : "U"} {/* 👈 4. Dynamic Avatar Initial */}
                </div>
                <div style={{ flex: "1 1 0%", minWidth: 0, paddingBottom: 4 }}>
                  <div className="profile-name-row" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{username}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, backgroundColor: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.3)", color: "#eab308", fontSize: 11, fontWeight: 700 }}>
                      <IcoFlame s={12} color="#eab308" /> {streak}-day streak
                    </div>
                  </div>
                  <p style={{ margin: "0px", fontSize: 12, color: "var(--text-muted)" }}>{email}</p>
                </div>
                <button className="share-btn" onClick={() => setShowShareModal(true)} title="Share your stats" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", transition: "0.15s", flexShrink: 0 }}>
                  <IcoShare s={13} /> Share
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="profile-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0px 32px 48px" }}>
              
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 12, marginBottom: 24 }}>
                <StatCard icon={<IcoFlame s={16}/>} label="Current Streak" value={streak} unit="days" color="#f59e0b" gradient="linear-gradient(90deg, #f59e0b, #ef4444)" />
                <StatCard icon={<IcoClock s={16}/>} label="Total Hours" value={profileData ? profileData.totalStudyHours : "0.4"} unit="h" color="#6366f1" gradient="linear-gradient(90deg, #6366f1, #8b5cf6)" />
                <StatCard icon={<IcoTarget s={16}/>} label="Focus Sessions" value={profileData ? profileData.focusSessionsCount : "1"} color="#10b981" gradient="linear-gradient(90deg, #10b981, #059669)" />
                <StatCard icon={<IcoStar s={16}/>} label="Problems Solved" value={profileData ? profileData.problemsSolved : solvedCount} color="#facc15" gradient="linear-gradient(90deg, #facc15, #eab308)" />
              </div>

              {/* Tabs navigation */}
              <div style={{ marginBottom: 20 }}>
                <div className="ui-tabs" style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
                  {[
                    { id: "Overview", icon: IcoBar },
                    { id: "Study", icon: IcoBookOpen },
                    { id: "Coding", icon: IcoCode },
                    { id: "Settings", icon: IcoSettings },
                  ].map(tab => (
                    <button
                      key={tab.id} onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                        fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, cursor: "pointer",
                        backgroundColor: "transparent", border: "none",
                        color: activeTab === tab.id ? "var(--accent)" : "var(--text-muted)",
                        borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
                        transition: "color var(--dur-fast)",
                      }}
                    >
                      <tab.icon s={14} /> {tab.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === "Overview" && (() => {
                const studyLog = profileData?.studyHoursLog || [];
                const getLogValueForLabel = (label) => {
                  const entry = studyLog.find(item => item.label === label);
                  return entry ? Number(entry.value) : 0;
                };

                const heatmapCells = profileData?.heatmapData || [];
                const isHeatmapCellActive = (col, row) => {
                  if (Array.isArray(heatmapCells) && heatmapCells.length > 0) {
                    return heatmapCells.some(cell => cell && cell.type === "yearly" && cell.col === col && cell.row === row);
                  }
                  return col === 30 && row === 1; // default fallback active cell
                };

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                      <div className="chart-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Study hours</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{profileData ? `${profileData.studyHoursThisWeek}h total` : "0.6h total"}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {["7d", "14d", "30d"].map(range => (
                            <button
                              key={range}
                              onClick={() => setHoursRange(range)}
                              style={{
                                padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
                                backgroundColor: hoursRange === range ? "var(--accent-bg)" : "transparent",
                                color: hoursRange === range ? "var(--accent)" : "var(--text-muted)",
                                border: hoursRange === range ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border)"
                              }}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {(() => {
                        let data = [];
                        const today = new Date();
                        
                        const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
                        const getDayName = (date) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];

                        if (hoursRange === "7d") {
                          for (let i = 6; i >= 0; i--) {
                            const d = new Date(today);
                            d.setDate(today.getDate() - i);
                            const lbl = getDayName(d);
                            const val = getLogValueForLabel(formatDate(d)) || (i === 0 ? 0.6 : 0);
                            data.push({
                              label: lbl,
                              height: val > 0 ? `${Math.min(val * 60, 80)}px` : "4px",
                              active: i === 0,
                              value: val > 0 ? `${val}h` : undefined
                            });
                          }
                        } else if (hoursRange === "14d") {
                          for (let i = 13; i >= 0; i--) {
                            const d = new Date(today);
                            d.setDate(today.getDate() - i);
                            const lbl = formatDate(d);
                            const val = getLogValueForLabel(lbl) || (i === 1 ? 0.6 : 0);
                            data.push({
                              label: lbl,
                              height: val > 0 ? `${Math.min(val * 60, 80)}px` : "4px",
                              active: i === 0,
                              value: val > 0 ? `${val}h` : undefined
                            });
                          }
                        } else if (hoursRange === "30d") {
                          for (let i = 3; i >= 0; i--) {
                            const d = new Date(today);
                            d.setDate(today.getDate() - i * 7);
                            let val = 0;
                            if (i === 0) {
                              val = profileData ? profileData.studyHoursThisWeek : 0.6;
                            }
                            data.push({
                              label: i === 0 ? "This wk" : `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]}`,
                              height: val > 0 ? `${Math.min(val * 60, 80)}px` : "4px",
                              active: i === 0,
                              value: val > 0 ? `${val}h` : undefined
                            });
                          }
                        }

                        return (
                          <div className="study-hours-chart-scroll" style={{ width: "100%", overflowX: "auto", paddingBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110, minWidth: hoursRange === "14d" ? 480 : 280 }}>
                              {data.map((item, idx) => (
                                <div key={idx} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", position: "relative" }}>
                                  {item.value && <div style={{ position: "absolute", top: 10, fontSize: 10, color: item.active ? "var(--accent)" : "var(--text-muted)", fontWeight: 700 }}>{item.value}</div>}
                                  <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end", position: "relative", padding: hoursRange === "14d" ? "0 2px" : "0 10px" }}>
                                    <div style={{ width: "100%", borderRadius: "5px 5px 0px 0px", background: item.height !== "4px" || item.active ? "linear-gradient(rgb(129, 140, 248), rgb(99, 102, 241))" : "var(--surface-2)", height: item.height }}></div>
                                  </div>
                                  <div style={{ width: "100%", height: 2, backgroundColor: item.active ? "var(--accent)" : "var(--surface-2)", marginBottom: 4, borderRadius: 2 }}></div>
                                  <span style={{ fontSize: 11, color: item.active ? "var(--accent)" : "var(--text-subtle)", fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Heatmap */}
                    <div className="analytics-heatmap-scroll" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", overflowX: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, minWidth: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Activity</span>
                          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{profileData ? `${profileData.activityActiveDays} active days` : "1 active days"}</span>
                          <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}><IcoFlame s={14} color="#f97316" /> Longest: {profileData ? `${profileData.longestStreak}d` : "1d"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
                          Less
                          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "var(--surface-2)" }}></div>
                          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(99, 102, 241, 0.3)" }}></div>
                          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(99, 102, 241, 0.6)" }}></div>
                          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(99, 102, 241, 0.8)" }}></div>
                          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgb(99, 102, 241)" }}></div>
                          More
                        </div>
                      </div>
                      
                      <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 10, paddingTop: 20, paddingBottom: 2, fontSize: 10, color: "var(--text-muted)" }}>
                          <span>Mo</span>
                          <span>We</span>
                          <span>Fr</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
                            <span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                          </div>
                          <div style={{ display: "flex", gap: 3 }}>
                            {Array.from({ length: 32 }).map((_, cIndex) => (
                              <div key={cIndex} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                {Array.from({ length: 7 }).map((_, rIndex) => {
                                  const isActive = isHeatmapCellActive(cIndex, rIndex);
                                  return <div key={rIndex} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: isActive ? "rgb(99, 102, 241)" : "var(--surface-2)" }}></div>;
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges container */}
                    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <IcoAward s={16} /> <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Badges</span>
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>— {badges.filter(b => b.earned).length} / 12 earned</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {badges.map((b, i) => (
                          <BadgeCard key={i} icon={b.icon} title={b.title} desc={b.desc} earned={b.earned} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* STUDY TAB */}
              {activeTab === "Study" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 12 }}>
                    <StatCard icon={<IcoTarget s={16}/>} label="Total sessions" value={profileData ? profileData.totalSessions : "4"} color="#8b5cf6" gradient="linear-gradient(90deg, #8b5cf6, #6366f1)" />
                    <StatCard icon={<IcoTrendingUp s={16}/>} label="This week" value={profileData ? profileData.studyHoursThisWeek : "0.6"} unit="h" color="#10b981" gradient="linear-gradient(90deg, #10b981, #059669)" />
                    <StatCard icon={<IcoZap s={16}/>} label="Today" value={profileData ? profileData.pomodorosToday : "0"} unit="sessions" color="#f59e0b" gradient="linear-gradient(90deg, #f59e0b, #ef4444)" />
                    <StatCard icon={<IcoFlame s={16}/>} label="Longest streak" value={profileData ? profileData.longestStreak : "1"} unit="d" color="#f97316" gradient="linear-gradient(90deg, #f97316, #ea580c)" />
                  </div>
                  
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Top rooms by time</div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>📚 Study session</span>
                          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>0.5h</span>
                        </div>
                        <div style={{ width: "100%", height: 6, backgroundColor: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: "80%", height: "100%", background: "linear-gradient(90deg, rgb(99, 102, 241), rgb(139, 92, 246))", borderRadius: 3 }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>📚 First focus block</span>
                          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>0.1h</span>
                        </div>
                        <div style={{ width: "100%", height: 6, backgroundColor: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: "20%", height: "100%", background: "linear-gradient(90deg, rgb(99, 102, 241), rgb(139, 92, 246))", borderRadius: 3 }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CODING TAB */}
              {activeTab === "Coding" && <UserProblemsHistory onDataLoaded={(count) => setSolvedCount(count)} />}

              {/* SETTINGS TAB */}
              {activeTab === "Settings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  
                  {/* ACCOUNT */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Account</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>
                        {username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{username || "User"}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{email || "user@example.com"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 4 }}>Cannot change email — see sign-in methods below</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* APPEARANCE */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Appearance</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Theme</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Switch between light and dark mode</div>
                      </div>
                      <div onClick={toggleTheme} style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)", position: "relative", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                        <div style={{ 
                          width: 18, height: 18, borderRadius: 9, 
                          backgroundColor: theme === "dark" ? "rgb(99, 102, 241)" : "rgb(139, 92, 246)", 
                          position: "absolute", top: 2, 
                          transform: theme === "dark" ? "translateX(0px)" : "translateX(18px)",
                          left: 2, 
                          display: "flex", alignItems: "center", justifyContent: "center", 
                          color: theme === "dark" ? "#fcd34d" : "white", fontSize: 12,
                          transition: "all 0.2s"
                        }}>
                          {theme === "dark" ? "🌙" : "☀️"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NOTIFICATIONS */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 16, textTransform: "uppercase" }}>Notifications</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                      Browser notifications are used for Pomodoro timer alerts. You'll be prompted when you join a room. Friend requests and invites appear in the notification bell in the top bar.
                    </div>
                  </div>

                  {/* SIGN-IN METHODS */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Sign-in Methods</div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div className="account-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {/* Google icon simple replacement */}
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Google</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{email || "user@example.com"}</div>
                          </div>
                        </div>
                        <div style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: 12, fontWeight: 600, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                          ✓ Connected
                        </div>
                      </div>

                      {showPasswordForm ? (
                        <div style={{ padding: "20px 24px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Add a password to your account</div>
                          <div style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 20 }}>Useful if Google sign-in is ever blocked on your network. You can always sign in with either method.</div>
                          
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>NEW PASSWORD</div>
                          <input type="password" placeholder="At least 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, backgroundColor: "var(--surface)", border: "1px solid rgba(139, 92, 246, 0.5)", color: "var(--text)", fontSize: 14, outline: "none", marginBottom: 6 }} />
                          <div style={{ fontSize: 12, color: "var(--text-subtle)", marginBottom: 20 }}>Choose 8 or more characters</div>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => { setPasswordSet(true); setShowPasswordForm(false); }} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgb(139, 92, 246)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Set password</button>
                            <button onClick={() => setShowPasswordForm(false)} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="account-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: passwordSet ? "#10b981" : "var(--text-muted)" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" opacity="0"/><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Email + password</div>
                              <div style={{ fontSize: 13, color: "var(--text-subtle)", marginTop: 2 }}>{passwordSet ? "Password set" : "Not set — sign in only with Google for now"}</div>
                            </div>
                          </div>
                          {passwordSet ? (
                            <div style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: 12, fontWeight: 600, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                              ✓ Connected
                            </div>
                          ) : (
                            <button onClick={() => setShowPasswordForm(true)} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgb(139, 92, 246)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                              Set password
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BILLING */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Billing</div>
                    <div className="billing-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Free tier</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Study rooms, coding practice, pair coding, and leaderboard — all free, forever.</div>
                      </div>
                      <button onClick={() => navigate("/pricing")} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)" }}>
                        See Pro pricing
                      </button>
                    </div>
                  </div>

                  {/* ACCOUNT ACTIONS */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" }}>Account Actions</div>
                    <button 
                      onClick={handleLogout} 
                      onMouseEnter={() => setSignOutHover(true)}
                      onMouseLeave={() => setSignOutHover(false)}
                      style={{ 
                        alignSelf: "flex-start", padding: "10px 20px", borderRadius: 8, 
                        backgroundColor: signOutHover ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.05)", 
                        color: "var(--danger)", border: `1px solid ${signOutHover ? "rgba(239, 68, 68, 0.6)" : "rgba(239, 68, 68, 0.3)"}`, 
                        fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                        transition: "all 0.2s"
                      }}
                    >
                      <IcoLogout s={14} /> Sign out
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </main>
      <style>{`
        @media (max-width: 640px) {
          .profile-header { padding: 20px 16px 0px !important; }
          .profile-content { padding: 0px 16px 80px !important; }
          .profile-hero { flex-direction: column; text-align: center; }
          .profile-name-row { justify-content: center; }
          .share-btn { width: 100%; justify-content: center; }
          .ui-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ui-tabs::-webkit-scrollbar { display: none; }
          .chart-header-row { flex-direction: column; align-items: flex-start !important; gap: 12px; }
          .billing-row { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .account-row { flex-direction: column; align-items: flex-start !important; gap: 12px; }
        }
      `}</style>
    </>
  );
}