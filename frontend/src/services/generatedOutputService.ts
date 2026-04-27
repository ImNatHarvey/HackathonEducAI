import { supabase } from "../lib/supabase";
import type { AIToolName } from "../components/dashboard/dashboardTypes";

export type SavedGeneratedPayload = {
  toolName?: AIToolName;
  topic?: string;
  options?: unknown;
  selectedSources?: unknown[];
  result?: unknown;
};

export type GeneratedOutput = {
  id: string;
  userId: string;
  moduleId: string;
  toolName: AIToolName;
  title: string;
  payload: SavedGeneratedPayload;
  createdAt: string;
};

type GeneratedOutputRow = {
  id: string;
  user_id: string;
  module_id: string;
  tool_name: AIToolName;
  title: string;
  payload: SavedGeneratedPayload;
  created_at: string;
};

const mapGeneratedOutputRow = (row: GeneratedOutputRow): GeneratedOutput => {
  return {
    id: row.id,
    userId: row.user_id,
    moduleId: row.module_id,
    toolName: row.tool_name,
    title: row.title,
    payload: row.payload,
    createdAt: row.created_at,
  };
};

export const createGeneratedOutput = async ({
  userId,
  moduleId,
  toolName,
  title,
  payload,
}: {
  userId: string;
  moduleId: string;
  toolName: AIToolName;
  title: string;
  payload: SavedGeneratedPayload;
}): Promise<GeneratedOutput> => {
  const { data, error } = await supabase
    .from("generated_outputs")
    .insert({
      user_id: userId,
      module_id: moduleId,
      tool_name: toolName,
      title,
      payload,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapGeneratedOutputRow(data as GeneratedOutputRow);
};

export const fetchGeneratedOutputs = async ({
  userId,
  moduleId,
}: {
  userId: string;
  moduleId: string;
}): Promise<GeneratedOutput[]> => {
  const { data, error } = await supabase
    .from("generated_outputs")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as GeneratedOutputRow[]).map(mapGeneratedOutputRow);
};

export const deleteGeneratedOutput = async ({
  userId,
  outputId,
}: {
  userId: string;
  outputId: string;
}): Promise<void> => {
  const { error } = await supabase
    .from("generated_outputs")
    .delete()
    .eq("user_id", userId)
    .eq("id", outputId);

  if (error) {
    throw new Error(error.message);
  }
};