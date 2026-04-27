import { useState, useEffect, useRef } from "react";
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
  const { user, authModal, openLogin, closeModal, login, register, updateProfile, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    fetchChatMessages,
    cacheMessages,
    startNewConversation,
    deleteConversation,
    updateConversationTitle,
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
  } = useUpload({ activeConversationId, updateConversationDocument: () => {} });

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
  } = useChat({
    uploadedName,
    chatId: activeConversationId,
    onTitleUpdate: updateConversationTitle,
  });

  const prevAskingRef = useRef(false);

  const activeChatTitle = conversations.find((c) => c.id === activeConversationId)?.title || "";

  // Load messages whenever the active chat changes.
  // Cancelled flag prevents a slow fetch from overwriting newer state.
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    fetchChatMessages(activeConversationId).then((msgs) => {
      if (!cancelled) setMessages(msgs);
    });
    return () => { cancelled = true; };
  }, [activeConversationId]);

  // After streaming ends, save messages to the local cache so switching
  // back to this chat doesn't wipe them (even if the backend hasn't saved yet).
  useEffect(() => {
    if (prevAskingRef.current && !asking && activeConversationId && messages.length > 0) {
      cacheMessages(activeConversationId, messages);
    }
    prevAskingRef.current = asking;
  }, [asking]);

  function handleNewConversation() {
    setUploadedName("");
    setQuestion("");
    setMobileSidebarOpen(false);
    startNewConversation();
  }

  function handleLoadConversation(id) {
    if (id === activeConversationId) return;
    setUploadedName("");
    setMobileSidebarOpen(false);
    setActiveConversationId(id);
  }

  function handleDeleteConversation(id, e) {
    setUploadedName("");
    deleteConversation(id, e);
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 font-sans">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          user={user}
          onLogin={openLogin}
          onLogout={logout}
          onUpdateProfile={updateProfile}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
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
          onLoadConversation={handleLoadConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <ChatHeader
            user={user}
            onLogin={openLogin}
            onLogout={logout}
            uploadedName={uploadedName}
            chatTitle={activeChatTitle}
            onRenameChat={(title) => updateConversationTitle(activeConversationId, title)}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
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
              <ChunkPanel
                source={selectedSource}
                onClose={() => setSelectedSource(null)}
              />
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
