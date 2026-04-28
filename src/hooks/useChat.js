import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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

    const controller = new AbortController();
    controllerRef.current = controller;

    const headers = { "Content-Type": "application/json" };
    if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;

    let fullResponse = "";
    let aiMessageAdded = false;

    try {
      // Use axios with responseType:'text' + onDownloadProgress.
      // XHR's responseText accumulates chunk-by-chunk even behind Nginx/Render proxies,
      // unlike fetch ReadableStream which stalls when the proxy buffers the whole body.
      const response = await axios.post(
        `${API}/ask-stream`,
        {
          question: q,
          chatId: chatId || undefined,
        },
        {
          withCredentials: true,
          headers,
          signal: controller.signal,
          responseType: "text",
          onDownloadProgress: (progressEvent) => {
            const text = progressEvent.event?.target?.responseText ?? "";
            if (!text || text === fullResponse) return;
            fullResponse = text;

            // Strip sources delimiter for live display — JSON may arrive incomplete
            const displayText = text.includes("__SOURCES__")
              ? text.split("__SOURCES__")[0]
              : text;

            if (!aiMessageAdded && displayText) {
              aiMessageAdded = true;
              setMessages((prev) => [
                ...prev,
                { role: "ai", text: displayText, timestamp: getNow(), sources: [] },
              ]);
            } else if (displayText) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: displayText,
                };
                return updated;
              });
            }
          },
        }
      );

      // Fallback: if onDownloadProgress never fired (some envs suppress XHR progress),
      // use the complete response body that axios gives us after the request finishes.
      const completeText = fullResponse || response.data || "";

      // Parse sources from the complete response
      let finalText = completeText;
      let parsedSources = [];
      if (completeText.includes("__SOURCES__")) {
        const [textPart, sourcesPart] = completeText.split("__SOURCES__");
        finalText = textPart;
        try {
          parsedSources = JSON.parse(sourcesPart);
        } catch {
          console.error("Failed to parse sources JSON");
        }
      }

      if (aiMessageAdded) {
        // Update last AI message with correct final text + sources
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
      } else if (finalText) {
        // onDownloadProgress never fired — add AI message now from complete response
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: finalText, timestamp: getNow(), sources: parsedSources },
        ]);
      }

      if (isFirstMessage && chatId && onTitleUpdate) {
        onTitleUpdate(chatId, q.slice(0, 60) + (q.length > 60 ? "..." : ""));
      }
    } catch (err) {
      if (axios.isCancel(err) || err.name === "AbortError" || err.code === "ERR_CANCELED") return;
      const errMsg = err.response?.data || err.message || "Something went wrong. Please try again.";
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
