import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IcoGift = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);
const IcoCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const IcoShare = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);
const IcoArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoPeople = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoCal = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/>
    <path d="M3 10h18"/>
  </svg>
);
const IcoCrown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>
  </svg>
);
const IcoEmptyUser = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, borderColor, label, value }) {
  return (
    <div
      className="flex-1 min-w-[140px] rounded-xl border bg-[#0d1117] p-4 flex flex-col gap-2"
      style={{ borderColor: borderColor + "66", borderTopWidth: 2, borderTopColor: borderColor }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: iconColor }}><Icon /></span>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: iconColor }}>
          {label}
        </span>
      </div>
      <div className="text-[26px] font-bold text-[#f1f5f9] leading-none">{value}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://www.studyroom.co.in/?r=u8c0989f45417d57c9d";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const milestones = [
    { n: "1 activation",  reward: "1 month Pro" },
    { n: "10 activations", reward: "1 year Pro bonus" },
    { n: "25 activations", reward: "Lifetime Pro" },
  ];

  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      <Sidebar active="refer" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1e2433]/70 flex-shrink-0">
          <div>
            <h1 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight">Referrals</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Earn Pro by inviting friends</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-500 text-[12px] hover:border-[#2e3448] transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <span className="text-[11px] text-gray-600">⌘K</span>
            </button>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-500 hover:border-[#2e3448] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-[760px] mx-auto flex flex-col gap-5">

            {/* ── Hero card ── */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0d1117] via-[#10142266] to-[#0d1117] p-6 relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%)"
              }} />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-indigo-400"><IcoGift /></span>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400">
                  Refer a Friend, Earn Pro
                </span>
              </div>
              <h2 className="text-[22px] font-extrabold text-[#f1f5f9] tracking-tight mb-2 leading-tight">
                1 month of Pro for every friend who gets active
              </h2>
              <p className="text-[12px] text-gray-400 leading-relaxed mb-5 max-w-[520px]">
                Share your link. They sign up and solve at least 5 problems within 30 days — you earn 1 month of Pro, they get a 15-day Pro trial on signup.
              </p>

              {/* Link row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center px-3 py-2.5 rounded-xl border border-[#2a3048] bg-[#060810]/70 text-[12px] font-mono text-gray-400 overflow-hidden">
                  <span className="truncate">{referralLink}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2a3048] bg-[#0d1117] text-[12px] font-semibold text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all flex-shrink-0"
                >
                  {copied ? <IcoCheck /> : <IcoCopy />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold transition-all flex-shrink-0">
                  <IcoShare />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* ── Stats row ── */}
            <div className="flex gap-3 flex-wrap">
              <StatCard icon={IcoCheck}   iconColor="#22c55e" borderColor="#22c55e" label="Activated"     value="0" />
              <StatCard icon={IcoClock}   iconColor="#f59e0b" borderColor="#f59e0b" label="Pending"       value="0" />
              <StatCard icon={IcoPeople}  iconColor="#a78bfa" borderColor="#a78bfa" label="Total Invited" value="0" />
              <StatCard icon={IcoCal}     iconColor="#6366f1" borderColor="#6366f1" label="Pro Days Earned" value="0d" />
            </div>

            {/* ── Milestone card ── */}
            <div className="rounded-2xl border border-[#1e2433]/70 bg-[#0d1117] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400"><IcoCrown /></span>
                  <span className="text-[13px] font-semibold text-[#f1f5f9]">Next milestone: 1 year Pro bonus</span>
                </div>
                <span className="text-[11px] text-gray-500 font-mono">0 / 10</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-[#1e2433] mb-4">
                <div className="h-1 rounded-full bg-indigo-600" style={{ width: "0%" }} />
              </div>
              {/* Milestones */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {milestones.map(({ n, reward }, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-400">{n}</span>
                      <span className="text-gray-600"> → </span>
                      <span className="text-gray-400">{reward}</span>
                    </span>
                    {i < milestones.length - 1 && (
                      <span className="text-gray-700 text-[11px]">·</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Your referrals ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[13px] font-bold text-[#f1f5f9]">Your referrals</span>
                <span className="text-[11px] text-gray-600">None yet</span>
              </div>
              <div className="rounded-2xl border border-[#1e2433]/70 bg-[#0d1117] p-10 flex flex-col items-center justify-center gap-3 text-center">
                <div className="text-gray-700">
                  <IcoEmptyUser />
                </div>
                <p className="text-[13px] text-gray-500">
                  Share your link above — when friends sign up, you'll see them here.
                </p>
                <p className="text-[11px] text-gray-700">
                  They get Pro for free, you earn Pro for real.
                </p>
              </div>
            </div>

            {/* ── Bottom CTA banner ── */}
            <div className="rounded-2xl border border-[#1e2433]/70 bg-[#0d1117] px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-bold text-[#f1f5f9]">Don't want to wait?</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Founder pricing is still open — ₹199/month locked forever.
                </p>
              </div>
              <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold flex-shrink-0 transition-all">
                <span>See pricing</span>
                <IcoArrowRight />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}