import { useState, useRef, useEffect } from "react";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoSearch  = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell    = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus    = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

// ── Create Room Modal ─────────────────────────────────────────────────────────
const ROOM_ICONS   = ["📚", "🗓", "🖨", "🦊", "🔬", "📝", "🌀", "🍎"];
const ROOM_COLORS  = ["#7c6fe0", "#b060e0", "#40b8e0", "#22c55e", "#f59e0b", "#ef4444"];
const QUICK_STARTS = [
  { label: "Exam Sprint",    emoji: "🔴", focus: 50, brk: 10 },
  { label: "Group Project",  emoji: "🟡", focus: 25, brk:  5 },
  { label: "Deep Work",      emoji: "🟠", focus: 50, brk: 10 },
  { label: "Quick Revision", emoji: "⚡", focus: 15, brk:  5 },
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

function CreateRoomModal({ onClose }) {
  const [roomName, setRoomName]   = useState("");
  const [goal, setGoal]           = useState("");
  const [selectedIcon, setIcon]   = useState(0);
  const [selectedColor, setColor] = useState(0);
  const [focus, setFocus]         = useState(10);
  const [brk, setBrk]             = useState(5);
  const [expires, setExpires]     = useState("24h");

  const applyQuick = (qs) => { setFocus(qs.focus); setBrk(qs.brk); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0 }}>
          {/* Left – preview + icon + color */}
          <div style={{ padding: "20px 16px 24px", borderRight: "1px solid #1e2433", display: "flex", flexDirection: "column", gap: 20 }}>
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
                      background: selectedIcon === i ? "#1f2433" : "#0d1117",
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {QUICK_STARTS.map((qs) => (
                  <button
                    key={qs.label}
                    onClick={() => applyQuick(qs)}
                    style={{
                      background: "#0d1117",
                      border: "1px solid #1e2433",
                      borderRadius: 8, padding: "10px 12px",
                      cursor: "pointer", textAlign: "left",
                      color: "#e2e8f0",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#161b26"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2433"; e.currentTarget.style.background = "#0d1117"; }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{qs.emoji}</span> {qs.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>
                      {qs.focus}m · {qs.brk}m break
                    </div>
                  </button>
                ))}
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
                    background: "#0d1117", border: "1px solid #1e2433",
                    borderRadius: 8, padding: "10px 12px 10px 34px",
                    fontSize: 13, color: "#f1f5f9", outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#1e2433"}
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
                    background: "#0d1117", border: "1px solid #1e2433",
                    borderRadius: 8, padding: "10px 12px 10px 34px",
                    fontSize: 13, color: "#f1f5f9", outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#1e2433"}
                />
              </div>
            </div>

            {/* Expires + Pomodoro */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
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
                      background: "#0d1117", border: "1px solid #1e2433",
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
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", minWidth: 30, textAlign: "center" }}>{focus}m</span>
                      <button onClick={() => setFocus(f => Math.min(120, f + 5))} style={pomoBtnStyle}>+</button>
                    </div>
                  </div>
                  {/* Break */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Break</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setBrk(b => Math.max(1, b - 1))} style={pomoBtnStyle}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", minWidth: 30, textAlign: "center" }}>{brk}m</span>
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
      <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a1f2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IcoBell s={20} />
        </div>
        <span style={{ fontSize: 12, color: "#64748b" }}>No notifications</span>
      </div>
    </div>
  );
}

// ── Command Palette ────────────────────────────────────────────────────────────
const PALETTE_ITEMS = [
  { id: "home",        label: "Go to Home",          icon: "▩"  },
  { id: "rooms",       label: "My Rooms",            icon: "🎧" },
  { id: "problems",    label: "Problems",            icon: "🗒" },
  { id: "playground",  label: "Code Playground",     icon: "🧩" },
  { id: "pair",        label: "Start Pair Session",  icon: "⚿"  },
  { id: "leaderboard", label: "Leaderboard",         icon: "🏆" },
  { id: "analytics",   label: "Profile / Analytics", icon: "📊" },
  { id: "community",   label: "Community / Friends", icon: "👥" },
  { id: "createRoom",  label: "Create a room",       icon: "➕" },
  { id: "invite",      label: "Invite friends",      icon: "✉️" },
  { id: "OpenProblem", label: "Open a problem",      icon: "🔍" },
];

// ── TopBar ─────────────────────────────────────────────────────────────────────
/**
 * Props:
 *  title    – page title shown on left
 *  subtitle – optional subtitle shown below title
 */
export default function TopBar({ title, subtitle }) {
  const [isOpen,          setIsOpen]          = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedIndex,   setSelectedIndex]   = useState(0);
  const [showNotif,       setShowNotif]       = useState(false);
  const [showCreateRoom,  setShowCreateRoom]  = useState(false);

  const paletteRef  = useRef(null);
  const inputRef    = useRef(null);
  const bellWrapRef = useRef(null);

  const filteredItems = PALETTE_ITEMS.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleListKeyDown = (e) => {
    if (!isOpen || filteredItems.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % filteredItems.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length); }
    else if (e.key === "Enter") { e.preventDefault(); handleItemTrigger(filteredItems[selectedIndex]); }
  };

  const handleItemTrigger = (item) => {
    if (item.id === "createRoom") { setShowCreateRoom(true); }
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Create Room Modal */}
      {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} />}

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          height: 48,
          padding: "0 20px",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        {/* Title block */}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1, whiteSpace: "nowrap" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1 }}>
              {subtitle}
            </p>
          )}
        </div>

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
                  background: "#0d1117",
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
                <div style={{ maxHeight: 340, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 12px 6px" }}>Navigate</div>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemTrigger(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            width: "100%", textAlign: "left",
                            padding: "8px 12px", borderRadius: 8,
                            fontSize: 13, fontWeight: 500,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            backgroundColor: isSelected ? "#161b26" : "transparent",
                            color: isSelected ? "#818cf8" : "#cbd5e1",
                            transition: "background-color 0.1s, color 0.1s",
                          }}
                        >
                          <span style={{
                            width: 28, height: 28, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: 7, fontSize: 13,
                            background: isSelected ? "#1f2433" : "#111622",
                            border: `1px solid ${isSelected ? "#312e81" : "#1a202c"}`,
                          }}>
                            {item.icon}
                          </span>
                          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                        </button>
                      );
                    })
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
