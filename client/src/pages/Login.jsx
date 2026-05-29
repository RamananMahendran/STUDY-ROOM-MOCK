import { useState } from "react";
import { Link } from "react-router-dom";

// ── Brand Mark ────────────────────────────────────────────────────────────────
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="login-brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7.5" fill="url(#login-brand)" />
      <path d="M6 12 Q10.5 10.5 15.5 11.5 L15.5 22.5 Q10.5 21.5 6 23 Z" fill="white" fillOpacity=".95" />
      <path d="M16.5 11.5 Q21.5 10.5 26 12 L26 23 Q21.5 21.5 16.5 22.5 Z" fill="white" fillOpacity=".72" />
      <line x1="16" y1="11.5" x2="16" y2="22.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33C2.45 15.98 5.48 18 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.45 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.45 2.02.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}

// ── Eye Toggle ────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

// ── Dashboard Mock ────────────────────────────────────────────────────────────
function DashboardMock() {
  const rooms = [
    { icon: "📚", name: "DSA grind night", active: true },
    { icon: "🌙", name: "Late-night DP" },
    { icon: "🧠", name: "Mock interviews" },
    { icon: "📐", name: "JEE physics" },
    { icon: "💻", name: "Pair coding" },
  ];
  const members = [
    { init: "JA", bg: "rgba(165,180,252,0.27)", color: "#a5b4fc" },
    { init: "RK", bg: "rgba(196,181,253,0.27)", color: "#c4b5fd" },
    { init: "PS", bg: "rgba(110,231,183,0.27)", color: "#6ee7b7" },
    { init: "MV", bg: "rgba(252,211,77,0.27)",  color: "#fcd34d" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        aspectRatio: "1.4",
        transform: "perspective(1800px) rotateY(-10deg) rotateX(3deg) rotate(-1deg)",
        transformOrigin: "left top",
      }}
    >
      {/* Floating streak badge */}
      <div
        style={{
          position: "absolute",
          top: -16,
          right: 60,
          zIndex: 10,
          padding: "8px 14px",
          borderRadius: 9999,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          boxShadow: "0 12px 32px rgba(99,102,241,0.45)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          animation: "glassFloat 4s ease-in-out infinite",
        }}
      >
        🔥 +1 day · 14-day streak
      </div>

      {/* Glass card */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(15,15,22,0.7)",
          border: "1px solid var(--border)",
          borderRadius: "20px 4px 20px 20px",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 168,
            padding: "16px 12px",
            background: "rgba(0,0,0,0.2)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 8px 12px", borderBottom:"1px solid var(--border)", marginBottom:8 }}>
            <BrandMark size={20} />
            <span style={{ fontSize:12, fontWeight:700, color:"var(--text)" }}>Study Room</span>
          </div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", color:"var(--text-subtle)", padding:"8px 8px 4px" }}>
            Live rooms
          </div>
          {rooms.map((r) => (
            <div
              key={r.name}
              style={{
                padding: "7px 8px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: r.active ? 600 : 400,
                color: r.active ? "var(--text)" : "var(--text-muted)",
                background: r.active ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))" : "transparent",
              }}
            >
              <span>{r.icon}</span>
              <span style={{ flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</span>
              {r.active && (
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"glassPulse 1.6s ease-in-out infinite", flexShrink:0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ flex:1, padding:"14px 18px", display:"flex", flexDirection:"column", gap:10, minWidth:0 }}>
          {/* Room header */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:18 }}>📚</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>DSA grind night</div>
              <div style={{ fontSize:10, color:"var(--text-muted)" }}>4 in room · code XK4P9R</div>
            </div>
            <div style={{ display:"flex" }}>
              {members.map((m, i) => (
                <div key={m.init} style={{ width:22, height:22, borderRadius:6, background:m.bg, color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, border:"2px solid var(--surface)", marginLeft: i > 0 ? -6 : 0 }}>
                  {m.init}
                </div>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,rgba(99,102,241,0.13),rgba(139,92,246,0.13))", border:"1px solid var(--border)", borderRadius:12, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", color:"var(--accent-text)" }}>Focus · Round 2</div>
            <div style={{ fontSize:38, fontWeight:700, letterSpacing:"-1.2px", fontFamily:"'JetBrains Mono',ui-monospace,monospace", color:"var(--text)", marginTop:2 }}>
              23<span style={{ color:"var(--text-subtle)" }}>:</span>41
            </div>
            <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.08)", marginTop:8, overflow:"hidden" }}>
              <div style={{ height:"100%", width:"40%", background:"linear-gradient(90deg,#6366f1,#8b5cf6)", animation:"glassTimerBar 30s linear infinite" }} />
            </div>
          </div>

          {/* Problem + Chat */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1, minHeight:0 }}>
            <div style={{ padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:10 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", color:"var(--text-subtle)" }}>Problem 47</div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text)", margin:"4px 0 6px" }}>Two Sum II</div>
              <div style={{ fontFamily:"'JetBrains Mono',ui-monospace,monospace", fontSize:10, color:"var(--text-muted)", lineHeight:1.6 }}>
                <div><span style={{ color:"var(--accent-text)" }}>def</span> twoSum(nums, t):</div>
                <div style={{ paddingLeft:12 }}>l, r = 0, len(nums)-1</div>
                <div style={{ paddingLeft:12 }}><span style={{ color:"var(--accent-text)" }}>while</span> l &lt; r:</div>
                <div style={{ paddingLeft:24, opacity:0.5 }}>...</div>
              </div>
            </div>
            <div style={{ padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:10, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", color:"var(--text-subtle)" }}>Chat</div>
              {[
                { init:"RK", color:"#c4b5fd", text:"got it in O(n) :)" },
                { init:"JA", color:"#a5b4fc", text:"two-pointer ftw" },
                { init:"PS", color:"#6ee7b7", text:"moving to #48" },
              ].map((m, i) => (
                <div key={i} style={{ display:"flex", gap:6, fontSize:10, alignItems:"center" }}>
                  <span style={{ color:m.color, fontWeight:700 }}>{m.init}</span>
                  <span style={{ color:"var(--text-muted)" }}>{m.text}</span>
                </div>
              ))}
              <div style={{ marginTop:"auto", fontSize:9, color:"var(--text-subtle)", fontStyle:"italic", animation:"glassPulse 1.6s ease-in-out infinite" }}>MV is typing…</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      data-theme="dark"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflowX: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-sans, 'Inter', system-ui, sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mesh */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, background:`radial-gradient(ellipse 55% 60% at 25% 30%, rgba(99,102,241,0.33) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.33) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 60% 40%, rgba(99,102,241,0.18) 0%, transparent 65%)` }} />
      {/* Grain */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, opacity:0.45, mixBlendMode:"overlay", backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.45'/></svg>")` }} />

      {/* Topbar */}
      <header style={{ position:"relative", zIndex:10, padding:"28px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:10, fontSize:14, fontWeight:700, letterSpacing:"-0.2px", color:"var(--text)", textDecoration:"none" }}>
          <BrandMark size={28} />
          <span>Study Room</span>
        </a>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:9999, background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", fontSize:12, color:"var(--text-muted)" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 10px rgba(16,185,129,0.6)", display:"inline-block" }} />
          <strong style={{ color:"var(--text)", fontWeight:600 }}>25</strong>&nbsp;studying right now
        </div>
      </header>

      {/* Grid */}
      <main style={{ position:"relative", zIndex:5, flex:1, display:"grid", gridTemplateColumns:"1.05fr 0.95fr", gap:0, paddingBottom:48, animation:"friendly-in 220ms cubic-bezier(0.2,0,0,1)" }}>

        {/* Left */}
        <div style={{ padding:"8px 32px 0 64px", display:"flex", flexDirection:"column", minWidth:0 }}>
          {/* Pill */}
          <div style={{ display:"inline-flex", alignSelf:"flex-start", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:9999, background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", fontSize:11, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", color:"var(--accent-text)", marginBottom:18 }}>
            ₹0 to start · free forever for students
          </div>

          {/* Headline */}
          <h1 style={{ margin:0, fontFamily:"'Fraunces', Georgia, serif", fontSize:72, fontWeight:500, letterSpacing:"-3px", lineHeight:0.95, color:"var(--text)", maxWidth:560 }}>
            Study<br />
            <em style={{ fontStyle:"italic", fontWeight:400, background:"linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>together.</em>
          </h1>

          {/* Subhead */}
          <p style={{ margin:"16px 0 0", fontSize:14, lineHeight:1.55, color:"var(--text-muted)", maxWidth:420 }}>
            Synced Pomodoro rooms, shared notes, and 120 placement problems. Made by students in India.
          </p>

          {/* Dashboard mock */}
          <div style={{ position:"relative", marginTop:32, marginLeft:8, flex:1 }}>
            <DashboardMock />
          </div>
        </div>

        {/* Right */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 64px 0 32px" }}>
          <div style={{ position:"relative", width:"100%", maxWidth:420, padding:"32px 32px 26px", background:"rgba(20,20,28,0.6)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"32px 8px 32px 32px", backdropFilter:"blur(40px) saturate(180%)", WebkitBackdropFilter:"blur(40px) saturate(180%)", boxShadow:"0 30px 80px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

            {/* Edge accent */}
            <div aria-hidden="true" style={{ position:"absolute", top:-1, left:-1, width:100, height:4, background:"linear-gradient(90deg, #6366f1, transparent)", borderRadius:"32px 0 0 0" }} />

            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", color:"var(--accent-text)", marginBottom:10 }}>· Sign in</div>

            <h2 style={{ margin:"0 0 6px", fontFamily:"'Fraunces', Georgia, serif", fontSize:32, fontWeight:500, letterSpacing:"-0.8px", lineHeight:1.05, color:"var(--text)" }}>
              Welcome back, <em style={{ fontStyle:"italic", color:"var(--accent-text)" }}>friend.</em>
            </h2>

            <p style={{ margin:"8px 0 22px", fontSize:13, color:"var(--text-muted)" }}>Your room is one click away.</p>

            {/* Streak nudge */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", marginBottom:16, background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)", borderRadius:10, fontSize:12, color:"var(--text-muted)" }}>
              <span style={{ fontSize:16 }}>🔥</span>
              <span>Pick up your <strong style={{ color:"var(--text)", fontWeight:600 }}>13-day streak</strong></span>
              <span style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',ui-monospace,monospace", color:"var(--accent-text)", fontWeight:700 }}>+1 today →</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* Google */}
              <button id="login-google-btn" type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  if (window.addNotification) window.addNotification("Logged in with Google successfully!");
                  window.location.href = "/home"; 
                }}
                style={{ width:"100%", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:10, padding:"13px 16px", borderRadius:10, fontSize:14, fontWeight:600, background:"var(--surface)", color:"var(--text)", border:"1px solid var(--border)", cursor:"pointer", boxShadow:"0 1px 2px rgba(0,0,0,0.04)", transition:"border-color 0.15s, background 0.15s, box-shadow 0.15s", fontFamily:"inherit" }}>
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0", color:"var(--text-subtle)" }}>
                <div style={{ flex:1, height:1, background:"var(--border)" }} />
                <span style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.6px", fontWeight:600 }}>or use email</span>
                <div style={{ flex:1, height:1, background:"var(--border)" }} />
              </div>

              {/* Form */}
              <form style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {/* Email */}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:6 }}>Email</label>
                  <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", fontSize:14, color:"var(--text)", fontFamily:"inherit", outline:"none" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:6 }}>
                    <label style={{ fontSize:11, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase", color:"var(--text-muted)" }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize:12, color:"var(--text-muted)", fontWeight:500, textDecoration:"none" }}>Forgot password?</Link>
                  </div>
                  <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                    <input id="login-password" type={showPw ? "text" : "password"} placeholder="At least 8 characters" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}
                      style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", paddingRight:32, fontSize:14, color:"var(--text)", fontFamily:"inherit", outline:"none" }}
                      onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                    <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPw(v => !v)}
                      style={{ position:"absolute", right:0, width:32, height:32, borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", color:"var(--text-muted)", cursor:"pointer" }}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button id="login-submit-btn" type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.addNotification) window.addNotification("Logged in successfully!");
                    window.location.href = "/home"; // simulate navigation since useNavigate is not imported here or we can use window.location
                  }}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", height:42, padding:"0 24px", borderRadius:12, background:"linear-gradient(135deg, #6366f1, #8b5cf6)", color:"#fff", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700, boxShadow:"0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)", transition:"transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
                >
                  Sign in
                </button>
              </form>

              {/* Google note */}
              <p style={{ margin:"4px 0 0", padding:"10px 12px", background:"var(--surface-2)", borderRadius:8, fontSize:12, color:"var(--text-muted)", lineHeight:1.5, textAlign:"center" }}>
                Signed up with Google? You don't have a password — just use <strong style={{ color:"var(--text)" }}>Continue with Google</strong> above.
              </p>
            </div>

            {/* Switch */}
            <div style={{ marginTop:18, paddingTop:16, borderTop:"1px solid var(--border)", textAlign:"center", fontSize:13, color:"var(--text-muted)" }}>
              New here? <Link to="/signup" style={{ color:"var(--accent-text)", fontWeight:600, textDecoration:"none", marginLeft:4 }}>Create account →</Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes friendly-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glassFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        @keyframes glassPulse { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
        @keyframes glassTimerBar { 0% { width:38%; } 100% { width:42%; } }
        @media (max-width: 900px) {
          main { grid-template-columns: 1fr !important; padding-bottom: 32px !important; }
        }
        @media (max-width: 640px) {
          header { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
