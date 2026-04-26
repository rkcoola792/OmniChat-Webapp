import { useState, useEffect } from "react";
import { useConversations } from "./hooks/useConversations";
import { useUpload } from "./hooks/useUpload";
import { useChat } from "./hooks/useChat";
import { useAuth } from "./hooks/useAuth";
import { Sidebar } from "./components/Sidebar";
import { ChatHeader } from "./components/ChatHeader";
import { AuthModal } from "./components/AuthModal";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { ChunkPanel } from "./components/ChunkPanel";

export default function App() {
  const { user, authModal, openLogin, openSignup, closeModal, login, register, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    conversations,
    activeConversationId,
    startNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationMessages,
    updateConversationDocument,
  } = useConversations();

  const {
    file,
    uploadedName,
    uploading,
    uploadError,
    fileInputRef,
    setUploadedName,
    handleFileChange,
    uploadFile,
  } = useUpload({ activeConversationId, updateConversationDocument });

  const {
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
  } = useChat({ uploadedName });

  const [selectedSource, setSelectedSource] = useState(null);

  // Sync messages and document name when switching conversations
  useEffect(() => {
    const active = conversations.find(c => c.id === activeConversationId);
    if (active) {
      setMessages(active.messages);
      setUploadedName(active.document || "");
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  // Persist messages to the active conversation on every change
  useEffect(() => {
    if (!activeConversationId) return;
    updateConversationMessages(activeConversationId, messages);
  }, [messages, activeConversationId]);

  function handleNewConversation() {
    startNewConversation(uploadedName);
    setMessages([]);
    setUploadedName("");
    setQuestion("");
  }

  function handleDeleteConversation(id, e) {
    deleteConversation(id, e, {
      onSwitch: (remaining) => {
        if (remaining) {
          setMessages(remaining.messages);
          setUploadedName(remaining.document || "");
        } else {
          setMessages([]);
          setUploadedName("");
        }
      },
    });
  }

  return (
    <>
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        user={user}
        onLogin={openLogin}
        onLogout={logout}
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        file={file}
        uploadedName={uploadedName}
        uploading={uploading}
        uploadError={uploadError}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        uploadFile={uploadFile}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onLoadConversation={loadConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <main className="flex flex-col flex-1 min-w-0">
        <ChatHeader
          user={user}
          onLogin={openLogin}
          uploadedName={uploadedName}
        />

        <div className="flex flex-1 min-w-0 overflow-hidden">
          <div className="flex flex-col flex-1 min-w-0">
            <MessageList
              messages={messages}
              asking={asking}
              askError={askError}
              uploadedName={uploadedName}
              bottomRef={bottomRef}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
            <ChatInput
              question={question}
              setQuestion={setQuestion}
              asking={asking}
              uploadedName={uploadedName}
              textareaRef={textareaRef}
              handleKeyDown={handleKeyDown}
              askQuestion={askQuestion}
              stopStreaming={stopStreaming}
            />
          </div>

          {selectedSource && (
            <ChunkPanel source={selectedSource} onClose={() => setSelectedSource(null)} />
          )}
        </div>
      </main>
    </div>

    {authModal.open && (
      <AuthModal
        mode={authModal.mode}
        onClose={closeModal}
        onLogin={login}
        onRegister={register}
      />
    )}
    </>
  );
}
