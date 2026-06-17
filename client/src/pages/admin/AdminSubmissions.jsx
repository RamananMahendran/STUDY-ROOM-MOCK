import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });
const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };

export default function AdminSubmissions() {
  const [subs, setSubs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`${API}/api/admin/submissions?${params}`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) { setSubs(d.data); setPagination(d.pagination); } })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const statusColor = (s) => ({ accepted: "#10b981", wrong_answer: "#ef4444", pending: "#f59e0b", runtime_error: "#ef4444", time_limit_exceeded: "#f59e0b" }[s] || "var(--text-muted)");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {["", "accepted", "wrong_answer", "pending", "runtime_error"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", backgroundColor: statusFilter === s ? "rgba(245,158,11,0.15)" : "transparent", color: statusFilter === s ? "#f59e0b" : "var(--text-muted)" }}>{s || "All"}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{pagination.total} submissions</span>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["User", "Problem", "Language", "Status", "Runtime", "Memory", "Date", ""].map(h => (
            <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            subs.map(s => (
              <>
                <tr key={s.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{s.user?.name}</td>
                  <td style={{ ...tableCell, color: "var(--text-muted)" }}>{s.problem?.title}</td>
                  <td style={{ ...tableCell, fontSize: 12, color: "var(--text)", textTransform: "capitalize" }}>{s.language}</td>
                  <td style={tableCell}><span style={{ fontSize: 11, fontWeight: 700, color: statusColor(s.status) }}>{s.status}</span></td>
                  <td style={{ ...tableCell, color: "var(--text-muted)" }}>{s.runtimeMs ? `${s.runtimeMs}ms` : "—"}</td>
                  <td style={{ ...tableCell, color: "var(--text-muted)" }}>{s.memoryKb ? `${s.memoryKb}KB` : "—"}</td>
                  <td style={{ ...tableCell, fontSize: 12, color: "var(--text-muted)" }}>{new Date(s.createdAt).toLocaleString()}</td>
                  <td style={tableCell}>
                    <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{expanded === s.id ? "Hide" : "Code"}</button>
                  </td>
                </tr>
                {expanded === s.id && (
                  <tr key={s.id + "-code"}><td colSpan={8} style={{ padding: 12 }}>
                    <pre style={{ margin: 0, padding: 16, borderRadius: 10, backgroundColor: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "monospace", overflow: "auto", maxHeight: 300, color: "var(--text)", whiteSpace: "pre-wrap" }}>{s.code}</pre>
                  </td></tr>
                )}
              </>
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
