import AudioModal from "./AudioModal";
import SlidesModal from "./SlidesModal";
import MindMapModal from "./MindMapModal";
import FlashcardsModal from "./FlashcardsModal";
import TablesModal from "./TablesModal";
import QuizModal from "./QuizModal";

type ToolType =
  | "Audio"
  | "Slides"
  | "Mind Map"
  | "Cards"
  | "Tables"
  | "Quiz"
  | null;

type Props = {
  activeTool: ToolType;
  onClose: () => void;
};

const AIToolModal = ({ activeTool, onClose }: Props) => {
  if (!activeTool) return null;

  const renderTool = () => {
    switch (activeTool) {
      case "Audio":
        return <AudioModal />;
      case "Slides":
        return <SlidesModal />;
      case "Mind Map":
        return <MindMapModal />;
      case "Cards":
        return <FlashcardsModal />;
      case "Tables":
        return <TablesModal />;
      case "Quiz":
        return <QuizModal />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-aura-soft">
        <div className="flex shrink-0 items-center justify-between border-b border-aura-border px-6 py-4">
          <h2 className="text-lg font-black text-aura-text">{activeTool}</h2>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-aura-border transition hover:border-aura-pink hover:text-aura-pink"
          >
            ✕
          </button>
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
          {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default AIToolModal;