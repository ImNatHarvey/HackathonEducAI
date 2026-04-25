type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  title = "Something went wrong",
  description = "Study Aura could not complete the request. Please try again.",
  actionLabel = "Try Again",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="rounded-[1.75rem] border border-aura-pink/40 bg-aura-pink/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aura-pink/15 text-2xl">
          ⚠️
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-black text-aura-text">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-aura-muted">
            {description}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-2xl border border-aura-pink/40 bg-aura-panel px-5 py-3 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;