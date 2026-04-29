export type N8nSelectedSource = {
  id: string;
  title: string;
  type: "text" | "youtube" | "website" | "pdf" | "image" | string;
  value: string;
  summary?: string;
  extractedText?: string;
  originalUrl?: string;
  status?: "ready" | "reading" | "failed" | "pending";
  statusMessage?: string;
  parserProvider?: string;
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

export type N8nSourceReaderPayload = {
  sourceType: "text" | "youtube" | "website" | "pdf" | "image";
  title: string;
  value: string;
  originalUrl?: string;
  moduleId?: string;
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

export type N8nSourceReaderResponse = N8nBaseResponse & {
  sourceType: "text" | "youtube" | "website" | "pdf" | "image";
  title: string;
  value: string;
  originalUrl?: string;
  extractedText?: string;
  summary?: string;
  status: "ready" | "reading" | "failed" | "pending";
  statusMessage?: string;
  parserProvider?: string;
};

export type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
  sourceType?: "website";
};

export type N8nWebSearchResponse = N8nBaseResponse & {
  success: boolean;
  query?: string;
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

export type StudyTableRow = Record<string, unknown>;

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
  visualQuery?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageProvider?: "unsplash" | "pexels" | "pixabay" | "fallback";
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

export type AudioOverviewLength = "short" | "standard" | "deep";

export type AudioSegment = {
  speaker: string;
  text: string;
};

export type N8nAudioPayload = {
  topic: string;
  moduleId?: string;
  selectedSources?: N8nSelectedSource[];
  length: AudioOverviewLength;
  userId?: string;
};

export type N8nPremiumAudio = {
  provider?: string;
  voice?: string;
  mimeType?: string;
  base64?: string;
};

export type N8nAudioResponse = N8nBaseResponse & {
  scriptProvider?: string;
  voiceFallback?: string;
  audioOverview: {
    title: string;
    description: string;
    estimatedDuration: string;
    segments: AudioSegment[];
    recap: string[];
    script: string;
    audioUrl?: string;
    provider?: string;
    premiumAudio?: N8nPremiumAudio;
    audio?: N8nPremiumAudio;
  };
};

type N8nWebhookName =
  | "Chat"
  | "Source Upload"
  | "Source Summary"
  | "Source Reader"
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

const buildErrorMessage = ({
  webhookName,
  response,
  rawText,
}: {
  webhookName: N8nWebhookName;
  response: Response;
  rawText: string;
}) => {
  const fallbackMessage = `${webhookName} workflow failed with status ${response.status}.`;

  if (!rawText.trim()) return fallbackMessage;

  try {
    const parsed = JSON.parse(rawText) as {
      message?: string;
      error?: string;
      errorMessage?: string;
    };

    return (
      parsed.errorMessage ||
      parsed.message ||
      parsed.error ||
      rawText ||
      fallbackMessage
    );
  } catch {
    return rawText || fallbackMessage;
  }
};

const postToWebhook = async <TResponse, TPayload extends object>({
  webhookName,
  envKey,
  payload,
  timeoutMs = DEFAULT_WEBHOOK_TIMEOUT_MS,
}: {
  webhookName: N8nWebhookName;
  envKey: string;
  payload: TPayload;
  timeoutMs?: number;
}): Promise<TResponse> => {
  const webhookUrl = getRequiredEnv(envKey);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const { rawText, parsedJson } = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(
        buildErrorMessage({
          webhookName,
          response,
          rawText,
        }),
      );
    }

    if (!parsedJson) {
      throw new Error(`${webhookName} workflow returned an empty response.`);
    }

    return parsedJson as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `${webhookName} workflow timed out. Check if the n8n workflow is active and reachable.`,
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        `${webhookName} workflow could not be reached. Check your webhook URL, n8n status, and CORS settings.`,
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`${webhookName} workflow failed.`);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const unwrapN8nResponse = (response: unknown): unknown => {
  if (Array.isArray(response)) {
    return unwrapN8nResponse(response[0]);
  }

  if (!isRecord(response)) {
    return response;
  }

  if (isRecord(response.json)) return unwrapN8nResponse(response.json);
  if (isRecord(response.body)) return unwrapN8nResponse(response.body);
  if (isRecord(response.data)) return unwrapN8nResponse(response.data);

  return response;
};

const pickFirstString = (
  object: Record<string, unknown>,
  keys: string[],
): string => {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
};

const cleanAudioLabel = (value: string) => {
  return value
    .replace(/^\s*(Narrator|Host A|Host B|Audio|Speaker)\s*:\s*/i, "")
    .trim();
};

const normalizePremiumAudio = (
  rawAudio: unknown,
): N8nPremiumAudio | undefined => {
  if (!isRecord(rawAudio)) return undefined;

  const base64 = pickFirstString(rawAudio, ["base64", "data", "audioBase64"]);
  const audioUrl = pickFirstString(rawAudio, ["url", "audioUrl"]);

  if (!base64 && !audioUrl) return undefined;

  return {
    provider:
      pickFirstString(rawAudio, ["provider", "service"]) || "elevenlabs",
    voice:
      pickFirstString(rawAudio, ["voice", "voiceName", "voice_name"]) ||
      "Premium Narrator",
    mimeType:
      pickFirstString(rawAudio, ["mimeType", "mime_type", "contentType"]) ||
      "audio/mpeg",
    base64: base64 || undefined,
  };
};

const normalizeSourceType = (
  value: unknown,
): N8nSourceReaderResponse["sourceType"] => {
  const normalized = String(value || "").toLowerCase();

  if (
    normalized === "text" ||
    normalized === "youtube" ||
    normalized === "website" ||
    normalized === "pdf" ||
    normalized === "image"
  ) {
    return normalized;
  }

  return "text";
};

const normalizeSourceStatus = (
  value: unknown,
  hasContent: boolean,
): N8nSourceReaderResponse["status"] => {
  const normalized = String(value || "").toLowerCase();

  if (
    normalized === "ready" ||
    normalized === "reading" ||
    normalized === "failed" ||
    normalized === "pending"
  ) {
    return normalized;
  }

  return hasContent ? "ready" : "failed";
};
const normalizeSourceReaderResponse = (
  response: unknown,
): N8nSourceReaderResponse => {
  const unwrapped = unwrapN8nResponse(response);

  if (!isRecord(unwrapped)) {
    throw new Error("Source Reader workflow returned an invalid response.");
  }

  const extractedText = pickFirstString(unwrapped, [
    "extractedText",
    "extracted_text",
    "fullExtractedText",
    "full_extracted_text",
    "rawText",
    "raw_text",
    "text",
    "content",
    "markdown",
    "transcript",
    "ocrText",
    "ocr_text",
    "documentText",
    "document_text",
  ]);

  const summary = pickFirstString(unwrapped, [
    "summary",
    "sourceSummary",
    "source_summary",
    "description",
    "snippet",
  ]);

  const value = pickFirstString(unwrapped, [
    "value",
    "url",
    "originalUrl",
    "original_url",
  ]);

  const originalUrl =
    pickFirstString(unwrapped, ["originalUrl", "original_url", "url"]) || value;

  const normalizedResponse: N8nSourceReaderResponse = {
    provider: pickFirstString(unwrapped, ["provider"]) || undefined,
    fallback:
      typeof unwrapped.fallback === "boolean" ? unwrapped.fallback : undefined,
    sourceType: normalizeSourceType(
      unwrapped.sourceType || unwrapped.source_type || unwrapped.type,
    ),
    title:
      pickFirstString(unwrapped, ["title", "name", "sourceTitle"]) ||
      "Study Source",
    value,
    originalUrl: originalUrl || undefined,
    extractedText: extractedText || undefined,
    summary: summary || undefined,
    status: normalizeSourceStatus(unwrapped.status, Boolean(extractedText || summary)),
    statusMessage:
      pickFirstString(unwrapped, ["statusMessage", "status_message", "message"]) ||
      undefined,
    parserProvider:
      pickFirstString(unwrapped, [
        "parserProvider",
        "parser_provider",
        "metadataProvider",
        "provider",
      ]) || undefined,
  };

  console.log("[Study Aura] Source Reader normalized response:", {
    sourceType: normalizedResponse.sourceType,
    title: normalizedResponse.title,
    status: normalizedResponse.status,
    summaryWords:
      normalizedResponse.summary?.trim().split(/\s+/).filter(Boolean).length ?? 0,
    extractedTextLength: normalizedResponse.extractedText?.length ?? 0,
    response: normalizedResponse,
  });

  return normalizedResponse;
};

const normalizeWebSearchResults = (response: unknown): N8nWebSearchResponse => {
  const unwrapped = unwrapN8nResponse(response);

  if (!isRecord(unwrapped)) {
    throw new Error("Web Search workflow returned an invalid response.");
  }

  const rawResults = Array.isArray(unwrapped.results)
    ? unwrapped.results
    : Array.isArray(unwrapped.items)
      ? unwrapped.items
      : Array.isArray(unwrapped.data)
        ? unwrapped.data
        : [];

  const results: WebSearchResult[] = rawResults
    .filter(isRecord)
    .map((item): WebSearchResult => ({
      title:
        pickFirstString(item, ["title", "name"]) ||
        pickFirstString(item, ["url", "link"]) ||
        "Untitled result",
      url: pickFirstString(item, ["url", "link", "href"]),
      snippet: pickFirstString(item, ["snippet", "description", "summary", "text"]),
      sourceType: "website" as const,
    }))
    .filter((item) => item.url);

  return {
    provider: pickFirstString(unwrapped, ["provider"]) || undefined,
    fallback:
      typeof unwrapped.fallback === "boolean" ? unwrapped.fallback : undefined,
    success:
      typeof unwrapped.success === "boolean" ? unwrapped.success : results.length > 0,
    query:
      pickFirstString(unwrapped, ["query", "searchQuery", "search_query"]) ||
      undefined,
    results,
    message: pickFirstString(unwrapped, ["message", "statusMessage"]) || undefined,
  };
};

const validateQuizResponse = (response: N8nQuizResponse) => {
  if (!response.quiz || !Array.isArray(response.quiz.questions)) {
    throw new Error("Quiz workflow returned an invalid quiz response.");
  }

  return response;
};

const validateFlashcardsResponse = (response: N8nFlashcardsResponse) => {
  if (!response.deck || !Array.isArray(response.deck.cards)) {
    throw new Error("Flashcards workflow returned an invalid deck response.");
  }

  return response;
};

const validateTablesResponse = (response: N8nTablesResponse) => {
  if (!response.table || !Array.isArray(response.table.rows)) {
    throw new Error("Tables workflow returned an invalid table response.");
  }

  return response;
};

const validateMindMapResponse = (response: N8nMindMapResponse) => {
  if (!response.mindMap || !Array.isArray(response.mindMap.branches)) {
    throw new Error("Mind Map workflow returned an invalid mind map response.");
  }

  return response;
};

const validateSlidesResponse = (response: N8nSlidesResponse) => {
  if (!response.deck || !Array.isArray(response.deck.slides)) {
    throw new Error("Slides workflow returned an invalid slide deck response.");
  }

  return response;
};

const normalizeAudioResponse = (response: unknown): N8nAudioResponse => {
  const unwrapped = unwrapN8nResponse(response);

  if (!isRecord(unwrapped)) {
    throw new Error("Audio Overview workflow returned an invalid response.");
  }

  const rawOverview = isRecord(unwrapped.audioOverview)
    ? unwrapped.audioOverview
    : isRecord(unwrapped.audio_overview)
      ? unwrapped.audio_overview
      : unwrapped;

  const rawSegments = Array.isArray(rawOverview.segments)
    ? rawOverview.segments
    : [];

  const segments: AudioSegment[] = rawSegments
    .filter(isRecord)
    .map((segment) => ({
      speaker: "Audio",
      text: cleanAudioLabel(
        pickFirstString(segment, ["text", "content", "script", "line"]) ||
        "Review this section carefully.",
      ),
    }))
    .filter((segment) => segment.text.trim());

  const fallbackScript = cleanAudioLabel(
    pickFirstString(rawOverview, [
      "script",
      "fullScript",
      "full_script",
      "narration",
      "text",
    ]),
  );

  const normalizedSegments =
    segments.length > 0
      ? segments
      : fallbackScript
        ? [{ speaker: "Audio", text: fallbackScript }]
        : [
          {
            speaker: "Audio",
            text: "Welcome to this Study Aura audio overview. Review the selected source, focus on the main idea, and practice recalling the key details.",
          },
        ];

  const rawRecap = Array.isArray(rawOverview.recap)
    ? rawOverview.recap
    : Array.isArray(rawOverview.keyTakeaways)
      ? rawOverview.keyTakeaways
      : Array.isArray(rawOverview.key_takeaways)
        ? rawOverview.key_takeaways
        : [];

  const recap = rawRecap
    .map((item) => cleanAudioLabel(String(item)))
    .filter(Boolean)
    .slice(0, 5);

  const script =
    fallbackScript ||
    normalizedSegments.map((segment) => segment.text).join("\n\n");

  const premiumAudio =
    normalizePremiumAudio(rawOverview.premiumAudio) ||
    normalizePremiumAudio(rawOverview.premium_audio) ||
    normalizePremiumAudio(unwrapped.premiumAudio) ||
    normalizePremiumAudio(unwrapped.premium_audio);

  const audio =
    normalizePremiumAudio(rawOverview.audio) ||
    normalizePremiumAudio(rawOverview.audioData) ||
    normalizePremiumAudio(rawOverview.audio_data) ||
    normalizePremiumAudio(unwrapped.audio) ||
    normalizePremiumAudio(unwrapped.audioData) ||
    normalizePremiumAudio(unwrapped.audio_data);

  return {
    provider: pickFirstString(unwrapped, ["provider"]) || undefined,
    scriptProvider:
      pickFirstString(unwrapped, ["scriptProvider", "script_provider"]) ||
      undefined,
    voiceFallback:
      pickFirstString(unwrapped, ["voiceFallback", "voice_fallback"]) ||
      undefined,
    fallback:
      typeof unwrapped.fallback === "boolean" ? unwrapped.fallback : undefined,
    audioOverview: {
      title:
        pickFirstString(rawOverview, ["title", "name"]) ||
        "Study Aura Audio Overview",
      description:
        pickFirstString(rawOverview, ["description", "summary", "subtitle"]) ||
        "Generated audio overview.",
      estimatedDuration:
        pickFirstString(rawOverview, [
          "estimatedDuration",
          "estimated_duration",
          "durationEstimate",
          "duration",
        ]) || "2 minutes",
      segments: normalizedSegments,
      recap:
        recap.length > 0
          ? recap
          : [
            "Review the main idea",
            "Practice active recall",
            "Connect examples to concepts",
          ],
      script,
      audioUrl:
        pickFirstString(rawOverview, [
          "audioUrl",
          "audio_url",
          "url",
          "fileUrl",
          "file_url",
        ]) || undefined,
      provider:
        pickFirstString(rawOverview, ["provider"]) ||
        pickFirstString(unwrapped, ["provider"]) ||
        undefined,
      premiumAudio,
      audio,
    },
  };
};

const validateAudioResponse = (response: N8nAudioResponse) => {
  if (
    !response.audioOverview ||
    !Array.isArray(response.audioOverview.segments)
  ) {
    throw new Error(
      "Audio Overview workflow returned an invalid audio response.",
    );
  }

  return response;
};

const validateSourceReaderResponse = (response: N8nSourceReaderResponse) => {
  if (!response.sourceType || !response.title || !response.status) {
    throw new Error("Source Reader workflow returned an invalid response.");
  }

  return response;
};

const validateWebSearchResponse = (response: N8nWebSearchResponse) => {
  if (!Array.isArray(response.results)) {
    throw new Error("Web Search workflow returned an invalid response.");
  }

  return response;
};

export const chatWithN8n = async (payload: N8nChatPayload) => {
  console.log("[Study Aura] Sending chat payload to n8n:", payload);

  const response = await postToWebhook<N8nChatResponse, N8nChatPayload>({
    webhookName: "Chat",
    envKey: "VITE_N8N_CHAT_WEBHOOK_URL",
    payload,
  });

  if (!response.answer) {
    throw new Error("Chat workflow returned an empty answer.");
  }

  return response;
};

export const uploadSourceWithN8n = async (payload: N8nUploadPayload) => {
  console.log(
    "[Study Aura] Sending source upload payload to n8n:",
    getPayloadPreview(payload),
  );

  return postToWebhook<N8nUploadResponse, N8nUploadPayload>({
    webhookName: "Source Upload",
    envKey: "VITE_N8N_UPLOAD_WEBHOOK_URL",
    payload,
  });
};

export const summarizeSourceWithN8n = async (
  payload: N8nSummarizeSourcePayload,
) => {
  console.log(
    "[Study Aura] Sending source summary payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<
    N8nSummarizeSourceResponse,
    N8nSummarizeSourcePayload
  >({
    webhookName: "Source Summary",
    envKey: "VITE_N8N_SUMMARIZE_SOURCE_WEBHOOK_URL",
    payload,
  });

  if (!response.summary) {
    throw new Error("Source Summary workflow returned an empty summary.");
  }

  return response;
};

export const readSourceWithN8n = async (payload: N8nSourceReaderPayload) => {
  console.log(
    "[Study Aura] Sending source reader payload to n8n:",
    getPayloadPreview(payload),
  );

  const rawResponse = await postToWebhook<unknown, N8nSourceReaderPayload>({
    webhookName: "Source Reader",
    envKey: "VITE_N8N_SOURCE_READER_WEBHOOK_URL",
    payload,
  });

  console.log("[Study Aura] Source Reader raw response:", rawResponse);

  const response = normalizeSourceReaderResponse(rawResponse);

  return validateSourceReaderResponse(response);
};

export const searchWebSourcesWithN8n = async (
  payload: N8nWebSearchPayload,
) => {
  console.log(
    "[Study Aura] Sending web search payload to n8n:",
    getPayloadPreview(payload),
  );

  const rawResponse = await postToWebhook<unknown, N8nWebSearchPayload>({
    webhookName: "Web Search",
    envKey: "VITE_N8N_WEB_SEARCH_WEBHOOK_URL",
    payload,
  });

  const response = normalizeWebSearchResults(rawResponse);

  return validateWebSearchResponse(response);
};

export const generateQuizWithN8n = async (payload: N8nQuizPayload) => {
  console.log(
    "[Study Aura] Sending quiz payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<N8nQuizResponse, N8nQuizPayload>({
    webhookName: "Quiz",
    envKey: "VITE_N8N_QUIZ_WEBHOOK_URL",
    payload,
  });

  return validateQuizResponse(response);
};

export const generateFlashcardsWithN8n = async (
  payload: N8nFlashcardsPayload,
) => {
  console.log(
    "[Study Aura] Sending flashcards payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<
    N8nFlashcardsResponse,
    N8nFlashcardsPayload
  >({
    webhookName: "Flashcards",
    envKey: "VITE_N8N_FLASHCARDS_WEBHOOK_URL",
    payload,
  });

  return validateFlashcardsResponse(response);
};

export const generateTablesWithN8n = async (payload: N8nTablesPayload) => {
  console.log(
    "[Study Aura] Sending tables payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<N8nTablesResponse, N8nTablesPayload>({
    webhookName: "Tables",
    envKey: "VITE_N8N_TABLES_WEBHOOK_URL",
    payload,
  });

  return validateTablesResponse(response);
};

export const generateMindMapWithN8n = async (payload: N8nMindMapPayload) => {
  console.log(
    "[Study Aura] Sending mind map payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<N8nMindMapResponse, N8nMindMapPayload>({
    webhookName: "Mind Map",
    envKey: "VITE_N8N_MINDMAP_WEBHOOK_URL",
    payload,
  });

  return validateMindMapResponse(response);
};

export const generateSlidesWithN8n = async (payload: N8nSlidesPayload) => {
  console.log(
    "[Study Aura] Sending slides payload to n8n:",
    getPayloadPreview(payload),
  );

  const response = await postToWebhook<N8nSlidesResponse, N8nSlidesPayload>({
    webhookName: "Slides",
    envKey: "VITE_N8N_SLIDES_WEBHOOK_URL",
    payload,
  });

  return validateSlidesResponse(response);
};

export const generateAudioOverviewWithN8n = async (
  payload: N8nAudioPayload,
) => {
  console.log(
    "[Study Aura] Sending audio overview payload to n8n:",
    getPayloadPreview(payload),
  );

  const rawResponse = await postToWebhook<unknown, N8nAudioPayload>({
    webhookName: "Audio Overview",
    envKey: "VITE_N8N_AUDIO_WEBHOOK_URL",
    payload,
    timeoutMs: 120_000,
  });

  const response = normalizeAudioResponse(rawResponse);

  return validateAudioResponse(response);
};