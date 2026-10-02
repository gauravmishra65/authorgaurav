import { Download } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import ReleaseDetails from '../components/ReleaseDetails';
import BookCover from '../components/BookCover';
import LanguageBadge from '../components/LanguageBadge';
import FormatBadge from '../components/FormatBadge';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';
import { getFeaturedBook } from '../lib/releaseStatus';
import type { BookStatus } from '../data/books';
import { AUTHOR_SHORT_BIO as shortBio, AUTHOR_MEDIUM_BIO as mediumBio, AUTHOR_LONG_BIO as longBio } from '../data/author';

const interviewTopics = [
  'Writing across genres: romance, thriller, memoir, and devotional texts under one name',
  'Founding WriteTogetherHub and building a community for new writers',
  'Making Hindi devotional texts (the Vishnu and Lalita Sahasranama) accessible to modern, younger readers',
  'The research and craft behind a techno-financial thriller (Shadow Code)',
];

// A genuine, verified press release, not a placeholder — Shadow Code (the
// English edition) is real, published, and currently sold through multiple
// real retailers (confirmed in Phase 4/6's purchase-link audit), so this
// describes an actual, current fact rather than an invented media mention.
const pressReleases = [
  {
    slug: 'the-shadow-code',
    heading: 'Shadow Code Now Available',
    body: "Gaurav Mishra's financial thriller Shadow Code is now available to readers in selected paperback and digital editions. The novel explores the intersection of money, technology and crime through a contemporary suspense story.",
  },
];

function statusLabel(status: BookStatus): string {
  if (status === 'published') return 'Published';
  if (status === 'preorder') return 'Preorder';
  return 'Coming Soon';
}

export default function Media() {
  const { data: books } = useSupabaseData(fetchBooks, []);
  // Same featured-book rule as the header and homepage hero — see
  // getFeaturedBook in lib/releaseStatus.ts — so this can't name a
  // different "current" book than the rest of the site.
  const currentRelease = books ? getFeaturedBook(books) : undefined;
  const covers = books?.filter((b) => b.imageSrc) ?? [];

  return (
    <>
      <Seo
        title="Media | Gaurav Mishra"
        description="Press resources, author biography, approved photography, book covers, and interview enquiries for Gaurav Mishra."
        path="/media"
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Press Kit</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Media &amp; Press</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Author biographies, book information, approved images and media resources for interviews, features and event coverage.
          </p>
        </div>
      </section>

      <Section id="media-kit">
        <SectionHeading eyebrow="Biography" title="Short, Medium, and Long" />
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <p className="label-caps text-gold-text mb-2">Short (1–2 sentences)</p>
            <p className="text-text/85 leading-relaxed">{shortBio}</p>
          </div>
          <div>
            <p className="label-caps text-gold-text mb-2">Medium (1 paragraph)</p>
            <p className="text-text/85 leading-relaxed">{mediumBio}</p>
          </div>
          <div>
            <p className="label-caps text-gold-text mb-2">Long</p>
            <p className="text-text/85 leading-relaxed whitespace-pre-line">{longBio}</p>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Assets" title="Photography & Book Covers" />
        <div className="max-w-3xl mx-auto grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border border-gold/20 bg-ivory p-6 text-center">
            <img src="/images/author/GM-Photo.jpg" alt="Gaurav Mishra, author portrait" width={128} height={128} loading="lazy" className="mx-auto mb-4 w-32 h-32 rounded-full object-cover object-top border border-gold/25" />
            <p className="font-display text-ink mb-1">Author Portrait</p>
            <p className="label-caps text-2xs text-muted mb-3">Web Resolution</p>
            <a
              href="/images/author/GM-Photo.jpg"
              download="gaurav-mishra-author-photo-web.jpg"
              onClick={() => trackEvent('media_kit_download', { asset: 'author-photo' })}
              className="label-caps text-2xs text-gold-text hover:text-ink transition-colors inline-flex items-center gap-1.5"
            >
              <Download size={16} /> Download Photo
            </a>
            {/* TODO_CONTENT: only a web-resolution (960×1440) author photo
             * exists today — no higher-resolution source is available to
             * offer a genuine "Print Resolution" download yet. */}
          </div>
          <div className="rounded-md border border-gold/20 bg-ivory p-6">
            <p className="font-display text-ink mb-3 text-center">Book Covers</p>
            <ul className="space-y-2.5 text-sm">
              {covers.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3">
                  <span className="text-muted">{b.title}</span>
                  <a href={b.imageSrc} download onClick={() => trackEvent('media_kit_download', { asset: b.slug })} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors inline-flex items-center gap-1 shrink-0">
                    <Download size={16} /> Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {currentRelease && (
        <section className="bg-ink bg-grain text-ivory">
          <div className="hairline-solid w-full opacity-30" />
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="eyebrow text-gold-lt mb-6 text-center">Current Release</p>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start mb-8">
              <BookCover {...currentRelease} size="sm" href={`/books/${currentRelease.slug}/`} />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-display text-2xl mb-3">{currentRelease.title}</h2>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                  <FormatBadge tone="dark">{currentRelease.genre}</FormatBadge>
                  <LanguageBadge language={currentRelease.language} tone="dark" />
                  <FormatBadge tone="dark">{statusLabel(currentRelease.status)}</FormatBadge>
                </div>
                <p className="text-ivory/75 leading-relaxed">{currentRelease.tagline}</p>
              </div>
            </div>
            <ReleaseDetails book={currentRelease} />
          </div>
        </section>
      )}

      <Section tone="cream">
        <SectionHeading eyebrow="For Journalists" title="Suggested Interview Topics" />
        <ul className="max-w-2xl mx-auto space-y-3">
          {interviewTopics.map((t) => (
            <li key={t} className="flex gap-3 text-text/85 leading-relaxed">
              <span className="text-gold-text mt-1">—</span> <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="Coverage" title="Press Releases" />
        {pressReleases.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {pressReleases.map((release) => (
              <article key={release.slug} className="rounded-md border border-gold/20 bg-ivory p-6">
                <h3 className="font-display text-xl text-ink mb-3">{release.heading}</h3>
                <p className="text-text/85 leading-relaxed">{release.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            heading="No press releases yet"
            message="Press releases will appear here as they're issued."
          />
        )}
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Coverage" title="Previous Interviews" />
        <EmptyState
          heading="No interviews published yet"
          message="Interviews and media features will be added here as they are published."
        />
      </Section>

      <Section tone="dark">
        <SectionHeading eyebrow="Get in Touch" title="Media Enquiries" tone="dark" />
        <div className="text-center">
          <PrimaryButton to="/contact/?type=media">Contact for Media or Interview</PrimaryButton>
        </div>
      </Section>
    </>
  );
}
