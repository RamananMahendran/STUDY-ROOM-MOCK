import re

with open('src/pages/Room.jsx', 'r') as f:
    old_code = f.read()

# We will extract the SVG definitions and Tabs from old_code
# and inject them into our new template.

new_code = """import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const IcoArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IcoPlay      = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>;
const IcoPause     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IcoReset     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>;
const IcoSkip      = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"/></svg>;
const IcoCopy      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const IcoMembers   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoSettings  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/></svg>;
const IcoPhone     = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>;
const IcoMaximize  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>;
const IcoSend      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const IcoNoteIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>;
const IcoChatIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>;
const IcoTaskIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/></svg>;
const IcoFileIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/></svg>;
const IcoActIcon   = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>;
const IcoTaskEmpty = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IcoChatEmpty = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoEdit      = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/></svg>;
const IcoSplit     = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"/></svg>;
const IcoEye       = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>;
const IcoMoon      = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#888899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/></svg>;

// ── Tabs config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "notes",    label: "Notes",    Icon: IcoNoteIcon },
  { id: "chat",     label: "Chat",     Icon: IcoChatIcon },
  { id: "tasks",    label: "Tasks",    Icon: IcoTaskIcon },
  { id: "files",    label: "Files",    Icon: IcoFileIcon },
  { id: "activity", label: "Activity", Icon: IcoActIcon,  badge: 1 },
  { id: "members",  label: "Members",  Icon: IcoMembers  },
];

// ── LEFT PANEL ─────────────────────────────────────────────────────────────────
function LeftPanel({ room }) {
  const FOCUS_S = (room.focusMin || 90) * 60;
  const BREAK_S = (room.breakMin || 15) * 60;

  const [mode,       setMode]       = useState("focus");
  const [timeLeft,   setTimeLeft]   = useState(FOCUS_S);
  const [isRunning,  setIsRunning]  = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef(null);

  const total    = mode === "focus" ? FOCUS_S : BREAK_S;
  const progress = timeLeft / total;
  const mins     = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs     = String(timeLeft % 60).padStart(2, "0");
  const isBreak  = mode === "break";

  const tick = useCallback(() => {
    setTimeLeft(t => {
      if (t <= 1) { setIsRunning(false); clearInterval(intervalRef.current); return 0; }
      return t - 1;
    });
  }, []);

  useEffect(() => {
    if (isRunning) { intervalRef.current = setInterval(tick, 1000); }
    else           { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const handlePlay = () => { if (!hasStarted) setHasStarted(true); setIsRunning(r => !r); };
  const handleReset = () => { setIsRunning(false); setHasStarted(false); setTimeLeft(mode === "focus" ? FOCUS_S : BREAK_S); };
  const handleSkip  = () => {
    setIsRunning(false); setHasStarted(false);
    const next = mode === "focus" ? "break" : "focus";
    setMode(next); setTimeLeft(next === "focus" ? FOCUS_S : BREAK_S);
  };
  const switchMode = (m) => {
    if (m === mode) return;
    setIsRunning(false); setHasStarted(false); setMode(m);
    setTimeLeft(m === "focus" ? FOCUS_S : BREAK_S);
  };

  const statusLabel = !hasStarted ? "Ready" : isRunning ? (isBreak ? "On break" : "Focusing...") : "Paused";

  return (
    <aside className="w-[315px] min-w-[280px] flex flex-col bg-[#18181c] border-r border-[#2a2a32] overflow-y-auto z-10 relative">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2a32]">
        <div className="w-7 h-7 rounded-md bg-[#6c5ce7] flex items-center justify-center text-white font-bold text-sm select-none">S</div>
        <span className="font-semibold text-[#e0e0e8] tracking-tight">{room.name}</span>
        <span className="ml-1 text-xs text-[#888899] bg-[#2a2a36] rounded px-2 py-0.5">Host</span>
      </div>

      {/* First Focus Block card */}
      {!hasStarted && (
        <div className="mx-3 mt-4 rounded-xl bg-gradient-to-br from-[#2d2660] to-[#1e1c3a] border border-[#3d3670] p-4">
          <p className="text-xs font-semibold text-[#a09de0] uppercase tracking-widest mb-1">First Focus Block</p>
          <p className="text-sm text-[#c8c4f4] leading-snug mb-3">The first one is the hardest. Press play — {room.focusMin || 90} minutes.</p>
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 bg-[#6c5ce7] hover:bg-[#7d6ff0] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Start focus
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>
      )}

      {/* Focus / Break toggle */}
      <div className="mx-3 mt-4 flex rounded-xl bg-[#1a1a22] border border-[#2a2a36] p-1">
        {["focus", "break"].map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-[#2a2a36] text-[#e0e0e8]' : 'bg-transparent text-[#888899]'}`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="flex justify-center mt-6">
        <div 
          className="relative flex flex-col items-center justify-center rounded-full"
          style={{ 
            width: 180, height: 180, 
            border: "2px solid #2a2a32",
            background: "radial-gradient(circle at 30% 30%, #22222a, #16161c)",
            boxShadow: "0 0 40px rgba(108,92,231,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          {/* Animated SVG Ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="90" cy="90" r="88"
              fill="none"
              stroke={isBreak ? "#10b981" : "#6c5ce7"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
              style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
            />
          </svg>
          
          <span 
            className="text-4xl font-bold tracking-tight text-white z-10" 
            style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "-1px" }}
          >
            {mins}<span className="text-[#888899]">:</span>{secs}
          </span>
          <span className="mt-1 text-xs text-[#888899] bg-[#1e1e26] px-3 py-0.5 rounded-full border border-[#2a2a36] z-10">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={handleReset} className="w-[42px] h-[42px] rounded-full bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f] transition-colors">
          <IcoReset />
        </button>
        <button 
          onClick={handlePlay} 
          className="w-[58px] h-[58px] rounded-full bg-[#6c5ce7] hover:bg-[#7d6ff0] hover:scale-105 flex items-center justify-center cursor-pointer transition-all"
          style={{ boxShadow: "0 4px 20px rgba(108,92,231,0.4)" }}
        >
          {isRunning ? <IcoPause /> : <IcoPlay />}
        </button>
        <button onClick={handleSkip} className="w-[42px] h-[42px] rounded-full bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f] transition-colors">
          <IcoSkip />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mx-3 mt-6">
        {[
          { top: `${room.focusMin || 90}m`, bot: "Focus" },
          { top: `${room.breakMin || 15}m`, bot: "Break" },
          { top: "Live",                    bot: "Sync"  },
        ].map(({ top, bot }) => (
          <div key={bot} className="flex-1 bg-[#1e1e26] border border-[#2a2a36] rounded-[10px] p-[10px] pb-3.5 flex flex-col items-center">
            <span className="text-base font-bold text-[#e0e0e8]">{top}</span>
            <span className="text-[11px] text-[#888899] mt-0.5">{bot}</span>
          </div>
        ))}
      </div>

      {/* Focus Mode */}
      <div className="mx-3 mt-3 mb-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e1e26] border border-[#2a2a36] text-sm text-[#888899] hover:text-[#e0e0e8] hover:border-[#3a3a48] transition-colors">
          <IcoMaximize />
          Focus Mode
        </button>
      </div>
    </aside>
  );
}
"""

# Extract tabs logic from old_code
chat_tab_match = re.search(r'// ── TAB: Chat ─────────────────────────────────────────────────────────────────(.*?)// ── ROOM PAGE', old_code, re.DOTALL)
if chat_tab_match:
    tabs_code = chat_tab_match.group(1)
    
    # Modify tabs_code slightly to fit the new colors where obvious
    tabs_code = tabs_code.replace('bg-[#0d1117]', 'bg-[#111114]')
    tabs_code = tabs_code.replace('bg-[#161b26]', 'bg-[#18181c]')
    tabs_code = tabs_code.replace('border-[#1a2035]', 'border-[#2a2a32]')
    tabs_code = tabs_code.replace('color: "#fff"', 'color: "#e0e0e8"')
    tabs_code = tabs_code.replace('color: "#64748b"', 'color: "#888899"')
else:
    tabs_code = ""

notes_tab_code = """
// ── TAB: Notes ─────────────────────────────────────────────────────────────────
function NotesTab() {
  return (
    <div className="flex flex-col h-full bg-[#111114]">
      <div className="flex-1 overflow-y-auto px-6 pt-4">
        {/* Shared Notes header */}
        <div className="flex items-center gap-2 mb-4">
          <IcoNoteIcon />
          <span className="text-sm text-[#888899] font-medium">Shared Notes</span>
          <span className="text-xs text-[#888899] bg-[#1e1e26] border border-[#2a2a36] px-2 py-0.5 rounded">Select text to format</span>
        </div>
        {/* Editable area */}
        <div
          contentEditable="true"
          className="min-h-[300px] text-[#888899] text-sm outline-none leading-relaxed caret-[#6c5ce7] focus:text-[#e0e0e8] transition-colors font-mono"
          suppressContentEditableWarning={true}
        >
          # Session notes

Select any text to format it — headings, bold, code and more.

— Key formulas
— Doubts to revisit
— Links to resources
        </div>
      </div>
      
      {/* Bottom toolbar for notes */}
      <div className="px-6 py-2 border-t border-[#2a2a32] flex items-center justify-end gap-1">
        <button className="w-7 h-7 rounded-md bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f]" title="Edit">
          <IcoEdit />
        </button>
        <button className="w-7 h-7 rounded-md bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f]" title="Split">
          <IcoSplit />
        </button>
        <button className="w-7 h-7 rounded-md bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f]" title="Preview">
          <IcoEye />
        </button>
        <span className="text-xs text-[#888899] ml-2">1 chars</span>
      </div>
    </div>
  );
}
"""

main_code = """
const TAB_CONTENT = { notes: NotesTab, chat: ChatTab, tasks: TasksTab, files: FilesTab, activity: ActivityTab, members: MembersTab };

// ── ROOM PAGE ─────────────────────────────────────────────────────────────────
export default function Room() {
  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("notes");

  const room = JSON.parse(sessionStorage.getItem("currentRoom") || "null") || {
    id: roomId || "ffaaae", name: "try", icon: "📚",
    color: "#6c5ce7", goal: "", focusMin: 90, breakMin: 15,
  };

  const ActiveContent = TAB_CONTENT[activeTab] || NotesTab;

  return (
    <div className="h-screen flex overflow-hidden font-sans" style={{ backgroundColor: "#111114", color: "#e0e0e8", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ===== SIDEBAR ===== */}
      <LeftPanel room={room} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col bg-[#111114] overflow-hidden relative">
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-[11px] border-b border-[#2a2a32] z-10 relative bg-[#111114]">
          {/* Tabs */}
          <nav className="flex items-center gap-1">
            {TABS.map(({ id, label, Icon, badge }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex items-center gap-1.5 px-3 py-[9px] text-sm font-medium transition-colors ${isActive ? 'text-[#e0e0e8]' : 'text-[#888899] hover:text-[#e0e0e8]'}`}
                >
                  <Icon />
                  {label}
                  {badge && (
                    <span className="absolute top-1 right-0 w-4 h-4 rounded-full bg-[#6c5ce7] text-white text-[10px] flex items-center justify-center font-bold">{badge}</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-[-11px] left-0 right-0 h-[2px] bg-[#6c5ce7]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Room ID pill */}
            <span className="text-xs text-[#888899] bg-[#1e1e26] border border-[#2a2a36] px-3 py-1.5 rounded-lg font-mono tracking-wide">
              {room.id}
            </span>
            {/* Icon btns */}
            <button className="w-8 h-8 rounded-full bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f]">
              <IcoSettings />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#2a2a36] border border-[#33333f] flex items-center justify-center cursor-pointer hover:bg-[#33333f]">
              <IcoMoon />
            </button>
            {/* Call button */}
            <button className="flex items-center gap-1.5 bg-[#1e1e26] border border-[#2a2a36] hover:border-[#3a3a48] text-[#e0e0e8] text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
              <IcoPhone />
              Call
            </button>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center text-white text-xs font-bold select-none ml-1">
              M
            </div>
          </div>
        </div>

        {/* Tab content */}
        <ActiveContent />
      </main>
    </div>
  );
}
"""

with open('src/pages/Room.jsx', 'w') as f:
    f.write(new_code + notes_tab_code + tabs_code + main_code)

print("Done")
