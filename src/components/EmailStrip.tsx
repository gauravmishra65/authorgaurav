import NewsletterForm from './NewsletterForm';

interface EmailStripProps {
  variant?: 'light' | 'dark';
  heading?: string;
  subheading?: string;
  /** Shows the genre/interest-preference select in the embedded NewsletterForm. */
  showGenrePreference?: boolean;
  /** Unique id, only needed when more than one EmailStrip could render on the same page. */
  id?: string;
  /** Where this form appears, stored alongside the subscriber for reference. */
  source?: string;
}

export default function EmailStrip({
  variant = 'light',
  heading = 'Get a free chapter — and new-release alerts',
  subheading = 'One email a month. No noise. Unsubscribe anytime.',
  showGenrePreference = false,
  id = 'strip-email',
  source = 'email-strip',
}: EmailStripProps) {
  const isDark = variant === 'dark';

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-ink-soft bg-grain text-ivory' : 'bg-gradient-to-r from-gold-lt/30 via-gold/15 to-gold-lt/30'}`}>
      <div className="hairline-solid w-full" />
      <div className="mx-auto max-w-5xl px-6 py-14 text-center">
        <p className="eyebrow text-gold-text mb-3">Reader Letter</p>
        <h2 className="font-display text-2xl md:text-3xl mb-2">{heading}</h2>
        <p className={`text-sm mb-7 ${isDark ? 'text-ivory/70' : 'text-muted'}`}>{subheading}</p>

        <NewsletterForm id={id} buttonLabel="Get the Chapter" source={source} showGenrePreference={showGenrePreference} />
      </div>
    </section>
  );
}
