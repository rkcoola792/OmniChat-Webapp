import { useState } from "react";
import { UploadIcon, FileIcon, Spinner } from "./icons";
import { getDateKey } from "../utils/helpers";

export function Sidebar({
  file,
  uploadedName,
  uploading,
  uploadError,
  fileInputRef,
  handleFileChange,
  uploadFile,
  conversations,
  activeConversationId,
  onNewConversation,
  onLoadConversation,
  onDeleteConversation,
}) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  }

  return (
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

      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Document</p>

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

        {uploadedName && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-green-700">Active document</p>
              <p className="text-xs text-green-600 truncate">{uploadedName}</p>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">History</p>
            <button
              onClick={onNewConversation}
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
                  onClick={() => onLoadConversation(conv.id)}
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
                    onClick={(e) => onDeleteConversation(conv.id, e)}
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

        {/* How to use */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">How to use</p>
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
  );
}
