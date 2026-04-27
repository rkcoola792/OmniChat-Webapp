import { useState, useRef, useEffect } from "react";

function PencilIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110.414 16H8v-2.414a2 2 0 01.586-1.414z" />
    </svg>
  );
}

export function ChatHeader({ user, onLogin, onLogout, uploadedName, chatTitle, onRenameChat, onOpenSidebar }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editing) {
      setEditValue(chatTitle || "New Chat");
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [editing]);

  function startEdit() {
    setEditing(true);
  }

  function confirmEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== chatTitle && onRenameChat) {
      onRenameChat(trimmed);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") confirmEdit();
    if (e.key === "Escape") cancelEdit();
  }

  const displayTitle = chatTitle || "New Chat";

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer shrink-0 mr-1"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm font-semibold text-gray-900 border border-indigo-400 rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-indigo-300 w-64 max-w-xs"
            />
            <button
              onClick={confirmEdit}
              className="text-xs px-2 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="text-xs px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate max-w-30 sm:max-w-xs">
              {displayTitle}
            </h2>
            <button
              onClick={startEdit}
              title="Rename chat"
              className="text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
            >
              <PencilIcon />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {uploadedName && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Ready
          </span>
        )}

        {!user ? (
          <>
            <button
              onClick={onLogin}
              className="px-3 sm:px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onLogin}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Sign up for free</span>
              <span className="sm:hidden">Sign up</span>
            </button>
          </>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
            >
              {user.initials}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={() => { setShowMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
