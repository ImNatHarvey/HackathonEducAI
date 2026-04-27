import { useState } from "react";
import type { FormEvent } from "react";

type CreateModuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateModule: (title: string, subtitle: string) => void;
};

const suggestedModules = [
  "Machine Learning Basics",
  "Research Methods",
  "Cell Biology",
  "Data Structures",
  "Philippine History",
  "Business Analytics",
];

const CreateModuleModal = ({
  isOpen,
  onClose,
  onCreateModule,
}: CreateModuleModalProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const trimmedTitle = title.trim();
  const trimmedSubtitle = subtitle.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTitle) return;

    onCreateModule(
      trimmedTitle,
      trimmedSubtitle || "A new AI notebook module for your selected sources.",
    );

    setTitle("");
    setSubtitle("");
  };

  const handleClose = () => {
    setTitle("");
    setSubtitle("");
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
    setSubtitle(`Study workspace for ${suggestion}.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-4 py-6 backdrop-blur-xl">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              New Notebook
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              Create Module
            </h2>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              A module is a focused study space. Sources added later will belong
              only to this module.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            aria-label="Close create module modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
              Module Title
            </span>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Neural Networks"
              className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70"
              autoFocus
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
              Subtitle / Description
            </span>

            <textarea
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Describe what this module is for..."
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-medium leading-6 text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70"
            />
          </label>

          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
              Quick Ideas
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedModules.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-bold text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl border border-aura-border bg-aura-bg-soft px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/50 hover:text-aura-text"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!trimmedTitle}
              className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModuleModal;