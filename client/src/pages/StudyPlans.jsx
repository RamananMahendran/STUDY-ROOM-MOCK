import React from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";

// ── CUSTOM EMBEDDED ICONS FOR STUDY CARDS ─────────────────────────────────────
const IcoRocket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
    <path d="M12 2C7.5 2 4 5.5 4 10c0 4.5 3.5 8 8 8s8-3.5 8-8c0-4.5-3.5-8-8-8z" />
    <path d="M12 6v8" />
  </svg>
);

const IcoBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IcoTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IcoTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a5 5 0 0 0-5 5v4c0 2.76 2.24 5 5 5s5-2.24 5-5V7a5 5 0 0 0-5-5z" />
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

const IcoLock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IcoArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IcoSparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
  </svg>
);

const PLANS = [
  {
    title: "30-Day Placement Sprint",
    isPro: false,
    tag: "FREE",
    tagBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    meta: "Free · Beginner-friendly",
    desc: "A daily curriculum built to take you from zero to campus-placement ready in a month. Breadth-focused on core arrays, hashes, and sorting tracks.",
    duration: "30 days",
    problemsCount: "59 problems",
    footerText: "Not started",
    borderColor: "hover:border-indigo-500/50 border-t-4 border-t-indigo-500",
    Icon: IcoRocket,
    iconContainerBg: "bg-rose-500/10 border border-rose-500/20",
  },
  {
    title: "FAANG Prep Intensive",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    meta: "Pro · Medium-Hard · 45 days",
    desc: "45 days of medium + hard problems laser-focused on the patterns FAANG loops actually look for across graphs, trees, and optimizations.",
    duration: "45 days",
    problemsCount: "76 problems",
    footerText: "Pro required",
    borderColor: "hover:border-purple-500/50 border-t-4 border-t-purple-500",
    Icon: IcoBolt,
    iconContainerBg: "bg-amber-500/10 border border-amber-500/20",
  },
  {
    title: "Arrays & Strings Mastery",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    meta: "Pro · 14 days · Array + String only",
    desc: "14-day deep dive into the single topic that shows up in ~60% of interviews. By day 14, window sliding and two-pointer solutions become second nature.",
    duration: "14 days",
    problemsCount: "37 problems",
    footerText: "Pro required",
    borderColor: "hover:border-amber-500/50 border-t-4 border-t-amber-500",
    Icon: IcoTarget,
    iconContainerBg: "bg-pink-500/10 border border-pink-500/20",
  },
  {
    title: "Weekly Challenge",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    meta: "Pro · 7 days · 1 problem/day",
    desc: "One carefully chosen problem per day for 7 days — a mix of difficulties and topics to maintain algorithmic acuity without structural prep load.",
    duration: "7 days",
    problemsCount: "7 problems",
    footerText: "Pro required",
    borderColor: "hover:border-emerald-500/50 border-t-4 border-t-emerald-500",
    Icon: IcoTrophy,
    iconContainerBg: "bg-emerald-500/10 border border-emerald-500/20",
  },
];

export default function StudyPlans() {
  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR INJECTION */}
      <Sidebar active="practice" />

      {/* MAIN VIEWPORT INTERFACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* TOPBAR NAVIGATION INJECTION */}
        <TopBar title="Study Plans" subtitle="Curated multi-day tracks" />

        {/* MAIN BODY SCROLL ZONE - Fixed: Removed items-center */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-[#060810] flex justify-center w-full">
          <div className="w-full max-w-[900px] mx-auto px-6 py-10 md:py-12 flex flex-col gap-10">
            
            {/* HERO TYPOGRAPHY HEADER */}
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#f1f5f9] mb-3">
                Structured Study Plans — 30-Day Placement Sprint, FAANG Prep, and more
              </h1>
              <p className="text-[13px] md:text-sm text-gray-500 leading-relaxed font-normal">
                Hand-picked daily curricula. Each plan is a sequenced tour of the problems that actually matter — no more wondering what to solve next.
              </p>
            </div>

            {/* CURATED REPOSITORY MATRIX GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLANS.map((plan, idx) => {
                const PlanIcon = plan.Icon;
                return (
                  <div
                    key={idx}
                    className={`bg-[#0d1117] border border-[#1e2433]/70 rounded-xl px-5 py-3 flex flex-col gap-2 justify-between transition-all duration-200 cursor-pointer ${plan.borderColor}`}
                  >
                    <div>
                      {/* CARD HEAD ROW */}
                      <div className="flex gap-3 items-start mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${plan.iconContainerBg}`}>
                          <PlanIcon />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight">
                            {plan.title}
                          </h2>
                          <span className={`w-fit text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider ${plan.tagBg}`}>
                            {plan.tag}
                          </span>
                          <div className="text-[11px] text-gray-500 mb-1 font-medium">
                            {plan.meta}
                          </div>
                        </div>
                      </div>

                      {/* CARD CONTENT LAYER */}
                      <p className="text-[12px] text-gray-400/80 leading-relaxed font-normal mb-5 line-clamp-3 mt-2">
                        {plan.desc}
                      </p>
                    </div>

                    {/* CARD METADATA METRICS FOOTER */}
                    <div>
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 border-b border-[#1e2433]/50 pb-4 mb-3.5">
                        <div className="flex items-center gap-1.5">
                          <IcoCalendar />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IcoBookOpen />
                          <span>{plan.problemsCount}</span>
                        </div>
                      </div>

                      {/* CARD INTERACTIVE NAVIGATION CHEVRONS */}
                      <div className="flex items-center justify-between text-gray-400 font-medium text-[12px] group">
                        <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-gray-300 transition-colors">
                          {plan.isPro && <IcoLock />}
                          <span className="text-[11px] tracking-wide">{plan.footerText}</span>
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-300 transition-colors">
                          <IcoArrowRight />
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* UPGRADE CALL TO ACTION FOOTER BANNER */}
            <div className="bg-gradient-to-r from-[#0d1117] via-[#0d1324] to-[#111129] border border-[#1e2433] rounded-xl p-5 md:px-6 md:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                  <IcoSparkles />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f1f5f9] mb-0.5 tracking-tight">
                    Unlock every plan with Pro
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    FAANG Prep, Arrays Mastery, Weekly Challenge — plus mock interview modules and advanced performance analytics scorecards.
                  </p>
                </div>
              </div>
              
              <button className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#6366f1] text-white text-[12px] font-bold hover:bg-[#4f46e5] transition-all duration-150 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer">
                Upgrade
                <IcoArrowRight />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}