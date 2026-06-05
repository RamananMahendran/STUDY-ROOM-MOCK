import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar.jsx";
import Editor from "@monaco-editor/react";

// Language configuration
const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    judge0Id: 71,
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    judge0Id: 63,
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    id: "java",
    label: "Java",
    judge0Id: 62,
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    id: "cpp",
    label: "C++",
    judge0Id: 54,
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
];

export default function PairCode() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Socket.io states
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [partnerCursor, setPartnerCursor] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  
  const editorRef = useRef(null);
  const isLocalChange = useRef(false);
  const API_BASE = "http://localhost:5001";

  // Get auth token and user info from localStorage (set by your login system)
  const token = localStorage.getItem("token");
  const currentUser = {
    id: parseInt(localStorage.getItem("userId") || "1"),
    name: localStorage.getItem("userName") || "User",
  };

  const addDebugLog = (msg) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  // Fetch session details with AUTH
  useEffect(() => {
    const fetchSession = async () => {
      try {
        addDebugLog(`🔍 Fetching session for room: ${roomId}`);
        
        if (!token) {
          setError("❌ No authentication token found. Please login first.");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_BASE}/api/pair/room/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        addDebugLog(`📥 Response status: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("❌ Authentication failed. Please login again.");
          } else if (response.status === 404) {
            setError("❌ Session not found. Please check the room code.");
          } else {
            setError(`❌ Failed to load session (Status: ${response.status})`);
          }
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        addDebugLog(`✅ Session loaded: ${data.data.status}`);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(`❌ Cannot connect to server: ${err.message}`);
        setLoading(false);
      }
    };
    
    if (roomId) {
      fetchSession();
    }
  }, [roomId, token]);

  // Initialize Socket.io with AUTH
  useEffect(() => {
    if (loading || error || !token) {
      addDebugLog(`⏳ Waiting - loading:${loading}, error:${!!error}, token:${!!token}`);
      return;
    }

    addDebugLog(`🔌 Initializing Socket.io with auth as ${currentUser.name} (ID: ${currentUser.id})`);
    
    const socketIo = io(API_BASE, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    // Debug: log all events
    socketIo.onAny((eventName, ...args) => {
      addDebugLog(`📡 Event: ${eventName}`);
    });

    socketIo.on("connect", () => {
      addDebugLog(`✅ Socket connected: ${socketIo.id}`);
      setIsConnected(true);
      
      socketIo.emit("join-pair-room", {
        roomCode: roomId,
        userId: currentUser.id,
        userName: currentUser.name,
      });
      addDebugLog(`📤 Emitted join-pair-room for: ${roomId} as ${currentUser.name}`);
    });

    socketIo.on("connect_error", (err) => {
      addDebugLog(`❌ Socket error: ${err.message}`);
      setError(`Connection error: ${err.message}`);
    });

    socketIo.on("user-joined", (data) => {
      addDebugLog(`👥 USER JOINED: ${data.userName} (ID: ${data.userId})`);
      setPartnerConnected(true);
      setPartnerName(data.userName);
    });

    socketIo.on("user-left", (data) => {
      addDebugLog(`👋 User left: ${data.userName}`);
      setPartnerConnected(false);
      setPartnerCursor(null);
    });

    socketIo.on("room-users", (users) => {
      addDebugLog(`🏠 Already in room: ${users.map(u => u.userName).join(', ')}`);
      if (users && users.length > 0) {
        setPartnerConnected(true);
        setPartnerName(users[0].userName);
      }
    });

    socketIo.on("cursor-move", (data) => {
      addDebugLog(`📡 Received cursor: ${data.userName} at L${data.lineNumber}:C${data.columnNumber}`);
      setPartnerCursor({
        lineNumber: data.lineNumber,
        columnNumber: data.columnNumber,
        userName: data.userName,
        color: data.color,
      });
    });

    socketIo.on("code-sync", (data) => {
      addDebugLog(`📥 Received initial code-sync from server`);
      if (!isLocalChange.current && data && data.code !== undefined) {
        setCode(data.code);
      }
    });

    socketIo.on("code-change", (data) => {
      addDebugLog(`📝 Code changed by partner`);
      if (!isLocalChange.current && data && data.code !== undefined) {
        setCode(data.code);
      }
    });

    socketIo.on("code-execution-result", (data) => {
      addDebugLog(`📡 Received execution result from ${data.userName}`);
      setOutput(`[${data.userName} ran code]\n${data.output}`);
    });

    socketIo.on("cursors-initial", (cursors) => {
      addDebugLog(`🎯 Initial cursors: ${cursors.length}`);
      if (cursors && cursors.length > 0) {
        setPartnerConnected(true);
        setPartnerCursor(cursors[0]);
        if (cursors[0].userName) {
          setPartnerName(cursors[0].userName);
        }
      }
    });

    socketIo.on("disconnect", (reason) => {
      addDebugLog(`🔌 Disconnected: ${reason}`);
      setIsConnected(false);
      setPartnerConnected(false);
    });

    setSocket(socketIo);

    return () => {
      if (socketIo) {
        socketIo.emit("leave-pair-room", {
          roomCode: roomId,
          userId: currentUser.id,
          userName: currentUser.name,
        });
        socketIo.disconnect();
      }
    };
  }, [loading, error, roomId, token, currentUser.id, currentUser.name]);

  const handleCodeChange = (value) => {
    setCode(value || "");
    isLocalChange.current = true;
    
    if (socket && isConnected) {
      socket.emit("code-change", {
        roomCode: roomId,
        code: value || "",
      });
      addDebugLog(`📤 Sent code change (length: ${(value || "").length})`);
    }
    
    setTimeout(() => {
      isLocalChange.current = false;
    }, 100);
  };

  const handleCursorMove = (position) => {
    if (socket && isConnected) {
      socket.emit("cursor-move", {
        roomCode: roomId,
        userId: currentUser.id,
        userName: currentUser.name,
        lineNumber: position.lineNumber,
        columnNumber: position.column,
        color: "#6366f1",
      });
      addDebugLog(`📤 Sent cursor: L${position.lineNumber}:C${position.column}`);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorPosition((e) => {
      handleCursorMove({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });
    
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => handleRunCode()
    );
  };

  const handleLanguageChange = (lang) => {
    setActiveLang(lang);
    setCode(lang.defaultCode);
    setOutput("");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    
    try {
      const response = await fetch(`${API_BASE}/api/code/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sourceCode: code,
          languageId: activeLang.judge0Id,
        }),
      });

      const result = await response.json();
      let outputText = "";
      
      if (result.data?.stdout) {
        outputText = result.data.stdout;
        setOutput(outputText);
      } else if (result.data?.stderr) {
        outputText = `Error: ${result.data.stderr}`;
        setOutput(outputText);
      } else if (result.data?.compile_output) {
        outputText = `Compilation Error: ${result.data.compile_output}`;
        setOutput(outputText);
      } else {
        outputText = result.message || "No output";
        setOutput(outputText);
      }
      
      // Broadcast to partner
      if (socket && isConnected) {
        addDebugLog(`📤 Broadcasting execution result to partner...`);
        socket.emit("code-execution-result", {
          roomCode: roomId,
          output: outputText,
          userName: currentUser.name,
        });
      }
      
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = `Error: ${err.message}`;
      setOutput(errorMsg);
      
      if (socket && isConnected) {
        socket.emit("code-execution-result", {
          roomCode: roomId,
          output: errorMsg,
          userName: currentUser.name,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="fixed inset-0 flex" style={{ background: '#0f0f1a' }}>
        <Sidebar active="pair-code" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <div className="text-yellow-500 text-sm mb-4">
              Token: {token ? '✅ YES' : '❌ NO'}
              <br />
              User: {currentUser.name} (ID: {currentUser.id})
            </div>
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg mr-2"
            >
              Go to Login
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex" style={{ background: '#0f0f1a' }}>
        <Sidebar active="pair-code" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/practice/pair-code")}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700">
            <span className="text-gray-400 text-sm">Room:</span>
            <span className="text-yellow-500 font-mono font-bold">{roomId}</span>
            <button onClick={copyRoomId} className="text-gray-500 hover:text-gray-300">
              {copied ? "✓" : "📋"}
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            {!isConnected ? (
              <span className="text-yellow-500 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Connecting...
              </span>
            ) : !partnerConnected ? (
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Waiting for partner...
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {partnerName} connected
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium"
        >
          ▶ {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 px-4 py-2 border-b border-gray-800">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeLang.id === lang.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-700 relative">
          <Editor
            height="100%"
            language={activeLang.id}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
          
          {partnerCursor && (
            <div className="absolute bottom-2 right-2 bg-indigo-500/20 rounded-lg px-2 py-1 text-xs">
              <span className="text-indigo-400">👤 {partnerCursor.userName}</span>
              <span className="text-gray-500 ml-2">L{partnerCursor.lineNumber}</span>
            </div>
          )}
        </div>

        <div className="w-96 rounded-lg border border-gray-700 bg-gray-900 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-700">
            <span className="text-sm font-medium text-gray-400">Output</span>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {output || "Click 'Run Code' to see output"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}