import React, { useState } from "react";
// ── CUSTOM SVG ICONS ─────────────────────────────────────────────────────────
const IcoAddUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="16" x2="22" y1="11" y2="11" />
  </svg>
);

const IcoUsersEmpty = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TABS = [
  { id: "friends", label: "Friends" },
  { id: "requests", label: "Requests" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "invite", label: "Invite" }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <>
        {/* MAIN BODY AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-10 md:py-12 flex flex-col items-center" style={{ backgroundColor: "var(--bg)" }}>
          <div className="w-full max-w-[840px] flex flex-col">
            
            {/* HEADER CONTROLS SECTION */}
            <div className="flex items-center justify-between mb-8"
            style = {{padding:"2rem 0"}}
            >
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight mb-1" style={{ color: "var(--text)" }}>
                  Community
                </h1>
                <p className="text-[12px] font-normal" style={{ color: "var(--text-muted)" }}>
                  Invite friends and study together.
                </p>
              </div>
              
              <button className="flex items-center gap-1.5 px-8 py-6 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-bold shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer"
                style = {{padding: "0.5rem", borderRadius: "0.5rem"}}
              >
                <IcoAddUser />
                <span>Add Friends</span>
              </button>
            </div>

            {/* SEGMENTED SUB-NAVIGATION TAB BAR */}
            <div className="rounded-xl p-1 flex items-center mb-16"
            style ={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", marginBottom: "4rem", borderRadius: "0.375rem"}}
            >
              {TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 text-center py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 border-none cursor-pointer"
                    style={{
                      padding: "0.4rem", borderRadius: "0.375rem", margin: "0.2rem", 
                      backgroundColor: isSelected ? "var(--surface-2)" : "transparent",
                      color: isSelected ? "var(--text)" : "var(--text-muted)",
                      boxShadow: isSelected ? "var(--card-shadow)" : "none",
                      border: isSelected ? "1px solid var(--border)" : "none"
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT CONDITIONAL SWITCH: FRIENDS EMPTY STATE DISPLAY */}
            {activeTab === "friends" && (
              <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                <div className="mb-4 animate-pulse" style={{ color: "var(--text-muted)" }}>
                  <IcoUsersEmpty />
                </div>
                
                <h3 className="text-[14px] font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                  Your friends list is empty
                </h3>
                <p className="text-[12px] leading-relaxed max-w-[340px] mb-6 font-normal" style={{ color: "var(--text-muted)" }}>
                  Invite someone by email — you get a free study buddy, they get a personal invite with your name on it.
                </p>

                <button className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer"
                style = {{padding: "0.5rem", borderRadius: "0.5rem"}}
                >
                  Invite a friend
                </button>
              </div>
            )}

            {/* EMPTY CONTAINER FALLBACK PLACEHOLDERS FOR ALTERNATIVE CHANNELS */}
            {activeTab !== "friends" && (
              <div className="text-center py-20 text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                No active updates available inside {TABS.find(t => t.id === activeTab)?.label} segment.
              </div>
            )}

          </div>
        </div>
    </>
  );
}