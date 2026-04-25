import { useMemo, useState } from "react";
import SettingsModal from "../components/settings/SettingsModal";
import AIToolModal from "../components/ai-studio/AIToolModal";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import LoadingState from "../components/states/LoadingState";
import { currentUser } from "../components/user/userMock";

interface DashboardProps {
  topic: string;
  onNavigate: (topic: string) => void;
  onLogout: () => void;
}

type AIToolName = "Audio" | "Slides" | "Mind Map" | "Cards" | "Tables" | "Quiz";

type StudioTool = {
  name: AIToolName;
  label: string;
  icon: string;
  color: string;
  description: string;
};

const generatedLessons = [
  {
    title: "Marine Biology 101",
    subtitle: "Coral reefs, dolphins, aquatic ecosystems",
    progress: 100,
  },
  {
    title: "AI Ethics & Safety",
    subtitle: "Sensitive topic filtering and safe learning",
    progress: 72,
  },
  {
    title: "Intro to N8N",
    subtitle: "Automation workflows and webhooks",
    progress: 64,
  },
  {
    title: "Advanced C# Structs",
    subtitle: "Value types, memory, and records",
    progress: 45,
  },
  {
    title: "React Study UI",
    subtitle: "Components, state, and interaction design",
    progress: 88,
  },
  {
    title: "Research Writing",
    subtitle: "Citations, synthesis, and tables",
    progress: 35,
  },
  {
    title: "Data Visualization",
    subtitle: "Charts, illustration tables, and diagrams",
    progress: 58,
  },
  {
    title: "Operating Systems",
    subtitle: "Processes, memory, scheduling",
    progress: 27,
  },
  {
    title: "Database Systems",
    subtitle: "Tables, relations, queries, and indexes",
    progress: 40,
  },
  {
    title: "Human Computer Interaction",
    subtitle: "Usability, accessibility, and user flows",
    progress: 51,
  },
];

const studioTools: StudioTool[] = [
  {
    name: "Audio",
    label: "Listen",
    icon: "🎧",
    color:
      "from-aura-cyan/25 to-aura-blue/10 border-aura-cyan/30 hover:text-aura-cyan",
    description: "Text to speech overview",
  },
  {
    name: "Slides",
    label: "Present",
    icon: "🖥️",
    color:
      "from-aura-primary/25 to-aura-primary-soft/10 border-aura-primary-soft/30 hover:text-aura-primary-soft",
    description: "Generate presentation",
  },
  {
    name: "Mind Map",
    label: "Connect",
    icon: "🧠",
    color:
      "from-aura-pink/25 to-aura-primary/10 border-aura-pink/30 hover:text-aura-pink",
    description: "Visual concept map",
  },
  {
    name: "Cards",
    label: "Review",
    icon: "🃏",
    color:
      "from-aura-green/25 to-aura-cyan/10 border-aura-green/30 hover:text-aura-green",
    description: "Flashcards",
  },
  {
    name: "Tables",
    label: "Organize",
    icon: "📊",
    color:
      "from-aura-orange/25 to-aura-gold/10 border-aura-orange/30 hover:text-aura-orange",
    description: "Illustration tables",
  },
  {
    name: "Quiz",
    label: "Test",
    icon: "⚡",
    color:
      "from-aura-gold/25 to-aura-orange/10 border-aura-gold/30 hover:text-aura-gold",
    description: "Practice questions",
  },
];

const Dashboard = ({ topic, onNavigate, onLogout }: DashboardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<AIToolName | null>(null);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploadingSource, setIsUploadingSource] = useState(false);

  const filteredLessons = useMemo(() => {
    return generatedLessons.filter((lesson) =>
      `${lesson.title} ${lesson.subtitle}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  const handleMockUpload = () => {
    setUploadError("");
    setIsUploadingSource(true);

    window.setTimeout(() => {
      setIsUploadingSource(false);
      setUploadError(
        "Unsupported file type. Please upload PDF, image, text notes, or a YouTube link.",
      );
    }, 900);
  };

  const handleMockSend = () => {
    if (!inputValue.trim()) return;

    setChatError("");
    setIsChatLoading(true);

    window.setTimeout(() => {
      setIsChatLoading(false);
      setChatError(
        "Failed to reach n8n webhook. Make sure your workflow is active and running on localhost.",
      );
    }, 900);
  };

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-aura-bg text-aura-text">
      {/* TOP NAVIGATION */}
      <nav className="flex h-[68px] shrink-0 items-center justify-between border-b border-aura-border bg-aura-bg-soft/95 px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xl shadow-[0_0_28px_rgba(34,211,238,0.25)]">
            ✨
          </div>

          <div>
            <h1 className="aura-title text-2xl font-black leading-none tracking-tight">
              Study Aura
            </h1>
            <p className="mt-1 text-xs text-aura-muted">
              AI-powered learning workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* PROFILE TAB */}
          <div className="flex min-w-[190px] items-center justify-between gap-3 rounded-2xl border border-aura-border bg-aura-panel px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aura-gold to-aura-orange text-sm font-black text-aura-bg shadow-[0_0_22px_rgba(250,204,21,0.18)]">
                {currentUser.initials}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-black text-aura-text">
                  {currentUser.name}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-aura-muted">
                  {currentUser.title}
                </p>
              </div>
            </div>

            <div className="hidden rounded-full border border-aura-gold/25 bg-aura-gold/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-aura-gold 2xl:block">
              Lv. {currentUser.level}
            </div>
          </div>

          {/* SETTINGS ICON */}
          <button
            type="button"
            title="Settings"
            aria-label="Settings"
            onClick={() => setIsSettingsOpen(true)}
            className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:bg-aura-cyan/10 hover:text-aura-cyan"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition group-hover:rotate-45"
            >
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
              <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42L9.12 5.07a7.28 7.28 0 0 0-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65a7.28 7.28 0 0 0 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65Z" />
            </svg>
          </button>

          {/* LOGOUT ICON */}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
            className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path
                d="M16 17l5-5-5-5"
                className="transition group-hover:translate-x-0.5"
              />
              <path
                d="M21 12H9"
                className="transition group-hover:translate-x-0.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* MAIN GRID: 20 / 60 / 20 */}
      <div className="grid min-h-0 flex-1 grid-cols-[20%_60%_20%] overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="flex min-h-0 min-w-0 flex-col border-r border-aura-border bg-aura-panel/95">
          <div className="shrink-0 border-b border-aura-border p-4">
            <button
              type="button"
              onClick={handleMockUpload}
              disabled={isUploadingSource}
              className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:opacity-60"
            >
              {isUploadingSource ? "Uploading source..." : "+ Add Sources"}
            </button>

            <div className="mt-4 rounded-2xl border border-dashed border-aura-border bg-aura-bg-soft/70 p-4 text-center transition hover:border-aura-cyan/70 hover:bg-aura-cyan/5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-aura-cyan/10 text-xl">
                📥
              </div>

              <p className="mt-3 text-sm font-bold text-aura-text">
                Drag & drop sources
              </p>

              <p className="mt-1 text-xs leading-5 text-aura-muted">
                PDFs, images, notes, or YouTube links.
              </p>
            </div>

            {isUploadingSource && (
              <div className="mt-4">
                <LoadingState
                  title="Uploading source..."
                  description="Study Aura is preparing your material for parsing."
                />
              </div>
            )}

            {uploadError && (
              <div className="mt-4">
                <ErrorState
                  title="Upload failed"
                  description={uploadError}
                  actionLabel="Try upload again"
                  onRetry={handleMockUpload}
                />
              </div>
            )}
          </div>

          <div className="shrink-0 border-b border-aura-border p-4">
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Generated modules
            </label>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search modules..."
              className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70"
            />
          </div>

          {/* MODULES SCROLL AREA */}
          <div className="aura-scrollbar min-h-0 flex-1 overflow-y-scroll p-4">
            {filteredLessons.length === 0 ? (
              <EmptyState
                icon="📚"
                title="No modules found"
                description="Try another keyword or add a new source to generate lessons."
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-4">
                {filteredLessons.map((lesson) => (
                  <button
                    key={lesson.title}
                    onClick={() => onNavigate(lesson.title)}
                    className="group min-h-[140px] rounded-2xl border border-aura-border bg-aura-card p-3 text-left transition hover:-translate-y-1 hover:border-aura-cyan/60 hover:bg-aura-panel-2"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-aura-primary/15 px-2 py-1 text-[9px] font-black text-aura-primary-soft">
                        MODULE
                      </span>
                      <span className="text-[10px] font-black text-aura-gold">
                        {lesson.progress}%
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-[13px] font-black leading-5 text-aura-text">
                      {lesson.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-aura-muted">
                      {lesson.subtitle}
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-aura-bg">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANEL */}
        <main className="flex min-h-0 min-w-0 flex-col bg-aura-bg">
          <section className="shrink-0 border-b border-aura-border bg-aura-bg-soft/70 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
                  Current topic
                </p>
                <h2 className="mt-1 text-sm font-black text-aura-text">
                  {topic}
                </h2>
              </div>

              <div className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-4 py-2 text-xs font-black text-aura-gold">
                🏆 {currentUser.title}
              </div>
            </div>
          </section>

          {/* CHAT CONTENT - SCROLLS ONLY HERE */}
          <section className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-8 py-5">
            <div className="mx-auto max-w-4xl space-y-5">
              <div className="rounded-[1.75rem] border border-aura-border bg-gradient-to-br from-aura-panel to-aura-bg-soft p-6 shadow-aura-soft">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xl">
                    ✨
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-aura-text">
                      Hi, I’m Study Aura.
                    </h3>

                    <p className="mt-2 text-base leading-7 text-aura-muted">
                      Ask questions, paste a YouTube link, request a quiz,
                      create flashcards, generate mind maps, or turn text into
                      audio for{" "}
                      <span className="font-bold text-aura-cyan">{topic}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-aura-border bg-aura-panel/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-dim">
                      Video enrichment
                    </p>
                    <h3 className="mt-1 text-base font-black text-aura-text">
                      YouTube learning space
                    </h3>
                  </div>

                  <span className="rounded-full bg-aura-cyan/10 px-3 py-1 text-xs font-bold text-aura-cyan">
                    Ready for links
                  </span>
                </div>

                <div className="flex min-h-[135px] items-center justify-center rounded-2xl border border-dashed border-aura-border bg-aura-bg-soft text-center">
                  <div>
                    <div className="text-4xl">▶️</div>
                    <p className="mt-3 text-sm font-bold text-aura-text">
                      Paste a YouTube video during chat
                    </p>
                    <p className="mt-1 text-xs text-aura-muted">
                      Study Aura can use it as extra learning context.
                    </p>
                  </div>
                </div>
              </div>

              {isChatLoading && (
                <LoadingState
                  title="Study Aura is thinking..."
                  description="Your question is being prepared for the AI workflow."
                />
              )}

              {chatError && (
                <ErrorState
                  title="n8n request failed"
                  description={chatError}
                  actionLabel="Retry message"
                  onRetry={handleMockSend}
                />
              )}
            </div>
          </section>

          {/* CHAT INPUT - FIXED AT BOTTOM OF CENTER PANEL */}
          <footer className="shrink-0 border-t border-aura-border bg-aura-bg-soft/95 px-8 py-3">
            <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-[1.5rem] border border-aura-border bg-aura-panel p-2 shadow-aura-soft">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask Study Aura, paste a YouTube link, or request a quiz..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-aura-text outline-none placeholder:text-aura-dim"
              />

              <button
                type="button"
                onClick={handleMockSend}
                disabled={!inputValue.trim() || isChatLoading}
                className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                {isChatLoading ? "Thinking..." : "Send"}
              </button>
            </div>
          </footer>
        </main>

        {/* RIGHT PANEL */}
        <aside className="aura-scrollbar min-h-0 min-w-0 overflow-y-auto border-l border-aura-border bg-aura-panel/95 p-4">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
              AI Studio
            </p>
            <h2 className="mt-1 text-xl font-black text-aura-text">
              Create study tools
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {studioTools.map((tool) => (
              <button
                key={tool.name}
                type="button"
                onClick={() => setActiveTool(tool.name)}
                className={`group aura-orb min-h-[135px] rounded-2xl border bg-gradient-to-br ${tool.color} p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(124,58,237,0.18)]`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-xl transition group-hover:scale-110">
                  {tool.icon}
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-aura-dim">
                  {tool.label}
                </p>

                <h3 className="mt-1 text-sm font-black text-aura-text transition">
                  {tool.name}
                </h3>

                <p className="mt-2 text-[11px] leading-4 text-aura-muted">
                  {tool.description}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIToolModal activeTool={activeTool} onClose={() => setActiveTool(null)} />
    </div>
  );
};

export default Dashboard;