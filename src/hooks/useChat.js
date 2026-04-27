import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { API } from "../constants";
import { getNow } from "../utils/helpers";

export function useChat({ uploadedName, chatId, onTitleUpdate }) {
  const user = useSelector((state) => state.user.info);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");
  const controllerRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  async function askQuestion() {
    const q = question.trim();
    if (!q) return;

    setQuestion("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setAskError("");

    const isFirstMessage = messages.length === 0;
    const updatedMessages = [
      ...messages,
      { role: "user", text: q, timestamp: getNow() },
    ];
    setMessages(updatedMessages);
    setAsking(true);

    try {
      const controller = new AbortController();
      controllerRef.current = controller;

      const headers = { "Content-Type": "application/json" };
      if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;

      // Must use fetch (not axios) — axios doesn't support ReadableStream in browsers
      const response = await fetch(`${API}/ask-stream`, {
        method: "POST",
        headers,
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          question: q,
          history: updatedMessages.slice(-5),
          chatId: chatId || undefined,
        }),
      });

      if (!response.ok) {
        let serverMsg = "";
        try { serverMsg = await response.text(); } catch { /* ignore */ }
        throw new Error(serverMsg || `Server error ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported by server");
      }

      const reader = response.body.getReader();
      // { stream: true } buffers incomplete multi-byte UTF-8 sequences across chunks
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";
      let aiMessageAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullResponse += decoder.decode(value, { stream: true });

        // Strip sources delimiter for live display — JSON may be incomplete mid-stream
        const displayText = fullResponse.includes("__SOURCES__")
          ? fullResponse.split("__SOURCES__")[0]
          : fullResponse;

        if (!aiMessageAdded) {
          aiMessageAdded = true;
          setMessages((prev) => [
            ...prev,
            { role: "ai", text: displayText, timestamp: getNow(), sources: [] },
          ]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: displayText,
            };
            return updated;
          });
        }
      }

      // Flush any bytes held by the decoder for incomplete multi-byte chars
      fullResponse += decoder.decode();

      // Parse sources now that the full response is available
      let finalText = fullResponse;
      let parsedSources = [];
      if (fullResponse.includes("__SOURCES__")) {
        const [textPart, sourcesPart] = fullResponse.split("__SOURCES__");
        finalText = textPart;
        try {
          parsedSources = JSON.parse(sourcesPart);
        } catch {
          console.error("Failed to parse sources JSON");
        }
      }

      // Final update with correct text + sources
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: finalText,
          sources: parsedSources,
        };
        return updated;
      });

      if (isFirstMessage && chatId && onTitleUpdate) {
        onTitleUpdate(chatId, q.slice(0, 60) + (q.length > 60 ? "..." : ""));
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      const errMsg = err.message || "Something went wrong. Please try again.";
      setAskError(errMsg);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${errMsg}`, timestamp: getNow() },
      ]);
    } finally {
      setAsking(false);
    }
  }

  function stopStreaming() {
    controllerRef.current?.abort();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  }

  return {
    question,
    setQuestion,
    messages,
    setMessages,
    asking,
    askError,
    bottomRef,
    textareaRef,
    askQuestion,
    stopStreaming,
    handleKeyDown,
  };
}
