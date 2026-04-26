export function ChunkPanel({ source, onClose }) {
  const label = typeof source === "string" ? source : source.source ?? source.file ?? "Source";
  const page = typeof source === "object" && source.page ? source.page : null;
  const content = typeof source === "object" ? (source.content ?? source.text ?? source.chunk ?? null) : null;

  return (
    <aside className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col shadow-sm">
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
            <p className="text-xs text-gray-400">
              No chunk text included.<br />
              Add a <code className="bg-gray-100 px-1 rounded">content</code> field to your sources.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
