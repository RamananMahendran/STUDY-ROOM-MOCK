import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IcoDashboard  = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IcoHeadphones = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcoCode       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
const IcoZap        = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const IcoUsers      = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
const IcoBar        = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>;
const IcoGift       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>;
const IcoLogout     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>;
const IcoChevron    = ({s=13, rotate="0"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{transition:"transform var(--dur-fast)", transform:`rotate(${rotate}deg)`}}><path d="m6 9 6 6 6-6"/></svg>;
const IcoLock       = ({s=7})  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoSearch     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus       = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IcoMsg        = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>;
const IcoBookOpen   = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;
const IcoTimer      = ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;
const IcoLogIn      = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>;
const IcoUsersLg    = ({s=36}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",      label: "Home",         Icon: IcoDashboard,  path: "/home"  },
  { id: "rooms",     label: "Rooms",        Icon: IcoHeadphones, path: "/rooms" },
  { id: "practice",  label: "Practice",     Icon: IcoCode,       chevron: true  },
  { id: "contests",  label: "Contests",     Icon: IcoZap,        soon: true     },
  { id: "community", label: "Community",    Icon: IcoUsers                      },
  { id: "profile",   label: "Profile",      Icon: IcoBar                        },
  { id: "refer",     label: "Refer & earn", Icon: IcoGift                       },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav }) {
  return (
    <div
      className="flex-shrink-0 h-full flex flex-col"
      style={{ width: 220, backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 flex-shrink-0"
        style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <IcoBookOpen s={13} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.3px" }}>
          Study Room
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "10px 8px", gap: 1 }}>
        {NAV_ITEMS.map(({ id, label, Icon, chevron, soon, path }) => {
          const isActive = active === id;
          return (
            <div key={id} style={{ position: "relative" }}>
              <button
                aria-label={label}
                onClick={() => onNav(id, path)}
                className="flex items-center w-full text-left cursor-pointer"
                style={{
                  gap: 10, padding: "7px 10px", borderRadius: 8, border: "none",
                  fontSize: 13, position: "relative",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
                  transition: "background-color var(--dur-fast), color var(--dur-fast)",
                  fontFamily: "inherit",
                }}
              >
                <Icon s={15} />
                <span style={{ flex: "1 1 0%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {label}
                </span>
                {chevron && <IcoChevron s={13} rotate="-90" />}
              </button>
              {soon && (
                <span
                  className="absolute flex items-center gap-1 pointer-events-none"
                  style={{
                    top: 6, right: 6, fontSize: 8, fontWeight: 800, letterSpacing: "0.4px",
                    padding: "1px 5px", borderRadius: 10,
                    backgroundColor: "var(--surface-2)", border: "1px solid var(--border)",
                    color: "var(--text-subtle)",
                  }}
                >
                  <IcoLock s={7} /> SOON
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom – user */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ borderTop: "1px solid var(--border)", padding: "10px 12px", gap: 8 }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <img
            alt="Mayur K S"
            src="https://lh3.googleusercontent.com/a/ACg8ocJOHQ3CBE3KjE6jm37Rh6DZ1INAG8-i1M7xZZNfvCYrlZHgTg=s96-c"
            style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, objectFit: "cover" }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Mayur K S
            </div>
          </div>
          {/* Dark-mode toggle */}
          <button
            title="Switch to light mode"
            className="flex-shrink-0 flex items-center cursor-pointer"
            style={{ width: 40, height: 22, borderRadius: 99, border: "1px solid var(--border)", backgroundColor: "rgb(26,26,26)", padding: 2 }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 16, height: 16, backgroundColor: "rgb(99,102,241)", transform: "translateX(0px)", transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", fontSize: 9, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              🌙
            </span>
          </button>
        </div>
        <button
          className="flex items-center justify-center w-full cursor-pointer"
          style={{ gap: 6, padding: "6px 0", borderRadius: 7, fontSize: 12, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontFamily: "inherit", transition: "background-color var(--dur-fast), color var(--dur-fast)" }}
        >
          <IcoLogout s={12} /> Sign out
        </button>
      </div>
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }) {
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ height: 48, gap: 12, padding: "0 20px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="min-w-0">
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1, whiteSpace: "nowrap" }}>{title}</h1>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1 }}>{subtitle}</p>
      </div>
      <div className="flex-1 flex justify-center" />
      <div className="flex items-center ml-auto flex-shrink-0" style={{ gap: 6 }}>
        <button
          title="Command palette (⌘K)" aria-label="Open command palette"
          className="flex items-center cursor-pointer"
          style={{ gap: 5, padding: "4px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--surface-2)", color: "var(--text-muted)", fontSize: 11, fontWeight: 500, fontFamily: "inherit" }}
        >
          <IcoSearch s={12} />
          <span style={{ letterSpacing: "0.3px" }}>⌘K</span>
        </button>
        <div style={{ position: "relative" }}>
          <button
            title="Notifications" aria-label="Notifications"
            className="flex items-center justify-center cursor-pointer"
            style={{ position: "relative", width: 32, height: 32, borderRadius: "var(--radius-md)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", fontFamily: "inherit" }}
          >
            <IcoBell s={15} />
          </button>
        </div>
        <button
          title="Create room" aria-label="Create room"
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "inherit" }}
        >
          <IcoPlus s={14} />
        </button>
      </div>
    </div>
  );
}

// ── Quick-start card ──────────────────────────────────────────────────────────
function QuickCard({ icon: IconComp, iconBg, iconColor, label, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      className="lift-card flex items-center text-left cursor-pointer"
      style={{
        gap: 12, padding: 16, borderRadius: 12,
        backgroundColor: "var(--surface)",
        border: `1px solid ${hov ? "rgba(99,102,241,0.4)" : "var(--border)"}`,
        color: "var(--text)",
        boxShadow: hov
          ? "0 4px 16px rgba(99,102,241,0.15), var(--card-shadow)"
          : "var(--card-shadow)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, color: iconColor }}
      >
        <IconComp s={18} />
      </span>
      <div className="min-w-0">
        <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  );
}

// ── ROOMS PAGE ────────────────────────────────────────────────────────────────
export default function Rooms() {
  const [activeNav, setActiveNav] = useState("rooms");
  const [roomCode, setRoomCode]   = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const navigate = useNavigate();

  const modes = ["All", "Pair", "Solo+", "Study"];

  function handleNav(id, path) {
    setActiveNav(id);
    if (path) navigate(path);
  }

  return (
    <div
      data-theme="dark"
      style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "row", backgroundColor: "var(--bg)" }}
    >
      {/* Sidebar */}
      <div className="sidebar-desktop">
        <Sidebar active={activeNav} onNav={handleNav} />
      </div>

      {/* Main pane */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <TopBar title="Rooms" subtitle="Nothing live right now — kick off a session" />

        <main
          className="shell-main-content route-transition"
          style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0 }}>
            <div
              style={{
                maxWidth: 1240, margin: "0 auto",
                padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,28px) 48px",
                display: "flex", flexDirection: "column", gap: 22,
              }}
            >

              {/* ── Quick start ── */}
              <section>
                <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 10, gap: 10 }}>
                  <div className="flex items-baseline" style={{ gap: 10 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>
                      Quick start
                    </h2>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>One click, in a room</span>
                  </div>
                </div>

                <div
                  className="quick-start-grid"
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}
                >
                  <QuickCard icon={IcoTimer}      iconBg="rgba(99,102,241,0.12)"  iconColor="rgb(99,102,241)"  label="Solo focus"      sub="25-min Pomodoro"      />
                  <QuickCard icon={IcoCode}        iconBg="rgba(14,165,233,0.12)"  iconColor="rgb(14,165,233)"  label="Pair up"         sub="Live coding session"  />
                  <QuickCard icon={IcoHeadphones}  iconBg="rgba(139,92,246,0.12)" iconColor="rgb(139,92,246)" label="Mock interview"   sub="FAANG playbook"       />
                  <QuickCard icon={IcoSearch}      iconBg="rgba(16,185,129,0.12)" iconColor="rgb(16,185,129)" label="Browse rooms"     sub="Find your floor"      />
                </div>
              </section>

              {/* ── Join with a code ── */}
              <section>
                <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 10, gap: 10 }}>
                  <div className="flex items-baseline" style={{ gap: 10 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>
                      Join with a code
                    </h2>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Friend share a 6-character code? Drop it here.
                    </span>
                  </div>
                </div>

                <form className="flex" style={{ gap: 8 }} onSubmit={e => e.preventDefault()}>
                  {/* Input */}
                  <div style={{ flex: "1 1 0%", position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      placeholder="Paste room code…"
                      type="text"
                      value={roomCode}
                      onChange={e => setRoomCode(e.target.value)}
                      className="ui-input w-full"
                      style={{
                        padding: "9px 12px", borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)", backgroundColor: "var(--surface)",
                        color: "var(--text)", fontSize: 13, outline: "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                        fontFamily: "inherit",
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                  {/* Join button */}
                  <button
                    type="submit"
                    disabled={!roomCode.trim()}
                    className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                    style={{
                      padding: "9px 18px", borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      backgroundColor: roomCode.trim() ? "#6366f1" : "var(--surface-2)",
                      color: roomCode.trim() ? "#fff" : "var(--text-muted)",
                      fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                      transition: "background-color 0.15s, color 0.15s",
                      cursor: roomCode.trim() ? "pointer" : "default",
                    }}
                  >
                    <IcoLogIn s={13} /> Join
                  </button>
                </form>
              </section>

              {/* ── Public floor ── */}
              <section id="public-floor">
                <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 10, gap: 10 }}>
                  <div className="flex items-baseline" style={{ gap: 10 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>
                      Public floor
                    </h2>
                    <span
                      style={{
                        fontSize: 11, padding: "1px 7px", borderRadius: 999,
                        backgroundColor: "var(--surface-2)", color: "var(--text-muted)",
                        fontWeight: 700, border: "1px solid var(--border)",
                      }}
                    >
                      0
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Open rooms anyone can join
                    </span>
                  </div>
                </div>

                {/* Search + mode filters */}
                <div className="flex items-center flex-wrap" style={{ gap: 10, marginBottom: 12 }}>
                  {/* Search */}
                  <div style={{ flex: "1 1 0%", minWidth: 200, maxWidth: 320, position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 10, color: "var(--text-muted)", display: "flex" }}>
                      <IcoSearch s={13} />
                    </span>
                    <input
                      placeholder="Search rooms…"
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{
                        width: "100%", padding: "7px 10px 7px 32px",
                        borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
                        backgroundColor: "var(--surface)", color: "var(--text)",
                        fontSize: 12, outline: "none", fontFamily: "inherit",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                      onBlur={e  => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Mode pills */}
                  <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Mode
                    </span>
                    {modes.map(m => {
                      const isActive = modeFilter === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setModeFilter(m)}
                          style={{
                            padding: "5px 11px", borderRadius: 999,
                            fontSize: 11, fontWeight: 600,
                            backgroundColor: isActive ? "var(--accent-bg)" : "var(--surface-2)",
                            color: isActive ? "var(--accent)" : "var(--text-muted)",
                            border: isActive ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border)",
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "background-color 0.12s, color 0.12s, border-color 0.12s",
                          }}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Empty state */}
                <div
                  className="ui-empty flex flex-col items-center justify-center text-center"
                  style={{ padding: "48px 24px" }}
                >
                  <div
                    className="ui-empty-icon flex items-center justify-center"
                    style={{ marginBottom: 14, color: "var(--text-subtle)" }}
                    aria-hidden="true"
                  >
                    <IcoUsersLg s={36} />
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    No public rooms right now.
                  </p>
                  <p style={{ margin: "0 0 20px", fontSize: 12, color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.55 }}>
                    Be the first to host one — set your room to public when you create it.
                  </p>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 18px", borderRadius: "var(--radius-md)",
                      background: "#6366f1", color: "#fff",
                      border: "none", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                      transition: "opacity 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Create a room
                  </button>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav
        className="mobile-tabbar"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, display: "none", height: 56, backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {[
          { id: "home",      label: "Home",      Icon: IcoDashboard, path: "/home"  },
          { id: "practice",  label: "Practice",  Icon: IcoCode                      },
          { id: "community", label: "Community", Icon: IcoUsers                     },
          { id: "profile",   label: "Profile",   Icon: IcoBar                       },
        ].map(({ id, label, Icon, path }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleNav(id, path)}
              style={{
                flex: 1, height: "100%", border: "none", cursor: "pointer",
                backgroundColor: "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                position: "relative",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                transition: "color var(--dur-fast)",
              }}
            >
              <div style={{ position: "relative" }}>
                <Icon s={20} />
              </div>
              <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, letterSpacing: "0.02em" }}>{label}</span>
              {isActive && (
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2, borderRadius: 1, backgroundColor: "var(--accent)" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Support FAB */}
      <button
        aria-label="Open support"
        className="support-fab"
        style={{
          position: "fixed", right: 20, bottom: 20, zIndex: 999,
          width: 52, height: 52, borderRadius: "50%",
          border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          transform: "scale(1)", transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)"; }}
      >
        <IcoMsg s={20} />
      </button>

      <style>{`
        .sidebar-desktop { display: flex; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .mobile-tabbar   { display: flex !important; }
          .quick-start-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
