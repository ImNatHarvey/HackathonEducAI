import { currentUser } from "../user/userMock";

type DashboardNavbarProps = {
  onOpenSettings: () => void;
  onLogout: () => void;
};

const DashboardNavbar = ({
  onOpenSettings,
  onLogout,
}: DashboardNavbarProps) => {
  return (
    <nav className="flex h-[68px] shrink-0 items-center justify-between border-b border-aura-border bg-aura-bg-soft/95 px-6">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xl shadow-[0_0_28px_rgba(34,211,238,0.25)]">
          ✨
        </div>

        <div>
          <h1 className="aura-title text-2xl font-black leading-none tracking-tight">
            Study Aura
          </h1>
          <p className="mt-1 text-xs text-aura-muted">
            AI-powered learning workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex min-w-[190px] items-center justify-between gap-3 rounded-2xl border border-aura-border bg-aura-panel px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aura-gold to-aura-orange text-sm font-black text-aura-bg shadow-[0_0_22px_rgba(250,204,21,0.18)]">
              {currentUser.initials}
            </div>

            <div className="leading-tight">
              <p className="text-sm font-black text-aura-text">
                {currentUser.name}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-aura-muted">
                {currentUser.title}
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-aura-gold/25 bg-aura-gold/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-aura-gold 2xl:block">
            Lv. {currentUser.level}
          </div>
        </div>

        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          onClick={onOpenSettings}
          className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:bg-aura-cyan/10 hover:text-aura-cyan"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition group-hover:rotate-45"
          >
            <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
            <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42L9.12 5.07a7.28 7.28 0 0 0-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65a7.28 7.28 0 0 0 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65Z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
          className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path
              d="M16 17l5-5-5-5"
              className="transition group-hover:translate-x-0.5"
            />
            <path
              d="M21 12H9"
              className="transition group-hover:translate-x-0.5"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;