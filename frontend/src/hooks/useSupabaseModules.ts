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

export const useSupabaseModules = () => {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(
    generatedLessons[0]?.title ?? "Neural Networks",
  );
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [moduleError, setModuleError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadModules = async () => {
      setIsLoadingModules(true);
      setModuleError("");

      try {
        const loadedModules = await seedInitialModulesIfEmpty(generatedLessons);

        if (!isMounted) return;

        setModules(loadedModules);

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

        setModules(generatedLessons);
        setSelectedTopic(generatedLessons[0]?.title ?? "Neural Networks");
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
  }, []);

  const refreshModules = async () => {
    const loadedModules = await fetchModulesWithSources();
    setModules(loadedModules);
    return loadedModules;
  };

  const createModule = async (title: string, subtitle: string) => {
    const existingTitleCount = modules.filter(
      (module) => module.title.toLowerCase() === title.toLowerCase(),
    ).length;

    const finalTitle =
      existingTitleCount > 0 ? `${title} ${existingTitleCount + 1}` : title;

    const newModule = await createModuleInSupabase({
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
    const savedSource = await createSourceInSupabase({
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
    const savedSources = await createSourcesInSupabase({
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