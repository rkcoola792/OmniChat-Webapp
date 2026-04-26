export function getNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getDateKey() {
  return new Date().toLocaleDateString([], { month: "short", day: "numeric" });
}

export function createConversation() {
  return {
    id: Date.now().toString(),
    title: "New conversation",
    messages: [],
    document: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
