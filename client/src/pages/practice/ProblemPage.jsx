import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import CodeEditor from '../components/CodeEditor.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript', monacoLang: 'javascript', ext: 'js',   short: 'JS'  },
  { label: 'Python',     value: 'python',     monacoLang: 'python',     ext: 'py',   short: 'PY'  },
  { label: 'C',          value: 'c',          monacoLang: 'c',          ext: 'c',    short: 'C'   },
  { label: 'C++',        value: 'cpp',        monacoLang: 'cpp',        ext: 'cpp',  short: 'C++' },
  { label: 'Java',       value: 'java',       monacoLang: 'java',       ext: 'java', short: 'JV'  },
];

const STARTER_CODE = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    return [];
};

const fs = require('fs');
try {
    const inputData = fs.readFileSync(0, 'utf-8').trim();
    if (inputData) {
        const data = JSON.parse(inputData);
        const result = twoSum(data.nums || [], data.target ?? 0);
        console.log(JSON.stringify(result));
    }
} catch (e) {
    process.stderr.write('Error parsing input: ' + e.message + '\\n');
}`,

  python: `from typing import List
import sys, json

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass

if __name__ == "__main__":
    try:
        data = json.loads(sys.stdin.read().strip())
        result = Solution().twoSum(data.get("nums", []), data.get("target", 0))
        print(json.dumps(result, separators=(',', ':')))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);
        String input = sb.toString().trim();
        if (input.isEmpty()) return;
        String numsPart = input.substring(input.indexOf("[") + 1, input.indexOf("]"));
        int target = Integer.parseInt(input.substring(input.lastIndexOf(":") + 1, input.indexOf("}")).trim());
        String[] els = numsPart.split(",");
        int[] nums = new int[els.length];
        for (int i = 0; i < els.length; i++) nums[i] = Integer.parseInt(els[i].trim());
        int[] result = new Solution().twoSum(nums, target);
        System.out.println(result.length == 2 ? "[" + result[0] + "," + result[1] + "]" : "[]");
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}

int main() {
    string input;
    if (!getline(cin, input) || input.empty()) return 0;
    size_t s = input.find('['), e = input.find(']'), c = input.find_last_of(':'), b = input.find('}');
    string numsStr = input.substr(s + 1, e - s - 1);
    int target = stoi(input.substr(c + 1, b - c - 1));
    vector<int> nums;
    stringstream ss(numsStr);
    string item;
    while (getline(ss, item, ',')) if (!item.empty()) nums.push_back(stoi(item));
    auto result = twoSum(nums, target);
    cout << (result.size() == 2 ? "[" + to_string(result[0]) + "," + to_string(result[1]) + "]" : "[]") << endl;
    return 0;
}`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
    *returnSize = 0;
}

int main() {
    char input[4096];
    if (!fgets(input, sizeof(input), stdin)) return 0;
    char *start = strchr(input, '['), *end = strchr(input, ']'), *tp = strrchr(input, ':');
    if (!start || !end || !tp) return 0;
    int nums[500], numsSize = 0;
    char *tok = strtok(start + 1, ",]");
    while (tok && tok < end) { nums[numsSize++] = atoi(tok); tok = strtok(NULL, ",]"); }
    int target = atoi(tp + 1), returnSize = 0;
    twoSum(nums, numsSize, target, &returnSize);
    printf("[0,0]\\n");
    return 0;
}`,
};

const DIFFICULTY_STYLE = {
  Easy:   { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  Medium: { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  Hard:   { text: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20'    },
};

const STATUS_META = {
  accepted:            { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: '✓', label: 'Accepted'            },
  wrong_answer:        { color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20',    icon: '✗', label: 'Wrong Answer'        },
  runtime_error:       { color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: '⚠', label: 'Runtime Error'       },
  compile_error:       { color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20',    icon: '⚠', label: 'Compile Error'       },
  time_limit_exceeded: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   icon: '⏱', label: 'Time Limit Exceeded' },
  pending:             { color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/20',  icon: '…', label: 'Pending'              },
  error:               { color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20',    icon: '✗', label: 'Error'               },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcoArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);
const IcoReset = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IcoPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z"/></svg>
);
const IcoSubmit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);
const IcoExternal = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken() { return localStorage.getItem('token') || sessionStorage.getItem('token'); }

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

// ─── Shared Badges ────────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }) {
  const normalized = difficulty ? (difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()) : 'Easy';
  const style = DIFFICULTY_STYLE[normalized] || DIFFICULTY_STYLE.Easy;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
      {normalized}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: '?', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${m.bg} ${m.color} ${m.border}`}>
      <span>{m.icon}</span> {m.label}
    </span>
  );
}

// ─── Description Panel ────────────────────────────────────────────────────────

function DescriptionPanel({ problem }) {
  const testCases = (problem.testCases || []).slice(0, 4);
  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full box-border">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-extrabold text-gray-100 m-0 tracking-tight">{problem.title}</h1>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(problem.tags || []).map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#111622] text-gray-400 border border-[#1e2433]">{tag}</span>
        ))}
      </div>
      <div className="text-[14px] text-gray-300 leading-relaxed mb-6 font-normal space-y-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
      <div className="bg-[#1e1b4b]/40 border border-indigo-500/20 rounded-xl p-4 mb-8">
        <span className="font-bold text-indigo-400">Hint:</span> <span className="text-indigo-200/80 text-[13px]">A hash map lets you solve this in O(n).</span>
      </div>
      <div className="mb-8">
        <h3 className="text-[11px] font-black tracking-widest text-gray-500 uppercase mb-3">Constraints</h3>
        <div className="bg-[#111622] border border-[#1e2433]/70 rounded-xl p-4 font-mono text-[12px] text-gray-300 space-y-1.5 shadow-inner">
          <div>2 ≤ nums.length ≤ 10⁴</div>
          <div>-10⁹ ≤ nums[i] ≤ 10⁹</div>
          <div>-10⁹ ≤ target ≤ 10⁹</div>
          <div className="pt-2 text-gray-400">Exactly one valid answer exists.</div>
        </div>
      </div>
      {testCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[11px] font-black tracking-widest text-gray-500 uppercase mb-3">Examples</h3>
          <div className="flex flex-col gap-3">
            {testCases.slice(0, 2).map((tc, i) => (
              <div key={i} className="bg-[#111622]/50 border border-[#1e2433]/50 rounded-xl p-4 font-mono text-[13px]">
                <div className="text-[10px] font-bold text-gray-500 uppercase mb-3">Example {i + 1}</div>
                <div className="mb-2"><span className="text-gray-500">Input: </span><span className="text-indigo-300">{typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input).replace(/,/g, ' ')}</span></div>
                <div className="mb-2"><span className="text-gray-500">Output: </span><span className="text-emerald-300 font-bold">{typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected).replace(/,/g, ' ')}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {testCases.length > 0 && (
        <div>
          <h3 className="text-[11px] font-black tracking-widest text-gray-500 uppercase mb-3">Sample Test Cases</h3>
          <div className="flex flex-col gap-2">
            {testCases.map((tc, i) => (
              <div key={i} className="bg-[#111622]/30 border border-[#1e2433]/40 rounded-lg p-3 font-mono text-[12px] flex items-center">
                <span className="text-gray-500 w-20">Input #{i + 1}:</span>
                <span className="text-gray-300 font-bold">{typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input).replace(/,/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Submissions Panel ────────────────────────────────────────────────────────

function SubmissionsPanel({ problemId, selectedSubmission, onSelect }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/submissions/user/history?problemId=${problemId}&limit=20`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setSubmissions(data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading submissions…</div>;

  if (selectedSubmission) {
    const s = selectedSubmission;
    return (
      <div className="p-6 h-full overflow-y-auto box-border">
        <button onClick={() => onSelect(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e2433] bg-[#111622] text-gray-400 text-[12px] font-semibold hover:text-gray-200 transition-colors mb-6">
          <IcoArrowLeft /> Back
        </button>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <StatusBadge status={s.status} />
          <span className="text-gray-500 text-[12px] font-medium">{s.language} · {timeAgo(s.createdAt)}</span>
          {s.runtimeMs != null && <span className="text-gray-400 text-[12px] font-mono">{s.runtimeMs.toFixed(0)}ms</span>}
        </div>
        {s.error_message && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
            <div className="text-rose-400 text-[12px] font-mono whitespace-pre-wrap">{s.error_message}</div>
          </div>
        )}
        {s.test_results?.length > 0 && (
          <div className="mb-6">
            <div className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-3">Test Cases</div>
            <div className="flex flex-col gap-2">
              {s.test_results.map((tr, i) => (
                <div key={i} className={`rounded-xl p-3.5 font-mono text-[12px] border ${tr.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Case {tr.test_case_index}</span>
                    <span className={`font-bold ${tr.passed ? 'text-emerald-400' : 'text-rose-400'}`}>{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
                  </div>
                  <div className="text-gray-400 mb-1">Input: <span className="text-indigo-300">{typeof tr.input === 'object' ? JSON.stringify(tr.input) : String(tr.input)}</span></div>
                  <div className="text-gray-400 mb-1">Expected: <span className="text-emerald-300">{typeof tr.expected === 'object' ? JSON.stringify(tr.expected) : String(tr.expected)}</span></div>
                  <div className="text-gray-400">Got: <span className={tr.passed ? 'text-emerald-300' : 'text-rose-400'}>{tr.output || '(empty)'}</span></div>
                  {tr.error && <div className="text-amber-500 mt-1">Error: {tr.error}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-3">Code</div>
          <div className="bg-[#0d0e17] border border-[#1e2433] rounded-xl p-4 font-mono text-[12px] text-gray-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">{s.code}</div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
        <div className="text-3xl opacity-50">📭</div>
        <div className="text-[13px] font-medium">No submissions yet</div>
        <div className="text-[12px] text-gray-600">Submit your first solution!</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto box-border">
      <h3 className="text-gray-200 text-[14px] font-bold mb-4">My Submissions</h3>
      <div className="flex flex-col gap-2">
        {submissions.map(s => (
          <div key={s.id} onClick={() => onSelect(s)} className="group flex items-center justify-between p-3.5 bg-[#111622] border border-[#1e2433] hover:border-indigo-500/50 rounded-xl cursor-pointer transition-colors">
            <div>
              <StatusBadge status={s.status} />
              <div className="text-gray-500 text-[11px] mt-1.5 font-medium">{s.language} · {timeAgo(s.createdAt)}</div>
            </div>
            <div className="flex items-center gap-3">
              {s.runtimeMs != null && <span className="text-gray-400 text-[12px] font-mono">{s.runtimeMs.toFixed(0)} ms</span>}
              <span className="text-gray-600 group-hover:text-indigo-400 transition-colors">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Discussions Panel ────────────────────────────────────────────────────────

function DiscussionsPanel({ problemId }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API}/api/discussions/problem/${problemId}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setDiscussions(data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [problemId]);

  useEffect(() => { load(); }, [load]);

  const post = async () => {
    if (!content.trim()) return;
    setPosting(true); setError('');
    try {
      const res = await fetch(`${API}/api/discussions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ problemId, content }) });
      const data = await res.json();
      if (data.success) { setContent(''); load(); } else setError(data.error || 'Failed to post');
    } catch { setError('Network error'); }
    finally { setPosting(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#1e2433] shrink-0 bg-[#0d1117]/30">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share your approach, ask a question, or discuss edge cases…" rows={3} className="w-full bg-[#111622] border border-[#1e2433] focus:border-indigo-500 rounded-xl p-3 text-gray-200 text-[13px] resize-y outline-none transition-colors" />
        {error && <div className="text-rose-400 text-[12px] mt-1.5 font-medium">{error}</div>}
        <div className="flex justify-end mt-3">
          <button onClick={post} disabled={posting || !content.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1e2433] disabled:text-gray-500 text-white px-5 py-2 rounded-lg text-[12px] font-bold transition-colors">
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="text-center text-gray-500 text-sm mt-8">Loading…</div>
        ) : discussions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 flex flex-col items-center gap-2">
            <div className="text-3xl opacity-50 mb-2">💬</div>
            <div className="text-[13px] font-medium">No discussions yet. Start the conversation!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {discussions.map(d => (
              <div key={d.id} className="border-b border-[#1e2433]/50 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-inner">
                    {d.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-gray-200 text-[13px] font-bold">{d.user?.name || 'User'}</div>
                    <div className="text-gray-500 text-[11px] font-medium">{timeAgo(d.createdAt)}</div>
                  </div>
                </div>
                <div className="text-gray-300 text-[13px] leading-relaxed pl-11">{d.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ result, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-5 text-indigo-400 text-[13px] font-medium">
        <span className="animate-spin text-lg">⟳</span>
        <span>Running your code…</span>
      </div>
    );
  }
  if (!result) return <div className="p-5 text-gray-500 text-[13px]">Run your code or submit to see results here.</div>;

  if (result.mode === 'run') {
    if (result.stderr) {
      return (
        <div className="p-4 font-mono text-[13px]">
          <div className="text-rose-400 bg-rose-400/5 border border-rose-400/10 p-3 rounded-lg whitespace-pre-wrap">{result.stderr}</div>
        </div>
      );
    }
    return (
      <div className="p-4 font-mono text-[13px] space-y-4">
        {result.testResults?.map((tr, i) => (
          <div key={i} className={`rounded-xl p-3.5 border ${tr.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 font-bold">Sample Case {tr.test_case_index}</span>
              <span className={`font-bold ${tr.passed ? 'text-emerald-400' : 'text-rose-400'}`}>{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
            </div>
            {tr.stderr ? (
              <div className="text-rose-400 text-[12px] bg-rose-950/20 p-2 rounded border border-rose-900/30 whitespace-pre-wrap">{tr.stderr}</div>
            ) : (
              <div className="space-y-1 text-[12px]">
                <div className="text-gray-400">Input: <span className="text-indigo-300">{typeof tr.input === 'object' ? JSON.stringify(tr.input) : String(tr.input)}</span></div>
                <div className="text-gray-400">Expected: <span className="text-emerald-300">{typeof tr.expected === 'object' ? JSON.stringify(tr.expected) : String(tr.expected)}</span></div>
                <div className="text-gray-400">Got: <span className={tr.passed ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>{tr.actual || '(empty)'}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const passed = (result.testResults || []).filter(t => t.passed).length;
  const total  = (result.testResults || []).length;
  return (
    <div className="p-4 font-mono">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <StatusBadge status={result.status} />
        {result.runtimeMs != null && <span className="text-gray-400 text-[12px]">{result.runtimeMs.toFixed(0)} ms</span>}
        {result.memoryKb  != null && <span className="text-gray-400 text-[12px]">{(result.memoryKb / 1024).toFixed(1)} MB</span>}
        {total > 0 && <span className={`text-[12px] font-bold ${passed === total ? 'text-emerald-400' : 'text-rose-400'}`}>{passed}/{total} test cases passed</span>}
      </div>
      {result.errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
          <div className="text-rose-400 text-[12px] whitespace-pre-wrap">{result.errorMessage}</div>
        </div>
      )}
      {result.testResults && (
        <div className="flex flex-wrap gap-2">
          {result.testResults.map((t, i) => (
            <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${t.passed ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' : 'bg-rose-500/10 border-rose-400 text-rose-400'}`} title={`Case ${t.test_case_index}: ${t.passed ? 'Passed' : 'Failed'}`}>
              {i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProblemPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem]         = useState(null);
  const [loadingProblem, setLoading]  = useState(true);
  const [problemError, setProblemError] = useState('');

  const [language, setLanguage] = useState('cpp');
  const [code, setCode]         = useState(STARTER_CODE['cpp']);

  const [leftTab, setLeftTab] = useState('description');
  const [runLoading, setRunLoading]     = useState(false);
  const [runResult, setRunResult]       = useState(null);
  const [showResults, setShowResults]   = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [leftWidth, setLeftWidth] = useState(48);
  const dragging = useRef(false);

  // Load problem
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/api/problems/${slug}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProblem(data.data);
          const starter = data.data.starterCode || data.data.starter_code;
          setCode(starter?.[language] || STARTER_CODE[language] || '// Write your code here');
        } else {
          setProblemError(data.error || data.message || 'Problem not found');
        }
      })
      .catch(() => setProblemError('Failed to load problem'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Resizer
  const onMouseDown = () => { dragging.current = true; };
  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      const container = document.getElementById('problem-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setLeftWidth(Math.max(25, Math.min(75, ((e.clientX - rect.left) / rect.width) * 100)));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const handleLanguageChange = lang => {
    setLanguage(lang);
    const starter = problem?.starterCode || problem?.starter_code;
    setCode(starter?.[lang] || STARTER_CODE[lang] || '// Write your code here');
  };

  const handleRun = async () => {
    if (!problem?.testCases) return;
    setRunLoading(true); setShowResults(true); setRunResult(null);
    try {
      const langMap = { python: 71, javascript: 63, java: 62, cpp: 54, c: 50 };
      const samples = problem.testCases.slice(0, 2);
      const results = await Promise.all(samples.map(async (tc, index) => {
        const stdin = typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input);
        const res = await fetch(`${API}/api/code/run`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ sourceCode: code, languageId: langMap[language] || 63, stdin }) });
        const data = await res.json();
        const stdout = (data.stdout || data.data?.stdout || '').replace(/\s+/g, '');
        const stderr = data.stderr || data.data?.stderr || data.compile_output || data.data?.compile_output || '';
        const expectedStr = typeof tc.expected === 'object' ? JSON.stringify(tc.expected).replace(/\s+/g, '') : String(tc.expected).replace(/\s+/g, '');
        return { test_case_index: index + 1, input: tc.input, expected: tc.expected, actual: stdout, stderr, passed: !stderr && stdout === expectedStr };
      }));
      setRunResult({ mode: 'run', testResults: results, status: results.every(r => r.passed) ? 'accepted' : 'wrong_answer' });
    } catch {
      setRunResult({ mode: 'run', testResults: [], status: 'error', stderr: 'Network or Execution Error' });
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitLoading(true); setShowResults(true); setRunResult(null);
    try {
      const res = await fetch(`${API}/api/submissions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ problemId: problem.id, code, language, submittedFrom: 'solo' }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const submissionId = data.data.id;
      let attempts = 0;
      const poll = async () => {
        if (attempts++ > 30) { setSubmitLoading(false); return; }
        const r = await fetch(`${API}/api/submissions/${submissionId}`, { headers: authHeaders() });
        const d = await r.json();
        if (!d.success) return;
        const s = d.data;
        if (s.status === 'pending') { setTimeout(poll, 1500); return; }
        setRunResult({ mode: 'submit', submissionId: s.id, status: s.status, testResults: s.test_results, runtimeMs: s.runtimeMs, memoryKb: s.memoryKb, errorMessage: s.error_message });
        setSubmitLoading(false);
      };
      poll();
    } catch (err) {
      setRunResult({ mode: 'run', testResults: [], status: 'error', stderr: err.message || 'Submission failed' });
      setSubmitLoading(false);
    }
  };

  // ── Loading / Error states ────────────────────────────────────────────────

  if (loadingProblem) {
    return (
      <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
        <Sidebar active="practice" />
        <div className="flex-1 flex items-center justify-center bg-[#0d0e17] text-gray-500 text-sm">Loading problem…</div>
      </div>
    );
  }

  if (problemError || !problem) {
    return (
      <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
        <Sidebar active="practice" />
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0e17] gap-4 text-center px-6">
          <div className="text-rose-400 text-lg font-bold">Problem not found</div>
          <div className="text-gray-500 text-sm max-w-md">{problemError}</div>
          <button onClick={() => navigate('/practice/problems')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors mt-2">← Back to Problems</button>
        </div>
      </div>
    );
  }

  const langMeta = LANGUAGE_OPTIONS.find(l => l.value === language) || LANGUAGE_OPTIONS[0];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      <Sidebar active="practice" />

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#0d0e17]">

        {/* Top bar */}
        <div className="h-[52px] bg-[#0d1117]/80 backdrop-blur-md border-b border-[#1e2433] flex items-center justify-between px-5 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/practice/problems')} className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400 hover:text-gray-200 transition-colors">
              <IcoArrowLeft /> Problems
            </button>
            <div className="w-[1px] h-5 bg-[#1e2433]" />
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-extrabold tracking-tight text-gray-100">{problem.title}</span>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {LANGUAGE_OPTIONS.map(l => (
              <button key={l.value} onClick={() => handleLanguageChange(l.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${language === l.value ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-[#111622] border-[#1e2433] text-gray-500 hover:text-gray-300 hover:border-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black tracking-tighter ${language === l.value ? 'bg-indigo-500 text-white' : 'bg-[#1e2433] text-gray-500'}`}>{l.short}</div>
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setCode(STARTER_CODE[language] || '')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-300 transition-colors">
              <IcoReset /> Reset
            </button>
            <button onClick={handleRun} disabled={runLoading || submitLoading} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#111622] hover:bg-[#1a2133] border border-[#1e2433] text-gray-300 text-[12px] font-bold transition-colors disabled:opacity-50">
              <IcoPlay /> Run
            </button>
            <button onClick={handleSubmit} disabled={submitLoading || runLoading} className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-extrabold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50">
              <IcoSubmit /> Submit
            </button>
          </div>
        </div>

        {/* Split pane */}
        <div id="problem-container" className="flex-1 flex overflow-hidden min-h-0 bg-[#0d0e17]">

          {/* Left pane */}
          <div style={{ width: `${leftWidth}%` }} className="flex flex-col bg-[#060810]/50 border-r border-[#1e2433] overflow-hidden min-w-[280px]">
            <div className="flex border-b border-[#1e2433] bg-[#0a0c14] shrink-0 px-2 pt-2">
              {[
                { id: 'description', label: 'Description' },
                { id: 'submissions', label: 'Submissions' },
                { id: 'discussions', label: 'Discussion', icon: <IcoExternal /> },
              ].map(tab => (
                <button key={tab.id} onClick={() => { setLeftTab(tab.id); if (tab.id !== 'submissions') setSelectedSubmission(null); }} className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold transition-colors border-b-2 -mb-[1px] ${leftTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                  {tab.label}
                  {tab.icon && <span className="opacity-70">{tab.icon}</span>}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden min-h-0 relative">
              {leftTab === 'description' && <DescriptionPanel problem={problem} />}
              {leftTab === 'submissions' && <SubmissionsPanel problemId={problem.id} selectedSubmission={selectedSubmission} onSelect={setSelectedSubmission} />}
              {leftTab === 'discussions' && <DiscussionsPanel problemId={problem.id} />}
            </div>
          </div>

          {/* Resizer */}
          <div onMouseDown={onMouseDown} className="w-1.5 bg-[#0d1117] hover:bg-indigo-500/50 cursor-col-resize shrink-0 transition-colors z-10" />

          {/* Right pane — CodeEditor */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#13141f]">
            <div className="flex items-center px-4 py-2 bg-[#0a0c14] border-b border-[#1e2433] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                <span className="text-[11px] font-bold text-gray-400 font-mono">{langMeta.monacoLang}</span>
              </div>
            </div>

            {/* CodeEditor replaces raw Monaco */}
            <div className="relative min-h-[200px]" style={{ flex: showResults ? '0 0 calc(100% - 250px)' : '1' }}>
              <CodeEditor
                language={langMeta.monacoLang}
                value={code}
                onChange={setCode}
                options={{ tabSize: 4, fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace', fontLigatures: true }}
              />
            </div>

            {/* Results panel */}
            {showResults && (
              <div className="h-[250px] shrink-0 bg-[#0d1117] border-t border-[#1e2433] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0c14] border-b border-[#1e2433]">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {runResult?.mode === 'submit' ? 'Submission Result' : 'Test Output'}
                  </span>
                  <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ResultsPanel result={runResult} loading={runLoading || submitLoading} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}