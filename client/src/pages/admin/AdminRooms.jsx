import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });
const tableCell = { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/rooms`, { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setRooms(d.data); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteRoom = (id) => {
    if (!confirm("Delete this room?")) return;
    fetch(`${API}/api/admin/rooms/${id}`, { method: "DELETE", headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) load(); }).catch(console.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{rooms.length} rooms in database</span>
      <div style={{ borderRadius: 14, border: "1px solid var(--border)", backgroundColor: "var(--surface)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Room Name", "ID", "Owner", "Type", "Private", "Members", "Created", "Actions"].map(h => (
            <th key={h} style={{ ...tableCell, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
          ))}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr> :
            rooms.length === 0 ? <tr><td colSpan={8} style={{ ...tableCell, textAlign: "center", color: "var(--text-muted)" }}>No rooms</td></tr> :
            rooms.map(r => (
              <tr key={r.id} onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ ...tableCell, fontWeight: 600, color: "var(--text)" }}>{r.name}</td>
                <td style={{ ...tableCell, fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{r.id}</td>
                <td style={{ ...tableCell, color: "var(--text-muted)" }}>{r.owner?.name || "—"}</td>
                <td style={tableCell}><span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", textTransform: "capitalize" }}>{r.roomType}</span></td>
                <td style={tableCell}>{r.isPrivate ? "🔒" : "🌐"}</td>
                <td style={{ ...tableCell, color: "var(--text)" }}>{r._count?.members || 0}</td>
                <td style={{ ...tableCell, fontSize: 12, color: "var(--text-muted)" }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={tableCell}>
                  <button onClick={() => deleteRoom(r.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
