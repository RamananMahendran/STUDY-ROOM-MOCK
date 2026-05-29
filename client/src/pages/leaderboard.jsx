import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

// ── Data ──────────────────────────────────────────────────────────────────────
const problems = [
  { id: 1,  label: "E", name: "Two Sum" },
  { id: 2,  label: "E", name: "Reverse a String" },
  { id: 3,  label: "E", name: "FizzBuzz" },
  { id: 4,  label: "M", name: "Maximum Subarray" },
  { id: 5,  label: "M", name: "Valid Parentheses" },
  { id: 6,  label: "E", name: "Palindrome Check" },
  { id: 7,  label: "E", name: "Find Maximum" },
  { id: 8,  label: "E", name: "Array Sum" },
  { id: 9,  label: "E", name: "Count Vowels" },
  { id: 10, label: "E", name: "Factorial" },
  { id: 11, label: "E", name: "Fibonacci Number" },
  { id: 12, label: "E", name: "Check Anagram" },
  { id: 13, label: "E", name: "Power of Two" },
  { id: 14, label: "E", name: "Missing Number" },
  { id: 15, label: "M", name: "Binary Search" },
  { id: 16, label: "M", name: "Climbing Stairs" },
  { id: 17, label: "E", name: "Linear Search" },
  { id: 18, label: "M", name: "Rotate Array" },
  { id: 19, label: "M", name: "Coin Change" },
  { id: 20, label: "M", name: "Word Break" },
  { id: 21, label: "M", name: "House Robber" },
  { id: 22, label: "M", name: "Jump Game" },
  { id: 23, label: "H", name: "Longest Valid Parentheses" },
  { id: 24, label: "H", name: "Edit Distance" },
  { id: 25, label: "H", name: "Median of Two Sorted Arrays" },
  { id: 26, label: "E", name: "Plus One" },
  { id: 27, label: "E", name: "Squares of a Sorted Array" },
  { id: 28, label: "E", name: "Intersection of Two Arrays" },
  { id: 29, label: "M", name: "Best Time to Buy and Sell Stock II" },
  { id: 30, label: "M", name: "Unique Paths" },
  { id: 31, label: "M", name: "Longest Increasing Subsequence" },
  { id: 32, label: "M", name: "Search in Rotated Sorted Array" },
  { id: 33, label: "M", name: "Longest Palindromic Substring" },
  { id: 34, label: "M", name: "Kth Largest Element in an Array" },
  { id: 35, label: "M", name: "Maximum Product Subarray" },
  { id: 36, label: "M", name: "Decode String" },
  { id: 37, label: "M", name: "Sort Colors" },
  { id: 38, label: "H", name: "Sliding Window Maximum" },
  { id: 39, label: "H", name: "Minimum Window Substring" },
  { id: 40, label: "H", name: "Largest Rectangle in Histogram" },
];

const difficultyStyle = {
  H: { background: "#ef4444", color: "#fff" },
  M: { background: "#f59e0b", color: "#fff" },
  E: { background: "#22c55e", color: "#fff" },
};

const leaderboardData = {
  "Reverse a String": [
    { name: "Logitha Logitha",            lang: "Python", score: 100, avatarBg: "#10b981", initial: "L" },
    { name: "SIVASABARI GANESAN A 230701321", lang: "Java", score: 100, avatarBg: "#e85d04", initial: "S" },
    { name: "SUBHASH K 250701748",        lang: "Python", score: 100, avatarBg: "#e85d04", initial: "S" },
    { name: "dhanusri",                   lang: "Python", score: 100, avatarBg: "#6c63ff", initial: "d" },
    { name: "H Vikash",                   lang: "Python", score: 100, avatarBg: "#64748b", initial: "H" },
  ],
  "Two Sum": [
    { name: "SIVASABARI GANESAN A 230701321", lang: "Java", score: 100, avatarBg: "#e85d04", initial: "S" },
  ],
  "Coin Change": [],
  "FizzBuzz":    [],
};

const rankBadge = (i) => {
  if (i === 0) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥇</span>;
  if (i === 1) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥈</span>;
  if (i === 2) return <span style={{ fontSize: 20, lineHeight: 1 }}>🥉</span>;
  return (
    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", minWidth: 32, textAlign: "center", display: "inline-block" }}>
      #{i + 1}
    </span>
  );
};

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
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "inherit",
    color: "var(--text)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface-2)",
    flexShrink: 0,
  };

  if (view === "thread") return (
    <div style={{ ...panelStyle, width: 320, maxHeight: 400 }}>
      <div style={headerStyle}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{threadTitle}</span>
        <span style={{ fontSize: 10, color: "var(--text-subtle, #64748b)", flexShrink: 0 }}>Open · just now</span>
      </div>

      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", minHeight: 120 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.fromUser ? "flex-end" : "flex-start" }}>
            <div style={{
              background: msg.fromUser ? "#6366f1" : "var(--surface-2)",
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

      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px" }}>
          <input
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--text)", fontFamily: "inherit" }}
            placeholder="Type a reply… (⌘/Ctrl+Enter to send)"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={handleReplyKeyDown}
          />
          <button onClick={handleSendReply} disabled={!replyText.trim()} style={{ background: "none", border: "none", cursor: replyText.trim() ? "pointer" : "default", color: replyText.trim() ? "#6366f1" : "var(--text-muted)", display: "flex", padding: 0 }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  if (view === "new") return (
    <div style={{ ...panelStyle, width: 320 }}>
      <div style={headerStyle}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2 }}>
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
                background: category === cat ? "rgba(99,102,241,0.12)" : "var(--surface-2)",
                border: `1.5px solid ${category === cat ? "#6366f1" : "var(--border)"}`,
                color: category === cat ? "#818cf8" : "var(--text-muted)",
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
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "10px 12px",
            fontSize: 13, color: "var(--text)", outline: "none", fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 16px 14px", justifyContent: "flex-end" }}>
        <button onClick={() => setView("home")} style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          border: "1px solid var(--border)", background: "transparent",
          color: "var(--text-muted)", cursor: "pointer", fontFamily: "inherit",
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
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>How can we help?</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Real person, usually replies within a few hours</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 24px 24px", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>How can we help?</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
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

// ── Leaderboard Page ──────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState("Reverse a String");
  const [showMessage,     setShowMessage]     = useState(false);
  const [theme,           setTheme]           = useState("dark");
  const [activeNav,       setActiveNav]       = useState("practice");

  const entries = leaderboardData[selectedProblem] ?? [];

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%", overflow: "hidden",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      // CSS vars – dark theme defaults
      "--surface":    theme === "dark" ? "#12151c" : "#ffffff",
      "--surface-2":  theme === "dark" ? "#1a1f2e" : "#f1f5f9",
      "--border":     theme === "dark" ? "#1e2433" : "#e2e8f0",
      "--text":       theme === "dark" ? "#f1f5f9" : "#0f172a",
      "--text-muted": theme === "dark" ? "#94a3b8" : "#64748b",
      "--accent":     "#6366f1",
      "--accent-bg":  theme === "dark" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
      "--dur-fast":   "0.15s",
      background:     theme === "dark" ? "#0d1117" : "#f8fafc",
    }}>
      {/* Sidebar */}
      <Sidebar
        active={activeNav}
        onNav={(id, path) => {
          setActiveNav(id);
          if (path) navigate(path);
        }}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
      />

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TopBar */}
        <TopBar title="Leaderboard" subtitle="See how you rank across problems" />

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ── Problem list ── */}
          <div style={{
            width: 240, flexShrink: 0, overflowY: "auto",
            borderRight: "1px solid var(--border)",
            background: "var(--surface)",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--text-muted)",
              padding: "16px 20px 8px",
            }}>
              Select Problem
            </div>
            <div style={{ padding: "0 8px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
              {problems.map(p => {
                const isSelected = selectedProblem === p.name;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProblem(p.name)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", textAlign: "left",
                      padding: "7px 12px", borderRadius: 8, fontSize: 12,
                      fontFamily: "inherit", cursor: "pointer",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "var(--accent)" : "var(--text-muted)",
                      background: isSelected ? "var(--accent-bg)" : "transparent",
                      border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                      transition: "all 0.12s",
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 800,
                      ...difficultyStyle[p.label],
                    }}>
                      {p.label}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Leaderboard panel ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px", background: theme === "dark" ? "#0d1117" : "#f8fafc" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
              {selectedProblem}
            </h2>

            {entries.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  No accepted solutions yet. Be the first!
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {entries.map((entry, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 20px", borderRadius: 12,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}>
                    {/* Rank */}
                    <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {rankBadge(i)}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 14, color: "#fff",
                      background: entry.avatarBg || "#6366f1",
                    }}>
                      {entry.initial || entry.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.name}
                    </span>

                    {/* Lang */}
                    <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{entry.lang}</span>

                    {/* Score */}
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", flexShrink: 0 }}>{entry.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Floating message button ── */}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 1000 }}>
        {showMessage && <MessageWidget />}
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
    </div>
  );
}