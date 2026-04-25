import { studioTools } from "../../mocks/dashboardMockData";
import type { AIToolName } from "./dashboardTypes";

type AIStudioPanelProps = {
  onOpenTool: (tool: AIToolName) => void;
};

const AIStudioPanel = ({ onOpenTool }: AIStudioPanelProps) => {
  return (
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
            onClick={() => onOpenTool(tool.name)}
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
  );
};

export default AIStudioPanel;