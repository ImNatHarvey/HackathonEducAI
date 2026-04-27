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

export type N8nChatResponse = {
  answer: string;
  sources?: string[];
};

export type N8nUploadResponse = {
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

export type N8nSummarizeSourceResponse = {
  success: boolean;
  summary: string;
  keyPoints?: string[];
  message?: string;
  fallback?: boolean;
};

export type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export type N8nWebSearchResponse = {
  success: boolean;
  results: WebSearchResult[];
  message?: string;
  fallback?: boolean;
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

export type N8nQuizResponse = {
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
  fallback?: boolean;
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

export type N8nFlashcardsResponse = {
  deck: {
    title: string;
    cards: FlashcardItem[];
  };
  fallback?: boolean;
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

export type N8nTablesResponse = {
  table: {
    title: string;
    description: string;
    columns: StudyTableColumn[];
    rows: StudyTableRow[];
  };
  fallback?: boolean;
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

export type N8nMindMapResponse = {
  mindMap: {
    title: string;
    center: string;
    description: string;
    branches: MindMapBranch[];
  };
  fallback?: boolean;
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

export type N8nSlidesResponse = {
  deck: {
    title: string;
    description: string;
    slides: StudySlide[];
  };
  fallback?: boolean;
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

export type N8nAudioResponse = {
  audioOverview: {
    title: string;
    description: string;
    estimatedDuration: string;
    segments: AudioSegment[];
    recap: string[];
  };
  fallback?: boolean;
};

const getRequiredEnv = (key: string) => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const postToWebhook = async <TResponse>(
  url: string,
  payload: unknown,
): Promise<TResponse> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`n8n request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
};

export const sendChatToN8n = async (
  payload: N8nChatPayload,
): Promise<N8nChatResponse> => {
  const url = getRequiredEnv("VITE_N8N_CHAT_WEBHOOK_URL");

  return postToWebhook<N8nChatResponse>(url, payload);
};

export const uploadSourceToN8n = async (
  payload: N8nUploadPayload,
): Promise<N8nUploadResponse> => {
  const url = getRequiredEnv("VITE_N8N_UPLOAD_WEBHOOK_URL");

  return postToWebhook<N8nUploadResponse>(url, payload);
};

export const summarizeSourceWithN8n = async (
  payload: N8nSummarizeSourcePayload,
): Promise<N8nSummarizeSourceResponse> => {
  const url = getRequiredEnv("VITE_N8N_SOURCE_SUMMARY_WEBHOOK_URL");

  return postToWebhook<N8nSummarizeSourceResponse>(url, payload);
};

export const searchWebSourcesWithN8n = async (
  payload: N8nWebSearchPayload,
): Promise<N8nWebSearchResponse> => {
  const url = getRequiredEnv("VITE_N8N_WEB_SEARCH_WEBHOOK_URL");

  return postToWebhook<N8nWebSearchResponse>(url, payload);
};

export const generateQuizWithN8n = async (
  payload: N8nQuizPayload,
): Promise<N8nQuizResponse> => {
  const url = getRequiredEnv("VITE_N8N_QUIZ_WEBHOOK_URL");

  return postToWebhook<N8nQuizResponse>(url, payload);
};

export const generateFlashcardsWithN8n = async (
  payload: N8nFlashcardsPayload,
): Promise<N8nFlashcardsResponse> => {
  const url = getRequiredEnv("VITE_N8N_FLASHCARDS_WEBHOOK_URL");

  return postToWebhook<N8nFlashcardsResponse>(url, payload);
};

export const generateTablesWithN8n = async (
  payload: N8nTablesPayload,
): Promise<N8nTablesResponse> => {
  const url = getRequiredEnv("VITE_N8N_TABLES_WEBHOOK_URL");

  return postToWebhook<N8nTablesResponse>(url, payload);
};

export const generateMindMapWithN8n = async (
  payload: N8nMindMapPayload,
): Promise<N8nMindMapResponse> => {
  const url = getRequiredEnv("VITE_N8N_MINDMAP_WEBHOOK_URL");

  return postToWebhook<N8nMindMapResponse>(url, payload);
};

export const generateSlidesWithN8n = async (
  payload: N8nSlidesPayload,
): Promise<N8nSlidesResponse> => {
  const url = getRequiredEnv("VITE_N8N_SLIDES_WEBHOOK_URL");

  return postToWebhook<N8nSlidesResponse>(url, payload);
};

export const generateAudioOverviewWithN8n = async (
  payload: N8nAudioPayload,
): Promise<N8nAudioResponse> => {
  const url = getRequiredEnv("VITE_N8N_AUDIO_WEBHOOK_URL");

  return postToWebhook<N8nAudioResponse>(url, payload);
};