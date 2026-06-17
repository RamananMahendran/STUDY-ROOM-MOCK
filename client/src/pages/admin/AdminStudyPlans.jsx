import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });
const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };
const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--surface-2)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

const emptyForm = { title: "", description: "", difficulty: "beginner", durationDays: 7, problemCount: 0, isPro: false, icon: "", color: "" };

export default function AdminStudyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/study-plans`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setPlans(d.data); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title || "", description: p.description || "", difficulty: p.difficulty || "beginner", durationDays: p.durationDays || 7, problemCount: p.problemCount || 0, isPro: p.isPro || false, icon: p.icon || "", color: p.color || "" });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = { ...form, durationDays: Number(form.durationDays), problemCount: Number(form.problemCount) };
    const url = editId ? `${API}/api/admin/study-plans/${editId}` : `${API}/api/admin/study-plans`;
    fetch(url, { method: editId ? "PUT" : "POST", headers: headers(), body: JSON.stringify(body) })
      .then(r => r.json()).then(d => { if (d.success) { setShowForm(false); load(); } })
      .catch(console.error);
  };

  const deletePlan = (id) => {
    if (!confirm("Delete this study plan?")) return;
    fetch(`${API}/api/admin/study-plans/${id}`, { method: "DELETE", headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) load(); }).catch(console.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{plans.length} study plans</span>
        <button onClick={openCreate} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Plan</button>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Title", "Difficulty", "Duration", "Problems", "Pro", "Enrolled", "Actions"].map(h => (
            <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            plans.map(p => (
              <tr key={p.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{p.icon} {p.title}</td>
                <td style={{ ...tableCell, color: "var(--text-muted)", textTransform: "capitalize" }}>{p.difficulty}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{p.durationDays} days</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{p._count?.planProblems || p.problemCount}</td>
                <td style={tableCell}>{p.isPro ? "⭐" : "—"}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{p._count?.userProgress || 0}</td>
                <td style={{ ...tableCell, display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                  <button onClick={() => deletePlan(p.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ padding: 24, borderRadius: 16, backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxWidth: 500, width: "90%" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{editId ? "Edit Study Plan" : "Create Study Plan"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required style={inputStyle} />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" required rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
              </select>
              <div style={{ display: "flex", gap: 12 }}>
                <label style={{ flex: 1, fontSize: 12, color: "var(--text-muted)" }}>Duration (days)<input type="number" value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))} style={{ ...inputStyle, marginTop: 4 }} /></label>
                <label style={{ flex: 1, fontSize: 12, color: "var(--text-muted)" }}>Problem Count<input type="number" value={form.problemCount} onChange={e => setForm(f => ({ ...f, problemCount: e.target.value }))} style={{ ...inputStyle, marginTop: 4 }} /></label>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Icon (emoji)" style={{ ...inputStyle, flex: 1 }} />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="Color (hex)" style={{ ...inputStyle, flex: 1 }} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <input type="checkbox" checked={form.isPro} onChange={e => setForm(f => ({ ...f, isPro: e.target.checked }))} /> Pro Only
              </label>
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
