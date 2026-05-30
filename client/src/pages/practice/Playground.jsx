import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";


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

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    id: "javascript", label: "JavaScript", abbr: "JS",
    color: "#f7df1e", bgColor: "#f7df1e22",
    defaultCode: `// JavaScript\nconsole.log("Hello, World!");`,
  },
  {
    id: "python", label: "Python", abbr: "PY",
    color: "#3572A5", bgColor: "#3572A522",
    defaultCode: `# Python\nprint("Hello, World!")`,
  },
  {
    id: "c", label: "C", abbr: "C",
    color: "#555555", bgColor: "#55555522",
    defaultCode: `// C\n#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  {
    id: "cpp", label: "C++", abbr: "C+",
    color: "#f34b7d", bgColor: "#f34b7d22",
    defaultCode: `// C++\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  },
  {
    id: "java", label: "Java", abbr: "JV",
    color: "#b07219", bgColor: "#b0721922",
    defaultCode: `// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function syntaxHighlight(code, langId) {
  // Very light tokenizer — just enough to match the screenshot colors
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (langId === "javascript") {
    html = html
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
      .replace(/\b(console|log|Math|JSON|Array|Object|String|Number|Boolean|undefined|null|NaN|Infinity)\b/g, '<span style="color:#9cdcfe">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|typeof|instanceof|class|extends|import|export|default|async|await|try|catch|finally|throw|of|in)\b/g, '<span style="color:#c586c0">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#ce9178">$1</span>');
  } else if (langId === "python") {
    html = html
      .replace(/(#[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
      .replace(/\b(print|input|len|range|int|str|float|list|dict|set|tuple|type|isinstance|hasattr|getattr|setattr|open|enumerate|zip|map|filter|sorted|reversed)\b/g, '<span style="color:#9cdcfe">$1</span>')
      .replace(/\b(def|class|return|if|elif|else|for|while|import|from|as|in|not|and|or|is|lambda|try|except|finally|raise|with|pass|break|continue|True|False|None|global|nonlocal|del|yield)\b/g, '<span style="color:#c586c0">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color:#ce9178">$1</span>');
  } else {
    // C / C++ / Java
    html = html
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
      .replace(/\b(int|char|float|double|void|bool|long|short|unsigned|signed|auto|static|const|return|if|else|for|while|do|switch|case|break|continue|struct|class|public|private|protected|new|delete|namespace|using|include|define|cout|cin|endl|string|printf|scanf|main)\b/g, '<span style="color:#569cd6">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#ce9178">$1</span>')
      .replace(/(#\w+)/g, '<span style="color:#c586c0">$1</span>');
  }
  return html;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Playground() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showStdin, setShowStdin] = useState(false);
  const [stdin, setStdin] = useState("");
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // Sync textarea scroll → highlight scroll
  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleLangSwitch = (lang) => {
    setActiveLang(lang);
    setCode(lang.defaultCode);
    setOutput("");
  };

  const handleRun = () => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      if (activeLang.id === "javascript") {
        try {
          const logs = [];
          const fakeConsole = { log: (...args) => logs.push(args.map(String).join(" ")) };
          // eslint-disable-next-line no-new-func
          new Function("console", code)(fakeConsole);
          setOutput(logs.join("\n") || "(no output)");
        } catch (e) {
          setOutput(`Error: ${e.message}`);
        }
      } else {
        setOutput(`// ${activeLang.label} execution is simulated.\n// Output: Hello, World!`);
      }
      setRunning(false);
    }, 600);
  };

  const handleReset = () => {
    setCode(activeLang.defaultCode);
    setOutput("");
  };

  const lines = code.split("\n");
  const highlighted = syntaxHighlight(code, activeLang.id);

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
          <div className="flex flex-col flex-1 overflow-hidden rounded-t-xl border border-b-0 border-[#1e2433]/70 bg-[#0d1117]">
            <div className="flex flex-1 overflow-hidden">
              {/* Line numbers */}
              <div
                className="text-right pr-4 pl-4 pt-4 text-[13px] font-mono text-gray-600 select-none flex-shrink-0 overflow-hidden"
                style={{ minWidth: 52, lineHeight: "1.6", userSelect: "none" }}
              >
                {lines.map((_, i) => (
                  <div key={i} style={{ lineHeight: "1.6" }}>{i + 1}</div>
                ))}
              </div>

              {/* Code area with highlight + textarea overlay */}
              <div className="relative flex-1 overflow-auto">
                {/* Syntax-highlighted layer */}
                <pre
                  ref={highlightRef}
                  aria-hidden="true"
                  className="absolute inset-0 p-0 pt-4 pr-4 m-0 overflow-auto pointer-events-none font-mono text-[13px] whitespace-pre text-[#d4d4d4]"
                  style={{ lineHeight: "1.6", tabSize: 2 }}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
                {/* Transparent textarea for editing */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={syncScroll}
                  spellCheck={false}
                  className="absolute inset-0 w-full h-full p-0 pt-4 pr-4 m-0 bg-transparent text-transparent caret-white font-mono text-[13px] resize-none outline-none border-none overflow-auto"
                  style={{ lineHeight: "1.6", tabSize: 2, caretColor: "#fff" }}
                />
              </div>
            </div>
          </div>

          {/* Output pane */}
          <div className="w-[380px] flex-shrink-0 flex flex-col rounded-t-xl border border-b-0 border-[#1e2433]/70 bg-[#0d1117] overflow-hidden">
            <div className="px-4 pt-3 pb-2 border-b border-[#1e2433]/50 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Output</span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-[13px]">
              {output ? (
                <pre className="text-[#d4d4d4] whitespace-pre-wrap leading-relaxed">{output}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
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