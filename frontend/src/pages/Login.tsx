import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const GoogleIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Login = ({ onLogin }: LoginProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <main className="min-h-screen bg-aura-bg text-aura-text aura-grid-bg flex items-center justify-center p-6">
      <section className="relative z-10 grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] aura-glass shadow-aura-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[560px] p-10 lg:p-14">
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-aura-primary/20 blur-2xl" />
          <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-aura-cyan/20 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-aura-border bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-aura-muted">
                <span className="h-2 w-2 rounded-full bg-aura-green shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                Learning without Learning
              </div>

              <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight lg:text-6xl">
                Welcome to <span className="aura-title">Study Aura</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-aura-muted">
                Turn dense PDFs, YouTube videos, and notes into chat lessons, quizzes, flashcards,
                mind maps, audio overviews, and earned titles like <span className="text-aura-gold font-bold">Aura Farmer</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-10 sm:grid-cols-4">
              {[
                ['🎧', 'Audio'],
                ['🧠', 'Mind Maps'],
                ['🃏', 'Cards'],
                ['🏆', 'XP Titles'],
              ].map(([icon, label]) => (
                <div key={label} className="rounded-2xl border border-aura-border bg-white/[0.035] p-4">
                  <div className="text-2xl">{icon}</div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-aura-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-aura-border bg-aura-panel/80 p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-aura-text">
              {authMode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="mt-2 text-sm text-aura-muted">
              Use email or continue with a Study Aura account.
            </p>
          </div>

          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-aura-border bg-white px-4 py-3 font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(255,255,255,0.12)]"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-aura-border" />
            <span className="text-xs font-bold uppercase tracking-widest text-aura-dim">or</span>
            <div className="h-px flex-1 bg-aura-border" />
          </div>

          <div className="space-y-4">
            {authMode === 'register' && (
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-primary-soft"
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-primary-soft"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-primary-soft"
            />

            <button
              onClick={onLogin}
              className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(34,211,238,0.22)]"
            >
              Enter Study Aura
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-aura-muted">
            {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="ml-2 font-bold text-aura-cyan hover:text-aura-gold"
            >
              {authMode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;