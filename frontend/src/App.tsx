import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ModuleLibrary from "./pages/ModuleLibrary";
import CreateModuleModal from "./components/dashboard/CreateModuleModal";
import LoadingState from "./components/states/LoadingState";
import ErrorState from "./components/states/ErrorState";
import { useAuth } from "./hooks/useAuth";
import { useSupabaseModules } from "./hooks/useSupabaseModules";

type AppView = "landing" | "login" | "dashboard" | "library";

const APP_VIEW_STORAGE_KEY = "study-aura-app-view";

const getStoredView = (): AppView => {
  const storedView = localStorage.getItem(APP_VIEW_STORAGE_KEY);

  if (
    storedView === "landing" ||
    storedView === "login" ||
    storedView === "dashboard" ||
    storedView === "library"
  ) {
    return storedView;
  }

  return "landing";
};

const saveView = (view: AppView) => {
  localStorage.setItem(APP_VIEW_STORAGE_KEY, view);
};

function App() {
  const [view, setViewState] = useState<AppView>(getStoredView);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const {
    user,
    session,
    profile,
    authError,
    authNotice,
    isLoadingAuth,
    isAuthenticated,
    login,
    register,
    logout,
  } = useAuth();

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
  } = useSupabaseModules(user?.id);

  const setView = (nextView: AppView) => {
    setViewState(nextView);
    saveView(nextView);
  };

  useEffect(() => {
    saveView(view);
  }, [view]);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && view === "landing") {
      setView("dashboard");
    }

    if (
      !isLoadingAuth &&
      !isAuthenticated &&
      (view === "dashboard" || view === "library")
    ) {
      setView("landing");
    }
  }, [isAuthenticated, isLoadingAuth, view]);

  const activeModule = modules.find((module) => module.title === selectedTopic);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsAuthActionLoading(true);

    try {
      await login(credentials);
      setView("dashboard");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  const handleRegister = async (credentials: {
    displayName: string;
    email: string;
    password: string;
  }) => {
    setIsAuthActionLoading(true);

    try {
      await register(credentials);

      if (session || user) {
        setView("dashboard");
      } else {
        setView("login");
      }
    } finally {
      setIsAuthActionLoading(false);
    }
  };

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

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(APP_VIEW_STORAGE_KEY);
    localStorage.removeItem("study-aura-selected-topic");
    setView("landing");
  };

  if (isLoadingAuth) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-aura-bg px-6 text-aura-text">
        <div className="w-full max-w-xl">
          <LoadingState
            title="Checking session..."
            description="Study Aura is verifying your account session."
          />
        </div>
      </main>
    );
  }

  if (isAuthenticated && isLoadingModules) {
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

  if (isAuthenticated && moduleError && modules.length === 0) {
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
        <Login
          onLogin={handleLogin}
          onRegister={handleRegister}
          authError={authError}
          authNotice={authNotice}
          isAuthLoading={isAuthActionLoading}
        />
      )}

      {view === "library" && isAuthenticated && (
        <ModuleLibrary
          modules={modules}
          activeModuleId={activeModule?.id}
          onOpenModule={handleOpenModule}
          onCreateModule={() => setIsCreateModuleOpen(true)}
          onBackToDashboard={() => setView("dashboard")}
        />
      )}

      {view === "dashboard" && isAuthenticated && (
        <Dashboard
          topic={selectedTopic}
          modules={modules}
          profile={profile}
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