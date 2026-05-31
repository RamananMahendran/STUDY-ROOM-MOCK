import React from "react";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import "./Changelog.css";

// ── CHANGELOG ENTRIES DATA MATRIX ─────────────────────────────────────────────

const RELEASES = [
  {
    date: "24 MAY 2026",
    tag: "Auth",
    badgeColor: { bg: "rgba(59, 130, 246, 0.1)", text: "#60a5fa" },
    title: "Auth v2 — forgot password, email verification, set a password for Google",
    desc: "A fully clean validation and recovery update layout designed to handle custom security layers seamlessly without fragmentation patterns across active user states.",
    points: [
      "Security password resets feature direct system validation routing paths.",
      "Email verifications act without continuous layout context disruptions.",
      "Set a password fallback alternatives mapped accurately across third-party access chains.",
      "Session terminations safely flush old storage arrays upon token renewals.",
      "Clean status reporting layers return targeted structural debug feedback lists.",
    ],
  },
  {
    date: "17 MAY 2026",
    tag: "Rooms",
    badgeColor: { bg: "rgba(16, 185, 129, 0.1)", text: "#34d399" },
    title: "Engagement loop — presence, public rooms, friend activity",
    desc: "Brings higher clarity into collaborative instances, keeping study cohorts connected via real-time operational dashboard feeds.",
    points: [
      "Presence status loops execute queries across minimal payload frameworks.",
      "Public workspaces display clear user densities inside system grid selectors.",
      "Friend activity arrays surface active milestones cleanly without context bloat.",
      "Active room navigation filters let loops evaluate specific tracking metrics.",
      "Engagement telemetry aggregates background execution ticks dynamically.",
    ],
  },
  {
    date: "10 MAY 2026",
    tag: "Engine",
    badgeColor: { bg: "rgba(245, 158, 11, 0.1)", text: "#fbbf24" },
    title: "Real time badges + daily challenge streaks",
    desc: "Introduces gamified progression pipelines intended to incentivize continuous user platform routines reliably over consecutive intervals.",
    points: [
      "Streaks calculation metrics resolve asynchronously across timezone offsets.",
      "Badges render vectorized components cleanly upon unlocking criteria match configurations.",
      "Daily problem refreshes sequence programmatic evaluation points.",
    ],
  },
  {
    date: "03 MAY 2026",
    tag: "Platform",
    badgeColor: { bg: "rgba(107, 114, 128, 0.15)", text: "#9ca3af" },
    title: "Security, SEO, and copy consolidation",
    desc: "Optimizes indexing profiles alongside strict route access security rules across our central platform runtime.",
    points: [
      "Security verification policies sanitize structural user request nodes fully.",
      "SEO tagging structures present optimized programmatic headers for index evaluation blocks.",
      "Copy structures unify multi-view descriptions into single semantic schemas.",
      "Assets parsing parameters reduce structural footprint bounds over standard setups.",
    ],
  },
  {
    date: "26 APR 2026",
    tag: "Pro",
    badgeColor: { bg: "rgba(139, 92, 246, 0.1)", text: "#a78bfa" },
    title: "Coding Pro is live — Razorpay subscriptions, mock interviews, advanced analytics",
    desc: "Our landmark premium layer deployment designed for individuals preparing for high-intensity tracking rounds.",
    points: [
      "Razorpay processing gateways balance multi-source transaction statuses flawlessly.",
      "Mock interviews execute multi-tier execution timers alongside sandbox instances.",
      "Advanced scorecards evaluate analytical parameters down to unique item arrays.",
      "Priority compiler access routes execute processing steps inside specialized threads.",
      "Historical data monitors structure multi-week data tables clearly.",
    ],
  },
  {
    date: "19 APR 2026",
    tag: "Coding",
    badgeColor: { bg: "rgba(14, 165, 233, 0.1)", text: "#38bdf8" },
    title: "Daily challenge, discussion threads, and 20 new problems",
    desc: "Expands code repository spaces while establishing community documentation anchors inside localized structural blocks.",
    points: [
      "Daily challenges map custom reward flags directly onto user metric sheets.",
      "Discussion forums parse text schemas efficiently inside collaborative view frames.",
      "New data structure arrays add structured verification test vectors safely.",
      "Code testing engines evaluate dynamic scripts under tighter execution timeouts.",
    ],
  },
];

// ── COMPONENT REUSABLE BULLET COMPONENT ───────────────────────────────────────

function ChangelogBullet({ text }) {
  return (
    <div className="changelog-bullet-row">
      <div className="changelog-bullet-dot" />
      <span>{text}</span>
    </div>
  );
}

// ── MAIN ENTRY COMPONENT ──────────────────────────────────────────────────────

export default function Changelog() {
  return (
    <div style={{ background: "#060810", color: "#e2e8f0", minHeight: "100vh" }}>
      
      {/* Shared Header element with Active Navigation item definition string */}
      <Header activePage="Changelog" />

      {/* ── HERO CONTROL WRAPPER ── */}
      <section className="changelog-hero">
        <div className="hero-glow" style={{ width: 500, height: 400, background: "#1e1b4b", top: "-10%", left: "35%", opacity: 0.25 }} />
        
        <div className="changelog-tag">CHANGELOG</div>
        <h1 className="changelog-title">
          Everything we've <em>shipped</em> so far.
        </h1>
        <p className="changelog-sub">
          Continuous feature improvements, design system enhancements, and execution stability monitoring iterations delivered to your workspace environment.
        </p>

        {/* Subscribe Action Loop Box */}
        <div className="changelog-subscribe-box">
          <div className="changelog-bell-icon">🔔</div>
          <div className="changelog-sub-input-wrapper">
            <span className="changelog-sub-label">On release emails</span>
            <input 
              type="email" 
              className="changelog-sub-input" 
              placeholder="you@domain.com"
              readOnly 
            />
          </div>
          <button className="btn-primary sm" style={{ padding: "8px 16px" }}>Subscribe</button>
        </div>
      </section>

      {/* ── TIMELINE ITERATION FEED ── */}
      <section className="changelog-timeline-section">
        {/* Hidden systemic line track for visual alignment */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "141px", width: "1px", background: "#0f172a", zIndex: 0 }} className="timeline-line-hidden-mobile" />

        {RELEASES.map((release, idx) => (
          <div key={idx} className="changelog-item-block">
            
            {/* Meta Timestamp Container Side */}
            <div className="changelog-meta-side">
              <span className="changelog-date">{release.date}</span>
            </div>

            {/* Interactive Timeline Card Content Frame */}
            <div className="changelog-card">
              <span 
                className="changelog-badge"
                style={{ 
                  backgroundColor: release.badgeColor.bg, 
                  color: release.badgeColor.text 
                }}
              >
                {release.tag}
              </span>
              
              <h2 className="changelog-card-title">{release.title}</h2>
              <p className="changelog-card-desc">{release.desc}</p>

              <div className="changelog-bullets-list">
                {release.points.map((pointText, pIdx) => (
                  <ChangelogBullet key={pIdx} text={pointText} />
                ))}
              </div>
            </div>

          </div>
        ))}
      </section>

      {/* ── COMPONENT FOOTER REDIRECT TARGET ── */}
      <section className="final-cta" style={{ borderTop: "1px solid #0f172a" }}>
        <div className="hero-glow" style={{ width: 400, height: 300, background: "#1e3a8a", bottom: "0%", right: "30%", opacity: 0.12 }} />
        <div className="final-cta-content">
          <h2 className="final-cta-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>Stay ahead of the roadmap</h2>
          <p className="final-cta-sub" style={{ marginBottom: "24px", fontSize: "0.88rem" }}>We iterate daily. Spin up a synchronized group instance now to evaluate the features in production.</p>
          <button className="btn-primary lg" style={{ margin: "0 auto" }}>Open Study Room</button>
        </div>
      </section>
        <Footer />
    </div>
  );
}