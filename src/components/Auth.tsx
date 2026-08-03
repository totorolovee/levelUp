import { useState } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getAuthErrorMessage } from '../lib/auth';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

export function Auth() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const fn =
        mode === 'signup'
          ? supabase.auth.signUp({
              email: normalizedEmail,
              password,
              options: {
                data: { display_name: username.trim() },
                emailRedirectTo: `${window.location.origin}/profile`,
              },
            })
          : supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      const { data, error } = await fn;
      if (error) throw error;
      if (data.session) navigate('/profile', { replace: true });
      else if (mode === 'signup') {
        setMessage('Готово! Проверь почту и подтверди email, затем войди.');
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/profile` },
      });
      if (error) throw error;
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <div className="auth-tabs" aria-label="Вход или регистрация">
        <button
          className={mode === 'signin' ? 'active' : ''}
          onClick={() => setMode('signin')}
          type="button"
        >
          Вход
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
          type="button"
        >
          Регистрация
        </button>
      </div>
      <h2>{mode === 'signin' ? 'С возвращением!' : 'Создай аккаунт'}</h2>
      <button
        className="google-auth"
        disabled={busy}
        onClick={signInWithGoogle}
        type="button"
      >
        <span aria-hidden="true">G</span>
        Войти через Google
      </button>
      <div className="auth-divider"><span>или по email</span></div>
      <form onSubmit={handleSubmit} className="form">
        {mode === 'signup' && (
          <input
            autoComplete="username"
            maxLength={30}
            minLength={2}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            type="text"
            value={username}
          />
        )}
        <input
          autoComplete="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          type="password"
          placeholder="пароль (6+ символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? '…' : mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}
