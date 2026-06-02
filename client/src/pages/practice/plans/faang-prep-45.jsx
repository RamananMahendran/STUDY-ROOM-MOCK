import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import TopBar from "../../components/TopBar.jsx";

const IcoBolt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

const IcoRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
  </svg>
);

const IcoStars = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 c0 3.5 -2.5 6 -6 6 c3.5 0 6 2.5 6 6 c0 -3.5 2.5 -6 6 -6 c-3.5 0 -6 -2.5 -6 -6 z" />
    <path d="M19 3v4M17 5h4" />
    <circle cx="5" cy="19" r="1" />
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

const FAANG_DAYS = [
  { dayNumber: 1, title: "Array patterns I", progress: "0 / 2", problems: [{ name: "Maximum Subarray", difficulty: "Medium" }, { name: "Binary Search", difficulty: "Medium" }] },
  { dayNumber: 2, title: "Array patterns II", progress: "0 / 2", problems: [{ name: "Single Number", difficulty: "Medium" }, { name: "Contains Duplicate", difficulty: "Medium" }] },
  { dayNumber: 3, title: "String patterns I", progress: "0 / 2", problems: [{ name: "Valid Parentheses", difficulty: "Medium" }, { name: "Longest Common Prefix", difficulty: "Medium" }] },
  { dayNumber: 4, title: "String patterns II", progress: "0 / 2", problems: [{ name: "Roman to Integer", difficulty: "Medium" }, { name: "Longest Substring Without Repeating Characters", difficulty: "Medium" }] },
  { dayNumber: 5, title: "Two pointers deep", progress: "0 / 2", problems: [{ name: "Move Zeroes", difficulty: "Medium" }, { name: "Rotate Array", difficulty: "Medium" }] },
  { dayNumber: 6, title: "Sliding window mastery", progress: "0 / 2", problems: [{ name: "Longest Repeating Character Replacement", difficulty: "Medium" }, { name: "Longest Substring with At Most K Distinct Characters", difficulty: "Medium" }] },
  { dayNumber: 7, title: "Prefix sum + hash-table", progress: "0 / 2", problems: [{ name: "Word Break", difficulty: "Medium" }, { name: "Letter Combinations of a Phone Number", difficulty: "Medium" }] },
  { dayNumber: 8, title: "Binary search variants I", progress: "0 / 2", problems: [{ name: "Longest Increasing Subsequence", difficulty: "Medium" }, { name: "Search in Rotated Sorted Array", difficulty: "Medium" }] },
  { dayNumber: 9, title: "Binary search variants II", progress: "0 / 2", problems: [{ name: "Median of Two Sorted Arrays", difficulty: "Hard" }, { name: "Count Complete Tree Nodes", difficulty: "Medium" }] },
  { dayNumber: 10, title: "Heap problems", progress: "0 / 2", problems: [{ name: "Kth Largest Element in an Array", difficulty: "Medium" }, { name: "Top K Frequent Elements", difficulty: "Medium" }] },
  { dayNumber: 11, title: "Stack patterns", progress: "0 / 2", problems: [{ name: "Decode String", difficulty: "Medium" }, { name: "Reorder List", difficulty: "Medium" }] },
  { dayNumber: 12, title: "Monotonic stack", progress: "0 / 2", problems: [{ name: "Largest Rectangle in Histogram", difficulty: "Hard" }, { name: "Daily Temperatures", difficulty: "Medium" }] },
  { dayNumber: 13, title: "Sorting patterns", progress: "0 / 2", problems: [{ name: "Sort Colors", difficulty: "Medium" }, { name: "Sort Characters by Frequency", difficulty: "Medium" }] },
  { dayNumber: 14, title: "Divide & conquer", progress: "0 / 1", problems: [{ name: "Merge k Sorted Lists", difficulty: "Hard" }] },
  { dayNumber: 15, title: "Binary tree deep I", progress: "0 / 2", problems: [{ name: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium" }, { name: "Validate Binary Search Tree", difficulty: "Medium" }] },
  { dayNumber: 16, title: "Binary tree deep II", progress: "0 / 2", problems: [{ name: "Symmetric Tree", difficulty: "Easy" }, { name: "Minimum Depth of Binary Tree", difficulty: "Easy" }] },
  { dayNumber: 17, title: "DFS on trees", progress: "0 / 2", problems: [{ name: "Kth Smallest Element in a BST", difficulty: "Medium" }, { name: "Number of Connected Components in an Undirected Graph", difficulty: "Medium" }] },
  { dayNumber: 18, title: "BFS on graphs", progress: "0 / 2", problems: [{ name: "Course Schedule", difficulty: "Medium" }, { name: "Is Graph Bipartite?", difficulty: "Medium" }] },
  { dayNumber: 19, title: "Graph traversal", progress: "0 / 2", problems: [{ name: "Redundant Connection", difficulty: "Medium" }, { name: "Keys and Rooms", difficulty: "Medium" }] },
  { dayNumber: 20, title: "Union-find", progress: "0 / 2", problems: [{ name: "Number of Islands", difficulty: "Medium" }, { name: "Longest Consecutive Sequence", difficulty: "Medium" }] },
  { dayNumber: 21, title: "Topological sort", isRestDay: true },
  { dayNumber: 22, title: "DP foundations", progress: "0 / 2", problems: [{ name: "Climbing Stairs", difficulty: "Medium" }, { name: "Coin Change", difficulty: "Medium" }] },
  { dayNumber: 23, title: "DP on strings", progress: "0 / 2", problems: [{ name: "House Robber", difficulty: "Medium" }, { name: "Best Time to Buy and Sell Stock II", difficulty: "Medium" }] },
  { dayNumber: 24, title: "DP on grids", progress: "0 / 2", problems: [{ name: "Max Area of Island", difficulty: "Medium" }, { name: "Unique Paths", difficulty: "Medium" }] },
  { dayNumber: 25, title: "DP — knapsack flavors", progress: "0 / 2", problems: [{ name: "Longest Palindromic Substring", difficulty: "Medium" }, { name: "Maximum Product Subarray", difficulty: "Medium" }] },
  { dayNumber: 26, title: "DP — harder", progress: "0 / 2", problems: [{ name: "Trapping Rain Water", difficulty: "Hard" }, { name: "Generate Parentheses", difficulty: "Medium" }] },
  { dayNumber: 27, title: "DP review", progress: "0 / 2", problems: [{ name: "Partition Equal Subset Sum", difficulty: "Medium" }, { name: "House Robber II", difficulty: "Medium" }] },
  { dayNumber: 28, title: "DP boss day", progress: "0 / 2", problems: [{ name: "Longest Valid Parentheses", difficulty: "Hard" }, { name: "Product of Array Except Self", difficulty: "Hard" }] },
  { dayNumber: 29, title: "Backtracking I", progress: "0 / 2", problems: [{ name: "Subsets", difficulty: "Medium" }, { name: "Permutations", difficulty: "Medium" }] },
  { dayNumber: 30, title: "Backtracking II", progress: "0 / 2", problems: [{ name: "Combinations", difficulty: "Medium" }, { name: "Combination Sum", difficulty: "Medium" }] },
  { dayNumber: 31, title: "Backtracking III", progress: "0 / 2", problems: [{ name: "Word Search", difficulty: "Medium" }, { name: "Letter Case Permutation", difficulty: "Medium" }] },
  { dayNumber: 32, title: "Recursion patterns", progress: "0 / 2", problems: [{ name: "Reverse Linked List", difficulty: "Easy" }, { name: "Merge Two Sorted Lists", difficulty: "Easy" }] },
  { dayNumber: 33, title: "Bit tricks", progress: "0 / 2", problems: [{ name: "Power of Two", difficulty: "Easy" }, { name: "Missing Number", difficulty: "Easy" }] },
  { dayNumber: 34, title: "Math + combinatorics", progress: "0 / 2", problems: [{ name: "FizzBuzz", difficulty: "Easy" }, { name: "Array Sum", difficulty: "Easy" }] },
  { dayNumber: 35, title: "Mixed mock day I", progress: "0 / 2", problems: [{ name: "Container With Most Water", difficulty: "Hard" }, { name: "Binary Tree Maximum Path Sum", difficulty: "Hard" }] },
  { dayNumber: 36, title: "Hard array problems", progress: "0 / 1", problems: [{ name: "Sliding Window Maximum", difficulty: "Hard" }] },
  { dayNumber: 37, title: "Hard DP", progress: "0 / 1", problems: [{ name: "Edit Distance", difficulty: "Hard" }] },
  { dayNumber: 38, title: "Hard graph", isRestDay: true },
  { dayNumber: 39, title: "Hard strings", progress: "0 / 1", problems: [{ name: "Minimum Window Substring", difficulty: "Hard" }] },
  { dayNumber: 40, title: "Hard stack / deque", isRestDay: true },
  { dayNumber: 41, title: "Mock interview day", isRestDay: true },
  { dayNumber: 42, title: "Company set — Google", progress: "0 / 1", problems: [{ name: "Rotting Oranges", difficulty: "Medium" }] },
  { dayNumber: 43, title: "Company set — Amazon", progress: "0 / 2", problems: [{ name: "Add Two Numbers", difficulty: "Medium" }, { name: "Diameter of Binary Tree", difficulty: "Easy" }] },
  { dayNumber: 44, title: "Company set — Flipkart", progress: "0 / 2", problems: [{ name: "Linked List Cycle", difficulty: "Easy" }, { name: "Spiral Matrix", difficulty: "Medium" }] },
  { dayNumber: 45, title: "Review — weak topics", progress: "0 / 1", problems: [{ name: "Target Sum", difficulty: "Medium" }] },
];

export default function FaangPrep45() {
  const navigate = useNavigate();
  const [isEnrolled] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto w-full px-6 py-8">
      <div className="max-w-[880px] mx-auto flex flex-col gap-6">
        <div>
          <button 
            onClick={() => navigate('/practice/study-plans')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shadow-sm"
          >
            <IcoArrowLeft />
            <span>All plans</span>
          </button>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-[var(--card-shadow)]">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IcoBolt />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)] mb-1">FAANG Prep Intensive</h1>
              <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
                Pro · 45 days · 90 problems
                <span className="bg-indigo-500/20 text-indigo-500 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-indigo-500/30">PRO</span>
              </p>
              <p className="text-[13px] text-[var(--text-subtle)] leading-relaxed max-w-xl mb-5">
                A daily curriculum built to take you from zero to campus-placement ready in a month. Breadth over depth — you'll touch every pattern interviewers actually ask.
              </p>
              <div className="flex flex-wrap items-center gap-5 text-[12px] font-semibold text-[var(--text-subtle)]">
                <div className="flex items-center gap-1.5">
                  <IcoCalendar />
                  <span>45 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IcoBookOpen />
                  <span>76 problems</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEnrolled && (
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-[12px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0">
              <IcoRefresh />
              <span>Reset schedule</span>
            </button>
          </div>
        )}

        {!isEnrolled && (
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-2">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-indigo-500"><IcoStars /></div>
              <div>
                <h3 className="text-[14px] font-bold text-[var(--text)] mb-1">This plan is Pro only</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed max-w-lg">
                  You can still browse the schedule below. Problems open normally — but enrollment + progress tracking require Pro.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/pricing')} className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold transition-colors flex-shrink-0 whitespace-nowrap shadow-lg shadow-indigo-600/20">
              Upgrade
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-2">
          {FAANG_DAYS.map((day) => {
            const isRest = day.isRestDay;
            return (
              <div key={day.dayNumber} className={`bg-[var(--surface)] border rounded-xl overflow-hidden shadow-[var(--card-shadow)] ${isEnrolled && day.dayNumber === 1 ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-[var(--border)]'} ${isRest ? 'opacity-80' : ''}`}>
                <div className={`px-5 py-4 border-b flex items-center justify-between ${isEnrolled && day.dayNumber === 1 ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-[var(--surface-2)]/30 border-[var(--border)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black font-mono ${isEnrolled && day.dayNumber === 1 ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30' : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]'}`}>
                      {day.dayNumber}
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-wider uppercase font-mono mb-0.5 flex items-center gap-1.5">
                        <span className={isEnrolled && day.dayNumber === 1 ? 'text-indigo-500' : 'text-[var(--text-muted)]'}>DAY {day.dayNumber}</span>
                        {isEnrolled && day.dayNumber === 1 && (
                          <>
                            <span className="text-[var(--text-subtle)]">·</span>
                            <span className="text-indigo-500">TODAY</span>
                          </>
                        )}
                      </div>
                      <h3 className={`text-[13px] font-bold tracking-tight ${isRest ? 'text-[var(--text-muted)] italic' : 'text-[var(--text)]'}`}>
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold font-mono text-[var(--text-muted)]">
                    {isRest ? '0 / 0' : day.progress}
                  </span>
                </div>
                {!isRest && (
                  <div className="flex flex-col">
                    {day.problems.map((problem, i) => (
                      <div 
                        key={i} 
                        onClick={() => navigate('/practice/problems')}
                        className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-none hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] group-hover:border-indigo-500/50 flex-shrink-0 transition-colors" />
                          <span className="text-[12.5px] font-semibold text-[var(--text)]">
                            {problem.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded uppercase font-sans border ${
                            problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-[var(--text-subtle)] group-hover:text-indigo-500 transition-colors pl-1">
                            <IcoArrowRight />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
