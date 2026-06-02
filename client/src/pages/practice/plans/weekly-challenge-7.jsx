import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import TopBar from "../../components/TopBar.jsx";

const IcoTrophy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

const IcoArrowLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IcoArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IcoLock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IcoSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 c0 3.5 -2.5 6 -6 6 c3.5 0 6 2.5 6 6 c0 -3.5 2.5 -6 6 -6 c-3.5 0 -6 -2.5 -6 -6 z" />
    <path d="M19 3v4M17 5h4" />
    <circle cx="5" cy="19" r="1" />
  </svg>
);

const IcoCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const IcoBookOpen = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const WEEKLY_DAYS = [
  { dayNumber: 1, title: "Monday — Array medium", progress: "0 / 1", problems: [{ name: "Maximum Subarray", difficulty: "Medium" }] },
  { dayNumber: 2, title: "Tuesday — String medium", progress: "0 / 1", problems: [{ name: "Valid Parentheses", difficulty: "Medium" }] },
  { dayNumber: 3, title: "Wednesday — DP medium", progress: "0 / 1", problems: [{ name: "Climbing Stairs", difficulty: "Medium" }] },
  { dayNumber: 4, title: "Thursday — Tree medium", progress: "0 / 1", problems: [{ name: "Symmetric Tree", difficulty: "Easy" }] },
  { dayNumber: 5, title: "Friday — Graph", progress: "0 / 1", problems: [{ name: "Find if Path Exists in Graph", difficulty: "Easy" }] },
  { dayNumber: 6, title: "Saturday — Hard pick", progress: "0 / 1", problems: [{ name: "Product of Array Except Self", difficulty: "Hard" }] },
  { dayNumber: 7, title: "Sunday — Interview wildcard", progress: "0 / 1", problems: [{ name: "Generate Parentheses", difficulty: "Medium" }] },
];

const getDiffColor = (diff) => {
  if (diff === "Easy") return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  if (diff === "Medium") return "text-amber-400 border-amber-500/20 bg-amber-500/10";
  if (diff === "Hard") return "text-rose-400 border-rose-500/20 bg-rose-500/10";
  return "text-gray-400 border-gray-500/20 bg-gray-500/10";
};

export default function WeeklyChallenge7() {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto w-full px-6 py-8">
      <div className="max-w-[880px] mx-auto flex flex-col gap-6">
        <div>
          <button onClick={() => navigate('/practice/study-plans')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shadow-sm">
            <IcoArrowLeft />
            <span>All plans</span>
          </button>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden shadow-[var(--card-shadow)]">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IcoTrophy />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)] mb-1">Weekly Challenge</h1>
              <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
                Pro · 7 days · 1 problem/day
                <span className="bg-indigo-500/20 text-indigo-500 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-indigo-500/30">PRO</span>
              </p>
              <p className="text-[13px] text-[var(--text-subtle)] leading-relaxed max-w-xl mb-5">
                One carefully chosen problem per day for 7 days — a mix of difficulties and topics. Designed to fit around a day job. Perfect when you only have 20 minutes a day.
              </p>
              <div className="flex flex-wrap items-center gap-5 text-[12px] font-semibold text-[var(--text-subtle)]">
                <div className="flex items-center gap-1.5">
                  <IcoCalendar />
                  <span>7 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IcoBookOpen />
                  <span>7 problems</span>
                </div>
              </div>
            </div>
          </div>

          {isEnrolled ? (
            <div className="w-24 h-24 rounded-full border-[6px] border-[var(--border)] bg-[var(--surface-2)] flex flex-col items-center justify-center flex-shrink-0 relative mr-4">
              <span className="text-xl font-black text-[var(--text)]">0<span className="text-[14px]">%</span></span>
              <span className="text-[10px] font-bold text-[var(--text-muted)] mt-[-2px]">0/7</span>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[13px] font-bold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <span>Unlock with Pro</span>
            </button>
          )}
        </div>

        {isEnrolled && (
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0">
              <IcoRefresh />
              <span>Reset schedule</span>
            </button>
            <button 
              onClick={() => setIsEnrolled(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-rose-500/30 hover:border-rose-500/50 text-rose-500 text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <span>Unenroll</span>
            </button>
          </div>
        )}

        {!isEnrolled && (
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-2">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-indigo-500"><IcoStars /></div>
              <div>
                <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">This plan is Pro only</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed max-w-lg">
                  You can still browse the schedule below. Problems open normally — but enrollment + progress tracking require Pro.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/pricing')} className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold transition-colors flex-shrink-0 whitespace-nowrap shadow-lg shadow-indigo-600/20">
              Upgrade
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-2">
          {WEEKLY_DAYS.map((day) => {
            return (
              <div key={day.dayNumber} className={`bg-[var(--surface)] border rounded-xl overflow-hidden shadow-[var(--card-shadow)] ${isEnrolled && day.dayNumber === 1 ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-[var(--border)]'}`}>
                
                <div className={`px-5 py-4 border-b flex items-center justify-between ${isEnrolled && day.dayNumber === 1 ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-[var(--surface-2)]/30 border-[var(--border)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black font-mono ${isEnrolled && day.dayNumber === 1 ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30' : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]'}`}>
                      {day.dayNumber}
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-wider uppercase font-mono mb-0.5 flex items-center gap-1.5">
                        <span className={isEnrolled && day.dayNumber === 1 ? 'text-indigo-500' : 'text-[var(--text-muted)]'}>DAY {day.dayNumber}</span>
                        {isEnrolled && day.dayNumber === 1 && (
                          <>
                            <span className="text-[var(--text-subtle)]">·</span>
                            <span className="text-indigo-500">TODAY</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-[13px] font-bold tracking-tight text-[var(--text)]">
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold font-mono text-[var(--text-muted)]">
                    {day.progress}
                  </span>
                </div>

                <div className="flex flex-col">
                  {day.problems.map((problem, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate(`/practice/problems/${problem.name.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-none hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] group-hover:border-indigo-500/50 flex-shrink-0 transition-colors" />
                        <span className="text-[12.5px] font-semibold text-[var(--text)] group-hover:text-indigo-500 transition-colors">
                          {problem.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded uppercase font-sans border ${getDiffColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-[var(--text-subtle)] group-hover:text-indigo-500 transition-colors pl-1">
                          <IcoArrowRight />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
