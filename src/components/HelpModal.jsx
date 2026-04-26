const STEPS = [
  {
    number: "1",
    color: "bg-indigo-600",
    title: "Upload Your Document",
    description:
      "Start by uploading any document — PDF, Word file, or plain text. This is the knowledge source OmniChat will use to answer your questions.",
    detail: "Think of it like handing a book to a very fast reader.",
  },
  {
    number: "2",
    color: "bg-violet-600",
    title: "Embeddings Are Created",
    description:
      "Once uploaded, the document is broken into small chunks and each chunk is converted into a list of numbers called an \"embedding\". These numbers capture the meaning of each piece of text.",
    detail: "This is how the AI understands what your document is about — not just the words, but the context and meaning behind them.",
  },
  {
    number: "3",
    color: "bg-blue-600",
    title: "You Ask a Question",
    description:
      "Type your question in the chat box. Your question is also converted into an embedding so it can be compared against the document chunks.",
    detail: "For example: \"What are the side effects mentioned?\" or \"Summarise section 3.\"",
  },
  {
    number: "4",
    color: "bg-cyan-600",
    title: "Relevant Chunks Are Retrieved",
    description:
      "The app searches through all the document chunks and finds the ones most relevant to your question. Only the most useful pieces are picked.",
    detail: "This is the \"Retrieval\" part of RAG — Retrieval-Augmented Generation.",
  },
  {
    number: "5",
    color: "bg-green-600",
    title: "AI Generates Your Answer",
    description:
      "Those relevant chunks are passed to the AI along with your question. The AI reads them and crafts a clear, accurate answer — grounded in your document, not guesswork.",
    detail: "This is the \"Generation\" part. The AI won't make things up — it only answers based on what's in your document.",
  },
];

export function HelpModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">How OmniChat Works</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
            OmniChat uses <span className="text-white font-semibold">RAG</span> — Retrieval-Augmented Generation — to give you accurate answers straight from your document.
          </p>
        </div>

        {/* Steps */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              {/* Number + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-4 ${i === STEPS.length - 1 ? "" : ""}`}>
                <p className="text-sm font-semibold text-gray-900 mb-1">{step.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                <p className="text-[11px] text-indigo-500 mt-1.5 italic">{step.detail}</p>
              </div>
            </div>
          ))}

          {/* Summary banner */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mt-2">
            <p className="text-xs font-semibold text-indigo-800 mb-1">In short</p>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Upload a document → AI reads and indexes it → You ask a question → AI finds the relevant parts → You get an answer based purely on your document. No hallucinations, no guesswork.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Got it, let's go!
          </button>
        </div>
      </div>
    </div>
  );
}
