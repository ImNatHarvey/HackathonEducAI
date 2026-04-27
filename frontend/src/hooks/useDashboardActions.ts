import { useEffect, useMemo, useState } from "react";
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

const fallbackChatResponses = [
  "Aura is having trouble reaching the AI engine right now, but your message was saved. Please try again in a moment.",
  "The AI workflow is temporarily busy. Your module and selected sources are safe, so you can retry shortly.",
  "Gemini may be under high demand right now. Your question was saved, and Aura can try again when the service responds.",
  "The n8n workflow did not return a stable response this time. Please retry in a few seconds.",
  "Aura could not complete the response because the AI service is currently unavailable. Your study context is still ready.",
  "The request timed out before Aura could finish. Try again shortly, especially if the AI model is under heavy demand.",
  "The AI engine returned a temporary error. Your selected sources are still loaded and ready for another attempt.",
  "Aura saved your message, but the generation service is not responding right now. Please try again later.",
  "The AI workflow is online, but the model seems overloaded. Give it a moment, then send your question again.",
  "Study Aura could not generate an answer this time. Your chat history is saved, so nothing was lost.",
];

const getRandomFallbackChatResponse = () => {
  const randomIndex = Math.floor(Math.random() * fallbackChatResponses.length);
  return fallbackChatResponses[randomIndex];
};

const getFriendlyChatError = (error: unknown) => {
  const rawMessage =
    error instanceof Error ? error.message : "Failed to send message.";

  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("503") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("overloaded")
  ) {
    return "The AI model is temporarily under high demand. Please try again shortly.";
  }

  if (
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("timed out")
  ) {
    return "The AI workflow timed out. Please try again.";
  }

  if (
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("failed to fetch")
  ) {
    return "Network connection failed. Please check n8n and try again.";
  }

  return rawMessage;
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

  const selectedSourcePayload = useMemo(() => {
    return selectedSources.map((source) => ({
      id: source.id,
      title: source.title,
      type: source.type,
      value: source.value,
      summary: source.summary,
    }));
  }, [selectedSources]);

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
      const fallbackContent = getRandomFallbackChatResponse();

      try {
        const savedFallbackMessage = await persistMessage({
          role: "assistant",
          content: fallbackContent,
        });

        setMessages((currentMessages) => [
          ...currentMessages,
          savedFallbackMessage,
        ]);
      } catch {
        const fallbackAssistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fallbackContent,
        };

        setMessages((currentMessages) => [
          ...currentMessages,
          fallbackAssistantMessage,
        ]);
      }

      setChatError(getFriendlyChatError(error));
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