import { Link } from 'react-router-dom';
import { Download, MessageSquareQuote } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';
import EmailStrip from '../components/EmailStrip';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { trackEvent } from '../lib/analytics';

export default function Readers() {
  const { data: books } = useSupabaseData(fetchBooks, []);
  const withRealRetailer = books?.filter((b) => b.buyLinks.some((l) => l.href && l.href !== '#')) ?? [];

  return (
    <>
      <Seo
        title="Readers | Gaurav Mishra"
        description="A hub for readers of Gaurav Mishra's books: the Reader Circle newsletter, reading guides, and review links."
        path="/readers"
      />

      <Section tone="dark">
        <SectionHeading eyebrow="A Home for Readers" title="Readers" tone="dark" level="h1" />
      </Section>

      <EmailStrip
        heading="Join the Reader Circle"
        subheading="New-release alerts, sample chapters when they're available, and occasional writing notes. One email a month."
      />

      <Section tone="cream">
        <SectionHeading eyebrow="Read Before You Buy" title="Sample Chapters & Summaries" />
        {books && books.length > 0 ? (
          <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <div key={b.id} className="flex flex-col rounded-md border border-gold/20 bg-ivory p-6 text-center">
                <p className="font-display text-lg text-ink mb-2">{b.title}</p>
                <p className="flex-1 text-sm text-muted leading-relaxed line-clamp-5 mb-4">{b.synopsis}</p>
                <div className="flex flex-col items-center gap-2">
                  {b.sampleUrl && (
                    <SecondaryButton href={b.sampleUrl} external size="sm" onClick={() => trackEvent('sample_download', { book: b.slug })}>
                      <Download size={13} /> Read a Sample
                    </SecondaryButton>
                  )}
                  <Link to={`/books/${b.slug}`} className="label-caps text-2xs text-gold-text hover:text-ink transition-colors underline underline-offset-2">
                    View Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            heading="No sample chapters available yet"
            message="Sample chapters will appear here as they're released for individual books. Join the Reader Circle to be notified."
          />
        )}
      </Section>

      <Section>
        <SectionHeading eyebrow="Go Deeper" title="Reading Guides & Resources" />
        <div className="max-w-2xl mx-auto grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border border-gold/20 bg-cream p-6 text-center">
            <p className="font-display text-lg text-ink mb-2">Offbeat Love Discussion Guide</p>
            <p className="text-sm text-muted leading-relaxed mb-5">A worked example of reading-group questions. More guides are added on request via Book Clubs.</p>
            <SecondaryButton href="/resources/book-club-questions-offbeat-love.txt" size="sm" onClick={() => trackEvent('discussion_guide_download', { book: 'offbeat-love' })}>
              <Download size={13} /> Download
            </SecondaryButton>
          </div>
          <div className="rounded-md border border-gold/20 bg-cream p-6 text-center">
            <p className="font-display text-lg text-ink mb-2">New to the Books?</p>
            <p className="text-sm text-muted leading-relaxed mb-5">Not sure where to start? Get a personal recommendation based on what you like to read.</p>
            <SecondaryButton to="/start-here" size="sm">Start Here</SecondaryButton>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="What Readers Say" title="Reviews & Retailer Links" />
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted mb-8">Read what other readers think, or leave a review of your own on the platform where you bought the book.</p>
          <PrimaryButton to="/testimonials" size="sm" className="mb-8">
            <MessageSquareQuote size={15} /> Reader Testimonials
          </PrimaryButton>
          {withRealRetailer.length > 0 && (
            <ul className="space-y-2.5 text-sm">
              {withRealRetailer.map((b) => {
                const link = b.buyLinks.find((l) => l.href && l.href !== '#')!;
                return (
                  <li key={b.id}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-gold-text transition-colors">
                      Review <em>{b.title}</em> on {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>
    </>
  );
}
