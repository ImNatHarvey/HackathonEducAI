import { useState } from "react";
import { sendChatToN8n } from "../lib/n8n";
import { currentUser } from "../components/user/userMock";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type UseDashboardActionsParams = {
  inputValue: string;
  topic: string;
  onInputClear: () => void;
};

export const useDashboardActions = ({
  inputValue,
  topic,
  onInputClear,
}: UseDashboardActionsParams) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploadingSource, setIsUploadingSource] = useState(false);

  const handleUploadSource = () => {
    setUploadError("");
    setIsUploadingSource(true);

    window.setTimeout(() => {
      setIsUploadingSource(false);
      setUploadError(
        "Unsupported file type. Please upload PDF, image, text notes, or a YouTube link.",
      );
    }, 900);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();

    if (!message || isChatLoading) return;

    setChatError("");
    setIsChatLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    onInputClear();

    try {
      const response = await sendChatToN8n({
        message,
        topic,
        userId: currentUser.id,
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reach n8n webhook.";

      setChatError(errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    messages,
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleUploadSource,
    handleSendMessage,
  };
};