import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import TopBar from "../../components/TopBar.jsx";

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

export default function PlacementSprintDetails() {
  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      
      {/* LEFT SIDEBAR NAVIGATION COMPONENT INJECTION */}
      <Sidebar active="practice" />

      {/* MAIN LAYOUT CANVAS VIEWPORT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* TOPBAR HEADER INJECTION */}
        <TopBar title="30-Day Placement Sprint" subtitle="Track progress dynamically" />

        {/* COMPONENT INTERFACE ACCORDION INNER ZONE */}
        <div className="flex-1 overflow-y-auto bg-[#060810] px-6 py-8">
          <div className="max-w-[880px] mx-auto flex flex-col gap-6">
            
            {/* BACKWARDS DIRECTORY ROUTE REDIRECT CONTROL */}
            <div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2433] bg-[#0d1117]/40 text-[11px] font-semibold text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
                <IcoArrowLeft />
                <span>All plans</span>
              </button>
            </div>

            {/* HERO HERO CONTAINER BANNER HIGHLIGHT LAYER */}
            <div className="bg-[#0d1117] border border-[#1e2433]/70 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IcoRocket />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-[#f1f5f9] tracking-tight mb-1">
                    30-Day Placement Sprint
                  </h1>
                  <div className="text-[11px] text-gray-500 font-semibold mb-4">
                    Free · Beginner-friendly
                  </div>
                  <p className="text-[12px] text-gray-400 leading-relaxed max-w-2xl font-normal">
                    A daily curriculum built to take you from zero to campus-placement ready in a month. Breadth over depth — you'll touch every pattern interviewers actually ask.
                  </p>
                  
                  {/* METRIC PILLS INTERIOR ROW */}
                  <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-5">
                    <div className="flex items-center gap-1.5">
                      <IcoCalendar />
                      <span>30 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IcoBookOpen />
                      <span>59 problems</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION EXECUTION HERO RADIAL BUTTON LAYER */}
              <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-extrabold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0">
                <IcoPlay />
                <span>Start plan</span>
              </button>
            </div>

            {/* CURRICULUM SCHEDULING TRAILER PIPELINE STACK */}
            <div className="flex flex-col gap-4 mt-2">
              {SPRINT_DAYS.map((day) => (
                <div key={day.dayNumber} className="bg-[#0d1117] border border-[#1e2433]/50 rounded-xl overflow-hidden">
                  
                  {/* SUB-HEADER DAY META BLOCK SECTION CARD HEAD ROW */}
                  <div className="px-5 py-4 border-4 border-[#1e2433]/30 bg-[#060810]/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 rounded-lg bg-[#111622] border border-[#1e2433] flex items-center justify-center text-[11px] font-black font-mono text-gray-400">
                        {day.dayNumber}
                      </div>
                      <div>
                        <div className="text-[10px] font-black tracking-wider text-gray-500 uppercase font-mono mb-0.5">
                          DAY {day.dayNumber}
                        </div>
                        <h3 className="text-[13px] font-bold text-[#f1f5f9] tracking-tight">
                          {day.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-gray-500 bg-[#060810]/50 border border-[#1e2433]/40 px-2 py-0.5 rounded-md">
                      {day.progress}
                    </span>
                  </div>

                  {/* NESTED ASSIGNED CODING LABELS ACCORDION STREAM ROWS */}
                  <div className="flex flex-col">
                    {day.problems.map((problem) => (
                      <div 
                        key={problem.id} 
                        className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2433]/30 last:border-none hover:bg-[#111622]/20 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          {/* UNCHECKED STATUS HOOP INDICATOR BULLET */}
                          <div className="w-4 h-4 rounded-full border-2 border-gray-700/80 group-hover:border-indigo-500/50 flex-shrink-0 transition-colors" />
                          <span className="text-[12.5px] font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
                            {problem.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-sans">
                            {problem.difficulty}
                          </span>
                          <span className="text-gray-600 group-hover:text-gray-300 transition-colors pl-1">
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

      </div>
    </div>
  );
}