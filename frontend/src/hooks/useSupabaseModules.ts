import { useEffect, useState } from "react";
import { generatedLessons } from "../mocks/dashboardMockData";
import {
  createModuleInSupabase,
  createSourceInSupabase,
  createSourcesInSupabase,
  deleteSourceFromSupabase,
  fetchModulesWithSources,
  seedInitialModulesIfEmpty,
  updateAllSourcesSelectedInSupabase,
  updateModuleInSupabase,
  updateSourceSelectedInSupabase,
} from "../services/moduleService";
import type {
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

const SELECTED_TOPIC_STORAGE_KEY = "study-aura-selected-topic";

const getStoredSelectedTopic = () => {
  return localStorage.getItem(SELECTED_TOPIC_STORAGE_KEY);
};

const saveSelectedTopic = (topic: string) => {
  localStorage.setItem(SELECTED_TOPIC_STORAGE_KEY, topic);
};

export const useSupabaseModules = (userId?: string) => {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [selectedTopic, setSelectedTopicState] = useState(
    getStoredSelectedTopic() ?? generatedLessons[0]?.title ?? "Neural Networks",
  );
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [moduleError, setModuleError] = useState("");

  const setSelectedTopic = (topic: string) => {
    setSelectedTopicState(topic);
    saveSelectedTopic(topic);
  };

  useEffect(() => {
    let isMounted = true;

    const loadModules = async () => {
      if (!userId) {
        setModules([]);
        setIsLoadingModules(false);
        return;
      }

      setIsLoadingModules(true);
      setModuleError("");

      try {
        const loadedModules = await seedInitialModulesIfEmpty({
          userId,
          fallbackModules: generatedLessons,
        });

        if (!isMounted) return;

        setModules(loadedModules);

        const storedTopic = getStoredSelectedTopic();
        const storedTopicExists = loadedModules.some(
          (module) => module.title === storedTopic,
        );

        if (storedTopic && storedTopicExists) {
          setSelectedTopicState(storedTopic);
          return;
        }

        if (loadedModules[0]) {
          setSelectedTopic(loadedModules[0].title);
        }
      } catch (error) {
        if (!isMounted) return;

        setModuleError(
          error instanceof Error
            ? error.message
            : "Failed to load Supabase modules.",
        );

        setModules([]);
      } finally {
        if (isMounted) {
          setIsLoadingModules(false);
        }
      }
    };

    loadModules();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const requireUserId = () => {
    if (!userId) {
      throw new Error("You must be logged in to use modules.");
    }

    return userId;
  };

  const refreshModules = async () => {
    const currentUserId = requireUserId();
    const loadedModules = await fetchModulesWithSources(currentUserId);
    setModules(loadedModules);
    return loadedModules;
  };

  const createModule = async (title: string, subtitle: string) => {
    const currentUserId = requireUserId();

    const existingTitleCount = modules.filter(
      (module) => module.title.toLowerCase() === title.toLowerCase(),
    ).length;

    const finalTitle =
      existingTitleCount > 0 ? `${title} ${existingTitleCount + 1}` : title;

    const newModule = await createModuleInSupabase({
      userId: currentUserId,
      title: finalTitle,
      subtitle,
    });

    setModules((currentModules) => [newModule, ...currentModules]);
    setSelectedTopic(newModule.title);

    return newModule;
  };

  const replaceModules = (nextModules: StudyModule[]) => {
    setModules(nextModules);
  };

  const persistModuleUpdate = async (module: StudyModule) => {
    setModules((currentModules) =>
      currentModules.map((currentModule) =>
        currentModule.id === module.id ? module : currentModule,
      ),
    );

    await updateModuleInSupabase(module);
  };

  const addSourceToModule = async ({
    moduleId,
    source,
  }: {
    moduleId: string;
    source: StudySource;
  }) => {
    const currentUserId = requireUserId();

    const savedSource = await createSourceInSupabase({
      userId: currentUserId,
      moduleId,
      source,
    });

    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              progress: Math.max(module.progress, 10),
              updatedAt: new Date().toISOString(),
              sources: [
                savedSource,
                ...module.sources.filter(
                  (currentSource) => currentSource.id !== savedSource.id,
                ),
              ],
            }
          : module,
      ),
    );

    return savedSource;
  };

  const addSourcesToModule = async ({
    moduleId,
    sources,
  }: {
    moduleId: string;
    sources: StudySource[];
  }) => {
    const currentUserId = requireUserId();

    const savedSources = await createSourcesInSupabase({
      userId: currentUserId,
      moduleId,
      sources,
    });

    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              progress: Math.max(module.progress, 10),
              updatedAt: new Date().toISOString(),
              sources: [...savedSources, ...module.sources],
            }
          : module,
      ),
    );

    return savedSources;
  };

  const updateSourceSelected = async ({
    moduleId,
    sourceId,
    selected,
  }: {
    moduleId: string;
    sourceId: string;
    selected: boolean;
  }) => {
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              updatedAt: new Date().toISOString(),
              sources: module.sources.map((source) =>
                source.id === sourceId
                  ? {
                      ...source,
                      selected,
                    }
                  : source,
              ),
            }
          : module,
      ),
    );

    await updateSourceSelectedInSupabase({
      sourceId,
      selected,
    });
  };

  const updateAllSourcesSelected = async ({
    moduleId,
    selected,
  }: {
    moduleId: string;
    selected: boolean;
  }) => {
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              updatedAt: new Date().toISOString(),
              sources: module.sources.map((source) => ({
                ...source,
                selected,
              })),
            }
          : module,
      ),
    );

    await updateAllSourcesSelectedInSupabase({
      moduleId,
      selected,
    });
  };

  const deleteSource = async ({
    moduleId,
    sourceId,
  }: {
    moduleId: string;
    sourceId: string;
  }) => {
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              updatedAt: new Date().toISOString(),
              sources: module.sources.filter((source) => source.id !== sourceId),
            }
          : module,
      ),
    );

    await deleteSourceFromSupabase(sourceId);
  };

  return {
    modules,
    selectedTopic,
    isLoadingModules,
    moduleError,
    setSelectedTopic,
    setModules: replaceModules,
    refreshModules,
    createModule,
    persistModuleUpdate,
    addSourceToModule,
    addSourcesToModule,
    updateSourceSelected,
    updateAllSourcesSelected,
    deleteSource,
  };
};