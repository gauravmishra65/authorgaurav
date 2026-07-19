import { pressQuotes } from '../data/press';

export default function PressStrip() {
  return (
    <section className="bg-ink-soft bg-grain text-ivory/80">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          {pressQuotes.map((p, i) => (
            <p key={i} className="text-sm italic">
              "{p.quote}" <span className="not-italic label-caps text-2xs text-gold-lt/80">— {p.source}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
