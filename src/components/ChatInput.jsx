import { SendIcon, StopIcon } from "./icons";

export function ChatInput({ question, setQuestion, asking, uploadedName, textareaRef, handleKeyDown, askQuestion, stopStreaming }) {
  return (
    <div className="bg-white border-t border-gray-200 px-3 py-3 sm:px-6 sm:py-4 shrink-0">
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
      <p className="hidden sm:block text-xs text-gray-400 mt-2 text-center">
        Shift + Enter for new line · Enter to send
      </p>
    </div>
  );
}
