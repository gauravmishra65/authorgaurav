import { useSearchParams, Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import { getReaderMagnet } from '../data/readerMagnets';
import { getVerifiedSocialLinks } from '../data/social';
import { trackEvent } from '../lib/analytics';

// Only the two interests with one obvious, unambiguous real book — Spiritual
// books has two real candidates (Vishnu and Lalita Sahasranama) with no
// honest way to pick one over the other, so that case (and Writing
// resources/All updates, which aren't about a single book at all) falls
// through to the generic "Explore the Books" link instead of guessing.
//
// `sampleUrl` is only set where a real, verified chapter excerpt exists to
// link to — confirmed by visiting the site directly. Offbeat Love's own
// site has a real "Read Chapter 1" page; Shadow Code's site only has a
// marketing synopsis, no actual book prose, so it has no sampleUrl here.
const interestToBook: Record<string, { slug: string; title: string; sampleUrl?: string }> = {
  Thrillers: { slug: 'the-shadow-code', title: 'Shadow Code' },
  Romance: { slug: 'offbeat-love', title: 'Offbeat Love', sampleUrl: 'https://off-beat-love.com/preview' },
};

export default function ReaderCircleWelcome() {
  const [searchParams] = useSearchParams();
  const interest = searchParams.get('interest') ?? '';
  const magnet = getReaderMagnet(interest);
  const relevantBook = interestToBook[interest];
  const socialLink = getVerifiedSocialLinks()[0];

  return (
    <>
      <Seo
        title="You're In | Reader Circle | Gaurav Mishra"
        description="Confirmation page for new Reader Circle subscribers."
        path="/reader-circle/welcome"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Welcome</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">You're In the Reader Circle</h1>
          <p className="text-ivory/75 max-w-xl mx-auto leading-relaxed">
            You are now part of the Reader Circle. New-book news and occasional reading notes will arrive by email — no noise, unsubscribe anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <Divider className="mb-10!" />

        {relevantBook && (
          <div className="mb-10">
            <p className="label-caps text-gold-text text-2xs mb-2">While You Wait</p>
            <h2 className="font-display text-xl text-ink mb-3">Explore {relevantBook.title}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relevantBook.sampleUrl && (
                <a
                  href={relevantBook.sampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('reader_circle_welcome_click', { type: 'sample', label: relevantBook.slug })}
                  className="btn-caps btn-gold inline-block rounded-xs px-5 py-2.5 text-2xs"
                >
                  Read a Sample from {relevantBook.title}
                </a>
              )}
              <Link
                to={`/books/${relevantBook.slug}`}
                onClick={() => trackEvent('reader_circle_welcome_click', { type: 'book', label: relevantBook.slug })}
                className="btn-caps btn-gold-outline inline-block rounded-xs px-5 py-2.5 text-2xs"
              >
                View the Book
              </Link>
            </div>
          </div>
        )}
        {!relevantBook && (
          <div className="mb-10">
            <p className="label-caps text-gold-text text-2xs mb-2">While You Wait</p>
            <h2 className="font-display text-xl text-ink mb-3">Explore the Catalog</h2>
            <Link
              to="/books"
              onClick={() => trackEvent('reader_circle_welcome_click', { type: 'book', label: 'all-books' })}
              className="btn-caps btn-gold-outline inline-block rounded-xs px-5 py-2.5 text-2xs"
            >
              See All Books
            </Link>
          </div>
        )}

        {magnet?.fileUrl && (
          <div className="mb-10">
            <p className="label-caps text-gold-text text-2xs mb-2">A Little Extra</p>
            <a
              href={magnet.fileUrl}
              download
              onClick={() => trackEvent('reader_circle_welcome_click', { type: 'resource', label: magnet.label })}
              className="inline-flex items-center gap-1.5 label-caps text-2xs text-gold-text hover:text-ink transition-colors"
            >
              <Download size={14} /> Download your {magnet.label}
            </a>
          </div>
        )}

        <div className="mb-10">
          <p className="label-caps text-gold-text text-2xs mb-2">Read More</p>
          <Link
            to="/blog"
            onClick={() => trackEvent('reader_circle_welcome_click', { type: 'journal', label: 'journal' })}
            className="btn-caps btn-gold-outline inline-block rounded-xs px-5 py-2.5 text-2xs"
          >
            Visit the Journal
          </Link>
        </div>

        {socialLink && (
          <div>
            <p className="label-caps text-gold-text text-2xs mb-2">Stay Close</p>
            <a
              href={socialLink.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('reader_circle_welcome_click', { type: 'social', label: socialLink.label })}
              className="btn-caps btn-gold-outline inline-block rounded-xs px-5 py-2.5 text-2xs"
            >
              Follow on {socialLink.label}
            </a>
          </div>
        )}
      </section>
    </>
  );
}
