export type N8nChatPayload = {
  message: string;
  topic: string;
  userId?: string;
};

export type N8nUploadPayload = {
  sourceType: "pdf" | "image" | "text" | "youtube";
  value: string;
  userId?: string;
};

export type N8nChatResponse = {
  answer: string;
  sources?: string[];
};

export type N8nUploadResponse = {
  success: boolean;
  lessonId?: string;
  message?: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type N8nQuizPayload = {
  topic: string;
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

export const generateQuizWithN8n = async (
  payload: N8nQuizPayload,
): Promise<N8nQuizResponse> => {
  const url = getRequiredEnv("VITE_N8N_QUIZ_WEBHOOK_URL");

  return postToWebhook<N8nQuizResponse>(url, payload);
};