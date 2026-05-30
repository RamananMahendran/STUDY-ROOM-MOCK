import Sidebar from "../components/Sidebar.jsx";


// ── Icons ─────────────────────────────────────────────────────────────────────
const IcoLock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IcoTimer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/>
    <path d="M5 3 2 6"/><path d="m19 3 3 3"/><path d="M12 5V3"/>
  </svg>
);
const IcoDice = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/>
    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/>
  </svg>
);
const IcoStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
  </svg>
);
const IcoRepeat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IcoArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// ── Feature pill data ─────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: IcoTimer,  label: "45-minute timer" },
  { Icon: IcoDice,   label: "Random difficulty" },
  { Icon: IcoStar,   label: "Readiness score" },
  { Icon: IcoRepeat, label: "Weak-topic report" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function MockInterview() {
  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      <Sidebar active="mock-interview" />

      {/* Center stage */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1e2433]/70 flex-shrink-0">
          <h1 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight">Mock Interview</h1>
          <div className="flex items-center gap-3">
            {/* Search shortcut */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-500 text-[12px] hover:border-[#2e3448] transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <span className="text-[11px] text-gray-600">⌘K</span>
            </button>
            {/* Bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-500 hover:border-[#2e3448] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
            {/* Plus */}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-auto">
          <div
            className="w-full max-w-[680px] rounded-2xl border border-[#1e2433]/70 bg-[#0d1117] p-10 flex flex-col items-center text-center gap-6"
          >
            {/* Lock icon */}
            <div className="w-[68px] h-[68px] rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <IcoLock />
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-[22px] font-bold text-[#f1f5f9] tracking-tight mb-3">
                Mock Interview Mode
              </h2>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-[420px]">
                Timed 45-minute sessions against 2–3 random problems. Submit all to see per-problem
                pass/fail, score, and a weak-topic breakdown. Built for the last mile of interview prep.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {FEATURES.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1e2433] bg-[#060810]/60 text-[12px] text-gray-400"
                  style={{ minWidth: 170 }}
                >
                  <span className="text-indigo-400">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className="mt-2 flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[14px] font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Upgrade to Pro</span>
              <IcoArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}