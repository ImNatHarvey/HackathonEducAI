import ErrorState from "../states/ErrorState";
import { GeneratingState } from "../states/LoadingState";
import type { AuthProfile } from "../../services/authService";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  topic: string;
  selectedSourceCount: number;
  profile: AuthProfile | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  messages: ChatMessage[];
  isChatLoading: boolean;
  chatError: string;
  onSend: () => void;
};

const promptSuggestions = [
  "Summarize the selected sources",
  "Explain this module like I am a beginner",
  "Create a reviewer from my sources",
  "What are the most important concepts?",
];

const normalizeChatText = (value: string) =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const isHeadingLine = (line: string) => {
  const text = line.trim();

  if (!text || text.length > 72) return false;

  return (
    /^(pros|cons|summary|overview|key points|answer|explanation|examples|conclusion|advantages|disadvantages|benefits|limitations|steps|notes)\s*:?$/i.test(
      text,
    ) ||
    (text.endsWith(":") && !text.startsWith("•"))
  );
};

const cleanHeading = (line: string) => line.replace(/:$/, "").trim();

const FormattedChatMessage = ({ content }: { content: string }) => {
  const blocks = normalizeChatText(content)
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 1 && isHeadingLine(lines[0])) {
          return (
            <h3
              key={blockIndex}
              className="text-[12px] font-black uppercase tracking-[0.18em] text-aura-cyan"
            >
              {cleanHeading(lines[0])}
            </h3>
          );
        }

        const bulletLines = lines.filter((line) =>
          /^([•]|\d+[.)])\s+/.test(line),
        );

        if (bulletLines.length === lines.length) {
          return (
            <ul key={blockIndex} className="space-y-2">
              {lines.map((line, index) => (
                <li
                  key={index}
                  className="flex gap-3 rounded-2xl border border-aura-border/70 bg-aura-bg-soft/70 px-4 py-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aura-cyan" />
                  <span>{line.replace(/^([•]|\d+[.)])\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={blockIndex} className="space-y-3">
            {lines.map((line, index) => {
              if (isHeadingLine(line)) {
                return (
                  <h3
                    key={index}
                    className="pt-2 text-[12px] font-black uppercase tracking-[0.18em] text-aura-cyan"
                  >
                    {cleanHeading(line)}
                  </h3>
                );
              }

              if (/^([•]|\d+[.)])\s+/.test(line)) {
                return (
                  <div
                    key={index}
                    className="flex gap-3 rounded-2xl border border-aura-border/70 bg-aura-bg-soft/70 px-4 py-3"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aura-cyan" />
                    <span>{line.replace(/^([•]|\d+[.)])\s+/, "")}</span>
                  </div>
                );
              }

              return (
                <p key={index} className="leading-7 text-aura-text">
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const ChatPanel = ({
  topic,
  selectedSourceCount,
  inputValue,
  onInputChange,
  messages,
  isChatLoading,
  chatError,
  onSend,
}: ChatPanelProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onInputChange(suggestion);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col bg-aura-bg">
      <section className="shrink-0 border-b border-aura-border bg-aura-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-aura-cyan">
            Current Module
          </p>

          <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-aura-text">
            {topic}
          </h1>

          <p className="mt-1 text-sm leading-6 text-aura-muted">
            Chat with Aura using checked sources from the left panel.
          </p>
        </div>
      </section>

      <section className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center space-y-5">
          {!hasMessages && (
            <>
              <div className="overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-aura-soft">
                <div className="relative p-8">
                  <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-aura-cyan/10 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-aura-primary/10 blur-3xl" />

                  <div className="relative z-10 flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-3xl shadow-[0_0_40px_rgba(34,211,238,0.22)]">
                      ✦
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-2xl font-black tracking-tight text-aura-text">
                        Ready to study this module?
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-7 text-aura-muted">
                        Aura will prioritize your selected sources. Add more
                        sources from the left panel, uncheck unrelated sources,
                        then ask questions or generate study materials.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-bold text-aura-muted">
                          Module: {topic}
                        </span>

                        <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-2 text-xs font-bold text-aura-cyan">
                          {selectedSourceCount} source
                          {selectedSourceCount === 1 ? "" : "s"} selected
                        </span>

                        <span className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-3 py-2 text-xs font-bold text-aura-gold">
                          n8n AI Agent Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {promptSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-[1.25rem] border border-aura-border bg-aura-panel/80 p-4 text-left text-sm font-bold leading-6 text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:bg-aura-cyan/5 hover:text-aura-text"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-dashed border-aura-border bg-aura-bg-soft/60 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aura-cyan/10 text-2xl">
                    📚
                  </div>

                  <div>
                    <h3 className="text-base font-black text-aura-text">
                      Source-scoped learning
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-aura-muted">
                      This workspace uses modules with selected sources, so only
                      checked materials become AI context.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {hasMessages && (
            <div className="flex min-h-full flex-col justify-end space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[1.5rem] border px-5 py-4 text-sm leading-7 shadow-aura-soft ${
                      message.role === "user"
                        ? "border-aura-cyan/40 bg-aura-cyan/10 text-aura-text"
                        : "border-aura-border bg-aura-panel text-aura-text"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <FormattedChatMessage content={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {normalizeChatText(message.content)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isChatLoading && (
            <GeneratingState
              label="Thinking"
              title="Aura is reading your context..."
              description="Your message and selected sources are being sent to the n8n AI Agent."
            />
          )}

          {chatError && (
            <ErrorState
              title="Chat request failed"
              description={chatError}
              actionLabel="Retry"
              onRetry={onSend}
            />
          )}
        </div>
      </section>

      <footer className="shrink-0 border-t border-aura-border bg-aura-panel/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3 rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-3 shadow-aura-soft">
            <textarea
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                selectedSourceCount > 0
                  ? "Ask about your selected sources..."
                  : "Ask about the module, or add/check sources for better answers..."
              }
              className="aura-scrollbar min-h-11 max-h-32 flex-1 resize-none bg-transparent px-3 py-3 text-sm font-medium leading-6 text-aura-text outline-none placeholder:text-aura-dim"
            />

            <button
              type="button"
              onClick={onSend}
              disabled={!inputValue.trim() || isChatLoading}
              className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isChatLoading ? "Thinking..." : "Send"}
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] font-semibold text-aura-dim">
            Shift + Enter for a new line. Enter to send.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ChatPanel;