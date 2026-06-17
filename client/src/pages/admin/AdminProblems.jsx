import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });

const DiffBadge = ({ d }) => {
  const c = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };
  return <span style={{ fontSize: 11, fontWeight: 700, color: c[d?.toLowerCase()] || "var(--text-muted)", textTransform: "capitalize" }}>{d}</span>;
};

const emptyForm = { title: "", description: "", difficulty: "easy", tags: "", testCases: "[]", starterCode: "{}", hints: "", constraints: "", isPremium: false, leetcodeUrl: "" };

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set("search", search);
    if (diffFilter) params.set("difficulty", diffFilter);
    fetch(`${API}/api/admin/problems?${params}`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) { setProblems(d.data); setPagination(d.pagination); } })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [diffFilter]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title || "", description: p.description || "", difficulty: p.difficulty || "easy", tags: (p.tags || []).join(", "), testCases: JSON.stringify(p.testCases || [], null, 2), starterCode: JSON.stringify(p.starterCode || {}, null, 2), hints: (p.hints || []).join("\n"), constraints: p.constraints || "", isPremium: p.isPremium || false, leetcodeUrl: p.leetcodeUrl || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), hints: form.hints.split("\n").filter(Boolean) };
    try { body.testCases = JSON.parse(form.testCases); } catch { body.testCases = []; }
    try { body.starterCode = JSON.parse(form.starterCode); } catch { body.starterCode = {}; }

    const url = editId ? `${API}/api/admin/problems/${editId}` : `${API}/api/admin/problems`;
    const method = editId ? "PUT" : "POST";
    fetch(url, { method, headers: headers(), body: JSON.stringify(body) })
      .then(r => r.json()).then(d => { if (d.success) { setShowForm(false); load(pagination.page); } })
      .catch(console.error);
  };

  const deleteProblem = (id) => {
    if (!confirm("Delete this problem?")) return;
    fetch(`${API}/api/admin/problems/${id}`, { method: "DELETE", headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) load(pagination.page); })
      .catch(console.error);
  };

  const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };
  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--surface-2)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <form onSubmit={e => { e.preventDefault(); load(1); }} style={{ display: "flex", gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems..." style={{ ...inputStyle, width: 260 }} />
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
        </form>
        <div style={{ display: "flex", gap: 4 }}>
          {["", "easy", "medium", "hard"].map(d => (
            <button key={d} onClick={() => setDiffFilter(d)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", backgroundColor: diffFilter === d ? "rgba(245,158,11,0.15)" : "transparent", color: diffFilter === d ? "#f59e0b" : "var(--text-muted)" }}>{d || "All"}</button>
          ))}
        </div>
        <button onClick={openCreate} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Problem</button>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["ID", "Title", "Difficulty", "Tags", "Premium", "Created", "Actions"].map(h => (
              <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            problems.length === 0 ? <tr><td colSpan={7} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>No problems found</td></tr> :
            problems.map(p => (
              <tr key={p.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ ...tableCell, color: "var(--text-muted)" }}>#{p.id}</td>
                <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{p.title}</td>
                <td style={tableCell}><DiffBadge d={p.difficulty} /></td>
                <td style={{ ...tableCell, color: "var(--text-muted)", fontSize: 11 }}>{(p.tags || []).slice(0, 3).join(", ")}</td>
                <td style={tableCell}>{p.isPremium ? "⭐" : "—"}</td>
                <td style={{ ...tableCell, color: "var(--text-muted)", fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td style={{ ...tableCell, display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                  <button onClick={() => deleteProblem(p.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </td>
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

      {/* Create/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ padding: 24, borderRadius: 16, backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxWidth: 600, width: "90%", maxHeight: "85vh", overflow: "auto" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{editId ? "Edit Problem" : "Create Problem"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required style={inputStyle} />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" required rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (comma separated)" style={inputStyle} />
              <textarea value={form.testCases} onChange={e => setForm(f => ({ ...f, testCases: e.target.value }))} placeholder="Test Cases (JSON)" rows={3} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} />
              <textarea value={form.starterCode} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))} placeholder="Starter Code (JSON)" rows={3} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} />
              <textarea value={form.hints} onChange={e => setForm(f => ({ ...f, hints: e.target.value }))} placeholder="Hints (one per line)" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              <input value={form.constraints} onChange={e => setForm(f => ({ ...f, constraints: e.target.value }))} placeholder="Constraints" style={inputStyle} />
              <input value={form.leetcodeUrl} onChange={e => setForm(f => ({ ...f, leetcodeUrl: e.target.value }))} placeholder="LeetCode URL (optional)" style={inputStyle} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <input type="checkbox" checked={form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} /> Premium Problem
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
