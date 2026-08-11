import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import BookFilters from '../components/BookFilters';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { interviewExternalResources, interviewBookTools } from '../data/interviewResources';
import { getVerifiedSocialLinks } from '../data/social';
import { canonicalUrl } from '../lib/url';
import { trackEvent } from '../lib/analytics';

const BOOK_PATH = '/books/interview-guide';
const BOOK_TITLE = 'The Complete Interview Success Guide - 2026 Edition';

const categoryOptions = ['All Resources', ...new Set(interviewExternalResources.map((r) => r.category))] as const;

function buildJsonLd() {
  const pageUrl = canonicalUrl('/interview-resources');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Interview Resources & Tools | The Complete Interview Success Guide | Gaurav Mishra',
        description: 'Official references, STAR-R tools, interview worksheets, hiring resources and updated links for readers of The Complete Interview Success Guide by Gaurav Mishra.',
        url: pageUrl,
      },
      {
        '@type': 'Person',
        name: 'Gaurav Mishra',
        url: canonicalUrl('/about'),
        sameAs: getVerifiedSocialLinks().map((s) => s.href),
      },
      {
        '@type': 'Book',
        name: BOOK_TITLE,
        url: canonicalUrl(BOOK_PATH),
        author: { '@type': 'Person', name: 'Gaurav Mishra' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Interview Resources', item: pageUrl },
        ],
      },
    ],
  };
}

function ResourceCard({ resource }: { resource: (typeof interviewExternalResources)[number] }) {
  return (
    <div className="rounded-md border border-gold/20 bg-ivory p-6 flex flex-col">
      <span className="label-caps text-2xs border border-gold/30 text-gold-text rounded-full px-3 py-1 self-start mb-4">{resource.category}</span>
      <p className="label-caps text-2xs text-muted mb-1">{resource.organization}</p>
      <h3 className="font-display text-lg text-ink mb-2">{resource.title}</h3>
      <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{resource.description}</p>
      <SecondaryButton
        href={resource.url}
        external
        size="sm"
        onClick={() => trackEvent('interview_resource_click', { organization: resource.organization, title: resource.title })}
      >
        {resource.buttonLabel} <ArrowUpRight size={14} />
      </SecondaryButton>
      {resource.note && <p className="text-2xs text-muted mt-4 leading-relaxed border-t border-gold/15 pt-3">{resource.note}</p>}
    </div>
  );
}

export default function InterviewResources() {
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>('All Resources');
  const filtered = category === 'All Resources' ? interviewExternalResources : interviewExternalResources.filter((r) => r.category === category);

  return (
    <>
      <Seo
        title="Interview Resources & Tools | The Complete Interview Success Guide | Gaurav Mishra"
        description="Official references, STAR-R tools, interview worksheets, hiring resources and updated links for readers of The Complete Interview Success Guide by Gaurav Mishra."
        path="/interview-resources"
        jsonLd={buildJsonLd()}
      />

      <Section tone="dark">
        <SectionHeading eyebrow="For Readers" title="Interview Resources & Tools" level="h1" />
        <p className="text-ivory/75 max-w-2xl mx-auto text-center leading-relaxed">
          Official references and practical worksheets that support {BOOK_TITLE}.
        </p>
      </Section>

      <Section tone="cream" containerSize="narrow">
        <p className="label-caps text-gold-text mb-3 text-center">A Note on This Page</p>
        <h2 className="font-display text-2xl text-ink text-center mb-5">Why are the full links online?</h2>
        <p className="text-text/85 leading-relaxed text-center">
          The print edition of {BOOK_TITLE} uses concise references to keep the book clean and easy to read.
          Because websites and resource addresses can change, the current official links are maintained on this page.
          This lets readers reach updated resources without needing a new edition of the book whenever an external
          organization changes its website.
        </p>
      </Section>

      <Section>
        <SectionHeading eyebrow="Official Sources" title="Trusted References & Further Reading" />
        <p className="text-muted max-w-2xl mx-auto text-center -mt-4 mb-10">
          These references support topics covered in {BOOK_TITLE}.
        </p>

        <div className="flex justify-center mb-10">
          <BookFilters label="Filter by category" options={categoryOptions} value={category} onChange={setCategory} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.url} resource={resource} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-14 pt-8 border-t border-gold/15">
          <p className="text-sm text-muted">Reference links last reviewed: August 2026</p>
          <p className="text-2xs text-muted mt-2 leading-relaxed">
            External websites are maintained by their respective organizations. Links and content may change over
            time. For the latest resource list connected with {BOOK_TITLE}, return to{' '}
            <a href="https://authorgaurav.com/interview-resources" className="text-gold-text underline hover:text-ink transition-colors">authorgaurav.com/interview-resources</a>.
          </p>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="From the Book" title={`Tools from ${BOOK_TITLE}`} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interviewBookTools.map((tool) => (
            <div key={tool.title} className="rounded-md border border-gold/20 bg-ivory p-6 flex flex-col">
              <h3 className="font-display text-lg text-ink mb-3">{tool.title}</h3>
              {tool.points.length > 0 && (
                <ul className="text-sm text-muted leading-relaxed flex-1 mb-5 list-disc pl-5 space-y-1">
                  {tool.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              )}
              {tool.points.length === 0 && <div className="flex-1 mb-5" />}
              {tool.fileUrl ? (
                <SecondaryButton href={tool.fileUrl} size="sm">{tool.buttonLabel}</SecondaryButton>
              ) : (
                <span className="label-caps text-2xs border border-gold/30 text-muted rounded-full px-3.5 py-1.5 self-start">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading eyebrow="The Full System" title="Want the Complete Interview Preparation System?" tone="dark" />
        <p className="text-ivory/75 max-w-2xl mx-auto text-center leading-relaxed mb-8">
          {BOOK_TITLE} brings these resources together into one practical system covering preparation, answer
          frameworks, difficult questions, technical interviews, leadership interviews, salary discussions, and
          interview-day worksheets.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <PrimaryButton to={BOOK_PATH}>Explore the Book</PrimaryButton>
          <Link to={BOOK_PATH} className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3" style={{ color: 'var(--gold-lt)' }}>
            Buy the Book
          </Link>
        </div>
      </Section>
    </>
  );
}
