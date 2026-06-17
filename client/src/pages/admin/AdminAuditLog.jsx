import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });
const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };

const actionColors = {
  CREATE_PROBLEM: "#10b981", UPDATE_PROBLEM: "#f59e0b", DELETE_PROBLEM: "#ef4444",
  CREATE_CONTEST: "#10b981", UPDATE_CONTEST: "#f59e0b", DELETE_CONTEST: "#ef4444",
  CREATE_STUDY_PLAN: "#10b981", UPDATE_STUDY_PLAN: "#f59e0b", DELETE_STUDY_PLAN: "#ef4444",
  UPDATE_ROLE: "#8b5cf6", DELETE_USER: "#ef4444", DELETE_ROOM: "#ef4444",
};

export default function AdminAuditLog() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const load = (page = 1) => {
    setLoading(true);
    fetch(`${API}/api/admin/audit-logs?page=${page}&limit=30`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) { setLogs(d.data); setPagination(d.pagination); } })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pagination.total} audit events</span>

      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Action", "Target", "Target ID", "Actor ID", "Metadata", "Date"].map(h => (
            <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            logs.length === 0 ? <tr><td colSpan={6} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>No audit logs yet</td></tr> :
            logs.map(l => (
              <tr key={l.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={tableCell}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: `${actionColors[l.action] || "#64748b"}18`, color: actionColors[l.action] || "#64748b" }}>{l.action}</span>
                </td>
                <td style={{ ...tableCell, color: "var(--text)", textTransform: "capitalize" }}>{l.targetType}</td>
                <td style={{ ...tableCell, fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{l.targetId}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>#{l.actorId}</td>
                <td style={{ ...tableCell, fontSize: 11, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.metaData ? JSON.stringify(l.metaData) : "—"}</td>
                <td style={{ ...tableCell, fontSize: 12, color: "var(--text-muted)" }}>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => load(p)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", backgroundColor: pagination.page === p ? "rgba(245,158,11,0.15)" : "transparent", color: pagination.page === p ? "#f59e0b" : "var(--text-muted)" }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
