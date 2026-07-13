import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Rocket, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';

const benefits = [
  { icon: BookOpen, title: 'Learn the craft', body: 'Guided lessons on structure, character, voice, and revision — the things I wish I had known on day one.' },
  { icon: Users, title: 'Find your people', body: 'A community of writers and newcomers learning together, sharing pages, and keeping each other moving.' },
  { icon: Rocket, title: 'Get published', body: 'Practical paths from finished manuscript to reader — publishing, self-publishing, and everything between.' },
];

export default function WriteTogetherHubPage() {
  return (
    <>
      <Seo
        title="WriteTogetherHub — A Home for Writers, Founded by Gaurav Mishra"
        description="WriteTogetherHub gives writers and newcomers the guidance, community, and encouragement to grow their craft and get published. Founded by author Gaurav Mishra."
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1.5 label-caps text-gold-lt mb-5">A Home for Writers</span>
          <h1 className="font-display text-4xl md:text-6xl mb-5">WriteTogetherHub</h1>
          <p className="text-ivory/80 max-w-2xl mx-auto leading-relaxed mb-8">
            I built WriteTogetherHub to give writers and newcomers what I wished I had had starting out — guidance, community, and a place to grow their craft together.
          </p>
          <a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
            Visit WriteTogetherHub <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="eyebrow text-gold mb-3">Why It Exists</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Three things a writer needs</h2>
          <Divider className="!my-8" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-md border border-gold/20 bg-cream p-7 text-center shadow-luxury transition-all hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                <b.icon size={22} />
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{b.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-prose px-6 py-16">
          <p className="eyebrow text-gold mb-3 text-center">A Note from the Founder</p>
          <Divider className="!my-6" />
          <p className="text-text/85 leading-relaxed text-center">
            I remember what it felt like to start out — the uncertainty, the isolation, the gap between what I could imagine and what I could put on the page. WriteTogetherHub exists to close that gap, for the writer I was and the writers I hope to meet.
          </p>
        </div>
      </section>

      <EmailStrip heading="Join the writer's letter" subheading="Craft notes, community updates, and early calls to join WriteTogetherHub." />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">Ready to grow your craft?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://writetogetherhub.com" target="_blank" rel="noopener noreferrer" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
            Visit WriteTogetherHub <ArrowRight size={15} />
          </a>
          <Link to="/contact" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3">
            <Mail size={15} /> Contact Gaurav
          </Link>
        </div>
      </section>
    </>
  );
}
