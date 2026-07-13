import { useState } from 'react';

interface EmailStripProps {
  variant?: 'light' | 'dark';
  heading?: string;
  subheading?: string;
}

// Functional UI stub — shows a success state on submit.
// // Connect: POST `email` to MailerLite or ConvertKit subscriber API here.
export default function EmailStrip({
  variant = 'light',
  heading = 'Get a free chapter — and new-release alerts',
  subheading = 'One email a month. No noise. Unsubscribe anytime.',
}: EmailStripProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // // MailerLite/ConvertKit integration goes here.
    setSubmitted(true);
  };

  const isDark = variant === 'dark';

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-ink-soft text-ivory' : 'bg-gradient-to-r from-gold-lt/30 via-gold/15 to-gold-lt/30'}`}>
      <div className="hairline-solid w-full" />
      <div className="mx-auto max-w-5xl px-6 py-14 text-center">
        <p className="eyebrow text-gold mb-3">Reader Letter</p>
        <h2 className="font-display text-2xl md:text-3xl mb-2">{heading}</h2>
        <p className={`text-sm mb-7 ${isDark ? 'text-ivory/70' : 'text-muted'}`}>{subheading}</p>

        {submitted ? (
          <div className="max-w-md mx-auto rounded-md border border-gold/40 bg-cream/80 px-6 py-6 text-ink">
            <p className="font-display text-lg">You're on the list.</p>
            <p className="text-sm text-muted mt-1">Check your inbox for the free chapter — and welcome to the reader circle.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="strip-email" className="sr-only">Email address</label>
            <input
              id="strip-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-sm border border-gold/40 bg-cream/90 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn-caps btn-gold rounded-sm px-6 py-3 whitespace-nowrap">
              Get the Chapter
            </button>
          </form>
        )}
      </div>
      <div className="hairline-solid w-full" />
    </section>
  );
}
