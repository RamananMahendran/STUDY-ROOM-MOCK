import { useState } from "react";

// ── Message Widget ─────────────────────────────────────────────────────────────
function MessageWidget() {
  const [view,          setView]         = useState("home");
  const [category,      setCategory]     = useState("Bug report");
  const [draftMessage,  setDraftMessage] = useState("");
  const [threadTitle,   setThreadTitle]  = useState("");
  const [messages,      setMessages]     = useState([]);
  const [replyText,     setReplyText]    = useState("");

  const categories = ["Bug report", "Question", "Feature request", "Something else"];
  const catIcon    = { "Bug report": "🐛", "Question": "💬", "Feature request": "✨", "Something else": "💭" };
  const getTime    = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendNew = () => {
    if (!draftMessage.trim()) return;
    setThreadTitle(draftMessage.trim());
    setMessages([{ text: draftMessage.trim(), time: getTime(), fromUser: true }]);
    setDraftMessage("");
    setView("thread");
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setMessages(prev => [...prev, { text: replyText.trim(), time: getTime(), fromUser: true }]);
    setReplyText("");
  };

  const handleReplyKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSendReply();
  };

  const panelStyle = {
    background: "var(--surface, #12151c)",
    border: "1px solid var(--border, #1e2433)",
    borderRadius: 16,
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "var(--text, #f1f5f9)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid var(--border, #1e2433)",
    background: "var(--surface-2, #1a1f2e)",
    flexShrink: 0,
  };

  if (view === "thread") return (
    <div style={{ ...panelStyle, width: 320, maxHeight: 400 }}>
      <div style={headerStyle}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted, #94a3b8)", display: "flex", padding: 2 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{threadTitle}</span>
        <span style={{ fontSize: 10, color: "var(--text-subtle, #64748b)", flexShrink: 0 }}>Open · just now</span>
      </div>

      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", minHeight: 120 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.fromUser ? "flex-end" : "flex-start" }}>
            <div style={{
              background: msg.fromUser ? "#6366f1" : "var(--surface-2, #1a1f2e)",
              color: "#fff",
              borderRadius: msg.fromUser ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              padding: "8px 12px",
              fontSize: 13,
              maxWidth: "80%",
            }}>
              {msg.text}
              <div style={{ fontSize: 10, marginTop: 3, textAlign: "right", opacity: 0.6 }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border, #1e2433)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2, #1a1f2e)", border: "1px solid var(--border, #1e2433)", borderRadius: 10, padding: "8px 12px" }}>
          <input
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--text, #f1f5f9)", fontFamily: "inherit" }}
            placeholder="Type a reply… (⌘/Ctrl+Enter to send)"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={handleReplyKeyDown}
          />
          <button onClick={handleSendReply} disabled={!replyText.trim()} style={{ background: "none", border: "none", cursor: replyText.trim() ? "pointer" : "default", color: replyText.trim() ? "#6366f1" : "var(--text-muted, #94a3b8)", display: "flex", padding: 0 }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  if (view === "new") return (
    <div style={{ ...panelStyle, width: 320 }}>
      <div style={headerStyle}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted, #94a3b8)", display: "flex", padding: 2 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>New message</span>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-subtle, #64748b)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>What's this about?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 10px", borderRadius: 8, fontSize: 12,
                fontFamily: "inherit", cursor: "pointer", fontWeight: 500,
                background: category === cat ? "rgba(99,102,241,0.12)" : "var(--surface-2, #1a1f2e)",
                border: `1.5px solid ${category === cat ? "#6366f1" : "var(--border, #1e2433)"}`,
                color: category === cat ? "#818cf8" : "var(--text-muted, #94a3b8)",
                transition: "all 0.15s",
              }}>
                <span>{catIcon[cat]}</span>{cat}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={5}
          placeholder="Type your message…"
          value={draftMessage}
          onChange={e => setDraftMessage(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box", resize: "none",
            background: "var(--surface-2, #1a1f2e)", border: "1px solid var(--border, #1e2433)",
            borderRadius: 8, padding: "10px 12px",
            fontSize: 13, color: "var(--text, #f1f5f9)", outline: "none", fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 16px 14px", justifyContent: "flex-end" }}>
        <button onClick={() => setView("home")} style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          border: "1px solid var(--border, #1e2433)", background: "transparent",
          color: "var(--text-muted, #94a3b8)", cursor: "pointer", fontFamily: "inherit",
        }}>Cancel</button>
        <button onClick={handleSendNew} disabled={!draftMessage.trim()} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700,
          border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff", cursor: draftMessage.trim() ? "pointer" : "default",
          opacity: draftMessage.trim() ? 1 : 0.45, fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          Send
        </button>
      </div>
    </div>
  );

  // home
  return (
    <div style={{ ...panelStyle, width: 280 }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border, #1e2433)" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>How can we help?</div>
        <div style={{ fontSize: 11, color: "var(--text-muted, #94a3b8)", marginTop: 2 }}>Real person, usually replies within a few hours</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 24px 24px", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface-2, #1a1f2e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>How can we help?</div>
        <div style={{ fontSize: 11, color: "var(--text-muted, #94a3b8)", textAlign: "center", lineHeight: 1.5 }}>
          Tap below to start a conversation. The founder reads every message personally.
        </div>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <button onClick={() => setView("new")} style={{
          width: "100%", padding: "10px 0", borderRadius: 10,
          border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          + New message
        </button>
      </div>
    </div>
  );
}

export default function FloatingMessage() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      <div className="floating-message-container" style={{ position: "fixed", right: 24, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 1000 }}>
        <div style={{ display: showMessage ? "block" : "none" }}>
          <MessageWidget />
        </div>
        <button
          onClick={() => setShowMessage(v => !v)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {showMessage
            ? <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            : <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          }
        </button>
      </div>
      <style>{`
        .floating-message-container { bottom: 24px; transition: opacity 0.2s, visibility 0.2s; }
        body.create-room-open .floating-message-container { opacity: 0; visibility: hidden; pointer-events: none; }
        @media (max-width: 768px) {
          .floating-message-container { bottom: 80px; }
        }
      `}</style>
    </>
  );
}
