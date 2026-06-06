import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

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

const IcoArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const IcoTrophy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

const IcoTerminal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const IcoCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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

function ContestTimer({ targetDate, label = 'Time Left', onExpire }) {
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
        setTimeLeft(`${days}d ${hrs % 24}h ${mins % 60}m`);
      } else if (hrs > 0) {
        setTimeLeft(`${hrs}h ${mins % 60}m ${secs % 60}s`);
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
    <div className="flex flex-col items-center md:items-end font-mono">
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
      <span className="text-xl md:text-2xl font-black text-indigo-400 mt-1">{timeLeft}</span>
    </div>
  );
}

export default function ContestArena() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('problems');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const socketRef = useRef(null);

  const fetchContestData = async () => {
    try {
      // Fetch details
      const resDetails = await fetch(`${API}/api/contests/${id}`, { headers: authHeaders() });
      const dataDetails = await resDetails.json();
      if (dataDetails.success) {
        setContest(dataDetails.data);

        // Fetch problems if not upcoming and user is registered
        if (dataDetails.data.status !== 'upcoming' && (dataDetails.data.isRegistered || dataDetails.data.status === 'past')) {
          const resProbs = await fetch(`${API}/api/contests/${id}/problems`, { headers: authHeaders() });
          const dataProbs = await resProbs.json();
          if (dataProbs.success) {
            setProblems(dataProbs.data);
          }
        }

        // Fetch leaderboard if not upcoming
        if (dataDetails.data.status !== 'upcoming') {
          const resLeader = await fetch(`${API}/api/contests/${id}/leaderboard`, { headers: authHeaders() });
          const dataLeader = await resLeader.json();
          if (dataLeader.success) {
            setLeaderboard(dataLeader.data);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch contest arena data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestData();

    // Setup Websocket connection
    const token = getToken();
    if (token) {
      const socket = io(API, {
        transports: ['websocket', 'polling'],
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('🔌 Connected to Socket.io for Contest Arena');
        socket.emit('contest:join', id);
      });

      socket.on('contest:submission', (data) => {
        console.log('📡 Contest submission received! Refreshing data...', data);
        // Refresh problems and leaderboard
        fetchContestData();
      });

      return () => {
        if (socket) {
          socket.emit('contest:leave', id);
          socket.disconnect();
        }
      };
    }
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const res = await fetch(`${API}/api/contests/${id}/register`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        fetchContestData();
      }
    } catch (err) {
      console.error('Failed to register:', err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span className="text-sm text-gray-400">Loading arena data...</span>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text)]">
        <span className="text-3xl">⚠️</span>
        <span className="text-sm text-gray-400">Contest not found.</span>
        <button onClick={() => navigate('/contests')} className="px-4 py-2 rounded-xl bg-[#111622] border border-[var(--border)] text-xs text-gray-300 font-bold">
          Back to Contests
        </button>
      </div>
    );
  }

  const isUpcoming = contest.status === 'upcoming';
  const isActive = contest.status === 'active';
  const isPast = contest.status === 'past';
  const isRegistered = contest.isRegistered;

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-24 md:py-12 bg-[var(--bg)] text-[var(--text)] font-sans h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <button
          onClick={() => navigate('/contests')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors"
        >
          <IcoArrowLeft /> Back to Contests
        </button>

        {/* Contest Info Dashboard */}
        <div className="p-8 rounded-3xl border border-[var(--border)] bg-[#0a0d14] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              {isUpcoming && <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-wider">Upcoming</span>}
              {isActive && <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider animate-pulse">Live</span>}
              {isPast && <span className="px-2.5 py-0.5 rounded-lg bg-gray-500/10 border border-gray-500/20 text-gray-400 text-[9px] font-black uppercase tracking-wider">Ended</span>}
              <span className="text-xs text-gray-500 font-medium">
                {formatTime(contest.startTime)} - {formatTime(contest.endTime)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{contest.title}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">{contest.description}</p>
          </div>
          
          <div className="flex-shrink-0">
            {isUpcoming && (
              <div className="flex flex-col items-center md:items-end gap-3">
                <ContestTimer targetDate={contest.startTime} label="Starts in" onExpire={fetchContestData} />
                {isRegistered ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    ✓ Registered
                  </span>
                ) : (
                  <button
                    disabled={registering}
                    onClick={handleRegister}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {registering ? 'Registering...' : 'Register to Compete'}
                  </button>
                )}
              </div>
            )}

            {isActive && (
              <div className="flex flex-col items-center md:items-end gap-3">
                <ContestTimer targetDate={contest.endTime} label="Time Remaining" onExpire={fetchContestData} />
                {!isRegistered && (
                  <button
                    disabled={registering}
                    onClick={handleRegister}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/10 hover:scale-[1.02]"
                  >
                    Join Live Arena
                  </button>
                )}
              </div>
            )}

            {isPast && (
              <div className="flex flex-col items-center md:items-end">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Contest Status</span>
                <span className="text-lg font-black text-gray-400 mt-1">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        {!isUpcoming && (
          <div className="flex border-b border-[var(--border)] gap-6">
            <button
              onClick={() => setActiveTab('problems')}
              className={`pb-4 text-sm font-black transition-all relative cursor-pointer ${activeTab === 'problems' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Problems
              {activeTab === 'problems' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`pb-4 text-sm font-black transition-all relative cursor-pointer ${activeTab === 'standings' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Live Standings
              {activeTab === 'standings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></span>}
            </button>
          </div>
        )}

        {/* Tab Contents */}
        {isUpcoming && (
          <div className="p-12 rounded-3xl border border-[var(--border)] bg-[#0a0d14]/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
              🔒
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-200">Arena is locked</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Problems and live standings will be unlocked when the contest starts. Make sure you register to gain instant access.
              </p>
            </div>
          </div>
        )}

        {!isUpcoming && activeTab === 'problems' && (
          <div className="space-y-4">
            {(!isRegistered && isActive) ? (
              <div className="p-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 text-center space-y-3">
                <h4 className="text-sm font-bold text-emerald-400">Attending this contest?</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  Register now to view problems and start coding in the arena. Submissions will count toward your penalty.
                </p>
                <button
                  disabled={registering}
                  onClick={handleRegister}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all cursor-pointer"
                >
                  Register Instantly
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {problems.map((prob, idx) => {
                  const probChar = String.fromCharCode(65 + idx); // A, B, C...
                  return (
                    <div
                      key={prob.id}
                      onClick={() => navigate(`/contests/${id}/problem/${prob.id}`)}
                      className="flex items-center justify-between p-5 rounded-2xl bg-[#0a0d14] border border-[var(--border)] hover:border-indigo-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Alphabet representation */}
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                          {probChar}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">
                            {prob.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                            {prob.difficulty} · {prob.points} points
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {prob.status === 'solved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                            <IcoCheck /> Solved
                          </span>
                        )}
                        {prob.status === 'attempted' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                            Attempted
                          </span>
                        )}
                        <button className="px-4 py-2 rounded-xl bg-[#111622] hover:bg-[#1a2335] text-xs font-bold text-gray-400 group-hover:text-gray-200 border border-[var(--border)] transition-all flex items-center gap-1.5">
                          <IcoTerminal /> Solve
                        </button>
                      </div>
                    </div>
                  );
                })}
                {problems.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No problems assigned to this contest.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isUpcoming && activeTab === 'standings' && (
          <div className="rounded-3xl border border-[var(--border)] bg-[#0a0d14] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#111622]/40 border-b border-[var(--border)] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-16">Rank</th>
                    <th className="py-4 px-6">Participant</th>
                    <th className="py-4 px-6 text-center w-28">Score</th>
                    <th className="py-4 px-6 text-center w-28">Penalty</th>
                    {problems.map((_, idx) => (
                      <th key={idx} className="py-4 px-4 text-center w-20">
                        {String.fromCharCode(65 + idx)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1e26]/30">
                  {leaderboard.map((row) => (
                    <tr key={row.userId} className="hover:bg-[#111622]/20 transition-colors text-xs">
                      <td className="py-4 px-6 text-center font-bold font-mono text-gray-400">
                        {row.rank}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-200">{row.name}</span>
                      </td>
                      <td className="py-4 px-6 text-center font-black text-indigo-400 font-mono">
                        {row.totalScore}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-400 font-mono">
                        {row.totalPenalty}m
                      </td>
                      {problems.map((prob) => {
                        const probData = row.problems[prob.id];
                        if (!probData) return <td key={prob.id} className="py-4 px-4 text-center text-gray-600">-</td>;
                        
                        const { solved, penalty, attempts } = probData;
                        
                        let cellBg = '';
                        let cellText = 'text-gray-600';
                        if (solved) {
                          cellBg = 'bg-emerald-500/10 border-emerald-500/20';
                          cellText = 'text-emerald-400 font-black';
                        } else if (attempts > 0) {
                          cellBg = 'bg-rose-500/5 border-rose-500/10';
                          cellText = 'text-rose-500';
                        }

                        return (
                          <td key={prob.id} className="py-3 px-2 text-center">
                            <div className={`p-1.5 rounded-lg border flex flex-col items-center justify-center font-mono text-[11px] ${cellBg || 'border-transparent'}`}>
                              <span className={cellText}>
                                {solved ? `+${prob.points}` : attempts > 0 ? `-${attempts}` : '-'}
                              </span>
                              {solved && (
                                <span className="text-[8px] text-gray-500 mt-0.5">
                                  {attempts > 0 ? `${attempts} / ` : ''}{penalty}m
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={4 + problems.length} className="py-8 text-center text-gray-500">
                        No submissions recorded yet for this contest.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
