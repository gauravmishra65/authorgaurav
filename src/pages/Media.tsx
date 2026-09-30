import { Download } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import ReleaseDetails from '../components/ReleaseDetails';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';
import { AUTHOR_SHORT_BIO as shortBio, AUTHOR_MEDIUM_BIO as mediumBio, AUTHOR_LONG_BIO as longBio } from '../data/author';

const interviewTopics = [
  'Writing across genres: romance, thriller, memoir, and devotional texts under one name',
  'Founding WriteTogetherHub and building a community for new writers',
  'Making Hindi devotional texts (the Vishnu and Lalita Sahasranama) accessible to modern, younger readers',
  'The research and craft behind a techno-financial thriller (Shadow Code)',
];

export default function Media() {
  const { data: books } = useSupabaseData(fetchBooks, []);
  const currentRelease = books?.find((b) => b.slug === 'the-shadow-code');
  const covers = books?.filter((b) => b.imageSrc) ?? [];

  return (
    <>
      <Seo
        title="Media | Gaurav Mishra"
        description="Press resources, author biography, approved photography, book covers, and interview enquiries for Gaurav Mishra."
        path="/media"
      />

      <Section tone="dark">
        <SectionHeading eyebrow="For Press & Media" title="Media" tone="dark" level="h1" />
      </Section>

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
            <p className="font-display text-ink mb-3">Author Portrait</p>
            <a href="/images/author/GM-Photo.jpg" download onClick={() => trackEvent('media_kit_download', { asset: 'author-photo' })} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors inline-flex items-center gap-1.5">
              <Download size={13} /> Download Photo
            </a>
          </div>
          <div className="rounded-md border border-gold/20 bg-ivory p-6">
            <p className="font-display text-ink mb-3 text-center">Book Covers</p>
            <ul className="space-y-2.5 text-sm">
              {covers.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3">
                  <span className="text-muted">{b.title}</span>
                  <a href={b.imageSrc} download onClick={() => trackEvent('media_kit_download', { asset: b.slug })} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors inline-flex items-center gap-1 shrink-0">
                    <Download size={12} /> Download
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
            <h2 className="font-display text-2xl text-center mb-6">{currentRelease.title}</h2>
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
        <EmptyState
          heading="No press releases yet"
          message="Press releases will appear here as they're issued."
        />
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Coverage" title="Previous Interviews" />
        <EmptyState
          heading="No interviews published yet"
          message="Previous interviews and features will be listed here as they become available."
        />
      </Section>

      <Section tone="dark">
        <SectionHeading eyebrow="Get in Touch" title="Media Enquiries" tone="dark" />
        <div className="text-center">
          <PrimaryButton to="/contact?type=media">Contact for Media or Interview</PrimaryButton>
        </div>
      </Section>
    </>
  );
}
