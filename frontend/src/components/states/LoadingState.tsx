type LoadingStateProps = {
  title?: string;
  description?: string;
  label?: string;
  compact?: boolean;
  className?: string;
};

const baseSpinner = (
  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-aura-cyan/30 bg-aura-cyan/10">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-aura-cyan/30 border-t-aura-cyan" />
  </div>
);

const LoadingState = ({
  title = "Loading...",
  description = "Please wait while Study Aura prepares this section.",
  label = "Working",
  compact = false,
  className = "",
}: LoadingStateProps) => {
  return (
    <div
      className={`rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5 text-center ${className}`}
    >
      {baseSpinner}

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
        {label}
      </p>

      <h3 className="mt-2 text-base font-black text-aura-text">{title}</h3>

      {!compact && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-aura-muted">
          {description}
        </p>
      )}
    </div>
  );
};

export const GeneratingState = ({
  title = "Generating...",
  description = "Study Aura is creating your learning content.",
  label = "Generating",
  compact = false,
  className = "",
}: LoadingStateProps) => {
  return (
    <LoadingState
      title={title}
      description={description}
      label={label}
      compact={compact}
      className={`border-aura-cyan/25 shadow-[0_0_45px_rgba(34,211,238,0.08)] ${className}`}
    />
  );
};

export const InlineLoadingState = ({
  title = "Working...",
  description = "Please wait.",
  className = "",
}: LoadingStateProps) => {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-bold text-aura-muted ${className}`}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-aura-cyan/30 border-t-aura-cyan" />
      <span>
        <span className="text-aura-text">{title}</span>{" "}
        <span className="text-aura-dim">{description}</span>
      </span>
    </div>
  );
};

export const LoadingOverlay = ({
  title = "Working...",
  description = "Please wait while Study Aura finishes this task.",
  label = "Working",
  compact = false,
  className = "",
}: LoadingStateProps) => {
  return (
    <div
      className={`absolute inset-0 z-20 flex items-center justify-center bg-aura-bg/75 px-6 backdrop-blur-md ${className}`}
    >
      <LoadingState
        title={title}
        description={description}
        label={label}
        compact={compact}
        className="w-full max-w-xl border-aura-cyan/25 bg-aura-panel/95 p-8 shadow-[0_30px_100px_rgba(34,211,238,0.16)]"
      />
    </div>
  );
};

export { LoadingState };
export type { LoadingStateProps };
export default LoadingState;