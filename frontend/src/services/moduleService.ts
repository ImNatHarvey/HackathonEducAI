import { supabase } from "../lib/supabase";
import type {
  SourceType,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

type StudyModuleRow = {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  progress: number;
  created_at: string;
  updated_at: string;
};

type StudySourceRow = {
  id: string;
  module_id: string;
  user_id: string;
  title: string;
  type: SourceType;
  value: string;
  summary: string | null;
  selected: boolean;
  created_at: string;
  updated_at: string;
};

const mapSourceRowToSource = (row: StudySourceRow): StudySource => {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    value: row.value,
    summary: row.summary ?? undefined,
    selected: row.selected,
    createdAt: row.created_at,
  };
};

const mapModuleRowToModule = (
  row: StudyModuleRow,
  sources: StudySource[],
): StudyModule => {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    progress: row.progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sources,
  };
};

export const fetchModulesWithSources = async (
  userId: string,
): Promise<StudyModule[]> => {
  const { data: modulesData, error: modulesError } = await supabase
    .from("study_modules")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (modulesError) {
    throw new Error(modulesError.message);
  }

  const moduleRows = (modulesData ?? []) as StudyModuleRow[];

  if (moduleRows.length === 0) {
    return [];
  }

  const moduleIds = moduleRows.map((module) => module.id);

  const { data: sourcesData, error: sourcesError } = await supabase
    .from("study_sources")
    .select("*")
    .eq("user_id", userId)
    .in("module_id", moduleIds)
    .order("created_at", { ascending: false });

  if (sourcesError) {
    throw new Error(sourcesError.message);
  }

  const sourceRows = (sourcesData ?? []) as StudySourceRow[];

  return moduleRows.map((moduleRow) => {
    const moduleSources = sourceRows
      .filter((sourceRow) => sourceRow.module_id === moduleRow.id)
      .map(mapSourceRowToSource);

    return mapModuleRowToModule(moduleRow, moduleSources);
  });
};

export const createModuleInSupabase = async ({
  userId,
  title,
  subtitle,
}: {
  userId: string;
  title: string;
  subtitle: string;
}): Promise<StudyModule> => {
  const { data, error } = await supabase
    .from("study_modules")
    .insert({
      user_id: userId,
      title,
      subtitle,
      progress: 0,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapModuleRowToModule(data as StudyModuleRow, []);
};

export const updateModuleInSupabase = async (
  module: StudyModule,
): Promise<void> => {
  const { error } = await supabase
    .from("study_modules")
    .update({
      title: module.title,
      subtitle: module.subtitle,
      progress: module.progress,
    })
    .eq("id", module.id);

  if (error) {
    throw new Error(error.message);
  }
};

export const createSourceInSupabase = async ({
  userId,
  moduleId,
  source,
}: {
  userId: string;
  moduleId: string;
  source: StudySource;
}): Promise<StudySource> => {
  const { data, error } = await supabase
    .from("study_sources")
    .insert({
      module_id: moduleId,
      user_id: userId,
      title: source.title,
      type: source.type,
      value: source.value,
      summary: source.summary ?? null,
      selected: source.selected,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSourceRowToSource(data as StudySourceRow);
};

export const createSourcesInSupabase = async ({
  userId,
  moduleId,
  sources,
}: {
  userId: string;
  moduleId: string;
  sources: StudySource[];
}): Promise<StudySource[]> => {
  if (sources.length === 0) return [];

  const { data, error } = await supabase
    .from("study_sources")
    .insert(
      sources.map((source) => ({
        module_id: moduleId,
        user_id: userId,
        title: source.title,
        type: source.type,
        value: source.value,
        summary: source.summary ?? null,
        selected: source.selected,
      })),
    )
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as StudySourceRow[]).map(mapSourceRowToSource);
};

export const updateSourceSelectedInSupabase = async ({
  sourceId,
  selected,
}: {
  sourceId: string;
  selected: boolean;
}): Promise<void> => {
  const { error } = await supabase
    .from("study_sources")
    .update({ selected })
    .eq("id", sourceId);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteSourceFromSupabase = async (
  sourceId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("study_sources")
    .delete()
    .eq("id", sourceId);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateAllSourcesSelectedInSupabase = async ({
  moduleId,
  selected,
}: {
  moduleId: string;
  selected: boolean;
}): Promise<void> => {
  const { error } = await supabase
    .from("study_sources")
    .update({ selected })
    .eq("module_id", moduleId);

  if (error) {
    throw new Error(error.message);
  }
};

export const seedInitialModulesIfEmpty = async ({
  userId,
  fallbackModules,
}: {
  userId: string;
  fallbackModules: StudyModule[];
}): Promise<StudyModule[]> => {
  const existingModules = await fetchModulesWithSources(userId);

  if (existingModules.length > 0) {
    return existingModules;
  }

  const modulesToInsert = fallbackModules.map((module) => ({
    user_id: userId,
    title: module.title,
    subtitle: module.subtitle,
    progress: module.progress,
  }));

  const { data: insertedModules, error: modulesError } = await supabase
    .from("study_modules")
    .insert(modulesToInsert)
    .select("*");

  if (modulesError) {
    throw new Error(modulesError.message);
  }

  const insertedRows = (insertedModules ?? []) as StudyModuleRow[];

  const originalByTitle = new Map(
    fallbackModules.map((module) => [module.title, module]),
  );

  const sourcePayload = insertedRows.flatMap((insertedModule) => {
    const originalModule = originalByTitle.get(insertedModule.title);

    if (!originalModule) return [];

    return originalModule.sources.map((source) => ({
      module_id: insertedModule.id,
      user_id: userId,
      title: source.title,
      type: source.type,
      value: source.value,
      summary: source.summary ?? null,
      selected: source.selected,
    }));
  });

  if (sourcePayload.length > 0) {
    const { error: sourcesError } = await supabase
      .from("study_sources")
      .insert(sourcePayload);

    if (sourcesError) {
      throw new Error(sourcesError.message);
    }
  }

  return fetchModulesWithSources(userId);
};