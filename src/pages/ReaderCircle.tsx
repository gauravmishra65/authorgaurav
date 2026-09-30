import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import NewsletterForm from '../components/NewsletterForm';
import { trackEvent } from '../lib/analytics';

const segments = [
  { label: 'Thrillers', body: 'Shadow Code, The Zero Account, and what comes next in the Gaurav Mishra series.' },
  { label: 'Romance', body: 'Offbeat Love, Anootha Pyar, and future contemporary fiction.' },
  { label: 'Spiritual books', body: 'The Vishnu and Lalita Sahasranama, and devotional reading updates.' },
  { label: 'Writing resources', body: 'WriteTogetherHub news, craft notes, and resources for writers.' },
  { label: 'All updates', body: 'Everything above, in one letter.' },
];

export default function ReaderCircle() {
  const navigate = useNavigate();

  useEffect(() => { trackEvent('reader_circle_view'); }, []);

  return (
    <>
      <Seo
        title="Reader Circle | Gaurav Mishra"
        description="Join the Reader Circle for new-release alerts, behind-the-book notes, and occasional reader-only extras from Gaurav Mishra. One email a month, no noise."
        path="/reader-circle"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Reader Circle</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Stay With the Stories You Love</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            One email a month: new releases, behind-the-book notes, and the occasional reader-only extra. No noise, and you choose what you hear about.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="eyebrow text-gold-text mb-3 text-center">What You Choose</p>
        <Divider className="!mb-10" />
        <div className="grid gap-6 sm:grid-cols-2">
          {segments.map((s) => (
            <div key={s.label} className="rounded-md border border-gold/20 bg-ivory p-6">
              <p className="label-caps text-gold-text text-2xs mb-2">{s.label}</p>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="text-2xs text-muted text-center mt-6 max-w-lg mx-auto">
          Pick one below, or choose "All updates" for everything in one letter. You can change your mind anytime — every email has an unsubscribe link.
        </p>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <Divider className="!mb-10" />
          <div className="inline-flex items-center gap-2 label-caps text-2xs text-gold-text mb-6">
            <Mail size={14} aria-hidden="true" /> One email a month. No noise. Unsubscribe anytime.
          </div>
          <NewsletterForm
            id="reader-circle-signup"
            buttonLabel="Join the Reader Circle"
            source="reader-circle"
            showGenrePreference
            onSuccess={(genrePreference) => {
              const params = genrePreference ? `?interest=${encodeURIComponent(genrePreference)}` : '';
              navigate(`/reader-circle/welcome${params}`);
            }}
          />
        </div>
      </section>
    </>
  );
}
