import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript', monacoLang: 'javascript', ext: 'js', short: 'JS' },
  { label: 'Python',     value: 'python',     monacoLang: 'python',     ext: 'py', short: 'PY' },
  { label: 'C',          value: 'c',          monacoLang: 'c',          ext: 'c', short: 'C' },
  { label: 'C++',        value: 'cpp',        monacoLang: 'cpp',        ext: 'cpp', short: 'C++' },
  { label: 'Java',       value: 'java',       monacoLang: 'java',       ext: 'java', short: 'JV' },
];

const STARTER_CODE = {
  javascript: `/*
 * Write your logic inside the solve function.
 * Input is parsed from standard input (stdin).
 */
function solve(inputString) {
    // Write your code here
    return inputString.trim();
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
const fs = require('fs');
try {
    const inputData = fs.readFileSync(0, 'utf-8');
    const result = solve(inputData);
    console.log(result);
} catch (e) {
    process.stderr.write('Error: ' + e.message + '\\n');
}`,

  python: `import sys

def solve(input_str: str) -> str:
    # Write your code here
    return input_str.strip()

# ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        result = solve(input_data)
        print(result)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public String solve(String input) {
        // Write your code here
        return input.trim();
    }
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
public class Main {
    public static void main(String[] args) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\\n");
            }
            Solution solution = new Solution();
            String result = solution.solve(sb.toString());
            System.out.print(result);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`,

  cpp: `#include <iostream>
#include <string>
#include <sstream>

using namespace std;

string solve(string input) {
    // Write your code here
    return input;
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
int main() {
    string line, input;
    while (getline(cin, line)) {
        input += line + "\\n";
    }
    string result = solve(input);
    cout << result;
    return 0;
}`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void solve(const char* input, char* output, int max_len) {
    // Write your code here
    strncpy(output, input, max_len);
}

// ─── DRIVER CODE TO HANDLE SYSTEM INPUT ───
int main() {
    char input[4096] = {0};
    char line[256];
    while (fgets(line, sizeof(line), stdin)) {
        strncat(input, line, sizeof(input) - strlen(input) - 1);
    }
    char output[4096] = {0};
    solve(input, output, sizeof(output) - 1);
    printf("%s", output);
    return 0;
}`,
};

const DIFFICULTY_STYLE = {
  easy:   { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  medium: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  hard:   { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

const STATUS_META = {
  accepted:            { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: '✓', label: 'Accepted' },
  wrong_answer:        { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: '✗', label: 'Wrong Answer' },
  runtime_error:       { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '⚠', label: 'Runtime Error' },
  compile_error:       { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: '⚠', label: 'Compile Error' },
  time_limit_exceeded: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: '⏱', label: 'Time Limit' },
  pending:             { color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', icon: '…', label: 'Pending' },
  error:               { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: '✗', label: 'Error' },
};

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const IcoArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

export default function ContestEditor() {
  const { id: contestId, problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(STARTER_CODE['cpp']);

  const [leftTab, setLeftTab] = useState('description');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [showConsole, setShowConsole] = useState(false);

  const [leftWidth, setLeftWidth] = useState(45);
  const dragging = useRef(false);

  // Fetch problem details
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/problems/${problemId}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProblem(data.data);
          const p = data.data;
          const starter = p.starterCode || p.starter_code;
          if (starter && starter[language]) {
            setCode(starter[language]);
          } else {
            setCode(STARTER_CODE[language] || '// Write your code here');
          }
        } else {
          setError(data.error || 'Failed to load problem');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [problemId]);

  // Fetch submissions history
  const fetchSubmissions = () => {
    if (!problem) return;
    setLoadingSubmissions(true);
    fetch(`${API}/api/submissions/user/history?problemId=${problem.id}&limit=20`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Filter history to only show submissions for this contest
          const contestSubs = (data.data || []).filter(
            (s) => s.submittedFrom === `contest:${contestId}`
          );
          setSubmissions(contestSubs);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingSubmissions(false));
  };

  useEffect(() => {
    if (leftTab === 'submissions') {
      fetchSubmissions();
    }
  }, [leftTab, problem]);

  // Handle resizing divider
  const onMouseDown = () => { dragging.current = true; };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const container = document.getElementById('editor-split-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(25, Math.min(75, pct)));
    };
    const onMouseUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const starter = problem?.starterCode || problem?.starter_code;
    if (starter && starter[lang]) {
      setCode(starter[lang]);
    } else {
      setCode(STARTER_CODE[lang] || '// Write your code here');
    }
  };

  // Run Code (Sample Case Evaluation)
  const handleRun = async () => {
    if (!problem) return;
    setRunLoading(true);
    setShowConsole(true);
    setRunResult(null);

    try {
      const langMap = { python: 71, javascript: 63, java: 62, cpp: 54, c: 50 };
      const res = await fetch(`${API}/api/code/run`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          sourceCode: code,
          languageId: langMap[language] || 63,
          stdin: typeof problem.testCases[0]?.input === 'object'
            ? JSON.stringify(problem.testCases[0]?.input)
            : String(problem.testCases[0]?.input),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const expected = problem.testCases[0]?.expected;
        const stdout = data.data.stdout?.trim() || '';
        const passed = stdout === (typeof expected === 'object' ? JSON.stringify(expected) : String(expected));
        
        setRunResult({
          mode: 'run',
          passed,
          stdout,
          expected: typeof expected === 'object' ? JSON.stringify(expected) : String(expected),
          stderr: data.data.stderr || data.data.compile_output,
          time: data.data.time,
          memory: data.data.memory,
        });
      } else {
        setRunResult({ stderr: data.error || 'Failed to execute code' });
      }
    } catch {
      setRunResult({ stderr: 'Execution network failure' });
    } finally {
      setRunLoading(false);
    }
  };

  // Submit Code for Official Scoring
  const handleSubmit = async () => {
    if (!problem) return;
    setRunLoading(true);
    setShowConsole(true);
    setRunResult(null);

    try {
      const res = await fetch(`${API}/api/submissions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          submittedFrom: `contest:${contestId}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const subId = data.data.id;
        pollSubmissionResult(subId);
      } else {
        setRunResult({ stderr: data.error || 'Submission failed' });
        setRunLoading(false);
      }
    } catch {
      setRunResult({ stderr: 'Submission network failure' });
      setRunLoading(false);
    }
  };

  // Poll for judgment result
  const pollSubmissionResult = async (subId) => {
    const maxAttempts = 15;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${API}/api/submissions/${subId}`, { headers: authHeaders() });
        const data = await res.json();
        
        if (data.success) {
          const sub = data.data;
          if (sub.status !== 'pending' || attempts >= maxAttempts) {
            clearInterval(interval);
            setRunLoading(false);
            
            const passedCount = (sub.test_results || []).filter(t => t.passed).length;
            const totalCount = (sub.test_results || []).length;
            
            setRunResult({
              mode: 'submit',
              status: sub.status,
              passed: sub.status === 'accepted',
              passedCount,
              totalCount,
              runtimeMs: sub.runtimeMs,
              memoryKb: sub.memoryKb,
              errorMessage: sub.error_message,
              testResults: sub.test_results,
            });

            // Trigger list update if on submissions tab
            if (leftTab === 'submissions') {
              fetchSubmissions();
            }
          }
        }
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setRunLoading(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#07090e] text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span>Loading workspace environment...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#07090e] text-gray-400">
        <span>⚠️ {error || 'Workspace loaded empty.'}</span>
        <button onClick={() => navigate(`/contests/${contestId}`)} className="px-4 py-2 rounded-xl bg-[#111622] border border-[#1e2433] text-xs font-bold text-gray-200">
          Return to Arena
        </button>
      </div>
    );
  }

  const diffNormalized = problem.difficulty?.toLowerCase();
  const diffStyle = DIFFICULTY_STYLE[diffNormalized] || DIFFICULTY_STYLE.easy;

  return (
    <div className="flex-1 flex flex-col bg-[#07090e] h-full overflow-hidden select-none">
      
      {/* Workspace Header */}
      <div className="h-14 border-b border-[#131924] bg-[#0a0d14] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/contests/${contestId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1d2433] hover:border-gray-700 bg-[#111622]/40 text-gray-400 hover:text-gray-200 text-xs font-bold transition-all cursor-pointer"
          >
            <IcoArrowLeft /> Back to Arena
          </button>
          <div className="h-4 w-[1px] bg-[#1d2433]"></div>
          <div>
            <span className="text-sm font-black text-gray-200">{problem.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#111622] border border-[#1d2433] text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer hover:border-indigo-500/50 transition-colors"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Container */}
      <div id="editor-split-container" className="flex-1 flex relative overflow-hidden min-h-0">
        
        {/* Left Description Pane */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="h-full flex flex-col border-r border-[#131924] bg-[#07090e] shrink-0 min-w-[300px]"
        >
          {/* Tabs header */}
          <div className="flex border-b border-[#131924] bg-[#0a0d14] shrink-0 text-xs">
            <button
              onClick={() => { setLeftTab('description'); setSelectedSub(null); }}
              className={`px-5 py-3.5 font-bold cursor-pointer transition-colors ${leftTab === 'description' ? 'text-indigo-400 border-b border-indigo-500 bg-[#07090e]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => { setLeftTab('submissions'); setSelectedSub(null); }}
              className={`px-5 py-3.5 font-bold cursor-pointer transition-colors ${leftTab === 'submissions' ? 'text-indigo-400 border-b border-indigo-500 bg-[#07090e]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              My Submissions
            </button>
          </div>

          {/* Tab Content wrapper */}
          <div className="flex-1 overflow-y-auto">
            {leftTab === 'description' ? (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-gray-100">{problem.title}</h1>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Description Text */}
                <div
                  className="text-sm text-gray-300 leading-relaxed space-y-4 font-normal"
                  dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }}
                />

                {/* Constraints if available */}
                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-3">Constraints</h4>
                  <div className="bg-[#0b0e14] border border-[#131924] rounded-xl p-4 font-mono text-xs text-gray-400 space-y-1">
                    <div>Time limit: 2000ms</div>
                    <div>Memory limit: 256MB</div>
                    <div className="pt-2 text-[10px] text-gray-600">Ensure optimal time complexity relative to bounds.</div>
                  </div>
                </div>

                {/* Example cases */}
                {problem.testCases && problem.testCases.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Sample Case</h4>
                    <div className="bg-[#0b0e14] border border-[#131924] rounded-xl p-4 font-mono text-xs space-y-2">
                      <div>
                        <span className="text-gray-500">Input:</span>{' '}
                        <span className="text-indigo-300">
                          {typeof problem.testCases[0].input === 'object'
                            ? JSON.stringify(problem.testCases[0].input)
                            : String(problem.testCases[0].input)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected:</span>{' '}
                        <span className="text-emerald-400 font-bold">
                          {typeof problem.testCases[0].expected === 'object'
                            ? JSON.stringify(problem.testCases[0].expected)
                            : String(problem.testCases[0].expected)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedSub ? (
              // Selected submission details
              <div className="p-6 space-y-6">
                <button
                  onClick={() => setSelectedSub(null)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <IcoArrowLeft /> Back to submissions
                </button>
                
                <div className="flex items-center gap-3">
                  {selectedSub.status === 'accepted' ? (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">✓ Accepted</span>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">✗ {selectedSub.status}</span>
                  )}
                  <span className="text-xs text-gray-500 font-mono">{selectedSub.language} · {timeAgo(selectedSub.createdAt)}</span>
                </div>

                {selectedSub.errorMessage && (
                  <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 font-mono text-xs text-rose-400 whitespace-pre-wrap">
                    {selectedSub.errorMessage}
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Submitted Code</h4>
                  <pre className="p-4 rounded-xl border border-[#131924] bg-[#0b0e14] text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre">
                    {selectedSub.code}
                  </pre>
                </div>
              </div>
            ) : (
              // Submissions list
              <div className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-300">Contest Submissions</h3>
                {loadingSubmissions ? (
                  <div className="text-center text-xs text-gray-500 py-6">Loading submissions history...</div>
                ) : submissions.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-[#1d2433]/50 text-center text-xs text-gray-600">
                    No solutions submitted for this problem yet in this contest.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {submissions.map((sub) => {
                      const meta = STATUS_META[sub.status] || STATUS_META.error;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSub(sub)}
                          className="flex items-center justify-between p-4 rounded-xl border border-[#131924] bg-[#0b0e14]/50 hover:border-indigo-500/40 transition-all cursor-pointer group"
                        >
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${meta.color}`}>
                              {meta.icon} {meta.label}
                            </span>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {sub.language} · {timeAgo(sub.createdAt)}
                            </div>
                          </div>
                          <span className="text-gray-600 group-hover:text-indigo-400 transition-colors text-base">›</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resizer bar */}
        <div
          onMouseDown={onMouseDown}
          className="w-[3px] hover:w-[6px] h-full bg-[#131924] hover:bg-indigo-500 transition-all cursor-col-resize z-20 shrink-0"
        ></div>

        {/* Right Editor Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-[300px]">
          
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 bg-[#0a0d14]">
            <Editor
              height="100%"
              language={LANGUAGE_OPTIONS.find((l) => l.value === language)?.monacoLang || 'cpp'}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, JetBrains Mono, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Code Results Drawer */}
          {showConsole && (
            <div className="h-48 border-t border-[#131924] bg-[#0a0d14] flex flex-col shrink-0">
              <div className="h-9 border-b border-[#131924] bg-[#0b0e14] px-4 flex items-center justify-between text-xs shrink-0">
                <span className="font-bold text-gray-400">Execution Console</span>
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-gray-500 hover:text-gray-300 font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-gray-300">
                {runLoading ? (
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="animate-spin text-sm">⟳</span>
                    <span>Running test cases against remote executor...</span>
                  </div>
                ) : runResult ? (
                  runResult.stderr ? (
                    <div className="text-rose-400 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 whitespace-pre-wrap">
                      {runResult.stderr}
                    </div>
                  ) : runResult.mode === 'run' ? (
                    // Sample Run response
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-black uppercase ${runResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {runResult.passed ? 'Sample Case Passed' : 'Sample Case Failed'}
                        </span>
                        <span className="text-[10px] text-gray-500">({runResult.time}s, {runResult.memory}KB)</span>
                      </div>
                      <div className="space-y-1">
                        <div><span className="text-gray-500">Output:</span> <span className={runResult.passed ? 'text-emerald-300 font-bold' : 'text-rose-400'}>{runResult.stdout}</span></div>
                        <div><span className="text-gray-500">Expected:</span> <span className="text-emerald-300 font-bold">{runResult.expected}</span></div>
                      </div>
                    </div>
                  ) : (
                    // Official Submit response
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider text-[10px] ${runResult.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {runResult.status?.toUpperCase()}
                        </span>
                        {runResult.runtimeMs != null && <span className="text-gray-500 font-mono">{runResult.runtimeMs}ms</span>}
                        {runResult.totalCount > 0 && (
                          <span className={`font-bold ${runResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {runResult.passedCount} / {runResult.totalCount} test cases passed
                          </span>
                        )}
                      </div>

                      {runResult.errorMessage && (
                        <div className="p-3 rounded-lg border border-rose-500/10 bg-rose-500/5 text-rose-400 whitespace-pre-wrap text-[11px]">
                          {runResult.errorMessage}
                        </div>
                      )}

                      {/* Cases bubbles */}
                      {runResult.testResults && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {runResult.testResults.map((t, i) => (
                            <div
                              key={i}
                              title={`Case ${t.test_case_index}: ${t.passed ? 'Passed' : 'Failed'}`}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${t.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-gray-500">Workspace clean. Press Run Code to verify on sample test case.</div>
                )}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="h-14 border-t border-[#131924] bg-[#0a0d14] px-4 flex items-center justify-end gap-3 shrink-0">
            <button
              disabled={runLoading}
              onClick={handleRun}
              className="px-5 py-2 rounded-lg border border-[#1d2433] bg-[#111622] hover:bg-[#1a2335] text-gray-300 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Run Code
            </button>
            <button
              disabled={runLoading}
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-colors cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            >
              Submit Solution
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
