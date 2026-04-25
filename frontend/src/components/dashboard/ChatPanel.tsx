import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";

type ChatPanelProps = {
  topic: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  isChatLoading: boolean;
  chatError: string;
  onSend: () => void;
};

const ChatPanel = ({
  topic,
  inputValue,
  onInputChange,
  isChatLoading,
  chatError,
  onSend,
}: ChatPanelProps) => {
  return (
    <main className="flex min-h-0 min-w-0 flex-col bg-aura-bg">
      <section className="shrink-0 border-b border-aura-border bg-aura-bg-soft/70 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
              Current topic
            </p>
            <h2 className="mt-1 text-sm font-black text-aura-text">{topic}</h2>
          </div>

          <div className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-4 py-2 text-xs font-black text-aura-gold">
            🏆 {currentUser.title}
          </div>
        </div>
      </section>

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
                  Ask questions, paste a YouTube link, request a quiz, create
                  flashcards, generate mind maps, or turn text into audio for{" "}
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
              onRetry={onSend}
            />
          )}
        </div>
      </section>

      <footer className="shrink-0 border-t border-aura-border bg-aura-bg-soft/95 px-8 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-[1.5rem] border border-aura-border bg-aura-panel p-2 shadow-aura-soft">
          <input
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Ask Study Aura, paste a YouTube link, or request a quiz..."
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-aura-text outline-none placeholder:text-aura-dim"
          />

          <button
            type="button"
            onClick={onSend}
            disabled={!inputValue.trim() || isChatLoading}
            className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-40"
          >
            {isChatLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </footer>
    </main>
  );
};

export default ChatPanel;