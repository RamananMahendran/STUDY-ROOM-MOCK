import React, { useState } from "react";
import { Link } from "react-router-dom";
// ── CUSTOM REUSABLE SVG ICONS ────────────────────────────────────────────────
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
  </svg>
);

const IcoUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default function PairCodeSetup() {
  const [sessionCode, setSessionCode] = useState("");

  const handleCreateSession = () => {
    // Generate a fresh 6-character room code framework configuration loop
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`Staging pristine room session token: ${randomCode}`);
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (sessionCode.length === 6) {
      console.log(`Connecting room cluster sequence targeting node: ${sessionCode}`);
    }
  };

  return (
    <>
      {/* CENTER STAGE VIEWPORT CANVAS WRAPPER */}
      <div className="flex-1 flex items-center justify-center px-6 h-full w-full py-12" style={{ backgroundColor: "var(--bg)" }}>
        
        
        <div className="w-full max-w-[840px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* LEFT OPTION CARD: START NEW ROOM INSTANCE */}
          <div className="rounded-xl p-6 flex flex-col gap-6 transition-all duration-200" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                    <IcoPlus />
                    </div>
                    <h2 className="text-base font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                    Start a new session
                    </h2>
                    <p className="text-[12px] leading-relaxed max-w-[310px]" style={{ color: "var(--text-muted)" }}>
                    Get a fresh 6-character code. Share the link with one person and start writing code together.
                    </p>
                </div>

                <button
                    onClick={handleCreateSession}
                    className="h-10 w-full mt-8 px-6 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-bold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <span>Create session</span>
                    <IcoPlus />
                </button>
          </div>


          {/* RIGHT OPTION CARD: JOIN EXISTING CONSOLE CODE */}
          <div className="rounded-xl p-8 flex flex-col justify-between transition-all duration-200" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <IcoUsers />
              </div>
              <h2 className="text-base font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                Join with a code
              </h2>
              <p className="text-[12px] leading-relaxed max-w-[310px]" style={{ color: "var(--text-muted)" }}>
                Got a code from a friend? Type it in to drop straight into their active coding session.
              </p>
            </div>

            {/* INTERACTIVE COMPONENT TEXT ENTRY PIN FIELDS BLOCK */}
            <form onSubmit={handleJoinSession} className="mt-8 flex flex-col gap-3">
              <input
                type="text"
                maxLength={6}
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="A B C 1 2 3"
                className="w-full rounded-lg py-2.5 text-center font-mono text-sm tracking-[0.5em] text-[#fbbf24] font-bold outline-none transition-all"
                style={{
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
              
              <button
                type="submit"
                disabled={sessionCode.length !== 6}
                className="w-full px-5 py-2.5 rounded-lg font-bold text-[12px] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: sessionCode.length === 6 ? "var(--surface-2)" : "rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                  color: sessionCode.length === 6 ? "var(--text)" : "var(--text-muted)",
                }}
              >
                <span>Join session</span>
                <IcoArrowRight />
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}