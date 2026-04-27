import type { AuthProfile } from "../../services/authService";

type ProfilePanelProps = {
  profile?: AuthProfile | null;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0 || !parts[0]) return "SA";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const ProfilePanel = ({ profile = null }: ProfilePanelProps) => {
  const displayName = profile?.displayName ?? "Study Aura User";
  const email = profile?.email ?? "No email available";
  const title = profile?.title ?? "Aura Farmer";
  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const xpToNextLevel = profile?.xpToNextLevel ?? 1000;
  const initials = getInitials(displayName);

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-2xl font-black text-white shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              {initials}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-aura-cyan">
                Learner Profile
              </p>

              <h3 className="mt-2 text-2xl font-black text-aura-text">
                {displayName}
              </h3>

              <p className="mt-1 text-sm font-semibold text-aura-muted">
                {email}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 px-5 py-4 text-left md:text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-aura-gold">
              Current Title
            </p>
            <p className="mt-1 text-lg font-black text-aura-text">{title}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
            Level
          </p>
          <p className="mt-2 text-3xl font-black text-aura-text">{level}</p>
        </div>

        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
            Current XP
          </p>
          <p className="mt-2 text-3xl font-black text-aura-text">{xp}</p>
        </div>

        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
            Next Level
          </p>
          <p className="mt-2 text-3xl font-black text-aura-text">
            {xpToNextLevel}
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black text-aura-text">
            Level Progress
          </p>

          <p className="text-xs font-black text-aura-cyan">
            {Math.round(progressPercent)}%
          </p>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-aura-panel">
          <div
            className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-3 text-sm leading-6 text-aura-muted">
          Keep generating study tools, reviewing sources, and completing quizzes
          to increase your Aura level.
        </p>
      </div>
    </section>
  );
};

export default ProfilePanel;