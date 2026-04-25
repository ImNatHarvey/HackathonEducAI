type LoadingStateProps = {
  title?: string;
  description?: string;
};

const LoadingState = ({
  title = "Study Aura is thinking...",
  description = "Please wait while your learning assistant prepares a response.",
}: LoadingStateProps) => {
  return (
    <div className="rounded-[1.75rem] border border-aura-border bg-aura-panel/80 p-6 shadow-aura-soft">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-aura-cyan/10">
          <div className="absolute h-12 w-12 animate-ping rounded-2xl bg-aura-cyan/20" />
          <div className="relative text-2xl">✨</div>
        </div>

        <div>
          <h3 className="font-black text-aura-text">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-aura-muted">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;