import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── CUSTOM INLINE SVG ICONS ──────────────────────────────────────────────────
const IcoRocket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
    <path d="M12 2C7.5 2 4 5.5 4 10c0 4.5 3.5 8 8 8s8-3.5 8-8c0-4.5-3.5-8-8-8z" />
    <path d="M12 6v8" />
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

const IcoPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6 3 20 12 6 21 6 3" />
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

const IcoRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 1 0 2.13-5.85L21 8" />
  </svg>
);

const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

// ── SYNCED DAY BY DAY SPRINT DATA STRUCTURE ──────────────────────────────────
const SPRINT_DAYS = [
  {
    dayNumber: 1,
    title: "Array fundamentals",
    progress: "0 / 2",
    problems: [
      { id: "two-sum", name: "Two Sum", difficulty: "Easy" },
      { id: "find-max", name: "Find Maximum", difficulty: "Easy" }
    ]
  },
  {
    dayNumber: 2,
    title: "Array fundamentals II",
    progress: "0 / 2",
    problems: [
      { id: "array-sum", name: "Array Sum", difficulty: "Easy" },
      { id: "missing-num", name: "Missing Number", difficulty: "Easy" }
    ]
  },
  {
    dayNumber: 3,
    title: "String basics",
    progress: "0 / 2",
    problems: [
      { id: "rev-string", name: "Reverse a String", difficulty: "Easy" },
      { id: "FizzBuzz", name: "FizzBuzz", difficulty: "Easy" }
    ]
  },
  {
    dayNumber: 4,
    title: "Two pointers technique",
    progress: "0 / 2",
    problems: [
      { id: "two-pointer", name: "Two Sum II", difficulty: "Medium" },
      { id: "palindrome", name: "Valid Palindrome", difficulty: "Medium" }
    ]
  },
  {
    dayNumber: 5,
    title: "Sliding window technique",
    progress: "0 / 2",
    problems: [
      { id: "max-subarray", name: "Maximum Subarray", difficulty: "Medium" },
      { id: "longest-substring", name: "Longest Substring Without Repeating Characters", difficulty: "Medium" }
    ]
  }
];

export default function PlacementSprint30() {
  const navigate = useNavigate();
  const [enrolledDate, setEnrolledDate] = useState(() => {
    return localStorage.getItem("placementSprintEnrollDate") || null;
  });

  const isEnrolled = !!enrolledDate;

  let currentDayNumber = 1;
  if (enrolledDate) {
    const start = new Date(enrolledDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = now.getTime() - start.getTime();
    currentDayNumber = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    if (currentDayNumber > 30) currentDayNumber = 30;
  }

  const handleEnroll = () => {
    const now = new Date().toISOString();
    localStorage.setItem("placementSprintEnrollDate", now);
    setEnrolledDate(now);
  };

  const handleUnenroll = () => {
    localStorage.removeItem("placementSprintEnrollDate");
    setEnrolledDate(null);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full px-6 py-8">
      <div className="max-w-[880px] mx-auto flex flex-col gap-6">

        {/* BACKWARDS DIRECTORY ROUTE REDIRECT CONTROL */}
        <div>
          <button onClick={() => navigate('/practice/study-plans')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shadow-sm">
            <IcoArrowLeft />
            <span>All plans</span>
          </button>
        </div>

        {/* HERO HERO CONTAINER BANNER HIGHLIGHT LAYER */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden shadow-[var(--card-shadow)]">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IcoRocket />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)] mb-1">30-Day Placement Sprint</h1>
              <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3">
                Free · Beginner-friendly
              </p>
              <p className="text-[13px] text-[var(--text-subtle)] leading-relaxed max-w-xl mb-5">
                A daily curriculum built to take you from zero to campus-placement ready in a month. Breadth over depth — you'll touch every pattern interviewers actually ask.
              </p>
              <div className="flex flex-wrap items-center gap-5 text-[12px] font-semibold text-[var(--text-subtle)]">
                <div className="flex items-center gap-1.5">
                  <IcoCalendar />
                  <span>30 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IcoBookOpen />
                  <span>59 problems</span>
                </div>
                {isEnrolled && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="font-bold text-[#6366f1]">Day {currentDayNumber} of 30</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION EXECUTION HERO RADIAL BUTTON LAYER */}
          {isEnrolled ? (
            <div className="w-24 h-24 rounded-full border-[6px] border-[var(--border)] bg-[var(--surface-2)] flex flex-col items-center justify-center flex-shrink-0 relative mr-4">
              <span className="text-xl font-black text-[var(--text)]">0<span className="text-[14px]">%</span></span>
              <span className="text-[10px] font-bold text-[var(--text-muted)] mt-[-2px]">0/59</span>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-extrabold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <IcoPlay />
              <span>Start plan</span>
            </button>
          )}
        </div>

        {/* ACTION ROW */}
        {isEnrolled && (
          <div className="flex items-center gap-3">
            <button onClick={handleEnroll} className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0">
              <IcoRefresh />
              <span>Reset schedule</span>
            </button>
            <button
              onClick={handleUnenroll}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-rose-500/30 hover:border-rose-500/50 text-rose-500 text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <IcoTrash />
              <span>Unenroll</span>
            </button>
          </div>
        )}

        {/* CURRICULUM SCHEDULING TRAILER PIPELINE STACK */}
        <div className="flex flex-col gap-4 mt-2">
          {SPRINT_DAYS.map((day) => (
            <div key={day.dayNumber} className={`bg-[var(--surface)] border rounded-xl overflow-hidden shadow-[var(--card-shadow)] ${isEnrolled && day.dayNumber === currentDayNumber ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-[var(--border)]'}`}>

              {/* SUB-HEADER DAY META BLOCK SECTION CARD HEAD ROW */}
              <div className={`px-5 py-4 border-b flex items-center justify-between ${isEnrolled && day.dayNumber === currentDayNumber ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-[var(--surface-2)]/30 border-[var(--border)]'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black font-mono ${isEnrolled && day.dayNumber === currentDayNumber ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30' : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]'}`}>
                    {day.dayNumber}
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider uppercase font-mono mb-0.5 flex items-center gap-1.5">
                      <span className={isEnrolled && day.dayNumber === currentDayNumber ? 'text-indigo-500' : 'text-[var(--text-muted)]'}>DAY {day.dayNumber}</span>
                      {isEnrolled && day.dayNumber === currentDayNumber && (
                        <>
                          <span className="text-[var(--text-subtle)]">·</span>
                          <span className="text-indigo-500">TODAY</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-[13px] font-bold text-[var(--text)] tracking-tight">
                      {day.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold font-mono text-[var(--text-muted)]">
                  {day.progress}
                </span>
              </div>

              {/* NESTED ASSIGNED CODING LABELS ACCORDION STREAM ROWS */}
              <div className="flex flex-col">
                {day.problems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => navigate(`/practice/problems/${problem.id || problem.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-none hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* UNCHECKED STATUS HOOP INDICATOR BULLET */}
                      <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] group-hover:border-indigo-500/50 flex-shrink-0 transition-colors" />
                      <span className="text-[12.5px] font-semibold text-[var(--text)] group-hover:text-indigo-500 transition-colors">
                        {problem.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase font-sans">
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
          ))}
        </div>
      </div>
    </div>
  );
}