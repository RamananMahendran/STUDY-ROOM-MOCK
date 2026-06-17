import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const IcoShield = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>;
const IcoChart = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16l4-8 4 4 4-6"/></svg>;
const IcoUsers = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>;
const IcoCode = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
const IcoTrophy = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><path d="M6 4h12v10a6 6 0 0 1-12 0V4z"/><path d="M12 20v2"/><path d="M9 22h6"/></svg>;
const IcoRoom = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>;
const IcoFile = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>;
const IcoBook = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>;
const IcoLog = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/><path d="m16 12 5 3-5 3v-6Z"/></svg>;
const IcoArrow = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: IcoChart, path: "/admin" },
  { id: "users", label: "Users", Icon: IcoUsers, path: "/admin/users" },
  { id: "problems", label: "Problems", Icon: IcoCode, path: "/admin/problems" },
  { id: "contests", label: "Contests", Icon: IcoTrophy, path: "/admin/contests" },
  { id: "rooms", label: "Rooms", Icon: IcoRoom, path: "/admin/rooms" },
  { id: "submissions", label: "Submissions", Icon: IcoFile, path: "/admin/submissions" },
  { id: "study-plans", label: "Study Plans", Icon: IcoBook, path: "/admin/study-plans" },
  { id: "audit-log", label: "Audit Log", Icon: IcoLog, path: "/admin/audit-log" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !stored) { navigate("/login"); return; }
    try {
      const u = JSON.parse(stored);
      if (u.role !== "admin") { navigate("/home"); return; }
      setUser(u);
    } catch { navigate("/login"); }
  }, [navigate]);

  const active = NAV.find(n => n.path === location.pathname)?.id || "dashboard";

  const btnStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", textAlign: "left",
    padding: "8px 12px", borderRadius: 8,
    border: "none", fontSize: 13, fontFamily: "inherit",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? "#f59e0b" : "var(--text-muted)",
    backgroundColor: isActive ? "rgba(245,158,11,0.12)" : "transparent",
    cursor: "pointer", transition: "all 0.15s",
  });

  if (!user) return null;

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", backgroundColor: "var(--bg)" }}>
      {/* Sidebar */}
      <div style={{
        width: 230, flexShrink: 0, height: "100%", display: "flex", flexDirection: "column",
        backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcoShield s={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.3px" }}>Admin Panel</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ id, label, Icon, path }) => (
            <button key={id} onClick={() => navigate(path)} style={btnStyle(active === id)}>
              <Icon s={15} /><span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Back to App */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => navigate("/home")} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "8px 0", borderRadius: 8, fontSize: 12, fontFamily: "inherit",
            border: "1px solid var(--border)", backgroundColor: "transparent",
            color: "var(--text-muted)", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.color = "#f59e0b"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <IcoArrow s={12} /> Back to App
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "14px 24px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
              {NAV.find(n => n.id === active)?.label || "Admin"}
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Manage your Study Room platform</p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "4px 12px 4px 6px",
            borderRadius: 20, border: "1px solid rgba(245,158,11,0.3)", backgroundColor: "rgba(245,158,11,0.08)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b" }}>ADMIN</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
