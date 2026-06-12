import React, { useState, useEffect } from "react";
// ── CUSTOM SVG ICONS ─────────────────────────────────────────────────────────
const IcoUserCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
  </svg>
);

const IcoMail = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IcoSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const IcoUser = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IcoUsers = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

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

const IcoFire = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const TABS = [
  { id: "friends", label: "Friends" },
  { id: "requests", label: "Requests" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "invite", label: "Invite" }
];



const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Community() {
  const [activeTab, setActiveTab] = useState("friends");
  const [leaderboardTab, setLeaderboardTab] = useState("study");
  
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [toast, setToast] = useState(null);

  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [studyLeadersList, setStudyLeadersList] = useState([]);
  const [codingLeadersList, setCodingLeadersList] = useState([]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFriendships = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/friendships`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setFriends(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching friendships:", err);
    }
  };

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/friendships/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchLeaderboards = async () => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const [studyRes, codingRes] = await Promise.all([
        fetch(`${API}/api/leaderboards/study`, { headers }),
        fetch(`${API}/api/leaderboards/coding`, { headers })
      ]);
      const studyData = await studyRes.json();
      const codingData = await codingRes.json();
      if (studyData.success) {
        setStudyLeadersList(studyData.data || []);
      }
      if (codingData.success) {
        setCodingLeadersList(codingData.data || []);
      }
    } catch (err) {
      console.error("Error fetching leaderboards:", err);
    }
  };

  useEffect(() => {
    fetchFriendships();
    fetchRequests();
    fetchLeaderboards();
  }, []);

  const handleInvite = async (e) => {
    if (e) e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    
    if (!email) {
      showToast("Please enter an email address.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to send invites.", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/api/friendships/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to send invite.", "error");
        return;
      }

      showToast(data.message || "Invite sent successfully!", "success");
      setInviteEmail("");
      setIsInviting(false);
      fetchFriendships();
      fetchRequests();
    } catch (err) {
      console.error(err);
      showToast("An error occurred. Please try again.", "error");
    }
  };

  const handleAccept = async (friendshipId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/friendships/requests/${friendshipId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Friend request accepted!", "success");
        fetchFriendships();
        fetchRequests();
        fetchLeaderboards();
      } else {
        showToast(data.error || "Failed to accept request.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred.", "error");
    }
  };

  const handleDeclineOrCancel = async (friendshipId, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/friendships/requests/${friendshipId}/decline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        let msg = "Friend request declined.";
        if (actionType === "cancel") msg = "Friend request cancelled.";
        if (actionType === "unfriend") msg = "Friend removed.";
        showToast(data.message || msg, "success");
        fetchFriendships();
        fetchRequests();
        fetchLeaderboards();
      } else {
        showToast(data.error || "Failed to process request.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred.", "error");
    }
  };

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
                <p className="text-[13px] font-medium flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                  Invite friends and study together. 
                  <span className="text-[var(--text-subtle)]">•</span>
                  <span className="flex items-center gap-1.5" style={{ color: "#10b981", fontWeight: 600 }}>
                     <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> 
                     8 rooms studying now
                  </span>
                </p>
              </div>
              
              <button 
                onClick={() => { setActiveTab("friends"); setIsInviting(true); }}
                className="flex items-center gap-1.5 px-8 py-6 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-bold shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer border-none"
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

            {/* TAB CONTENT CONDITIONAL SWITCH: FRIENDS LIST OR EMPTY STATE DISPLAY */}
            {activeTab === "friends" && (
              <div className="flex flex-col items-center justify-center w-full">
                
                {/* INVITE INPUT BLOCK */}
                {isInviting && (
                  <div className="mb-8 w-full flex items-center p-2 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex-1 flex items-center gap-2 px-3">
                      <div className="text-[var(--text-muted)] flex items-center"><IcoMail /></div>
                      <input 
                        type="text" 
                        placeholder="Enter email to add friend..." 
                        className="bg-transparent border-none outline-none text-[12px] text-[var(--text)] w-full placeholder-[var(--text-muted)] font-medium" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleInvite(); }}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2 pr-1">
                      <button onClick={handleInvite} className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold flex items-center gap-1.5 border-none cursor-pointer transition-colors">
                        <IcoAddUser /> Add
                      </button>
                      <button onClick={() => setIsInviting(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[var(--text-muted)] border-none cursor-pointer transition-colors bg-transparent">
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {friends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8 px-6">
                    <div className="mb-4 animate-pulse" style={{ color: "var(--text-muted)" }}>
                      <IcoUsersEmpty />
                    </div>
                    
                    <h3 className="text-[14px] font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                      Your friends list is empty
                    </h3>
                    <p className="text-[12px] leading-relaxed max-w-[340px] mb-6 font-normal" style={{ color: "var(--text-muted)" }}>
                      Invite someone by email — you get a free study buddy, they get a personal invite with your name on it.
                    </p>

                    {!isInviting && (
                      <button 
                        onClick={() => setIsInviting(true)}
                        className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[11px] font-bold shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer border-none"
                      >
                        Invite a friend
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 w-full">
                    {friends.map((friend) => {
                      const bgColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#3b82f6'];
                      const bg = bgColors[friend.id % bgColors.length];
                      const initial = friend.name ? friend.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
                      return (
                        <div key={friend.id} className="flex items-center justify-between p-3.5 rounded-xl w-full" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 overflow-hidden" style={{ backgroundColor: bg }}>
                              {initial}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[var(--text)] truncate">{friend.name}</span>
                                {friend.streakCount > 0 && (
                                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-orange-500 flex-shrink-0">
                                    <IcoFire /> {friend.streakCount}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[var(--text-muted)] truncate">{friend.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:flex flex-col">
                              <span className="text-[11px] font-bold text-[var(--text)]">{friend.totalStudyHours || 0}h study</span>
                              <span className="text-[9px] text-[var(--text-muted)]">{friend.problemsSolved || 0} solved</span>
                            </div>
                            <button
                              onClick={() => handleDeclineOrCancel(friend.friendshipId, "unfriend")}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold border-none cursor-pointer transition-colors"
                            >
                              Unfriend
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === "requests" && (
              <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase">Incoming</h4>
                  {incomingRequests.length === 0 ? (
                    <div className="flex items-center justify-center py-12 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-2 text-[var(--text-muted)] text-[12px] font-medium">
                        <IcoUserCheck /> No pending requests
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {incomingRequests.map((req) => {
                        const bgColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#3b82f6'];
                        const bg = bgColors[req.id % bgColors.length];
                        const initial = req.name ? req.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
                        return (
                          <div key={req.friendshipId} className="flex items-center justify-between p-3.5 rounded-xl w-full" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 overflow-hidden" style={{ backgroundColor: bg }}>
                                {initial}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-[var(--text)] truncate">{req.name}</span>
                                <span className="text-[10px] text-[var(--text-muted)] truncate">{req.email}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(req.friendshipId)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold border-none cursor-pointer transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineOrCancel(req.friendshipId, "decline")}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold border-none cursor-pointer transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase">Sent</h4>
                  {outgoingRequests.length === 0 ? (
                    <div className="flex items-center justify-center py-12 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-2 text-[var(--text-muted)] text-[12px] font-medium">
                        No outgoing requests
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {outgoingRequests.map((req) => {
                        const bgColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#3b82f6'];
                        const bg = bgColors[req.id % bgColors.length];
                        const initial = req.name ? req.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
                        return (
                          <div key={req.friendshipId} className="flex items-center justify-between p-3.5 rounded-xl w-full" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 overflow-hidden" style={{ backgroundColor: bg }}>
                                {initial}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-[var(--text)] truncate">{req.name}</span>
                                <span className="text-[10px] text-[var(--text-muted)] truncate">{req.email}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeclineOrCancel(req.friendshipId, "cancel")}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] text-[10px] font-bold border-none cursor-pointer transition-colors"
                            >
                              Cancel Request
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === "leaderboard" && (
              <div className="flex flex-col w-full gap-6">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span className="text-[12px] font-semibold text-[var(--text)]">8 rooms studying right now</span>
                </div>

                <div className="flex items-center p-1 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <button 
                    onClick={() => setLeaderboardTab("study")}
                    className="flex-1 py-2 text-[11px] font-bold flex justify-center items-center gap-2 rounded-lg border-none cursor-pointer transition-all duration-150" 
                    style={{ 
                      backgroundColor: leaderboardTab === "study" ? "var(--surface-2)" : "transparent", 
                      color: leaderboardTab === "study" ? "#fbbf24" : "var(--text-muted)", 
                      border: leaderboardTab === "study" ? "1px solid var(--border)" : "1px solid transparent"
                    }}>
                    <IcoFire /> Study Leaders
                  </button>
                  <button 
                    onClick={() => setLeaderboardTab("coding")}
                    className="flex-1 py-2 text-[11px] font-bold flex justify-center items-center gap-2 rounded-lg border-none cursor-pointer transition-all duration-150" 
                    style={{ 
                      backgroundColor: leaderboardTab === "coding" ? "var(--surface-2)" : "transparent", 
                      color: leaderboardTab === "coding" ? "#818cf8" : "var(--text-muted)", 
                      border: leaderboardTab === "coding" ? "1px solid var(--border)" : "1px solid transparent"
                    }}>
                    &lt;/&gt; Coding Leaders
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {(leaderboardTab === "study" ? studyLeadersList : codingLeadersList).map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: user.isYou ? "1px solid rgba(251, 191, 36, 0.4)" : "1px solid var(--border)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-5 flex justify-center text-[12px] font-bold text-[var(--text-muted)]">
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                          </div>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[12px] overflow-hidden" style={{ backgroundColor: user.bg }}>
                            {user.initial || user.name.charAt(0)}
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[13px] font-bold text-[var(--text)] truncate">{user.name}</span>
                            {user.isYou && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-500 flex-shrink-0">You</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[14px] font-black" style={{ color: leaderboardTab === "study" ? "#fbbf24" : "#818cf8" }}>{user.score}</span>
                          <span className="text-[9px] text-[var(--text-muted)] font-medium">{user.label}</span>
                        </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center py-3 rounded-xl text-[11px] font-medium mt-1" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  Solve coding problems to appear here 💻
                </div>
              </div>
            )}

            {/* INVITE TAB */}
            {activeTab === "invite" && (
              <div className="flex flex-col gap-10 w-full">
                <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#6366f1] text-white">
                      <IcoAddUser />
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                        <h2 className="text-[14px] font-bold text-[var(--text)] m-0">Invite someone to Study Room</h2>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-lg m-0">
                          Already have an account? They'll get a friend request instantly. New to Study Room? They'll receive a branded email invite.
                        </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
                      <div className="text-[var(--text-muted)] flex items-center"><IcoMail /></div>
                      <input 
                        type="text" 
                        placeholder="friend@email.com" 
                        className="bg-transparent border-none outline-none text-[12px] text-[var(--text)] w-full placeholder-[var(--text-muted)] font-medium" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleInvite(); }}
                      />
                    </div>
                    <button type="button" onClick={handleInvite} className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-bold flex items-center gap-1.5 border-none cursor-pointer transition-colors shadow-lg shadow-indigo-500/20">
                      <IcoSend /> Send
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase ml-1">How it works</h4>
                  <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4 p-3.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10"><IcoUser color="#818cf8" /></div>
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">Existing users receive a friend request — no email needed.</span>
                      </div>
                      <div className="flex items-center gap-4 p-3.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10"><IcoMail color="#fbbf24" /></div>
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">New users get a branded invite email with a one-click join link.</span>
                      </div>
                      <div className="flex items-center gap-4 p-3.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10"><IcoUsers color="#34d399" /></div>
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">You're auto-connected as friends when they accept.</span>
                      </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* CUSTOM TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl transition-all" style={{ backgroundColor: "#18181b", border: toast.type === "error" ? "1px solid #ef4444" : "1px solid #10b981", color: "#fff", zIndex: 99999, animation: "fadeIn 0.2s ease-out" }}>
            {toast.type === "error" ? (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">✕</div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">✓</div>
            )}
            <span className="text-[13px] font-medium">{toast.message}</span>
          </div>
        )}
    </>
  );
}