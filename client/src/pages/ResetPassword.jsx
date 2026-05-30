import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// ── Brand Mark ─────────────────────────────────────────────────────────────────
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="rp-brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7.5" fill="url(#rp-brand)" />
      <path d="M6 12 Q10.5 10.5 15.5 11.5 L15.5 22.5 Q10.5 21.5 6 23 Z" fill="white" fillOpacity=".95" />
      <path d="M16.5 11.5 Q21.5 10.5 26 12 L26 23 Q21.5 21.5 16.5 22.5 Z" fill="white" fillOpacity=".72" />
      <line x1="16" y1="11.5" x2="16" y2="22.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

// ── Password strength helper ────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, Math.ceil(score / 1.25));
};
const strengthColors = [
  "rgba(255,255,255,0.10)",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

// ── RESET PASSWORD PAGE ────────────────────────────────────────────────────────
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/auth/resetpassword/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed.");

      // Save token & user — user is automatically logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        username: data.username,
        email: data.email,
        userId: data.id,
        streak: data.streak || 0,
      }));

      setDone(true);
      // Redirect to dashboard after a brief moment
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: "var(--text)",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const focusIn  = (e) => { e.target.style.borderColor = "rgba(99,102,241,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; };
  const focusOut = (e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

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
      {/* Mesh backdrop */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 55% 60% at 25% 30%, rgba(99,102,241,0.33) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.33) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 60% 40%, rgba(99,102,241,0.18) 0%, transparent 65%)` }} />
      {/* Grain overlay */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.45, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.45'/></svg>")` }} />

      {/* Topbar */}
      <header style={{ position: "relative", zIndex: 10, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, letterSpacing: "-0.2px", color: "var(--text)", textDecoration: "none" }}>
          <BrandMark size={28} /><span>Study Room</span>
        </a>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 9999, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.6)", display: "inline-block" }} />
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>25</strong>&nbsp;studying right now
        </div>
      </header>

      {/* Main grid */}
      <main style={{ position: "relative", zIndex: 5, flex: 1, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 0, paddingBottom: 48, animation: "friendly-in 220ms cubic-bezier(0.2,0,0,1)" }}>
        {/* Left column */}
        <div style={{ padding: "8px 32px 0 64px", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--accent-text)", marginBottom: 18 }}>
            ₹0 to start · free forever for students
          </div>
          <h1 style={{ margin: 0, fontFamily: "'Fraunces', Georgia, serif", fontSize: 72, fontWeight: 500, letterSpacing: "-3px", lineHeight: 0.95, color: "var(--text)", maxWidth: 560 }}>
            Study<br />
            <em style={{ fontStyle: "italic", fontWeight: 400, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>together.</em>
          </h1>
          <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--text-muted)", maxWidth: 420 }}>
            Synced Pomodoro rooms, shared notes, and 120 placement problems. Made by students in India.
          </p>

          {/* Security tips */}
          <div style={{ marginTop: 40, maxWidth: 380 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 14 }}>Password tips</div>
            {[
              { icon: "🔐", tip: "Use at least 8 characters" },
              { icon: "💪", tip: "Mix uppercase, numbers & symbols" },
              { icon: "🚫", tip: "Don't reuse passwords from other sites" },
              { icon: "🔒", tip: "Consider using a password manager" },
            ].map(({ icon, tip }) => (
              <div key={tip} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)" }}>
                <span style={{ fontSize: 16 }}>{icon}</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px 0 32px" }}>
          {/* Card */}
          <div style={{ position: "relative", width: "100%", maxWidth: 420, padding: "32px 32px 26px", background: "rgba(20,20,28,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px 8px 32px 32px", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", boxShadow: "0 30px 80px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            {/* Top-left gradient edge */}
            <div aria-hidden="true" style={{ position: "absolute", top: -1, left: -1, width: 100, height: 4, background: "linear-gradient(90deg, #6366f1, transparent)", borderRadius: "32px 0 0 0" }} />

            {done ? (
              /* ── Success State ── */
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ margin: "0 0 8px", fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.6px", color: "var(--text)" }}>
                  Password <em style={{ fontStyle: "italic", color: "var(--accent-text)" }}>updated!</em>
                </h2>
                <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  You're now logged in. Redirecting to your dashboard…
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 200, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", animation: "loadBar 2s linear forwards" }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Eyebrow */}
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--accent-text)", marginBottom: 10 }}>
                  · Set new password
                </div>

                {/* Heading */}
                <h2 style={{ margin: "0 0 6px", fontFamily: "'Fraunces', Georgia, serif", fontSize: 32, fontWeight: 500, letterSpacing: "-0.8px", lineHeight: 1.05, color: "var(--text)" }}>
                  Choose a new{" "}
                  <em style={{ fontStyle: "italic", color: "var(--accent-text)" }}>password.</em>
                </h2>
                <p style={{ margin: "8px 0 22px", fontSize: 13, color: "var(--text-muted)" }}>
                  Must be at least 8 characters. Make it strong.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* New Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                      New Password
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        id="reset-password"
                        type={showPw ? "text" : "password"}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ ...inputStyle, paddingRight: 40 }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                      <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPw(v => !v)}
                        style={{ position: "absolute", right: 0, width: 36, height: 36, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <EyeIcon open={showPw} />
                      </button>
                    </div>
                    {/* Password strength */}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>8 or more characters</p>
                        {password && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: strengthColors[strength], transition: "color 0.3s" }}>
                            {strengthLabels[strength]}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginTop: 8 }}>
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} style={{ height: 3, borderRadius: 99, background: password && strength >= level ? strengthColors[strength] : "rgba(255,255,255,0.10)", transition: "background 0.35s cubic-bezier(0.4,0,0.2,1)" }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                      Confirm Password
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        id="reset-confirm-password"
                        type={showConfirmPw ? "text" : "password"}
                        placeholder="Repeat your new password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          ...inputStyle,
                          paddingRight: 40,
                          borderColor: confirmPassword && confirmPassword !== password ? "rgba(239,68,68,0.6)" : "var(--border)",
                          boxShadow: confirmPassword && confirmPassword !== password ? "0 0 0 3px rgba(239,68,68,0.12)" : "none",
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                      <button type="button" aria-label="Toggle confirm password visibility" onClick={() => setShowConfirmPw(v => !v)}
                        style={{ position: "absolute", right: 0, width: 36, height: 36, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <EyeIcon open={showConfirmPw} />
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p style={{ margin: "6px 0 0", fontSize: 12, color: "#f87171" }}>Passwords don't match</p>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, fontSize: 13, color: "#f87171", lineHeight: 1.5 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    id="reset-submit-btn"
                    type="submit"
                    disabled={loading}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      width: "100%", height: 44, padding: "0 24px", borderRadius: 12,
                      background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                      boxShadow: "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                      transition: "transform 0.15s, box-shadow 0.15s, background 0.2s",
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.18)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
                  >
                    {loading ? "Resetting…" : "Reset my password"}
                  </button>
                </form>
              </>
            )}

            {/* Back to login */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <Link to="/login" style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "none" }}>
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes friendly-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loadBar { from { width: 0%; } to { width: 100%; } }
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
