type N8nChatPayload = {
  message: string;
  topic: string;
  userId?: string;
};

type N8nUploadPayload = {
  sourceType: "pdf" | "image" | "text" | "youtube";
  value: string;
  userId?: string;
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

export const sendChatToN8n = async (payload: N8nChatPayload) => {
  const url = getRequiredEnv("VITE_N8N_CHAT_WEBHOOK_URL");

  return postToWebhook<{
    answer: string;
    sources?: string[];
  }>(url, payload);
};

export const uploadSourceToN8n = async (payload: N8nUploadPayload) => {
  const url = getRequiredEnv("VITE_N8N_UPLOAD_WEBHOOK_URL");

  return postToWebhook<{
    success: boolean;
    lessonId?: string;
    message?: string;
  }>(url, payload);
};