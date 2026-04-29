import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type LoginProps = {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onRegister: (credentials: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  onBackToLanding?: () => void;
  authError?: string;
  authNotice?: string;
  isAuthLoading?: boolean;
};

type AuthMode = "login" | "register";

const Login = ({
  onLogin,
  onRegister,
  onBackToLanding,
  authError = "",
  authNotice = "",
  isAuthLoading = false,
}: LoginProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("John Doe");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validationMessage = useMemo(() => {
    if (mode === "register" && !displayName.trim()) {
      return "Please enter your display name.";
    }

    if (!email.trim()) {
      return "Please enter your email.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email.";
    }

    if (!password.trim()) {
      return "Please enter your password.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }, [displayName, email, mode, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (validationMessage || isAuthLoading) return;

    if (mode === "login") {
      await onLogin({
        email: email.trim(),
        password,
      });
      return;
    }

    await onRegister({
      displayName: displayName.trim(),
      email: email.trim(),
      password,
    });
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setHasSubmitted(false);
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-aura-bg text-aura-text">
      <section className="relative flex min-h-dvh flex-col px-5 py-5 md:px-6">
        <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-aura-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-aura-primary/20 blur-3xl" />

        <nav className="relative z-10 flex items-center justify-between border-b border-aura-border/70 pb-4">
          <button
            type="button"
            onClick={onBackToLanding}
            disabled={isAuthLoading}
            className="group flex items-center gap-3 rounded-2xl text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Go back to landing page"
          >
            <img
              src="/assets/study-aura-logo.png"
              alt="Study Aura"
              className="h-8 w-8 object-contain"
            />

            <div>
              <p className="text-sm font-black leading-tight text-aura-text">
                Study Aura
              </p>
              <p className="text-xs font-semibold leading-tight text-aura-muted">
                AI-powered study workspace
              </p>
            </div>
          </button>
        </nav>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
              Secure study workspace
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-aura-text md:text-6xl">
              Log in to your AI study space.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-aura-muted">
              Your modules, sources, selected context, and generated study tools
              are saved securely with Supabase.
            </p>
          </div>

          <div>
            <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel/90 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="border-b border-aura-border p-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
                  Account
                </p>

                <h2 className="mt-2 text-2xl font-black text-aura-text">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  {mode === "login"
                    ? "Log in to continue your study workspace."
                    : "Register to create your personal Study Aura workspace."}
                </p>
              </div>

              <div className="grid grid-cols-2 border-b border-aura-border p-3">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    mode === "login"
                      ? "bg-aura-cyan text-aura-bg"
                      : "text-aura-muted hover:bg-aura-bg-soft hover:text-aura-text"
                  }`}
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    mode === "register"
                      ? "bg-aura-cyan text-aura-bg"
                      : "text-aura-muted hover:bg-aura-bg-soft hover:text-aura-text"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {mode === "register" && (
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                      Display Name
                    </span>

                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      disabled={isAuthLoading}
                      placeholder="Example: John Doe"
                      className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
                    />
                  </label>
                )}

                <label className={mode === "register" ? "mt-4 block" : "block"}>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                    Email
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isAuthLoading}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                    Password
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isAuthLoading}
                    placeholder="Minimum 6 characters"
                    className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
                  />
                </label>

                {(authError || (hasSubmitted && validationMessage)) && (
                  <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold leading-6 text-red-200">
                    {authError || validationMessage}
                  </div>
                )}

                {authNotice && !authError && (
                  <div className="mt-4 rounded-2xl border border-aura-cyan/30 bg-aura-cyan/10 px-4 py-3 text-sm font-semibold leading-6 text-aura-cyan">
                    {authNotice}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAuthLoading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Log In"
                      : "Create Account"}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-aura-muted">
                  {mode === "login"
                    ? "New here? Switch to Register and create your workspace."
                    : "Already have an account? Switch to Log In."}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
