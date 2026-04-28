import { useEffect, useMemo, useState } from "react";
import { chatWithN8n, readSourceWithN8n } from "../lib/n8n";
import {
  createChatMessage,
  fetchChatMessages,
} from "../services/chatMessageService";
import { uploadSourceFileToSupabase } from "../services/sourceStorageService";
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

type DuplicateCheckResult = {
  isDuplicate: boolean;
  reason?: string;
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

const genericFileTitlePatterns = [
  /^img[_-\s]?\d+/i,
  /^image[_-\s]?\d*/i,
  /^screenshot[_-\s]?\d*/i,
  /^screen shot[_-\s]?\d*/i,
  /^photo[_-\s]?\d*/i,
  /^document[_-\s]?\d*/i,
  /^scan[_-\s]?\d*/i,
  /^untitled/i,
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

const isUrlSource = (payload: SourceUploadPayload) => {
  return (
    payload.sourceType === "website" ||
    payload.sourceType === "youtube" ||
    payload.sourceType === "pdf" ||
    payload.sourceType === "image"
  );
};

const normalizeDuplicateValue = (value?: string) => {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
};

const normalizeTitle = (value?: string) => {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

const isGenericFileTitle = (title?: string) => {
  const normalizedTitle = normalizeTitle(title);

  if (!normalizedTitle) return true;

  return genericFileTitlePatterns.some((pattern) =>
    pattern.test(normalizedTitle),
  );
};

const cleanSourceText = (value?: string) => {
  return (value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}/g, "")
    .replace(/\n{4,}/g, "\n\n")
    .trim();
};

const getWordLimitedText = (value: string, maxWords: number) => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) return value.trim();

  return `${words.slice(0, maxWords).join(" ")}...`;
};

const cleanSummary = (value?: string) => {
  const cleanValue = cleanSourceText(value)
    .replace(/#+\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanValue) return undefined;

  return getWordLimitedText(cleanValue, 300);
};

const cleanGeneratedTitle = (value?: string) => {
  const cleanedValue = cleanSourceText(value)
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/[`"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedValue) return "";

  return cleanedValue.length > 70
    ? `${cleanedValue.slice(0, 70).trim()}...`
    : cleanedValue;
};

const titleFromUrl = (value?: string) => {
  if (!value) return "";

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const pathParts = url.pathname
      .split("/")
      .filter(Boolean)
      .map((part) =>
        decodeURIComponent(part)
          .replace(/\.[a-z0-9]+$/i, "")
          .replace(/[-_]+/g, " ")
          .trim(),
      )
      .filter(Boolean);

    const lastPath = pathParts[pathParts.length - 1];

    if (lastPath && lastPath.length > 4) {
      return cleanGeneratedTitle(lastPath);
    }

    return cleanGeneratedTitle(host);
  } catch {
    return "";
  }
};

const titleFromExtractedText = ({
  extractedText,
  summary,
  fallbackTitle,
  originalUrl,
}: {
  extractedText?: string;
  summary?: string;
  fallbackTitle?: string;
  originalUrl?: string;
}) => {
  const titleCandidate =
    summary ||
    extractedText
      ?.split("\n")
      .map((line) => line.trim())
      .find((line) => line.length >= 8 && line.length <= 90);

  const cleanedCandidate = cleanGeneratedTitle(titleCandidate);

  if (cleanedCandidate && !isGenericFileTitle(cleanedCandidate)) {
    return cleanedCandidate;
  }

  const urlTitle = titleFromUrl(originalUrl);

  if (urlTitle && !isGenericFileTitle(urlTitle)) {
    return urlTitle;
  }

  return cleanGeneratedTitle(fallbackTitle) || "Study source";
};

const getBestSourceTitle = ({
  payloadTitle,
  responseTitle,
  extractedText,
  summary,
  originalUrl,
  fileName,
}: {
  payloadTitle?: string;
  responseTitle?: string;
  extractedText?: string;
  summary?: string;
  originalUrl?: string;
  fileName?: string;
}) => {
  const cleanedResponseTitle = cleanGeneratedTitle(responseTitle);
  const cleanedPayloadTitle = cleanGeneratedTitle(payloadTitle);
  const cleanedFileTitle = cleanGeneratedTitle(
    fileName?.replace(/\.[^.]+$/, ""),
  );

  if (cleanedResponseTitle && !isGenericFileTitle(cleanedResponseTitle)) {
    return cleanedResponseTitle;
  }

  if (cleanedPayloadTitle && !isGenericFileTitle(cleanedPayloadTitle)) {
    return cleanedPayloadTitle;
  }

  const contextualTitle = titleFromExtractedText({
    extractedText,
    summary,
    fallbackTitle: cleanedFileTitle || cleanedPayloadTitle,
    originalUrl,
  });

  return (
    contextualTitle || cleanedFileTitle || cleanedPayloadTitle || "Study source"
  );
};

const getExistingSources = (activeModule?: StudyModule) => {
  return activeModule?.sources ?? [];
};

const checkDuplicateSource = (
  payload: SourceUploadPayload,
  existingSources: StudySource[],
): DuplicateCheckResult => {
  const payloadUrl = normalizeDuplicateValue(payload.originalUrl || payload.value);
  const payloadTitle = normalizeTitle(payload.title);
  const payloadFileName = normalizeDuplicateValue(payload.fileName);
  const payloadFileSize = payload.fileSize;

  const duplicate = existingSources.find((source) => {
    const sourceUrl = normalizeDuplicateValue(source.originalUrl || source.value);
    const sourceTitle = normalizeTitle(source.title);
    const sourceFileName = normalizeDuplicateValue(source.fileName);
    const sourceFileSize = source.fileSize;

    if (payload.fileName && source.fileName) {
      return (
        payloadFileName === sourceFileName &&
        Boolean(payloadFileSize) &&
        payloadFileSize === sourceFileSize
      );
    }

    if (payload.originalUrl || isUrlSource(payload)) {
      return Boolean(payloadUrl) && payloadUrl === sourceUrl;
    }

    return Boolean(payloadTitle) && payloadTitle === sourceTitle;
  });

  if (!duplicate) {
    return { isDuplicate: false };
  }

  if (payload.fileName && duplicate.fileName) {
    return {
      isDuplicate: true,
      reason: `"${payload.fileName}" is already in this module.`,
    };
  }

  if (payload.originalUrl || isUrlSource(payload)) {
    return {
      isDuplicate: true,
      reason: "This link/source was already added to this module.",
    };
  }

  return {
    isDuplicate: true,
    reason: `"${payload.title}" is already in this module.`,
  };
};

const buildSourceFromUpload = (
  payload: SourceUploadPayload,
  summary?: string,
): StudySource => {
  const now = new Date().toISOString();

  const valueIsUrl = /^https?:\/\//i.test(payload.value || "");
  const extractedText =
    cleanSourceText(payload.extractedText) ||
    (!valueIsUrl ? cleanSourceText(payload.value) : "");

  return {
    id: crypto.randomUUID(),
    title: payload.title,
    type: payload.sourceType,
    value: payload.value,
    summary: cleanSummary(summary ?? payload.summary ?? extractedText),
    extractedText,
    originalUrl: payload.originalUrl,
    status: payload.status ?? "ready",
    statusMessage: payload.statusMessage,
    parserProvider: payload.parserProvider,
    fileName: payload.fileName,
    fileType: payload.fileType,
    fileSize: payload.fileSize,
    selected: true,
    createdAt: now,
  };
};

const buildFailedSourceFromUpload = (
  payload: SourceUploadPayload,
  error: unknown,
): StudySource => {
  const message =
    error instanceof Error
      ? error.message
      : payload.statusMessage ||
        "Source reader failed. The source was saved, but extraction did not finish.";

  return buildSourceFromUpload({
    ...payload,
    originalUrl:
      payload.originalUrl ?? (isUrlSource(payload) ? payload.value : undefined),
    status: "failed",
    statusMessage: message,
    parserProvider: payload.parserProvider ?? "source-reader-error",
  });
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
      value: source.extractedText || source.summary || source.value,
      summary: source.summary,
      extractedText: source.extractedText,
      originalUrl: source.originalUrl,
      status: source.status,
      statusMessage: source.statusMessage,
      parserProvider: source.parserProvider,
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

  const readSourceWithReader = async (
    payload: SourceUploadPayload,
  ): Promise<StudySource> => {
    const sourceValue = payload.originalUrl || payload.value;

    console.log("[Study Aura] Calling Source Reader n8n workflow:", {
      sourceType: payload.sourceType,
      title: payload.title,
      value: sourceValue,
      originalUrl: payload.originalUrl,
      fileName: payload.fileName,
    });

    const response = await readSourceWithN8n({
      sourceType: payload.sourceType,
      title: payload.title,
      value: sourceValue,
      originalUrl: payload.originalUrl || sourceValue,
      moduleId: activeModule?.id,
      userId,
    });

    console.log("[Study Aura] Source Reader n8n response:", {
      title: response.title,
      sourceType: response.sourceType,
      summaryWords:
        response.summary?.trim().split(/\s+/).filter(Boolean).length ?? 0,
      extractedTextLength: response.extractedText?.length ?? 0,
      response,
    });

    const responseExtractedText = response.extractedText || "";

    const bestTitle = getBestSourceTitle({
      payloadTitle: payload.title,
      responseTitle: response.title,
      extractedText: responseExtractedText,
      summary: response.summary,
      originalUrl: response.originalUrl ?? payload.originalUrl,
      fileName: payload.fileName,
    });

    return buildSourceFromUpload({
      sourceType: response.sourceType,
      title: bestTitle,
      value: response.value || payload.value,
      summary: response.summary,
      extractedText: responseExtractedText,
      originalUrl: response.originalUrl ?? payload.originalUrl,
      status: response.status === "failed" ? "failed" : "ready",
      statusMessage:
        response.statusMessage ||
        "Source is ready and can be used as context.",
      parserProvider: response.parserProvider,
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileSize: payload.fileSize,
    });
  };

  const readUploadedFileBeforeSaving = async (
    payload: SourceUploadPayload,
  ): Promise<StudySource> => {
    if (!payload.file) {
      throw new Error("Missing uploaded file.");
    }

    console.log("[Study Aura] Uploading source file to Supabase:", {
      name: payload.file.name,
      type: payload.file.type,
      size: payload.file.size,
      sourceType: payload.sourceType,
    });

    const uploadedFile = await uploadSourceFileToSupabase({
      file: payload.file,
      userId,
      moduleId: activeModule?.id,
    });

    console.log("[Study Aura] Uploaded source file to Supabase:", uploadedFile);

    if (!uploadedFile.publicUrl) {
      throw new Error("Supabase did not return a public file URL.");
    }

    const uploadedFilePayload: SourceUploadPayload = {
      ...payload,
      file: undefined,
      value: uploadedFile.publicUrl,
      originalUrl: uploadedFile.publicUrl,
      status: "reading",
      statusMessage: "File uploaded. Reading content with n8n...",
      parserProvider: "supabase-storage",
    };

    return readSourceWithReader(uploadedFilePayload);
  };

  const readSourceBeforeSaving = async (
    payload: SourceUploadPayload,
  ): Promise<StudySource> => {
    try {
      if (payload.file) {
        return await readUploadedFileBeforeSaving(payload);
      }

      return await readSourceWithReader(payload);
    } catch (error) {
      console.error("[Study Aura] Source ingestion failed:", error);

      return buildFailedSourceFromUpload(payload, error);
    }
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

      const response = await chatWithN8n({
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
      const duplicateCheck = checkDuplicateSource(
        payload,
        getExistingSources(activeModule),
      );

      if (duplicateCheck.isDuplicate) {
        setUploadError(
          duplicateCheck.reason ||
            "This source already exists in the current module.",
        );
        return;
      }

      const sourceToSave = await readSourceBeforeSaving(payload);

      if (sourceToSave.status === "failed") {
        setUploadError(
          sourceToSave.statusMessage ||
            "The source was saved, but extraction failed.",
        );
      }

      await onSourceAdded(sourceToSave);
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
      const existingSources = getExistingSources(activeModule);
      const acceptedPayloads: SourceUploadPayload[] = [];
      const skippedReasons: string[] = [];

      for (const payload of payloads) {
        const duplicateCheck = checkDuplicateSource(payload, [
          ...existingSources,
          ...acceptedPayloads.map((acceptedPayload) =>
            buildSourceFromUpload({
              ...acceptedPayload,
              status: "pending",
            }),
          ),
        ]);

        if (duplicateCheck.isDuplicate) {
          skippedReasons.push(
            duplicateCheck.reason ||
              `"${payload.title}" was skipped because it already exists.`,
          );
          continue;
        }

        acceptedPayloads.push(payload);
      }

      if (acceptedPayloads.length === 0) {
        setUploadError(
          skippedReasons[0] ||
            "No sources were added because they already exist in this module.",
        );
        return;
      }

      const uploadedSources: StudySource[] = [];

      for (const payload of acceptedPayloads) {
        const sourceToSave = await readSourceBeforeSaving(payload);
        uploadedSources.push(sourceToSave);
      }

      const failedSources = uploadedSources.filter(
        (source) => source.status === "failed",
      );

      if (failedSources.length > 0 || skippedReasons.length > 0) {
        const statusMessages: string[] = [];

        if (failedSources.length > 0) {
          statusMessages.push(
            `${failedSources.length} source${
              failedSources.length === 1 ? "" : "s"
            } saved, but extraction failed.`,
          );
        }

        if (skippedReasons.length > 0) {
          statusMessages.push(`${skippedReasons.length} duplicate skipped.`);
        }

        setUploadError(statusMessages.join(" "));
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