import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoBar = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M5 21v-6" /><path d="M12 21V3" /><path d="M19 21V9" /></svg>;
const IcoCode = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>;
const IcoBookOpen = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>;
const IcoSettings = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IcoFlame = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>;
const IcoClock = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const IcoTarget = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const IcoStar = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>;
const IcoLogout = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>;
const IcoShare = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>;
const IcoCheck = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IcoAward = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const IcoTrendingUp = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
const IcoZap = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>;
const IcoSparkle = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 c0 3.5 -2.5 6 -6 6 c3.5 0 6 2.5 6 6 c0 -3.5 2.5 -6 6 -6 c-3.5 0 -6 -2.5 -6 -6 z" /><path d="M19 3v4M17 5h4" /><circle cx="5" cy="19" r="1" /></svg>;
const IcoGauge = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 16A10 10 0 1 1 20.66 16" /></svg>;
const IcoGrid = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>;
const IcoTrend = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
const IcoArrowRight = ({ s = 16, color = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const IcoLock = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;

// ── Helpers ───────────────────────────────────────────────────────────────────
const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });

// Convert minutes to hours string e.g. 90 → "1.5h"
const minsToHours = (mins) => mins != null ? `${(mins / 60).toFixed(1)}h` : "0.0h";
const minsToHoursNum = (mins) => mins != null ? parseFloat((mins / 60).toFixed(1)) : 0;

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, color, gradient }) {
  return (
    <div style={{ position: "relative", padding: "18px 20px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: gradient || color }}></div>
      <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color }}>
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
      <div style={{ fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", filter: earned ? "none" : "grayscale(100%) opacity(0.6)" }}>{icon}</div>
      <div className="min-w-0">
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap" }}>{desc}</div>
      </div>
    </div>
  );
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ onClose, username, solvedCount, streak, totalHours, totalSessions }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `📚 ${username} on Study Room\n🔥 ${streak}-day streak\n⏰ ${totalHours}h studied\n🎯 ${totalSessions} sessions\n✅ ${solvedCount} problems solved\nstudyroom.co.in`;
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(true);
    if (window.addNotification) window.addNotification("Stats copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 460, background: "#12151c", border: "1px solid #1e2433", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", color: "#e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Share your stats</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 18, lineHeight: 1, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}>✕</button>
        </div>
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ background: "linear-gradient(135deg, rgb(99,102,241), rgb(139,92,246))", borderRadius: 16, padding: "36px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "white", boxShadow: "0 12px 32px rgba(99,102,241,0.25)" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📚</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>{streak}</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>day streak</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 32 }}>{username} on Study Room</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%", marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{totalHours}h</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hours</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{totalSessions}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sessions</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 8px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{solvedCount}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Solved</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>studyroom.co.in</div>
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>Click "Copy stats" to copy your achievement text to clipboard.</div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "16px 24px", borderTop: "1px solid #1e2433" }}>
          <button onClick={onClose} style={{ flex: "0 0 auto", padding: "11px 24px", borderRadius: 10, border: "1px solid #1e2433", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", fontSize: 13, fontWeight: 600, cursor: "pointer", minWidth: 100 }}>Close</button>
          <button onClick={handleCopy} style={{ flex: 1, padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {copied ? <IcoCheck s={14} /> : <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
            {copied ? "Copied!" : "Copy stats"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Study Hours Chart ─────────────────────────────────────────────────────────
function StudyHoursChart({ sessions }) {
  const [range, setRange] = useState("7d");

  // Build chart data from real sessions
  const buildData = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Map sessions to date → hours
    const dateMap = {};
    (sessions || []).forEach(s => {
      const d = new Date(s.startTime || s.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const hrs = minsToHoursNum(s.durationMinutes || s.duration || 0);
      dateMap[key] = (dateMap[key] || 0) + hrs;
    });

    const getDayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const getDayName = (date) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    const fmtDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    const monthName = (date) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];

    if (range === "7d") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const hrs = dateMap[getDayKey(d)] || 0;
        return { label: getDayName(d), hours: hrs, active: i === 6 };
      });
    }
    if (range === "14d") {
      return Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (13 - i));
        const hrs = dateMap[getDayKey(d)] || 0;
        return { label: fmtDate(d), hours: hrs, active: i === 13 };
      });
    }
    // 30d → weekly buckets
    return Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      let hrs = 0;
      for (let dd = 0; dd < 7; dd++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + dd);
        hrs += dateMap[getDayKey(d)] || 0;
      }
      return {
        label: i === 0 ? "This wk" : `${weekEnd.getDate()} ${monthName(weekEnd)}`,
        hours: hrs,
        active: i === 0
      };
    }).reverse();
  };

  const data = buildData();
  const maxHours = Math.max(...data.map(d => d.hours), 0.1);
  const totalHours = data.reduce((s, d) => s + d.hours, 0).toFixed(1);
  const maxBarPx = 70;

  return (
    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
      <div className="chart-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Study hours</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{totalHours}h total</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["7d", "14d", "30d"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer", backgroundColor: range === r ? "var(--accent-bg)" : "transparent", color: range === r ? "var(--accent)" : "var(--text-muted)", border: range === r ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border)" }}>{r}</button>
          ))}
        </div>
      </div>
      <div className="study-hours-chart-scroll" style={{ width: "100%", overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110, minWidth: range === "14d" ? 480 : 280 }}>
          {data.map((item, idx) => {
            const barHeight = item.hours > 0 ? Math.max(8, (item.hours / maxHours) * maxBarPx) : 4;
            return (
              <div key={idx} style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", position: "relative" }}>
                {item.hours > 0 && <div style={{ position: "absolute", top: 10, fontSize: 10, color: item.active ? "var(--accent)" : "var(--text-muted)", fontWeight: 700 }}>{item.hours.toFixed(1)}h</div>}
                <div style={{ flex: "1 1 0%", width: "100%", display: "flex", alignItems: "flex-end", position: "relative", padding: range === "14d" ? "0 2px" : "0 10px" }}>
                  <div style={{ width: "100%", borderRadius: "5px 5px 0 0", background: item.hours > 0 ? "linear-gradient(rgb(129,140,248), rgb(99,102,241))" : "var(--surface-2)", height: `${barHeight}px` }}></div>
                </div>
                <div style={{ width: "100%", height: 2, backgroundColor: item.active ? "var(--accent)" : "var(--surface-2)", marginBottom: 4, borderRadius: 2 }}></div>
                <span style={{ fontSize: 11, color: item.active ? "var(--accent)" : "var(--text-subtle)", fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Activity Heatmap ──────────────────────────────────────────────────────────
function ActivityHeatmap({ sessions }) {
  // Build a map of date-key → total minutes
  const activityMap = {};
  (sessions || []).forEach(s => {
    const d = new Date(s.startTime || s.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    activityMap[key] = (activityMap[key] || 0) + (s.durationMinutes || s.duration || 0);
  });

  // Build 32 weeks × 7 days grid ending today
  const today = new Date();
  const COLS = 32;
  const grid = [];
  for (let col = COLS - 1; col >= 0; col--) {
    const days = [];
    for (let row = 6; row >= 0; row--) {
      const d = new Date(today);
      d.setDate(today.getDate() - col * 7 - row);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const mins = activityMap[key] || 0;
      days.push({ date: d, mins, key });
    }
    grid.push(days);
  }

  const getColor = (mins) => {
    if (mins === 0) return "var(--surface-2)";
    if (mins < 30) return "rgba(99,102,241,0.3)";
    if (mins < 60) return "rgba(99,102,241,0.6)";
    if (mins < 120) return "rgba(99,102,241,0.8)";
    return "rgb(99,102,241)";
  };

  const activeDays = Object.keys(activityMap).length;
  const longestStreak = (() => {
    let max = 0, cur = 0;
    for (let i = 0; i < COLS * 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (activityMap[key]) { cur++; max = Math.max(max, cur); } else cur = 0;
    }
    return max;
  })();

  // Month labels for top
  const monthLabels = [];
  const seenMonths = new Set();
  grid.forEach((col, ci) => {
    const m = col[0].date.getMonth();
    if (!seenMonths.has(m)) {
      seenMonths.add(m);
      monthLabels.push({ ci, label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m] });
    }
  });

  return (
    <div className="analytics-heatmap-scroll" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, minWidth: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Activity</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{activeDays} active day{activeDays !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}><IcoFlame s={14} color="#f97316" /> Longest: {longestStreak}d</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
          Less
          {["var(--surface-2)", "rgba(99,102,241,0.3)", "rgba(99,102,241,0.6)", "rgba(99,102,241,0.8)", "rgb(99,102,241)"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c }}></div>
          ))}
          More
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 10, paddingTop: 20, paddingBottom: 2, fontSize: 10, color: "var(--text-muted)" }}>
          <span>Mo</span><span>We</span><span>Fr</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Month row */}
          <div style={{ display: "flex", gap: 3, paddingLeft: 0, fontSize: 10, color: "var(--text-muted)", marginBottom: 4, position: "relative", height: 14 }}>
            {grid.map((col, ci) => {
              const lbl = monthLabels.find(m => m.ci === ci);
              return <div key={ci} style={{ width: 12, flexShrink: 0, fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{lbl ? lbl.label : ""}</div>;
            })}
          </div>
          {/* Day rows */}
          <div style={{ display: "flex", gap: 3 }}>
            {grid.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {col.map((cell, ri) => (
                  <div key={ri} title={`${cell.key}: ${cell.mins} min`} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: getColor(cell.mins) }}></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coding Tab ────────────────────────────────────────────────────────────────
function CodingTab({ submissions = [], loading = false, error = null }) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");

  const isAccepted = s => s.status === "ACCEPTED" || s.status === "SUCCESS" || s.status === "accepted";
  const solved = submissions.filter(isAccepted).length;
  const acceptRate = submissions.length > 0 ? Math.round((solved / submissions.length) * 100) + "%" : "—";

  const filtered = submissions.filter(sub => {
    const matchDiff = diffFilter === "All" || sub.problem?.difficulty?.toLowerCase() === diffFilter.toLowerCase();
    const matchStatus = statusFilter === "All" || (statusFilter === "Solved" && isAccepted(sub));
    return matchDiff && matchStatus;
  });

  const getDiffColor = d => ({ easy: "#22c55e", medium: "#eab308", hard: "#ef4444" }[d?.toLowerCase()] || "var(--text-muted)");

  if (loading) return <div style={{ color: "var(--text-muted)", padding: 24, textAlign: "center" }}>Loading your progress...</div>;
  if (error) return <div style={{ color: "#ef4444", padding: 24, textAlign: "center" }}>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 12 }}>
        <StatCard icon={<IcoCheck s={16} />} label="Solved" value={solved} color="#10b981" gradient="linear-gradient(90deg,#10b981,#059669)" />
        <StatCard icon={<IcoCheck s={16} />} label="Attempted" value={submissions.length} color="#f59e0b" gradient="linear-gradient(90deg,#f59e0b,#ea580c)" />
        <StatCard icon={<IcoCheck s={16} />} label="Accept rate" value={acceptRate} color="#8b5cf6" gradient="linear-gradient(90deg,#8b5cf6,#6366f1)" />
      </div>

      {/* Problems table */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Problems</span>
          <span onClick={() => navigate("/practice/problems")} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer" }}>View all {">"}</span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {[{ key: "All", label: "All" }, { key: "Solved", label: "✓ Solved" }].map(f => {
            const active = statusFilter === f.key;
            return (
              <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: active ? "rgba(99,102,241,0.15)" : "transparent", color: active ? "var(--accent)" : "var(--text-muted)", border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border)", transition: "0.2s" }}>{f.label}</button>
            );
          })}
          {[{ key: "All", label: "All diff" }, { key: "Easy", label: "Easy", color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)" }, { key: "Medium", label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" }, { key: "Hard", label: "Hard", color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)" }].map(f => {
            const active = diffFilter === f.key;
            const ac = f.color || "var(--accent)";
            const abg = f.bg || "rgba(99,102,241,0.15)";
            const ab = f.border || "rgba(99,102,241,0.4)";
            return (
              <button key={f.key} onClick={() => setDiffFilter(f.key)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: active ? abg : "transparent", color: active ? ac : "var(--text-muted)", border: active ? `1px solid ${ab}` : "1px solid var(--border)", transition: "0.2s" }}>{f.label}</button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>{"</>"}</div>
            <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>No problems attempted yet</p>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-muted)", maxWidth: 300, lineHeight: 1.55 }}>Start practicing to track your coding progress.</p>
            <button onClick={() => navigate("/practice/problems")} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Browse problems</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {["Problem", "Difficulty", "Mode", "Submitted"].map(h => <th key={h} style={{ padding: "10px 8px", fontWeight: 600 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
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

      {/* Advanced Analytics (Pro upsell) */}
      <div style={{ marginTop: 8, paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", color: "rgb(139,92,246)" }}><IcoSparkle s={18} /></span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Advanced Analytics</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", border: "1.5px solid rgba(129,140,248,0.3)", backgroundColor: "rgba(129,140,248,0.1)", padding: "2px 8px", borderRadius: 6, letterSpacing: "0.5px", marginLeft: 4 }}>PRO</span>
        </div>
        <div style={{ position: "relative", width: "100%", borderRadius: 16, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 14, padding: 24 }}>
            {[...Array(12)].map((_, i) => <div key={i} style={{ backgroundColor: `hsl(${[280, 290, 260, 270, 340, 350, 250, 310, 290, 270, 280, 330][i]}, 40%, ${[10, 12, 15, 14, 11, 10, 16, 13, 14, 12, 11, 15][i]}%)`, borderRadius: 16 }}></div>)}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 0%, var(--surface) 80%)" }}></div>
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 640, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #8b5cf6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", marginBottom: 20 }}><IcoLock s={24} /></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Advanced Analytics</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
              Interview readiness score, topic mastery heatmap, difficulty ceiling, 8-week<br />progress curve, and personalised weakness recommendations — see exactly where to focus next.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
              {[{ icon: <IcoGauge s={14} color="#818cf8" />, label: "Readiness score" }, { icon: <IcoGrid s={14} color="#818cf8" />, label: "Topic heatmap" }, { icon: <IcoTarget s={14} color="#818cf8" />, label: "Difficulty ceiling" }, { icon: <IcoTrend s={14} color="#818cf8" />, label: "Weekly trend" }, { icon: <IcoSparkle s={14} color="#818cf8" />, label: "Weakness recs" }].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.4)" }}>
                  {b.icon}<span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{b.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/pricing")} style={{ background: "linear-gradient(135deg, rgb(139,92,246), rgb(99,102,241))", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              Upgrade to Pro <IcoArrowRight s={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Study Tab ─────────────────────────────────────────────────────────────────
function StudyTab({ sessions }) {
  const navigate = useNavigate();

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((s, sess) => s + (sess.durationMinutes || sess.duration || 0), 0);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekMinutes = sessions
    .filter(s => new Date(s.startTime || s.createdAt) >= startOfWeek)
    .reduce((sum, s) => sum + (s.durationMinutes || s.duration || 0), 0);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(s => new Date(s.startTime || s.createdAt) >= todayStart).length;

  // Longest streak in days
  const longestStreak = (() => {
    const dateSet = new Set(sessions.map(s => {
      const d = new Date(s.startTime || s.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));
    let max = 0, cur = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      if (dateSet.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)) { cur++; max = Math.max(max, cur); }
      else cur = 0;
    }
    return max;
  })();

  // Group by room name
  const roomMap = {};
  sessions.forEach(s => {
    const name = s.roomName || s.room?.name || "Study session";
    roomMap[name] = (roomMap[name] || 0) + (s.durationMinutes || s.duration || 0);
  });
  const topRooms = Object.entries(roomMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxRoomMins = topRooms[0]?.[1] || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 12 }}>
        <StatCard icon={<IcoTarget s={16} />} label="Total sessions" value={totalSessions} color="#8b5cf6" gradient="linear-gradient(90deg,#8b5cf6,#6366f1)" />
        <StatCard icon={<IcoTrendingUp s={16} />} label="This week" value={minsToHoursNum(weekMinutes)} unit="h" color="#10b981" gradient="linear-gradient(90deg,#10b981,#059669)" />
        <StatCard icon={<IcoZap s={16} />} label="Today" value={todaySessions} unit="sessions" color="#f59e0b" gradient="linear-gradient(90deg,#f59e0b,#ef4444)" />
        <StatCard icon={<IcoFlame s={16} />} label="Longest streak" value={longestStreak} unit="d" color="#f97316" gradient="linear-gradient(90deg,#f97316,#ea580c)" />
      </div>

      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Top rooms by time</div>
        {topRooms.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>📚</div>
            <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>No room history yet</p>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-muted)" }}>Complete a study session to see your room breakdown.</p>
            <button onClick={() => navigate("/")} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Go to Home</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {topRooms.map(([name, mins]) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>📚 {name}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{minsToHoursNum(mins)}h</span>
                </div>
                <div style={{ width: "100%", height: 6, backgroundColor: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(mins / maxRoomMins) * 100}%`, height: "100%", background: "linear-gradient(90deg, rgb(99,102,241), rgb(139,92,246))", borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ username, email, role, onLogout, navigate }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [signOutHover, setSignOutHover] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "dark");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.getAttribute("data-theme") || "dark"));
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
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    });
    transition.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, { duration: 450, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" });
    });
  };

  const handleSetPassword = async () => {
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters."); return; }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API}/api/auth/set-password`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ password: newPassword })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed to set password"); }
      setPasswordSet(true);
      setShowPasswordForm(false);
      setNewPassword("");
      if (window.addNotification) window.addNotification("Password set successfully!");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };



  const cardStyle = { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" };
  const sectionLabel = { fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 20, textTransform: "uppercase" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Account */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Account</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>
            {username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{username}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{email}</div>
            <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 4 }}>Cannot change email — see sign-in methods below</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Appearance</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Theme</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Switch between light and dark mode</div>
          </div>
          <div onClick={toggleTheme} style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)", position: "relative", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: theme === "dark" ? "rgb(99,102,241)" : "rgb(139,92,246)", position: "absolute", top: 2, left: 2, display: "flex", alignItems: "center", justifyContent: "center", color: theme === "dark" ? "#fcd34d" : "white", fontSize: 12, transition: "all 0.2s", transform: theme === "dark" ? "translateX(0)" : "translateX(18px)" }}>
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Notifications</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Browser notifications are used for Pomodoro timer alerts. You'll be prompted when you join a room. Friend requests and invites appear in the notification bell in the top bar.
        </div>
      </div>

      {/* Sign-in Methods */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Sign-in Methods</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google row */}
          <div className="account-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Google</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{email}</div>
              </div>
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 12, fontWeight: 600, border: "1px solid rgba(16,185,129,0.2)" }}>✓ Connected</div>
          </div>

          {/* Password row */}
          {showPasswordForm ? (
            <div style={{ padding: "20px 24px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Add a password to your account</div>
              <div style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 20 }}>Useful if Google sign-in is ever blocked on your network. You can always sign in with either method.</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>NEW PASSWORD</div>
              <input type="password" placeholder="At least 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, backgroundColor: "var(--surface)", border: "1px solid rgba(139,92,246,0.5)", color: "var(--text)", fontSize: 14, outline: "none", marginBottom: 6, boxSizing: "border-box" }} />
              {passwordError && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{passwordError}</div>}
              <div style={{ fontSize: 12, color: "var(--text-subtle)", marginBottom: 20 }}>Choose 8 or more characters</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={handleSetPassword} disabled={savingPassword} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgb(139,92,246)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", opacity: savingPassword ? 0.6 : 1 }}>{savingPassword ? "Saving..." : "Set password"}</button>
                <button onClick={() => { setShowPasswordForm(false); setPasswordError(""); }} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="account-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: passwordSet ? "#10b981" : "var(--text-muted)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Email + password</div>
                  <div style={{ fontSize: 13, color: "var(--text-subtle)", marginTop: 2 }}>{passwordSet ? "Password set" : "Not set — sign in only with Google for now"}</div>
                </div>
              </div>
              {passwordSet ? (
                <div style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 12, fontWeight: 600, border: "1px solid rgba(16,185,129,0.2)" }}>✓ Connected</div>
              ) : (
                <button onClick={() => setShowPasswordForm(true)} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgb(139,92,246)", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Set password</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Billing */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Billing</div>
        <div className="billing-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {role === "pro" ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Coding Pro plan</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Status: Active</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>₹299 / month</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Free tier</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Study rooms, coding practice, pair coding, and leaderboard — all free, forever.</div>
              </>
            )}
          </div>
          {role !== "pro" && (
            <button onClick={() => navigate("/pricing")} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, rgb(99,102,241), rgb(139,92,246))", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 15px rgba(139,92,246,0.3)" }}>
              See Pro pricing
            </button>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div style={cardStyle}>
        <div style={sectionLabel}>Account Actions</div>
        <button
          onClick={onLogout}
          onMouseEnter={() => setSignOutHover(true)}
          onMouseLeave={() => setSignOutHover(false)}
          style={{ padding: "10px 20px", borderRadius: 8, backgroundColor: signOutHover ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.05)", color: "var(--danger)", border: `1px solid ${signOutHover ? "rgba(239,68,68,0.6)" : "rgba(239,68,68,0.3)"}`, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
        >
          <IcoLogout s={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  // User info
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [streak, setStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [role, setRole] = useState("free");

  // Study sessions & Submissions
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  // ── Load user + profile data ──────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) { navigate("/login"); return; }

    // Optimistic load from localStorage
    try {
      const userObj = JSON.parse(storedUser || "{}");
      setUsername(userObj.username || userObj.name || "");
      setEmail(userObj.email || "");
      if (userObj.streak != null) setStreak(userObj.streak);
      if (userObj.role) setRole(userObj.role);
    } catch (_) { }

    // Fetch fresh profile
    fetch(`${API}/api/auth/profile`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setUsername(data.username || data.name || "");
        setEmail(data.email || "");
        if (data.streak != null) setStreak(data.streak);
        if (data.role) setRole(data.role);
        // Persist updated streak and role
        try {
          const u = JSON.parse(localStorage.getItem("user") || "{}");
          u.streak = data.streak;
          u.role = data.role;
          localStorage.setItem("user", JSON.stringify(u));
        } catch (_) { }
      })
      .catch(console.error);
  }, [navigate]);

  // ── Load study sessions ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/sessions/user/history`, { headers: authHeader() });
        if (res.ok) {
          const data = await res.json();
          setSessions(data.data || data || []);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    })();
  }, []);

  // ── Load submissions history ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/submissions/user/history`, { headers: authHeader() });
        if (res.ok) {
          const data = await res.json();
          const subs = data.data || data || [];
          setSubmissions(subs);
          const solved = subs.filter(s => s.status === "ACCEPTED" || s.status === "SUCCESS" || s.status === "accepted").length;
          setSolvedCount(solved);
        }
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoadingSubmissions(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Derived stats from real sessions
  const totalMinutes = sessions.reduce((s, sess) => s + (sess.durationMinutes || sess.duration || 0), 0);
  const totalHours = minsToHoursNum(totalMinutes);
  const totalSessions = sessions.length;

  // Badges driven by real data
  const badges = [
    { icon: "🔥", title: "On a Roll", desc: "3-day study streak", earned: streak >= 3 },
    { icon: "⚡", title: "Week Warrior", desc: "7-day study streak", earned: streak >= 7 },
    { icon: "🏆", title: "Unstoppable", desc: "30-day study streak", earned: streak >= 30 },
    { icon: "🍅", title: "Getting Started", desc: "10 focus sessions", earned: totalSessions >= 10 },
    { icon: "💪", title: "Focused", desc: "50 focus sessions", earned: totalSessions >= 50 },
    { icon: "💯", title: "Centurion", desc: "100 focus sessions", earned: totalSessions >= 100 },
    { icon: "☑️", title: "First Blood", desc: "First problem solved", earned: solvedCount > 0 },
    { icon: "🧠", title: "Problem Solver", desc: "10 problems solved", earned: solvedCount >= 10 },
    { icon: "🥷", title: "Coding Ninja", desc: "25 problems solved", earned: solvedCount >= 25 },
    { icon: "📅", title: "Daily Starter", desc: "3-day daily challenge streak", earned: streak >= 3 },
    { icon: "🗓️", title: "Daily Regular", desc: "7-day daily challenge streak", earned: streak >= 7 },
    { icon: "🔥", title: "Daily Devotee", desc: "30-day daily challenge streak", earned: streak >= 30 },
  ];
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <>
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          username={username}
          solvedCount={solvedCount}
          streak={streak}
          totalHours={totalHours}
          totalSessions={totalSessions}
        />
      )}

      <main className="shell-main-content route-transition" style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0, backgroundColor: "var(--bg)" }}>

          {/* Header */}
          <div className="profile-header" style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px 0" }}>
            <div className="profile-hero" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#0d9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, border: "none", boxShadow: "rgba(0,0,0,0.3) 0 4px 16px", flexShrink: 0 }}>
                {username ? username.charAt(0).toUpperCase() : "?"}
              </div>
              <div style={{ flex: "1 1 0%", minWidth: 0, paddingBottom: 4 }}>
                <div className="profile-name-row" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{username || "Loading..."}</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, backgroundColor: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308", fontSize: 11, fontWeight: 700 }}>
                    <IcoFlame s={12} color="#eab308" /> {streak}-day streak
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{email}</p>
              </div>
              <button className="share-btn" onClick={() => setShowShareModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", transition: "0.15s", flexShrink: 0 }}>
                <IcoShare s={13} /> Share
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="profile-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 48px" }}>

            {/* Top stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))", gap: 12, marginBottom: 24 }}>
              <StatCard icon={<IcoFlame s={16} />} label="Current Streak" value={streak} unit="days" color="#f59e0b" gradient="linear-gradient(90deg,#f59e0b,#ef4444)" />
              <StatCard icon={<IcoClock s={16} />} label="Total Hours" value={totalHours} unit="h" color="#6366f1" gradient="linear-gradient(90deg,#6366f1,#8b5cf6)" />
              <StatCard icon={<IcoTarget s={16} />} label="Focus Sessions" value={totalSessions} color="#10b981" gradient="linear-gradient(90deg,#10b981,#059669)" />
              <StatCard icon={<IcoStar s={16} />} label="Problems Solved" value={solvedCount} color="#facc15" gradient="linear-gradient(90deg,#facc15,#eab308)" />
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: 20 }}>
              <div className="ui-tabs" style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
                {[{ id: "Overview", Icon: IcoBar }, { id: "Study", Icon: IcoBookOpen }, { id: "Coding", Icon: IcoCode }, { id: "Settings", Icon: IcoSettings }].map(({ id, Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 13, fontWeight: activeTab === id ? 700 : 500, cursor: "pointer", backgroundColor: "transparent", border: "none", color: activeTab === id ? "var(--accent)" : "var(--text-muted)", borderBottom: activeTab === id ? "2px solid var(--accent)" : "2px solid transparent", transition: "color var(--dur-fast)", whiteSpace: "nowrap" }}>
                    <Icon s={14} /> {id}
                  </button>
                ))}
              </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <StudyHoursChart sessions={sessions} />
                <ActivityHeatmap sessions={sessions} />

                {/* Badges */}
                <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <IcoAward s={16} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Badges</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>— {earnedCount} / {badges.length} earned</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {badges.map((b, i) => <BadgeCard key={i} icon={b.icon} title={b.title} desc={b.desc} earned={b.earned} />)}
                  </div>
                </div>
              </div>
            )}

            {/* STUDY TAB */}
            {activeTab === "Study" && (
              loadingSessions
                ? <div style={{ color: "var(--text-muted)", padding: 24, textAlign: "center" }}>Loading study data...</div>
                : <StudyTab sessions={sessions} />
            )}

            {/* CODING TAB */}
            {activeTab === "Coding" && <CodingTab submissions={submissions} loading={loadingSubmissions} />}

            {/* SETTINGS TAB */}
            {activeTab === "Settings" && <SettingsTab username={username} email={email} role={role} onLogout={handleLogout} navigate={navigate} />}

          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .profile-header { padding: 20px 16px 0 !important; }
          .profile-content { padding: 0 16px 80px !important; }
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