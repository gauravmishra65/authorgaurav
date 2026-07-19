import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle, Quote } from 'lucide-react';
import Seo from '../components/Seo';
import BookCover from '../components/BookCover';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';
import ReleaseDetails from '../components/ReleaseDetails';
import ReleaseCountdown from '../components/ReleaseCountdown';
import SocialShareButtons from '../components/SocialShareButtons';
import TestimonialModal from '../components/TestimonialModal';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { isReleased } from '../lib/releaseStatus';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);

  if (loading) return <div className="py-32 text-center text-muted">Loading…</div>;
  if (error) return <div className="py-32 text-center text-rose">Couldn't load this book: {error}</div>;

  const book = books?.find((b) => b.slug === slug);

  if (!book) return <Navigate to="/books" replace />;

  const released = book.releaseDate ? isReleased(book.releaseDate) : false;
  const canonicalUrl = `https://authorgaurav.com/books/${book.slug}`;

  return (
    <>
      <Seo
        title={`${book.title} — Gaurav Mishra`}
        description={book.tagline || book.synopsis.slice(0, 155)}
        path={`/books/${book.slug}`}
        image={book.imageSrc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Book',
              name: book.title,
              author: { '@type': 'Person', name: 'Gaurav Mishra' },
              description: book.synopsis,
              genre: book.genre,
              inLanguage: book.language === 'Hindi' ? 'hi' : 'en',
              image: book.imageSrc ? `https://authorgaurav.com${book.imageSrc}` : undefined,
              url: canonicalUrl,
              datePublished: book.releaseDate,
              bookFormat: book.paperbackUrl ? 'https://schema.org/Paperback' : book.kindleUrl ? 'https://schema.org/EBook' : undefined,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://authorgaurav.com/' },
                { '@type': 'ListItem', position: 2, name: 'Books', item: 'https://authorgaurav.com/books' },
                { '@type': 'ListItem', position: 3, name: book.title, item: canonicalUrl },
              ],
            },
          ],
        }}
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-2">
          <Link to="/books" className="inline-flex items-center gap-1.5 label-caps text-gold-lt/80 hover:text-gold-lt transition-colors">
            <ArrowLeft size={13} /> All Books
          </Link>
        </div>
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid items-center gap-12 md:grid-cols-[240px_1fr]">
            <div className="flex flex-col items-center md:items-start gap-6">
              <BookCover {...book} size="lg" />
              <TestimonialModal book={book} className="w-full max-w-[240px]" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <p className="eyebrow text-gold-lt">{book.genre}</p>
                <span className="label-caps text-2xs text-ivory/70 border border-ivory/25 rounded-full px-2.5 py-0.5">{book.language}</span>
                {book.status === 'upcoming' && (
                  <span className="label-caps text-2xs text-gold-lt border border-gold/40 rounded-full px-2.5 py-0.5">
                    {released ? 'Now Available' : 'Coming Soon'}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-4">{book.title}</h1>
              <p className="text-ivory/80 leading-relaxed text-lg italic mb-6">{book.tagline}</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {book.buyLinks.map((link) => (
                  <a key={link.label} href={link.href} className="btn-caps btn-gold rounded-sm px-5 py-2.5 text-2xs">{link.label}</a>
                ))}
              </div>
              {book.bookWebsite && (
                <a href={book.bookWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 label-caps text-gold-lt hover:text-gold transition-colors">
                  Visit the Book Website <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-prose px-6 py-16">
        <p className="eyebrow text-gold mb-3">Synopsis</p>
        <div className="prose-literary">
          <p>{book.synopsis}</p>
        </div>
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <SocialShareButtons path={`/books/${book.slug}`} title={book.title} />
          <Link to="/books" className="inline-flex items-center gap-1.5 label-caps text-gold hover:text-ink transition-colors">
            Back to All Books <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {book.releaseDate && (
        <section className="bg-ink text-ivory">
          <div className="hairline-solid w-full opacity-30" />
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="eyebrow text-gold mb-6 text-center">Release Details</p>
            <ReleaseDetails book={book} className="mb-12" />
            {!released && (
              <>
                <p className="eyebrow text-gold mb-6 text-center">The Code Will Be Revealed In</p>
                <ReleaseCountdown releaseDate={book.releaseDate} />
              </>
            )}
          </div>
        </section>
      )}

      {book.testimonials && book.testimonials.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="eyebrow text-gold mb-3 text-center">What Readers Say</p>
            <Divider className="!my-6" />
            <div className="grid gap-6 md:grid-cols-2">
              {book.testimonials.map((t, i) => (
                <figure key={i} className="rounded-md border border-gold/20 bg-ivory p-7 shadow-luxury">
                  <Quote className="text-gold/50 mb-3" size={20} aria-hidden="true" />
                  <blockquote className="text-text/85 leading-relaxed italic mb-4">"{t.quote}"</blockquote>
                  <figcaption className="text-2xs label-caps text-muted">{t.name}{t.source ? ` · ${t.source}` : ''}</figcaption>
                  {t.authorReply && (
                    <div className="border-l-2 border-gold/40 pl-4 mt-4">
                      <p className="label-caps text-2xs text-gold mb-1.5 inline-flex items-center gap-1.5">
                        <MessageCircle size={12} aria-hidden="true" /> Gaurav Replied
                      </p>
                      <p className="text-sm text-text/80 leading-relaxed">{t.authorReply}</p>
                    </div>
                  )}
                </figure>
              ))}
            </div>
            <p className="text-center mt-10">
              <Link to="/testimonials" className="label-caps text-gold hover:text-ink transition-colors">Share Your Own Feedback</Link>
            </p>
          </div>
        </section>
      )}

      <EmailStrip
        heading={`Get a free chapter of ${book.title}`}
        subheading="One email a month. No noise. Unsubscribe anytime."
      />
    </>
  );
}
