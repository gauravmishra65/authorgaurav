import NewsletterForm from './NewsletterForm';

interface EmailStripProps {
  variant?: 'light' | 'dark';
  heading?: string;
  subheading?: string;
}

export default function EmailStrip({
  variant = 'light',
  heading = 'Get a free chapter — and new-release alerts',
  subheading = 'One email a month. No noise. Unsubscribe anytime.',
}: EmailStripProps) {
  const isDark = variant === 'dark';

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-ink-soft text-ivory' : 'bg-gradient-to-r from-gold-lt/30 via-gold/15 to-gold-lt/30'}`}>
      <div className="hairline-solid w-full" />
      <div className="mx-auto max-w-5xl px-6 py-14 text-center">
        <p className="eyebrow text-gold mb-3">Reader Letter</p>
        <h2 className="font-display text-2xl md:text-3xl mb-2">{heading}</h2>
        <p className={`text-sm mb-7 ${isDark ? 'text-ivory/70' : 'text-muted'}`}>{subheading}</p>

        <NewsletterForm id="strip-email" buttonLabel="Get the Chapter" />
      </div>
      <div className="hairline-solid w-full" />
    </section>
  );
}
