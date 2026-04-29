export type ActivityType =
  | "chat"
  | "source"
  | "web"
  | "quiz"
  | "flashcards"
  | "slides"
  | "tables"
  | "mindmap"
  | "audio"
  | "settings"
  | "xp"
  | "energy"
  | "output";

export type ActivityLogItem = {
  id: string;
  action: string;
  detail: string;
  type: ActivityType;
  date: string;
  createdAt: string;
  icon: string;
  moduleTitle?: string;
};

const STORAGE_KEY = "study-aura-activity-log";
const ACTIVITY_EVENT_NAME = "study-aura-activity-log-updated";

const maxItems = 150;

export const getActivityLog = (): ActivityLogItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
};

export const saveActivityLog = (items: ActivityLogItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, maxItems)));
  window.dispatchEvent(new Event(ACTIVITY_EVENT_NAME));
};

export const clearActivityLog = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(ACTIVITY_EVENT_NAME));
};

export const logActivity = (
  item: Omit<ActivityLogItem, "id" | "createdAt" | "date">,
) => {
  const now = new Date();

  const nextItem: ActivityLogItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: now.toISOString(),
    date: now.toISOString().slice(0, 10),
  };

  const currentItems = getActivityLog();
  saveActivityLog([nextItem, ...currentItems]);

  return nextItem;
};

export const subscribeToActivityLog = (callback: () => void) => {
  window.addEventListener(ACTIVITY_EVENT_NAME, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ACTIVITY_EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
};

export const formatRelativeActivityTime = (isoDate: string) => {
  const createdDate = new Date(isoDate);
  const diffMs = Date.now() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";

  return `${diffDays} days ago`;
};