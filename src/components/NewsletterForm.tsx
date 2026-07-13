import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';

interface NewsletterFormProps {
  /** Unique id so multiple forms on one page (footer + banner) don't collide. */
  id: string;
  layout?: 'banner' | 'compact';
  buttonLabel?: string;
  className?: string;
}

// Reads the subscriber-list endpoint from the environment — see .env.example.
// Point VITE_NEWSLETTER_ENDPOINT at a MailerLite/ConvertKit (or any provider)
// form-submit URL that accepts a JSON POST of { email }. Until it's set, the
// form simulates success locally so the UI can still be reviewed end to end.
const ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm({ id, layout = 'banner', buttonLabel = 'Subscribe', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!ENDPOINT) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Newsletter signup failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return layout === 'compact' ? (
      <p className={`text-sm text-gold-lt ${className}`}>Thank you — you're subscribed.</p>
    ) : (
      <div className={`mx-auto max-w-md rounded-md border border-gold/40 bg-cream/80 px-6 py-6 text-ink ${className}`}>
        <p className="font-display text-lg">You're on the list.</p>
        <p className="text-sm text-muted mt-1">Check your inbox for the free chapter — and welcome to the reader circle.</p>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-2.5 ${className}`}>
        <label htmlFor={id} className="sr-only">Email address</label>
        <div className="flex items-center gap-2 border-b border-gold/40 pb-2">
          <Mail size={16} className="text-gold/70" />
          <input
            id={id}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-transparent text-ivory placeholder:text-ivory/40 text-sm w-full focus:outline-none"
          />
        </div>
        {status === 'error' && <p className="text-2xs text-rose">Something went wrong — please try again.</p>}
        <button type="submit" disabled={status === 'loading'} className="btn-caps btn-gold-outline self-start px-4 py-2 text-2xs rounded-sm disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">Email address</label>
        <input
          id={id}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-sm border border-gold/40 bg-cream/90 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-caps btn-gold rounded-sm px-6 py-3 whitespace-nowrap disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
      {status === 'error' && <p className="text-2xs text-rose mt-3 text-center">Something went wrong — please try again.</p>}
    </div>
  );
}
