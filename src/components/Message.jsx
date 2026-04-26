export function Message({ role, text, timestamp, sources, onSourceClick, activeSource }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
          AI
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? "items-end max-w-[75%]" : "items-start flex-1"}`}>
        {isUser ? (
          <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        ) : (
          <div className="text-[#ececec] text-sm leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        )}

        <span className="text-[11px] text-gray-600 px-1">{timestamp}</span>

        {!isUser && sources && sources.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide self-center">Sources:</span>
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
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate max-w-[140px]">{label}</span>
                  {page && <span className={isActive ? "text-indigo-200" : "text-gray-500"}>{page}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
          You
        </div>
      )}
    </div>
  );
}
