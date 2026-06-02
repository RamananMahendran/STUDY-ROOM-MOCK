import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
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
  const { title, subtitle, activeNav } = getPageInfo(location.pathname);

  function handleNav(id, path) {
    if (path) navigate(path);
  }

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "row", backgroundColor: "var(--bg)" }}>
      {/* Sidebar */}
      <div className="sidebar-desktop">
        <Sidebar active={activeNav} onNav={handleNav} />
      </div>

      {/* Main pane */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {!location.pathname.startsWith("/practice/leaderboard") && !location.pathname.startsWith("/practice/problems") && <TopBar title={title} subtitle={subtitle} />}

        {/* Page Content */}
        <Outlet />
      </div>

      <style>{`
        .sidebar-desktop { display: flex; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}
