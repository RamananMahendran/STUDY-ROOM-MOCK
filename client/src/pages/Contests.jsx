import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

const IcoLock = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IcoZap = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IcoPeople = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoCalendar = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IcoTrophy = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ContestTimer({ targetDate, label = 'Starts in', onExpire }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Ended');
        if (onExpire) onExpire();
        return;
      }
      const secs = Math.floor(diff / 1000);
      const mins = Math.floor(secs / 60);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);

      if (days > 0) {
        setTimeLeft(`${days}d ${hrs % 24}h`);
      } else if (hrs > 0) {
        setTimeLeft(`${hrs}h ${mins % 60}m`);
      } else {
        setTimeLeft(`${mins}m ${secs % 60}s`);
      }
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (!timeLeft) return null;

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono">
      <span>{label}:</span> {timeLeft}
    </span>
  );
}

export default function Contests() {
  const navigate = useNavigate();
  const [contests, setContests] = useState({ active: [], upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);

  const fetchContests = async () => {
    try {
      const res = await fetch(`${API}/api/contests`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setContests(data.data);
      }
    } catch (err) {
      console.error('Failed to load contests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleRegister = async (contestId) => {
    setRegistering(contestId);
    try {
      const res = await fetch(`${API}/api/contests/${contestId}/register`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh contests to show updated registration state
        fetchContests();
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setRegistering(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span className="text-sm text-gray-400">Loading contests arena...</span>
        </div>
      </div>
    );
  }

  const { active, upcoming, past } = contests;

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 md:py-16 bg-[var(--bg)] text-[var(--text)] font-sans h-full">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Active / Ongoing Contests */}
        {active.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-emerald-400 tracking-widest uppercase ml-1 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Now
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {active.map((contest) => (
                <div key={contest.id} className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#0e241c] to-[#0c1319] shadow-2xl shadow-emerald-900/10">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4 max-w-xl">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          Ongoing
                        </span>
                        <ContestTimer targetDate={contest.endTime} label="Ends in" onExpire={fetchContests} />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        {contest.title}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {contest.description}
                      </p>
                      <div className="flex items-center gap-6 pt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <IcoPeople /> {contest.participantCount} registered
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <IcoCalendar /> {formatTime(contest.startTime)} - {formatTime(contest.endTime)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/contests/${contest.id}`)}
                      className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <IcoZap s={14} /> Enter Arena
                    </button>
                  </div>
                  {/* Background overlay details */}
                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Static Hero for when there is no active contest */
          <div className="relative rounded-3xl p-10 md:p-16 overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[#1b1c2b] to-[#0c0d14] shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold tracking-widest uppercase">
                <IcoLock /> Competitive Contests
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Competitive<br />Coding Contests
              </h1>
              
              <p className="text-[#a4a5b8] text-base md:text-lg max-w-xl leading-relaxed">
                Live ICPC-style contests with real-time leaderboards, hosted inside your study environment. Practice together, compete together.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-4">
                {[
                  { text: "ICPC scoring", classes: "text-indigo-300 bg-indigo-500/20 border-indigo-400/30" },
                  { text: "Live standings", classes: "text-emerald-400 bg-emerald-500/20 border-emerald-400/30" },
                  { text: "Solve streak integration", classes: "text-pink-400 bg-pink-500/20 border-pink-400/30" },
                  { text: "Post-contest Editorials", classes: "text-amber-400 bg-amber-500/20 border-amber-400/30" },
                ].map((pill) => (
                  <span key={pill.text} className={`px-4 py-1.5 rounded-full border ${pill.classes} text-[13px] font-bold tracking-wide`}>
                    {pill.text}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          </div>
        )}

        {/* Upcoming Contests */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-1">UPCOMING CONTESTS</h3>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((contest) => (
                <div key={contest.id} className="flex flex-col justify-between p-6 rounded-2xl bg-[#0a0d14] border border-[var(--border)] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <ContestTimer targetDate={contest.startTime} label="Starts in" onExpire={fetchContests} />
                      {contest.isRegistered && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          ✓ Registered
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-100 mb-1 group-hover:text-indigo-400 transition-colors">
                        {contest.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {contest.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500 pt-2 border-t border-[#1a1e26]/50">
                      <span className="flex items-center gap-1">
                        <IcoPeople s={12} /> {contest.participantCount} attending
                      </span>
                      <span className="flex items-center gap-1">
                        <IcoCalendar s={12} /> {formatTime(contest.startTime)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    {contest.isRegistered ? (
                      <button
                        onClick={() => navigate(`/contests/${contest.id}`)}
                        className="w-full py-2.5 rounded-xl bg-[#111622] hover:bg-[#1a2335] text-indigo-400 border border-indigo-500/20 font-bold text-xs transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        disabled={registering === contest.id}
                        onClick={() => handleRegister(contest.id)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {registering === contest.id ? 'Registering...' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-[var(--border)] bg-[#0a0d14]/30 text-center text-gray-500 text-sm">
              No upcoming contests scheduled. Check back soon!
            </div>
          )}
        </div>

        {/* Past Contests */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-1">PAST BATTLES</h3>
          {past.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map((contest) => (
                <div key={contest.id} className="flex flex-col justify-between p-6 rounded-2xl bg-[#0a0d14] border border-[var(--border)] hover:border-gray-700 transition-colors">
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-gray-500/10 border border-gray-500/20 text-gray-400 text-[9px] font-bold uppercase tracking-wider">
                      Completed
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-gray-200 mb-1">{contest.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{contest.description}</p>
                    </div>
                    <div className="flex gap-4 text-[11px] text-gray-500 pt-1">
                      <span className="flex items-center gap-1"><IcoPeople s={12} /> {contest.participantCount} competed</span>
                      <span className="flex items-center gap-1"><IcoCalendar s={12} /> Ended {formatTime(contest.endTime)}</span>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/contests/${contest.id}`)}
                      className="flex-1 py-2.5 rounded-xl bg-[#111622] hover:bg-[#1b2333] border border-[var(--border)] text-gray-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <IcoTrophy s={12} /> View Leaderboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-[var(--border)] bg-[#0a0d14]/30 text-center text-gray-500 text-sm">
              No completed contests found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
