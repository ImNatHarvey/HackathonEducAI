import { useMemo, useState } from "react";
import type { MindMapBranch, N8nMindMapResponse } from "../../../lib/n8n";
import { ProviderBadge } from "./resultUtils";

const getBranchPositionClass = (index: number) => {
  const positions = [
    "xl:col-start-1 xl:row-start-1",
    "xl:col-start-3 xl:row-start-1",
    "xl:col-start-1 xl:row-start-3",
    "xl:col-start-3 xl:row-start-3",
    "xl:col-start-2 xl:row-start-1",
    "xl:col-start-2 xl:row-start-3",
  ];

  return positions[index % positions.length];
};

const SavedMindMapResult = ({ result }: { result: N8nMindMapResponse }) => {
  const branches = result.mindMap.branches;
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);

  const activeBranch: MindMapBranch | undefined = useMemo(() => {
    return branches[activeBranchIndex] ?? branches[0];
  }, [branches, activeBranchIndex]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
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

          <ProviderBadge result={result} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-panel p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
            Branch Explorer
          </p>

          <p className="mt-2 text-sm leading-6 text-aura-muted">
            Select a branch to focus the map and view its keywords.
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

        <div className="relative overflow-hidden rounded-[1.75rem] border border-aura-border bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-5">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-1/2 top-1/2 h-[1px] w-[80%] -translate-x-1/2 bg-aura-cyan/20" />
            <div className="absolute left-1/2 top-1/2 h-[80%] w-[1px] -translate-y-1/2 bg-aura-cyan/20" />
            <div className="absolute left-[14%] top-[18%] h-[1px] w-[72%] rotate-[28deg] bg-aura-gold/10" />
            <div className="absolute left-[14%] top-[78%] h-[1px] w-[72%] -rotate-[28deg] bg-aura-gold/10" />
          </div>

          <div className="relative grid min-h-[560px] gap-4 xl:grid-cols-3 xl:grid-rows-3">
            <div className="order-first xl:col-start-2 xl:row-start-2">
              <div className="flex h-full min-h-[180px] items-center justify-center">
                <div className="relative w-full rounded-[2rem] border border-aura-cyan/50 bg-aura-cyan/10 p-6 text-center shadow-[0_0_45px_rgba(34,211,238,0.18)]">
                  <div className="absolute -inset-1 rounded-[2rem] border border-aura-cyan/20" />

                  <p className="relative text-[10px] font-black uppercase tracking-[0.24em] text-aura-cyan">
                    Center Topic
                  </p>

                  <h4 className="relative mt-3 text-2xl font-black leading-8 text-aura-text">
                    {result.mindMap.center}
                  </h4>

                  <p className="relative mt-3 text-sm leading-6 text-aura-muted">
                    {result.mindMap.description}
                  </p>
                </div>
              </div>
            </div>

            {branches.map((branch, index) => {
              const isActive = index === activeBranchIndex;

              return (
                <button
                  key={`${branch.title}-${index}`}
                  type="button"
                  onClick={() => setActiveBranchIndex(index)}
                  className={`relative rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-1 ${getBranchPositionClass(
                    index,
                  )} ${
                    isActive
                      ? "border-aura-gold/60 bg-aura-gold/15 shadow-[0_0_35px_rgba(245,158,11,0.14)]"
                      : "border-aura-border bg-aura-panel/90 hover:border-aura-cyan/50"
                  }`}
                >
                  <div
                    className={`absolute -top-3 left-5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      isActive
                        ? "border-aura-gold/50 bg-aura-gold text-aura-bg"
                        : "border-aura-cyan/40 bg-aura-bg-soft text-aura-cyan"
                    }`}
                  >
                    Branch {index + 1}
                  </div>

                  <h5 className="mt-3 text-base font-black leading-6 text-aura-text">
                    {branch.title}
                  </h5>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-aura-muted">
                    {branch.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {branch.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-aura-border bg-aura-bg-soft px-2.5 py-1 text-[11px] font-bold text-aura-muted"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedMindMapResult;