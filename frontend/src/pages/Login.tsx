import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-aura-ink text-aura-text">
      <div className="aura-card p-10 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-black aura-gold-text mb-2">EducAI</h1>
        <p className="text-aura-muted mb-6">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </p>

        <div className="space-y-3">
          {mode === 'register' && (
            <input className="w-full p-3 bg-aura-panel-soft rounded-xl border aura-gold-border" placeholder="Username" />
          )}
          <input className="w-full p-3 bg-aura-panel-soft rounded-xl border aura-gold-border" placeholder="Email" />
          <input className="w-full p-3 bg-aura-panel-soft rounded-xl border aura-gold-border" placeholder="Password" type="password" />

          <button onClick={onLogin} className="w-full bg-aura-gold text-black font-bold py-3 rounded-xl mt-2 hover:brightness-110">
            Enter Learning Space
          </button>
        </div>

        <p className="text-sm text-aura-muted mt-6">
          {mode === 'login' ? 'No account?' : 'Already have account?'}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="ml-2 text-aura-gold">
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;