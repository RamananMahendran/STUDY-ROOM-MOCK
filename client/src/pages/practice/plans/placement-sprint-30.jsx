import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── CUSTOM INLINE SVG ICONS ──────────────────────────────────────────────────
const IcoRocket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
    <path d="M12 2C7.5 2 4 5.5 4 10c0 4.5 3.5 8 8 8s8-3.5 8-8c0-4.5-3.5-8-8-8z" />
    <path d="M12 6v8" />
  </svg>
);

const IcoArrowLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IcoArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IcoPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const IcoCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const IcoBookOpen = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IcoRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 1 0 2.13-5.85L21 8" />
  </svg>
);

const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const getDayTitle = (dayNumber) => {
  const titles = {
    1: "Array fundamentals",
    2: "Array fundamentals II",
    3: "String basics",
    4: "Two pointers technique",
    5: "Sliding window technique",
    6: "Binary search basic",
    7: "Binary search intermediate",
    8: "Recursion primer",
    9: "Backtracking algorithms",
    10: "Sorting patterns",
    11: "Sorting algorithms",
    12: "Linked list intro",
    13: "Linked list loops",
    14: "Stack operations",
    15: "Queue operations",
    16: "Tree traversal",
    17: "Binary search tree",
    18: "Graph representation",
    19: "Graph search (BFS/DFS)",
    20: "Dynamic programming intro",
    21: "DP knapsack patterns",
    22: "Greedy algorithms",
    23: "Bit manipulation",
    24: "Hash map optimizations",
    25: "Trie structure",
    26: "Heap operations",
    27: "Sliding window medium",
    28: "Two pointers medium",
    29: "Mock interview sprint",
    30: "Final verification day"
  };
  return titles[dayNumber] || `Day ${dayNumber} practice challenges`;
};

export default function PlacementSprint30() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("free");

  const slug = "placement-sprint-30";

  const fetchData = async () => {
    try {
      const headers = authHeaders();
      const planRes = await fetch(`${API}/api/study-plans/${slug}`, { headers });
      const planData = await planRes.json();
      if (planData.success) {
        setPlan(planData.data);
      } else {
        throw new Error(planData.error || "Failed to load study plan");
      }

      if (getToken()) {
        const subRes = await fetch(`${API}/api/submissions/user/history`, { headers });
        const subData = await subRes.json();
        if (subData.success) {
          setSubmissions(subData.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.role) {
          setUserRole(userObj.role);
        }
      } catch (e) {}
    }
    fetchData();
  }, []);

  const solvedProblemIds = new Set(
    submissions
      .filter(s => s.status === 'accepted' || s.status === 'SUCCESS' || s.status === 'ACCEPTED')
      .map(s => s.problemId)
  );

  const isEnrolled = plan && !!plan.userProgress;
  const currentDayNumber = plan?.userProgress?.currentDay || 1;

  const days = [];
  let totalProblems = 0;
  let solvedCount = 0;

  if (plan) {
    totalProblems = plan.planProblems.length;
    solvedCount = plan.planProblems.filter(pp => solvedProblemIds.has(pp.problemId)).length;

    const dayProblemsMap = {};
    plan.planProblems.forEach(pp => {
      if (!dayProblemsMap[pp.dayNumber]) {
        dayProblemsMap[pp.dayNumber] = [];
      }
      dayProblemsMap[pp.dayNumber].push(pp);
    });

    for (let d = 1; d <= plan.durationDays; d++) {
      const dayProblems = dayProblemsMap[d] || [];
      const daySolved = dayProblems.filter(pp => solvedProblemIds.has(pp.problemId)).length;
      const dayTotal = dayProblems.length;
      const isDaySolved = dayTotal > 0 && daySolved === dayTotal;
      const isDayMarkedCompleted = plan.userProgress?.completedDays?.includes(d) || false;

      days.push({
        dayNumber: d,
        title: getDayTitle(d),
        progress: `${daySolved} / ${dayTotal}`,
        problems: dayProblems.map(pp => ({
          dbId: pp.problem.id,
          id: pp.problem.slug,
          name: pp.problem.title,
          difficulty: pp.problem.difficulty.charAt(0).toUpperCase() + pp.problem.difficulty.slice(1).toLowerCase(),
        })),
        isRestDay: dayTotal === 0,
        isDaySolved,
        isDayMarkedCompleted
      });
    }
  }

  // Automatically mark day as completed in the DB if solved but not marked
  useEffect(() => {
    if (isEnrolled && plan) {
      days.forEach(async (day) => {
        if (!day.isRestDay && day.isDaySolved && !day.isDayMarkedCompleted) {
          try {
            await fetch(`${API}/api/study-plans/${slug}/complete-day`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...authHeaders()
              },
              body: JSON.stringify({ dayNumber: day.dayNumber })
            });
            fetchData();
          } catch (err) {
            console.error("Failed to auto-complete day:", err);
          }
        }
      });
    }
  }, [isEnrolled, plan, submissions]);

  const handleEnroll = async () => {
    if (!getToken()) {
      alert("Please log in to start this plan.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API}/api/study-plans/${slug}/start`, {
        method: "POST",
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert("Failed to start plan: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm("Are you sure you want to unenroll? This will reset your progress for this plan.")) {
      return;
    }
    try {
      const res = await fetch(`${API}/api/study-plans/${slug}/unenroll`, {
        method: "POST",
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert("Failed to unenroll: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset your schedule?")) {
      return;
    }
    try {
      await fetch(`${API}/api/study-plans/${slug}/unenroll`, {
        method: "POST",
        headers: authHeaders()
      });
      await fetch(`${API}/api/study-plans/${slug}/start`, {
        method: "POST",
        headers: authHeaders()
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-[var(--text-muted)]">
        <span>Loading study plan details...</span>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-rose-500">
        <span>Error: {error || "Plan not found"}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full px-6 py-8">
      <div className="max-w-[880px] mx-auto flex flex-col gap-6">

        {/* BACKWARDS DIRECTORY ROUTE REDIRECT CONTROL */}
        <div>
          <button onClick={() => navigate('/practice/study-plans')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shadow-sm">
            <IcoArrowLeft />
            <span>All plans</span>
          </button>
        </div>

        {/* HERO HERO CONTAINER BANNER HIGHLIGHT LAYER */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden shadow-[var(--card-shadow)]">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IcoRocket />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)] mb-1">{plan.title}</h1>
              <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3">
                Free · Beginner-friendly
              </p>
              <p className="text-[13px] text-[var(--text-subtle)] leading-relaxed max-w-xl mb-5">
                {plan.description}
              </p>
              <div className="flex flex-wrap items-center gap-5 text-[12px] font-semibold text-[var(--text-subtle)]">
                <div className="flex items-center gap-1.5">
                  <IcoCalendar />
                  <span>{plan.durationDays} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IcoBookOpen />
                  <span>{totalProblems} problems</span>
                </div>
                {isEnrolled && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="font-bold text-[#6366f1]">Day {currentDayNumber} of {plan.durationDays}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION EXECUTION HERO RADIAL BUTTON LAYER */}
          {isEnrolled ? (
            <div className="w-24 h-24 rounded-full border-[6px] border-[var(--border)] bg-[var(--surface-2)] flex flex-col items-center justify-center flex-shrink-0 relative mr-4">
              <span className="text-xl font-black text-[var(--text)]">{progressPercent}<span className="text-[14px]">%</span></span>
              <span className="text-[10px] font-bold text-[var(--text-muted)] mt-[-2px]">{solvedCount}/{totalProblems}</span>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-extrabold shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <IcoPlay />
              <span>Start plan</span>
            </button>
          )}
        </div>

        {/* ACTION ROW */}
        {isEnrolled && (
          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0">
              <IcoRefresh />
              <span>Reset schedule</span>
            </button>
            <button
              onClick={handleUnenroll}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-rose-500/30 hover:border-rose-500/50 text-rose-500 text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <IcoTrash />
              <span>Unenroll</span>
            </button>
          </div>
        )}

        {/* CURRICULUM SCHEDULING TRAILER PIPELINE STACK */}
        <div className="flex flex-col gap-4 mt-2">
          {days.map((day) => (
            <div key={day.dayNumber} className={`bg-[var(--surface)] border rounded-xl overflow-hidden shadow-[var(--card-shadow)] ${isEnrolled && day.dayNumber === currentDayNumber ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-[var(--border)]'}`}>

              {/* SUB-HEADER DAY META BLOCK SECTION CARD HEAD ROW */}
              <div className={`px-5 py-4 border-b flex items-center justify-between ${isEnrolled && day.dayNumber === currentDayNumber ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-[var(--surface-2)]/30 border-[var(--border)]'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black font-mono ${isEnrolled && day.dayNumber === currentDayNumber ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30' : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]'}`}>
                    {day.dayNumber}
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider uppercase font-mono mb-0.5 flex items-center gap-1.5">
                      <span className={isEnrolled && day.dayNumber === currentDayNumber ? 'text-indigo-500' : 'text-[var(--text-muted)]'}>DAY {day.dayNumber}</span>
                      {isEnrolled && day.dayNumber === currentDayNumber && (
                        <>
                          <span className="text-[var(--text-subtle)]">·</span>
                          <span className="text-indigo-500">TODAY</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-[13px] font-bold text-[var(--text)] tracking-tight">
                      {day.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold font-mono text-[var(--text-muted)]">
                  {day.progress}
                </span>
              </div>

              {/* NESTED ASSIGNED CODING LABELS ACCORDION STREAM ROWS */}
              <div className="flex flex-col">
                {day.problems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => navigate(`/practice/problems/${problem.id}`)}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-none hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* SOLVED OR UNCHECKED STATUS INDICATOR BULLET */}
                      {solvedProblemIds.has(problem.dbId) ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] group-hover:border-indigo-500/50 flex-shrink-0 transition-colors" />
                      )}
                      <span className="text-[12.5px] font-semibold text-[var(--text)] group-hover:text-indigo-500 transition-colors">
                        {problem.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase font-sans">
                        {problem.difficulty}
                      </span>
                      <span className="text-[var(--text-subtle)] group-hover:text-indigo-500 transition-colors pl-1">
                        <IcoArrowRight />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}