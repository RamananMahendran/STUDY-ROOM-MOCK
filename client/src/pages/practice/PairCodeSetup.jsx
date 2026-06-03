import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";

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

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function PairCodeSetup() {
  const [sessionCode, setSessionCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleCreateSession = async () => {
    console.log('🔴 Create session clicked');
    setIsCreating(true);
    setError(null);
    
    try {
      console.log('📤 Fetching /api/pair/create...');
      const response = await fetch('http://localhost:5001/api/pair/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'python' }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('❌ Failed to create session', err);
        setError(err.error || 'Failed to create session');
        setIsCreating(false);
        return;
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      
      const roomCode = result?.data?.roomCode;
      if (roomCode) {
        console.log(`🎯 Created new session with room code: ${roomCode}`);
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate(`/practice/pair/${roomCode}`);
        }, 100);
      } else {
        console.error('❌ Create session: no roomCode received', result);
        setError('No room code received from server');
        setIsCreating(false);
      }
    } catch (err) {
      console.error('❌ Error creating session:', err);
      setError(err.message || 'Network error - check if backend is running');
      setIsCreating(false);
    }
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (sessionCode.length === 6) {
      console.log(`Joining session with code: ${sessionCode}`);
      navigate(`/practice/pair/${sessionCode}`);
    }
  };

  return (
    <div className="fixed inset-0 flex font-sans overflow-hidden select-none" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* LEFT SIDEBAR NAVIGATION COMPONENT INJECTION */}
      <Sidebar active="pair-code" />

      {/* CENTER STAGE VIEWPORT CANVAS WRAPPER */}
      <div className="flex-1 flex items-center justify-center px-6">
        
        <div className="w-full max-w-[840px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* LEFT OPTION CARD: START NEW ROOM INSTANCE */}
          <div className="rounded-xl border p-6 flex flex-col gap-6 transition-all duration-200" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <IcoPlus />
              </div>
              <h2 className="text-base font-bold mb-2 tracking-tight" style={{ color: 'var(--text)' }}>
                Start a new session
              </h2>
              <p className="text-[12px] leading-relaxed max-w-[310px]" style={{ color: 'var(--text-muted)' }}>
                Get a fresh 6-character code. Share the link with one person and start writing code together.
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-xs p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleCreateSession}
              disabled={isCreating}
              className="h-10 w-full mt-8 px-6 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[12px] font-bold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <LoadingSpinner />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create session</span>
                  <IcoPlus />
                </>
              )}
            </button>
          </div>

          {/* RIGHT OPTION CARD: JOIN EXISTING CONSOLE CODE */}
          <div className="rounded-xl border p-8 flex flex-col justify-between transition-all duration-200" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <IcoUsers />
              </div>
              <h2 className="text-base font-bold mb-2 tracking-tight" style={{ color: 'var(--text)' }}>
                Join with a code
              </h2>
              <p className="text-[12px] leading-relaxed max-w-[310px]" style={{ color: 'var(--text-muted)' }}>
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
                className="w-full rounded-lg py-2.5 text-center font-mono text-sm tracking-[0.5em] text-[#fbbf24] font-bold outline-none transition-all input-glass"
                autoComplete="off"
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