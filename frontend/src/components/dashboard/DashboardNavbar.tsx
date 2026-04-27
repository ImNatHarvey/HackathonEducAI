type DashboardNavbarProps = {
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
};

const DashboardNavbar = ({
  onOpenSettings,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardNavbarProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-aura-border bg-aura-panel/90 px-5 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenLibrary}
          className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-aura-bg-soft"
          aria-label="Open module library"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-lg font-black text-aura-bg shadow-[0_0_30px_rgba(34,211,238,0.22)]">
            ✦
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-aura-text">
              Study Aura
            </p>

            <p className="truncate text-xs font-semibold text-aura-muted">
              AI-powered study workspace
            </p>
          </div>
        </button>

        <div className="ml-2 hidden h-8 w-px bg-aura-border md:block" />

        <button
          type="button"
          onClick={onOpenLibrary}
          className="hidden rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text md:inline-flex"
        >
          Module Library
        </button>

        <button
          type="button"
          onClick={onOpenCreateModule}
          className="hidden rounded-2xl bg-aura-cyan px-4 py-2 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.2)] md:inline-flex"
        >
          + Create Module
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModule}
          className="rounded-2xl bg-aura-cyan px-3 py-2 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 md:hidden"
        >
          +
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
          aria-label="Open settings"
        >
          ⚙️
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-xs font-black text-aura-muted transition hover:border-red-400/50 hover:text-red-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;