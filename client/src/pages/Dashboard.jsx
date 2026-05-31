import { useState,  useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolveVelocityChart = () => {
  return (
    <div style={{ position: "relative", height: 180, width: "100%", marginTop: 30, display: "flex", flexDirection: "column" }}>
      {/* Y-axis labels */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", zIndex: 10 }}>
        <span style={{ transform: "translateY(-50%)" }}>1</span>
        <span style={{ transform: "translateY(50%)" }}>0</span>
      </div>
      
      {/* SVG Chart Area */}
      <div style={{ position: "absolute", left: 24, right: 8, top: 0, bottom: 20 }}>
        {/* Horizontal grid lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: "var(--border)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, backgroundColor: "var(--border)" }} />
        
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="solve-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Daily Line Area */}
          <polygon points="0,100 95,100 100,0 100,100" fill="url(#solve-grad)" />
          
          {/* Daily Line (solid purple) */}
          <polyline points="0,100 95,100 100,0" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          
          {/* 7-day Avg Line (dashed pink) */}
          <polyline points="0,100 95,100 100,80" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3,3" strokeLinejoin="round" strokeLinecap="round" />
          
          {/* Peak Dot */}
          <circle cx="100" cy="0" r="3" fill="#6366f1" />
          <circle cx="100" cy="0" r="8" fill="#6366f1" opacity="0.25" />
        </svg>
      </div>

      {/* X-axis labels */}
      <div style={{ position: "absolute", left: 24, right: 8, bottom: -4, display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
        <span>30d</span>
        <span>23d</span>
        <span>16d</span>
        <span>9d</span>
        <span>today</span>
      </div>
    </div>
  );
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────


const IcoChevRight = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>;

const IcoPlus = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const IcoFlame = ({ s = 24, style: st }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={st}><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" /></svg>;
const IcoTimer = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>;
const IcoCheck = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
const IcoArrow = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const IcoMsg = ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /></svg>;
const IcoBookOpen = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>;
const IcoSparkles = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>;

// ── Daily challenge banner ────────────────────────────────────────────────────
function DailyChallenge() {
  const navigate = useNavigate();
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

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
            Factorial
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", textTransform: "capitalize" }}>
              easy
            </span>
          </div>
        </div>

        {/* Solve button */}
        <div
          onClick={() => navigate("/practice/playground")}
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


// ── Hero greeting card ────────────────────────────────────────────────────────
function HeroCard({ onStartFocus, username, streak }) {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

  // Mock global state (replace with real Auth/API context later)
  const currentUser = { name: "Mayur" };

  return (
    <div
      className="hero-analytics rounded-[18px] relative overflow-hidden"
      style={{
        padding: 24,
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 60%, transparent 100%), var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 280px",
        gap: 24,
        alignItems: "stretch",
      }}
    >
      <div className="min-w-0">
        {/* Live day label */}
        <div
          className="inline-flex items-center"
          style={{ gap: 8, fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}
        >
          <span
            className="live-dot"
            style={{ width: 6, height: 6, borderRadius: 3, background: "var(--success)", display: "inline-block" }}
          />
          {day}
        </div>

        <h1 style={{ margin: 0, fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.6px", lineHeight: 1.18 }}>
          {greeting}, {username || currentUser.name}! here's where you are this week.
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-muted)", maxWidth: 580, lineHeight: 1.55 }}>
          {streak}-day streak going. Start a session to keep it.
        </p>

        <div className="flex flex-wrap" style={{ gap: 10, marginTop: 20 }}>
          <button
            onClick={onStartFocus}
            className="inline-flex items-center cursor-pointer"
            style={{ gap: 8, padding: "11px 18px", borderRadius: 10, background: "#6366f1", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px", boxShadow: "0 8px 20px rgba(99,102,241,0.267)", fontFamily: "inherit" }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Resume · Focus session
          </button>
          <button
            onClick={() => navigate("/practice/problems")}
            className="inline-flex items-center cursor-pointer"
            style={{ gap: 6, padding: "11px 14px", borderRadius: 10, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}
          >
            View daily problem <IcoArrow s={12} />
          </button>
        </div>
      </div>
      
      {/* CURRENT STREAK CARD */}
      <div style={{
        padding: "18px 22px",
        borderRadius: 14,
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04))",
        backgroundColor: "var(--surface)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IcoFlame s={14} style={{ color: "#fbbf24" }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "#fbbf24", textTransform: "uppercase" }}>CURRENT STREAK</span>
        </div>
        
        {/* Streak number */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
          <span style={{ 
            fontSize: 46, fontWeight: 800, lineHeight: 1,
            background: "linear-gradient(180deg, #fef08a, #fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>{streak}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>day</span>
        </div>

        {/* Milestone boxes */}
        <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
          {Array.from({ length: 11 }).map((_, i) => (
             <div key={i} style={{ flex: 1, height: 16, borderRadius: 4, background: "rgba(245, 158, 11, 0.35)" }} />
          ))}
          <div style={{ 
            flex: 1, height: 16, borderRadius: 4, 
            background: "linear-gradient(180deg, #fbbf24, #f43f5e)",
            boxShadow: "0 0 12px rgba(244, 63, 94, 0.5)"
          }} />
        </div>

        {/* Footer text */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 4 }}>
          Next milestone: <span style={{ color: "var(--text)", fontWeight: 700 }}>3 days</span> · 2 to go
        </div>
      </div>
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: IconComp, iconBg, iconColor, label, value, sub }) {
  return (
    <div
      className="flex flex-col min-w-0"
      style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", gap: 10, boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <span
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, borderRadius: 9, background: iconBg, color: iconColor }}
        >
          <IconComp s={14} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.7px", lineHeight: 1 }}>{value}</div>
        {sub && (
          <div className="flex items-center flex-wrap" style={{ gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty chart placeholder ───────────────────────────────────────────────────
function ChartEmpty({ msg, py = "26px 12px" }) {
  return (
    <div style={{ padding: py, textAlign: "center", color: "var(--text-muted)", fontSize: 12, lineHeight: 1.55 }}>
      {msg}
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch the stringified user object from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log("Raw user data from localStorage:", storedUser);
    console.log("Token from localStorage:", token);
    // 2. Security Check: If no token exists, boot them back to login
    if (!token || !storedUser) {
      console.warn("Unauthorized access attempt. Redirecting...");
      //navigate("/login");
      return;
    }

    try {
      // 3. Parse the JSON string back into a JavaScript object
      const userObj = JSON.parse(storedUser);
      
      if (userObj && userObj.username) {
        setUsername(userObj.username);
      }
      if (userObj && userObj.email) {
        setEmail(userObj.email);
      }
      if (userObj && userObj.userId) {
        setUserId(userObj.userId);
      }
      if (userObj && userObj.streak){
        setStreak(userObj.streak);
      }
      console.log("User data loaded successfully:", { username: userObj.username, email: userObj.email, userId: userObj.userId, streak: userObj.streak });
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [navigate]);



  const handleStartFocus = () => {
    const id = Math.random().toString(36).slice(2, 8);
    const room = {
      id,
      name: "Focus session",
      icon: "📚",
      color: "#7c6fe0",
      goal: "First focus block",
      focusMin: 5,
      breakMin: 5,
      expires: "24h",
      createdAt: Date.now(),
      members: 1
    };
    sessionStorage.setItem("currentRoom", JSON.stringify(room));
    const existingRooms = JSON.parse(localStorage.getItem("myRooms") || "null");
    if (!existingRooms) {
      const defaults = [
        { id: "ffaaae", name: "try", icon: "📚", color: "#6366f1", goal: "", focusMin: 90, breakMin: 15, left: "23H 59M", members: 1 },
        { id: "f3e62f", name: "try", icon: "🟡", color: "#f59e0b", goal: "work should be completed", focusMin: 90, breakMin: 15, left: "23H 56M", members: 1 },
      ];
      localStorage.setItem("myRooms", JSON.stringify([...defaults, room]));
    } else {
      existingRooms.push(room);
      localStorage.setItem("myRooms", JSON.stringify(existingRooms));
    }
    if (window.addNotification) window.addNotification(`You successfully created the room "${room.name}".`);
    navigate(`/room/${id}`);
  };

  return (
    <>
        <main
          className="shell-main-content route-transition"
          style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0 }}>
            <div
              style={{
                maxWidth: 1240,
                margin: "0 auto",
                padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,28px) 48px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Daily challenge */}
              <DailyChallenge />

              {/* Hero greeting */}
              <HeroCard onStartFocus={handleStartFocus} username={username} streak={streak} />

              {/* KPI row */}
              <div className="kpi-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                <KpiCard icon={IcoTimer} iconBg="var(--accent-bg)" iconColor="var(--accent)" label="Focus this week" value="0h" />
                <KpiCard icon={IcoTimer} iconBg="rgba(16,185,129,0.12)" iconColor="#10b981" label="Pomodoros today" value="0" sub="0 total" />
                <KpiCard icon={IcoCheck} iconBg="rgba(139,92,246,0.12)" iconColor="#8b5cf6" label="Solved this month" value="0" sub="0 of 50 all-time" />
              </div>

              {/* Charts row */}
              <div className="home-charts-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 16 }}>
                {/* When you study best */}
                <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column" }}>
                  <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 14, gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.1px" }}>When you study best</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Last 7 weeks · darker = more focus minutes</div>
                    </div>
                    <div className="flex items-center" style={{ gap: 6, fontSize: 10, color: "var(--text-muted)" }}>
                      <span>less</span>
                      {[0.15, 0.35, 0.55, 0.75, 0.95].map((op, i) => (
                        <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: `rgb(99,102,241)`, opacity: op, border: "1px solid rgba(255,255,255,0.05)", display: "inline-block" }} />
                      ))}
                      <span>more</span>
                    </div>
                  </div>
                  
                  {/* Heatmap Grid */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: 8 }}>
                    <div style={{ display: "flex", paddingLeft: 30, marginBottom: 8 }}>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                        <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flex: 1, gap: 4 }}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 26, paddingBottom: 4, paddingTop: 4 }}>
                        {["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"].map(t => (
                          <div key={t} style={{ fontSize: 10, color: "var(--text-muted)", height: 14, display: "flex", alignItems: "center" }}>{t}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", flex: 1, gap: 4 }}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, colIdx) => (
                          <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                            {Array.from({ length: 9 }).map((_, rowIdx) => {
                              const isFriday = colIdx === 4;
                              return (
                                <div
                                  key={rowIdx}
                                  style={{
                                    flex: 1,
                                    borderRadius: 4,
                                    border: "1px solid rgba(255,255,255,0.02)",
                                    background: isFriday ? "rgba(99, 102, 241, 0.85)" : "var(--surface-2)"
                                  }}
                                />
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 24, fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                    Peak window: <span style={{ color: "var(--text)", fontWeight: 700 }}>Fri · 6a–8a</span>
                  </div>
                </div>

                {/* Subject mix */}
                <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Subject mix</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Where your hours go</div>
                  </div>
                  
                  {/* Doughnut Chart */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
                    <div style={{ position: "relative", width: 140, height: 140 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="70" cy="70" r="54" fill="none" stroke="var(--surface-2)" strokeWidth="16" />
                        {/* 100% stroke */}
                        <circle cx="70" cy="70" r="54" fill="none" stroke="#6366f1" strokeWidth="16" strokeDasharray="339.292" strokeDashoffset="0" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>0.1h</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "1px", marginTop: 2 }}>RECORDED</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "#6366f1" }} />
                      <span style={{ fontSize: 12 }}>📚</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>First focus block</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
                      <span style={{ color: "var(--text-muted)" }}>0.1h</span>
                      <span style={{ color: "var(--text-muted)" }}>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solve velocity */}
              <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 8, gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Solve velocity</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Problems solved per day · last 30 days</div>
                  </div>
                  <div className="flex items-center flex-wrap" style={{ gap: 14, fontSize: 11 }}>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span style={{ width: 18, height: 3, background: "#6366f1", borderRadius: 2, display: "inline-block" }} />
                      <span style={{ color: "var(--text-muted)" }}>Daily</span>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span style={{ width: 18, height: 0, borderTop: "2px dashed #ec4899", display: "inline-block" }} />
                      <span style={{ color: "var(--text-muted)" }}>7-day avg</span>
                    </div>
                  </div>
                </div>
                <SolveVelocityChart />
              </div>

              {/* Insights Section */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text)" }}>
                    <IcoSparkles s={16} />
                    <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.2px" }}>Insights for this week</span>
                  </div>
                  <div style={{
                    padding: "2px 8px", borderRadius: 99, background: "rgba(99,102,241,0.15)",
                    color: "#818cf8", fontSize: 10, fontWeight: 800, letterSpacing: "1px"
                  }}>
                    AUTO
                  </div>
                </div>
                
                <div style={{
                  padding: 20, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)", display: "flex", gap: 16, alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10,
                    background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#818cf8"
                  }}>
                    <IcoSparkles s={18} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                      Afternoons are your superpower
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: 640 }}>
                      You log most focus minutes in the afternoon. Locking in a 25-min block here clears today's plan in one sitting.
                    </div>
                    <button
                      onClick={() => window.dispatchEvent(new Event("open-create-room-modal"))}
                      style={{
                        marginTop: 4, background: "transparent", border: "none", padding: 0,
                        color: "#6366f1", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start"
                      }}
                    >
                      Schedule a focus block <IcoChevRight s={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      <style>{`
        .live-dot { animation: pulse-green 1.6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .hero-analytics  { grid-template-columns: minmax(0,1fr) !important; }
          .kpi-row         { grid-template-columns: repeat(2,1fr) !important; }
          .home-charts-row { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>
    </>
  );
}
