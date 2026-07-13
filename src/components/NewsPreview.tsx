import { Link } from 'react-router-dom';
import { news } from '../data/news';
import Divider from './Divider';

export default function NewsPreview() {
  const latest = news.slice(0, 3);
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
      <div className="text-center">
        <p className="eyebrow text-gold mb-3">News &amp; Events</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink">What's happening</h2>
        <Divider className="!my-8" />
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {latest.map((n) => (
          <Link key={n.id} to="/news" className="group flex flex-col rounded-md border border-gold/15 bg-cream overflow-hidden shadow-luxury transition-all hover:-translate-y-1 hover:shadow-book-hover">
            <div className={`h-40 bg-gradient-to-br ${n.gradient} relative`}>
              <span className="absolute bottom-3 left-3 label-caps text-2xs text-ivory/85 bg-ink/40 px-2 py-1 rounded-sm">{n.category}</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <p className="text-2xs text-muted mb-2">{n.date}</p>
              <h3 className="font-display text-lg text-ink mb-2 group-hover:text-gold transition-colors">{n.title}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{n.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/news" className="btn-caps btn-gold-outline inline-block rounded-sm px-6 py-3">See All News</Link>
      </div>
    </section>
  );
}
