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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-4xl rounded-[2rem] border border-aura-border bg-aura-panel overflow-hidden shadow-aura-soft">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-aura-border">
          <h2 className="text-lg font-black text-aura-text">
            {activeTool}
          </h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-aura-border hover:border-aura-pink hover:text-aura-pink"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">{renderTool()}</div>
      </div>
    </div>
  );
};

export default AIToolModal;