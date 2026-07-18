import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface LaunchSignupFormProps {
  source: string;
  buttonLabel?: string;
  className?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function LaunchSignupForm({ source, buttonLabel = 'Get Release Updates', className = '' }: LaunchSignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    // A duplicate email (unique constraint violation, code 23505) is treated
    // as success — the visitor is already subscribed either way.
    const { error } = await supabase.from('authorgaurav_newsletter_subscribers').insert({ name: name || null, email, source });
    if (error && error.code !== '23505') {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className={`mx-auto max-w-md rounded-md border border-gold/40 bg-ink-soft/60 px-6 py-6 text-ivory ${className}`}>
        <p className="font-display text-lg text-gold-lt">You're on the list.</p>
        <p className="text-sm text-ivory/70 mt-1">We'll let you know the moment The Shadow Code is available.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
        <label htmlFor="launch-signup-name" className="sr-only">Name</label>
        <input
          id="launch-signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 rounded-sm border border-gold/40 bg-ivory/95 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
        <label htmlFor="launch-signup-email" className="sr-only">Email address</label>
        <input
          id="launch-signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-sm border border-gold/40 bg-ivory/95 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-caps btn-gold rounded-sm px-6 py-3 whitespace-nowrap disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
      {status === 'error' && <p className="text-2xs text-rose mt-3 text-center">Something went wrong — please try again.</p>}
    </div>
  );
}
