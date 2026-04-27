import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ModuleLibrary from "./pages/ModuleLibrary";
import CreateModuleModal from "./components/dashboard/CreateModuleModal";
import LoadingState from "./components/states/LoadingState";
import ErrorState from "./components/states/ErrorState";
import { useSupabaseModules } from "./hooks/useSupabaseModules";

type AppView = "landing" | "login" | "dashboard" | "library";

function App() {
  const [view, setView] = useState<AppView>("landing");
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);

  const {
    modules,
    selectedTopic,
    isLoadingModules,
    moduleError,
    setSelectedTopic,
    setModules,
    createModule,
    addSourceToModule,
    addSourcesToModule,
    updateSourceSelected,
    updateAllSourcesSelected,
    deleteSource,
  } = useSupabaseModules();

  const activeModule = modules.find((module) => module.title === selectedTopic);

  const handleCreateModule = async (title: string, subtitle: string) => {
    try {
      const newModule = await createModule(title, subtitle);

      setSelectedTopic(newModule.title);
      setIsCreateModuleOpen(false);
      setView("dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModule = (moduleId: string) => {
    const module = modules.find((currentModule) => currentModule.id === moduleId);

    if (!module) return;

    setSelectedTopic(module.title);
    setView("dashboard");
  };

  const handleLogout = () => {
    setView("landing");
  };

  if (isLoadingModules) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-aura-bg px-6 text-aura-text">
        <div className="w-full max-w-xl">
          <LoadingState
            title="Loading Study Aura..."
            description="Connecting your modules and sources from Supabase."
          />
        </div>
      </main>
    );
  }

  if (moduleError && modules.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-aura-bg px-6 text-aura-text">
        <div className="w-full max-w-xl">
          <ErrorState
            title="Failed to load modules"
            description={moduleError}
            actionLabel="Reload"
            onRetry={() => window.location.reload()}
          />
        </div>
      </main>
    );
  }

  return (
    <>
      {view === "landing" && (
        <LandingPage onGetStarted={() => setView("login")} />
      )}

      {view === "login" && (
        <Login onLogin={() => setView("dashboard")} />
      )}

      {view === "library" && (
        <ModuleLibrary
          modules={modules}
          activeModuleId={activeModule?.id}
          onOpenModule={handleOpenModule}
          onCreateModule={() => setIsCreateModuleOpen(true)}
          onBackToDashboard={() => setView("dashboard")}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          topic={selectedTopic}
          modules={modules}
          onModulesChange={setModules}
          onNavigate={setSelectedTopic}
          onAddSourceToModule={addSourceToModule}
          onAddSourcesToModule={addSourcesToModule}
          onUpdateSourceSelected={updateSourceSelected}
          onUpdateAllSourcesSelected={updateAllSourcesSelected}
          onDeleteSource={deleteSource}
          onOpenLibrary={() => setView("library")}
          onOpenCreateModule={() => setIsCreateModuleOpen(true)}
          onLogout={handleLogout}
        />
      )}

      <CreateModuleModal
        isOpen={isCreateModuleOpen}
        onClose={() => setIsCreateModuleOpen(false)}
        onCreateModule={handleCreateModule}
      />
    </>
  );
}

export default App;