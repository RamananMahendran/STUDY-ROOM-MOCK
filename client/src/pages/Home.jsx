import { useState, useEffect } from "react";
import "./Home.css";

// ── DATA ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Pricing", "Promise", "Changelog"];

const REPLACES = ["Discord", "Notion", "Pomofocus", "LeetCode", "Zoom"];
const REPLACE_COLORS = ["#5865F2", "#ffffff", "#FF4F4F", "#FFA116", "#2D8CFF"];

const STATS = [
  { value: 23, label: "studying now",       sub: "in 8 active rooms",           dot: true },
  { value: 71, label: "students this week", sub: "growing weekly since launch" },
  { value: 89, label: "problems solved",    sub: "today across users" },
  { value: "₹0", label: "to start",         sub: "free forever for students" },
];

const COMPARISON = [
  { feature: "Synced Pomodoro for the group",      sr: true, discord: false,     notion: false,     leetcode: false },
  { feature: "Group chat + voice",                 sr: true, discord: true,      notion: false,     leetcode: false },
  { feature: "Live shared notes",                  sr: true, discord: false,     notion: true,      leetcode: false },
  { feature: "120 interview problems",             sr: true, discord: false,     notion: false,     leetcode: true  },
  { feature: "Pair coding on same editor",         sr: true, discord: false,     notion: false,     leetcode: false },
  { feature: "Topic mastery + readiness score",    sr: true, discord: false,     notion: false,     leetcode: "partial" },
  { feature: "Built for Indian placement",         sr: true, discord: false,     notion: false,     leetcode: false },
  { feature: "Free for students forever",          sr: true, discord: true,      notion: "partial", leetcode: "partial" },
];

const TESTIMONIALS = [
  { text: "Replaced our 12-person Discord server. The synced timer alone is worth it — no one's ever 3 minutes off anymore.", name: "Ananya R.", role: "CSE final year, NIT Trichy",       color: "#e879f9", letter: "A" },
  { text: "I built a study group with strangers from r/IndianAcademia. We're 6 weeks in. Three of us got internship offers.", name: "Priya M.",  role: "Pre-final year, IIIT Hyderabad", color: "#f97316", letter: "P" },
  { text: "Used the 30-Day Placement Sprint. Solved 47 problems in 32 days. Got 3 interviews. Have 1 offer.",                name: "Devika P.", role: "ECE → SDE switch, VIT",          color: "#3b82f6", letter: "D" },
  { text: '" Cracked Razorpay last month. The mock interview mode is brutal in the best way — felt easier than the real thing.', name: "Karthik V.", role: "SDE @ Razorpay",            color: "#a78bfa", letter: "K", featured: true },
  { text: "Pair coding works on flaky Indian wifi. That's the whole review.",                                                 name: "Rohit S.",  role: "Bootcamp grad, self-taught",    color: "#f87171", letter: "R" },
  { text: "My friends and I had been planning to 'study together over discord' for a year. Took us 4 minutes here.",          name: "Aman T.",   role: "BITS Pilani",                   color: "#34d399", letter: "A" },
];

const PRO_FEATURES = [
  { icon: "⏱", title: "Mock Interview Mode",  desc: "45-minute timed sessions, 2–3 random problems, scored debrief and weak-topic breakdown." },
  { icon: "□", title: "Advanced Analytics",    desc: "Topic mastery heatmap, difficulty ceiling, 8-week trend, composite interview-readiness score." },
  { icon: "◆", title: "Pro Study Plans",       desc: "FAANG Prep (45-day), Arrays Mastery (14-day), Weekly Challenge — guided day-by-day sequences." },
  { icon: "⚡", title: "Priority Execution",   desc: "Your runs jump the queue. Every result tagged with a Pro execution chip." },
];

// ── SMALL COMPONENTS ─────────────────────────────────────────────────────────

function CheckIcon({ color = "#4ade80" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="4" fill={color} fillOpacity="0.18" />
      <path d="M4 8l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 5l6 6M11 5l-6 6" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Avatar({ letter, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.42, color: "#fff", flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

function CmpCell({ value }) {
  if (value === true)      return <CheckIcon />;
  if (value === "partial") return <span className="partial-label">partial</span>;
  return <XIcon />;
}

// ── DASHBOARD ────────────────────────────────────────────────────────────

// Fixed: activity array generated once with useMemo — no Math.random() during render
const ACTIVITY_SEED = [3,1,4,2,4,0,3,2,4,3,1,0,2,4,3,2,1,4,0,3,4,2,1,3,2,4,1,0,3,4,2,3,1,4,2];

function Dashboard() {
  const actColors = ["#1e2433","#312e81","#4338ca","#6366f1","#a78bfa"];
  const topics = [
    { name: "Arrays & Strings", pct: 82, color: "#6366f1" },
    { name: "Hash Maps",        pct: 66, color: "#3b82f6" },
    { name: "Trees",            pct: 47, color: "#f59e0b" },
    { name: "Dynamic Prog",     pct: 22, color: "#ef4444" },
  ];
  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2433", borderRadius:14, padding:"18px 20px", width:"100%", maxWidth:420, fontSize:"0.78rem", fontFamily:"'DM Sans', sans-serif" }}>
      {/* header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:"0.68rem", color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>DASHBOARD</div>
          <div style={{ fontSize:"1rem", fontWeight:700, color:"#f1f5f9" }}>Hi, Priya 👋</div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <span style={{ background:"#1c1a0e", border:"1px solid #78350f", color:"#fbbf24", borderRadius:99, padding:"3px 10px", fontSize:"0.72rem", fontWeight:600 }}>🔥 12-day streak</span>
          <span style={{ background:"#0f1f17", border:"1px solid #166534", color:"#4ade80", borderRadius:99, padding:"3px 10px", fontSize:"0.72rem", fontWeight:600 }}>+47 this week</span>
        </div>
      </div>
      {/* stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {[
          { label:"FOCUS THIS WEEK", val:"12h 40m", sub:"+19%" },
          { label:"PROBLEMS SOLVED", val:"47",      sub:"+17 this wk" },
          { label:"ROOMS JOINED",    val:"9",       sub:"3 with friends" },
          { label:"READINESS",       val:"72%",     sub:"Ready: medium" },
        ].map(s => (
          <div key={s.label} style={{ background:"#111827", borderRadius:8, padding:"10px 10px 8px" }}>
            <div style={{ fontSize:"0.6rem", color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:"1rem", fontWeight:700, color:"#f1f5f9", lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:"0.65rem", color:"#6366f1", marginTop:3 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* activity + mastery */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background:"#111827", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:"0.68rem", color:"#9ca3af", fontWeight:600 }}>Activity</span>
            <span style={{ fontSize:"0.65rem", color:"#4b5563" }}>last 6 weeks</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {ACTIVITY_SEED.map((lvl, i) => (
              <div key={i} style={{ width:"100%", paddingBottom:"100%", borderRadius:3, background:actColors[lvl] }} />
            ))}
          </div>
        </div>
        <div style={{ background:"#111827", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:"0.68rem", color:"#9ca3af", fontWeight:600 }}>Topic mastery</span>
            <span style={{ fontSize:"0.65rem", color:"#4b5563" }}>past month ↑</span>
          </div>
          {topics.map(t => (
            <div key={t.name} style={{ marginBottom:7 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:"0.63rem", color:"#9ca3af" }}>{t.name}</span>
                <span style={{ fontSize:"0.63rem", color:"#9ca3af" }}>{t.pct}%</span>
              </div>
              <div style={{ height:4, background:"#1e2433", borderRadius:99 }}>
                <div style={{ height:"100%", width:`${t.pct}%`, background:t.color, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── STUDY ROOM MOCK ───────────────────────────────────────────────────────────

function StudyRoomMock() {
  const [seconds, setSeconds] = useState(14 * 60 + 23);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const mm  = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss  = String(seconds % 60).padStart(2, "0");
  const r   = 46;
  const circ = 2 * Math.PI * r;
  const pct  = seconds / (25 * 60);

  const members = [
    { name:"Priya",  color:"#e879f9" },
    { name:"Aman",   color:"#f97316" },
    { name:"Kartik", color:"#3b82f6" },
    { name:"+2",     color:"#374151" },
  ];
  const msgs = [
    { name:"Priya",  color:"#e879f9", text:"stuck on DP again 😭" },
    { name:"Aman",   color:"#f97316", text:"paste it, lemme look" },
    { name:"Kartik", color:"#3b82f6", text:"top-down first" },
    { name:"",       color:"",        text:"++" },
  ];

  return (
    <div style={{ display:"flex", background:"#0d1117", border:"1px solid #1e2433", borderRadius:14, overflow:"hidden", width:"100%", maxWidth:540, fontFamily:"'DM Sans', sans-serif", fontSize:"0.75rem" }}>
      {/* sidebar */}
      <div style={{ width:130, background:"#080c12", borderRight:"1px solid #1e2433", padding:"14px 0" }}>
        <div style={{ padding:"0 12px 10px", display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:22, height:22, background:"#6366f1", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem" }}>▦</div>
          <span style={{ fontWeight:700, color:"#f1f5f9", fontSize:"0.78rem" }}>Study Room</span>
        </div>
        <div style={{ padding:"0 12px 6px", fontSize:"0.6rem", color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:6 }}>Active Rooms</div>
        {[
          { name:"DSA grind",        count:4, active:true, icon:"🔥" },
          { name:"OS midterm",       count:2 },
          { name:"ML lecture review" },
        ].map(room => (
          <div key={room.name} style={{ padding:"6px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", background:room.active ? "#111827" : "transparent", borderLeft:room.active ? "2px solid #6366f1" : "2px solid transparent", cursor:"pointer" }}>
            <span style={{ color:room.active ? "#f1f5f9" : "#6b7280", fontSize:"0.72rem" }}>
              {room.icon && <span style={{ marginRight:4 }}>{room.icon}</span>}{room.name}
            </span>
            {room.count && <span style={{ background:room.active ? "#6366f1" : "#1e2433", color:room.active ? "#fff" : "#9ca3af", borderRadius:99, padding:"1px 6px", fontSize:"0.62rem" }}>{room.count}</span>}
          </div>
        ))}
        <div style={{ padding:"8px 12px", color:"#4b5563", fontSize:"0.68rem", marginTop:4 }}>+ new room</div>
      </div>
      {/* timer */}
      <div style={{ flex:1, borderRight:"1px solid #1e2433", display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 10px" }}>
        <div style={{ fontSize:"0.6rem", color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2 }}>DSA grind</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <span style={{ background:"#0f1f17", color:"#4ade80", border:"1px solid #166534", borderRadius:99, padding:"2px 8px", fontSize:"0.62rem", fontWeight:600 }}>● LIVE · 4</span>
          <span style={{ color:"#6366f1", fontSize:"0.62rem" }}>STUDYING</span>
          <div style={{ display:"flex", marginLeft:4 }}>
            {members.map((m, i) => (
              <div key={i} style={{ width:20, height:20, borderRadius:"50%", background:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.55rem", fontWeight:700, color:"#fff", marginLeft:i > 0 ? -5 : 0, border:"1.5px solid #080c12" }}>{m.name[0]}</div>
            ))}
          </div>
        </div>
        <div style={{ fontSize:"0.58rem", color:"#4b5563", marginBottom:8 }}>FOCUS · ROUND 3 OF 4</div>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} stroke="#1e2433" strokeWidth="6" fill="none" />
          <circle cx="55" cy="55" r={r} stroke="#6366f1" strokeWidth="6" fill="none"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round" transform="rotate(-90 55 55)"
            style={{ transition:"stroke-dashoffset 1s linear" }} />
          <text x="55" y="51" textAnchor="middle" fill="#f1f5f9" fontSize="18" fontWeight="800" fontFamily="DM Sans">{mm}:{ss}</text>
          <text x="55" y="65" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="DM Sans">everyone synced</text>
        </svg>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <button style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:8, padding:"6px 16px", fontSize:"0.72rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Pause</button>
          <button style={{ background:"transparent", color:"#9ca3af", border:"1px solid #1e2433", borderRadius:8, padding:"6px 14px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit" }}>Skip break</button>
        </div>
      </div>
      {/* chat */}
      <div style={{ width:140, display:"flex", flexDirection:"column", padding:"14px 10px" }}>
        <div style={{ fontSize:"0.6rem", color:"#4b5563", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>CHAT</div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map((m, i) => (
            <div key={i}>
              {m.name && (
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:m.color, flexShrink:0 }} />
                  <span style={{ fontSize:"0.65rem", fontWeight:600, color:"#9ca3af" }}>{m.name}</span>
                </div>
              )}
              <div style={{ fontSize:"0.68rem", color:"#6b7280", paddingLeft:m.name ? 19 : 0 }}>{m.text}</div>
            </div>
          ))}
        </div>
        <input placeholder="type a message..." readOnly style={{ marginTop:10, background:"#111827", border:"1px solid #1e2433", borderRadius:6, padding:"5px 8px", color:"#9ca3af", fontSize:"0.65rem", outline:"none", width:"100%", fontFamily:"inherit" }} />
      </div>
    </div>
  );
}

// ── CODE EDITOR MOCK ──────────────────────────────────────────────────────────

function CodeEditorMock() {
  const lines = [
    { n:1, code:[{t:"kw",v:"function "},{t:"fn",v:"twoSum"},{t:"pl",v:"("},{t:"id",v:"nums"},{t:"pl",v:", "},{t:"id",v:"target"},{t:"pl",v:") {"}] },
    { n:2, code:[{t:"sp",v:"  "},{t:"kw",v:"const "},{t:"id",v:"seen"},{t:"pl",v:" = "},{t:"kw",v:"new "},{t:"fn",v:"Map"},{t:"pl",v:"();"}] },
    { n:3, code:[{t:"sp",v:"  "},{t:"kw",v:"for "},{t:"pl",v:"("},{t:"kw",v:"let "},{t:"id",v:"i"},{t:"pl",v:" = 0; "},{t:"id",v:"i"},{t:"pl",v:" < "},{t:"id",v:"nums.length"},{t:"pl",v:"; "},{t:"id",v:"i"},{t:"pl",v:"++) {"}] },
    { n:4, code:[{t:"sp",v:"    "},{t:"kw",v:"const "},{t:"id",v:"diff"},{t:"pl",v:" = "},{t:"id",v:"target"},{t:"pl",v:" - "},{t:"id",v:"nums[i]"},{t:"pl",v:";"}] },
    { n:5, code:[{t:"sp",v:"    "},{t:"kw",v:"if "},{t:"pl",v:"("},{t:"id",v:"seen.has"},{t:"pl",v:"("},{t:"id",v:"diff"},{t:"pl",v:")) "},{t:"kw",v:"return "},{t:"pl",v:"["},{t:"id",v:"seen.get"},{t:"pl",v:"("},{t:"id",v:"diff"},{t:"pl",v:"), "},{t:"id",v:"i"},{t:"pl",v:"];"}] },
    { n:6, code:[{t:"sp",v:"    "},{t:"id",v:"seen.set"},{t:"pl",v:"("},{t:"id",v:"nums[i]"},{t:"pl",v:", "},{t:"id",v:"i"},{t:"pl",v:");"}] },
    { n:7, code:[{t:"sp",v:"  "},{t:"pl",v:"}"}] },
    { n:8, code:[{t:"sp",v:"  "},{t:"kw",v:"return "},{t:"pl",v:"[];"}] },
    { n:9, code:[{t:"pl",v:"}"}] },
  ];
  const colors = { kw:"#c084fc", fn:"#60a5fa", id:"#e2e8f0", pl:"#94a3b8", sp:"" };

  return (
    <div style={{ background:"#0d1117", border:"1px solid #1e2433", borderRadius:14, overflow:"hidden", width:"100%", maxWidth:560, fontFamily:"'DM Sans', sans-serif" }}>
      {/* tabs */}
      <div style={{ borderBottom:"1px solid #1e2433", padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ background:"#0f2a1a", color:"#4ade80", border:"1px solid #166534", borderRadius:4, padding:"2px 8px", fontSize:"0.65rem", fontWeight:700 }}>EASY</span>
        <span style={{ color:"#4b5563", fontSize:"0.72rem" }}>#1</span>
        <span style={{ color:"#4b5563", fontSize:"0.72rem", marginLeft:"auto" }}>52% accept</span>
        {["solution.js","tests.js"].map((tab, i) => (
          <button key={tab} style={{ background:i===0?"#111827":"transparent", color:i===0?"#f1f5f9":"#4b5563", border:"none", borderBottom:i===0?"2px solid #6366f1":"2px solid transparent", padding:"4px 12px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit" }}>{tab}</button>
        ))}
        <span style={{ color:"#4b5563", fontSize:"0.72rem", padding:"4px 12px" }}>JavaScript</span>
        <button style={{ background:"#166534", color:"#4ade80", border:"none", borderRadius:6, padding:"4px 14px", fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>▶ Run</button>
      </div>
      {/* code */}
      <div style={{ padding:"14px 0", background:"#080c12", fontFamily:"monospace", fontSize:"0.72rem", lineHeight:1.7 }}>
        {lines.map(l => (
          <div key={l.n} style={{ display:"flex", paddingLeft:8 }}>
            <span style={{ width:24, color:"#374151", userSelect:"none", textAlign:"right", marginRight:12, flexShrink:0 }}>{l.n}</span>
            <span>{l.code.map((seg, i) => <span key={i} style={{ color:colors[seg.t]||"#e2e8f0" }}>{seg.v}</span>)}</span>
          </div>
        ))}
      </div>
      {/* pair coding */}
      <div style={{ borderTop:"1px solid #1e2433", padding:"8px 16px", background:"#0d1117", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:"#f97316" }} />
        <span style={{ fontSize:"0.72rem", color:"#9ca3af" }}>Pair coding with <span style={{ color:"#f97316", fontWeight:700 }}>Aman</span></span>
      </div>
      {/* output */}
      <div style={{ borderTop:"1px solid #1e2433", padding:"10px 16px", background:"#080c12" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:"0.7rem", color:"#6b7280" }}>Output</span>
            <span style={{ color:"#4ade80", fontSize:"0.7rem", fontWeight:600 }}>● All tests passed</span>
          </div>
          <span style={{ fontSize:"0.65rem", color:"#374151" }}>42ms · 11.4MB</span>
        </div>
        <div style={{ color:"#4ade80", fontSize:"0.68rem", fontFamily:"monospace" }}>✓ test_basic (3ms)</div>
        <div style={{ color:"#4ade80", fontSize:"0.68rem", fontFamily:"monospace" }}>✓ test_negatives (2ms)</div>
      </div>
    </div>
  );
}

// ── PRICING PRO SECTION ───────────────────────────────────────────────────────

function PricingProSection() {
  return (
    <section className="pricing-pro-section">
      {/* page-level glows behind card */}
      <div className="hero-glow" style={{ width:500, height:400, background:"#1e3a5f", top:"10%", right:"5%", opacity:0.3 }} />
      <div className="hero-glow" style={{ width:350, height:350, background:"#4c1d95", bottom:"5%", left:"10%", opacity:0.15 }} />

      <div className="pricing-pro-card">
        {/* card inner glows */}
        <div className="pricing-pro-glow" style={{ width:400, height:300, background:"#1e40af", top:"-20%", right:"-5%", opacity:0.25 }} />
        <div className="pricing-pro-glow" style={{ width:300, height:300, background:"#6d28d9", bottom:"-20%", left:"30%", opacity:0.12 }} />

        {/* badge */}
        <div className="pricing-pro-badge">
          <span className="pricing-pro-badge-dot" />
          CODING PRO · LIVE NOW
        </div>

        {/* top: heading + right copy */}
        <div className="pricing-pro-top">
          <h2 className="pricing-pro-heading">
            The paid layer for{" "}
            <span className="italic">people who are serious</span>{" "}
            about Friday's interview.
          </h2>
          <div className="pricing-pro-right">
            <p className="pricing-pro-desc">
              Study rooms stay free forever. Coding Pro is the optional upgrade for users grinding toward placement.{" "}
              <strong>₹199/month</strong> for the first 100 founders, locked forever.
            </p>
            <div className="founder-badge">
              🔥 99 of 100 founder slots left
            </div>
          </div>
        </div>

        {/* 4 feature cards */}
        <div className="pricing-pro-features">
          {PRO_FEATURES.map(f => (
            <div key={f.title} className="pro-feature-card">
              <div className="pro-feature-icon">{f.icon}</div>
              <div>
                <div className="pro-feature-title">{f.title}</div>
                <div className="pro-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="pricing-pro-ctas">
          <button className="btn-primary lg">See Pricing →</button>
          <button className="btn-outline lg">Try free first →</button>
        </div>
      </div>
    </section>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [studentCount] = useState(23);

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:"#060810", color:"#e2e8f0", minHeight:"100vh", overflowX:"hidden" }}>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <div className="navbar-logo-icon">▦</div>
            <span className="navbar-logo-text">Study Room</span>
          </a>
          <div className="navbar-links">
            {NAV_LINKS.map((l, i) => (
              <span key={l} className={`nav-link${i === 0 ? " active" : ""}`}>{l}</span>
            ))}
          </div>
          <div className="navbar-actions">
            <button className="btn-outline sm">Log in</button>
            <button className="btn-primary sm">Get started →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" style={{ width:500, height:500, background:"#3730a3", top:"10%", left:"15%", opacity:0.25 }} />
        <div className="hero-glow" style={{ width:400, height:400, background:"#7c3aed", top:"30%", right:"10%", opacity:0.15 }} />
        <div className="hero-glow" style={{ width:300, height:300, background:"#1d4ed8", bottom:"10%", left:"30%", opacity:0.12 }} />

        <div className="hero-content">
          <div className="hero-badge fade-in">
            <span className="hero-badge-dot" />
            {studentCount} students studying right now
          </div>
          <h1 className="hero-title fade-in-2">
            <span className="hero-title-line1">One app for studying</span>
            <span className="hero-title-line2">together</span>
            <span className="hero-title-line3">and shipping placements.</span>
          </h1>
          <p className="hero-sub fade-in-3">
            Stop juggling Discord, Notion, Pomofocus, and LeetCode. Study Room puts your group, your timer, your notes, and 120 interview problems into a single tab.{" "}
            <strong>Free for students. Forever.</strong>
          </p>
          <div className="hero-ctas fade-in-4">
            <button className="btn-primary lg">Start studying free →</button>
            <button className="btn-outline lg">See it in action ▶</button>
          </div>
          <p className="hero-fine">No credit card · Google or email · 3 students joined today</p>
        </div>
      </section>

      {/* ── REPLACES BAR ── */}
      <div className="replaces-bar">
        <span className="replaces-label">REPLACES</span>
        {REPLACES.map((r, i) => (
          <span key={r} className="replaces-item">
            <span className="replaces-dot" style={{ background: REPLACE_COLORS[i] }} />
            {r}
          </span>
        ))}
      </div>

      {/* ── HERO CODE EDITOR ── */}
      <section className="code-hero-section">
        <CodeEditorMock />
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value-row">
                {s.dot && <span className="stat-live-dot" />}
                <span className="stat-value">{s.value}</span>
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PRODUCT ── */}
      <section className="product-section">
        <div className="section-tag">THE PRODUCT</div>
        <h2 className="product-heading">
          Built for how students <span className="italic">actually</span> study.
        </h2>
        <p className="product-sub">
          Not a Discord server with extra steps. Not a Notion template. A real product, designed for the messy reality of group study + interview grind.
        </p>
      </section>

      {/* ── FEATURE: ROOM ── */}
      <section className="feature-section">
        <div className="feature-row">
          <div className="feature-col-text">
            <div className="feature-eyebrow">ROOM</div>
            <h3 className="feature-heading">
              Your group, <span className="italic">always in flow.</span>
            </h3>
            <p className="feature-body">
              Pomodoro that ticks for everyone at the same second. Group chat, voice, files, and a shared notepad in the same view. Share a 6-character code and your friends are inside in 4 seconds.
            </p>
            {["Synced timers — no one is 3 minutes ahead", "Voice without leaving the tab", "Live notepad everyone types in"].map(item => (
              <div key={item} className="check-row">
                <CheckIcon color="#6366f1" />
                <span className="check-label">{item}</span>
              </div>
            ))}
          </div>
          <div className="feature-col-visual">
            <StudyRoomMock />
          </div>
        </div>
      </section>

      {/* ── FEATURE: CODE ── */}
      <section className="feature-section" style={{ paddingTop: 20 }}>
        <div className="feature-row reverse">
          <div className="feature-col-text">
            <div className="feature-eyebrow">CODE</div>
            <h3 className="feature-heading">
              120 problems, <span className="italic">live execution.</span>
            </h3>
            <p className="feature-body">
              JavaScript, Python, C, C++, Java. Ship code, see results in 50ms. Pair with a friend on the same editor, race the daily challenge, climb the leaderboard. The whole free tier is genuinely useful.
            </p>
            {["Live execution in 5 languages", "Pair coding on the same editor", "Daily challenge + leaderboard"].map(item => (
              <div key={item} className="check-row">
                <CheckIcon color="#6366f1" />
                <span className="check-label">{item}</span>
              </div>
            ))}
          </div>
          <div className="feature-col-visual">
            <CodeEditorMock />
          </div>
        </div>
      </section>

      {/* ── FEATURE: PROGRESS ── */}
      <section className="feature-section" style={{ paddingTop: 20 }}>
        <div className="feature-row">
          <div className="feature-col-text">
            <div className="feature-eyebrow">PROGRESS</div>
            <h3 className="feature-heading">
              Know exactly <span className="italic">where you stand.</span>
            </h3>
            <p className="feature-body">
              Streaks, focus minutes, topic mastery, interview readiness. Built so you can answer 'am I ready for this Friday?' instead of guessing. Pro adds a 45-min mock interview mode with a scored debrief.
            </p>
            {["Streak + weekly focus minutes", "Topic-by-topic mastery heatmap", "Readiness score (Pro)"].map(item => (
              <div key={item} className="check-row">
                <CheckIcon color="#6366f1" />
                <span className="check-label">{item}</span>
              </div>
            ))}
          </div>
          <div className="feature-col-visual">
            <Dashboard />
          </div>
        </div>
      </section>

      {/* ── PRICING PRO ── */}
      <PricingProSection />

      {/* ── WHY CONSOLIDATE ── */}
      <section className="consolidate-section">
        <div className="consolidate-inner">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="section-tag">WHY CONSOLIDATE</div>
            <h2 className="consolidate-heading">
              Stop paying <span className="italic">four tabs</span> of attention tax.
            </h2>
            <p style={{ color:"#6b7280", fontSize:"0.88rem", maxWidth:480, margin:"0 auto" }}>
              Each of these is great at one thing. Glue them together and you spend 20% of your study session just switching apps.
            </p>
          </div>

          <div className="cmp-table">
            {/* header row */}
            <div className="cmp-row cmp-header">
              <div className="cmp-cell feature cmp-header-label">FEATURE</div>
              <div className="cmp-cell sr" style={{ flexDirection:"column", gap:2 }}>
                <div className="cmp-header-you">YOU ARE HERE</div>
                <div className="cmp-header-name">Study Room</div>
              </div>
              {["Discord","Notion","LeetCode"].map(h => (
                <div key={h} className="cmp-cell cmp-header-other">{h}</div>
              ))}
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className="cmp-row">
                <div className="cmp-cell feature">{row.feature}</div>
                <div className="cmp-cell sr"><CmpCell value={row.sr} /></div>
                <div className="cmp-cell"><CmpCell value={row.discord} /></div>
                <div className="cmp-cell"><CmpCell value={row.notion} /></div>
                <div className="cmp-cell"><CmpCell value={row.leetcode} /></div>
              </div>
            ))}
          </div>
          <p className="cmp-footnote">
            You can keep using all of those. But if you've ever opened Discord at 11pm to start a study session and ended up doomscrolling memes — yeah.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="section-tag">STUDENTS, REAL ONES</div>
            <h2 style={{ fontWeight:800, fontSize:"clamp(2rem, 5vw, 3rem)", letterSpacing:"-0.03em", color:"#f1f5f9", lineHeight:1.1, marginBottom:14 }}>
              Built with the people <span style={{ fontFamily:"'DM Serif Display', serif", fontStyle:"italic", fontWeight:400 }}>using it.</span>
            </h2>
            <p style={{ color:"#6b7280", fontSize:"0.88rem" }}>
              Quotes from our Discord, Twitter, and feedback form. Last names trimmed for privacy.
            </p>
          </div>
          <div className="tgrid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`tcard${t.featured ? " featured" : ""}`}>
                {t.featured && <div className="tcard-story-label">★ STORY WE LOVE</div>}
                <p className="tcard-text">{t.text}</p>
                <div className="tcard-footer">
                  <Avatar letter={t.letter} color={t.color} size={34} />
                  <div>
                    <div className="tcard-name">{t.name}</div>
                    <div className="tcard-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="hero-glow" style={{ width:600, height:400, background:"#4338ca", top:"0%", left:"50%", transform:"translateX(-50%)", opacity:0.18 }} />
        <div className="hero-glow" style={{ width:400, height:300, background:"#7c3aed", bottom:"0%", right:"20%", opacity:0.10 }} />
        <div className="final-cta-content">
          <h2 className="final-cta-heading">
            Pull your group<br />
            <span className="gradient">into one tab.</span>
          </h2>
          <p className="final-cta-sub">
            You're 4 minutes away from a synced study room with your friends, a Pomodoro that ticks for everyone, and 120 problems waiting.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary lg">Start studying free →</button>
            <button className="btn-outline lg">Or sign up with email</button>
          </div>
          <p className="final-cta-fine">No credit card · No email verification · 3 students joined today</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">▦</div>
              <span className="footer-brand-name">Study Room</span>
            </div>
            <p className="footer-brand-desc">
              One tab for studying together and shipping placements. Free for students forever.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot" />
              All systems operational
            </div>
          </div>
          <div>
            <div className="footer-col-label">PRODUCT</div>
            {["Study rooms","Coding ground","Mock interviews","Pricing"].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <div className="footer-col-label">RESOURCES</div>
            {["30-day Placement Sprint","FAANG Prep plan","Promise","Changelog"].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Study Room · Built by Jainth A in Chennai</span>
          <span className="footer-made">Made with 🍕 and <em>way too many Pomodoros</em></span>
        </div>
      </footer>

    </div>
  );
}