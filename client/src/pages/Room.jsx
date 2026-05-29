import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ─── CSS Variables injected globally ─────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    :root {
      --bg: #0d0d0f;
      --surface: #141417;
      --surface-2: #1a1a1f;
      --border: rgba(255,255,255,0.08);
      --border-strong: rgba(255,255,255,0.14);
      --text: #e8e8ec;
      --text-muted: #6b6b7a;
      --text-subtle: #3f3f4e;
      --accent: #6c63ff;
      --accent-bg: rgba(108,99,255,0.1);
      --accent-text: #a49bff;
      --success: #22c55e;
      --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-sans); }
    button { font-family: inherit; border: none; background: none; }
    input, textarea { font-family: inherit; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }
  `}</style>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Notes: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Tasks: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Files: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  ),
  Activity: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Members: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Reset: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Skip: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  Expand: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  ),
  Mic: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  AddUser: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Close: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Split: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
};

// ─── Timer Circle ──────────────────────────────────────────────────────────────
function TimerCircle({ minutes, seconds, label, isBreak, running, size = 168, totalMins = 90 }) {
  const total = totalMins * 60;
  const remaining = minutes * 60 + seconds;
  const progress = total > 0 ? remaining / total : 0;
  const r = size === 168 ? 72 : 108;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" strokeWidth={size === 168 ? 5 : 7} style={{ stroke: "var(--border-strong)" }} />
        <circle
          cx={cx} cy={cx} r={r} fill="none"
          strokeWidth={size === 168 ? 5 : 7}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ stroke: isBreak ? "var(--success)" : "var(--accent)", transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      {/* dot indicator */}
      <div style={{
        position: "absolute",
        width: size === 168 ? 8 : 10,
        height: size === 168 ? 8 : 10,
        borderRadius: "50%",
        backgroundColor: isBreak ? "var(--success)" : "var(--accent)",
        top: cx - r,
        left: cx - (size === 168 ? 4 : 5),
        transform: `rotate(${(1 - progress) * 360}deg)`,
        transformOrigin: `${size === 168 ? 4 : 5}px ${r}px`,
        transition: "transform 1s linear"
      }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <span style={{
          fontSize: size === 168 ? "2.25rem" : "3.5rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}>
          {String(minutes).padStart(2, "0")}
          <span style={{ color: isBreak ? "var(--success)" : "var(--accent-text)", margin: "0 2px" }}>:</span>
          {String(seconds).padStart(2, "0")}
        </span>
        <span style={{
          fontSize: "0.7rem",
          marginTop: 8,
          padding: "3px 12px",
          borderRadius: 99,
          backgroundColor: running ? (isBreak ? "rgba(34,197,94,0.1)" : "var(--accent-bg)") : "transparent",
          border: `1px solid ${running ? (isBreak ? "rgba(34,197,94,0.3)" : "rgba(108,99,255,0.3)") : "var(--border-strong)"}`,
          color: running ? (isBreak ? "var(--success)" : "var(--accent-text)") : "var(--text-muted)",
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ mode, setMode, minutes, seconds, timerLabel, running, wasPaused, onPlay, onReset, onSkip, isBreak, onFocusModeOpen, focusMins, breakMins }) {
  const showFocusBlock = !running; // show when not running (including paused/ready)
  return (
    <aside style={{
      width: 312,
      minWidth: 312,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "var(--bg)",
      borderRight: "1px solid var(--border)",
    }}>
      {/* First Focus Block — shown when not running */}
      {showFocusBlock && (
        <div style={{
          margin: "14px 14px 0",
          padding: "14px 16px",
          borderRadius: 12,
          backgroundColor: "var(--accent-bg)",
          border: "1px solid rgba(108,99,255,0.25)",
        }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-text)", marginBottom: 6 }}>
            First Focus Block
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text)", marginBottom: 12, lineHeight: 1.5 }}>
            {wasPaused
              ? `You paused at ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}. Pick up where you left off.`
              : "The first one is the hardest. Press play — 90 minutes."}
          </p>
          <button
            onClick={onPlay}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8,
              backgroundColor: "var(--accent)", color: "#fff",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
            }}
          >
            {wasPaused ? "Resume →" : "Start focus →"}
          </button>
        </div>
      )}

      {/* Focus / Break toggle */}
      <div style={{
        margin: showFocusBlock ? "12px 14px 0" : "14px 14px 0",
        display: "flex",
        borderRadius: 10,
        padding: 3,
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}>
        {["focus", "break"].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: "7px 0",
              borderRadius: 7,
              fontSize: "0.82rem", fontWeight: 500,
              backgroundColor: mode === m ? "var(--surface-2)" : "transparent",
              color: mode === m ? "var(--text)" : "var(--text-muted)",
              cursor: "pointer", transition: "all 0.15s",
              textTransform: "capitalize",
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "20px 0 0" }}>
        <TimerCircle minutes={minutes} seconds={seconds} label={timerLabel} isBreak={isBreak} running={running} totalMins={isBreak ? breakMins : focusMins} />

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onReset}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer",
              border: "1px solid var(--border)",
            }}
          >
            <Icon.Reset />
          </button>
          <button
            onClick={onPlay}
            style={{
              width: 56, height: 56, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: isBreak ? "var(--success)" : "var(--accent)",
              color: "#fff", cursor: "pointer",
              boxShadow: `0 4px 20px ${isBreak ? "rgba(34,197,94,0.35)" : "rgba(108,99,255,0.4)"}`,
            }}
          >
            {running ? <Icon.Pause /> : <Icon.Play />}
          </button>
          <button
            onClick={onSkip}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer",
              border: "1px solid var(--border)",
            }}
          >
            <Icon.Skip />
          </button>
        </div>

        {/* Time chips — show actual configured values */}
        <div style={{ display: "flex", gap: 8, width: "100%", padding: "0 14px" }}>
          {[
            { label: "Focus", val: `${focusMins}m`, active: !isBreak, activeColor: "var(--accent)" },
            { label: "Break", val: `${breakMins}m`, active: isBreak, activeColor: "var(--success)" },
            { label: "Sync", val: "Live", active: false, activeColor: "var(--text-muted)" },
          ].map(chip => (
            <div key={chip.label} style={{
              flex: 1, borderRadius: 10, padding: "8px 10px", textAlign: "center",
              backgroundColor: "var(--surface)", border: "1px solid var(--border)",
            }}>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: chip.active ? chip.activeColor : "var(--text-muted)" }}>{chip.val}</p>
              <p style={{ fontSize: "0.68rem", marginTop: 2, color: "var(--text-muted)" }}>{chip.label}</p>
            </div>
          ))}
        </div>

        {/* Focus Mode */}
        <button
          onClick={onFocusModeOpen}
          style={{
            margin: "0 14px",
            width: "calc(100% - 28px)",
            padding: "10px 0",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            backgroundColor: "var(--surface)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            fontSize: "0.82rem", cursor: "pointer",
          }}
        >
          <Icon.Expand /> Focus Mode
        </button>
      </div>
    </aside>
  );
}

// ─── Tab Bar ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "notes", label: "Notes", Icon: Icon.Notes },
  { id: "chat", label: "Chat", Icon: Icon.Chat },
  { id: "tasks", label: "Tasks", Icon: Icon.Tasks },
  { id: "files", label: "Files", Icon: Icon.Files },
  { id: "activity", label: "Activity", Icon: Icon.Activity },
  { id: "members", label: "Members", Icon: Icon.Members },
];

function TabBar({ active, setActive, badge }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)", padding: "0 4px" }}>
      {TABS.map(({ id, label, Icon: TabIcon }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          style={{
            position: "relative",
            display: "flex", alignItems: "center", gap: 6,
            padding: "12px 16px",
            fontSize: "0.82rem", fontWeight: 500,
            color: active === id ? "var(--accent)" : "var(--text-muted)",
            borderBottom: active === id ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <TabIcon />
          {label}
          {id === "activity" && badge > 0 && (
            <span style={{
              position: "absolute", top: 8, right: 4,
              width: 16, height: 16, borderRadius: "50%",
              backgroundColor: "#ef4444", color: "#fff",
              fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Notes Panel ──────────────────────────────────────────────────────────────
function NotesPanel() {
  const [chars, setChars] = useState(0);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
        <Icon.Notes />
        <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>Shared Notes</span>
        <span style={{ fontSize: "0.72rem", marginLeft: 6, padding: "2px 8px", borderRadius: 5, color: "var(--text-subtle)", backgroundColor: "var(--surface-2)" }}>
          Select text to format
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
          <button style={{ color: "var(--text-muted)", cursor: "pointer" }}><Icon.Edit /></button>
          <button style={{ color: "var(--text-muted)", cursor: "pointer" }}><Icon.Split /></button>
          <button style={{ color: "var(--text-muted)", cursor: "pointer" }}><Icon.Eye /></button>
          <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>{chars} chars</span>
        </div>
      </div>
      <textarea
        style={{ flex: 1, fontSize: "0.85rem", padding: 20, resize: "none", outline: "none", backgroundColor: "transparent", color: "var(--text)", lineHeight: 1.7 }}
        placeholder="Start typing shared notes..."
        onChange={e => setChars(e.target.value.length)}
      />
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "hiii", time: "07:91", self: true },
  ]);
  const bottomRef = useRef(null);

  const send = () => {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), self: true }]);
    setMsg("");
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px", display: "flex", flexDirection: "column" }}>
        {/* header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.25)",
            color: "var(--accent)", marginBottom: 12,
          }}>
            <Icon.Chat />
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Room Chat</p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>This is the beginning of the conversation.</p>
        </div>
        {/* messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.self ? "flex-end" : "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: m.self ? "flex-end" : "flex-start", gap: 3 }}>
                <div style={{
                  padding: "8px 14px", borderRadius: 18,
                  fontSize: "0.85rem", maxWidth: 280,
                  backgroundColor: m.self ? "var(--accent)" : "var(--surface-2)",
                  color: "#fff",
                }}>
                  {m.text}
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <input
          style={{
            flex: 1, borderRadius: 12, padding: "10px 16px",
            fontSize: "0.85rem", outline: "none",
            backgroundColor: "var(--surface)", color: "var(--text)",
            border: "1px solid var(--border)",
          }}
          placeholder="Message everyone..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          style={{
            width: 36, height: 36, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--accent)", color: "#fff", cursor: "pointer",
          }}
        >
          <Icon.Send />
        </button>
      </div>
    </div>
  );
}

// ─── Tasks Panel ──────────────────────────────────────────────────────────────
function TasksPanel() {
  const [tasks, setTasks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [showPriority, setShowPriority] = useState(false);

  const priorities = [
    { label: "High", color: "#ef4444" },
    { label: "Medium", color: "#f59e0b" },
    { label: "Low", color: "#22c55e" },
  ];
  const priorityColor = priorities.find(p => p.label === priority)?.color || "#f59e0b";

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask, done: false, priority }]);
    setNewTask(""); setAdding(false);
  };
  const toggle = (id) => setTasks(tasks.map(t => {
    if (t.id === id) {
      if (!t.done && window.addNotification) {
        window.addNotification(`You solved a problem: ${t.text}`);
      }
      return { ...t, done: !t.done };
    }
    return t;
  }));
  const done = tasks.filter(t => t.done);
  const todo = tasks.filter(t => !t.done);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.25)", color: "var(--accent)",
        }}>
          <Icon.Tasks />
        </div>
        <div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>Session Planner</p>
          {tasks.length > 0 && (
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{done.length} / {tasks.length} done</p>
          )}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Added Tu</span>
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 12px", borderRadius: 8,
              backgroundColor: "var(--accent)", color: "#fff",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
            }}
          >
            <Icon.Plus /> Add
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {/* Add form */}
        {adding && (
          <div style={{
            marginBottom: 16, borderRadius: 12, padding: "12px 14px",
            border: "1px solid rgba(108,99,255,0.4)", backgroundColor: "var(--surface-2)",
          }}>
            <input
              autoFocus
              style={{ width: "100%", fontSize: "0.85rem", outline: "none", backgroundColor: "transparent", color: "var(--text)", marginBottom: 10 }}
              placeholder="What needs to be done?"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Priority dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowPriority(!showPriority)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 7,
                    border: `1px solid ${priorityColor}55`,
                    backgroundColor: `${priorityColor}18`,
                    color: priorityColor, fontSize: "0.78rem", cursor: "pointer",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: priorityColor, display: "inline-block" }} />
                  {priority}
                </button>
                {showPriority && (
                  <div style={{
                    position: "absolute", top: 32, left: 0, zIndex: 20,
                    borderRadius: 10, padding: "4px 0", minWidth: 120,
                    backgroundColor: "var(--surface-2)", border: "1px solid var(--border)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {priorities.map(p => (
                      <button
                        key={p.label}
                        onClick={() => { setPriority(p.label); setShowPriority(false); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8,
                          padding: "7px 12px", fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer",
                        }}
                      >
                        {priority === p.label && <Icon.Check />}
                        {priority !== p.label && <span style={{ width: 14 }} />}
                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: p.color, display: "inline-block" }} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="date"
                style={{
                  flex: 1, fontSize: "0.78rem", padding: "4px 10px", borderRadius: 7,
                  outline: "none", backgroundColor: "var(--surface)", color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              />
              <button
                onClick={addTask}
                style={{ padding: "4px 14px", borderRadius: 7, backgroundColor: "var(--accent)", color: "#fff", fontSize: "0.78rem", cursor: "pointer" }}
              >
                Add
              </button>
              <button onClick={() => setAdding(false)} style={{ color: "var(--text-muted)", cursor: "pointer" }}>
                <Icon.Close />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && !adding && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: "60px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.2)", color: "var(--accent)",
            }}>
              <Icon.Tasks />
            </div>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>No tasks yet</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-subtle)", textAlign: "center" }}>What do you need to accomplish today? Break it down.</p>
            <button
              onClick={() => setAdding(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 9,
                backgroundColor: "var(--accent)", color: "#fff",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
              }}
            >
              <Icon.Plus /> Add first task
            </button>
          </div>
        )}

        {/* Task list */}
        {todo.map(t => {
          const tc = priorities.find(p => p.label === t.priority)?.color || "#f59e0b";
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: tc, flexShrink: 0 }} />
              <button
                onClick={() => toggle(t.id)}
                style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: "1px solid var(--border-strong)", cursor: "pointer", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>{t.text}</span>
            </div>
          );
        })}

        {done.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 8px" }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
              <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-subtle)" }}>
                DONE · {done.length}
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
            </div>
            {done.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--border-strong)", flexShrink: 0 }} />
                <button
                  onClick={() => toggle(t.id)}
                  style={{
                    width: 20, height: 20, borderRadius: 5,
                    backgroundColor: "var(--accent)", cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Icon.Check />
                </button>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "line-through", flex: 1 }}>{t.text}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>✓ Mayur K S</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Files Panel ──────────────────────────────────────────────────────────────
function FilesPanel() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, gap: 16 }}>
      <label style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        border: "1.5px dashed var(--border-strong)", borderRadius: 10,
        padding: "12px 0",
        fontSize: "0.82rem", color: "var(--text-muted)", cursor: "pointer",
      }}>
        <Icon.Upload /> Upload PDF or Image
        <input type="file" style={{ display: "none" }} accept=".pdf,image/*" />
      </label>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.82rem", color: "var(--text-subtle)" }}>
        No files shared yet.
      </div>
    </div>
  );
}

// ─── Activity Panel ───────────────────────────────────────────────────────────
function ActivityPanel({ items = [] }) {
  const formatAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 5) return "now";
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    return `${m}m ago`;
  };
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px" }}>
      {items.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "0.82rem", color: "var(--text-subtle)" }}>
          No activity yet.
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.2)", color: "var(--accent)",
            }}>
              <Icon.Clock />
            </div>
            <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)" }}>{item.label}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>{formatAgo(item.ts)}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Members Panel ────────────────────────────────────────────────────────────
function MembersPanel() {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Voice & Video */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
          <Icon.Mic /><Icon.Camera />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>Voice & Video</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Study together on camera — join the call</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 8,
          border: "1px solid rgba(108,99,255,0.3)", color: "var(--accent)",
          fontSize: "0.78rem", cursor: "pointer",
        }}>
          <Icon.Camera /> Join Call
        </button>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 10 }}>
          Study Group · 1 Online / 1 Total
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", borderRadius: 12,
          backgroundColor: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.15)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--accent)", color: "#fff",
            fontSize: "0.78rem", fontWeight: 700, flexShrink: 0,
          }}>
            MK
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              Mayur K S
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(you)</span>
              <span style={{
                fontSize: "0.68rem", padding: "1px 6px", borderRadius: 4,
                border: "1px solid var(--border)", color: "var(--text-muted)",
              }}>⚙ Admin</span>
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>mayur2310574@ssn.edu.in</p>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--success)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Top Header Bar ────────────────────────────────────────────────────────────
function Header({ roomCode, onSettings, onInvite, roomName }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 10, padding: "0 16px",
      height: 44, borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)",
      flexShrink: 0,
    }}>
      {/* Room name — left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
          backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.2)",
        }}>📚</div>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{roomName}</span>
        <span style={{
          fontSize: "0.68rem", padding: "1px 7px", borderRadius: 5,
          color: "var(--text-muted)", border: "1px solid var(--border)",
        }}>Host</span>
      </div>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: "0.75rem", padding: "4px 10px", borderRadius: 7,
          fontFamily: "monospace", color: "var(--text-muted)",
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
        }}>{roomCode}</span>
        <button onClick={onInvite} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Icon.Copy />
        </button>
        <button onClick={onInvite} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Icon.AddUser />
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 7,
          border: "1px solid rgba(108,99,255,0.35)", color: "var(--accent)",
          fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
          backgroundColor: "var(--accent-bg)",
        }}>
          <Icon.Mic /><Icon.Camera /> Call
        </button>
        <button onClick={onSettings} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Icon.Settings />
        </button>
        {/* Theme dot — accent color swatch */}
        <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "var(--accent)", border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer" }} title="Room theme" />
        <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--accent)", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
          M
        </div>
      </div>
    </header>
  );
}

// ─── Focus Mode Overlay ────────────────────────────────────────────────────────
function FocusModeOverlay({ minutes, seconds, isBreak, running, onPlay, onReset, onSkip, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      backgroundColor: "var(--bg)",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* Focus/Break toggle */}
        <div style={{
          display: "flex", borderRadius: 10, padding: 3,
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
        }}>
          <button style={{ padding: "8px 28px", borderRadius: 8, backgroundColor: "var(--surface-2)", color: "var(--text)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>Focus</button>
          <button style={{ padding: "8px 28px", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer" }}>Break</button>
        </div>

        <TimerCircle minutes={minutes} seconds={seconds} label={running ? (isBreak ? "Break..." : "Focusing...") : "Ready"} isBreak={isBreak} running={running} size={240} totalMins={isBreak ? breakMins : focusMins} />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onReset} style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <Icon.Reset />
          </button>
          <button onClick={onPlay} style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isBreak ? "var(--success)" : "var(--accent)", color: "#fff", cursor: "pointer", boxShadow: `0 4px 24px ${isBreak ? "rgba(34,197,94,0.4)" : "rgba(108,99,255,0.45)"}` }}>
            {running ? <Icon.Pause /> : <Icon.Play />}
          </button>
          <button onClick={onSkip} style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <Icon.Skip />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {[{ label: "Focus", val: "90m", active: !isBreak, color: "var(--accent)" }, { label: "Break", val: "15m", active: isBreak, color: "var(--success)" }, { label: "Sync", val: "Live", active: false, color: "var(--text-muted)" }].map(c => (
            <div key={c.label} style={{ padding: "10px 20px", borderRadius: 10, textAlign: "center", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: c.active ? c.color : "var(--text-muted)" }}>{c.val}</p>
              <p style={{ fontSize: "0.7rem", marginTop: 3, color: "var(--text-muted)" }}>{c.label}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "9px 20px", borderRadius: 9,
          border: "1px solid var(--border)", color: "var(--text-muted)",
          fontSize: "0.82rem", cursor: "pointer",
          backgroundColor: "var(--surface)",
        }}>
          <Icon.Expand /> Exit Focus Mode
        </button>
      </div>
    </div>
  );
}

// ─── Settings Modal ────────────────────────────────────────────────────────────
function SettingsModal({ onClose, onSave, initialFocus, initialBreak, initialRoomName }) {
  const [focus, setFocus] = useState(initialFocus);
  const [brk, setBrk] = useState(initialBreak);
  const [roomName, setRoomName] = useState(initialRoomName);
  const [sessionGoal, setSessionGoal] = useState("");
  const colors = ["#6c63ff", "#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];
  const [color, setColor] = useState(colors[0]);
  const [selectedEmoji, setSelectedEmoji] = useState("📚");

  const handleSave = () => {
    onSave({ focusMins: focus, breakMins: brk, roomName });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div style={{ borderRadius: 16, width: 460, maxHeight: "90vh", overflowY: "auto", backgroundColor: "var(--surface-2)", border: "1px solid var(--border-strong)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>Room Settings</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)", cursor: "pointer" }}><Icon.Close /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-subtle)" }}>General</p>

          <div>
            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: 6, color: "var(--text-muted)" }}>Room Name</label>
            <input
              style={{ width: "100%", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", outline: "none", backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: 6, color: "var(--text-muted)" }}>Session Goal</label>
            <input
              style={{ width: "100%", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", outline: "none", backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              value={sessionGoal}
              onChange={e => setSessionGoal(e.target.value)}
              placeholder="e.g. Finish DSA Unit 3"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: 8, color: "var(--text-muted)" }}>Room Emoji</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["📚", "🗂️", "🖥️", "🎨", "🔬", "📝", "🌐", "🎯"].map(e => (
                <button key={e} onClick={() => setSelectedEmoji(e)} style={{
                  width: 38, height: 38, borderRadius: 9, fontSize: "1.1rem", cursor: "pointer",
                  backgroundColor: selectedEmoji === e ? "var(--accent-bg)" : "var(--bg)",
                  border: selectedEmoji === e ? "1px solid rgba(108,99,255,0.5)" : "1px solid var(--border)",
                }}>{e}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: 8, color: "var(--text-muted)" }}>Room Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {colors.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: c, border: color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
              ))}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" style={{ marginTop: 2, accentColor: "var(--accent)" }} />
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text)" }}>Make room discoverable</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Anyone can find and join from the public rooms list on /home.</p>
            </div>
          </label>

          <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-subtle)", marginTop: 4 }}>Pomodoro Timer</p>

          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Focus", val: focus, setVal: setFocus, min: 5, max: 90, col: "#6c63ff" },
              { label: "Break", val: brk, setVal: setBrk, min: 1, max: 30, col: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1 }}>
                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: 8, color: "var(--text-muted)" }}>
                  {s.label} — <span style={{ color: s.col }}>{s.val}m</span>
                </label>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.setVal(+e.target.value)}
                  style={{ width: "100%", accentColor: s.col }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", marginTop: 4, color: "var(--text-subtle)" }}>
                  <span>{s.min}m</span><span>{s.max}m</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10,
              fontSize: "0.85rem", fontWeight: 600,
              backgroundColor: "var(--accent)", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invite Modal ──────────────────────────────────────────────────────────────
function InviteModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div style={{ borderRadius: 16, width: 400, backgroundColor: "var(--surface-2)", border: "1px solid var(--border-strong)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>Invite a Friend</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)", cursor: "pointer" }}><Icon.Close /></button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, marginBottom: 20, backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "1.3rem" }}>📚</span>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>try</p>
              <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>Code: ffaaae</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "32px 0", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
              <Icon.AddUser />
            </div>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>No friends to invite</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>All your friends are already here, or you haven't added any yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Load from sessionStorage or use defaults
  const [initialRoom] = useState(() => {
    const saved = sessionStorage.getItem("currentRoom");
    if (saved) return JSON.parse(saved);
    return { focusMin: 90, breakMin: 15, name: "try" };
  });

  const [tab, setTab] = useState("notes");

  const [mode, setMode] = useState(() => {
    const active = sessionStorage.getItem("activeTimer");
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed.roomId === (roomId || "ffaaae")) return parsed.mode;
    }
    return "focus";
  });

  const [running, setRunning] = useState(false);
  const [wasPaused, setWasPaused] = useState(false); // track explicit pause

  const [timeLeft, setTimeLeft] = useState(() => {
    const active = sessionStorage.getItem("activeTimer");
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed.roomId === (roomId || "ffaaae")) return parsed.timeLeft;
    }
    return (initialRoom.focusMin || 90) * 60;
  });

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [focusMode, setFocusMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const intervalRef = useRef(null);

  // ── Settings state (lifted so timer chips and header react) ─────────────────
  const [focusMins, setFocusMins] = useState(initialRoom.focusMin || 90);
  const [breakMins, setBreakMins] = useState(initialRoom.breakMin || 15);
  const [roomName, setRoomName] = useState(initialRoom.name || "try");

  // ── Activity log ─────────────────────────────────────────────────────────────
  const [activityLog, setActivityLog] = useState([]);
  const addActivity = (label) => {
    setActivityLog(prev => [{ id: Date.now(), label, ts: Date.now() }, ...prev]);
  };

  const isBreak = mode === "break";

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0) {
            setRunning(false);
            setWasPaused(false);
            return (isBreak ? breakMins : focusMins) * 60;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, isBreak, focusMins, breakMins]);

  // Save active timer globally
  useEffect(() => {
    const state = { timeLeft, mode, running, roomName, roomId: roomId || "ffaaae" };
    sessionStorage.setItem("activeTimer", JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("timerUpdated", { detail: state }));
  }, [timeLeft, mode, running, roomName, roomId]);

  // Pause timer on unmount
  useEffect(() => {
    return () => {
      const saved = sessionStorage.getItem("activeTimer");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.running = false;
        sessionStorage.setItem("activeTimer", JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent("timerUpdated", { detail: parsed }));
      }
    };
  }, []);

  const handlePlay = () => {
    const willRun = !running;
    setRunning(willRun);
    if (willRun) {
      setWasPaused(false);
      addActivity(isBreak ? "Break started" : "Focus session started");
    } else {
      setWasPaused(true); // paused mid-session
    }
  };

  const reset = () => {
    setRunning(false);
    setWasPaused(false);
    setTimeLeft((isBreak ? breakMins : focusMins) * 60);
  };

  const skip = () => {
    setRunning(false);
    setWasPaused(false);
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setTimeLeft((next === "break" ? breakMins : focusMins) * 60);
  };

  const handleModeChange = (m) => {
    setMode(m);
    setRunning(false);
    setWasPaused(false);
    setTimeLeft((m === "break" ? breakMins : focusMins) * 60);
  };

  const handleSettingsSave = ({ focusMins: fm, breakMins: bm, roomName: rn }) => {
    setFocusMins(fm);
    setBreakMins(bm);
    setRoomName(rn);
    // Reset timer to new values only if not currently running
    if (!running) {
      setTimeLeft((isBreak ? bm : fm) * 60);
    }
  };

  // Timer label: Focusing... / On break / Paused / Ready
  const timerLabel = running
    ? (isBreak ? "On break" : "Focusing...")
    : wasPaused
      ? "Paused"
      : "Ready";

  // Activity badge = count since last visit (simple: total)
  const activityBadge = activityLog.length;

  const tabContent = {
    notes: <NotesPanel />,
    chat: <ChatPanel />,
    tasks: <TasksPanel />,
    files: <FilesPanel />,
    activity: <ActivityPanel items={activityLog} />,
    members: <MembersPanel />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)" }}>
      <GlobalStyles />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />

      <Header roomCode={roomId || "ffaaae"} roomName={roomName} onSettings={() => setShowSettings(true)} onInvite={() => setShowInvite(true)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          mode={mode}
          setMode={handleModeChange}
          minutes={minutes} seconds={seconds} timerLabel={timerLabel}
          running={running} isBreak={isBreak}
          wasPaused={wasPaused}
          onPlay={handlePlay}
          onReset={reset} onSkip={skip}
          onFocusModeOpen={() => setFocusMode(true)}
          focusMins={focusMins} breakMins={breakMins}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "var(--bg)" }}>
          <TabBar active={tab} setActive={setTab} badge={activityBadge} />
          {tabContent[tab]}
        </main>
      </div>

      {focusMode && (
        <FocusModeOverlay
          minutes={minutes} seconds={seconds} isBreak={isBreak} running={running}
          timerLabel={timerLabel}
          onPlay={handlePlay} onReset={reset} onSkip={skip}
          onClose={() => setFocusMode(false)}
          focusMins={focusMins} breakMins={breakMins}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
          initialFocus={focusMins}
          initialBreak={breakMins}
          initialRoomName={roomName}
        />
      )}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} roomName={roomName} />}
    </div>
  );
}