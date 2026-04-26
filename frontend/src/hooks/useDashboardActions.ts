import { useState } from "react";
import { sendChatToN8n, uploadSourceToN8n } from "../lib/n8n";
import { currentUser } from "../components/user/userMock";
import type {
  GeneratedLesson,
  SourceUploadPayload,
} from "../components/dashboard/dashboardTypes";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type UseDashboardActionsParams = {
  inputValue: string;
  topic: string;
  onInputClear: () => void;
  onLessonCreated: (lesson: GeneratedLesson) => void;
};

export const useDashboardActions = ({
  inputValue,
  topic,
  onInputClear,
  onLessonCreated,
}: UseDashboardActionsParams) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploadingSource, setIsUploadingSource] = useState(false);

  const handleUploadSource = async ({
    sourceType,
    value,
    title,
  }: SourceUploadPayload) => {
    if (isUploadingSource) return;

    setUploadError("");
    setIsUploadingSource(true);

    try {
      const response = await uploadSourceToN8n({
        sourceType,
        value,
        title,
        userId: currentUser.id,
      });

      if (!response.success) {
        throw new Error(response.message || "Source upload failed.");
      }

      onLessonCreated(
        response.lesson ?? {
          title,
          subtitle: `Source added from ${sourceType}. Ready for AI study tools.`,
          progress: 5,
        },
      );
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload source to n8n.",
      );
    } finally {
      setIsUploadingSource(false);
    }
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