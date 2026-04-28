import { useEffect, useMemo, useState } from "react";
import SettingsModal from "../components/settings/SettingsModal";
import AIToolModal from "../components/ai-studio/AIToolModal";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SourcesPanel from "../components/dashboard/SourcesPanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import AIStudioPanel from "../components/dashboard/AIStudioPanel";
import AddSourceModal from "../components/dashboard/AddSourceModal";
import { useToast } from "../components/toast/ToastProvider";
import { useDashboardActions } from "../hooks/useDashboardActions";
import {
  deleteGeneratedOutput,
  fetchGeneratedOutputs,
  type GeneratedOutput,
} from "../services/generatedOutputService";
import type { SettingsPanel } from "../components/settings/settingsTypes";
import type { AuthProfile } from "../services/authService";
import type {
  AIToolName,
  SourceUploadPayload,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

interface DashboardProps {
  topic: string;
  modules: StudyModule[];
  profile: AuthProfile | null;
  userId?: string;
  onModulesChange: (modules: StudyModule[]) => void;
  onNavigate: (topic: string) => void;
  onAddSourceToModule: (params: {
    moduleId: string;
    source: StudySource;
  }) => Promise<StudySource>;
  onAddSourcesToModule: (params: {
    moduleId: string;
    sources: StudySource[];
  }) => Promise<StudySource[]>;
  onUpdateSourceSelected: (params: {
    moduleId: string;
    sourceId: string;
    selected: boolean;
  }) => Promise<void>;
  onUpdateAllSourcesSelected: (params: {
    moduleId: string;
    selected: boolean;
  }) => Promise<void>;
  onDeleteSource: (params: {
    moduleId: string;
    sourceId: string;
  }) => Promise<void>;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
}

const Dashboard = ({
  topic,
  modules,
  profile,
  userId,
  onModulesChange,
  onAddSourceToModule,
  onAddSourcesToModule,
  onUpdateSourceSelected,
  onUpdateAllSourcesSelected,
  onDeleteSource,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardProps) => {
  const { showToast } = useToast();

  const [inputValue, setInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialPanel, setSettingsInitialPanel] =
    useState<SettingsPanel>("home");
  const [activeTool, setActiveTool] = useState<AIToolName | null>(null);
  const [savedOutputToView, setSavedOutputToView] =
    useState<GeneratedOutput | null>(null);
  const [recentOutputs, setRecentOutputs] = useState<GeneratedOutput[]>([]);
  const [isLoadingOutputs, setIsLoadingOutputs] = useState(false);
  const [outputError, setOutputError] = useState("");
  const [deletingOutputId, setDeletingOutputId] = useState<string | null>(null);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  const currentModule = useMemo(() => {
    const matchedModule = modules.find(
      (module) => module.title.toLowerCase() === topic.toLowerCase(),
    );

    return matchedModule ?? modules[0];
  }, [modules, topic]);

  const currentSources = currentModule?.sources ?? [];

  const selectedSources = useMemo(() => {
    return currentSources.filter((source) => source.selected);
  }, [currentSources]);

  const selectedSourceCount = selectedSources.length;

  const loadGeneratedOutputs = async () => {
    if (!userId || !currentModule?.id) {
      setRecentOutputs([]);
      return;
    }

    setIsLoadingOutputs(true);
    setOutputError("");

    try {
      const outputs = await fetchGeneratedOutputs({
        userId,
        moduleId: currentModule.id,
      });

      setRecentOutputs(outputs);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load generated outputs.";

      setOutputError(message);

      showToast({
        type: "error",
        title: "Could not load saved outputs",
        message,
        duration: 6500,
      });
    } finally {
      setIsLoadingOutputs(false);
    }
  };

  useEffect(() => {
    loadGeneratedOutputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentModule?.id]);

  const openSettings = (panel: SettingsPanel = "home") => {
    setSettingsInitialPanel(panel);
    setIsSettingsOpen(true);
  };

  const updateCurrentModule = (
    updater: (module: StudyModule) => StudyModule,
  ) => {
    if (!currentModule) return;

    const nextModules = modules.map((module) =>
      module.id === currentModule.id ? updater(module) : module,
    );

    onModulesChange(nextModules);
  };

  const handleSourceAdded = async (source: StudySource) => {
    if (!currentModule) return;

    try {
      const savedSource = await onAddSourceToModule({
        moduleId: currentModule.id,
        source,
      });

      updateCurrentModule((module) => ({
        ...module,
        progress: Math.max(module.progress, 10),
        updatedAt: new Date().toISOString(),
        sources: [
          savedSource,
          ...module.sources.filter(
            (currentSource) => currentSource.id !== savedSource.id,
          ),
        ],
      }));

      setIsAddSourceOpen(false);

      showToast({
        type: savedSource.status === "failed" ? "warning" : "success",
        title:
          savedSource.status === "failed"
            ? "Source added with warning"
            : "Source added",
        message:
          savedSource.status === "failed"
            ? savedSource.statusMessage ||
              `${savedSource.title} was added, but Study Aura could not fully read it.`
            : `${savedSource.title} is ready in your workspace.`,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Could not add source",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not add this source.",
        duration: 6500,
      });

      throw error;
    }
  };

  const handleSourcesAdded = async (sources: StudySource[]) => {
    if (!currentModule) return;

    try {
      const savedSources = await onAddSourcesToModule({
        moduleId: currentModule.id,
        sources,
      });

      updateCurrentModule((module) => {
        const incomingIds = new Set(savedSources.map((source) => source.id));

        return {
          ...module,
          progress: Math.max(module.progress, 10),
          updatedAt: new Date().toISOString(),
          sources: [
            ...savedSources,
            ...module.sources.filter((source) => !incomingIds.has(source.id)),
          ],
        };
      });

      setIsAddSourceOpen(false);

      const failedCount = savedSources.filter(
        (source) => source.status === "failed",
      ).length;

      if (failedCount > 0) {
        showToast({
          type: "warning",
          title: "Sources added with warnings",
          message: `${savedSources.length} source${
            savedSources.length === 1 ? "" : "s"
          } added, but ${failedCount} could not be fully read.`,
          duration: 6500,
        });

        return;
      }

      showToast({
        type: "success",
        title: "Sources added",
        message: `${savedSources.length} source${
          savedSources.length === 1 ? "" : "s"
        } added to your workspace.`,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Could not add sources",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not add these sources.",
        duration: 6500,
      });

      throw error;
    }
  };

  const handleToggleSource = async (sourceId: string) => {
    if (!currentModule) return;

    const source = currentModule.sources.find(
      (currentSource) => currentSource.id === sourceId,
    );

    if (!source) return;

    const nextSelected = !source.selected;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((currentSource) =>
        currentSource.id === sourceId
          ? {
              ...currentSource,
              selected: nextSelected,
            }
          : currentSource,
      ),
    }));

    try {
      await onUpdateSourceSelected({
        moduleId: currentModule.id,
        sourceId,
        selected: nextSelected,
      });

      showToast({
        type: "info",
        title: nextSelected ? "Source selected" : "Source deselected",
        message: nextSelected
          ? `${source.title} will be used as AI context.`
          : `${source.title} was removed from selected context.`,
        duration: 2600,
      });
    } catch (error) {
      updateCurrentModule((module) => ({
        ...module,
        updatedAt: new Date().toISOString(),
        sources: module.sources.map((currentSource) =>
          currentSource.id === sourceId
            ? {
                ...currentSource,
                selected: source.selected,
              }
            : currentSource,
        ),
      }));

      showToast({
        type: "error",
        title: "Selection update failed",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not update this source selection.",
        duration: 6500,
      });
    }
  };

  const handleSelectAllSources = async () => {
    if (!currentModule) return;

    const previousSources = currentModule.sources;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: true,
      })),
    }));

    try {
      await onUpdateAllSourcesSelected({
        moduleId: currentModule.id,
        selected: true,
      });

      showToast({
        type: "success",
        title: "All sources selected",
        message: `${currentModule.sources.length} source${
          currentModule.sources.length === 1 ? "" : "s"
        } will be used as AI context.`,
        duration: 3000,
      });
    } catch (error) {
      updateCurrentModule((module) => ({
        ...module,
        updatedAt: new Date().toISOString(),
        sources: previousSources,
      }));

      showToast({
        type: "error",
        title: "Could not select all sources",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not update your source selections.",
        duration: 6500,
      });
    }
  };

  const handleClearSelectedSources = async () => {
    if (!currentModule) return;

    const previousSources = currentModule.sources;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: false,
      })),
    }));

    try {
      await onUpdateAllSourcesSelected({
        moduleId: currentModule.id,
        selected: false,
      });

      showToast({
        type: "info",
        title: "Sources cleared",
        message: "No sources are currently selected for AI context.",
        duration: 3000,
      });
    } catch (error) {
      updateCurrentModule((module) => ({
        ...module,
        updatedAt: new Date().toISOString(),
        sources: previousSources,
      }));

      showToast({
        type: "error",
        title: "Could not clear sources",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not clear your source selections.",
        duration: 6500,
      });
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!currentModule) return;

    const sourceToDelete = currentModule.sources.find(
      (source) => source.id === sourceId,
    );

    const previousSources = currentModule.sources;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.filter((source) => source.id !== sourceId),
    }));

    try {
      await onDeleteSource({
        moduleId: currentModule.id,
        sourceId,
      });

      showToast({
        type: "info",
        title: "Source removed",
        message: sourceToDelete
          ? `${sourceToDelete.title} was removed from your workspace.`
          : "The source was removed from your workspace.",
      });
    } catch (error) {
      updateCurrentModule((module) => ({
        ...module,
        updatedAt: new Date().toISOString(),
        sources: previousSources,
      }));

      showToast({
        type: "error",
        title: "Could not remove source",
        message:
          error instanceof Error
            ? error.message
            : "Study Aura could not remove this source.",
        duration: 6500,
      });
    }
  };

  const {
    messages,
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleUploadSource,
    handleUploadSources,
    handleSendMessage,
  } = useDashboardActions({
    inputValue,
    topic: currentModule?.title ?? topic,
    userId,
    activeModule: currentModule,
    selectedSources,
    onInputClear: () => setInputValue(""),
    onSourceAdded: handleSourceAdded,
    onSourcesAdded: handleSourcesAdded,
  });

  const handleSubmitSource = (payload: SourceUploadPayload) => {
    showToast({
      type: "info",
      title: "Reading source",
      message: "Study Aura is preparing your source.",
      duration: 2600,
    });

    handleUploadSource(payload);
  };

  const handleSubmitSources = (payloads: SourceUploadPayload[]) => {
    showToast({
      type: "info",
      title: "Reading sources",
      message: `${payloads.length} source${
        payloads.length === 1 ? "" : "s"
      } queued for reading.`,
      duration: 2600,
    });

    handleUploadSources(payloads);
  };

  const handleSubmitWebSources = (payloads: SourceUploadPayload[]) => {
    showToast({
      type: "info",
      title: "Importing web sources",
      message: `${payloads.length} source${
        payloads.length === 1 ? "" : "s"
      } selected from Web Source Finder.`,
      duration: 2600,
    });

    handleUploadSources(payloads);
  };

  const handleOpenTool = (toolName: AIToolName) => {
    setSavedOutputToView(null);
    setActiveTool(toolName);
  };

  const handleOpenSavedOutput = (output: GeneratedOutput) => {
    setSavedOutputToView(output);
    setActiveTool(output.toolName);
  };

  const handleDeleteSavedOutput = async (outputId: string) => {
    if (!userId) return;

    const outputToDelete = recentOutputs.find((output) => output.id === outputId);

    setDeletingOutputId(outputId);
    setOutputError("");

    try {
      await deleteGeneratedOutput({
        userId,
        outputId,
      });

      setRecentOutputs((currentOutputs) =>
        currentOutputs.filter((output) => output.id !== outputId),
      );

      if (savedOutputToView?.id === outputId) {
        setSavedOutputToView(null);
        setActiveTool(null);
      }

      showToast({
        type: "info",
        title: "Saved output deleted",
        message: outputToDelete
          ? `${outputToDelete.title} was removed from this module.`
          : "The saved output was removed from this module.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete saved output.";

      setOutputError(message);

      showToast({
        type: "error",
        title: "Could not delete saved output",
        message,
        duration: 6500,
      });
    } finally {
      setDeletingOutputId(null);
    }
  };

  const handleCloseToolModal = () => {
    setActiveTool(null);
    setSavedOutputToView(null);
    loadGeneratedOutputs();
  };

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-aura-bg text-aura-text">
      <DashboardNavbar
        profile={profile}
        onOpenSettings={openSettings}
        onOpenLibrary={onOpenLibrary}
        onOpenCreateModule={onOpenCreateModule}
        onLogout={onLogout}
      />

      <div className="aura-scrollbar grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[25%_50%_25%] lg:overflow-hidden">
        <div className="min-h-105 overflow-hidden xl:min-h-0">
          <SourcesPanel
            moduleTitle={currentModule?.title ?? topic}
            moduleId={currentModule?.id}
            sources={currentSources}
            selectedSourceCount={selectedSourceCount}
            isUploadingSource={isUploadingSource}
            uploadError={uploadError}
            onUpload={() => setIsAddSourceOpen(true)}
            onUploadWebSources={handleSubmitWebSources}
            onToggleSource={handleToggleSource}
            onSelectAllSources={handleSelectAllSources}
            onClearSelectedSources={handleClearSelectedSources}
            onDeleteSource={handleDeleteSource}
          />
        </div>

        <div className="min-h-155 overflow-hidden xl:min-h-0">
          <ChatPanel
            topic={currentModule?.title ?? topic}
            selectedSourceCount={selectedSourceCount}
            profile={profile}
            inputValue={inputValue}
            onInputChange={setInputValue}
            messages={messages}
            isChatLoading={isChatLoading}
            chatError={chatError}
            onSend={handleSendMessage}
          />
        </div>

        <div className="min-h-105 overflow-hidden lg:col-span-1 lg:min-h-0">
          <AIStudioPanel
            selectedSourceCount={selectedSourceCount}
            recentOutputs={recentOutputs}
            isLoadingOutputs={isLoadingOutputs}
            outputError={outputError}
            deletingOutputId={deletingOutputId}
            onOpenTool={handleOpenTool}
            onOpenSavedOutput={handleOpenSavedOutput}
            onDeleteSavedOutput={handleDeleteSavedOutput}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        initialPanel={settingsInitialPanel}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIToolModal
        activeTool={activeTool}
        topic={currentModule?.title ?? topic}
        moduleId={currentModule?.id}
        userId={userId}
        selectedSources={selectedSources}
        savedOutput={savedOutputToView}
        onClose={handleCloseToolModal}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        isUploading={isUploadingSource}
        uploadError={uploadError}
        moduleId={currentModule?.id}
        onClose={() => setIsAddSourceOpen(false)}
        onSubmit={handleSubmitSource}
        onSubmitMany={handleSubmitSources}
      />
    </div>
  );
};

export default Dashboard;