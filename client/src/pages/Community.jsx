import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function Community() {
  const [activeNav, setActiveNav] = useState("community");
  const navigate = useNavigate();

  function handleNav(id, path) {
    setActiveNav(id);
    if (path) navigate(path);
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "row", backgroundColor: "var(--bg)" }}
    >
      {/* Sidebar */}
      <div className="sidebar-desktop">
        <Sidebar
          active={activeNav}
          onNav={handleNav}
        />
      </div>

      {/* Main pane */}
      <div style={{ flex: "1 1 0%", display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <TopBar title="Community" subtitle="Connect with other learners" />

        {/* Body */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Coming Soon</div>
            <div style={{ fontSize: 14 }}>Community features are under development</div>
          </div>
        </div>
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
