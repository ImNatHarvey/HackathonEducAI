import { supabase } from "../lib/supabase";

export type PersistedChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type ChatMessageRow = {
  id: string;
  user_id: string;
  module_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

const mapChatMessageRow = (row: ChatMessageRow): PersistedChatMessage => {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
};

export const fetchChatMessages = async ({
  userId,
  moduleId,
}: {
  userId: string;
  moduleId: string;
}): Promise<PersistedChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ChatMessageRow[]).map(mapChatMessageRow);
};

export const createChatMessage = async ({
  userId,
  moduleId,
  role,
  content,
}: {
  userId: string;
  moduleId: string;
  role: "user" | "assistant";
  content: string;
}): Promise<PersistedChatMessage> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: userId,
      module_id: moduleId,
      role,
      content,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapChatMessageRow(data as ChatMessageRow);
};

export const deleteModuleChatMessages = async ({
  userId,
  moduleId,
}: {
  userId: string;
  moduleId: string;
}): Promise<void> => {
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId)
    .eq("module_id", moduleId);

  if (error) {
    throw new Error(error.message);
  }
};