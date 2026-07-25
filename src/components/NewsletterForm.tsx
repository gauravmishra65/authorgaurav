import { useState, type FormEvent } from 'react';
import { Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEWSLETTER_ENDPOINT, SUPABASE_ANON_KEY } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { getReaderMagnet } from '../data/readerMagnets';

interface NewsletterFormProps {
  /** Unique id so multiple forms on one page (footer + banner) don't collide. */
  id: string;
  layout?: 'banner' | 'compact';
  buttonLabel?: string;
  className?: string;
  /** Where this form appears, stored alongside the subscriber for reference. */
  source?: string;
  /** Adds a genre-preference select — used on the Start Here page and the homepage Reader Circle so readers can flag what they're into. */
  showGenrePreference?: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const genrePreferenceOptions = ['Thrillers', 'Romance', 'Spiritual books', 'Writing resources', 'All updates'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ id, layout = 'banner', buttonLabel = 'Subscribe', className = '', source = 'website', showGenrePreference = false }: NewsletterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [genrePreference, setGenrePreference] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    if (!EMAIL_RE.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          name: name || undefined,
          email,
          source,
          interest: genrePreference || undefined,
          consent,
          company: honeypot,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(
          body?.error === 'rate_limited'
            ? "You already signed up moments ago — please wait a minute and try again."
            : body?.error === 'invalid_email'
              ? 'Please enter a valid email address.'
              : 'Something went wrong — please try again.',
        );
        setStatus('error');
        return;
      }

      if (body?.status === 'duplicate') {
        setStatus('duplicate');
        return;
      }

      trackEvent('newsletter_signup', { source, interest: genrePreference || undefined });
      setStatus('success');
    } catch {
      setErrorMessage('Something went wrong — please check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'duplicate') {
    return layout === 'compact' ? (
      <p className={`text-sm text-gold-lt ${className}`}>You're already on the list — thank you!</p>
    ) : (
      <div className={`mx-auto max-w-md rounded-md border border-gold/40 bg-cream/80 px-6 py-6 text-ink ${className}`}>
        <p className="font-display text-lg">You're already on the list</p>
        <p className="text-sm text-muted mt-1">Thanks for your enthusiasm — no need to sign up twice.</p>
      </div>
    );
  }

  if (status === 'success') {
    const magnet = getReaderMagnet(genrePreference);
    return layout === 'compact' ? (
      <p className={`text-sm text-gold-lt ${className}`}>Thank you — you're subscribed.</p>
    ) : (
      <div className={`mx-auto max-w-md rounded-md border border-gold/40 bg-cream/80 px-6 py-6 text-ink ${className}`}>
        <p className="font-display text-lg">You're on the list.</p>
        <p className="text-sm text-muted mt-1">Check your inbox for the free chapter — and welcome to the reader circle.</p>
        {magnet?.fileUrl && (
          <a
            href={magnet.fileUrl}
            download
            className="mt-4 inline-flex items-center gap-1.5 label-caps text-2xs text-gold hover:text-ink transition-colors"
          >
            <Download size={14} /> Download your {magnet.label}
          </a>
        )}
      </div>
    );
  }

  const genreSelect = showGenrePreference && (
    <div>
      <label htmlFor={`${id}-genre`} className="sr-only">What do you love reading?</label>
      <select
        id={`${id}-genre`}
        value={genrePreference}
        onChange={(e) => setGenrePreference(e.target.value)}
        className={layout === 'compact'
          ? 'bg-transparent text-ivory text-sm w-full focus:outline-none border-b border-gold/40 pb-2'
          : 'w-full rounded-sm border border-gold/40 bg-cream/90 px-4 py-3 text-ink focus:border-gold focus:outline-none sm:w-auto'}
      >
        <option value="">What do you love reading? (optional)</option>
        {genrePreferenceOptions.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
  );

  // Honeypot: invisible to sighted and screen-reader users alike, but a bot
  // that fills every field it finds will trip it. Named "company" to match
  // the same trap already used on the Contact form.
  const honeypotField = (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor={`${id}-company`}>Company</label>
      <input
        id={`${id}-company`}
        name="company"
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );

  const consentCheckbox = (
    <label className={`flex items-start gap-2 cursor-pointer text-left ${layout === 'compact' ? 'text-2xs text-ivory/70' : 'text-2xs text-muted'}`}>
      <input
        type="checkbox"
        required
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 accent-gold flex-shrink-0"
      />
      <span>
        I'd like to receive email updates from Gaurav Mishra. See the{' '}
        <Link to="/privacy-policy" className="underline hover:no-underline">Privacy Policy</Link>.
      </span>
    </label>
  );

  if (layout === 'compact') {
    return (
      <form onSubmit={handleSubmit} noValidate className={`flex flex-col gap-2.5 ${className}`}>
        <label htmlFor={`${id}-name`} className="sr-only">Name</label>
        <input
          id={`${id}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-transparent text-ivory placeholder:text-ivory/40 text-sm w-full border-b border-gold/40 pb-2 focus:outline-none"
        />
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
            aria-invalid={!!emailError}
            aria-describedby={emailError ? `${id}-email-error` : undefined}
            className="bg-transparent text-ivory placeholder:text-ivory/40 text-sm w-full focus:outline-none"
          />
        </div>
        {emailError && <p id={`${id}-email-error`} role="alert" className="text-2xs text-rose">{emailError}</p>}
        {genreSelect}
        {honeypotField}
        {consentCheckbox}
        {status === 'error' && <p role="alert" className="text-2xs text-rose">{errorMessage}</p>}
        <button type="submit" disabled={status === 'loading' || !consent} className="btn-caps btn-gold-outline self-start px-4 py-2 text-2xs rounded-sm disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} noValidate className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label htmlFor={`${id}-name`} className="sr-only">Name</label>
        <input
          id={`${id}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 rounded-sm border border-gold/40 bg-cream/90 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
        <label htmlFor={id} className="sr-only">Email address</label>
        <input
          id={id}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? `${id}-email-error` : undefined}
          className="flex-1 rounded-sm border border-gold/40 bg-cream/90 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />
        {genreSelect}
        {honeypotField}
        <button type="submit" disabled={status === 'loading' || !consent} className="btn-caps btn-gold rounded-sm px-6 py-3 whitespace-nowrap disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
      {emailError && <p id={`${id}-email-error`} role="alert" className="text-2xs text-rose mt-2 text-center">{emailError}</p>}
      <div className="mt-3 max-w-md mx-auto">{consentCheckbox}</div>
      {status === 'error' && <p role="alert" className="text-2xs text-rose mt-3 text-center">{errorMessage}</p>}
    </div>
  );
}
