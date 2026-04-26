import axios from "axios";
import { useState, useRef, useEffect } from "react";

const API = "http://localhost:5000";

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
        AI
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function Message({ role, text, timestamp, sources, onSourceClick, activeSource }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isUser ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"}`}>
        {isUser ? "You" : "AI"}
      </div>
      <div className={`max-w-[72%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
        }`}>
          {text}
        </div>
        <span className="text-xs text-gray-400 px-1">{timestamp}</span>
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5 px-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide self-center">Sources:</span>
            {sources.map((src, i) => {
              const label = typeof src === "string" ? src : src.source ?? src.file ?? JSON.stringify(src);
              const page = typeof src === "object" && src.page ? `p.${src.page}` : null;
              const isActive = activeSource === src;
              return (
                <button
                  key={i}
                  onClick={() => onSourceClick(src)}
                  className={`inline-flex items-center gap-1 border text-[11px] font-medium rounded-full px-2.5 py-0.5 transition-colors cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate max-w-[140px]">{label}</span>
                  {page && <span className={isActive ? "text-indigo-200" : "text-indigo-400"}>{page}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ChunkPanel({ source, onClose }) {
  const label = typeof source === "string" ? source : source.source ?? source.file ?? "Source";
  const page = typeof source === "object" && source.page ? source.page : null;
  const content = typeof source === "object" ? (source.content ?? source.text ?? source.chunk ?? null) : null;

  return (
    <aside className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col shadow-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{label}</p>
            {page && <p className="text-[10px] text-gray-400">Page {page}</p>}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Retrieved chunk</p>
        {content ? (
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 border border-gray-100 rounded-xl px-3 py-3">
            {content}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center gap-2 text-gray-400">
            <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs text-gray-400">No chunk text included.<br />Add a <code className="bg-gray-100 px-1 rounded">content</code> field to your sources.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function getNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getDateKey() {
  return new Date().toLocaleDateString([], { month: "short", day: "numeric" });
}

// 🧠 Chat history storage
const STORAGE_KEY = "rag-chat-history";

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save chat history", e);
  }
}

function createConversation() {
  return {
    id: Date.now().toString(),
    title: "New conversation",
    messages: [],
    document: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadedName, setUploadedName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");

  const [selectedSource, setSelectedSource] = useState(null);

  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // 🧠 Chat history state
  const [conversations, setConversations] = useState(() => loadHistory());
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const loaded = loadHistory();
    return loaded.length > 0 ? loaded[0].id : null;
  });

  // Load messages when active conversation changes
  useEffect(() => {
    const active = conversations.find(c => c.id === activeConversationId);
    if (active) {
      setMessages(active.messages);
      setUploadedName(active.document || "");
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  // Auto-save messages to current conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    setConversations(prev => {
      const updated = prev.map(c => 
        c.id === activeConversationId 
          ? { 
              ...c, 
              messages, 
              updatedAt: new Date().toISOString(),
              title: c.messages.length > 0 && c.title === "New conversation"
                ? c.messages[0].text.slice(0, 40) + (c.messages[0].text.length > 40 ? "..." : "")
                : c.title
            }
          : c
      );
      saveHistory(updated);
      return updated;
    });
  }, [messages, activeConversationId]);

  function startNewConversation() {
    const newConv = createConversation();
    newConv.document = uploadedName;
    setConversations(prev => {
      const updated = [newConv, ...prev];
      saveHistory(updated);
      return updated;
    });
    setActiveConversationId(newConv.id);
    setMessages([]);
    setUploadedName("");
    setQuestion("");
    setAskError("");
  }

  function loadConversation(id) {
    setActiveConversationId(id);
  }

  function deleteConversation(id, e) {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveHistory(updated);
      if (activeConversationId === id) {
        const remaining = updated[0];
        setActiveConversationId(remaining?.id || null);
        if (remaining) {
          setMessages(remaining.messages);
          setUploadedName(remaining.document || "");
        } else {
          setMessages([]);
        }
      }
      return updated;
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  function handleFileChange(selected) {
    setUploadError("");
    if (!selected) return;
    if (!selected.name.match(/\.(pdf|txt|csv|doc|docx)$/i)) {
      setUploadError("Unsupported file type. Please upload PDF, TXT, CSV, or DOC.");
      return;
    }
    setFile(selected);
    setUploadedName("");
  }

  async function uploadFile() {
    if (!file) {
      setUploadError("Please select a file first.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedName(file.name);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Update current conversation with the uploaded document
      if (activeConversationId) {
        setConversations(prev => {
          const updated = prev.map(c => 
            c.id === activeConversationId 
              ? { ...c, document: file.name }
              : c
          );
          saveHistory(updated);
          return updated;
        });
      }
    } catch (err) {
      setUploadError(err?.response?.data?.error || "Upload failed. Is the server running?");
    } finally {
      setUploading(false);
    }
  }

const controllerRef = useRef(null);

async function askQuestion() {
  const q = question.trim();
  if (!q) return;

  if (!uploadedName) {
    setAskError("Please upload a document before asking questions.");
    return;
  }

  setQuestion("");
  if (textareaRef.current) textareaRef.current.style.height = "auto";
  setAskError("");

  // Add user message
  const updatedMessages = [
    ...messages,
    { role: "user", text: q, timestamp: getNow() }
  ];
  setMessages(updatedMessages);

  setAsking(true);

  try {
    const controller = new AbortController();
    controllerRef.current = controller;

    const response = await fetch(`${API}/ask-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        question: q,
        history: updatedMessages.slice(-5) // 🧠 multi-turn memory
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let accumulatedText = "";
    let aiMessageAdded = false;
    let parsedSources = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      accumulatedText += chunk;

      if (accumulatedText.includes("__SOURCES__")) {
        const [textPart, sourcesPart] = accumulatedText.split("__SOURCES__");
        accumulatedText = textPart;
        try {
          parsedSources = JSON.parse(sourcesPart);
        } catch (e) {
          console.error("Failed to parse sources");
        }
      }

      if (!aiMessageAdded) {
        aiMessageAdded = true;
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: accumulatedText, timestamp: getNow(), sources: parsedSources }
        ]);
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: accumulatedText,
            sources: parsedSources
          };
          return updated;
        });
      }
    }

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Streaming stopped by user");
      return;
    }

    const errMsg = "Something went wrong. Please try again.";
    setAskError(errMsg);

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: `Error: ${errMsg}`, timestamp: getNow() }
    ]);
  } finally {
    setAsking(false);
  }
}

  function stopStreaming() {
    controllerRef.current?.abort();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">RAG Chat</h1>
              <p className="text-xs text-gray-400">Document Q&amp;A</p>
            </div>
          </div>
        </div>

        {/* Upload section */}
        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Document
          </p>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-colors mb-3 ${
              dragging
                ? "border-indigo-500 bg-indigo-50"
                : file
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.csv,.doc,.docx"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-1">
                <FileIcon />
                <p className="text-xs font-medium text-indigo-700 break-all">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <UploadIcon />
                <p className="text-xs font-medium">Drop file here or click to browse</p>
                <p className="text-xs">PDF, TXT, CSV, DOC</p>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-red-500 mb-2 px-1">{uploadError}</p>
          )}

          <button
            onClick={uploadFile}
            disabled={uploading || !file}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? <Spinner /> : <UploadIcon />}
            {uploading ? "Uploading…" : "Upload Document"}
          </button>

          {/* Uploaded doc badge */}
          {uploadedName && (
            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-700">Active document</p>
                <p className="text-xs text-green-600 truncate">{uploadedName}</p>
              </div>
            </div>
          )}

          {/* 🧠 Chat History */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                History
              </p>
              <button
                onClick={startNewConversation}
                title="New conversation"
                className="w-6 h-6 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {conversations.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No chat history yet</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      activeConversationId === conv.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="flex-1 truncate">{conv.title}</span>
                    <span className="text-[10px] text-gray-400">{getDateKey()}</span>
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              How to use
            </p>
            <ol className="space-y-2">
              {[
                "Upload a PDF or text document",
                "Ask any question about its contents",
                "Get AI-powered answers instantly",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>

      {/* Main chat + chunk panel */}
      <main className="flex flex-1 min-w-0">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {uploadedName ? `Chatting about: ${uploadedName}` : "RAG Chat"}
            </h2>
            <p className="text-xs text-gray-400">
              {uploadedName ? "Ask anything about your document" : "Upload a document to get started"}
            </p>
          </div>
          {uploadedName && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Ready
            </span>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !asking && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">No messages yet</p>
                <p className="text-xs mt-1">
                  {uploadedName ? "Ask a question about your document" : "Upload a document from the sidebar first"}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <Message
              key={i}
              {...msg}
              onSourceClick={(src) => setSelectedSource(prev => prev === src ? null : src)}
              activeSource={selectedSource}
            />
          ))}

          {asking && messages[messages.length - 1]?.role !== "ai" && <TypingIndicator />}

          {askError && !asking && (
            <p className="text-xs text-red-500 text-center mt-2">{askError}</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 shrink-0">
          <div className={`flex items-center gap-3 bg-gray-50 border rounded-2xl px-4 py-3 transition-colors ${
            !uploadedName
              ? "opacity-60 border-gray-200"
              : "focus-within:border-indigo-400 focus-within:bg-white border-gray-200"
          }`}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder={uploadedName ? "Ask a question…" : "Upload a document first"}
              disabled={!uploadedName || asking}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed disabled:cursor-not-allowed"
              style={{ maxHeight: 120 }}
            />
            {asking ? (
              <button
                onClick={stopStreaming}
                title="Stop generating"
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <StopIcon />
              </button>
            ) : (
              <button
                onClick={askQuestion}
                disabled={!question.trim() || !uploadedName}
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <SendIcon />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Shift + Enter for new line · Enter to send
          </p>
        </div>
      </div>

      {selectedSource && (
        <ChunkPanel source={selectedSource} onClose={() => setSelectedSource(null)} />
      )}
      </main>
    </div>
  );
}
