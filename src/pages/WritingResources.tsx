import { Download } from 'lucide-react';
import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import WriteTogetherHub from '../components/WriteTogetherHub';

const guidance = [
  {
    title: 'Manuscript Formatting',
    body: 'Standard font, spacing, and title-page conventions before you submit to an agent or publisher.',
    file: '/resources/manuscript-formatting-checklist.txt',
  },
  {
    title: 'Self-Editing',
    body: 'A structural and line-level pass to run before you call a manuscript finished.',
    file: '/resources/self-editing-checklist.txt',
  },
];

export default function WritingResources() {
  return (
    <>
      <Seo
        title="Writing Resources | Gaurav Mishra"
        description="Practical checklists for new writers on manuscript formatting and self-editing, plus a link to WriteTogetherHub for deeper guidance."
        path="/writing-resources"
      />

      <Section tone="cream">
        <SectionHeading eyebrow="For New Writers" title="Writing Resources" level="h1" />
        <p className="text-muted max-w-xl mx-auto text-center leading-relaxed">
          A couple of practical checklists to start with. For real depth (courses, community, and guided feedback) that's what WriteTogetherHub is for.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {guidance.map((g) => (
            <div key={g.title} className="rounded-md border border-gold/20 bg-cream p-7">
              <h2 className="font-display text-lg text-ink mb-2">{g.title}</h2>
              <p className="text-sm text-muted leading-relaxed mb-5">{g.body}</p>
              <SecondaryButton href={g.file} size="sm">
                <Download size={14} /> Download Checklist
              </SecondaryButton>
            </div>
          ))}
        </div>
        <p className="text-muted text-sm max-w-2xl mx-auto text-center mt-10 leading-relaxed">
          Beyond formatting and editing, questions about self-publishing versus traditional publishing, querying agents, or building a writing habit are exactly what WriteTogetherHub's guided sessions and community cover in depth.
        </p>
      </Section>

      <WriteTogetherHub />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink mb-6">Here for the writing craft, but the stories are the main event.</h2>
        <PrimaryButton to="/books">Explore the Books</PrimaryButton>
      </section>
    </>
  );
}
