import { useState } from 'react';
import Seo from '../components/Seo';
import EmailStrip from '../components/EmailStrip';
import Divider from '../components/Divider';
import { news, newsCategories, type NewsCategory } from '../data/news';

export default function News() {
  const [filter, setFilter] = useState<(typeof newsCategories)[number]>('All');
  const filtered = filter === 'All' ? news : news.filter((n) => n.category === (filter as NewsCategory));

  return (
    <>
      <Seo
        title="News & Events — Gaurav Mishra"
        description="Book releases, appearances, and announcements from author Gaurav Mishra — plus updates from WriteTogetherHub."
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Latest</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">News &amp; Events</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Releases, appearances, and announcements — from new books to WriteTogetherHub updates.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {newsCategories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`label-caps px-4 py-2 rounded-full border transition-all ${filter === c ? 'bg-ink text-gold-lt border-gold' : 'bg-cream text-text/70 border-gold/25 hover:border-gold/60 hover:text-ink'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-16">
          {filtered.map((n) => (
            <article key={n.id} className="group flex flex-col rounded-md border border-gold/15 bg-cream overflow-hidden shadow-luxury transition-all hover:-translate-y-1 hover:shadow-book-hover">
              <div className={`h-44 bg-gradient-to-br ${n.gradient} relative`}>
                <span className="absolute bottom-3 left-3 label-caps text-2xs text-ivory/90 bg-ink/40 px-2.5 py-1 rounded-sm">{n.category}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-2xs text-muted mb-2">{n.date}</p>
                <h2 className="font-display text-xl text-ink mb-2 group-hover:text-gold transition-colors">{n.title}</h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
        <Divider />
      </section>

      <EmailStrip
        heading="Never miss a release or an event"
        subheading="One letter a month with news, appearances, and early word on what's next."
      />
    </>
  );
}
