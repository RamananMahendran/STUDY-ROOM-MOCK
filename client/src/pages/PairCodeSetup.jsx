import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
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
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      
      {/* LEFT SIDEBAR NAVIGATION COMPONENT INJECTION */}
      <Sidebar active="practice" />

      {/* CENTER STAGE VIEWPORT CANVAS WRAPPER */}
      <div className="flex-1 flex items-center justify-center bg-[#060810] px-6">
        
        
        <div className="w-full max-w-[840px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* LEFT OPTION CARD: START NEW ROOM INSTANCE */}
          <div className="bg-[#0d1117] border border-[#1e2433]/60 rounded-xl p-6 flex flex-col gap-6 transition-all duration-200 hover:border-[#1e2433]" >
                <div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                    <IcoPlus />
                    </div>
                    <h2 className="text-base font-bold text-[#f1f5f9] mb-2 tracking-tight">
                    Start a new session
                    </h2>
                    <p className="text-[12px] text-gray-500 leading-relaxed max-w-[310px]">
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
          <div className="bg-[#0d1117] border border-[#1e2433]/60 rounded-xl p-8 flex flex-col justify-between transition-all duration-200 hover:border-[#1e2433]">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <IcoUsers />
              </div>
              <h2 className="text-base font-bold text-[#f1f5f9] mb-2 tracking-tight">
                Join with a code
              </h2>
              <p className="text-[12px] text-gray-500 leading-relaxed max-w-[310px]">
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
                className="w-full bg-[#060810]/60 border border-[#1e2433] rounded-lg py-2.5 text-center font-mono text-sm tracking-[0.5em] text-[#fbbf24] font-bold outline-none placeholder-gray-700/60 focus:border-[#312e81] focus:bg-[#060810] transition-all"
              />
              
              <button
                type="submit"
                disabled={sessionCode.length !== 6}
                className="w-full px-5 py-2.5 rounded-lg bg-[#161b26] border border-[#1e2433] text-gray-400 disabled:text-gray-600 font-bold text-[12px] flex items-center justify-center gap-2 transition-all duration-150 disabled:bg-[#11151e]/40 disabled:border-[#1e2433]/40 cursor-pointer disabled:cursor-not-allowed enabled:hover:bg-[#1f2638] enabled:hover:text-gray-200"
              >
                <span>Join session</span>
                <IcoArrowRight />
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}