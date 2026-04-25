const ProfilePanel = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-aura-gold to-aura-orange text-2xl font-black text-aura-bg shadow-[0_0_22px_rgba(250,204,21,0.18)]">
            JD
          </div>

          <div>
            <h3 className="text-2xl font-black text-aura-text">John Doe</h3>
            <p className="mt-1 text-aura-muted">Aura Farmer · Level 1</p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-aura-bg">
          <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-sm text-aura-muted">XP</p>
            <p className="mt-1 text-xl font-black text-aura-text">150</p>
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-sm text-aura-muted">Title</p>
            <p className="mt-1 text-xl font-black text-aura-gold">Aura Farmer</p>
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-sm text-aura-muted">Next Title</p>
            <p className="mt-1 text-xl font-black text-aura-cyan">
              Dolphin Expert
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePanel;