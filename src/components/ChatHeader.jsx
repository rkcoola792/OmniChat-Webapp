import { useState, useRef, useEffect } from "react";

export function ChatHeader({ user, onLogin, onLogout, uploadedName }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          {uploadedName ? `Chatting about: ${uploadedName}` : "OmniChat"}
        </h2>
        <p className="text-xs text-gray-400">
          {uploadedName ? "Ask anything about your document" : "Upload a document or ask anything"}
        </p>
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
              className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Sign up for free
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
