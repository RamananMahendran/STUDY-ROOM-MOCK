import { useNavigate } from "react-router-dom";

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const IcoDashboard  = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const IcoHeadphones = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcoCode       = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
const IcoZap        = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const IcoUsers      = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
const IcoBar        = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>;
const IcoGift       = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>;
const IcoLogout     = ({ s = 12 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>;
const IcoChevron    = ({ s = 13, rotate = "0" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transition: "transform var(--dur-fast)", transform: `rotate(${rotate}deg)` }}><path d="m6 9 6 6 6-6"/></svg>;
const IcoLock       = ({ s = 7 })  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoBookOpen   = ({ s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;

// ── Nav items ──────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "home",      label: "Home",         Icon: IcoDashboard,  path: "/home"  },
  { id: "rooms",     label: "Rooms",        Icon: IcoHeadphones, path: "/rooms" },
  { id: "practice",  label: "Practice",     Icon: IcoCode,       chevron: true  },
  { id: "contests",  label: "Contests",     Icon: IcoZap,        soon: true     },
  { id: "community", label: "Community",    Icon: IcoUsers                      },
  { id: "profile",   label: "Profile",      Icon: IcoBar                        },
  { id: "refer",     label: "Refer & earn", Icon: IcoGift                       },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────
/**
 * Props:
 *  active        – currently active nav id (string)
 *  onNav         – (id, path?) => void  called when a nav item is clicked
 *  theme         – "dark" | "light"
 *  onToggleTheme – (event) => void  called when the theme toggle is clicked
 */
export default function Sidebar({ active, onNav, theme, onToggleTheme }) {
  return (
    <div
      className="flex-shrink-0 h-full flex flex-col"
      style={{ width: 220, backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* ── Brand ── */}
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

      {/* ── Navigation ── */}
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
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 13,
                  position: "relative",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent, #6366f1)" : "var(--text-muted)",
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
                    top: 6, right: 6,
                    fontSize: 8, fontWeight: 800, letterSpacing: "0.4px",
                    padding: "1px 5px", borderRadius: 10,
                    backgroundColor: "var(--surface-2)",
                    border: "1px solid var(--border)",
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

      {/* ── Bottom user tray ── */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ borderTop: "1px solid var(--border)", padding: "10px 12px", gap: 8 }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          {/* Avatar */}
          <img
            alt="Mayur K S"
            src="https://lh3.googleusercontent.com/a/ACg8ocJOHQ3CBE3KjE6jm37Rh6DZ1INAG8-i1M7xZZNfvCYrlZHgTg=s96-c"
            style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, objectFit: "cover" }}
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback initials */}
          <div
            className="items-center justify-center flex-shrink-0 text-white font-bold"
            style={{
              display: "none", width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontSize: 11,
            }}
          >
            MK
          </div>

          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Mayur K S
            </div>
          </div>

          {/* Theme toggle pill */}
          <button
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleTheme}
            className="flex-shrink-0 flex items-center cursor-pointer"
            style={{
              width: 40, height: 22, borderRadius: 99,
              border: "1px solid var(--border)",
              backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)",
              padding: 2,
            }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 16, height: 16,
                backgroundColor: "rgb(99,102,241)",
                transform: theme === "dark" ? "translateX(0px)" : "translateX(18px)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                fontSize: 9, boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>

        {/* Sign out */}
        <button
          className="flex items-center justify-center w-full cursor-pointer"
          style={{
            gap: 6, padding: "6px 0", borderRadius: 7, fontSize: 12,
            border: "1px solid var(--border)", backgroundColor: "transparent",
            color: "var(--text-muted)", fontFamily: "inherit",
            transition: "background-color var(--dur-fast), color var(--dur-fast)",
          }}
        >
          <IcoLogout s={12} /> Sign out
        </button>
      </div>
    </div>
  );
}
