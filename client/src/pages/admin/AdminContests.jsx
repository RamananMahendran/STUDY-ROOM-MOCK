import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });
const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };
const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--surface-2)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

const emptyForm = { title: "", description: "", startTime: "", endTime: "" };

export default function AdminContests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/contests`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setContests(d.data); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ title: c.title, description: c.description, startTime: new Date(c.startTime).toISOString().slice(0, 16), endTime: new Date(c.endTime).toISOString().slice(0, 16) });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `${API}/api/admin/contests/${editId}` : `${API}/api/admin/contests`;
    fetch(url, { method: editId ? "PUT" : "POST", headers: headers(), body: JSON.stringify(form) })
      .then(r => r.json()).then(d => { if (d.success) { setShowForm(false); load(); } })
      .catch(console.error);
  };

  const deleteContest = (id) => {
    if (!confirm("Delete this contest?")) return;
    fetch(`${API}/api/admin/contests/${id}`, { method: "DELETE", headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) load(); }).catch(console.error);
  };

  const getStatus = (c) => {
    const now = new Date();
    if (new Date(c.startTime) > now) return { label: "Upcoming", color: "#6366f1" };
    if (new Date(c.endTime) < now) return { label: "Past", color: "#64748b" };
    return { label: "Active", color: "#10b981" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{contests.length} contests</span>
        <button onClick={openCreate} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Contest</button>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Title", "Status", "Start", "End", "Participants", "Problems", "Actions"].map(h => (
            <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            contests.map(c => {
              const st = getStatus(c);
              return (
                <tr key={c.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{c.title}</td>
                  <td style={tableCell}><span style={{ fontSize: 11, fontWeight: 700, color: st.color }}>{st.label}</span></td>
                  <td style={{ ...tableCell, fontSize: 12, color: "var(--text-muted)" }}>{new Date(c.startTime).toLocaleString()}</td>
                  <td style={{ ...tableCell, fontSize: 12, color: "var(--text-muted)" }}>{new Date(c.endTime).toLocaleString()}</td>
                  <td style={{ ...tableCell, color: "var(--text)" }}>{c._count?.participants || 0}</td>
                  <td style={{ ...tableCell, color: "var(--text)" }}>{c._count?.problems || 0}</td>
                  <td style={{ ...tableCell, display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(c)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                    <button onClick={() => deleteContest(c.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ padding: 24, borderRadius: 16, backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxWidth: 500, width: "90%" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{editId ? "Edit Contest" : "Create Contest"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required style={inputStyle} />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" required rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <label style={{ fontSize: 12, color: "var(--text-muted)" }}>Start Time<input type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required style={{ ...inputStyle, marginTop: 4 }} /></label>
              <label style={{ fontSize: 12, color: "var(--text-muted)" }}>End Time<input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required style={{ ...inputStyle, marginTop: 4 }} /></label>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
