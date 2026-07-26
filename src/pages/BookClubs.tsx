import { Download, Video, Users2, Package } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { trackEvent } from '../lib/analytics';
import { offbeatLoveBookClubQuestions as offbeatLoveQuestions } from '../data/bookClubQuestions';

const appearanceOptions = [
  {
    icon: Video,
    title: 'Virtual Appearance',
    body: 'Request a video call with your book club — a short Q&A or discussion, scheduled around your meeting.',
    type: 'book-club',
  },
  {
    icon: Users2,
    title: 'In-Person Appearance',
    body: 'Request an in-person visit for your club, based on location and availability.',
    type: 'book-club',
  },
  {
    icon: Package,
    title: 'Group Order Enquiry',
    body: 'Ordering copies for your whole club? Send the details and I\'ll help however I can.',
    type: 'book-club',
  },
];

export default function BookClubs() {
  return (
    <>
      <Seo
        title="Book Clubs — Gaurav Mishra"
        description="Discussion guides, appearance requests, and group-order enquiries for book clubs reading Gaurav Mishra's novels."
        path="/book-clubs"
      />

      <Section tone="dark">
        <SectionHeading eyebrow="For Book Clubs" title="Reading Together" tone="dark" level="h1" />
        <p className="text-ivory/75 max-w-2xl mx-auto text-center leading-relaxed">
          Discussion guides, appearance requests, and group-order help for clubs reading any of the books.
        </p>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Discussion Guides" title="Start With a Worked Example" />
        <div className="max-w-2xl mx-auto">
          <p className="text-muted text-center mb-8">
            Here's the discussion guide already written for <em>Offbeat Love</em> — a model for the kind of questions available for other books on request.
          </p>
          <div className="space-y-4 mb-8">
            {offbeatLoveQuestions.map((q, i) => (
              <div key={q} className="flex gap-4 rounded-md border border-gold/20 bg-ivory p-5">
                <span className="label-caps text-gold-text shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-text/85 leading-relaxed text-sm">{q}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <SecondaryButton href="/resources/book-club-questions-offbeat-love.txt" onClick={() => trackEvent('discussion_guide_download', { book: 'offbeat-love' })}>
              <Download size={15} /> Download These Questions
            </SecondaryButton>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Requests" title="Bring the Author to Your Club" />
        <p className="text-muted max-w-2xl mx-auto text-center mb-10 -mt-4">
          These are requests, not guarantees — every appearance depends on schedule and location, and isn't offered free by default.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {appearanceOptions.map((opt) => (
            <div key={opt.title} className="rounded-md border border-gold/20 bg-cream p-7 text-center">
              <opt.icon className="mx-auto mb-3 text-gold-text" size={26} aria-hidden="true" />
              <h3 className="font-display text-lg text-ink mb-2">{opt.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">{opt.body}</p>
              <PrimaryButton to={`/contact?type=${opt.type}`} size="sm">Send a Request</PrimaryButton>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
