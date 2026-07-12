import { Users, BookOpen, Rocket } from 'lucide-react';
import Divider from './Divider';

const benefits = [
  {
    icon: BookOpen,
    title: 'Learn the craft',
    body: 'Guided lessons on structure, character, voice, and revision — the things I wish I’d known on day one.',
  },
  {
    icon: Users,
    title: 'Find your people',
    body: 'A community of writers and newcomers learning together, sharing pages, and keeping each other moving.',
  },
  {
    icon: Rocket,
    title: 'Get published',
    body: 'Practical paths from finished manuscript to reader — publishing, self-publishing, and everything between.',
  },
];

export default function WriteTogetherHub() {
  return (
    <section
      id="write-together-hub"
      className="relative bg-ink text-ivory paper-grain overflow-hidden"
    >
      <div className="hairline-solid w-full opacity-30" />
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1.5 label-caps text-gold-lt">
            A Home for Writers
          </span>
          <h2 className="font-display text-3xl md:text-5xl mt-5 mb-4">
            WriteTogetherHub
          </h2>
          <p className="max-w-2xl mx-auto text-ivory/80 leading-relaxed">
            I built WriteTogetherHub to give writers and newcomers what I wished I’d
            had starting out — guidance, community, and a place to grow their craft
            together.
          </p>
          <a
            href="https://writetogetherhub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-caps btn-gold mt-7 inline-block rounded-sm px-6 py-3"
          >
            Visit WriteTogetherHub
          </a>
        </div>

        <Divider className="!my-12 opacity-60" />

        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-md border border-gold/20 bg-ink-soft/60 p-7 text-center transition-colors hover:border-gold/50"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold-lt">
                <b.icon size={22} />
              </div>
              <h3 className="font-display text-xl mb-2">{b.title}</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
