import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const getPageInfo = (pathname) => {
  if (pathname.startsWith("/home")) return { title: "Dashboard", subtitle: "Track your progress and stats", activeNav: "home" };
  if (pathname.startsWith("/rooms")) return { title: "Rooms", subtitle: "Nothing live right now — kick off a session", activeNav: "rooms" };
  if (pathname.startsWith("/practice/leaderboard")) return { title: "Leaderboard", subtitle: null, activeNav: "leaderboard" };
  if (pathname.startsWith("/practice/study-plans/placement-sprint-30")) return { title: "30-Day Placement Sprint", subtitle: "Track progress dynamically", activeNav: "study-plans" };
  if (pathname.startsWith("/practice/study-plans/faang-prep-45")) return { title: "FAANG Prep Intensive", subtitle: "Master algorithmic patterns", activeNav: "study-plans" };
  if (pathname.startsWith("/practice/study-plans/arrays-mastery-14")) return { title: "Arrays & Strings Mastery", subtitle: "14-day deep dive into the single topic", activeNav: "study-plans" };
  if (pathname.startsWith("/practice/study-plans/weekly-challenge-7")) return { title: "Weekly Challenge", subtitle: "One carefully chosen problem per day", activeNav: "study-plans" };
  if (pathname.startsWith("/practice/study-plans")) return { title: "Study Plans", subtitle: "Curated multi-day tracks", activeNav: "study-plans" };
  if (pathname.startsWith("/practice/pair-code")) return { title: "Pair Code", subtitle: "Live collaborative coding", activeNav: "pair-code" };
  if (pathname.startsWith("/community")) return { title: "Community", subtitle: "Invite friends and study together.", activeNav: "community" };
  if (pathname.startsWith("/refer")) return { title: "Refer & Earn", subtitle: "Invite friends and get rewards", activeNav: "refer" };
  if (pathname.startsWith("/profile")) return { title: "Profile", subtitle: "Manage your account and settings", activeNav: "profile" };
  if (pathname.startsWith("/contests")) return { title: "Contests", subtitle: "Coming soon", activeNav: "contests" };
  return { title: "Study Room", subtitle: "", activeNav: "" };
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { title, subtitle, activeNav } = getPageInfo(location.pathname);

  function handleNav(id, path) {
    if (path) navigate(path);
    setIsMobileMenuOpen(false); // Close menu on navigation
  }

  // Icons for mobile tab bar
  const IcoHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
  const IcoPractice = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
  const IcoCommunity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
  const IcoProfile = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21v-6"/><path d="M12 21V3"/><path d="M19 21V9"/></svg>;

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "row", backgroundColor: "var(--bg)" }}>
      {/* Sidebar for Desktop */}
      <div className="sidebar-desktop">
        <Sidebar active={activeNav} onNav={handleNav} />
      </div>

      {/* Main pane */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {!location.pathname.startsWith("/practice/leaderboard") && !location.pathname.startsWith("/practice/problems") && (
          <TopBar title={title} subtitle={subtitle} onMenuToggle={null} />
        )}

        {/* Page Content */}
        <div className="main-content-wrapper" style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="mobile-tabbar md:hidden" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 56, backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}>
        {[
          { id: "home", label: "Home", icon: <IcoHome />, path: "/home" },
          { id: "practice", label: "Practice", icon: <IcoPractice />, path: "/practice/problems" },
          { id: "community", label: "Community", icon: <IcoCommunity />, path: "/community" },
          { id: "profile", label: "Profile", icon: <IcoProfile />, path: "/profile" },
        ].map(item => {
          const isActive = location.pathname.startsWith(item.path.split('/')[1] === 'practice' ? '/practice' : item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                background: "none", border: "none", flex: 1, height: "100%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                color: isActive ? "var(--accent)" : "var(--text-muted)", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            </button>
          )
        })}
      </div>

      <style>{`
        .sidebar-desktop { display: flex; }
        .mobile-tabbar { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .mobile-tabbar { display: flex !important; }
          .main-content-wrapper { padding-bottom: 56px; } /* Space for tab bar */
        }
      `}</style>
    </div>
  );
}
