export function ChatHeader({ uploadedName }) {
  return (
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
  );
}
