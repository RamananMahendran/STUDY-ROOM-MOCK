import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── SVG Icons (top-level nav) ──────────────────────────────────────────────────
const IcoDashboard  = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IcoHeadphones = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcoCode       = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
const IcoZap        = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const IcoUsers      = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
const IcoBar        = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>;
const IcoGift       = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>;
const IcoLogout     = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>;
const IcoLock       = ({ s = 7  }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoBookOpen   = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;

// Chevron — points down when open, right when closed
const IcoChevron = ({ s = 13, open }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

// ── Practice sub-item icons — matched exactly to the screenshot ────────────────

// Problems: grid with 2 rows of lines (looks like a document/list)
const IcoProblems = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </svg>
);

// Study Plans: two circular arrows / recycle loop
const IcoStudyPlans = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

// Playground: >_ terminal prompt
const IcoPlayground = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m4 17 6-6-6-6"/>
    <path d="M12 19h8"/>
  </svg>
);

// Pair Code: fork / branch icon
const IcoPairCode = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="6" cy="18" r="2"/>
    <circle cx="6" cy="6"  r="2"/>
    <circle cx="18" cy="6" r="2"/>
    <path d="M6 8v8"/>
    <path d="M8 6h7a3 3 0 0 1 3 3v1"/>
  </svg>
);

// Mock Interview: clock / timer with a notch
const IcoMockInterview = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="13" r="8"/>
    <path d="M12 9v4l2 2"/>
    <path d="M5 3 2 6"/>
    <path d="m19 3 3 3"/>
    <path d="M12 5V3"/>
  </svg>
);

// Leaderboard: trophy
const IcoLeaderboard = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>
    <path d="M6 4h12v10a6 6 0 0 1-12 0V4z"/>
    <path d="M12 20v2"/>
    <path d="M9 22h6"/>
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────────
const PRACTICE_ITEMS = [
  { id: "problems",       label: "Problems",       Icon: IcoProblems,      path: "/practice/problems"       },
  { id: "study-plans",    label: "Study Plans",    Icon: IcoStudyPlans,    path: "/practice/study-plans"    },
  { id: "playground",     label: "Playground",     Icon: IcoPlayground,    path: "/practice/playground"     },
  { id: "pair-code",      label: "Pair Code",      Icon: IcoPairCode,      path: "/practice/pair-code"      },
  { id: "mock-interview", label: "Mock Interview", Icon: IcoMockInterview, path: "/practice/mock-interview" },
  { id: "leaderboard",    label: "Leaderboard",    Icon: IcoLeaderboard,   path: "/practice/leaderboard"    },
];

const TOP_NAV = [
  { id: "home",  label: "Home",  Icon: IcoDashboard,  path: "/home"  },
  { id: "rooms", label: "Rooms", Icon: IcoHeadphones, path: "/rooms" },
];

const BOTTOM_NAV = [
  { id: "contests",  label: "Contests",     Icon: IcoZap,   path: "/contests", soon: true                 },
  { id: "community", label: "Community",    Icon: IcoUsers, path: "/community"         },
  { id: "profile",   label: "Profile",      Icon: IcoBar,   path: "/profile"           },
  { id: "refer",     label: "Refer & earn", Icon: IcoGift,  path: "/refer"             },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────
export default function Sidebar({ active, onNav }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    // 1. Fetch the stringified user object from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // 2. Security Check: If no token exists, boot them back to login
    if (!token || !storedUser) {
      console.warn("Unauthorized access attempt. Redirecting...");
      //navigate("/login");
      return;
    }

    try {
      // 3. Parse the JSON string back into a JavaScript object
      const userObj = JSON.parse(storedUser);
      
      if (userObj && userObj.username) {
        setUsername(userObj.username);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (!currentTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const handleToggleTheme = (event) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const isPracticeChild = PRACTICE_ITEMS.some(i => i.id === active);
  const [practiceOpen, setPracticeOpen] = useState(isPracticeChild);

  const go = (id, path) => {
    if (onNav) onNav(id, path);
    if (path) navigate(path);
  };

  // shared button style factory
  const btnStyle = (isActive, disabled = false) => ({
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", textAlign: "left",
    padding: "7px 10px", borderRadius: 8,
    border: "none", fontSize: 13, fontFamily: "inherit",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? "var(--accent, #6366f1)" : "var(--text-muted)",
    backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
    cursor: disabled ? "default" : "pointer",
    transition: "background-color 0.15s, color 0.15s",
  });

  return (
    <div style={{
      width: 220, flexShrink: 0, height: "100%",
      display: "flex", flexDirection: "column",
      backgroundColor: "var(--surface)",
      borderRight: "1px solid var(--border)",
    }}>

      {/* ── Brand ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 14px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <IcoBookOpen s={13} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.3px" }}>
          Study Room
        </span>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1 }}>

        {/* Home, Rooms */}
        {TOP_NAV.map(({ id, label, Icon, path }) => (
          <button key={id} onClick={() => go(id, path)} style={btnStyle(active === id)}>
            <Icon s={15} />
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
          </button>
        ))}

        {/* ── Practice folder ── */}
        <div style={{ marginTop: 2 }}>

          {/* Practice row — clicking toggles the folder */}
          <button
            onClick={() => setPracticeOpen(o => !o)}
            style={btnStyle(isPracticeChild)}
          >
            <IcoCode s={15} />
            <span style={{ flex: 1 }}>Practice</span>
            <IcoChevron s={13} open={practiceOpen} />
          </button>

          {/* Animated sub-list */}
          <div style={{
            overflow: "hidden",
            maxHeight: practiceOpen ? 400 : 0,
            transition: "max-height 0.25s ease",
          }}>
            <div style={{ paddingTop: 2, paddingLeft: 10, display: "flex", flexDirection: "column", gap: 1 }}>
              {PRACTICE_ITEMS.map(({ id, label, Icon, path }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => go(id, path)}
                    style={{
                      ...btnStyle(isActive),
                      fontSize: 13,
                      padding: "7px 10px",
                    }}
                  >
                    <Icon s={14} />
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contests, Community, Profile, Refer */}
        {BOTTOM_NAV.map(({ id, label, Icon, path, soon }) => (
          <div key={id} style={{ position: "relative" }}>
            <button
              onClick={() => go(id, path)}
              style={btnStyle(active === id, soon)}
            >
              <Icon s={15} />
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
            </button>
            {soon && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                display: "flex", alignItems: "center", gap: 3,
                fontSize: 8, fontWeight: 800, letterSpacing: "0.4px",
                padding: "1px 5px", borderRadius: 10,
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}>
                <IcoLock s={7} /> SOON
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* ── User tray ── */}
      <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Avatar */}
          <img
            alt={username}
            src="https://lh3.googleusercontent.com/a/ACg8ocJOHQ3CBE3KjE6jm37Rh6DZ1INAG8-i1M7xZZNfvCYrlZHgTg=s96-c"
            style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, objectFit: "cover" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <div style={{
            display: "none", width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 11,
          }}>MK</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {username}
            </div>
          </div>

          {/* Theme toggle */}
          <button
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={handleToggleTheme}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center",
              width: 40, height: 22, borderRadius: 99,
              border: "1px solid var(--border)",
              backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)",
              padding: 2, cursor: "pointer",
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              backgroundColor: "rgb(99,102,241)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              transform: theme === "dark" ? "translateX(0px)" : "translateX(18px)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>

        {/* Sign out */}
        <button 
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "6px 0", borderRadius: 7, fontSize: 12,
            border: "1px solid var(--border)", backgroundColor: "transparent",
            color: "var(--text-muted)", fontFamily: "inherit", cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <IcoLogout s={12} /> Sign out
        </button>
      </div>
    </div>
  );
}

export { PRACTICE_ITEMS };