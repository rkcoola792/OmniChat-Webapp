export function ChatHeader({ user, onLogin, uploadedName }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          {uploadedName ? `Chatting about: ${uploadedName}` : "RAG Chat"}
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
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none">
            {user.initials}
          </div>
        )}
      </div>
    </header>
  );
}
