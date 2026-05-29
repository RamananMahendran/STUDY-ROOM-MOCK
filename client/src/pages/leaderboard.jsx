import { useState } from "react";

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


// ── Leaderboard Page ──────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [selectedProblem, setSelectedProblem] = useState("Reverse a String");

  const entries = leaderboardData[selectedProblem] ?? [];

  return (
    <>
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
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px", background: "var(--bg)" }}>
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
    </>
  );
}