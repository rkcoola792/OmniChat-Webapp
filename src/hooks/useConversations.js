import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../constants";

export function useConversations() {
  const user = useSelector((state) => state.user.info);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  // Local cache: chatId → messages[], so switching back doesn't wipe streamed messages
  const [messagesCache, setMessagesCache] = useState({});

  function axiosConfig() {
    const config = { withCredentials: true };
    if (user?.token) config.headers = { Authorization: `Bearer ${user.token}` };
    return config;
  }

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversationId(null);
      setMessagesCache({});
      return;
    }
    fetchChats();
  }, [user]);

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${API}/chat`, axiosConfig());

      if (data.length === 0) {
        const created = await createChat();
        if (created) {
          setConversations([created]);
          setActiveConversationId(created.id);
        }
        return;
      }

      const normalized = data.map((c) => ({ ...c, id: c._id }));
      setConversations(normalized);
      setActiveConversationId(normalized[0].id);
    } catch (e) {
      console.error("Failed to fetch chats", e);
    }
  }

  async function createChat() {
    try {
      const { data } = await axios.post(`${API}/chat`, {}, axiosConfig());
      return {
        _id: data.chatId,
        id: data.chatId,
        title: data.title,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
      };
    } catch (e) {
      console.error("Failed to create chat", e);
      return null;
    }
  }

  // Returns cached messages if available, otherwise fetches from API and caches result
  async function fetchChatMessages(id) {
    if (messagesCache[id]) return messagesCache[id];
    try {
      const { data } = await axios.get(`${API}/chat/${id}`, axiosConfig());
      const messages = (data.messages || []).map((m) => ({
        role: m.role === "assistant" ? "ai" : "user",
        text: m.content,
        sources: m.sources || [],
        timestamp: m.createdAt || new Date().toISOString(),
      }));
      if (messages.length > 0) {
        setMessagesCache((prev) => ({ ...prev, [id]: messages }));
      }
      return messages;
    } catch (e) {
      console.error("Failed to fetch chat messages", e);
      return [];
    }
  }

  // Called from App.jsx after streaming ends to keep the cache in sync
  function cacheMessages(id, messages) {
    if (!id || messages.length === 0) return;
    setMessagesCache((prev) => ({ ...prev, [id]: messages }));
  }

  async function startNewConversation() {
    if (!user) return;
    const chat = await createChat();
    if (!chat) return;
    setConversations((prev) => [chat, ...prev]);
    setActiveConversationId(chat.id);
  }

  async function deleteConversation(id, e) {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/chat/${id}`, axiosConfig());
    } catch (err) {
      console.error("Failed to delete chat", err);
    }

    const isActive = activeConversationId === id;
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    setMessagesCache((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    if (isActive) {
      setActiveConversationId(remaining[0]?.id || null);
    }
  }

  function updateConversationTitle(id, title) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
      )
    );
  }

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    fetchChatMessages,
    cacheMessages,
    startNewConversation,
    deleteConversation,
    updateConversationTitle,
  };
}
