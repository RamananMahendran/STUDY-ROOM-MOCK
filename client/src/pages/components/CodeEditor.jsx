import { useRef, useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

/**
 * CodeEditor — a reusable Monaco wrapper used across Playground,
 * ProblemPage, and PairCode.
 *
 * Props
 * ─────
 * language      string        Monaco language id (e.g. "javascript", "python")
 * value         string        Controlled code value
 * onChange      fn(string)    Called on every edit
 * onMount       fn(editor, monaco)  Optional extra onMount handler (e.g. keybindings)
 * theme         string        "vs-dark" | "light"  — defaults to auto-detect from data-theme
 * options       object        Merged on top of sensible defaults
 * height        string        CSS height, default "100%"
 * className     string        Container className
 * style         object        Container inline style
 */
export default function CodeEditor({
  language = "javascript",
  value = "",
  onChange,
  onMount,
  theme: themeProp,
  options = {},
  height = "100%",
  className = "",
  style = {},
}) {
  // ── Theme ────────────────────────────────────────────────────────────────
  const [autoTheme, setAutoTheme] = useState("vs-dark");
  useEffect(() => {
    const check = () => {
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";
      setAutoTheme(isLight ? "light" : "vs-dark");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  const resolvedTheme = themeProp ?? autoTheme;

  // ── Internal clipboard tracking ──────────────────────────────────────────
  // Instead of trying to intercept Monaco's copy/cut (unreliable), we check
  // at paste-time whether the clipboard text exists inside the current editor
  // content. If it does, it must have originated from the editor — allow it.
  // If it doesn't exist in the editor at all, it came from outside — block it.

  // ── Paste-block notification ─────────────────────────────────────────────
  const [blockMsg, setBlockMsg] = useState(false);
  const blockTimer = useRef(null);

  const showBlockMsg = useCallback(() => {
    setBlockMsg(true);
    clearTimeout(blockTimer.current);
    blockTimer.current = setTimeout(() => setBlockMsg(false), 2000);
  }, []);

  useEffect(() => () => clearTimeout(blockTimer.current), []);

  // ── Monaco mount ─────────────────────────────────────────────────────────
  const handleMount = useCallback(
    (editor, monaco) => {

      // Guarded paste — Ctrl/Cmd+V
      // Logic: read clipboard text, check if it already exists somewhere in
      // the editor model. If yes → it came from inside, allow. If no → block.
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
        async () => {
          try {
            const clipText = await navigator.clipboard.readText();
            const model = editor.getModel();
            const fullContent = model ? model.getValue() : "";

            if (fullContent.includes(clipText)) {
              // Text exists in the editor already — came from inside, allow
              editor.trigger("keyboard", "editor.action.clipboardPasteAction", null);
            } else {
              showBlockMsg();
            }
          } catch {
            // Clipboard API unavailable — block to be safe
            showBlockMsg();
          }
        }
      );

      // Bubble up caller's own onMount (e.g. Ctrl+Enter to run)
      onMount?.(editor, monaco);
    },
    [onMount, showBlockMsg]
  );

  // ── Default editor options ────────────────────────────────────────────────
  const mergedOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    padding: { top: 16, bottom: 16 },
    tabSize: 2,
    lineNumbers: "on",
    renderLineHighlight: "all",
    smoothScrolling: true,
    cursorBlinking: "smooth",
    bracketPairColorization: { enabled: true },
    // Caller's options override defaults
    ...options,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={style}
    >
      <Editor
        height={height}
        language={language}
        theme={resolvedTheme}
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        options={mergedOptions}
      />

      {/* Paste-blocked notification */}
      {blockMsg && (
        <div
          className="
            absolute bottom-4 left-1/2 -translate-x-1/2
            flex items-center gap-2
            px-3 py-2 rounded-lg
            bg-[#1a1f30]/90 border border-rose-500/30
            text-rose-400 text-[11px] font-semibold
            shadow-lg backdrop-blur-sm
            pointer-events-none select-none
            animate-fade-in
          "
          style={{ zIndex: 50 }}
        >
          {/* Lock icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          External paste blocked — only paste your own typed content
        </div>
      )}
    </div>
  );
}