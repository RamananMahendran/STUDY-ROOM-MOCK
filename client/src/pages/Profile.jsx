import { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
const IcoCheckCircle= ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IcoFlame      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>;
const IcoMoreHorizontal = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
const IcoCheck      = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

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
function ShareModal({ onClose }) {
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
          {/* Gradient Card */}
          <div style={{
            background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))",
            borderRadius: 16,
            padding: "36px 24px",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
            color: "white",
            boxShadow: "0 12px 32px rgba(99, 102, 241, 0.25)"
          }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📚</div>
            
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>1</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>day streak</span>
            </div>
            
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 32 }}>{username} on Study Room</div>
            
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
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>0</div>
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
              color: "#f1f5f9", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              minWidth: 100
            }}
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: "11px 24px", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
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

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [hoursRange, setHoursRange] = useState("14d");
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    // 1. Fetch the stringified user object from localStorage
    const storedUser = localStorage.getItem("user");
 
    const token = localStorage.getItem("token");
    console.log("Fetched from localStorage:", { storedUser, token });
    // 2. Security Check: If no token exists, boot them back to login
    if (!token || !storedUser) {
      console.warn("Unauthorized access attempt. Redirecting...");
      //navigate("/login");
      return;
    }

    try {
      // 3. Parse the JSON string back into a JavaScript object
      const userObj = JSON.parse(storedUser);
      // const emailObj = JSON.parse(storedEmail);

      // 4. Update state with user info
      if (userObj && userObj.username && userObj.email && userObj.userId) {
        setUsername(userObj.username);
        setEmail(userObj.email);
        setUserId(userObj.userId);
      }

      console.log("User data loaded successfully:", { username: userObj.username, email: userObj.email, userId: userObj.userId });
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [navigate]);

  // Days for heatmap
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const heatmapCols = 24; // Mock columns

  const badges = [
    { icon: "🔥", title: "On a Roll", desc: "3-day study streak", earned: false },
    { icon: "⚡", title: "Week Warrior", desc: "7-day study streak", earned: false },
    { icon: "🏆", title: "Unstoppable", desc: "30-day study streak", earned: false },
    { icon: "🍅", title: "Getting Started", desc: "10 focus sessions", earned: false },
    { icon: "💪", title: "Focused", desc: "50 focus sessions", earned: false },
    { icon: "💯", title: "Centurion", desc: "100 focus sessions", earned: false },
    { icon: "☑️", title: "First Blood", desc: "First problem solved", earned: false },
    { icon: "🧠", title: "Problem Solver", desc: "10 problems solved", earned: false },
    { icon: "🥷", title: "Coding Ninja", desc: "25 problems solved", earned: false },
    { icon: "📅", title: "Daily Starter", desc: "3-day daily challenge streak", earned: false },
    { icon: "🗓️", title: "Daily Regular", desc: "7-day daily challenge streak", earned: false },
    { icon: "🔥", title: "Daily Devotee", desc: "30-day daily challenge streak", earned: false },
  ];

  return (
    <>
        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}

        <main className="shell-main-content route-transition" style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0, backgroundColor: "var(--bg)" }}>
            
            {/* Header Profile Info */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                <div className="ui-avatar ui-avatar-lg" style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#0d9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, border: "none", boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 16px" }}>
                  M
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
                <StatCard icon={<IcoStar s={16}/>} label="Problems Solved" value="0" color="#facc15" gradient="linear-gradient(90deg, #facc15, #eab308)" />
              </div>

              {/* Tabs */}
              <div style={{ marginBottom: 20 }}>
                <div className="ui-tabs" style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)" }}>
                  {[
                    { id: "Overview", icon: IcoBar },
                    { id: "Study", icon: IcoBookOpen },
                    { id: "Coding", icon: IcoCode },
                    { id: "Settings", icon: IcoSettings },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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

              {/* Tab Content: OVERVIEW */}
              {activeTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  
                  {/* Study hours chart */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Study hours</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>0.1h total</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setHoursRange("7d")} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: hoursRange === "7d" ? "1px solid var(--accent)" : "1px solid var(--border)", backgroundColor: hoursRange === "7d" ? "rgba(99,102,241,0.1)" : "transparent", color: hoursRange === "7d" ? "var(--accent)" : "var(--text-muted)", transition: "0.12s" }}>7d</button>
                        <button onClick={() => setHoursRange("14d")} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: hoursRange === "14d" ? "1px solid var(--accent)" : "1px solid var(--border)", backgroundColor: hoursRange === "14d" ? "rgba(99,102,241,0.1)" : "transparent", color: hoursRange === "14d" ? "var(--accent)" : "var(--text-muted)", transition: "0.12s" }}>14d</button>
                        <button onClick={() => setHoursRange("30d")} style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: hoursRange === "30d" ? "1px solid var(--accent)" : "1px solid var(--border)", backgroundColor: hoursRange === "30d" ? "rgba(99,102,241,0.1)" : "transparent", color: hoursRange === "30d" ? "var(--accent)" : "var(--text-muted)", transition: "0.12s" }}>30d</button>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
                      {hoursRange === "7d" && ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                        <div key={day} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                          <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end" }}>
                            <div style={{ width: "100%", borderRadius: "5px 5px 0px 0px", background: day === "Fri" ? "linear-gradient(rgb(129, 140, 248), rgb(99, 102, 241))" : "var(--surface-2)", height: day === "Fri" ? "10px" : "4px", boxShadow: day === "Fri" ? "0 -4px 12px rgba(99,102,241,0.3)" : "none", transition: "height 0.4s" }}></div>
                          </div>
                          <span style={{ fontSize: 10, color: day === "Fri" ? "var(--accent)" : "var(--text-muted)", fontWeight: day === "Fri" ? 700 : 500, whiteSpace: "nowrap" }}>{day}</span>
                        </div>
                      ))}
                      
                      {hoursRange === "14d" && ["5/16", "5/17", "5/18", "5/19", "5/20", "5/21", "5/22", "5/23", "5/24", "5/25", "5/26", "5/27", "5/28", "5/29"].map((day, i) => (
                        <div key={day} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", position: "relative" }}>
                          {day === "5/29" && <div style={{ position: "absolute", top: 10, fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>0.1h</div>}
                          <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end" }}>
                            <div style={{ width: "100%", borderRadius: "5px 5px 0px 0px", background: day === "5/29" ? "linear-gradient(rgb(129, 140, 248), rgb(99, 102, 241))" : "var(--surface-2)", height: day === "5/29" ? "10px" : "4px", boxShadow: day === "5/29" ? "0 -4px 12px rgba(99,102,241,0.3)" : "none", transition: "height 0.4s" }}></div>
                          </div>
                          <span style={{ fontSize: 10, color: day === "5/29" ? "var(--accent)" : "var(--text-subtle)", fontWeight: day === "5/29" ? 700 : 400, whiteSpace: "nowrap" }}>{day}</span>
                        </div>
                      ))}

                      {hoursRange === "30d" && ["2 May", "9 May", "16 May", "This wk"].map((day, i) => (
                        <div key={day} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", position: "relative" }}>
                          <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end", padding: "0 4px" }}>
                            <div style={{ width: "100%", borderRadius: "5px 5px 0px 0px", background: day === "This wk" ? "linear-gradient(rgb(129, 140, 248), rgb(99, 102, 241))" : "var(--surface-2)", height: day === "This wk" ? "10px" : "4px", boxShadow: day === "This wk" ? "0 -4px 12px rgba(99,102,241,0.3)" : "none", transition: "height 0.4s" }}></div>
                          </div>
                          <span style={{ fontSize: 10, color: day === "This wk" ? "var(--accent)" : "var(--text-muted)", fontWeight: day === "This wk" ? 700 : 500, whiteSpace: "nowrap" }}>{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Heatmap */}
                  <div className="analytics-heatmap-scroll" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", overflowX: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Activity</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>1 active days</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><IcoFlame s={12} style={{ color: "#eab308" }} /> Longest: 1d</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>Less</span>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "var(--surface-2)" }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "rgba(99, 102, 241, 0.2)" }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "rgba(99, 102, 241, 0.45)" }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "rgba(99, 102, 241, 0.7)" }}></div>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "rgb(99, 102, 241)" }}></div>
                        <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>More</span>
                      </div>
                    </div>
                    
                    <div style={{ position: "relative" }}>
                      <div style={{ display: "flex", position: "relative", height: 16, marginBottom: 5, marginLeft: 22 }}>
                        {months.map((m, i) => (
                          <div key={m} style={{ position: "absolute", left: i * 64, fontSize: 10, color: "var(--text-subtle)", whiteSpace: "nowrap" }}>{m}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 6 }}>
                          {daysOfWeek.map((d, i) => (
                            <div key={d} style={{ width: 14, height: 13, fontSize: 9, color: "var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "flex-end", opacity: i % 2 === 1 ? 1 : 0 }}>{d}</div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                          {Array.from({ length: heatmapCols }).map((_, cIndex) => (
                            <div key={cIndex} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              {Array.from({ length: 7 }).map((_, rIndex) => {
                                // Light up the very last block for "1 active days"
                                const isActive = cIndex === heatmapCols - 1 && rIndex === 1;
                                return (
                                  <div key={rIndex} style={{ width: 13, height: 13, borderRadius: 3, backgroundColor: isActive ? "rgb(99, 102, 241)" : "var(--surface-2)", opacity: 1, cursor: "default", transition: "background-color 0.1s" }}></div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                        <IcoAward s={16} />
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Badges</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>— 0 / 12 earned</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {badges.map((b, i) => (
                        <BadgeCard key={i} icon={b.icon} title={b.title} desc={b.desc} earned={b.earned} />
                      ))}
                    </div>
                  </div>
                  
                </div>
              )}

              {/* Tab Content: STUDY */}
              {activeTab === "Study" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 12 }}>
                    <StatCard icon={<IcoTarget s={16}/>} label="Total sessions" value="0" color="rgb(99, 102, 241)" />
                    <StatCard icon={<IcoTrendingUp s={16}/>} label="This week" value="0" unit="h" color="rgb(16, 185, 129)" />
                    <StatCard icon={<IcoZap s={16}/>} label="Today" value="0" unit=" sessions" color="rgb(245, 158, 11)" />
                    <StatCard icon={<IcoFlame s={16}/>} label="Longest streak" value="0" unit="d" color="rgb(249, 115, 22)" />
                  </div>

                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "64px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div style={{ marginBottom: 16, color: "var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoBookOpen s={36} /></div>
                    <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>No room history yet</p>
                    <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-muted)", maxWidth: 300, lineHeight: 1.55 }}>Complete a study session to see your room breakdown.</p>
                    <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.12s" }}>Go to Home</button>
                  </div>
                </div>
              )}

              {/* Tab Content: CODING */}
              {activeTab === "Coding" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 12 }}>
                    <StatCard icon={<IcoCheckCircle s={16}/>} label="Solved" value="0" color="rgb(16, 185, 129)" />
                    <StatCard icon={<IcoCheckCircle s={16}/>} label="Attempted" value="0" color="rgb(245, 158, 11)" />
                    <StatCard icon={<IcoCheckCircle s={16}/>} label="Accept rate" value="—" color="rgb(99, 102, 241)" />
                  </div>

                  {/* Problems Section */}
                  <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Problems</span>
                      <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--accent-text)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View all <IcoChevron s={12} rotate="-90"/></button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "var(--accent-bg)", color: "var(--accent)", border: "1px solid rgba(99, 102, 241, 0.4)", cursor: "pointer" }}>All</button>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>✓ Solved</button>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>· In progress</button>
                      
                      <div style={{ width: 1, height: 16, backgroundColor: "var(--border)", margin: "0 4px", alignSelf: "center" }}></div>
                      
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "var(--accent-bg)", color: "var(--accent)", border: "1px solid rgba(99, 102, 241, 0.4)", cursor: "pointer" }}>All diff</button>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>Easy</button>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>Medium</button>
                      <button style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>Hard</button>
                    </div>

                    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                      <div style={{ marginBottom: 16, color: "var(--text-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoCode s={36} /></div>
                      <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>No problems attempted yet</p>
                      <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)", maxWidth: 300, lineHeight: 1.55 }}>Start practicing to track your coding progress.</p>
                      <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Browse problems</button>
                    </div>
                  </div>

                  {/* Advanced Analytics */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ color: "var(--accent)" }}><IcoStar s={14}/></span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Advanced Analytics</span>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, backgroundColor: "rgba(99, 102, 241, 0.2)", color: "var(--accent)" }}>PRO</span>
                    </div>

                    <div style={{ position: "relative", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
                      
                      {/* Blurred background mockup */}
                      <div style={{ position: "absolute", inset: 0, opacity: 0.1, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, padding: 24 }}>
                        {Array.from({length: 10}).map((_, i) => (
                           <div key={i} style={{ backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][i%5], borderRadius: 8, height: "100%" }}></div>
                        ))}
                      </div>

                      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px", textAlign: "center", backgroundColor: "rgba(11, 13, 20, 0.4)", backdropFilter: "blur(12px)" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                          <IcoLock s={24} />
                        </div>
                        <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "white" }}>Advanced Analytics</h3>
                        <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-muted)", maxWidth: 440, lineHeight: 1.6 }}>Interview readiness score, topic mastery heatmap, difficulty ceiling, 8-week progress curve, and personalised weakness recommendations — see exactly where to focus next.</p>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 28 }}>
                          {["Readiness score", "Topic heatmap", "Difficulty ceiling", "Weekly trend", "Weakness recs"].map((pill, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "rgba(0,0,0,0.4)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.05)" }}>
                              {i===0 && <IcoTarget s={12} color="var(--accent)"/>}
                              {i===1 && <IcoBar s={12} color="var(--accent)"/>}
                              {i===2 && <IcoTarget s={12} color="var(--accent)"/>}
                              {i===3 && <IcoTrendingUp s={12} color="var(--accent)"/>}
                              {i===4 && <IcoStar s={12} color="var(--accent)"/>}
                              {pill}
                            </div>
                          ))}
                        </div>

                        <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Upgrade to Pro <IcoChevron s={14} rotate="-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: SETTINGS */}
              {activeTab === "Settings" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  
                  <SettingsSection title="ACCOUNT">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div className="ui-avatar ui-avatar-lg" style={{ width: 56, height: 56, borderRadius: 16, border: "2px solid var(--bg)" }}>
                        <img alt={username} src="https://lh3.googleusercontent.com/a/ACg8ocJOHQ3CBE3KjE6jm37Rh6DZ1INAG8-i1M7xZZNfvCYrlZHgTg=s96-c" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{username}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>{email}</div>
                        <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>Cannot change email — see sign-in methods below</div>
                      </div>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="APPEARANCE">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Theme</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Switch between light and dark mode</div>
                      </div>
                      <button title="Switch to light mode" className="flex-shrink-0 flex items-center cursor-pointer" style={{ width: 44, height: 24, borderRadius: 99, border: "1px solid var(--border)", backgroundColor: "rgb(26,26,26)", padding: 2 }}>
                        <span className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, backgroundColor: "rgb(99,102,241)", transform: "translateX(0px)", transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", fontSize: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>🌙</span>
                      </button>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="NOTIFICATIONS">
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>Browser notifications are used for Pomodoro timer alerts. You'll be prompted when you join a room. Friend requests and invites appear in the notification bell in the top bar.</p>
                  </SettingsSection>

                  <SettingsSection title="SIGN-IN METHODS" noBg>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#4285F4" }}>G</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Google</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{email}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, backgroundColor: "rgba(16, 185, 129, 0.1)", color: "rgb(16, 185, 129)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                          <IcoCheck s={12} /> Connected
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                            <IcoMoreHorizontal s={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Email + password</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Not set — sign in only with Google for now</div>
                          </div>
                        </div>
                        <button style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: "var(--accent)", color: "white", border: "none", cursor: "pointer" }}>Set password</button>
                      </div>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="BILLING">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>Free tier</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Study rooms, coding practice, pair coding, and leaderboard — all free, forever.</div>
                      </div>
                      <button style={{ padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))", color: "white", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>See Pro pricing</button>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="ACCOUNT ACTIONS">
                    <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", cursor: "pointer", transition: "background-color 0.1s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
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
