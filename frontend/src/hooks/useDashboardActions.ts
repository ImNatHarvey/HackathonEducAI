import { useState } from "react";

type UseDashboardActionsParams = {
  inputValue: string;
};

export const useDashboardActions = ({
  inputValue,
}: UseDashboardActionsParams) => {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploadingSource, setIsUploadingSource] = useState(false);

  const handleMockUpload = () => {
    setUploadError("");
    setIsUploadingSource(true);

    window.setTimeout(() => {
      setIsUploadingSource(false);
      setUploadError(
        "Unsupported file type. Please upload PDF, image, text notes, or a YouTube link.",
      );
    }, 900);
  };

  const handleMockSend = () => {
    if (!inputValue.trim()) return;

    setChatError("");
    setIsChatLoading(true);

    window.setTimeout(() => {
      setIsChatLoading(false);
      setChatError(
        "Failed to reach n8n webhook. Make sure your workflow is active and running on localhost.",
      );
    }, 900);
  };

  return {
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleMockUpload,
    handleMockSend,
  };
};