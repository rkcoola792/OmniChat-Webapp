import { useState } from "react";
import { loadHistory, saveHistory } from "../utils/storage";
import { createConversation } from "../utils/helpers";

export function useConversations() {
  const [conversations, setConversations] = useState(() => loadHistory());
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const loaded = loadHistory();
    return loaded.length > 0 ? loaded[0].id : null;
  });

  function startNewConversation(currentDocument) {
    const newConv = createConversation();
    newConv.document = currentDocument;
    setConversations(prev => {
      const updated = [newConv, ...prev];
      saveHistory(updated);
      return updated;
    });
    setActiveConversationId(newConv.id);
    return newConv;
  }

  function loadConversation(id) {
    setActiveConversationId(id);
  }

  function deleteConversation(id, e, { onSwitch } = {}) {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveHistory(updated);
      if (activeConversationId === id) {
        const remaining = updated[0];
        setActiveConversationId(remaining?.id || null);
        onSwitch?.(remaining);
      }
      return updated;
    });
  }

  function updateConversationMessages(id, newMessages) {
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === id
          ? {
              ...c,
              messages: newMessages,
              updatedAt: new Date().toISOString(),
              title: c.messages.length > 0 && c.title === "New conversation"
                ? c.messages[0].text.slice(0, 40) + (c.messages[0].text.length > 40 ? "..." : "")
                : c.title,
            }
          : c
      );
      saveHistory(updated);
      return updated;
    });
  }

  function updateConversationDocument(id, document) {
    setConversations(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, document } : c);
      saveHistory(updated);
      return updated;
    });
  }

  return {
    conversations,
    activeConversationId,
    startNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationMessages,
    updateConversationDocument,
  };
}
