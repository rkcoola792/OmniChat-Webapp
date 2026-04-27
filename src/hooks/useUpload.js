import { useState, useRef } from "react";
import axios from "axios";
import { API } from "../constants";

export function useUpload({ activeConversationId, updateConversationDocument }) {
  const [file, setFile] = useState(null);
  const [uploadedName, setUploadedName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileChange(selected) {
    setUploadError("");
    if (!selected) return;
    if (!selected.name.match(/\.(pdf|txt|csv|doc|docx)$/i)) {
      setUploadError("Unsupported file type. Please upload PDF, TXT, CSV, or DOC.");
      return;
    }
    setFile(selected);
    setUploadedName("");
  }

  async function uploadFile() {
    if (!file) {
      setUploadError("Please select a file first.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API}/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedName(file.name);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (activeConversationId) {
        updateConversationDocument(activeConversationId, file.name);
      }
    } catch (err) {
      setUploadError(err?.response?.data?.error || "Upload failed. Is the server running?");
    } finally {
      setUploading(false);
    }
  }

  return {
    file,
    uploadedName,
    uploading,
    uploadError,
    fileInputRef,
    setUploadedName,
    handleFileChange,
    uploadFile,
  };
}
