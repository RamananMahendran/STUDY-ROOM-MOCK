import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pricing.css";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";


// ── DATA DEFINITIONS ──────────────────────────────────────────────────────────

const CARDS_DATA = [
  {
    name: "Study Rooms",
    target: "For students",
    price: "Free",
    period: "forever",
    btnText: "Start now",
    btnStyle: "btn-outline",
    features: [
      { text: "Unlimited Study Rooms", checked: true },
      { text: "Synced Pomodoro for your group view", checked: true },
      { text: "Group Chat + Voice lines", checked: true },
      { text: "Shared notes & Notepad sync", checked: true },
      { text: "Session tracking data", checked: false },
      { text: "Advanced Performance insights", checked: false },
      { text: "Premium Interview Modules", checked: false },
      { text: "Priority execution stack", checked: false },
    ],
  },
  {
    name: "Coding Free",
    target: "For testers",
    price: "Free",
    period: "forever",
    btnText: "Try problems",
    btnStyle: "btn-outline",
    features: [
      { text: "120 basic problem frameworks", checked: true },
      { text: "Standard execution environments", checked: true },
      { text: "Daily Challenges dashboard", checked: true },
      { text: "Leaderboards & public standings", checked: true },
      { text: "Pair Coding editor links", checked: false },
      { text: "Track records over 8 weeks", checked: false },
      { text: "Full assessment review suites", checked: false },
      { text: "No latency priority token", checked: false },
    ],
  },
  {
    name: "Coding Pro",
    target: "For serious placement candidates",
    price: "₹299",
    period: "per month",
    btnText: "Sign up to subscribe",
    btnStyle: "btn-primary",
    popular: true,
    features: [
      { text: "Everything in Coding Free tier", checked: true },
      { text: "Mock Interview Mode timed challenges", checked: true },
      { text: "Advanced Profile Analytics & Maps", checked: true },
      { text: "Exclusive Structured Placement Plans", checked: true },
      { text: "Unlimited concurrent Pair sessions", checked: true },
      { text: "Comprehensive 8-week data history", checked: true },
      { text: "Priority Execution cluster priority", checked: true },
      { text: "All diagnostic system evaluations", checked: true },
    ],
  },
  {
    name: "Teams",
    target: "For colleges, clubs & bootcamps",
    price: "Coming soon",
    period: "",
    btnText: "Get notified",
    btnStyle: "btn-outline",
    features: [
      { text: "Centralized Management console", checked: true },
      { text: "Activity monitors & real-time telemetry", checked: true },
      { text: "Custom batch Code repository bases", checked: true },
      { text: "Dedicated Sandbox instances", checked: true },
      { text: "Bulk account provisioning pipelines", checked: true },
      { text: "Premium institutional priority routes", checked: true },
    ],
  },
];

const MATRIX_DATA = [
  { feature: "Full assessment suite Access", free: false, pro: true },
  { feature: "Code preparation & Syntax check updates", free: true, pro: true },
  { feature: "Daily Challenges + streak counters", free: true, pro: true },
  { feature: "Pair coding sessions structure", free: true, pro: true },
  { feature: "Active Workspace room configurations", free: true, pro: true },
  { feature: "Live room Sync functionality", free: true, pro: true },
  { feature: "Mock testing run engine bounds", free: false, pro: true },
  { feature: "Advanced metrics dashboard metrics", free: false, pro: true },
  { feature: "History trackers spanning long horizons", free: false, pro: true },
  { feature: "Priority runtime server loops", free: false, pro: true },
  { feature: "Dedicated community support lines", free: false, pro: true },
];

const FAQ_DATA = [
  {
    q: "Will study rooms ever become paid?",
    a: "No. The six study room features (rooms, chat, notes, Pomodoro, voice, files) are free forever for individual students. This is a hard commitment written into our product review rules — not a marketing line. Read the full commitment on the promise page.",
  },
  {
    q: "What exactly do I get with Pro?",
    a: "Pro unlocks our structured 30-Day Placement Sprint tracks, advanced analytical heatmaps tracking structural topic weaknesses, dynamic interview-readiness forecasting, and priority execution paths on our evaluation runtimes.",
  },
  {
    q: "What's the founder pricing and how does it work?",
    a: "Founder pricing offers early adopters an exclusive subscription rate of ₹199/month. This discounted price is permanently locked in for your account for as long as you maintain your active membership subscription.",
  },
  {
    q: "What happens to my data if I cancel Pro?",
    a: "Your account downgrades gracefully to our standard free tier limits. All analytical scorecard profiles and codebases are stored securely, though certain deep history views might be hidden until renewal.",
  },
  {
    q: "Refund policy?",
    a: "We offer a standard, zero-friction 7-day refund guarantee if our premium feature layers don't align with your preparation goals.",
  },
  {
    q: "Payment methods?",
    a: "We support all major payment ecosystems across India including UPI payment pathways, local Credit/Debit configurations, and Internet Banking options via secure interfaces.",
  },
  {
    q: "Why is Coding Pro optional if study rooms are free?",
    a: "We separate space tracking from dedicated computation tools. Collaborative rooms require minimal infrastructure, allowing us to keep them free, while high-frequency programming compilers and personalized performance models require dedicated computing power covered by the Pro tier.",
  },
];

// ── AUXILIARY ICONS ──────────────────────────────────────────────────────────

function MatrixCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="4" fill="#6366f1" fillOpacity="0.15" />
      <path d="M4 8l3 3 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MatrixX() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#2a303c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ListCheck({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8l3 3 6-6" stroke={active ? "#6366f1" : "#1f2937"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── COMPONENT ENTRY POINT ─────────────────────────────────────────────────────

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upgrade to Pro!");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/auth/upgrade-pro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.role = "pro";
          localStorage.setItem("user", JSON.stringify(userObj));
        }
        alert("Success! You are now a Pro member! Enjoy structured study plans and advanced analytics.");
        navigate("/practice/study-plans");
      } else {
        alert("Upgrade failed: " + (data.message || data.error));
      }
    } catch (err) {
      console.error(err);
      alert("Error upgrading to Pro");
    }
  };

  const handleBtnClick = (idx) => {
    if (idx === 0) {
      navigate("/rooms");
    } else if (idx === 1) {
      navigate("/practice/problems");
    } else if (idx === 2) {
      handleUpgrade();
    } else if (idx === 3) {
      alert("Thank you for your interest! Team features are coming soon.");
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh" }}>
      <Header activePage="Pricing" />
      {/* ── HERO BANNER ── */}
      <section className="pricing-hero">
        <div className="hero-glow" style={{ width: 500, height: 400, background: "#312e81", top: "-10%", left: "30%", opacity: 0.25 }} />
        
        <div className="pricing-tag">STUDY ROOMS · CHOOSE YOUR LEVEL</div>
        <h1 className="pricing-title">Pricing</h1>
        <p className="pricing-subtitle">
          Study rooms are free forever for students. Pro and Team tiers fund the platform — <a href="#promise">read the full promise</a>.
        </p>

        {/* Founder Counter */}
        <div className="founder-slots-container">
          <div className="slots-badge">🔥 FACE LINE</div>
          <div className="slots-text">99 of 100 founder slots remaining</div>
          <div className="slots-sub">Subscribe today to secure a flat 30% discount on standard tier updates, locked for life.</div>
        </div>
      </section>

      {/* ── SUBSCRIPTION MATRIX CARDS ── */}
      <section className="pricing-grid-section">
        <div className="pricing-grid">
          {CARDS_DATA.map((card, idx) => (
            <div key={idx} className={`pcard ${card.popular ? "popular" : ""}`}>
              {card.popular && <div className="pcard-popular-tag">MOST POPULAR</div>}
              
              <div className="pcard-name">{card.name}</div>
              <div className="pcard-target">{card.target}</div>
              
              <div className="pcard-price-box">
                <span className="pcard-price">{card.price}</span>
                {card.period && <span className="pcard-period">/ {card.period}</span>}
              </div>

              <ul className="pcard-features">
                {card.features.map((feat, fIdx) => (
                  <li key={fIdx} className={`pcard-feature-item ${feat.checked ? "checked" : ""}`}>
                    <ListCheck active={feat.checked} />
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleBtnClick(idx)}
                className={`${card.btnStyle} sm pcard-btn`}
              >
                {card.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES MATRIX COMPARISON TABLE ── */}
      <section className="matrix-section">
        <div className="matrix-inner">
          <h2 className="matrix-title">
            Everything Free does, plus <em>five more for Pro.</em>
          </h2>

          <div className="matrix-table">
            <div className="matrix-row matrix-header">
              <div className="matrix-cell feature-name matrix-head-label">FEATURES BASE</div>
              <div className="matrix-cell tier-val matrix-head-label">FREE</div>
              <div className="matrix-cell tier-val matrix-head-label active-tier matrix-head-tier pro">PRO / TEAM</div>
            </div>

            {MATRIX_DATA.map((row, rIdx) => (
              <div key={rIdx} className="matrix-row">
                <div className="matrix-cell feature-name">{row.feature}</div>
                <div className="matrix-cell tier-val">
                  {row.free ? <MatrixCheck /> : <MatrixX />}
                </div>
                <div className="matrix-cell tier-val active-tier">
                  {row.pro ? <MatrixCheck /> : <MatrixX />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ── */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="section-tag" style={{ display: "block", width: "max-content", margin: "0 auto 16px" }}>Clear views</div>
          <h2 className="faq-title">Frequently asked</h2>

          <div className="faq-list">
            {FAQ_DATA.map((item, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(index)}>
                  <span>{item.q}</span>
                  <span className="faq-arrow">▼</span>
                </button>
                {openFaq === index && (
                  <div className="faq-content">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to action card footer */}
          <div className="questions-box">
            <h3 className="questions-title">Still have questions?</h3>
            <p className="questions-desc">Our systems and communication lines are fully open to support you.</p>
            <button className="btn-primary sm">Contact us →</button>
          </div>
        </div>
      </section>
    <Footer />
    </div>

  );
}