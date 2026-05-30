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
const IcoLock       = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoSearch     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus       = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IcoBookOpen   = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;
const IcoMsg        = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>;
const IcoShare      = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>;
const IcoClock      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const IcoTarget     = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const IcoStar       = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>;
const IcoSettings   = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IcoAward      = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const IcoTrendingUp = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
const IcoMoreHorizontal = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
const IcoCheck      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IcoFlame      = ({s=16, color="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 12 12c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5"/><path d="M12 2c0 2.5.5 5 1 7.5.5 3-1 5.5-3 6.5a4 4 0 0 1-4 0c-1-1-3.5-3.5-3-6.5.5-2.5 1-5 1-7.5M12 2v4"/></svg>;

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
function ShareModal({ onClose, username, solvedCount }) { // 👈 1. Added username and count props
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
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>1</span>
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
    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Problems</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {["All", "Solved"].map((status) => (
          <button
            key={status} onClick={() => setStatusFilter(status)}
            style={{
              padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
              backgroundColor: statusFilter === status ? "var(--accent-bg)" : "transparent",
              color: statusFilter === status ? "var(--accent)" : "var(--text-muted)",
              border: statusFilter === status ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border)"
            }}
          >
            {status === "Solved" ? "✓ Solved" : status}
          </button>
        ))}

        <div style={{ width: 1, height: 16, backgroundColor: "var(--border)", margin: "0 4px", alignSelf: "center" }}></div>

        {["All", "Easy", "Medium", "Hard"].map((diff) => (
          <button
            key={diff} onClick={() => setDiffFilter(diff)}
            style={{
              padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
              backgroundColor: diffFilter === diff ? "var(--accent-bg)" : "transparent",
              color: diffFilter === diff ? "var(--accent)" : "var(--text-muted)",
              border: diffFilter === diff ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border)"
            }}
          >
            {diff === "All" ? "All diff" : diff}
          </button>
        ))}
      </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>No problems matches found</p>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)", maxWidth: 300, lineHeight: 1.55 }}>Start practicing or adjust your filters to view tracking records.</p>
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
  const [solvedCount, setSolvedCount] = useState(0); // 👈 3. Saved solved count profile state
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      console.warn("Unauthorized access attempt. Redirecting...");
      navigate("/login");
      return;
    }

    try {
      const userObj = JSON.parse(storedUser);
      if (userObj) {
        setUsername(userObj.username || "Guest");
        setEmail(userObj.email || "");
        setUserId(userObj.userId || "");
      }
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
    { icon: "🔥", title: "On a Roll", desc: "3-day study streak", earned: false },
    { icon: "⚡", title: "Week Warrior", desc: "7-day study streak", earned: false },
    { icon: "🏆", title: "Unstoppable", desc: "30-day study streak", earned: false },
    { icon: "🍅", title: "Getting Started", desc: "10 focus sessions", earned: false },
    { icon: "💪", title: "Focused", desc: "50 focus sessions", earned: false },
    { icon: "💯", title: "Centurion", desc: "100 focus sessions", earned: false },
    { icon: "☑️", title: "First Blood", desc: "First problem solved", earned: solvedCount > 0 },
    { icon: "🧠", title: "Problem Solver", desc: "10 problems solved", earned: solvedCount >= 10 },
    { icon: "🥷", title: "Coding Ninja", desc: "25 problems solved", earned: solvedCount >= 25 },
    { icon: "📅", title: "Daily Starter", desc: "3-day daily challenge streak", earned: false },
    { icon: "🗓️", title: "Daily Regular", desc: "7-day daily challenge streak", earned: false },
    { icon: "🔥", title: "Daily Devotee", desc: "30-day daily challenge streak", earned: false },
  ];

  return (
    <>
        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} username={username} solvedCount={solvedCount} />}

        <main className="shell-main-content route-transition" style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0, backgroundColor: "var(--bg)" }}>
            
            {/* Header Profile Info */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                <div className="ui-avatar ui-avatar-lg" style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#0d9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, border: "none", boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 16px" }}>
                  {username ? username.charAt(0).toUpperCase() : "U"} {/* 👈 4. Dynamic Avatar Initial */}
                </div>
                <div style={{ flex: "1 1 0%", minWidth: 0, paddingBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{username}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, backgroundColor: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.3)", color: "#eab308", fontSize: 11, fontWeight: 700 }}>
                      <IcoFlame s={12} color="#eab308" /> 1-day streak
                    </div>
                  </div>
                  <p style={{ margin: "0px", fontSize: 12, color: "var(--text-muted)" }}>{email}</p>
                </div>
                <button onClick={() => setShowShareModal(true)} title="Share your stats" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", transition: "0.15s", flexShrink: 0 }}>
                  <IcoShare s={13} /> Share
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "0px 32px 48px" }}>
              
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 12, marginBottom: 24 }}>
                <StatCard icon={<IcoFlame s={16}/>} label="Current Streak" value="1" unit="days" color="#f59e0b" gradient="linear-gradient(90deg, #f59e0b, #ef4444)" />
                <StatCard icon={<IcoClock s={16}/>} label="Total Hours" value="0.4" unit="h" color="#6366f1" gradient="linear-gradient(90deg, #6366f1, #8b5cf6)" />
                <StatCard icon={<IcoTarget s={16}/>} label="Focus Sessions" value="1" color="#10b981" gradient="linear-gradient(90deg, #10b981, #059669)" />
                <StatCard icon={<IcoStar s={16}/>} label="Problems Solved" value={solvedCount} color="#facc15" gradient="linear-gradient(90deg, #facc15, #eab308)" /> {/* 👈 5. Linked to state */}
              </div>

              {/* Tabs navigation */}
              <div style={{ marginBottom: 20 }}>
                <div className="ui-tabs" style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)" }}>
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
              {activeTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Study hours</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>0.1h total</span>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
                      {hoursRange === "14d" && ["5/16", "5/17", "5/18", "5/19", "5/20", "5/21", "5/22", "5/23", "5/24", "5/25", "5/26", "5/27", "5/28", "5/29"].map((day) => (
                        <div key={day} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", position: "relative" }}>
                          {day === "5/29" && <div style={{ position: "absolute", top: 10, fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>0.1h</div>}
                          <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end" }}>
                            <div style={{ width: "100%", borderRadius: "5px 5px 0px 0px", background: day === "5/29" ? "linear-gradient(rgb(129, 140, 248), rgb(99, 102, 241))" : "var(--surface-2)", height: day === "5/29" ? "10px" : "4px" }}></div>
                          </div>
                          <span style={{ fontSize: 10, color: day === "5/29" ? "var(--accent)" : "var(--text-subtle)", fontWeight: day === "5/29" ? 700 : 400 }}>{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap */}
                  <div className="analytics-heatmap-scroll" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", overflowX: "auto" }}>
                    <div style={{ display: "flex", gap: 3, marginLeft: 22 }}>
                      {Array.from({ length: heatmapCols }).map((_, cIndex) => (
                        <div key={cIndex} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          {Array.from({ length: 7 }).map((_, rIndex) => {
                            const isActive = cIndex === heatmapCols - 1 && rIndex === 1;
                            return <div key={rIndex} style={{ width: 13, height: 13, borderRadius: 3, backgroundColor: isActive ? "rgb(99, 102, 241)" : "var(--surface-2)" }}></div>;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges container */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <IcoAward s={16} /> <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Badges</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {badges.map((b, i) => (
                        <BadgeCard key={i} icon={b.icon} title={b.title} desc={b.desc} earned={b.earned} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CODING TAB */}
              {activeTab === "Coding" && <UserProblemsHistory onDataLoaded={(count) => setSolvedCount(count)} />}

              {/* SETTINGS TAB */}
              {activeTab === "Settings" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <SettingsSection title="ACCOUNT">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{username}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{email}</div>
                      </div>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="ACCOUNT ACTIONS">
                    <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", cursor: "pointer" }}>
                      <IcoLogout s={14} /> Sign out
                    </button>
                  </SettingsSection>
                </div>
              )}

            </div>
          </div>
        </main>
    </>
  );
}