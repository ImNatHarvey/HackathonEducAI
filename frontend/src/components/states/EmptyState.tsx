type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = ({
  icon = "✨",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[1.75rem] border border-dashed border-aura-border bg-aura-bg-soft/70 p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-cyan/10 text-3xl">
          {icon}
        </div>

        <h3 className="mt-4 text-lg font-black text-aura-text">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-aura-muted">
          {description}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;