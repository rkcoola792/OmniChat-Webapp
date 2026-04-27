import { useState } from "react";
import {
  UploadIcon,
  FileIcon,
  Spinner,
  EditIcon,
  SearchIcon,
  SettingsIcon,
  HelpIcon,
  TrashIcon,
} from "./icons";
import { HelpModal } from "./HelpModal";
import { SettingsModal } from "./SettingsModal";

function groupByDate(conversations) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday - 86400000);
  const startOfWeekAgo = new Date(startOfToday - 7 * 86400000);
  const groups = { Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };
  for (const conv of conversations) {
    const d = new Date(conv.updatedAt);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= startOfToday) groups["Today"].push(conv);
    else if (day >= startOfYesterday) groups["Yesterday"].push(conv);
    else if (day >= startOfWeekAgo) groups["Previous 7 Days"].push(conv);
    else groups["Older"].push(conv);
  }
  return groups;
}

function IconBtn({ onClick, title, children, active = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="10"
        height="10"
        rx="2"
        stroke="grey"
        strokeWidth="1"
      />
      <line
        x1="9"
        y1="5"
        x2="9"
        y2="15"
        stroke="grey"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ── Collapsed icon strip ── */
function CollapsedSidebar({
  user,
  onLogin,
  onToggleSidebar,
  onNewConversation,
  onHelp,
}) {
  return (
    <aside className="hidden md:flex w-14 bg-white border-r border-gray-200 flex-col items-center shrink-0 h-screen shadow-sm pt-3 pb-3 gap-1">
      {/* Expand */}
      <IconBtn onClick={onToggleSidebar} title="Open sidebar">
        <HamburgerIcon />
      </IconBtn>

      <div className="w-8 border-t border-gray-100 my-1" />

      {/* New chat */}
      <IconBtn onClick={onNewConversation} title="New chat">
        <EditIcon />
      </IconBtn>

      {/* Search */}
      <IconBtn title="Search chats">
        <SearchIcon />
      </IconBtn>

      <div className="flex-1" />

      {/* Settings */}
      <IconBtn title="Settings">
        <SettingsIcon />
      </IconBtn>

      {/* Help */}
      <IconBtn onClick={onHelp} title="Help">
        <HelpIcon />
      </IconBtn>

      {/* User / Login */}
      {user ? (
        <div
          title={user.name}
          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-default select-none"
        >
          {user.initials}
        </div>
      ) : (
        <IconBtn onClick={onLogin} title="Log in">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </IconBtn>
      )}
    </aside>
  );
}

/* ── Full expanded sidebar ── */
export function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
  user,
  onLogin,
  onLogout,
  onUpdateProfile,
  onToggleSidebar,
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
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (collapsed) {
    return (
      <>
        <CollapsedSidebar
          user={user}
          onLogin={onLogin}
          onToggleSidebar={onToggleSidebar}
          onNewConversation={onNewConversation}
          onHelp={() => setShowHelp(true)}
        />
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </>
    );
  }

  const list = conversations;
  const filtered = search
    ? list.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : list;
  const grouped = groupByDate(filtered);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={`
        bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen shadow-sm w-72
        fixed inset-y-0 left-0 z-50 transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:z-auto
      `}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900">OmniChat</span>
          </div>
          <button
            onClick={onToggleSidebar}
            title="Collapse sidebar"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HamburgerIcon />
          </button>
        </div>

        {/* New Chat + Search */}
        <div className="px-3 pt-2 pb-1 space-y-1">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <EditIcon />
            New chat
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Upload section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              Document
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
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
                  <p className="text-xs font-medium text-indigo-700 break-all">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <UploadIcon />
                  <p className="text-xs font-medium">
                    Drop file or click to browse
                  </p>
                  <p className="text-[11px]">PDF, TXT, CSV, DOC</p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 mt-1.5 px-1">{uploadError}</p>
            )}

            <button
              onClick={uploadFile}
              disabled={uploading || !file}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {uploading ? <Spinner /> : <UploadIcon />}
              {uploading ? "Uploading…" : "Upload Document"}
            </button>

            {uploadedName && (
              <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-green-700">
                    Active document
                  </p>
                  <p className="text-xs text-green-600 truncate">
                    {uploadedName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chat History */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              History
            </p>
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 italic px-1">
                {search ? "No matches found" : "No chat history yet"}
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(grouped).map(([label, items]) =>
                  items.length === 0 ? null : (
                    <div key={label}>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">
                        {label}
                      </p>
                      <div className="space-y-0.5">
                        {items.map((conv) => (
                          <div
                            key={conv.id}
                            onClick={() => onLoadConversation(conv.id)}
                            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                              activeConversationId === conv.id
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <span className="flex-1 truncate">
                              {conv.title}
                            </span>
                            <button
                              onClick={(e) => onDeleteConversation(conv.id, e)}
                              title="Delete"
                              className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 px-3 py-2 space-y-0.5">
          <button
            onClick={() => user && setShowSettings(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <SettingsIcon />
            Settings
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <HelpIcon />
            Help
          </button>

          {!user && (
            <div className="mt-2 rounded-xl bg-indigo-50 border border-indigo-100 p-3">
              <p className="text-xs font-semibold text-indigo-900 mb-1">
                Get responses tailored to you
              </p>
              <p className="text-[11px] text-indigo-700 mb-2.5">
                Log in to save chats, upload documents, and get personalized
                answers.
              </p>
              <button
                onClick={onLogin}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Log in
              </button>
            </div>
          )}

          {user && (
            <div className="relative mt-1">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.initials}
                </div>
                <span className="text-sm text-gray-800 font-medium truncate flex-1 text-left">
                  {user.name}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onUpdate={onUpdateProfile}
        />
      )}
    </>
  );
}
