'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('Logging in...');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setMessage('');
      } else if (data.user) {
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        setError('Login failed. Please try again.');
        setMessage('');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
      setMessage('');
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('Redirecting to Google...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError('Google login failed: ' + error.message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold" style={{ background: 'linear-gradient(to right, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EDUHUB
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>Welcome back, future topper!</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '32px' }}>

          {/* Status messages */}
          {error && (
            <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}
          {message && (
            <div style={{ background: '#052e16', border: '1px solid #16a34a', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#86efac', fontSize: '14px' }}>
              {message}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            type="button"
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'white', color: '#111827', fontWeight: '600', padding: '12px', borderRadius: '12px', marginBottom: '24px', border: 'none', cursor: 'pointer', fontSize: '15px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ height: '1px', background: '#374151', flex: 1 }} />
            <span style={{ color: '#6b7280', fontSize: '14px' }}>or login with email</span>
            <div style={{ height: '1px', background: '#374151', flex: 1 }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#4338ca' : 'linear-gradient(to right, #4f46e5, #6366f1)', color: 'white', fontWeight: '700', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '24px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#818cf8', textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>

          {/* Debug info */}
          <div style={{ marginTop: '16px', padding: '12px', background: '#0f172a', borderRadius: '8px', fontSize: '12px', color: '#475569' }}>
            <div>Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Not configured'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
