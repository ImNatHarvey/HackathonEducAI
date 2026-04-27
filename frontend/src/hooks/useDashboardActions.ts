import { useEffect, useState } from "react";
import { sendChatToN8n, uploadSourceToN8n } from "../lib/n8n";
import {
  createChatMessage,
  fetchChatMessages,
} from "../services/chatMessageService";
import type {
  SourceUploadPayload,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type UseDashboardActionsParams = {
  inputValue: string;
  topic: string;
  userId?: string;
  activeModule?: StudyModule;
  selectedSources: StudySource[];
  onInputClear: () => void;
  onSourceAdded: (source: StudySource) => void | Promise<void>;
  onSourcesAdded: (sources: StudySource[]) => void | Promise<void>;
};

const buildSourceFromUpload = (
  payload: SourceUploadPayload,
  summary?: string,
): StudySource => {
  return {
    id: crypto.randomUUID(),
    title: payload.title,
    type: payload.sourceType,
    value: payload.value,
    summary,
    selected: true,
    createdAt: new Date().toISOString(),
  };
};

export const useDashboardActions = ({
  inputValue,
  topic,
  userId,
  activeModule,
  selectedSources,
  onInputClear,
  onSourceAdded,
  onSourcesAdded,
}: UseDashboardActionsParams) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploadingSource, setIsUploadingSource] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!userId || !activeModule?.id) {
        setMessages([]);
        return;
      }

      setChatError("");

      try {
        const savedMessages = await fetchChatMessages({
          userId,
          moduleId: activeModule.id,
        });

        if (!isMounted) return;

        setMessages(
          savedMessages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        );
      } catch (error) {
        if (!isMounted) return;

        setChatError(
          error instanceof Error
            ? error.message
            : "Failed to load chat history.",
        );
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [activeModule?.id, userId]);

  const selectedSourcePayload = selectedSources.map((source) => ({
    id: source.id,
    title: source.title,
    type: source.type,
    value: source.value,
    summary: source.summary,
  }));

  const persistMessage = async ({
    role,
    content,
  }: {
    role: "user" | "assistant";
    content: string;
  }): Promise<ChatMessage> => {
    if (!userId || !activeModule?.id) {
      return {
        id: crypto.randomUUID(),
        role,
        content,
      };
    }

    const savedMessage = await createChatMessage({
      userId,
      moduleId: activeModule.id,
      role,
      content,
    });

    return {
      id: savedMessage.id,
      role: savedMessage.role,
      content: savedMessage.content,
    };
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();

    if (!trimmedMessage || isChatLoading) return;

    setIsChatLoading(true);
    setChatError("");

    const optimisticUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      optimisticUserMessage,
    ]);

    onInputClear();

    try {
      const savedUserMessage = await persistMessage({
        role: "user",
        content: trimmedMessage,
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === optimisticUserMessage.id ? savedUserMessage : message,
        ),
      );

      const response = await sendChatToN8n({
        message: trimmedMessage,
        topic,
        moduleId: activeModule?.id,
        userId,
        selectedSources: selectedSourcePayload,
      });

      const assistantContent =
        response.answer ||
        "Study Aura can still help you study this topic. Try asking for a summary, key terms, or a quick review.";

      const savedAssistantMessage = await persistMessage({
        role: "assistant",
        content: assistantContent,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        savedAssistantMessage,
      ]);
    } catch (error) {
      const fallbackAssistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Study Aura had trouble saving or generating that response. Please try again.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        fallbackAssistantMessage,
      ]);

      setChatError(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleUploadSource = async (payload: SourceUploadPayload) => {
    setIsUploadingSource(true);
    setUploadError("");

    try {
      const response = await uploadSourceToN8n({
        ...payload,
        moduleId: activeModule?.id,
        userId,
      });

      const uploadedSource = buildSourceFromUpload(
        payload,
        response.sourceSummary,
      );

      await onSourceAdded(uploadedSource);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload source.",
      );
    } finally {
      setIsUploadingSource(false);
    }
  };

  const handleUploadSources = async (payloads: SourceUploadPayload[]) => {
    setIsUploadingSource(true);
    setUploadError("");

    try {
      const uploadedSources: StudySource[] = [];

      for (const payload of payloads) {
        const response = await uploadSourceToN8n({
          ...payload,
          moduleId: activeModule?.id,
          userId,
        });

        uploadedSources.push(
          buildSourceFromUpload(payload, response.sourceSummary),
        );
      }

      await onSourcesAdded(uploadedSources);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload sources.",
      );
    } finally {
      setIsUploadingSource(false);
    }
  };

  return {
    messages,
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleUploadSource,
    handleUploadSources,
    handleSendMessage,
  };
};