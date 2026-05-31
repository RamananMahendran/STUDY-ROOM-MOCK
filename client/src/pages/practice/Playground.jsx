import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Editor from "@monaco-editor/react";


// ── Icons ─────────────────────────────────────────────────────────────────────
const IcoPlay = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const IcoReset = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
const IcoPairCode = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="2"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/>
    <path d="M6 8v8"/><path d="M8 6h7a3 3 0 0 1 3 3v1"/>
  </svg>
);
const IcoChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IcoTerminal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const IcoCross = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
const IcoClockSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    id: "javascript",
    label: "JavaScript",
    abbr: "JS",
    color: "#f7df1e",
    bgColor: "#f7df1e22",
    judge0Id: 63,
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    id: "python",
    label: "Python",
    abbr: "PY",
    color: "#3572A5",
    bgColor: "#3572A522",
    judge0Id: 71,
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: "c",
    label: "C",
    abbr: "C",
    color: "#555555",
    bgColor: "#55555522",
    judge0Id: 50,
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  {
    id: "cpp",
    label: "C++",
    abbr: "C+",
    color: "#f34b7d",
    bgColor: "#f34b7d22",
    judge0Id: 54,
    defaultCode: `#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    abbr: "JV",
    color: "#b07219",
    bgColor: "#b0721922",
    judge0Id: 62,
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────


// ── Main Component ────────────────────────────────────────────────────────────
export default function Playground() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [outputResult, setOutputResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [showStdin, setShowStdin] = useState(false);
  const [stdin, setStdin] = useState("");
  

  const handleLangSwitch = (lang) => {
    setActiveLang(lang);
    setCode(lang.defaultCode);
    setOutputResult(null);
  };

 

  const handleRun = async () => {
    setRunning(true);
    setOutputResult({ status: "running" });
    
    try {
      const response = await fetch("http://localhost:5001/api/code/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: code,
          languageId: activeLang.judge0Id,
          stdin: stdin || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const result = await response.json();
      const data = result.data;

      if (data.compile_output) {
        setOutputResult({ status: "error", title: "Compilation Error", message: data.compile_output, time: data.time });
      } else if (data.stderr) {
        setOutputResult({ status: "error", title: "Runtime Error", message: data.stderr, time: data.time });
      } else if (data.message) {
        setOutputResult({ status: "error", title: data.status?.description || "Error", message: data.message, time: data.time });
      } else {
        setOutputResult({ status: "success", title: "Execution successful", message: data.stdout || "(no output)", time: data.time });
      }
    } catch (err) {
      console.error("Error executing code:", err);
      setOutputResult({ status: "error", title: "System Error", message: err.message });
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCode(activeLang.defaultCode);
    setOutputResult(null);
  };

  

  return (
    <div className="fixed inset-0 flex bg-[#060810] text-[#e2e8f0] font-sans overflow-hidden select-none">
      <Sidebar active="playground" />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2433]/70 flex-shrink-0">
          <div>
            <h1 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight">Code Playground</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Write, run, and experiment</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Pair Code button */}
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-400 text-[12px] font-semibold hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
            >
              <IcoPairCode />
              <span>Pair Code</span>
            </button>
            {/* Reset button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e2433] bg-[#0d1117] text-gray-400 text-[12px] font-semibold hover:border-[#2e3448] hover:text-gray-300 transition-all"
            >
              <IcoReset />
              <span>Reset</span>
            </button>
            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-60 text-white text-[12px] font-bold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <IcoPlay />
              <span>{running ? "Running…" : "Run"}</span>
              {!running && <span className="text-indigo-200/60 text-[10px] font-normal ml-0.5">⌃↵</span>}
            </button>
          </div>
        </div>

        {/* ── Language tabs ── */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-2 flex-shrink-0">
          {LANGUAGES.map((lang) => {
            const isActive = activeLang.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleLangSwitch(lang)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? lang.bgColor : "transparent",
                  borderColor: isActive ? lang.color + "55" : "#1e2433",
                  color: isActive ? lang.color : "#6b7280",
                }}
              >
                <span
                  className="text-[9px] font-black px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: isActive ? lang.color + "33" : "#1e243322",
                    color: isActive ? lang.color : "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  {lang.abbr}
                </span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Editor + Output ── */}
        <div className="flex flex-1 overflow-hidden mx-5 mb-0 gap-3">

          {/* Editor pane */}
            <div className="flex-1 rounded-t-xl border border-b-0 border-[#1e2433]/70 overflow-hidden bg-[#0d1117]">
            <Editor
                height="100%"
                language={activeLang.id}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={(editor, monaco) => {
                editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => handleRun()
                );
            }}
                options={{
                minimap: {
                    enabled: false,
                },
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: {
                    top: 16,
                },
                tabSize: 2,
                lineNumbers: "on",
                renderLineHighlight: "all",
                }}
            />
            </div>

          {/* Output pane */}
          <div className="w-[380px] flex-shrink-0 flex flex-col rounded-t-xl border border-b-0 border-[#1e2433]/70 bg-[#0d1117] overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Output</span>
            </div>
            <div className="flex-1 overflow-auto p-4 pt-2 font-mono text-[13px]">
              {outputResult ? (
                outputResult.status === "running" ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                    <span className="flex h-4 w-4 rounded-full bg-[#6366f1] animate-ping"></span>
                    <p className="text-[12px] text-gray-500">Executing…</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Status header */}
                    <div className="flex items-center justify-between border-b border-[#1e2433]/50 pb-3">
                      <div className={`flex items-center gap-2 text-[12px] font-bold ${outputResult.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {outputResult.status === 'success' ? <IcoCheck /> : <IcoCross />}
                        <span>{outputResult.title}</span>
                      </div>
                      {outputResult.time && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                          <IcoClockSmall />
                          <span>{(parseFloat(outputResult.time) * 1000).toFixed(0)}ms</span>
                        </div>
                      )}
                    </div>
                    {/* Raw output */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Output</span>
                      <div className="bg-[#161b22] rounded-lg p-3 overflow-x-auto border border-[#1e2433]/50">
                        <pre className="text-[#d4d4d4] whitespace-pre-wrap leading-relaxed text-[12px]">{outputResult.message}</pre>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center pt-10">
                  <div className="text-gray-700">
                    <IcoTerminal />
                  </div>
                  <p className="text-[12px] text-gray-600">Press Run (Ctrl+Enter) to execute</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Custom input (stdin) ── */}
        <div className="mx-5 mb-5 border border-t-0 border-[#1e2433]/70 rounded-b-xl bg-[#0d1117] flex-shrink-0">
          <button
            onClick={() => setShowStdin(o => !o)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-[12px] text-gray-500 hover:text-gray-400 transition-colors"
          >
            <span
              style={{
                display: "inline-block",
                transform: showStdin ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <IcoChevronRight />
            </span>
            <span>Custom input (stdin)</span>
          </button>
          {showStdin && (
            <div className="px-4 pb-3">
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter custom input here…"
                rows={3}
                className="w-full bg-[#060810] border border-[#1e2433] rounded-lg p-3 font-mono text-[12px] text-gray-300 placeholder-gray-700 outline-none focus:border-indigo-500/40 resize-none transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}