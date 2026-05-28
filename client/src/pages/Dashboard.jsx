import { useState, useTransition, useRef, useEffect} from "react";
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
const IcoChevRight  = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>;
const IcoLock       = ({s=7})  => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoSearch     = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>;
const IcoBell       = ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>;
const IcoPlus       = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IcoFlame      = ({s=24, style:st}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={st}><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>;
const IcoTimer      = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;
const IcoCheck      = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const IcoArrow      = ({s=12}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const IcoMsg        = ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>;
const IcoBookOpen   = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;

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
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 13,
                  position: "relative",
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

      {/* Bottom – user */}
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
function TopBar() {
  const PALETTE_ITEMS = [
      { id: "home",        label: "Go to Home",         icon: "▩" },
      { id: "rooms",       label: "My Rooms",           icon: "🎧" },
      { id: "problems",    label: "Problems",           icon: "🗒" },
      { id: "playground",  label: "Code Playground",    icon: "🧩" },
      { id: "pair",        label: "Start Pair Session", icon: "⚿" },
      { id: "leaderboard", label: "Leaderboard",        icon: "🏆" },
      { id: "analytics",   label: "Profile / Analytics",icon: "📊" },
      { id: "community",   label: "Community / Friends",icon: "👥" },
      { id: "createRoom",    label: "Create a room",    icon: "➕" },
      { id: "invite",      label: "Invite friends",    icon: "✉️" },
      { id: "OpenProblem", label: "Open a problem",    icon: "🔍" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const paletteRef = useRef(null);
  const inputRef = useRef(null);

  // Filter items based on user search query input string
  const filteredItems = PALETTE_ITEMS.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      document.body.style.overflow = "hidden"; // Prevent background content scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Global listener tracking shortcuts (⌘K, Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard navigation controller handling index updates inside container lists
  const handleListKeyDown = (e) => {
    if (!isOpen || filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleItemTrigger(filteredItems[selectedIndex]);
    }
  };

  const handleItemTrigger = (item) => {
    console.log(`Navigating route instance selection: ${item.id}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ height: 48, gap: 12, padding: "0 20px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="min-w-0">
        <h1 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1, whiteSpace: "nowrap" }}>Home</h1>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1 }}>Your study analytics</p>
      </div>

      <div className="flex-1 flex justify-center" />

      <div className="flex items-center ml-auto flex-shrink-0" style={{ gap: 6 }}>
        {/* ⌘K */}
        <button
         title="Command palette (⌘K)"
        aria-label="Open command palette"
        onClick={() => setIsOpen(true)}
        className="flex items-center cursor-pointer gap-[5px] px-[10px] py-[4px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] text-[11px] font-[500] font-inherit transition-all duration-150"
      >
          <IcoSearch s={12} />
          <span style={{ letterSpacing: "0.3px" }}>⌘K</span>
        </button>
        {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-[4px] transition-opacity duration-200"
          onClick={() => setIsOpen(false)} // Closes system when clicking the backdrop layer
        >
          <div
            ref={paletteRef}
            onClick={(e) => e.stopPropagation()} // Prevents bubble trigger patterns closing inner card box
            onKeyDown={handleListKeyDown}
            className="w-full max-w-[580px] bg-[#0d1117] border border-[#1e2433] rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans text-[#e2e8f0]"
          >
            {/* INPUT SEARCH HEADER WRAPPER */}
            <div className="h-8 flex items-center px-4 py-3.5 border-b border-[#1e2433] gap-3">
              <svg className="ml-8 text-gray-500 p-4 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Jump to, search, or do something..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[14px] text-[#f1f5f9] placeholder-gray-600 font-sans"
              />
            </div>

            {/* NAVIGATIONAL ROUTE LOOP LISTING */}
            <div className="max-h-[340px] overflow-y-auto p-2 flex flex-col gap-0.5">
              <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase px-3 pt-2 pb-1.5 selection-none">
                Navigate
              </div>
              
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemTrigger(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center text-left gap-4 px-3 py-2.5 rounded-lg text-[13px] font-medium border-none cursor-pointer transition-colors duration-700 ${
                        isSelected 
                          ? "bg-[#161b26] text-[#818cf8]" 
                          : "bg-transparent text-gray-300"
                      }`}
                    >
                      {/* Unified dynamic icon container cell layout rendering block */}
                      <span className={`w-7 h-7 flex items-center justify-center rounded-md text-[13px] border ${
                        isSelected ? "bg-[#1f2433] border-[#312e81]" : "bg-[#111622] border-[#1a202c]"
                      }`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[12px] text-gray-500">
                  No matching workspace parameters found.
                </div>
              )}
            </div>

            {/* SYSTEM SHORTCUT HELP LEGEND BAR FOOTER */}
            <div className="flex items-center gap-4 px-4 py-2.5 bg-[#080c12] border-t border-[#1e2433] text-[10px] text-gray-500 select-none">
              <div className="flex items-center gap-1">
                <span className="bg-[#111622] border border-[#1a202c] px-1 py-0.5 rounded text-[9px] font-mono">↑↓</span> Navigate
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-[#111622] border border-[#1a202c] px-1 py-0.5 rounded text-[9px] font-mono">↵</span> Open
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-[#111622] border border-[#1a202c] px-1 py-0.5 rounded text-[9px] font-mono">Esc</span> Close
              </div>
            </div>

          </div>
        </div>
      )}
        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button
            title="Notifications"
            aria-label="Notifications"
            className="flex items-center justify-center cursor-pointer"
            style={{ position: "relative", width: 32, height: 32, borderRadius: "var(--radius-md)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", fontFamily: "inherit", transition: "background-color var(--dur-fast), color var(--dur-fast)" }}
          >
            <IcoBell s={15} />
          </button>
        </div>

        {/* + Create room */}
        <button
          title="Create room"
          aria-label="Create room"
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "inherit", transition: "opacity var(--dur-fast)" }}
        >
          <IcoPlus s={14} />
        </button>
      </div>
    </div>
  );
}

// ── Daily challenge banner ────────────────────────────────────────────────────
function DailyChallenge() {
  const now   = new Date();
  const day   = now.toLocaleDateString("en-US", { weekday: "long" });
  const date  = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div
      className="flex-shrink-0 cursor-pointer overflow-hidden"
      style={{
        borderRadius: 14,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
        boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
        position: "relative",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 24px,#fff 24px,#fff 25px), repeating-linear-gradient(90deg,transparent,transparent 24px,#fff 24px,#fff 25px)",
        }}
      />
      <div className="relative flex items-center flex-wrap" style={{ padding: "18px 22px", gap: 16 }}>
        {/* Flame icon */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <IcoFlame s={24} style={{ color: "rgb(251,191,36)" }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap" style={{ gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
              Daily Challenge · {day}, {date}
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Factorial
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", textTransform: "capitalize" }}>
              easy
            </span>
          </div>
        </div>

        {/* Solve button */}
        <div
          className="flex-shrink-0 flex items-center cursor-pointer"
          style={{ gap: 6, backgroundColor: "#fff", color: "#4f46e5", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700 }}
        >
          <IcoFlame s={14} style={{ color: "#4f46e5" }} />
          Solve now
          <IcoChevRight s={14} />
        </div>
      </div>
    </div>
  );
}

// ── Hero greeting card ────────────────────────────────────────────────────────
function HeroCard() {
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const day      = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

  return (
    <div
      className="hero-analytics rounded-[18px] relative overflow-hidden"
      style={{
        padding: 24,
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 60%, transparent 100%), var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 280px",
        gap: 24,
        alignItems: "stretch",
      }}
    >
      <div className="min-w-0">
        {/* Live day label */}
        <div
          className="inline-flex items-center"
          style={{ gap: 8, fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}
        >
          <span
            className="live-dot"
            style={{ width: 6, height: 6, borderRadius: 3, background: "var(--success)", display: "inline-block" }}
          />
          {day}
        </div>

        <h1 style={{ margin: 0, fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.6px", lineHeight: 1.18 }}>
          {greeting}, Mayur, let's start your first focus session.
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-muted)", maxWidth: 580, lineHeight: 1.55 }}>
          A 25-minute Pomodoro is enough. We'll handle the setup.
        </p>

        <div className="flex flex-wrap" style={{ gap: 10, marginTop: 20 }}>
          <button
            className="inline-flex items-center cursor-pointer"
            style={{ gap: 8, padding: "11px 18px", borderRadius: 10, background: "#6366f1", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px", boxShadow: "0 8px 20px rgba(99,102,241,0.267)", fontFamily: "inherit" }}
          >
            <IcoTimer s={14} />
            Start your first focus session
          </button>
          <button
            className="inline-flex items-center cursor-pointer"
            style={{ gap: 6, padding: "11px 14px", borderRadius: 10, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}
          >
            View daily problem <IcoArrow s={12} />
          </button>
        </div>
      </div>
      {/* Empty right column — intentional spacer that constrains text width */}
      <div />
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: IconComp, iconBg, iconColor, label, value, sub }) {
  return (
    <div
      className="flex flex-col min-w-0"
      style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", gap: 10, boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <span
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, borderRadius: 9, background: iconBg, color: iconColor }}
        >
          <IconComp s={14} />
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.7px", lineHeight: 1 }}>{value}</div>
        {sub && (
          <div className="flex items-center flex-wrap" style={{ gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty chart placeholder ───────────────────────────────────────────────────
function ChartEmpty({ msg, py = "26px 12px" }) {
  return (
    <div style={{ padding: py, textAlign: "center", color: "var(--text-muted)", fontSize: 12, lineHeight: 1.55 }}>
      {msg}
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");

  function handleNav(id, path) {
    setActiveNav(id);
    if (path) navigate(path);
  }

  const toggleTheme = (event) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // Fallback if browser doesn't support the View Transition API
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Get click target geometry coordinates to calculate the expansion origin
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate maximum radius distance to the furthest screen corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    // Inject dynamic keyframes into the document execution loop
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

  return (
    <div
      data-theme={theme}
      style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "row", backgroundColor: "var(--bg)" }}
    >
      {/* ── SIDEBAR CONSOLE CONTAINER ── */}
      <div className="sidebar-desktop">
        <div
          className="flex-shrink-0 h-full flex flex-col"
          style={{ width: 220, backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0" style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <IcoBookOpen s={13} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.3px" }}>Study Room</span>
          </div>

          {/* Navigation Items Map Link Iterators */}
          <nav className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "10px 8px", gap: 1 }}>
            {NAV_ITEMS.map(({ id, label, Icon, chevron, soon, path }) => {
              const isActive = activeNav === id;
              return (
                <div key={id} style={{ position: "relative" }}>
                  <button
                    aria-label={label}
                    onClick={() => handleNav(id, path)}
                    className="flex items-center w-full text-left cursor-pointer"
                    style={{
                      gap: 10, padding: "7px 10px", borderRadius: 8, border: "none", fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--accent, #6366f1)" : "var(--text-muted)",
                      backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
                      transition: "background-color var(--dur-fast), color var(--dur-fast)",
                      fontFamily: "inherit",
                    }}
                  >
                    <Icon s={15} />
                    <span style={{ flex: "1 1 0%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                    {chevron && <IcoChevron s={13} rotate="-90" />}
                  </button>
                  {soon && (
                    <span className="absolute flex items-center gap-1 pointer-events-none" style={{ top: 6, right: 6, fontSize: 8, fontWeight: 800, letterSpacing: "0.4px", padding: "1px 5px", borderRadius: 10, backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-subtle)" }}>
                      <IcoLock s={7} /> SOON
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom user configurations tray */}
          <div className="flex-shrink-0 flex flex-col" style={{ borderTop: "1px solid var(--border)", padding: "10px 12px", gap: 8 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <img alt="Mayur K S" src="https://lh3.googleusercontent.com/a/ACg8ocJOHQ3CBE3KjE6jm37Rh6DZ1INAG8-i1M7xZZNfvCYrlZHgTg=s96-c" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, objectFit: "cover" }} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Mayur K S</div>
              </div>

              {/* Dynamic Theme Interactive Pill Switch Button */}
              <button
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleTheme}
                className="flex-shrink-0 flex items-center cursor-pointer"
                style={{
                  width: 40, height: 22, borderRadius: 99, 
                  border: "1px solid var(--border)", 
                  backgroundColor: theme === "dark" ? "rgb(26,26,26)" : "rgb(241,245,249)", 
                  padding: 2, position: "relative"
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 16, height: 16, 
                    backgroundColor: "rgb(99,102,241)", 
                    transform: theme === "dark" ? "translateX(0px)" : "translateX(18px)", 
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", 
                    fontSize: 9, boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                  }}
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                </span>
              </button>
            </div>

            <button className="flex items-center justify-center w-full cursor-pointer" style={{ gap: 6, padding: "6px 0", borderRadius: 7, fontSize: 12, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontFamily: "inherit" }}>
              <IcoLogout s={12} /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main pane */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <TopBar />

        <main
          className="shell-main-content route-transition"
          style={{ flex: "1 1 0%", minHeight: 0, display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: "1 1 0%", overflowY: "auto", minHeight: 0 }}>
            <div
              style={{
                maxWidth: 1240,
                margin: "0 auto",
                padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,28px) 48px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Daily challenge */}
              <DailyChallenge />

              {/* Hero greeting */}
              <HeroCard />

              {/* KPI row */}
              <div className="kpi-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                <KpiCard icon={IcoTimer} iconBg="var(--accent-bg)"          iconColor="var(--accent)" label="Focus this week"   value="0h" />
                <KpiCard icon={IcoTimer} iconBg="rgba(16,185,129,0.12)"     iconColor="#10b981"       label="Pomodoros today"  value="0"  sub="0 total" />
                <KpiCard icon={IcoCheck} iconBg="rgba(139,92,246,0.12)"     iconColor="#8b5cf6"       label="Solved this month" value="0" sub="0 of 50 all-time" />
              </div>

              {/* Charts row */}
              <div className="home-charts-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 16 }}>
                {/* When you study best */}
                <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                  <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 14, gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.1px" }}>When you study best</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Last 7 weeks · darker = more focus minutes</div>
                    </div>
                    <div className="flex items-center" style={{ gap: 6, fontSize: 10, color: "var(--text-muted)" }}>
                      <span>less</span>
                      {[0.15, 0.35, 0.55, 0.75, 0.95].map((op, i) => (
                        <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: `rgb(99,102,241)`, opacity: op, border: "1px solid var(--border)", display: "inline-block" }} />
                      ))}
                      <span>more</span>
                    </div>
                  </div>
                  <ChartEmpty msg="No focus minutes yet. Run a Pomodoro and your peak study window will show up here." />
                </div>

                {/* Subject mix */}
                <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Subject mix</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Where your hours go</div>
                  </div>
                  <ChartEmpty msg="Your study rooms will appear here once you log a few sessions." py="26px 0" />
                </div>
              </div>

              {/* Solve velocity */}
              <div style={{ padding: 18, borderRadius: 14, backgroundColor: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                <div className="flex items-baseline justify-between flex-wrap" style={{ marginBottom: 8, gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Solve velocity</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Problems solved per day · last 30 days</div>
                  </div>
                  <div className="flex items-center flex-wrap" style={{ gap: 14, fontSize: 11 }}>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span style={{ width: 18, height: 3, background: "#6366f1", borderRadius: 2, display: "inline-block" }} />
                      <span style={{ color: "var(--text-muted)" }}>Daily</span>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span style={{ width: 18, height: 0, borderTop: "2px dashed #ec4899", display: "inline-block" }} />
                      <span style={{ color: "var(--text-muted)" }}>7-day avg</span>
                    </div>
                  </div>
                </div>
                <ChartEmpty msg="Solve a problem and your daily velocity curve starts here." py="40px 0" />
              </div>
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
          { id: "home",      label: "Home",      Icon: IcoDashboard },
          { id: "practice",  label: "Practice",  Icon: IcoCode      },
          { id: "community", label: "Community", Icon: IcoUsers     },
          { id: "profile",   label: "Profile",   Icon: IcoBar       },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            aria-label={label}
            onClick={() => setActiveNav(id)}
            style={{
              flex: 1, height: "100%", border: "none", cursor: "pointer", backgroundColor: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
              position: "relative",
              color: activeNav === id ? "var(--accent)" : "var(--text-muted)",
              transition: "color var(--dur-fast)",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon s={20} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.02em" }}>{label}</span>
          </button>
        ))}
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
          transform: "scale(1)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)"; }}
      >
        <IcoMsg s={20} />
      </button>

      <style>{`
        .sidebar-desktop { display: flex; }
        .live-dot { animation: pulse-green 1.6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .mobile-tabbar   { display: flex !important; }
          .hero-analytics  { grid-template-columns: minmax(0,1fr) !important; }
          .kpi-row         { grid-template-columns: repeat(2,1fr) !important; }
          .home-charts-row { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
