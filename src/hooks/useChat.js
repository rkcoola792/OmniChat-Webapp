import { useState, useRef, useEffect } from "react";
import { API } from "../constants";
import { getNow } from "../utils/helpers";

export function useChat({ uploadedName }) {
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

    if (!uploadedName) {
      setAskError("Please upload a document before asking questions.");
      return;
    }

    setQuestion("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setAskError("");

    const updatedMessages = [...messages, { role: "user", text: q, timestamp: getNow() }];
    setMessages(updatedMessages);
    setAsking(true);

    try {
      const controller = new AbortController();
      controllerRef.current = controller;

      const response = await fetch(`${API}/ask-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: q,
          history: updatedMessages.slice(-5),
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let aiMessageAdded = false;
      let parsedSources = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedText += chunk;

        if (accumulatedText.includes("__SOURCES__")) {
          const [textPart, sourcesPart] = accumulatedText.split("__SOURCES__");
          accumulatedText = textPart;
          try {
            parsedSources = JSON.parse(sourcesPart);
          } catch {
            console.error("Failed to parse sources");
          }
        }

        if (!aiMessageAdded) {
          aiMessageAdded = true;
          setMessages(prev => [
            ...prev,
            { role: "ai", text: accumulatedText, timestamp: getNow(), sources: parsedSources },
          ]);
        } else {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: accumulatedText,
              sources: parsedSources,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      const errMsg = "Something went wrong. Please try again.";
      setAskError(errMsg);
      setMessages(prev => [
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
