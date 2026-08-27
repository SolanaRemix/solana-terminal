'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Request failed');
      }
      if (mode === 'login') {
        const { access_token } = await res.json();
        localStorage.setItem('access_token', access_token);
        router.push('/dashboard');
      } else {
        setMode('login');
        setError('Registered — please log in.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-3xl font-bold glow-text text-accent-1">
          ⚡ Solana Terminal
        </h1>

        <GlassPanel title={mode === 'login' ? 'Sign In' : 'Create Account'}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm
                           text-text-main outline-none focus:border-accent-1/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm
                           text-text-main outline-none focus:border-accent-1/60"
              />
            </div>

            {error && (
              <p className="text-xs text-danger">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Register'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-text-muted">
            {mode === 'login' ? "Don't have an account?" : 'Already registered?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-accent-1 hover:underline"
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </GlassPanel>
      </div>
    </main>
  );
}
