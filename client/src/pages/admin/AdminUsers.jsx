import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });

const RoleBadge = ({ role }) => {
  const c = { admin: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" }, pro: { bg: "rgba(139,92,246,0.15)", color: "#8b5cf6" }, free: { bg: "rgba(100,116,139,0.15)", color: "#64748b" } };
  const s = c[role] || c.free;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, backgroundColor: s.bg, color: s.color, textTransform: "uppercase" }}>{role}</span>;
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    fetch(`${API}/api/admin/users?${params}`, { headers: headers() })
      .then(r => r.json())
      .then(d => { if (d.success) { setUsers(d.data); setPagination(d.pagination); } })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [roleFilter]);

  const handleSearch = (e) => { e.preventDefault(); load(1); };

  const changeRole = (id, newRole) => {
    fetch(`${API}/api/admin/users/${id}/role`, { method: "PUT", headers: headers(), body: JSON.stringify({ role: newRole }) })
      .then(r => r.json())
      .then(d => { if (d.success) load(pagination.page); })
      .catch(console.error);
  };

  const deleteUser = (id) => {
    fetch(`${API}/api/admin/users/${id}`, { method: "DELETE", headers: headers() })
      .then(r => r.json())
      .then(d => { if (d.success) { setConfirmDelete(null); load(pagination.page); } })
      .catch(console.error);
  };

  const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", width: 260, outline: "none" }}
          />
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
        </form>
        <div style={{ display: "flex", gap: 4 }}>
          {["", "free", "pro", "admin"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              backgroundColor: roleFilter === r ? "rgba(245,158,11,0.15)" : "transparent", color: roleFilter === r ? "#f59e0b" : "var(--text-muted)",
            }}>{r || "All"}</button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{pagination.total} users</span>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Name", "Email", "Role", "Streak", "Problems", "Study Hours", "Joined", "Actions"].map(h => (
                <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>No users found</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{u.name}</td>
                <td style={{ ...tableCell, color: "var(--text-muted)" }}>{u.email}</td>
                <td style={tableCell}>
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} style={{
                    padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border)", backgroundColor: "var(--surface-2)", color: "var(--text)", fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                  }}>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ ...tableCell, color: "var(--text)" }}>🔥 {u.streakCount}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{u.problemsSolved}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{(u.totalStudyHours || 0).toFixed(1)}h</td>
                <td style={{ ...tableCell, color: "var(--text-muted)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={tableCell}>
                  <button onClick={() => setConfirmDelete(u)} style={{
                    padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(0, 10).map(p => (
            <button key={p} onClick={() => load(p)} style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              backgroundColor: pagination.page === p ? "rgba(245,158,11,0.15)" : "transparent", color: pagination.page === p ? "#f59e0b" : "var(--text-muted)",
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setConfirmDelete(null)}>
          <div onClick={e => e.stopPropagation()} style={{ padding: 24, borderRadius: 16, backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxWidth: 400, width: "90%" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Delete User</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)" }}>Are you sure you want to delete <strong style={{ color: "var(--text)" }}>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={() => deleteUser(confirmDelete.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", backgroundColor: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
