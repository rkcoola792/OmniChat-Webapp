import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";

export function MessageList({ messages, asking, askError, uploadedName, bottomRef, selectedSource, setSelectedSource }) {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
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
  );
}
