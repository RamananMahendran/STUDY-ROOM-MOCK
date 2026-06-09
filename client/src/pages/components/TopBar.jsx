import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoSearch  = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell    = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IcoClock   = ({s=14}) => <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IcoGrid    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
const IcoBook    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const IcoFile    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoTerminal= ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const IcoPair    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><line x1="9" y1="12" x2="15" y2="12"/></svg>;
const IcoTrophy  = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>;
const IcoChart   = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoUsers   = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoLightning = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoAddUser = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;

// ── Create Room Modal ─────────────────────────────────────────────────────────
const ROOM_ICONS   = ["📚", "🧮", "💻", "🎨", "🔬", "📝", "🗣️", "🎯"];
const ROOM_COLORS  = ["#7c6fe0", "#b060e0", "#40b8e0", "#22c55e", "#f59e0b", "#ef4444"];

window.addNotification = (msg) => {
  const existing = JSON.parse(localStorage.getItem("myNotifications") || "null") || [
    { id: "welcome", message: "Welcome! Try a 10-minute focus block — one click on the Dashboard and you're in.", time: Date.now() - 38 * 60000 }
  ];
  existing.unshift({ id: Date.now().toString(), message: msg, time: Date.now() });
  localStorage.setItem("myNotifications", JSON.stringify(existing));
  window.dispatchEvent(new Event("notificationsUpdated"));
};
const QUICK_STARTS = [
  { label: "Exam Sprint",    emoji: "🎯", focus: 50, brk: 10 },
  { label: "Group Project",  emoji: "🤝", focus: 25, brk:  5 },
  { label: "Deep Work",      emoji: "🧘", focus: 90, brk: 15 },
  { label: "Quick Revision", emoji: "⚡", focus: 15, brk:  3 },
];

const pomoBtnStyle = {
  width: 24, height: 24,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "#1a1f2e",
  border: "1px solid #1e2433",
  borderRadius: 6,
  color: "#94a3b8",
  fontSize: 14, fontWeight: 700,
  cursor: "pointer",
  lineHeight: 1,
};

export function CreateRoomModal({ onClose, onNavigate }) {
  const [roomName, setRoomName]   = useState("");
  const [goal, setGoal]           = useState("");
  const [selectedIcon, setIcon]   = useState(0);
  const [selectedColor, setColor] = useState(0);
  const [focus, setFocus]         = useState(10);
  const [brk, setBrk]             = useState(5);
  const [expires, setExpires]     = useState("24h");

  const applyQuick = (qs) => { setFocus(qs.focus); setBrk(qs.brk); };

  useEffect(() => {
    document.body.classList.add("create-room-open");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("create-room-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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
          width: "100%", maxWidth: 660,
          background: "#12151c",
          border: "1px solid #1e2433",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          fontFamily: "inherit",
          color: "#e2e8f0",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #1e2433" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Create a Room</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, lineHeight: 1, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="create-room-grid" style={{ display: "grid", gap: 0, overflowY: "auto", flex: 1, minHeight: 0 }}>
          {/* Left – preview + icon + color */}
          <div className="create-room-left" style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Preview card */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Preview</div>
              <div style={{
                background: "#1a1f2e",
                border: `2px solid ${ROOM_COLORS[selectedColor]}`,
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{ROOM_ICONS[selectedIcon]}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: roomName ? "#f1f5f9" : "#475569" }}>
                    {roomName || "Room name..."}
                  </span>
                </div>
                {goal && <div style={{ fontSize: 11, color: "#64748b" }}>{goal}</div>}
                <div style={{ display: "flex", gap: 10, fontSize: 10, color: "#64748b" }}>
                  <span>⏱ {focus}m</span>
                  <span>· {brk}m</span>
                  <span>· {expires}</span>
                </div>
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Icon</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {ROOM_ICONS.map((ico, i) => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    style={{
                      background: selectedIcon === i ? "var(--surface-2)" : "var(--surface)",
                      border: selectedIcon === i ? `2px solid ${ROOM_COLORS[selectedColor]}` : "2px solid #1e2433",
                      borderRadius: 8, padding: "6px", cursor: "pointer",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.15s",
                    }}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Color</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ROOM_COLORS.map((col, i) => (
                  <button
                    key={i}
                    onClick={() => setColor(i)}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: col,
                      border: selectedColor === i ? "2px solid #fff" : "2px solid transparent",
                      outline: selectedColor === i ? `2px solid ${col}` : "none",
                      cursor: "pointer",
                      transition: "outline 0.15s, border 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right – form */}
          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Quick Start */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Quick Start</div>
              <div className="create-room-quick-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {QUICK_STARTS.map((qs) => {
                  const isActive = focus === qs.focus && brk === qs.brk;
                  return (
                    <button
                      key={qs.label}
                      onClick={() => applyQuick(qs)}
                      style={{
                        background: isActive ? "var(--surface-2)" : "var(--surface)",
                        border: isActive ? "1px solid #6366f1" : "1px solid #1e2433",
                        borderRadius: 8, padding: "10px 12px",
                        cursor: "pointer", textAlign: "left",
                        color: "#e2e8f0",
                        transition: "border-color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "var(--surface-2)"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; } }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{qs.emoji}</span> {qs.label}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>
                        {qs.focus}m · {qs.brk}m break
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Name */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Room Name</div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🖥</span>
                <input
                  type="text"
                  placeholder="e.g. DSA Study Session"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "var(--surface)", border: "1px solid #1e2433",
                    borderRadius: 8, padding: "10px 12px 10px 34px",
                    fontSize: 13, color: "#f1f5f9", outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {/* Session Goal */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Session Goal</div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🎯</span>
                <input
                  type="text"
                  placeholder="e.g. Finish trees and graphs"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "var(--surface)", border: "1px solid #1e2433",
                    borderRadius: 8, padding: "10px 12px 10px 34px",
                    fontSize: 13, color: "#f1f5f9", outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {/* Expires + Pomodoro */}
            <div className="create-room-expires-grid" style={{ display: "grid", gap: 16, alignItems: "start" }}>
              {/* Expires */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Expires In</div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>⏰</span>
                  <select
                    value={expires}
                    onChange={e => setExpires(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--surface)", border: "1px solid #1e2433",
                      borderRadius: 8, padding: "9px 12px 9px 30px",
                      fontSize: 13, color: "#f1f5f9", outline: "none",
                      fontFamily: "inherit", cursor: "pointer", appearance: "none",
                    }}
                  >
                    <option value="6h">6 hours</option>
                    <option value="12h">12 hours</option>
                    <option value="24h">24 hours</option>
                    <option value="48h">48 hours</option>
                  </select>
                  <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "#64748b", pointerEvents: "none" }}>▼</span>
                </div>
              </div>

              {/* Pomodoro */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pomodoro</div>
                  <span style={{ fontSize: 11 }}>⏱</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {/* Focus */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Focus</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setFocus(f => Math.max(5, f - 5))} style={pomoBtnStyle}>−</button>
                      <div style={{
                        background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: 6, padding: "4px 0", width: 44, display: "flex", justifyContent: "center"
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8" }}>{focus}m</span>
                      </div>
                      <button onClick={() => setFocus(f => Math.min(120, f + 5))} style={pomoBtnStyle}>+</button>
                    </div>
                  </div>
                  {/* Break */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Break</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setBrk(b => Math.max(1, b - 1))} style={pomoBtnStyle}>−</button>
                      <div style={{
                        background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: 6, padding: "4px 0", width: 44, display: "flex", justifyContent: "center"
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{brk}m</span>
                      </div>
                      <button onClick={() => setBrk(b => Math.min(30, b + 1))} style={pomoBtnStyle}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid #1e2433" }}>
          <button
            onClick={onClose}
            style={{
              flex: "0 0 auto", padding: "11px 24px", borderRadius: 10,
              border: "1px solid #1e2433", background: "transparent",
              color: "#94a3b8", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5001/api/rooms", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    mode: "study",
                    isPublic: true,
                    maxCapacity: 10,
                    name: roomName || "My Room",
                    focusMin: focus,
                    breakMin: brk
                  })
                });
                
                if (!res.ok) {
                  throw new Error("Failed to create room. Please ensure you are logged in.");
                }
                
                const data = await res.json();
                const id = data.roomId;
                const room = {
                  id,
                  joinCode: data.joinCode,
                  name:     roomName || "My Room",
                  icon:     ROOM_ICONS[selectedIcon],
                  color:    ROOM_COLORS[selectedColor],
                  goal,
                  focusMin: focus,
                  breakMin: brk,
                  expires,
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
                window.addNotification(`You successfully created the room "${room.name}".`);
                onClose();
                if (onNavigate) onNavigate(`/room/${id}`);
              } catch (err) {
                console.error("Error creating room:", err);
                alert(err.message);
              }
            }}
            style={{
              flex: 1, padding: "11px 24px", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <IcoPlus s={14} /> Create Room
          </button>
        </div>
      </div>
      <style>{`
        .create-room-grid { grid-template-columns: 200px 1fr; }
        .create-room-left { border-right: 1px solid #1e2433; }
        .create-room-expires-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .create-room-grid { grid-template-columns: 1fr; }
          .create-room-left { border-right: none; border-bottom: 1px solid #1e2433; }
          .create-room-expires-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .create-room-quick-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Notifications Panel ────────────────────────────────────────────────────────
function NotificationsPanel({ onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("myNotifications");
    if (saved) return JSON.parse(saved);
    // Default welcome notification if empty
    return [
      { id: "welcome", message: "Welcome! Try a 10-minute focus block — one click on the Dashboard and you're in.", time: Date.now() - 38 * 60000 }
    ];
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("myNotifications");
      if (saved) setNotifications(JSON.parse(saved));
    };
    window.addEventListener("notificationsUpdated", handleUpdate);
    return () => window.removeEventListener("notificationsUpdated", handleUpdate);
  }, []);

  const formatAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 320,
        background: "#12151c",
        border: "1px solid #1e2433",
        borderRadius: 14,
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        zIndex: 9999,
        overflow: "hidden",
        color: "#e2e8f0",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px", borderBottom: "1px solid #1e2433" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>Notifications</span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 16, lineHeight: 1, padding: 2, borderRadius: 4, display: "flex", alignItems: "center" }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: notifications.length === 0 ? "48px 24px" : "12px", display: "flex", flexDirection: "column", gap: notifications.length === 0 ? 10 : 8, alignItems: notifications.length === 0 ? "center" : "stretch", maxHeight: 360, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a1f2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IcoBell s={20} />
            </div>
            <span style={{ fontSize: 12, color: "#64748b" }}>No notifications</span>
          </>
        ) : (
          notifications.map((n, i) => (
            <div key={n.id || i} style={{ display: "flex", gap: 12, padding: "12px", borderRadius: 12, background: "transparent", transition: "background-color 0.15s", cursor: "default" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
              <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
                <IcoBell s={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.4 }}>{n.message}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>{formatAgo(n.time)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Command Palette ────────────────────────────────────────────────────────────
const COMMANDS = [
  {
    group: "NAVIGATE",
    items: [
      { id: "home",        label: "Go to Home",          icon: <IcoGrid />,     path: "/home" },
      { id: "rooms",       label: "My Rooms",            icon: <IcoBook />,     path: "/rooms" },
      { id: "problems",    label: "Problems",            icon: <IcoFile />,     path: "/problems" },
      { id: "playground",  label: "Code Playground",     icon: <IcoTerminal />, path: "/playground" },
      { id: "pair",        label: "Start Pair Session",  icon: <IcoPair />,     path: "/pair" },
      { id: "leaderboard", label: "Leaderboard",         icon: <IcoTrophy />,   path: "/practice/leaderboard" },
      { id: "profile",     label: "Profile / Analytics", icon: <IcoChart />,    path: "/profile" },
      { id: "community",   label: "Community / Friends", icon: <IcoUsers />,    path: "/community" },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { id: "createRoom",  label: "Create a room",       icon: <IcoPlus s={16} />, shortcut: "Study" },
      { id: "invite",      label: "Invite a friend",     icon: <IcoAddUser />,     shortcut: "Social", path: "/refer" },
      { id: "openProblem", label: "Open a problem",      icon: <IcoLightning />,   shortcut: "Practice" },
    ]
  }
];

// ── TopBar ─────────────────────────────────────────────────────────────────────
/**
 * Props:
 *  title    – page title shown on left
 *  subtitle – optional subtitle shown below title
 *  onMenuToggle - callback to open mobile menu
 */
export default function TopBar({ title, subtitle, onMenuToggle }) {
  const navigate = useNavigate();
  const [isOpen,          setIsOpen]          = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedIndex,   setSelectedIndex]   = useState(0);
  const [showNotif,       setShowNotif]       = useState(false);
  const [showCreateRoom,  setShowCreateRoom]  = useState(false);
  
  const [activeTimer, setActiveTimer] = useState(() => {
    const saved = sessionStorage.getItem("activeTimer");
    if (saved) return JSON.parse(saved);
    return null;
  });

  const paletteRef  = useRef(null);
  const inputRef    = useRef(null);
  const bellWrapRef = useRef(null);

  const filteredGroups = COMMANDS.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(group => group.items.length > 0);

  const navigableItems = filteredGroups.flatMap(g => g.items);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOpenCreateRoom = () => setShowCreateRoom(true);
    window.addEventListener("open-create-room-modal", handleOpenCreateRoom);
    return () => window.removeEventListener("open-create-room-modal", handleOpenCreateRoom);
  }, []);

  useEffect(() => {
    const handleTimerUpdate = (e) => {
      setActiveTimer(e.detail);
    };
    window.addEventListener("timerUpdated", handleTimerUpdate);
    return () => window.removeEventListener("timerUpdated", handleTimerUpdate);
  }, []);

  const handleListKeyDown = (e) => {
    if (!isOpen || navigableItems.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % navigableItems.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + navigableItems.length) % navigableItems.length); }
    else if (e.key === "Enter") { e.preventDefault(); handleItemTrigger(navigableItems[selectedIndex]); }
  };

  const handleItemTrigger = (item) => {
    if (item.id === "createRoom") { 
      setShowCreateRoom(true); 
    } else if (item.path) {
      navigate(item.path);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Create Room Modal */}
      {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} onNavigate={navigate} />}

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          height: 48,
          padding: "0 20px",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          position: "relative",
        }}
      >
        {/* Title block with hamburger for mobile */}
        <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="md:hidden"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32, borderRadius: 8,
                background: "var(--surface-2)", border: "1px solid var(--border)",
                color: "var(--text)", cursor: "pointer"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1, whiteSpace: "nowrap" }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Global Timer Pill */}
        {activeTimer && (
          <div
            onClick={() => activeTimer.roomId && navigate(`/room/${activeTimer.roomId}`)}
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 99,
              backgroundColor: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
              cursor: "pointer", color: "var(--accent-text)", fontSize: 11, fontWeight: 600,
              transition: "border-color 0.15s, background-color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)"; e.currentTarget.style.backgroundColor = "rgba(108,99,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.2)"; e.currentTarget.style.backgroundColor = "rgba(108,99,255,0.08)"; }}
          >
            <IcoClock s={12} />
            <span style={{ textTransform: "capitalize" }}>{activeTimer.mode}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {String(Math.floor(activeTimer.timeLeft / 60)).padStart(2, "0")}:{String(activeTimer.timeLeft % 60).padStart(2, "0")}
            </span>
            <span style={{ color: "rgba(164,155,255,0.4)" }}>·</span>
            <span style={{ color: "rgba(164,155,255,0.8)" }}>{activeTimer.roomName}</span>
          </div>
        )}

        {/* Right-side button group */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>

          {/* ⌘K Search pill */}
          <button
            id="topbar-cmd-palette-btn"
            title="Command palette (⌘K)"
            aria-label="Open command palette"
            onClick={() => setIsOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              height: 28, padding: "0 10px",
              borderRadius: 7,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface-2)",
              color: "var(--text-muted)",
              fontSize: 11, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--surface)"; e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <IcoSearch s={12} />
            <span style={{ letterSpacing: "0.3px" }}>⌘K</span>
          </button>

          {/* Command Palette Modal */}
          {isOpen && (
            <div
              style={{
                position: "fixed", inset: 0, zIndex: 9999,
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: "10vh", paddingLeft: 16, paddingRight: 16,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setIsOpen(false)}
            >
              <div
                ref={paletteRef}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleListKeyDown}
                style={{
                  width: "100%", maxWidth: 580,
                  background: "var(--surface)",
                  border: "1px solid #1e2433",
                  borderRadius: 12,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                  overflow: "hidden",
                  display: "flex", flexDirection: "column",
                  color: "#e2e8f0",
                  fontFamily: "inherit",
                }}
              >
                {/* Search input row */}
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 52, borderBottom: "1px solid #1e2433", gap: 12 }}>
                  <IcoSearch s={16} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Jump to, search, or do something..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      fontSize: 14, color: "#f1f5f9", fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Items list */}
                <div style={{ maxHeight: 380, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div key={group.group}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 12px 6px" }}>{group.group}</div>
                        {group.items.map((item) => {
                          const isSelected = navigableItems[selectedIndex]?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemTrigger(item)}
                              onMouseEnter={() => setSelectedIndex(navigableItems.findIndex(n => n.id === item.id))}
                              style={{
                                display: "flex", alignItems: "center", gap: 12,
                                width: "100%", textAlign: "left",
                                padding: "8px 12px", borderRadius: 8,
                                fontSize: 13, fontWeight: 500,
                                border: "none", cursor: "pointer", fontFamily: "inherit",
                                backgroundColor: isSelected ? "var(--surface-2)" : "transparent",
                                color: isSelected ? "#fff" : "#cbd5e1",
                                transition: "background-color 0.1s, color 0.1s",
                              }}
                            >
                              <span style={{
                                width: 28, height: 28, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: 7,
                                color: "#6366f1", // Constant indigo icon color
                                background: "rgba(99,102,241,0.08)", // Faint indigo box
                              }}>
                                {item.icon}
                              </span>
                              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                              {item.shortcut && (
                                <span style={{ fontSize: 10, color: "#64748b", marginLeft: "auto" }}>{item.shortcut}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px 0", fontSize: 12, color: "#64748b" }}>No matching items found.</div>
                  )}
                </div>

                {/* Footer hints */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", background: "#080c12", borderTop: "1px solid #1e2433", fontSize: 10, color: "#64748b", userSelect: "none" }}>
                  {[["↑↓", "Navigate"], ["↵", "Open"], ["Esc", "Close"]].map(([key, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ background: "#111622", border: "1px solid #1a202c", padding: "2px 5px", borderRadius: 4, fontFamily: "monospace", fontSize: 9 }}>{key}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bell – Notifications */}
          <div ref={bellWrapRef} style={{ position: "relative" }}>
            <button
              id="topbar-notifications-btn"
              title="Notifications"
              aria-label="Notifications"
              onClick={() => setShowNotif((p) => !p)}
              style={{
                width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 7,
                border: "none",
                backgroundColor: showNotif ? "var(--accent-bg)" : "transparent",
                color: showNotif ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer", fontFamily: "inherit",
                transition: "background-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (!showNotif) { e.currentTarget.style.backgroundColor = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; } }}
              onMouseLeave={e => { if (!showNotif) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
            >
              <IcoBell s={15} />
            </button>
            {showNotif && <NotificationsPanel onClose={() => setShowNotif(false)} />}
          </div>

          {/* + Create room */}
          <button
            id="topbar-create-room-btn"
            title="Create room"
            aria-label="Create room"
            onClick={() => setShowCreateRoom(true)}
            style={{
              width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 7,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              cursor: "pointer", fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <IcoPlus s={14} />
          </button>
        </div>
      </div>
    </>
  );
}
