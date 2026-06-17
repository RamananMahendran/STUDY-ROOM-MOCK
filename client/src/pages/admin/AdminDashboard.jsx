import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    padding: 20, borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)",
    display: "flex", alignItems: "center", gap: 16, flex: "1 1 200px", minWidth: 180,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: `${color}18`, color, fontSize: 20,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>{value ?? "—"}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "var(--text-muted)" }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: 60 }}>Failed to load stats</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stat cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="#6366f1" />
        <StatCard label="Problems" value={stats.totalProblems} icon="📝" color="#10b981" />
        <StatCard label="Submissions" value={stats.totalSubmissions} icon="📊" color="#8b5cf6" />
        <StatCard label="Active Today" value={stats.activeToday} icon="🔥" color="#f59e0b" />
        <StatCard label="Signups This Week" value={stats.signupsThisWeek} icon="📈" color="#ec4899" />
        <StatCard label="Submissions Today" value={stats.submissionsToday} icon="⚡" color="#06b6d4" />
        <StatCard label="Contests" value={stats.totalContests} icon="🏆" color="#ef4444" />
        <StatCard label="Study Plans" value={stats.totalStudyPlans} icon="📚" color="#14b8a6" />
      </div>

      {/* Distribution cards row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Difficulty distribution */}
        <div style={{ flex: "1 1 300px", padding: 20, borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Problem Difficulty Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(stats.difficultyDistribution || []).map(d => {
              const colors = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };
              const pct = stats.totalProblems > 0 ? (d.count / stats.totalProblems * 100) : 0;
              return (
                <div key={d.difficulty}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors[d.difficulty?.toLowerCase()] || "var(--text-muted)", textTransform: "capitalize" }}>{d.difficulty}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{d.count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: "var(--surface-2)" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, backgroundColor: colors[d.difficulty?.toLowerCase()] || "#6366f1", transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles distribution */}
        <div style={{ flex: "1 1 300px", padding: 20, borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>User Roles</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(stats.rolesDistribution || []).map(r => {
              const colors = { free: "#64748b", pro: "#8b5cf6", admin: "#f59e0b" };
              const pct = stats.totalUsers > 0 ? (r.count / stats.totalUsers * 100) : 0;
              return (
                <div key={r.role}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors[r.role] || "var(--text-muted)", textTransform: "capitalize" }}>{r.role}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: "var(--surface-2)" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, backgroundColor: colors[r.role] || "#6366f1", transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px", padding: 20, borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Recent Signups</h3>
          {(stats.recentUsers || []).map(u => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{u.name}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{u.email}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                backgroundColor: u.role === "admin" ? "rgba(245,158,11,0.15)" : u.role === "pro" ? "rgba(139,92,246,0.15)" : "rgba(100,116,139,0.15)",
                color: u.role === "admin" ? "#f59e0b" : u.role === "pro" ? "#8b5cf6" : "#64748b",
                textTransform: "uppercase",
              }}>{u.role}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: "1 1 400px", padding: 20, borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Recent Submissions</h3>
          {(stats.recentSubmissions || []).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.user?.name}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{s.problem?.title}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                backgroundColor: s.status === "accepted" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                color: s.status === "accepted" ? "#10b981" : "#ef4444",
              }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
