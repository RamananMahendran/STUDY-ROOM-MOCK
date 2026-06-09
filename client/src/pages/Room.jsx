import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { CreateRoomModal } from "./components/TopBar";

// Error Boundary to catch render crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'white', backgroundColor: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// ─── CSS Variables injected globally (Removed hardcoded styles to use index.css) ──────────

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
  Crown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 16l-2-8 5 3 4-6 4 6 5-3-2 8H5zM3 19h18v2H3v-2z" />
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
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Document: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Paperclip: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  ),
};

// ─── Timer Circle ──────────────────────────────────────────────────────────────
function TimerCircle({ minutes, seconds, label, isBreak, running, size = 168, totalMins = 90 }) {
  const total = totalMins * 60;
  const remaining = minutes * 60 + seconds;
  const elapsed = Math.max(0, total - remaining);
  const progress = total > 0 ? elapsed / total : 0;
  const r = size === 168 ? 72 : 108;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" strokeWidth={size === 168 ? 4 : 6} style={{ stroke: "rgba(255,255,255,0.05)" }} />
        <circle
          cx={cx} cy={cx} r={r} fill="none"
          strokeWidth={size === 168 ? 4 : 6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ stroke: isBreak ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)", transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      
      {/* dot indicator */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        transform: `rotate(${progress * 360}deg)`,
        transition: "transform 1s linear"
      }}>
        <div style={{
          position: "absolute",
          top: cx - r - 3,
          left: cx - 3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: isBreak ? "var(--success)" : "var(--accent-text)",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size === 168 ? "1.85rem" : "2.5rem",
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          color: "var(--text)",
          letterSpacing: "2px",
          lineHeight: 1,
        }}>
          <span>{String(minutes).padStart(2, "0")}</span>
          <span style={{ margin: "0 4px", color: "var(--text-subtle)", transform: "translateY(-2px)" }}>:</span>
          <span>{String(seconds).padStart(2, "0")}</span>
        </div>
        <span style={{
          fontSize: "0.85rem",
          marginTop: 12,
          padding: "6px 18px",
          borderRadius: 99,
          backgroundColor: running ? (isBreak ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.15)") : "transparent",
          border: `1px solid ${running ? (isBreak ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)") : "var(--border-strong)"}`,
          color: running ? (isBreak ? "var(--success)" : "var(--accent)") : "var(--text-muted)",
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
function NotesPanel({ socket, roomId }) {
  const [text, setText] = useState("");
  const [viewMode, setViewMode] = useState("write"); // write, split, preview

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (newText) => setText(newText);
    socket.on("notes_update", handleUpdate);
    return () => socket.off("notes_update", handleUpdate);
  }, [socket]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (socket) socket.emit("notes_change", { roomId, text: val });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
        <Icon.Notes />
        <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>Shared Notes</span>
        <span style={{ fontSize: "0.72rem", marginLeft: 6, padding: "2px 8px", borderRadius: 5, color: "var(--text-subtle)", backgroundColor: "var(--surface-2)" }}>
          Select text to format
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 6, padding: 2, gap: 2 }}>
            <button onClick={() => setViewMode("write")} style={{ width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: viewMode === "write" ? "var(--accent)" : "var(--text-muted)", backgroundColor: viewMode === "write" ? "var(--accent-bg)" : "transparent", transition: "all 0.15s" }}><Icon.Edit /></button>
            <button onClick={() => setViewMode("split")} style={{ width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: viewMode === "split" ? "var(--accent)" : "var(--text-muted)", backgroundColor: viewMode === "split" ? "var(--accent-bg)" : "transparent", transition: "all 0.15s" }}><Icon.Split /></button>
            <button onClick={() => setViewMode("preview")} style={{ width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: viewMode === "preview" ? "var(--accent)" : "var(--text-muted)", backgroundColor: viewMode === "preview" ? "var(--accent-bg)" : "transparent", transition: "all 0.15s" }}><Icon.Eye /></button>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)", width: 44, textAlign: "right" }}>{text.length} chars</span>
        </div>
      </div>
      
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {(viewMode === "write" || viewMode === "split") && (
          <textarea
            style={{ 
              flex: 1, fontSize: "0.85rem", padding: 20, resize: "none", outline: "none", 
              backgroundColor: "transparent", color: "var(--text)", lineHeight: 1.7,
              borderRight: viewMode === "split" ? "1px solid var(--border)" : "none",
              fontFamily: "inherit"
            }}
            placeholder="Start typing shared notes..."
            value={text}
            onChange={handleChange}
          />
        )}
        
        {(viewMode === "split" || viewMode === "preview") && (
          <div style={{ 
            flex: 1, padding: 20, overflowY: "auto", 
            fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.7,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            backgroundColor: "transparent",
            fontFamily: "inherit"
          }}>
            {text ? text : <span style={{ color: "var(--text-muted)" }}>Nothing to preview</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ messages, sendMessage, currentUserId }) {
  const [msg, setMsg] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    if (!msg.trim()) return;
    sendMessage(msg);
    setMsg("");
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Determine if a message belongs to the current user
  const isMine = (m) => {
    return m.self === true || (currentUserId && Number(m.userId) === Number(currentUserId));
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 16px", display: "flex", flexDirection: "column" }}>
        {/* header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--accent-bg)", border: "1px solid rgba(108,99,255,0.25)",
            color: "var(--accent)", marginBottom: 10,
          }}>
            <Icon.Chat />
          </div>
          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Room Chat</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>This is the beginning of the conversation.</p>
        </div>

        {/* messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {messages.map((m, idx) => {
            const mine = isMine(m);
            const prevMsg = messages[idx - 1];
            // Show name if this is the first message in a group from this sender (left-side only)
            const showName = !mine && (!prevMsg || isMine(prevMsg) || prevMsg.userName !== m.userName);

            return (
              <div key={m.id} style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: showName && !mine ? 2 : 1,
                marginTop: showName && !mine ? 8 : 0,
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: mine ? "flex-end" : "flex-start",
                  maxWidth: "72%",
                }}>
                  {/* Sender name — only for others, only at start of group */}
                  {showName && (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      marginLeft: 12,
                      marginBottom: 3,
                    }}>
                      {m.userName || "Unknown"}
                    </span>
                  )}

                  {/* Bubble */}
                  <div style={{
                    padding: "9px 14px",
                    borderRadius: mine
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    backgroundColor: mine ? "var(--accent)" : "var(--surface-2)",
                    color: mine ? "#fff" : "var(--text)",
                    wordBreak: "break-word",
                    boxShadow: mine
                      ? "0 1px 6px rgba(99,102,241,0.25)"
                      : "0 1px 4px rgba(0,0,0,0.15)",
                  }}>
                    {m.text}
                  </div>

                  {/* Timestamp */}
                  <span style={{
                    fontSize: "0.65rem",
                    color: "var(--text-subtle)",
                    marginTop: 3,
                    marginLeft: mine ? 0 : 12,
                    marginRight: mine ? 4 : 0,
                  }}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <input
          style={{
            flex: 1, borderRadius: 24, padding: "10px 18px",
            fontSize: "0.875rem", outline: "none",
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
            width: 38, height: 38, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: msg.trim() ? "var(--accent)" : "var(--surface-2)",
            color: "#fff", cursor: "pointer", border: "none",
            transition: "background 0.2s",
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
  const [tasks, setTasks] = useState([{ id: 1, text: "this", done: false, priority: "High", dueDate: "2024-06-05" }]);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [showPriority, setShowPriority] = useState(false);
  const [sortBy, setSortBy] = useState("Added");
  const [showSort, setShowSort] = useState(false);

  const priorities = [
    { label: "High", color: "#ef4444" },
    { label: "Medium", color: "#f59e0b" },
    { label: "Low", color: "#22c55e" },
  ];
  const priorityColor = priorities.find(p => p.label === priority)?.color || "#f59e0b";

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask, done: false, priority, dueDate }]);
    setNewTask(""); setAdding(false); setDueDate("");
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
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "Added") return a.id - b.id;
    if (sortBy === "Priority") {
      const p = { "High": 3, "Medium": 2, "Low": 1 };
      return p[b.priority] - p[a.priority];
    }
    if (sortBy === "Due Date") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const done = sortedTasks.filter(t => t.done);
  const todo = sortedTasks.filter(t => !t.done);

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
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowSort(!showSort)}
              style={{ 
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 8, 
                border: "1px solid var(--border-strong)", backgroundColor: "transparent",
                color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer" 
              }}
            >
              {sortBy} <span style={{ fontSize: "0.6rem" }}>↑↓</span>
            </button>
            {showSort && (
              <div style={{
                position: "absolute", top: 34, right: 0, zIndex: 30,
                borderRadius: 10, padding: "6px", minWidth: 130,
                backgroundColor: "var(--surface)", border: "1px solid var(--border)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column", gap: 2,
              }}>
                {["Added", "Priority", "Due Date"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSort(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 10px", fontSize: "0.8rem", color: "var(--text)", 
                      borderRadius: 6, cursor: "pointer",
                      backgroundColor: "transparent", border: "none",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--success)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text)"; }}
                  >
                    <span style={{ width: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {sortBy === opt && <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 8,
              border: "1px solid var(--accent)", backgroundColor: "var(--accent-bg)", color: "var(--text)",
              fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
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
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
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
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>{t.text}</span>
                {t.dueDate && (
                  <div style={{ display: "flex" }}>
                    <span style={{ 
                      fontSize: "0.65rem", color: "var(--text-muted)", 
                      padding: "3px 6px", borderRadius: 4, border: "1px solid var(--border-strong)" 
                    }}>
                      Due {new Date(t.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
              </div>
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
function FilesPanel({ socket, roomId, currentUser, showToast }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handleFileShared = (file) => setFiles(prev => [file, ...prev]);
    socket.on("file_shared", handleFileShared);
    return () => socket.off("file_shared", handleFileShared);
  }, [socket]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    showToast("Uploading...", "loading");

    // Simulate upload delay
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      const newFile = {
        id: Date.now(),
        name: file.name,
        author: currentUser?.name || "Anonymous",
        url: fileUrl,
      };

      setFiles(prev => [newFile, ...prev]);
      setIsUploading(false);
      showToast("File shared", "success");
      
      if (socket) {
        socket.emit("file_shared", { roomId, file: newFile });
      }
    }, 1000);
  };

  const handleDelete = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    showToast("File deleted", "success");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px", gap: 20, overflowY: "auto" }}>
      {/* Upload Area */}
      <label style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        border: "1px dashed rgba(148, 163, 184, 0.3)", borderRadius: 100,
        padding: "14px 0",
        fontSize: "0.82rem", color: "var(--text-muted)", cursor: isUploading ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        opacity: isUploading ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!isUploading) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; } }}
      onMouseLeave={e => { if (!isUploading) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-muted)"; } }}
      >
        <Icon.Upload /> Upload PDF or Image
        <input type="file" style={{ display: "none" }} accept=".pdf,image/*" onChange={handleUpload} disabled={isUploading} />
      </label>

      {/* File List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {files.map(f => (
          <div key={f.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 20px", borderRadius: 12,
            backgroundColor: "var(--surface)", border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)"
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
              backgroundColor: "var(--accent-bg)", color: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon.Document />
            </div>
            
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>
                {f.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: 4, lineHeight: 1 }}>
                by {f.author}
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)" }}>
              <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer", color: "inherit", textDecoration: "none", display: "flex", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color="var(--text)"} onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}><Icon.Eye /></a>
              <a href={f.url} download={f.name} style={{ cursor: "pointer", color: "inherit", textDecoration: "none", display: "flex", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color="var(--text)"} onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}><Icon.Download /></a>
              <button onClick={() => handleDelete(f.id)} style={{ cursor: "pointer", color: "inherit", background: "none", border: "none", padding: 0, display: "flex", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color="#ef4444"} onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}><Icon.Trash /></button>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-subtle)" }}>
            No files shared yet.
          </div>
        )}
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
              backgroundColor: item.type === "file" ? "rgba(217, 119, 6, 0.15)" : item.type === "join" ? "rgba(34,197,94,0.15)" : item.type === "voice" ? "rgba(139, 92, 246, 0.15)" : "var(--accent-bg)", 
              border: item.type === "file" ? "1px solid rgba(217, 119, 6, 0.25)" : item.type === "join" ? "1px solid rgba(34,197,94,0.25)" : item.type === "voice" ? "1px solid rgba(139, 92, 246, 0.25)" : "1px solid rgba(108,99,255,0.2)", 
              color: item.type === "file" ? "#d97706" : item.type === "join" ? "var(--success)" : item.type === "voice" ? "#8b5cf6" : "var(--accent)",
            }}>
              {item.type === "file" ? <Icon.Paperclip /> : item.type === "join" ? <Icon.AddUser /> : item.type === "voice" ? <Icon.Mic /> : <Icon.Clock />}
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
function MembersPanel({ 
  members, 
  currentUser, 
  friendStatus, 
  onAddFriend, 
  onAcceptFriend, 
  showToast, 
  roomOwnerId,
  inCall,
  handleLeaveCall,
  handleJoinCall,
  participantData = []
}) {
  const onlineCount = members.filter(m => m.isOnline).length;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Voice & Video */}
      <div style={{
        margin: "12px 16px",
        padding: "14px 16px",
        borderRadius: 12,
        backgroundColor: "rgba(108,99,255,0.02)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
            <Icon.Mic /><Icon.Camera />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>Voice & Video</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {participantData.length > 0
                ? `${participantData.length} ${participantData.length === 1 ? "person" : "people"} studying live`
                : "Study together on camera — join the call"}
            </p>
          </div>
          <button 
            onClick={inCall ? handleLeaveCall : handleJoinCall}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 8,
              border: inCall ? "1px solid #ef4444" : "1px solid rgba(108,99,255,0.3)",
              color: inCall ? "#ef4444" : "var(--accent)",
              fontSize: "0.78rem", cursor: "pointer",
              backgroundColor: inCall ? "rgba(239, 68, 68, 0.08)" : "transparent",
              fontWeight: 500
            }}
          >
            {inCall ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5l4.553-2.276A1 1 0 0121 9.118v5.764a1 1 0 01-1.447.894L15 13.5M3 9a2 2 0 012-2h5.5M3 9v6a2 2 0 002 2h8a2 2 0 002-2v-.5M1 1l22 22" />
                </svg>
                Leave
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.Camera /> Join Call</span>
            )}
          </button>
        </div>

        {/* Call Participants List */}
        {participantData.length > 0 && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 10,
            borderTop: "1px solid var(--border)"
          }}>
            {participantData.map(p => {
              const initials = (p.userName || "U").substring(0, 2).toUpperCase();
              return (
                <div key={p.userId} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "var(--accent)", color: "#fff",
                    fontSize: "0.68rem", fontWeight: 700
                  }}>
                    {initials}
                  </div>
                  <span style={{
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: p.isMe ? "#22c55e" : "var(--text)"
                  }}>
                    {p.isMe ? "You" : p.userName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 10 }}>
          Study Group · {onlineCount} Online / {members.length} Total
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((member, index) => {
            const isMe = currentUser && Number(member.userId) === Number(currentUser.id);
            // Fallback: If backend hasn't been deployed and doesn't send roomOwnerId, assume the first person to join (index 0) is the Admin.
            const isAdmin = roomOwnerId 
              ? Number(member.userId) === Number(roomOwnerId) 
              : index === 0;
            
            const initials = (member.userName || "U").substring(0, 2).toUpperCase();
            const status = friendStatus[member.userId];
            const participant = participantData.find(p => String(p.userId) === String(member.userId));
            const isInCall = !!participant;
            const isMicOn = participant ? participant.micOn : false;

            return (
              <div key={member.userId} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 12,
                backgroundColor: isMe ? "rgba(108,99,255,0.08)" : "var(--surface)", 
                border: isMe ? "1px solid rgba(108,99,255,0.15)" : "1px solid var(--border)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "var(--accent)", color: "#fff",
                  fontSize: "0.78rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {member.userName || `User ${member.userId}`}
                    {isMe && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(you)</span>}
                    {isAdmin && (
                      <span style={{
                        display: "flex", alignItems: "center", gap: 3,
                        padding: "2px 6px", borderRadius: 6,
                        background: "rgba(108,99,255,0.15)", color: "#a5b4fc",
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em"
                      }}>
                        <Icon.Crown size={10} /> Admin
                      </span>
                    )}
                    {isInCall && isMicOn && (
                      <span style={{
                        display: "flex", alignItems: "center", gap: 3,
                        padding: "2px 6px", borderRadius: 6,
                        background: "rgba(108,99,255,0.15)", color: "#818cf8",
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em"
                      }}>
                        SPEAKING
                      </span>
                    )}
                  </p>
                  {member.email && (
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{member.email}</p>
                  )}
                </div>
                
                {/* Right side: Mic indicator and status dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isInCall && (
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: isMicOn ? "rgba(108,99,255,0.15)" : "rgba(239, 68, 68, 0.12)", 
                      color: isMicOn ? "#818cf8" : "#ef4444"
                    }}>
                      {isMicOn ? (
                        <Icon.Mic />
                      ) : (
                        <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9a3 3 0 0 0 3 3m1.2-1.2A3 3 0 0 0 15 9V5a3 3 0 0 0-6 0v.8m10.2 11.2a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4m-4-8v-3m10 6L1 1" />
                        </svg>
                      )}
                    </div>
                  )}

                  {!isMe && (
                    <>
                      {status === "accepted" ? (
                        <span style={{ fontSize: "0.7rem", color: "var(--success)", padding: "4px 8px", backgroundColor: "rgba(34,197,94,0.1)", borderRadius: 6 }}>Friends</span>
                      ) : status === "pending_sent" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", backgroundColor: "rgba(217, 119, 6, 0.15)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 6, color: "#d97706", fontSize: "0.7rem" }}>
                          <Icon.Clock /> Pending
                        </div>
                      ) : status === "pending_received" ? (
                        <button onClick={() => onAcceptFriend(member.userId)} style={{ padding: "4px 10px", borderRadius: 6, backgroundColor: "var(--success)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
                          Accept
                        </button>
                      ) : (
                        <button onClick={() => onAddFriend(member.userId)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, backgroundColor: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", fontSize: "0.7rem", cursor: "pointer" }}>
                          <Icon.AddUser />
                        </button>
                      )}
                    </>
                  )}
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: member.isOnline ? "var(--success)" : "var(--text-muted)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Top Header Bar ────────────────────────────────────────────────────────────
function Header({ 
  roomCode, 
  onSettings, 
  onInvite, 
  roomName,
  inCall,
  handleToggleMic,
  handleToggleCam,
  localMicOn,
  localCamOn,
  setShowCallPanel,
  participantData,
  handleLeaveCall,
  handleJoinCall
}) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme) setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 10, padding: "0 16px",
      height: 44, borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)",
      flexShrink: 0,
    }}>
      {/* Room name — left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          backgroundColor: "var(--surface-2)", border: "1px solid var(--border-strong)",
        }}>📚</div>
        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>{roomName}</span>
        <div style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: "0.6rem", fontWeight: 600, padding: "2px 6px", borderRadius: 99,
          color: "var(--accent-text)", backgroundColor: "var(--surface-2)", border: "1px solid var(--border)",
          marginLeft: 2,
        }}>
          <Icon.Crown /> Host
        </div>
      </div>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: "0.75rem", padding: "4px 10px", borderRadius: 7,
          fontFamily: "monospace", color: "var(--text-muted)",
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
        }}>{roomCode}</span>
        <button onClick={handleCopy} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: copied ? "var(--success)" : "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer", transition: "color 0.2s" }}>
          {copied ? <Icon.Check /> : <Icon.Copy />}
        </button>
        <button onClick={onInvite} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Icon.AddUser />
        </button>
        {inCall ? (
          <>
            <button onClick={handleToggleMic} style={{
              width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: localMicOn ? "var(--accent)" : "rgba(239, 68, 68, 0.15)",
              color: localMicOn ? "#fff" : "#ef4444",
              border: "1px solid var(--border)", cursor: "pointer"
            }} title={localMicOn ? "Mute Mic" : "Unmute Mic"}>
              <Icon.Mic />
            </button>
            <button onClick={handleToggleCam} style={{
              width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: localCamOn ? "var(--accent)" : "rgba(239, 68, 68, 0.15)",
              color: localCamOn ? "#fff" : "#ef4444",
              border: "1px solid var(--border)", cursor: "pointer"
            }} title={localCamOn ? "Stop Camera" : "Start Camera"}>
              <Icon.Camera />
            </button>
            <button onClick={() => setShowCallPanel(prev => !prev)} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", height: 30, borderRadius: 7,
              border: "1px solid rgba(108,99,255,0.35)", color: "#fff",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              backgroundColor: "var(--accent)",
            }} title="Toggle Call Panel">
              <Icon.Members /> {participantData.length}
            </button>
            <button onClick={handleLeaveCall} style={{
              width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "#ef4444", color: "#fff",
              border: "none", cursor: "pointer"
            }} title="End Call">
              ✕
            </button>
          </>
        ) : (
          <button onClick={handleJoinCall} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 7,
            border: "1px solid rgba(108,99,255,0.35)", color: "var(--accent)",
            fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
            backgroundColor: "var(--accent-bg)",
          }}>
            <Icon.Mic /><Icon.Camera /> Call
          </button>
        )}
        <button onClick={onSettings} style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
          <Icon.Settings />
        </button>
        {/* Theme toggle */}
        <button
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={handleToggleTheme}
          style={{
            flexShrink: 0, display: "flex", alignItems: "center",
            width: 40, height: 22, borderRadius: 99,
            border: "1px solid var(--border)",
            backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)",
            padding: 2, cursor: "pointer",
          }}
        >
          <span style={{
            width: 16, height: 16, borderRadius: "50%",
            backgroundColor: "rgb(99,102,241)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            transform: theme === "dark" ? "translateX(0px)" : "translateX(18px)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
        </button>
      </div>
    </header>
  );
}

// ─── Focus Mode Overlay ────────────────────────────────────────────────────────
function FocusModeOverlay({ minutes, seconds, isBreak, running, onPlay, onReset, onSkip, onClose, focusMins, breakMins, onModeChange }) {
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
          <button 
            onClick={() => onModeChange("focus")}
            style={{ padding: "8px 28px", borderRadius: 8, backgroundColor: !isBreak ? "var(--surface-2)" : "transparent", color: !isBreak ? "var(--text)" : "var(--text-muted)", fontSize: "0.85rem", fontWeight: !isBreak ? 500 : 400, cursor: "pointer", border: "none", transition: "all 0.2s" }}>
            Focus
          </button>
          <button 
            onClick={() => onModeChange("break")}
            style={{ padding: "8px 28px", borderRadius: 8, backgroundColor: isBreak ? "var(--surface-2)" : "transparent", color: isBreak ? "var(--text)" : "var(--text-muted)", fontSize: "0.85rem", fontWeight: isBreak ? 500 : 400, cursor: "pointer", border: "none", transition: "all 0.2s" }}>
            Break
          </button>
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
function SettingsModal({ onClose, onSave, onDeleteRoom, initialFocus, initialBreak, initialRoomName, members = [], roomOwnerId }) {
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

          {/* Admin Details */}
          {(() => {
            const adminMember = members.find((member, index) => 
              roomOwnerId ? Number(member.userId) === Number(roomOwnerId) : index === 0
            );
            if (!adminMember) return null;
            const initials = (adminMember.userName || "U").substring(0, 2).toUpperCase();
            return (
              <>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-subtle)", marginTop: 12 }}>
                  MEMBERS (1)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ 
                    padding: "12px 16px", 
                    borderRadius: 10, 
                    backgroundColor: "var(--bg)", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12, 
                    border: "1px solid var(--border)" 
                  }}>
                    <div style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: "50%", 
                      backgroundColor: "var(--surface)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.85rem", 
                      fontWeight: 700, 
                      color: "var(--text-muted)", 
                      flexShrink: 0 
                    }}>
                      {initials}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                        {adminMember.userName || `User ${adminMember.userId}`}
                        <span style={{ 
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: "0.65rem", 
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          backgroundColor: "rgba(108,99,255,0.15)", 
                          color: "#a5b4fc", 
                          border: "1px solid rgba(108,99,255,0.2)",
                          fontWeight: 700
                        }}>
                          <Icon.Crown size={10} /> Admin
                        </span>
                      </p>
                      {adminMember.email && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{adminMember.email}</p>}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

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


          {/* Danger Zone */}
          <div style={{ padding: 20, borderRadius: 10, border: "1px solid rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.05)", marginTop: 12 }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: 4 }}>Danger Zone</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 16 }}>Deleting the room removes all messages and files permanently.</p>
            <button onClick={onDeleteRoom} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s" }}>
              <Icon.Trash /> Delete Room
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Invite Modal ──────────────────────────────────────────────────────────────
function InviteModal({ onClose, roomName, roomCode }) {
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
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{roomName}</p>
              <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>Code: {roomCode}</p>
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

  const _rawUser = JSON.parse(localStorage.getItem("user") || "null");
  // Normalize: support both old format (userId only) and new format (id + userId)
  const currentUser = _rawUser ? { ..._rawUser, id: _rawUser.id || _rawUser.userId } : null;

  // Socket, Chat, and Sync State
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [roomOwnerId, setRoomOwnerId] = useState(null);

  // Audio / Video call state
  const [inCall, setInCall] = useState(false);
  const [localMicOn, setLocalMicOn] = useState(true);
  const [localCamOn, setLocalCamOn] = useState(true);
  const [callParticipants, setCallParticipants] = useState({}); // { [socketId]: { userId, micOn, camOn, stream } }
  const [showCallPanel, setShowCallPanel] = useState(true);

  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({}); // { [socketId]: RTCPeerConnection }
  const pendingCandidatesRef = useRef({}); // { [socketId]: RTCIceCandidateInit[] }

  const membersRef = useRef([]);
  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  const [callPosition, setCallPosition] = useState({ x: 0, y: 0 });
  const [callMinimized, setCallMinimized] = useState(false);
  const [callExpanded, setCallExpanded] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...callPosition };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setCallPosition({
      x: positionStartRef.current.x + dx,
      y: positionStartRef.current.y + dy
    });
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const participantData = Object.keys(callParticipants).map(sid => {
    const p = callParticipants[sid];
    if (sid === "local") {
      return {
        ...p,
        userName: currentUser?.name || currentUser?.username || "You",
        email: currentUser?.email,
        isMe: true
      };
    }
    const member = members.find(m => String(m.userId) === String(p.userId));
    return {
      ...p,
      userName: member ? member.userName : `User ${p.userId}`,
      email: member ? member.email : "",
      isMe: false,
      socketId: sid
    };
  });

  const handleJoinCall = async () => {
    try {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalMicOn(true);
        setLocalCamOn(true);
      } catch (err) {
        console.warn("[Call] Failed to get audio/video, trying audio only:", err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          setLocalMicOn(true);
          setLocalCamOn(false);
        } catch (audioErr) {
          console.error("[Call] Failed to get audio track:", audioErr);
        }
      }

      localStreamRef.current = stream;
      setInCall(true);
      setShowCallPanel(true);

      setCallParticipants(prev => ({
        ...prev,
        local: {
          userId: currentUser?.id,
          micOn: stream ? stream.getAudioTracks().length > 0 : false,
          camOn: stream ? stream.getVideoTracks().length > 0 : false,
          stream
        }
      }));

      const myName = currentUser?.name || currentUser?.username || "You";
      addActivity(`${myName} joined voice`, "voice");

      if (socket) {
        socket.emit("join_call", { roomId });
        socket.emit("toggle_media", {
          roomId,
          type: "mic",
          enabled: stream ? stream.getAudioTracks().length > 0 : false
        });
        socket.emit("toggle_media", {
          roomId,
          type: "cam",
          enabled: stream ? stream.getVideoTracks().length > 0 : false
        });
      }
    } catch (e) {
      console.error("[Call] Error joining call:", e);
    }
  };

  const handleLeaveCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    Object.keys(peerConnectionsRef.current).forEach(sid => {
      peerConnectionsRef.current[sid].close();
    });
    peerConnectionsRef.current = {};
    pendingCandidatesRef.current = {};

    if (socket) {
      socket.emit("leave_call", { roomId });
    }

    setInCall(false);
    setCallParticipants({});

    const myName = currentUser?.name || currentUser?.username || "You";
    addActivity(`${myName} left voice`, "voice");
  };

  const handleToggleMic = () => {
    const nextVal = !localMicOn;
    setLocalMicOn(nextVal);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = nextVal;
      });
    }
    if (socket) {
      socket.emit("toggle_media", { roomId, type: "mic", enabled: nextVal });
    }
    setCallParticipants(prev => ({
      ...prev,
      local: {
        ...prev.local,
        micOn: nextVal
      }
    }));
  };

  const handleToggleCam = () => {
    const nextVal = !localCamOn;
    setLocalCamOn(nextVal);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = nextVal;
      });
    }
    if (socket) {
      socket.emit("toggle_media", { roomId, type: "cam", enabled: nextVal });
    }
    setCallParticipants(prev => ({
      ...prev,
      local: {
        ...prev.local,
        camOn: nextVal
      }
    }));
  };

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.keys(peerConnectionsRef.current).forEach(sid => {
        peerConnectionsRef.current[sid].close();
      });
      pendingCandidatesRef.current = {};
    };
  }, []);
  
  // ── Activity log ─────────────────────────────────────────────────────────────
  const [activityLog, setActivityLog] = useState([]);
  const [lastSeenActivityCount, setLastSeenActivityCount] = useState(0);

  const addActivity = (label, type = "info") => {
    setActivityLog(prev => [{ id: Date.now(), label, ts: Date.now(), type }, ...prev]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socketIo = io(API_BASE, {
      transports: ["websocket", "polling"],
      auth: { token }
    });

    socketIo.on("connect", () => {
      console.log("[Socket] Connected:", socketIo.id);
      socketIo.emit("join_room", roomId);
    });

    socketIo.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socketIo.on("room_state", ({ users, ownerId }) => {
      console.log("[Socket] room_state received:", { users, ownerId });
      setMembers(users || []);
      if (ownerId) setRoomOwnerId(ownerId);
    });

    socketIo.on("friendship_update", (data) => {
      if (currentUser && String(data.fromUserId) === String(currentUser.id || currentUser.userId)) {
        console.log("[Socket] Ignored friendship update initiated by myself");
        return;
      }
      setFriendStatus(prev => ({ ...prev, [data.fromUserId]: data.status }));
    });

    socketIo.on("timer_sync", (data) => {
      if (data.state === "FOCUS" || data.state === "BREAK") {
        setMode(data.state.toLowerCase());
        setRunning(true);
        if (data.remainingTime) {
          setTimeLeft(Math.floor(data.remainingTime / 1000));
        } else if (data.endTime) {
          setTimeLeft(Math.max(0, Math.floor((data.endTime - Date.now()) / 1000)));
        } else if (data.duration) {
          setTimeLeft(Math.floor(data.duration / 1000));
        }
      } else if (data.state === "PAUSED") {
        setRunning(false);
        setWasPaused(true);
        if (data.remainingTime) {
          setTimeLeft(Math.floor(data.remainingTime / 1000));
        }
      } else if (data.state === "IDLE") {
        setRunning(false);
        setWasPaused(false);
      }
    });

    socketIo.on("timer_complete", (data) => {
      setRunning(false);
      setWasPaused(false);
      if (data.type === "FOCUS") {
        setMode("break");
      } else {
        setMode("focus");
      }
    });

    socketIo.on("user_joined", (data) => {
      setMembers(prev => {
        if (prev.find(m => m.userId == data.userId)) return prev;
        return [...prev, { ...data, isOnline: true }];
      });
      addActivity(`${data.userName || data.userId} joined`, "join");
    });

    socketIo.on("user_left", (data) => {
      setMembers(prev => prev.filter(m => m.userId != data.userId));
      addActivity(`${data.userName || data.userId} left`, "leave");
    });

    socketIo.on("file_shared", (file) => {
      addActivity(`${file.author} shared ${file.name}`, "file");
    });

    socketIo.on("chat_history", (history) => {
      setMessages(history.map(m => ({
        id: m.id,
        userId: m.userId,
        text: m.message,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        // Use the reliable isMine flag computed by the server during auth
        self: m.isMine != null ? m.isMine : (currentUser && Number(m.userId) === Number(currentUser.id)),
        userName: m.userName || m.user?.name || `User ${m.userId}`
      })));
    });

    socketIo.on("new_message", (m) => {
      // Primary check: ID
      let isMine = currentUser && Number(m.userId) === Number(currentUser.id);

      const confirmed = {
        id: m.id || Date.now(),
        userId: m.userId,   // needed for ChatPanel.isMine()
        text: m.message,
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        self: isMine,
        userName: m.userName || `User ${m.userId}`
      };
      setMessages(prev => {
        // Replace last optimistic message from self, or just append for others
        if (isMine) {
          const idx = [...prev].reverse().findIndex(x => x.id && String(x.id).startsWith("optimistic-") && x.self);
          if (idx !== -1) {
            const realIdx = prev.length - 1 - idx;
            const next = [...prev];
            next[realIdx] = confirmed;
            return next;
          }
        }
        return [...prev, confirmed];
      });
    });

    socketIo.on("friend_request_received", (data) => {
      if (currentUser && String(data.targetUserId) === String(currentUser.id || currentUser.userId)) {
        setFriendStatus(prev => ({ ...prev, [data.fromUserId]: "pending_received" }));
      }
    });

    socketIo.on("friend_request_accepted", (data) => {
      if (currentUser && String(data.fromUserId) === String(currentUser.id || currentUser.userId)) {
        setFriendStatus(prev => ({ ...prev, [data.targetUserId]: "accepted" }));
        showToast("Friend request accepted!", "success");
      }
    });

    socketIo.on("user_joined_call", async ({ userId, socketId }) => {
      console.log("[Call] User joined call:", userId, socketId);
      
      // Close existing peer connection for this socketId if it exists
      if (peerConnectionsRef.current[socketId]) {
        peerConnectionsRef.current[socketId].close();
      }
      delete pendingCandidatesRef.current[socketId];

      setCallParticipants(prev => ({
        ...prev,
        [socketId]: {
          userId,
          micOn: true,
          camOn: true,
          stream: null
        }
      }));

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      peerConnectionsRef.current[socketId] = pc;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketIo.emit("webrtc_signal", {
            targetSocketId: socketId,
            signal: { type: "ice-candidate", candidate: event.candidate }
          });
        }
      };

      pc.ontrack = (event) => {
        console.log("[Call] Received remote track:", event.streams[0]);
        setCallParticipants(prev => {
          if (!prev[socketId]) return prev;
          const stream = (event.streams && event.streams[0]) 
            ? event.streams[0] 
            : (prev[socketId].stream || new MediaStream());
          if (!(event.streams && event.streams[0])) {
            try {
              stream.addTrack(event.track);
            } catch (err) {
              // ignore
            }
          }
          return {
            ...prev,
            [socketId]: {
              ...prev[socketId],
              stream
            }
          };
        });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketIo.emit("webrtc_signal", {
        targetSocketId: socketId,
        signal: { type: "offer", offer }
      });

      const member = membersRef.current.find(m => String(m.userId) === String(userId));
      const userName = member ? member.userName : `User ${userId}`;
      addActivity(`${userName} joined voice`, "voice");
    });

    socketIo.on("user_left_call", ({ userId, socketId }) => {
      console.log("[Call] User left call:", userId, socketId);
      if (peerConnectionsRef.current[socketId]) {
        peerConnectionsRef.current[socketId].close();
        delete peerConnectionsRef.current[socketId];
      }
      delete pendingCandidatesRef.current[socketId];
      setCallParticipants(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });

      const member = membersRef.current.find(m => String(m.userId) === String(userId));
      const userName = member ? member.userName : `User ${userId}`;
      addActivity(`${userName} left voice`, "voice");
    });

    socketIo.on("webrtc_signal", async ({ senderSocketId, senderUserId, signal }) => {
      console.log("[Call] WebRTC signal received:", signal.type);
      let pc = peerConnectionsRef.current[senderSocketId];

      if (signal.type === "offer") {
        let isNew = !pc;
        if (pc) {
          pc.close();
        }
        delete pendingCandidatesRef.current[senderSocketId];

        pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        peerConnectionsRef.current[senderSocketId] = pc;

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
          });
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketIo.emit("webrtc_signal", {
              targetSocketId: senderSocketId,
              signal: { type: "ice-candidate", candidate: event.candidate }
            });
          }
        };

        pc.ontrack = (event) => {
          console.log("[Call] Received remote track (on offer):", event.streams[0]);
          setCallParticipants(prev => {
            if (!prev[senderSocketId]) return prev;
            const stream = (event.streams && event.streams[0]) 
              ? event.streams[0] 
              : (prev[senderSocketId].stream || new MediaStream());
            if (!(event.streams && event.streams[0])) {
              try {
                stream.addTrack(event.track);
              } catch (err) {
                // ignore
              }
            }
            return {
              ...prev,
              [senderSocketId]: {
                ...prev[senderSocketId],
                stream
              }
            };
          });
        };

        setCallParticipants(prev => ({
          ...prev,
          [senderSocketId]: {
            userId: senderUserId,
            micOn: true,
            camOn: true,
            stream: prev[senderSocketId]?.stream || null
          }
        }));

        if (isNew) {
          const member = membersRef.current.find(m => String(m.userId) === String(senderUserId));
          const userName = member ? member.userName : `User ${senderUserId}`;
          addActivity(`${userName} joined voice`, "voice");
        }

        await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
        
        // Drain pending candidates for offer
        const candidates = pendingCandidatesRef.current[senderSocketId] || [];
        for (const cand of candidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (err) {
            console.error("[Call] Error adding queued ICE candidate (offer):", err);
          }
        }
        pendingCandidatesRef.current[senderSocketId] = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketIo.emit("webrtc_signal", {
          targetSocketId: senderSocketId,
          signal: { type: "answer", answer }
        });
      } else if (signal.type === "answer") {
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
          
          // Drain pending candidates for answer
          const candidates = pendingCandidatesRef.current[senderSocketId] || [];
          for (const cand of candidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (err) {
              console.error("[Call] Error adding queued ICE candidate (answer):", err);
            }
          }
          pendingCandidatesRef.current[senderSocketId] = [];
        }
      } else if (signal.type === "ice-candidate") {
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (err) {
            console.error("[Call] Error adding ICE candidate directly:", err);
          }
        } else {
          if (!pendingCandidatesRef.current[senderSocketId]) {
            pendingCandidatesRef.current[senderSocketId] = [];
          }
          pendingCandidatesRef.current[senderSocketId].push(signal.candidate);
        }
      }
    });

    socketIo.on("media_state_changed", ({ userId, micOn, camOn }) => {
      console.log("[Call] Media state changed:", userId, { micOn, camOn });
      setCallParticipants(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(sid => {
          if (String(next[sid].userId) === String(userId)) {
            next[sid] = {
              ...next[sid],
              micOn,
              camOn
            };
          }
        });
        return next;
      });
    });

    setSocket(socketIo);
    return () => socketIo.disconnect();
  }, [roomId, currentUser?.id, currentUser?.userId]);

  const sendMessage = (msg) => {
    if (!socket) {
      console.warn("[Chat] Socket not ready, cannot send message");
      return;
    }
    // Show message immediately in UI (optimistic update)
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      userId: currentUser?.id,   // needed for ChatPanel.isMine()
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      self: true,
      userName: currentUser?.name || currentUser?.username || "You",
    };
    setMessages(prev => [...prev, optimistic]);
    socket.emit("send_message", { roomId, message: msg });
  };

  const handleAddFriend = (targetUserId) => {
    if (!socket) return;
    socket.emit("send_friend_request", { targetUserId });
    setFriendStatus(prev => ({ ...prev, [targetUserId]: "pending_sent" }));
    showToast("Friend request sent!", "success");
  };

  const handleAcceptFriend = (targetUserId) => {
    if (!socket) return;
    socket.emit("accept_friend_request", { fromUserId: targetUserId });
    setFriendStatus(prev => ({ ...prev, [targetUserId]: "accepted" }));
    showToast("Friend request accepted!", "success");
  };

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
  const [toast, setToast] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [friendStatus, setFriendStatus] = useState({}); // { [userId]: "pending_sent" | "pending_received" | "accepted" }
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchFriendships = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [friendsRes, requestsRes] = await Promise.all([
          fetch(`${API}/api/friendships`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/api/friendships/requests`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const friendsData = await friendsRes.json();
        const requestsData = await requestsRes.json();
        
        const statusMap = {};
        if (friendsData.success && friendsData.data) {
          friendsData.data.forEach(f => {
            statusMap[f.id] = "accepted";
          });
        }
        if (requestsData.success) {
          if (requestsData.incoming) {
            requestsData.incoming.forEach(r => {
              statusMap[r.id] = "pending_received";
            });
          }
          if (requestsData.outgoing) {
            requestsData.outgoing.forEach(r => {
              statusMap[r.id] = "pending_sent";
            });
          }
        }
        setFriendStatus(prev => ({ ...prev, ...statusMap }));
      } catch (err) {
        console.error("Error fetching friendships in room:", err);
      }
    };
    fetchFriendships();
  }, [currentUser?.id]);

  // ── Settings state (lifted so timer chips and header react) ─────────────────
  const [focusMins, setFocusMins] = useState(initialRoom.focusMin || 90);
  const [breakMins, setBreakMins] = useState(initialRoom.breakMin || 15);
  const [roomName, setRoomName] = useState(initialRoom.name || "try");

  // Check if room is expired based on createdAt and expires duration
  const [isRoomExpired, setIsRoomExpired] = useState(false);
  
  useEffect(() => {
    if (!initialRoom || !initialRoom.createdAt || !initialRoom.expires) return;
    const expiresHours = parseInt(initialRoom.expires);
    if (isNaN(expiresHours)) return;
    
    const checkExpiry = () => {
      const expiresMs = expiresHours * 60 * 60 * 1000;
      const endMs = initialRoom.createdAt + expiresMs;
      setIsRoomExpired(endMs - Date.now() <= 0);
    };
    
    checkExpiry();
    const intervalId = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [initialRoom]);

  // ── Toast Notifications ──────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    if (tab === "activity") {
      setLastSeenActivityCount(activityLog.length);
    }
  }, [tab, activityLog.length]);

  const isBreak = mode === "break";

  useEffect(() => {
    const logFocusSessionToDatabase = (durationMs) => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      fetch(`${API}/api/auth/study-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ duration: durationMs })
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            if (window.addNotification) {
              window.addNotification(`Focus session logged: +${(durationMs / 60000).toFixed(0)}m focus time!`);
            }
          }
        })
        .catch(err => console.error("Error logging study session:", err));
    };

    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            setWasPaused(false);
            if (!isBreak) {
              const durationMs = focusMins * 60 * 1000;
              setTimeout(() => {
                logFocusSessionToDatabase(durationMs);
              }, 0);
            }
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
      socket?.emit("timer_start", { roomId, duration: timeLeft * 1000, type: isBreak ? "BREAK" : "FOCUS" });
      addActivity(isBreak ? "Break started" : "Focus session started");
    } else {
      setWasPaused(true); // paused mid-session
      socket?.emit("timer_pause", { roomId });
    }
  };

  const reset = () => {
    setRunning(false);
    setWasPaused(false);
    setTimeLeft((isBreak ? breakMins : focusMins) * 60);
    socket?.emit("timer_reset", { roomId });
  };

  const skip = () => {
    setRunning(false);
    setWasPaused(false);
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setTimeLeft((next === "break" ? breakMins : focusMins) * 60);
    socket?.emit("timer_reset", { roomId });
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
    
    // Persist to session storage
    const saved = sessionStorage.getItem("currentRoom");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.name = rn;
      parsed.focusMin = fm;
      parsed.breakMin = bm;
      sessionStorage.setItem("currentRoom", JSON.stringify(parsed));
    }
    
    // Persist to local storage
    const myRoomsSaved = localStorage.getItem("myRooms");
    if (myRoomsSaved) {
      const myRooms = JSON.parse(myRoomsSaved);
      const updated = myRooms.map(r => r.id === roomId ? { ...r, name: rn, focusMin: fm, breakMin: bm } : r);
      localStorage.setItem("myRooms", JSON.stringify(updated));
    }

    // Reset timer to new values only if not currently running
    if (!running) {
      setTimeLeft((isBreak ? bm : fm) * 60);
    }
  };

  const handleDeleteRoom = () => {
    const saved = localStorage.getItem("myRooms");
    if (saved) {
      const rooms = JSON.parse(saved);
      const updated = rooms.filter(r => r.id !== roomId);
      localStorage.setItem("myRooms", JSON.stringify(updated));
    }
    sessionStorage.removeItem("currentRoom");
    sessionStorage.removeItem("activeTimer");
    navigate("/rooms");
  };

  // Timer label: Focusing... / On break / Paused / Ready
  const timerLabel = running
    ? (isBreak ? "On break" : "Focusing...")
    : wasPaused
      ? "Paused"
      : "Ready";

  // Activity badge = count since last visit (simple: total)
  const activityBadge = activityLog.length - lastSeenActivityCount;

  const tabContent = {
    notes: <NotesPanel socket={socket} roomId={roomId} />,
    chat: <ChatPanel messages={messages} sendMessage={sendMessage} currentUserId={currentUser?.id} />,
    tasks: <TasksPanel />,
    files: <FilesPanel 
      socket={socket} roomId={roomId} currentUser={currentUser}
      showToast={showToast}
    />,
    activity: <ActivityPanel items={activityLog} />,
    members: <MembersPanel 
      members={members} 
      currentUser={currentUser} 
      friendStatus={friendStatus}
      onAddFriend={handleAddFriend}
      onAcceptFriend={handleAcceptFriend}
      showToast={showToast}
      roomOwnerId={roomOwnerId}
      inCall={inCall}
      handleLeaveCall={handleLeaveCall}
      handleJoinCall={handleJoinCall}
      participantData={participantData}
    />,
  };

  return (
    <ErrorBoundary>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface)", border: "1px solid var(--border)",
          padding: "10px 16px", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          color: "var(--text)", fontSize: "0.85rem", fontWeight: 500,
          animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          {toast.type === "success" && (
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
          {toast.type === "loading" && (
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #6366f1", borderTopColor: "transparent", animation: "spin 1s linear infinite", flexShrink: 0 }} />
          )}
          {toast.type === "error" && (
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
          )}
          <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</div>
        </div>
      )}

      <Header 
        roomCode={roomId || "ffaaae"} 
        roomName={roomName} 
        onSettings={() => setShowSettings(true)} 
        onInvite={() => setShowInvite(true)}
        inCall={inCall}
        handleToggleMic={handleToggleMic}
        handleToggleCam={handleToggleCam}
        localMicOn={localMicOn}
        localCamOn={localCamOn}
        setShowCallPanel={setShowCallPanel}
        participantData={participantData}
        handleLeaveCall={handleLeaveCall}
        handleJoinCall={handleJoinCall}
      />

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

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "var(--bg)", position: "relative" }}>
          {isRoomExpired && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 50,
              backgroundColor: "rgba(10, 12, 16, 0.8)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20
            }}>
              <div style={{
                background: "#12151c", border: "1px solid #1e2433",
                borderRadius: 16, padding: "32px", width: "100%", maxWidth: 360,
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.1)", color: "#ef4444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <h2 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>This room has expired</h2>
                <p style={{ margin: "0 0 24px 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>Rooms expire after their set duration. Start a new room to continue with your group.</p>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => setShowCreateRoom(true)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Create New Room
                  </button>
                  <button
                    onClick={() => navigate('/home')}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 10, border: "none",
                      background: "#1a1f2e", color: "#cbd5e1", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#242a3e"}
                    onMouseLeave={(e) => e.target.style.background = "#1a1f2e"}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}

          {inCall && callExpanded && (
            <CallPanel
              isExpanded={true}
              participantData={participantData}
              localCamOn={localCamOn}
              localMicOn={localMicOn}
              handleToggleCam={handleToggleCam}
              handleToggleMic={handleToggleMic}
              setCallExpanded={setCallExpanded}
              setCallMinimized={setCallMinimized}
              callMinimized={callMinimized}
              handleLeaveCall={handleLeaveCall}
            />
          )}

          <TabBar active={tab} setActive={setTab} badge={activityBadge} />
          <div style={{ display: tab === "notes" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.notes}
          </div>
          <div style={{ display: tab === "chat" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.chat}
          </div>
          <div style={{ display: tab === "tasks" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.tasks}
          </div>
          <div style={{ display: tab === "files" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.files}
          </div>
          <div style={{ display: tab === "activity" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.activity}
          </div>
          <div style={{ display: tab === "members" ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            {tabContent.members}
          </div>
        </main>
      </div>

      {focusMode && (
        <FocusModeOverlay
          minutes={minutes} seconds={seconds} isBreak={isBreak} running={running}
          timerLabel={timerLabel}
          onPlay={handlePlay} onReset={reset} onSkip={skip}
          onClose={() => setFocusMode(false)}
          focusMins={focusMins} breakMins={breakMins}
          onModeChange={handleModeChange}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
          onDeleteRoom={handleDeleteRoom}
          initialFocus={focusMins}
          initialBreak={breakMins}
          initialRoomName={roomName}
          members={members}
          roomOwnerId={roomOwnerId}
        />
      )}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} roomName={roomName} roomCode={roomId || "ffaaae"} />}
      {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} onNavigate={navigate} />}

      {inCall && !callExpanded && showCallPanel && (
        <CallPanel
          isExpanded={false}
          participantData={participantData}
          localCamOn={localCamOn}
          localMicOn={localMicOn}
          handleToggleCam={handleToggleCam}
          handleToggleMic={handleToggleMic}
          setCallExpanded={setCallExpanded}
          setCallMinimized={setCallMinimized}
          callMinimized={callMinimized}
          handleLeaveCall={handleLeaveCall}
          dragPosition={callPosition}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
        />
      )}
      </div>
    </ErrorBoundary>
  );
}

function LocalVideo({ stream }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, transform: "scaleX(-1)" }} />;
}

function RemoteVideo({ stream }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />;
}

function CallPanel({
  isExpanded,
  participantData,
  localCamOn,
  localMicOn,
  handleToggleCam,
  handleToggleMic,
  setCallExpanded,
  setCallMinimized,
  callMinimized,
  handleLeaveCall,
  dragPosition,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) {
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #1e2433",
    backgroundColor: "#1a1f2e",
    cursor: isExpanded ? "default" : "move",
    userSelect: "none"
  };

  const containerStyle = isExpanded ? {
    position: "absolute",
    inset: 0,
    zIndex: 40,
    backgroundColor: "#12151c",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  } : {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 50,
    width: 380,
    backgroundColor: "#12151c",
    border: "1px solid #1e2433",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transform: `translate(${dragPosition?.x || 0}px, ${dragPosition?.y || 0}px)`,
    transition: "none"
  };

  return (
    <div 
      style={containerStyle}
      {...(!isExpanded ? {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
      } : {})}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
          {!isExpanded && <span style={{ color: "#475569", marginRight: 2, cursor: "move" }}>:::</span>}
          <span style={{ color: "#818cf8" }}>●</span> Call • {participantData.length} participant{participantData.length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={handleToggleCam} style={{
            background: "none", border: "none", color: localCamOn ? "#a5b4fc" : "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, backgroundColor: localCamOn ? "rgba(99,102,241,0.15)" : "transparent"
          }}>
            <Icon.Camera />
          </button>
          <button onClick={handleToggleMic} style={{
            background: "none", border: "none", color: localMicOn ? "#a5b4fc" : "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, backgroundColor: localMicOn ? "rgba(99,102,241,0.15)" : "transparent"
          }}>
            <Icon.Mic />
          </button>
          
          <button onClick={() => setCallExpanded(!isExpanded)} style={{
            background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6
          }} title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}>
            <span style={{ fontSize: "0.85rem", transform: "rotate(45deg)", display: "inline-block" }}>⤢</span>
          </button>
          
          <button onClick={() => setCallMinimized(!callMinimized)} style={{
            background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6
          }} title={callMinimized ? "Expand" : "Minimize"}>
            {callMinimized ? "▲" : "▼"}
          </button>

          <button onClick={handleLeaveCall} style={{
            background: "#ef4444", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, fontWeight: 700
          }}>
            ✕
          </button>
        </div>
      </div>

      {/* Grid of participants */}
      {!callMinimized && (
        <div style={{
          display: "grid",
          gridTemplateColumns: participantData.length > 1 ? "1fr 1fr" : "1fr",
          gap: 12,
          padding: 16,
          backgroundColor: "#12151c",
          flex: isExpanded ? 1 : "initial",
          overflowY: "auto"
        }}>
          {participantData.map(p => (
            <div key={p.isMe ? "local" : p.socketId} style={{
              aspectRatio: isExpanded ? "16/10" : "4/3",
              maxHeight: isExpanded ? "calc(100vh - 200px)" : "initial",
              position: "relative",
              borderRadius: 10,
              backgroundColor: "#1a1f2e",
              border: "1px solid #1e2433",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {p.camOn && p.stream ? (
                p.isMe ? <LocalVideo stream={p.stream} /> : <RemoteVideo stream={p.stream} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: isExpanded ? 72 : 54, height: isExpanded ? 72 : 54, borderRadius: "50%",
                    backgroundColor: "rgba(108,99,255,0.08)", color: "#818cf8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isExpanded ? "1.6rem" : "1.2rem", fontWeight: 700,
                    border: "1px solid rgba(108,99,255,0.15)"
                  }}>
                    {(p.userName || "U").substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ 
                    fontSize: isExpanded ? "0.8rem" : "0.75rem", 
                    color: "#64748b", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6 
                  }}>
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5l4.553-2.276A1 1 0 0121 9.118v5.764a1 1 0 01-1.447.894L15 13.5M3 9a2 2 0 012-2h5.5M3 9v6a2 2 0 002 2h8a2 2 0 002-2v-.5M1 1l22 22" />
                    </svg>
                    Camera off
                  </span>
                </div>
              )}

              <div style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 12px",
                borderRadius: 6,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(2px)",
                zIndex: 10
              }}>
                <span style={{ fontSize: isExpanded ? "0.8rem" : "0.7rem", color: "#f1f5f9", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isExpanded ? 240 : 120 }}>
                  {p.userName} {p.isMe && "(you)"}
                </span>
                <span style={{ fontSize: isExpanded ? "0.8rem" : "0.7rem", display: "flex", alignItems: "center", color: p.micOn ? "#22c55e" : "#ef4444" }}>
                  {p.micOn ? (
                    <Icon.Mic />
                  ) : (
                    <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9a3 3 0 0 0 3 3m1.2-1.2A3 3 0 0 0 15 9V5a3 3 0 0 0-6 0v.8m10.2 11.2a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4m-4-8v-3m10 6L1 1" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}