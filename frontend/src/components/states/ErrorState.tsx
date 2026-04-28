type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
  className?: string;
};

const ErrorState = ({
  title = "Something went wrong",
  description = "Study Aura could not complete this action. Please try again.",
  actionLabel,
  onAction,
  onRetry,
  className = "",
}: ErrorStateProps) => {
  const handleAction = onAction ?? onRetry;
  const buttonLabel = actionLabel || (handleAction ? "Retry" : "");

  return (
    <div
      className={`rounded-[1.5rem] border border-red-400/30 bg-red-500/10 p-5 text-center ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/30 bg-red-500/10 text-xl">
        ⚠️
      </div>

      <h3 className="mt-4 text-base font-black text-red-100">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-200/85">
        {description}
      </p>

      {buttonLabel && handleAction && (
        <button
          type="button"
          onClick={handleAction}
          className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-xs font-black text-red-100 transition hover:border-red-200/60 hover:bg-red-500/15"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export const InlineErrorState = ({
  title = "Error",
  description = "Please try again.",
  actionLabel,
  onAction,
  onRetry,
  className = "",
}: ErrorStateProps) => {
  const handleAction = onAction ?? onRetry;
  const buttonLabel = actionLabel || (handleAction ? "Retry" : "");

  return (
    <div
      className={`rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-6">
          <span className="font-black text-red-100">{title}:</span>{" "}
          {description}
        </p>

        {buttonLabel && handleAction && (
          <button
            type="button"
            onClick={handleAction}
            className="shrink-0 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-100 transition hover:border-red-200/60 hover:bg-red-500/15"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export { ErrorState };
export type { ErrorStateProps };
export default ErrorState;