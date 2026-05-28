import { useState } from "react";
import { Link } from "react-router-dom";

// ── Brand Mark ────────────────────────────────────────────────────────────────
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="fp-brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7.5" fill="url(#fp-brand)" />
      <path d="M6 12 Q10.5 10.5 15.5 11.5 L15.5 22.5 Q10.5 21.5 6 23 Z" fill="white" fillOpacity=".95" />
      <path d="M16.5 11.5 Q21.5 10.5 26 12 L26 23 Q21.5 21.5 16.5 22.5 Z" fill="white" fillOpacity=".72" />
      <line x1="16" y1="11.5" x2="16" y2="22.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── FORGOT PASSWORD PAGE ──────────────────────────────────────────────────────
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

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
      {/* ── Mesh backdrop ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 55% 60% at 25% 30%, rgba(99,102,241,0.33) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 90%, rgba(139,92,246,0.33) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 40%, rgba(99,102,241,0.18) 0%, transparent 65%)
          `,
        }}
      />

      {/* ── Grain overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.45,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.45'/></svg>")`,
        }}
      />

      {/* ── Topbar ── */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.2px",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          <BrandMark size={28} />
          <span>Study Room</span>
        </a>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 11px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px rgba(16,185,129,0.6)",
              display: "inline-block",
            }}
          />
          <strong style={{ color: "var(--text)", fontWeight: 600 }}>25</strong>&nbsp;studying right now
        </div>
      </header>

      {/* ── Grid ── */}
      <main
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 0,
          paddingBottom: 48,
          animation: "friendly-in 220ms cubic-bezier(0.2,0,0,1)",
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            padding: "8px 32px 0 64px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Pill */}
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "var(--accent-text)",
              marginBottom: 18,
            }}
          >
            ₹0 to start · free forever for students
          </div>

          {/* Headline */}
          <h1
            style={{
              margin: 0,
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-3px",
              lineHeight: 0.95,
              color: "var(--text)",
              maxWidth: 560,
            }}
          >
            Study<br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              together.
            </em>
          </h1>

          {/* Subhead */}
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--text-muted)",
              maxWidth: 420,
            }}
          >
            Synced Pomodoro rooms, shared notes, and 120 placement problems. Made by students in India.
          </p>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 64px 0 32px",
          }}
        >
          {/* Card */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              padding: "32px 32px 26px",
              background: "rgba(20,20,28,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "32px 8px 32px 32px",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              boxShadow: "0 30px 80px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top-left gradient edge */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -1,
                left: -1,
                width: 100,
                height: 4,
                background: "linear-gradient(90deg, #6366f1, transparent)",
                borderRadius: "32px 0 0 0",
              }}
            />

            {/* Eyebrow */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "var(--accent-text)",
                marginBottom: 10,
              }}
            >
              · Reset password
            </div>

            {/* Heading */}
            <h2
              style={{
                margin: "0 0 6px",
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.8px",
                lineHeight: 1.05,
                color: "var(--text)",
              }}
            >
              Forgot your{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent-text)" }}>
                password?
              </em>
            </h2>

            {/* Sub-heading */}
            <p
              style={{
                margin: "8px 0 22px",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Enter your email and we'll send a reset link.
            </p>

            {/* Form stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sent ? (
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 10,
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  ✉️ Check your inbox! We sent a reset link to{" "}
                  <strong style={{ color: "var(--text)" }}>{email}</strong>.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {/* Email field */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: 6,
                      }}
                    >
                      Email
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
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
                          borderColor: email ? "rgba(99,102,241,0.7)" : "var(--border)",
                          boxShadow: email ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(99,102,241,0.7)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                        }}
                        onBlur={(e) => {
                          if (!email) {
                            e.target.style.borderColor = "var(--border)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    id="forgot-submit-btn"
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      width: "100%",
                      height: 42,
                      padding: "0 24px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 14,
                      fontWeight: 700,
                      boxShadow: "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
                    }}
                  >
                    Send reset link
                  </button>
                </form>
              )}

              {/* Google note */}
              <p
                style={{
                  margin: "4px 0 0",
                  padding: "10px 12px",
                  background: "var(--surface-2)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Signed up with Google? You don't have a password — just use{" "}
                <a
                  href="/login"
                  style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "none" }}
                >
                  "Continue with Google"
                </a>{" "}
                above.
              </p>
            </div>

            {/* Switch / back link */}
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
                textAlign: "center",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              <Link
                to="/login"
                style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "none" }}
              >
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Keyframe for slide-in (matches original) ── */}
      <style>{`
        @keyframes friendly-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .fp-grid { grid-template-columns: 1fr !important; padding-bottom: 32px !important; }
          .fp-left { padding: 8px 32px 0 !important; align-items: center; text-align: center; }
          .fp-right { padding: 0 32px !important; justify-content: center !important; }
        }
        @media (max-width: 640px) {
          .fp-topbar { padding: 20px !important; }
          .fp-chip { display: none !important; }
          .fp-left { padding: 0 20px !important; }
          .fp-right { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  );
}
