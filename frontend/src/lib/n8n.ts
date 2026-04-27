export type N8nSelectedSource = {
  id: string;
  title: string;
  type: "text" | "youtube" | "website" | "pdf" | "image";
  value: string;
  summary?: string;
};

export type N8nChatPayload = {
  message: string;
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  userId?: string;
};

export type N8nUploadPayload = {
  sourceType: "text" | "youtube" | "website" | "pdf" | "image";
  value: string;
  title: string;
  moduleId?: string;
  userId?: string;
};

export type N8nSummarizeSourcePayload = {
  moduleId?: string;
  source: N8nSelectedSource;
  userId?: string;
};

export type N8nWebSearchPayload = {
  query: string;
  moduleId?: string;
  maxResults: number;
  userId?: string;
};

export type N8nBaseResponse = {
  provider?: string;
  fallback?: boolean;
};

export type N8nChatResponse = N8nBaseResponse & {
  answer: string;
  sources?: string[];
};

export type N8nUploadResponse = N8nBaseResponse & {
  success: boolean;
  sourceSummary?: string;
  lessonId?: string;
  message?: string;
  lesson?: {
    title: string;
    subtitle: string;
    progress: number;
  };
};

export type N8nSummarizeSourceResponse = N8nBaseResponse & {
  success: boolean;
  summary: string;
  keyPoints?: string[];
  message?: string;
};

export type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export type N8nWebSearchResponse = N8nBaseResponse & {
  success: boolean;
  results: WebSearchResult[];
  message?: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type N8nQuizPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  difficulty: QuizDifficulty;
  questionCount: number;
  userId?: string;
};

export type QuizQuestion = {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type N8nQuizResponse = N8nBaseResponse & {
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
};

export type FlashcardDifficulty = "easy" | "medium" | "hard";

export type FlashcardType = "question" | "fill_blank";

export type N8nFlashcardsPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  difficulty: FlashcardDifficulty;
  cardCount: number;
  userId?: string;
};

export type FlashcardItem = {
  type: FlashcardType;
  prompt: string;
  answer: string;
  hint: string;
  explanation: string;
};

export type N8nFlashcardsResponse = N8nBaseResponse & {
  deck: {
    title: string;
    cards: FlashcardItem[];
  };
};

export type TableDifficulty = "easy" | "medium" | "hard";

export type StudyTableType =
  | "concept_comparison"
  | "term_definition"
  | "process_steps"
  | "cause_effect";

export type N8nTablesPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  difficulty: TableDifficulty;
  tableType: StudyTableType;
  rowCount: number;
  userId?: string;
};

export type StudyTableColumn = {
  key: string;
  label: string;
};

export type StudyTableRow = Record<string, string>;

export type N8nTablesResponse = N8nBaseResponse & {
  table: {
    title: string;
    description: string;
    columns: StudyTableColumn[];
    rows: StudyTableRow[];
  };
};

export type MindMapDifficulty = "easy" | "medium" | "hard";

export type MindMapBranch = {
  title: string;
  summary: string;
  keywords: string[];
};

export type N8nMindMapPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  difficulty: MindMapDifficulty;
  branchCount: number;
  userId?: string;
};

export type N8nMindMapResponse = N8nBaseResponse & {
  mindMap: {
    title: string;
    center: string;
    description: string;
    branches: MindMapBranch[];
  };
};

export type SlidesDifficulty = "easy" | "medium" | "hard";

export type StudySlide = {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  speakerNotes: string;
  visualIdea: string;
};

export type N8nSlidesPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  difficulty: SlidesDifficulty;
  slideCount: number;
  userId?: string;
};

export type N8nSlidesResponse = N8nBaseResponse & {
  deck: {
    title: string;
    description: string;
    slides: StudySlide[];
  };
};

export type AudioOverviewStyle = "calm" | "energetic" | "podcast";

export type AudioOverviewLength = "short" | "standard" | "deep";

export type AudioSegment = {
  speaker: string;
  text: string;
};

export type N8nAudioPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  style: AudioOverviewStyle;
  length: AudioOverviewLength;
  userId?: string;
};

export type N8nAudioResponse = N8nBaseResponse & {
  audioOverview: {
    title: string;
    description: string;
    estimatedDuration: string;
    segments: AudioSegment[];
    recap: string[];
  };
};

type N8nWebhookName =
  | "Chat"
  | "Source Upload"
  | "Source Summary"
  | "Web Search"
  | "Quiz"
  | "Flashcards"
  | "Tables"
  | "Mind Map"
  | "Slides"
  | "Audio Overview";

const DEFAULT_WEBHOOK_TIMEOUT_MS = 90_000;

const getRequiredEnv = (key: string) => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const getPayloadPreview = (payload: unknown) => {
  try {
    const serialized = JSON.stringify(payload);

    if (serialized.length <= 800) return serialized;

    return `${serialized.slice(0, 800)}...`;
  } catch {
    return "Unable to serialize payload preview.";
  }
};

const parseResponseBody = async (response: Response) => {
  const rawText = await response.text();

  if (!rawText.trim()) {
    return {
      rawText: "",
      parsedJson: null as unknown,
    };
  }

  try {
    return {
      rawText,
      parsedJson: JSON.parse(rawText) as unknown,
    };
  } catch {
    return {
      rawText,
      parsedJson: null as unknown,
    };
  }
};

const getN8nErrorMessage = ({
  webhookName,
  status,
  statusText,
  rawText,
}: {
  webhookName: N8nWebhookName;
  status: number;
  statusText: string;
  rawText: string;
}) => {
  const normalizedBody = rawText.toLowerCase();

  if (status === 404) {
    return `${webhookName} webhook was not found. Check that the workflow is active and the webhook URL in .env is correct.`;
  }

  if (status === 405) {
    return `${webhookName} webhook rejected the request method. Make sure the n8n Webhook node accepts POST requests.`;
  }

  if (status === 500) {
    return `${webhookName} workflow failed inside n8n. Check the latest n8n execution log for the failing node.`;
  }

  if (status === 502 || status === 503 || status === 504) {
    if (
      normalizedBody.includes("high demand") ||
      normalizedBody.includes("service unavailable") ||
      normalizedBody.includes("overloaded")
    ) {
      return `${webhookName} workflow reached the AI model, but the model is temporarily under high demand. Retry shortly or enable retries/fallback model in n8n.`;
    }

    return `${webhookName} workflow is temporarily unavailable. Check n8n, Gemini, and retry settings.`;
  }

  if (status === 429) {
    return `${webhookName} workflow hit a rate limit. Wait a moment, reduce requests, or add retry/backoff in n8n.`;
  }

  return `${webhookName} request failed with status ${status}${
    statusText ? ` (${statusText})` : ""
  }.`;
};

const postToWebhook = async <TResponse>({
  webhookName,
  url,
  payload,
  timeoutMs = DEFAULT_WEBHOOK_TIMEOUT_MS,
}: {
  webhookName: N8nWebhookName;
  url: string;
  payload: unknown;
  timeoutMs?: number;
}): Promise<TResponse> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const { rawText, parsedJson } = await parseResponseBody(response);

    if (!response.ok) {
      const friendlyMessage = getN8nErrorMessage({
        webhookName,
        status: response.status,
        statusText: response.statusText,
        rawText,
      });

      const details = rawText ? ` Details: ${rawText.slice(0, 600)}` : "";
      const payloadPreview = getPayloadPreview(payload);

      throw new Error(
        `${friendlyMessage}${details} Payload preview: ${payloadPreview}`,
      );
    }

    if (!rawText.trim()) {
      throw new Error(
        `${webhookName} workflow returned an empty response. Make sure the workflow ends with a Respond to Webhook node returning JSON.`,
      );
    }

    if (!parsedJson) {
      throw new Error(
        `${webhookName} workflow returned non-JSON output. Make sure the Respond to Webhook node returns valid JSON.`,
      );
    }

    return parsedJson as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `${webhookName} workflow timed out after ${Math.round(
          timeoutMs / 1000,
        )} seconds. Enable retries or simplify the workflow response.`,
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const sendChatToN8n = async (
  payload: N8nChatPayload,
): Promise<N8nChatResponse> => {
  const url = getRequiredEnv("VITE_N8N_CHAT_WEBHOOK_URL");

  return postToWebhook<N8nChatResponse>({
    webhookName: "Chat",
    url,
    payload,
  });
};

export const uploadSourceToN8n = async (
  payload: N8nUploadPayload,
): Promise<N8nUploadResponse> => {
  const url = getRequiredEnv("VITE_N8N_UPLOAD_WEBHOOK_URL");

  return postToWebhook<N8nUploadResponse>({
    webhookName: "Source Upload",
    url,
    payload,
  });
};

export const summarizeSourceWithN8n = async (
  payload: N8nSummarizeSourcePayload,
): Promise<N8nSummarizeSourceResponse> => {
  const url = getRequiredEnv("VITE_N8N_SOURCE_SUMMARY_WEBHOOK_URL");

  return postToWebhook<N8nSummarizeSourceResponse>({
    webhookName: "Source Summary",
    url,
    payload,
  });
};

export const searchWebSourcesWithN8n = async (
  payload: N8nWebSearchPayload,
): Promise<N8nWebSearchResponse> => {
  const url = getRequiredEnv("VITE_N8N_WEB_SEARCH_WEBHOOK_URL");

  return postToWebhook<N8nWebSearchResponse>({
    webhookName: "Web Search",
    url,
    payload,
  });
};

export const generateQuizWithN8n = async (
  payload: N8nQuizPayload,
): Promise<N8nQuizResponse> => {
  const url = getRequiredEnv("VITE_N8N_QUIZ_WEBHOOK_URL");

  return postToWebhook<N8nQuizResponse>({
    webhookName: "Quiz",
    url,
    payload,
  });
};

export const generateFlashcardsWithN8n = async (
  payload: N8nFlashcardsPayload,
): Promise<N8nFlashcardsResponse> => {
  const url = getRequiredEnv("VITE_N8N_FLASHCARDS_WEBHOOK_URL");

  return postToWebhook<N8nFlashcardsResponse>({
    webhookName: "Flashcards",
    url,
    payload,
  });
};

export const generateTablesWithN8n = async (
  payload: N8nTablesPayload,
): Promise<N8nTablesResponse> => {
  const url = getRequiredEnv("VITE_N8N_TABLES_WEBHOOK_URL");

  return postToWebhook<N8nTablesResponse>({
    webhookName: "Tables",
    url,
    payload,
  });
};

export const generateMindMapWithN8n = async (
  payload: N8nMindMapPayload,
): Promise<N8nMindMapResponse> => {
  const url = getRequiredEnv("VITE_N8N_MINDMAP_WEBHOOK_URL");

  return postToWebhook<N8nMindMapResponse>({
    webhookName: "Mind Map",
    url,
    payload,
  });
};

export const generateSlidesWithN8n = async (
  payload: N8nSlidesPayload,
): Promise<N8nSlidesResponse> => {
  const url = getRequiredEnv("VITE_N8N_SLIDES_WEBHOOK_URL");

  return postToWebhook<N8nSlidesResponse>({
    webhookName: "Slides",
    url,
    payload,
  });
};

export const generateAudioOverviewWithN8n = async (
  payload: N8nAudioPayload,
): Promise<N8nAudioResponse> => {
  const url = getRequiredEnv("VITE_N8N_AUDIO_WEBHOOK_URL");

  return postToWebhook<N8nAudioResponse>({
    webhookName: "Audio Overview",
    url,
    payload,
  });
};