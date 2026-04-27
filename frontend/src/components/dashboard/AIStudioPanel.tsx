import { studioTools } from "../../mocks/dashboardMockData";
import type { AIToolName } from "./dashboardTypes";

type AIStudioPanelProps = {
  selectedSourceCount: number;
  onOpenTool: (toolName: AIToolName) => void;
};

const AIStudioPanel = ({
  selectedSourceCount,
  onOpenTool,
}: AIStudioPanelProps) => {
  return (
    <aside className="flex min-h-0 min-w-0 flex-col border-l border-aura-border bg-aura-panel/95">
      <div className="shrink-0 border-b border-aura-border p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-aura-cyan">
          AI Studio
        </p>

        <h2 className="mt-2 text-xl font-black text-aura-text">
          Generate study tools
        </h2>

        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Outputs will be based on the current module and checked sources.
        </p>

        <div className="mt-4 rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
          <p className="text-2xl font-black text-aura-text">
            {selectedSourceCount}
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
            Selected context sources
          </p>
        </div>
      </div>

      <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-3 pb-4">
          {studioTools.map((tool) => (
            <button
              key={tool.name}
              type="button"
              onClick={() => onOpenTool(tool.name)}
              className="group w-full rounded-2xl border border-aura-border bg-aura-bg-soft p-4 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:bg-aura-cyan/5"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-xl shadow-[0_12px_35px_rgba(0,0,0,0.22)]`}
                >
                  {tool.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-aura-text">
                    {tool.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-aura-muted">
                    {tool.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AIStudioPanel;