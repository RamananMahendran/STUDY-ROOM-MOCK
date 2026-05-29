import React from "react";
import { useNavigate } from "react-router-dom";

// ── CUSTOM EMBEDDED ICONS FOR STUDY CARDS ─────────────────────────────────────

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
    meta: "Free • Beginner-friendly",
    desc: "A daily curriculum built to take you from zero to campus-placement ready in a month....",
    duration: "30 days",
    problemsCount: "59 problems",
    footerText: "Not started",
    borderColor: "hover:border-indigo-500/50 border-t-4 border-t-indigo-500",
    gradientColor: "rgba(99, 102, 241, 0.06)",
    Icon: () => <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚀</span>,
    iconContainerBg: "bg-white/5 border border-white/10",
  },
  {
    title: "FAANG Prep Intensive",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    meta: "Pro • Medium-Hard • 45 days",
    desc: "45 days of medium + hard problems laser-focused on the patterns FAANG loops...",
    duration: "45 days",
    problemsCount: "76 problems",
    footerText: "Pro required",
    borderColor: "hover:border-purple-500/50 border-t-4 border-t-purple-500",
    gradientColor: "rgba(168, 85, 247, 0.06)",
    Icon: () => <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⚡</span>,
    iconContainerBg: "bg-white/5 border border-white/10",
  },
  {
    title: "Arrays & Strings Mastery",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    meta: "Pro • 14 days • Array + String only",
    desc: "14-day deep dive into the single topic that shows up in ~60% of interviews. By day 14...",
    duration: "14 days",
    problemsCount: "37 problems",
    footerText: "Pro required",
    borderColor: "hover:border-amber-500/50 border-t-4 border-t-amber-500",
    gradientColor: "rgba(245, 158, 11, 0.06)",
    Icon: () => <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🎯</span>,
    iconContainerBg: "bg-white/5 border border-white/10",
  },
  {
    title: "Weekly Challenge",
    isPro: true,
    tag: "PRO",
    tagBg: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    meta: "Pro • 7 days • 1 problem/day",
    desc: "One carefully chosen problem per day for 7 days — a mix of difficulties and topics....",
    duration: "7 days",
    problemsCount: "7 problems",
    footerText: "Pro required",
    borderColor: "hover:border-emerald-500/50 border-t-4 border-t-emerald-500",
    gradientColor: "rgba(16, 185, 129, 0.06)",
    Icon: () => <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏆</span>,
    iconContainerBg: "bg-white/5 border border-white/10",
  },
];

export default function StudyPlans() {
  const navigate = useNavigate();

  return (
    <>
        {/* MAIN BODY SCROLL ZONE - Fixed: Removed items-center */}
        <div className="flex-1 overflow-y-auto min-h-0 flex justify-center w-full" style={{ backgroundColor: "var(--bg)" }}>
          <div className="w-full max-w-[980px] mx-auto px-8 py-10 md:py-12 flex flex-col gap-10">
            
            {/* HERO TYPOGRAPHY HEADER */}
            <div className="max-w-4xl">
              <h1 className="text-[22px] font-bold tracking-tight mb-3" style={{ color: "var(--text)" }}>
                Structured Study Plans — 30-Day Placement Sprint, FAANG Prep, and more
              </h1>
              <p className="text-[13px] md:text-sm leading-relaxed font-normal" style={{ color: "var(--text-muted)" }}>
                Hand-picked daily curricula. Each plan is a sequenced tour of the problems that actually matter — no more wondering what to solve next.
              </p>
            </div>

            {/* CURATED REPOSITORY MATRIX GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLANS.map((plan, idx) => {
                const PlanIcon = plan.Icon;
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl p-6 flex flex-col gap-2 justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#000000]/30 cursor-pointer border border-[var(--border)] ${plan.borderColor}`}
                    style={{ 
                      background: `linear-gradient(180deg, ${plan.gradientColor} 0%, transparent 35%), var(--surface)`
                    }}
                  >
                    <div>
                      {/* CARD HEAD ROW */}
                      <div className="flex gap-4 items-start mb-4">
                        <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center flex-shrink-0 ${plan.iconContainerBg}`}>
                          <PlanIcon />
                        </div>
                        <div className="flex flex-col gap-2 mt-0.5">
                          {plan.tag === "PRO" ? (
                            <div className="flex items-center gap-2">
                              <h2 className="text-[17px] font-bold tracking-tight text-white">
                                {plan.title}
                              </h2>
                              <span className={`w-fit text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider ${plan.tagBg}`}>
                                {plan.tag}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <h2 className="text-[17px] font-bold tracking-tight text-white">
                                {plan.title}
                              </h2>
                              {plan.tag && (
                                <span className={`w-fit text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider ${plan.tagBg}`}>
                                  {plan.tag}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-[13px] text-gray-500 font-medium">
                            {plan.meta}
                          </div>
                        </div>
                      </div>

                      {/* CARD CONTENT LAYER */}
                      <p className="text-[14px] leading-relaxed text-gray-400 mb-6 line-clamp-2 mt-4">
                        {plan.desc}
                      </p>
                    </div>

                    {/* CARD METADATA METRICS FOOTER */}
                    <div>
                      <div className="flex items-center gap-5 text-[13px] pb-4 mb-4" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2 text-gray-400">
                          <IcoCalendar />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <IcoBookOpen />
                          <span>{plan.problemsCount}</span>
                        </div>
                      </div>

                      {/* CARD INTERACTIVE NAVIGATION CHEVRONS */}
                      <div className="flex items-center justify-between text-gray-500 font-bold text-[13px] group-hover:text-gray-300 transition-colors">
                        <div className="flex items-center gap-1.5">
                          {plan.isPro && <IcoLock />}
                          <span>{plan.footerText}</span>
                        </div>
                        <span className="text-gray-600 group-hover:translate-x-1 group-hover:text-white transition-all duration-300">
                          <IcoArrowRight />
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* UPGRADE CALL TO ACTION FOOTER BANNER */}
            <div 
              className="mt-4 rounded-2xl p-6 md:px-8 md:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-indigo-500/20 shadow-2xl"
              style={{ background: "linear-gradient(90deg, rgba(49, 46, 129, 0.15) 0%, transparent 100%), var(--surface)" }}
            >
              <div className="flex gap-4 items-center">
                <div className="text-indigo-400">
                  <IcoSparkles />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold tracking-tight text-white mb-1">
                    Unlock every plan with Pro
                  </h3>
                  <p className="text-[13px] text-gray-400">
                    FAANG Prep, Arrays Mastery, Weekly Challenge — plus mock interview and advanced analytics.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/pricing')}
                className="flex-shrink-0 w-full sm:w-auto px-5 py-2 rounded-[10px] bg-[#6366f1] text-white text-[13px] font-bold hover:bg-[#4f46e5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Upgrade
                <IcoArrowRight />
              </button>
            </div>

          </div>
        </div>
    </>
  );
}