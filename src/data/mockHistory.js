const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const MOCK_HISTORY = [
  { id: "mock-1", title: "What is machine learning?", messages: [], document: "", createdAt: d(0), updatedAt: d(0) },
  { id: "mock-2", title: "How does Python handle memory?", messages: [], document: "", createdAt: d(0), updatedAt: d(0) },
  { id: "mock-3", title: "Explain neural networks simply", messages: [], document: "lecture_notes.pdf", createdAt: d(1), updatedAt: d(1) },
  { id: "mock-4", title: "RAG architecture deep dive", messages: [], document: "research_paper.pdf", createdAt: d(1), updatedAt: d(1) },
  { id: "mock-5", title: "How does LangChain work?", messages: [], document: "", createdAt: d(3), updatedAt: d(3) },
  { id: "mock-6", title: "Vector database comparison", messages: [], document: "db_comparison.pdf", createdAt: d(5), updatedAt: d(5) },
  { id: "mock-7", title: "Summarize Q4 financial report", messages: [], document: "q4_report.pdf", createdAt: d(6), updatedAt: d(6) },
  { id: "mock-8", title: "Transformer architecture explained", messages: [], document: "", createdAt: d(15), updatedAt: d(15) },
  { id: "mock-9", title: "Getting started with embeddings", messages: [], document: "", createdAt: d(20), updatedAt: d(20) },
];
