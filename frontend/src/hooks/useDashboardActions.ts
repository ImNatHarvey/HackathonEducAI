import { useState } from "react";
import {
  sendChatToN8n,
  summarizeSourceWithN8n,
  uploadSourceToN8n,
} from "../lib/n8n";
import { currentUser } from "../components/user/userMock";
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
  activeModule?: StudyModule;
  selectedSources: StudySource[];
  onInputClear: () => void;
  onSourceAdded: (source: StudySource) => void;
  onSourcesAdded: (sources: StudySource[]) => void;
};

const createLocalSourceSummary = (
  sourceType: StudySource["type"],
  title: string,
  value: string,
) => {
  if (sourceType === "text") {
    const preview = value.length > 160 ? `${value.slice(0, 160)}...` : value;

    return `Text note added as study context. Preview: ${preview}`;
  }

  if (sourceType === "youtube") {
    return `YouTube source added for ${title}. n8n can later extract transcript details for a richer summary.`;
  }

  if (sourceType === "website") {
    return `Website source added for ${title}. n8n can later extract article content and key points.`;
  }

  if (sourceType === "pdf") {
    return `PDF source added for ${title}. n8n can later parse the document and summarize important sections.`;
  }

  return `Image source added for ${title}. n8n can later describe the image and extract visible text.`;
};

const trySummarizeSource = async ({
  moduleId,
  sourceId,
  sourceType,
  title,
  value,
}: {
  moduleId: string;
  sourceId: string;
  sourceType: StudySource["type"];
  title: string;
  value: string;
}) => {
  let summary = createLocalSourceSummary(sourceType, title, value);

  try {
    const summaryResponse = await summarizeSourceWithN8n({
      moduleId,
      userId: currentUser.id,
      source: {
        id: sourceId,
        title,
        type: sourceType,
        value,
      },
    });

    if (summaryResponse.success && summaryResponse.summary) {
      return summaryResponse.keyPoints?.length
        ? `${summaryResponse.summary}\n\nKey points: ${summaryResponse.keyPoints.join(
            ", ",
          )}`
        : summaryResponse.summary;
    }
  } catch {
    try {
      const uploadResponse = await uploadSourceToN8n({
        sourceType,
        value,
        title,
        moduleId,
        userId: currentUser.id,
      });

      if (uploadResponse.sourceSummary) {
        summary = uploadResponse.sourceSummary;
      }
    } catch {
      return summary;
    }
  }

  return summary;
};

export const useDashboardActions = ({
  inputValue,
  topic,
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

  const buildSourceFromPayload = async (
    payload: SourceUploadPayload,
  ): Promise<StudySource> => {
    if (!activeModule) {
      throw new Error("No active module selected.");
    }

    const sourceId = crypto.randomUUID();

    const summary = await trySummarizeSource({
      moduleId: activeModule.id,
      sourceId,
      sourceType: payload.sourceType,
      title: payload.title,
      value: payload.value,
    });

    return {
      id: sourceId,
      title: payload.title,
      type: payload.sourceType,
      value: payload.value,
      selected: true,
      summary,
      createdAt: new Date().toISOString(),
    };
  };

  const handleUploadSource = async (payload: SourceUploadPayload) => {
    if (isUploadingSource || !activeModule) return;

    setUploadError("");
    setIsUploadingSource(true);

    try {
      const source = await buildSourceFromPayload(payload);
      onSourceAdded(source);
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

  const handleUploadSources = async (payloads: SourceUploadPayload[]) => {
    if (isUploadingSource || !activeModule || payloads.length === 0) return;

    setUploadError("");
    setIsUploadingSource(true);

    try {
      const sources = await Promise.all(
        payloads.map((payload) => buildSourceFromPayload(payload)),
      );

      onSourcesAdded(sources);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to import selected sources.",
      );
    } finally {
      setIsUploadingSource(false);
    }
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();

    if (!message || isChatLoading || !activeModule) return;

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
        moduleId: activeModule.id,
        userId: currentUser.id,
        selectedSources: selectedSources.map((source) => ({
          id: source.id,
          title: source.title,
          type: source.type,
          value: source.value,
          summary: source.summary,
        })),
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
    handleUploadSources,
    handleSendMessage,
  };
};