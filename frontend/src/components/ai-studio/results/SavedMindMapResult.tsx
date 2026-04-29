import { useMemo, useState } from "react";
import type { MindMapBranch, N8nMindMapResponse } from "../../../lib/n8n";
import { ProviderBadge } from "./resultUtils";

type MindMapLayout = "vertical" | "horizontal";

const BRANCH_COLORS = [
  {
    node: "border-violet-400/60 bg-violet-500/15 text-violet-100",
    child: "border-violet-300/40 bg-violet-300/10 text-violet-100",
    line: "bg-violet-300/80",
  },
  {
    node: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100",
    child: "border-cyan-300/40 bg-cyan-300/10 text-cyan-100",
    line: "bg-cyan-300/80",
  },
  {
    node: "border-amber-400/60 bg-amber-500/15 text-amber-100",
    child: "border-amber-300/40 bg-amber-300/10 text-amber-100",
    line: "bg-amber-300/80",
  },
  {
    node: "border-emerald-400/60 bg-emerald-500/15 text-emerald-100",
    child: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
    line: "bg-emerald-300/80",
  },
  {
    node: "border-rose-400/60 bg-rose-500/15 text-rose-100",
    child: "border-rose-300/40 bg-rose-300/10 text-rose-100",
    line: "bg-rose-300/80",
  },
];

const getColor = (index: number) => BRANCH_COLORS[index % BRANCH_COLORS.length];

const getVisibleKeywords = (branch: MindMapBranch, branchCount: number) => {
  const difficultyDepth = branchCount >= 6 ? 5 : branchCount >= 4 ? 4 : 3;
  return branch.keywords.slice(0, difficultyDepth);
};

const VerticalTreeMap = ({
  result,
  branches,
  activeBranchIndex,
  setActiveBranchIndex,
}: {
  result: N8nMindMapResponse;
  branches: MindMapBranch[];
  activeBranchIndex: number;
  setActiveBranchIndex: (index: number) => void;
}) => {
  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-aura-border bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6">
      <div className="min-w-[980px]">
        <div className="flex justify-center">
          <div className="relative rounded-[2rem] border border-aura-cyan/70 bg-aura-cyan/15 px-10 py-6 text-center shadow-[0_0_45px_rgba(34,211,238,0.18)]">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-cyan">
              Center Topic
            </p>
            <h4 className="mt-2 max-w-[360px] text-2xl font-black leading-8 text-aura-text">
              {result.mindMap.center}
            </h4>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-1/2 top-[-40px] h-10 w-[4px] -translate-x-1/2 rounded-full bg-aura-cyan/90" />

          <div className="absolute left-[8%] right-[8%] top-0 h-[4px] rounded-full bg-aura-cyan/80" />

          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))` }}
          >
            {branches.map((branch, index) => {
              const color = getColor(index);
              const isActive = index === activeBranchIndex;
              const keywords = getVisibleKeywords(branch, branches.length);

              return (
                <div key={`${branch.title}-${index}`} className="relative flex flex-col items-center">
                  <div className="h-10 w-[4px] rounded-full bg-aura-cyan/80" />

                  <button
                    type="button"
                    onClick={() => setActiveBranchIndex(index)}
                    className={`relative min-h-[96px] w-full rounded-[1.6rem] border px-4 py-4 text-center transition hover:-translate-y-1 ${
                      color.node
                    } ${
                      isActive
                        ? "scale-[1.03] shadow-[0_0_35px_rgba(245,158,11,0.16)]"
                        : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                      Branch {index + 1}
                    </p>
                    <h5 className="mt-1 text-sm font-black leading-5 text-aura-text">
                      {branch.title}
                    </h5>
                  </button>

                  {keywords.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-[4px] rounded-full ${color.line}`} />

                      <div className="space-y-0">
                        {keywords.map((keyword, keywordIndex) => (
                          <div key={`${keyword}-${keywordIndex}`} className="flex flex-col items-center">
                            <div
                              className={`rounded-full border px-4 py-3 text-center text-xs font-bold shadow-lg ${color.child}`}
                            >
                              {keyword}
                            </div>

                            {keywordIndex < keywords.length - 1 && (
                              <div className={`h-8 w-[4px] rounded-full ${color.line}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const HorizontalTreeMap = ({
  result,
  branches,
  activeBranchIndex,
  setActiveBranchIndex,
}: {
  result: N8nMindMapResponse;
  branches: MindMapBranch[];
  activeBranchIndex: number;
  setActiveBranchIndex: (index: number) => void;
}) => {
  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-aura-border bg-[radial-gradient(circle_at_left,rgba(245,158,11,0.14),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6">
      <div className="grid min-w-[1100px] grid-cols-[240px_80px_1fr] items-center">
        <div className="rounded-[1.6rem] border border-aura-gold/70 bg-aura-gold/15 px-6 py-5 text-center shadow-[0_0_40px_rgba(245,158,11,0.16)]">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-gold">
            Center Topic
          </p>
          <h4 className="mt-2 text-xl font-black leading-7 text-aura-text">
            {result.mindMap.center}
          </h4>
        </div>

        <div className="h-[4px] rounded-full bg-aura-gold/90" />

        <div className="relative py-6">
          <div className="absolute left-0 top-1/2 h-[80%] w-[4px] -translate-y-1/2 rounded-full bg-aura-gold/80" />

          <div className="space-y-7">
            {branches.map((branch, index) => {
              const color = getColor(index);
              const isActive = index === activeBranchIndex;
              const keywords = getVisibleKeywords(branch, branches.length);

              return (
                <div
                  key={`${branch.title}-${index}`}
                  className="grid grid-cols-[70px_260px_80px_1fr] items-center"
                >
                  <div className="h-[4px] rounded-full bg-aura-gold/80" />

                  <button
                    type="button"
                    onClick={() => setActiveBranchIndex(index)}
                    className={`rounded-[1.35rem] border px-4 py-3 text-left transition hover:-translate-y-1 ${
                      color.node
                    } ${
                      isActive
                        ? "scale-[1.03] shadow-[0_0_35px_rgba(245,158,11,0.16)]"
                        : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                      Branch {index + 1}
                    </p>
                    <h5 className="mt-1 text-sm font-black leading-5 text-aura-text">
                      {branch.title}
                    </h5>
                  </button>

                  <div className={`h-[4px] rounded-full ${color.line}`} />

                  <div className="relative flex items-center gap-4">
                    <div className={`h-[4px] w-8 rounded-full ${color.line}`} />

                    <div className="space-y-2">
                      {keywords.map((keyword, keywordIndex) => (
                        <div
                          key={`${keyword}-${keywordIndex}`}
                          className="grid grid-cols-[36px_1fr] items-center"
                        >
                          <div className={`h-[3px] rounded-full ${color.line}`} />
                          <div
                            className={`rounded-full border px-4 py-2 text-xs font-bold shadow-lg ${color.child}`}
                          >
                            {keyword}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedMindMapResult = ({ result }: { result: N8nMindMapResponse }) => {
  const branches = result.mindMap.branches;
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const [layout, setLayout] = useState<MindMapLayout>("vertical");

  const activeBranch: MindMapBranch | undefined = useMemo(() => {
    return branches[activeBranchIndex] ?? branches[0];
  }, [branches, activeBranchIndex]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Visual Saved Mind Map
            </p>

            <h3 className="mt-1 text-2xl font-black text-aura-text">
              {result.mindMap.title || result.mindMap.center}
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
              {result.mindMap.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-2xl border border-aura-border bg-aura-panel p-1">
              <button
                type="button"
                onClick={() => setLayout("vertical")}
                className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                  layout === "vertical"
                    ? "bg-aura-cyan text-aura-bg"
                    : "text-aura-muted hover:text-aura-text"
                }`}
              >
                Vertical Tree
              </button>

              <button
                type="button"
                onClick={() => setLayout("horizontal")}
                className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                  layout === "horizontal"
                    ? "bg-aura-gold text-aura-bg"
                    : "text-aura-muted hover:text-aura-text"
                }`}
              >
                Horizontal Tree
              </button>
            </div>

            <ProviderBadge result={result} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-panel p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
            Branch Explorer
          </p>

          <p className="mt-2 text-sm leading-6 text-aura-muted">
            Select a branch to highlight it in the mind map.
          </p>

          <div className="mt-5 space-y-2">
            {branches.map((branch, index) => {
              const isActive = index === activeBranchIndex;

              return (
                <button
                  key={`${branch.title}-${index}`}
                  type="button"
                  onClick={() => setActiveBranchIndex(index)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
                    isActive
                      ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-text"
                      : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/40 hover:text-aura-text"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-aura-dim">
                    Branch {index + 1}
                  </p>

                  <p className="mt-1 text-sm font-black">{branch.title}</p>
                </button>
              );
            })}
          </div>

          {activeBranch && (
            <div className="mt-5 rounded-2xl border border-aura-cyan/30 bg-aura-cyan/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                Focused Branch
              </p>

              <h4 className="mt-2 text-lg font-black text-aura-text">
                {activeBranch.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {activeBranch.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeBranch.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-3 py-1 text-xs font-bold text-aura-gold"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {layout === "vertical" ? (
          <VerticalTreeMap
            result={result}
            branches={branches}
            activeBranchIndex={activeBranchIndex}
            setActiveBranchIndex={setActiveBranchIndex}
          />
        ) : (
          <HorizontalTreeMap
            result={result}
            branches={branches}
            activeBranchIndex={activeBranchIndex}
            setActiveBranchIndex={setActiveBranchIndex}
          />
        )}
      </div>
    </div>
  );
};

export default SavedMindMapResult;