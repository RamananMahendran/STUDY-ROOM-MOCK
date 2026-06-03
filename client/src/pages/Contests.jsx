import React from 'react';
import { Link } from 'react-router-dom';

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

const IcoChart = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IcoGlobe = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IcoCheckCircle = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IcoFlame = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const IcoStar = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IcoTrophy = ({ s = 24 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 1-12 0V2z" />
  </svg>
);

export default function Contests() {
  const features = [
    {
      title: "Live ICPC-style contests",
      description: "Compete in real-time with a synchronized countdown clock.",
      icon: <IcoZap />,
    },
    {
      title: "Live leaderboard",
      description: "Penalty-based ICPC scoring updated after every submission.",
      icon: <IcoChart />,
    },
    {
      title: "College club contests",
      description: "Open contests from clubs and orgs right inside Study Room.",
      icon: <IcoGlobe />,
    },
    {
      title: "Post-contest editorial",
      description: "Author-written explanations unlocked after the contest ends.",
      icon: <IcoCheckCircle />,
    },
    {
      title: "Solve streak integration",
      description: "Contest solves count toward your daily streak and badges.",
      icon: <IcoFlame />,
    },
    {
      title: "Priority queue for Pro",
      description: "Pro users get dedicated execution lanes during live contests.",
      icon: <IcoStar />,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 md:py-16 bg-[var(--bg)] text-[var(--text)] font-sans h-full">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Card */}
        <div className="relative rounded-3xl p-10 md:p-16 overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[#2a1b54] to-[#4c2889] shadow-2xl shadow-indigo-900/20">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold tracking-widest uppercase">
              <IcoLock /> COMING SOON
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Competitive<br />Coding Contests
            </h1>
            
            <p className="text-[#b4a5d8] text-base md:text-lg max-w-xl leading-relaxed">
              Live ICPC-style contests with real-time leaderboards, hosted by college clubs right inside your study environment. Practice together, compete together.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { text: "ICPC scoring", classes: "text-indigo-300 bg-indigo-500/20 border-indigo-400/30" },
                { text: "Live arena", classes: "text-emerald-400 bg-emerald-500/20 border-emerald-400/30" },
                { text: "Club contests", classes: "text-pink-400 bg-pink-500/20 border-pink-400/30" },
                { text: "Editorials", classes: "text-amber-400 bg-amber-500/20 border-amber-400/30" },
              ].map((pill) => (
                <span key={pill.text} className={`px-4 py-1.5 rounded-full border ${pill.classes} text-[13px] font-bold tracking-wide`}>
                  {pill.text}
                </span>
              ))}
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-6 pb-4">
          <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase ml-1">WHAT'S COMING</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#0a0d14] border border-[var(--border)] hover:border-[#2a3441] transition-colors group">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-[13px] md:text-sm font-bold text-gray-200 mb-1">{feature.title}</h4>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Card */}
        <div className="flex items-center gap-5 p-6 rounded-2xl bg-[#0a0d14] border border-[var(--border)]">
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
            <IcoTrophy />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-gray-200 mb-1">First contest coming soon</h4>
            <p className="text-xs md:text-sm text-gray-500">
              Follow the <Link to="/changelog" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-bold">changelog</Link> for the launch date. It'll be worth the wait.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
