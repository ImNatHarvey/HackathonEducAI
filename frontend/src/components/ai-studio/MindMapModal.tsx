import { useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateMindMapWithN8n } from "../../lib/n8n";
import type { MindMapBranch, MindMapDifficulty } from "../../lib/n8n";

type Props = {
  topic: string;
};

const difficultyOptions: {
  label: string;
  value: MindMapDifficulty;
  branchCount: number;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    branchCount: 4,
    description: "4 simple main branches",
  },
  {
    label: "Medium",
    value: "medium",
    branchCount: 6,
    description: "6 balanced learning branches",
  },
  {
    label: "Hard",
    value: "hard",
    branchCount: 8,
    description: "8 detailed mastery branches",
  },
];

const MindMapModal = ({ topic }: Props) => {
  const [difficulty, setDifficulty] = useState<MindMapDifficulty>("easy");
  const [title, setTitle] = useState("");
  const [center, setCenter] = useState("");
  const [description, setDescription] = useState("");
  const [branches, setBranches] = useState<MindMapBranch[]>([]);
  const [fallback, setFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const hasMindMap = branches.length > 0;

  const handleGenerateMindMap = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateMindMapWithN8n({
        topic,
        difficulty,
        branchCount: selectedDifficulty.branchCount,
        userId: currentUser.id,
      });

      setTitle(response.mindMap.title);
      setCenter(response.mindMap.center);
      setDescription(response.mindMap.description);
      setBranches(response.mindMap.branches);
      setFallback(Boolean(response.fallback));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate mind map.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewMindMap = () => {
    setTitle("");
    setCenter("");
    setDescription("");
    setBranches([]);
    setFallback(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Mind Map
        </h3>
        <p className="mt-1 text-sm text-aura-muted">
          Turn the current lesson into a visual concept map with key branches
          and keywords.
        </p>
      </div>

      {!hasMindMap && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  difficulty === option.value
                    ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                    : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{option.label}</p>
                    <p className="mt-1 text-sm text-aura-muted">
                      {option.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-2 py-1 text-xs font-black text-aura-gold">
                    {option.branchCount}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
            <p className="text-sm font-black text-aura-text">
              Selected: {selectedDifficulty.label}
            </p>
            <p className="mt-1 text-sm text-aura-muted">
              Study Aura will generate {selectedDifficulty.branchCount} branches
              for {topic}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateMindMap}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating
              ? "Generating Mind Map..."
              : `Generate ${selectedDifficulty.branchCount}-Branch Mind Map`}
          </button>

          {isGenerating && (
            <LoadingState
              title="Generating mind map..."
              description="Study Aura is building a visual mind map through n8n."
            />
          )}

          {error && (
            <ErrorState
              title="Mind map generation failed"
              description={error}
              actionLabel="Try Again"
              onRetry={handleGenerateMindMap}
            />
          )}
        </>
      )}

      {fallback && hasMindMap && (
        <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Demo fallback mode is active. Study Aura returned a safe fallback mind
          map.
        </div>
      )}

      {hasMindMap && (
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                Generated Mind Map
              </p>
              <h4 className="mt-1 text-xl font-black text-aura-text">
                {title}
              </h4>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-aura-muted">
                {description}
              </p>
              <p className="mt-2 text-sm font-black text-aura-cyan">
                Topic: {topic}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewMindMap}
              className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 px-4 py-2 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
            >
              New Mind Map
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-aura-border bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex items-center justify-center">
                <div className="rounded-full border border-aura-cyan/50 bg-aura-cyan/10 px-8 py-8 text-center shadow-[0_0_45px_rgba(34,211,238,0.16)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                    Core Topic
                  </p>
                  <p className="mt-2 text-2xl font-black text-aura-cyan">
                    {center}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {branches.map((branch, index) => (
                  <div
                    key={`${branch.title}-${index}`}
                    className="rounded-2xl border border-aura-border bg-aura-panel/90 p-4 shadow-aura-soft"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-aura-gold/40 bg-aura-gold/10 text-xs font-black text-aura-gold">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-black text-aura-text">
                          {branch.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-aura-muted">
                          {branch.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {branch.keywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full border border-aura-cyan/25 bg-aura-cyan/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-aura-cyan"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMapModal;