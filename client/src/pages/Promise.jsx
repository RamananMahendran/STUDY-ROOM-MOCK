import React from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./Promise.css";

// ── DATA FOR COMPONENT CONFIGURATION ──────────────────────────────────────────

const FREE_FOREVER_FEATURES = [
  { title: "Study Rooms", desc: "Create or join rooms with up to 20 friends instantly without session limits or timeouts." },
  { title: "Group Chat", desc: "Text threads and low-latency voice paths built straight into the synchronized terminal tab." },
  { title: "Shared Notepad", desc: "Collaborate on structural scratchpads and store code clips inside centralized nodes." },
  { title: "Standard Ground", desc: "Run, update, and review programming structures across basic execution systems." },
  { title: "Streak Metrics", desc: "Monitor daily activity milestones, track progress, and climb community boards." },
  { title: "No Trackers", desc: "Your data stays yours. No tracking pixels, hidden telemetry networks, or tracking nodes." },
];

const ECONOMICS_LAYERS = [
  { title: "Coding Free", meta: "Free tier layer", desc: "Maintains access to foundational modules. Funded entirely by premium platform upgrades.", highlight: false },
  { title: "Coding Pro", meta: "₹299 / month layer", desc: "Built for intensive interview cycles. Adds mock evaluations, analytical maps, and priority runtime access.", highlight: true },
  { title: "Teams & Institutional", meta: "Enterprise tier layer", desc: "Provides custom sandboxes, bulk provisioning pipelines, and instrumentation monitors for colleges and bootcamps.", highlight: false },
];

const TRADE_YES = [
  "Core workspace frameworks stay free forever.",
  "Clear visibility into exactly what tier variations support the product.",
  "Ad-free environment with zero tracking algorithms.",
  "The freedom to downgrade your account without lock-in constraints.",
];

const TRADE_NO = [
  "No hidden limits on basic rooms.",
  "No platform optimization lockouts behind paywalls.",
  "No selling user profile metadata lists.",
  "No mandatory premium subscription requirements.",
];

// ── UTILITY DECORATIVE COMPONENTS ─────────────────────────────────────────────

function GreenCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect width="16" height="16" rx="8" fill="#10b981" fillOpacity="0.15" />
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GrayMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path d="M4 8h8" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── COMPONENT ENTRY POINT ─────────────────────────────────────────────────────

export default function PromisePage() {
  return (
    <div style={{ background: "#060810", color: "#e2e8f0", minHeight: "100vh" }}>
      
      {/* Dynamic Header Component with Active state string indicator */}
      <Header activePage="Promise" />

      {/* ── HERO HEADER BLOCK ── */}
      <section className="promise-hero">
        <div className="hero-glow" style={{ width: 600, height: 400, background: "#1e1b4b", top: "-5%", left: "20%", opacity: 0.3 }} />
        
        <div className="promise-tag">OUR TRANSPARENCY PROMISE</div>
        <h1 className="promise-title">
          Study Room is free — <span className="purple">forever</span> — for students.
        </h1>
        <p className="promise-sub">
          This document maps out exactly what that statement means, what stays completely free, and how our infrastructure remains sustainable without compromising student access.
        </p>
      </section>

      {/* ── THE SIX FEATURES BLOCK ── */}
      <section className="pfeatures-section">
        <h2 className="pfeatures-heading">The six features that are free forever</h2>
        
        <div className="pfeatures-grid">
          {FREE_FOREVER_FEATURES.map((item, idx) => (
            <div key={idx} className="pfeature-box">
              <GreenCheck />
              <div>
                <h3 className="pfeature-title">{item.title}</h3>
                <p className="pfeature-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ECONOMICS INFRASTRUCTURE BLOCK ── */}
      <section className="economics-section">
        <div className="economics-inner">
          <div className="section-tag" style={{ marginBottom: "16px" }}>SUSTAINABILITY MODEL</div>
          <h2 className="eco-heading">The economics — who pays so students don't</h2>
          <p className="eco-sub">
            Running compile instances and sync nodes takes real infrastructure. We power these systems using an opt-in model rather than selling student metrics or running tracking tools.
          </p>

          <div className="eco-cards-list">
            {ECONOMICS_LAYERS.map((tier, idx) => (
              <div key={idx} className={`eco-row-card ${tier.highlight ? "highlight" : ""}`}>
                <div className="eco-row-top">
                  <span className="eco-row-title">{tier.title}</span>
                  <span className="eco-row-meta">{tier.meta}</span>
                </div>
                <p className="eco-row-desc">{tier.desc}</p>
              </div>
            ))}
          </div>

          <p className="eco-link-foot">
            To view pricing structures or explore upgrading your profile tier matrices, see our <a href="/pricing">Pricing configuration page →</a>.
          </p>
        </div>
      </section>

      {/* ── THE TRADE VALUE METRIC ── */}
      <section className="trade-section">
        <div className="trade-inner">
          <h2 className="trade-heading">If you're a student, this is the trade</h2>
          
          <div className="trade-split">
            {/* What you get */}
            <div className="trade-side-box">
              <div className="trade-side-label green">WHAT YOU GET</div>
              <div className="trade-items-list">
                {TRADE_YES.map((text, idx) => (
                  <div key={idx} className="trade-item-row">
                    <GreenCheck />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you don't give up */}
            <div className="trade-side-box">
              <div className="trade-side-label gray">WHAT YOU DON'T GIVE UP</div>
              <div className="trade-items-list">
                {TRADE_NO.map((text, idx) => (
                  <div key={idx} className="trade-item-row">
                    <GrayMinus />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER INSIGHT LETTER ── */}
      <section className="founder-note-section">
        <div className="founder-card-inner">
          <div className="f-header">
            <div className="f-profile">
              <div className="f-avatar">J</div>
              <div>
                <div className="f-name">Jainth A</div>
                <div className="f-title">Founder, Study Room Platform</div>
              </div>
            </div>
            <div className="f-date">May 2026</div>
          </div>

          <p className="f-body-text">
            I built Study Room because jumping between four separate browser windows during late-night preparation sessions with friends was breaking my workflow. The core collaboration loops shouldn't be locked behind paywalls.
          </p>
          <p className="f-body-text">
            Here are the operational rules I have established for this project to protect user workflow integrity over long horizons:
          </p>

          <div className="f-rules-list">
            <div className="f-rule-row">
              <span>1.</span>
              <span><strong>Study room elements cannot be gated.</strong> Core room instances, timers, and sync loops will remain fully free.</span>
            </div>
            <div className="f-rule-row">
              <span>2.</span>
              <span><strong>Coding Free tier configurations will remain highly functional.</strong> The free level remains fully capable of supporting independent daily challenges.</span>
            </div>
            <div className="f-rule-row">
              <span>3.</span>
              <span><strong>No dark patterns.</strong> No sudden prompt interfaces, tracking networks, or intrusive popups breaking your workspace view.</span>
            </div>
          </div>

          <div className="f-signature">Jainth A</div>
        </div>
      </section>

      {/* ── FINAL FOOTER CONSOLE ACTION ── */}
      <section className="final-cta" style={{ borderTop: "1px solid #0f172a" }}>
        <div className="hero-glow" style={{ width: 400, height: 300, background: "#312e81", bottom: "0%", left: "40%", opacity: 0.15 }} />
        <div className="final-cta-content">
          <h2 className="final-cta-heading" style={{ fontSize: "2.5rem", marginBottom: "14px" }}>Ready to study together?</h2>
          <p className="final-cta-sub" style={{ marginBottom: "28px", fontSize: "0.88rem" }}>Setup your synced workspace in moments and build your track record alongside peers.</p>
          <button className="btn-primary lg" style={{ margin: "0 auto" }}>Start for free</button>
        </div>
      </section>
                <Footer />
    </div>
  );
}