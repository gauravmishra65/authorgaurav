import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, FileText } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';
import BookCard from '../components/BookCard';
import { fetchBooks } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';

// One representative title per genre this genuinely spans — matches the
// four books already named in the biography prose below, not a new claim.
const selectedSlugs = ['the-shadow-code', 'offbeat-love', 'journey-of-grace', 'vishnu-sahasranama'];

export default function About() {
  const [imgError, setImgError] = useState(false);
  const { data: books } = useSupabaseData(fetchBooks, []);
  const selectedBooks = books?.filter((b) => selectedSlugs.includes(b.slug)) ?? [];
  const genres = books ? [...new Set(books.flatMap((b) => b.categories ?? [b.genre]))] : [];

  return (
    <>
      <Seo
        title="About Gaurav Mishra: A Writer Who Refuses to Stay in One Lane"
        description="Gaurav Mishra writes across romance, thriller, memoir, and devotion, all united by the belief that a good story can carry a reader anywhere. He's also the founder of WriteTogetherHub."
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-[280px_1fr]">
            <div className="mx-auto">
              <div className="aspect-[3/4] w-[260px] rounded-md border border-gold/25 shadow-book overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-[#16243a]">
                {!imgError ? (
                  <img
                    src="/images/author/GM-Photo.jpg"
                    alt="Gaurav Mishra, author portrait"
                    width={960}
                    height={1440}
                    // @ts-expect-error React 18 only applies the lowercase DOM attribute; camelCase fetchPriority isn't wired to it until React 19
                    fetchpriority="high"
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center px-6">
                    <div>
                      <div className="mx-auto mb-3 w-16 hairline-solid opacity-60" />
                      <p className="label-caps text-gold-lt/80">Gaurav Mishra</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="eyebrow text-gold-lt mb-4">About the Author</p>
              <h1 className="font-display text-4xl md:text-5xl mb-5">Gaurav Mishra</h1>
              <p className="text-ivory/80 leading-relaxed text-lg">
                A writer who refuses to stay in one lane: romance, thriller, memoir, devotion, all united by the belief that a good story can carry a reader anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-prose px-6 py-20">
        <div className="prose-literary">
          <p>I didn't set out to write across genres. I set out to follow curiosity, and curiosity, it turns out, doesn't stay in one lane.</p>
          <p>
            It led me to <em>Offbeat Love</em>, a romance about two people from different worlds who find one shared melody in the noise of Mumbai. It led me to <em>Shadow Code</em>, a thriller about the truths that hide inside algorithms and the people willing to chase them. It led me to <em>A Journey of Grace</em>, a travel memoir about faith, the road, and the quiet conversations that change us when we're paying attention.
          </p>
          <p>
            And it led me back, again and again, to the devotional texts I grew up with. The Vishnu Sahasranama. The Lalita Sahasranama. Not as rituals to perform, but as living wisdom to understand, unpack, and carry into ordinary days.
          </p>

          <blockquote className="my-12 border-l-2 border-gold pl-6 py-2">
            <p className="font-display text-2xl md:text-3xl text-ink italic leading-snug">
              "I write across worlds because that's how curiosity works. It doesn't stay in one lane."
            </p>
          </blockquote>

          <p>
            People sometimes ask whether writing in so many genres is a risk. Maybe it is. But I'd rather risk a reader's surprise than write the same book twice. And I've learned that readers who find me in one world often follow me into the next, not because the genre is the same, but because the voice is.
          </p>
          <p>
            That voice, curious, sincere, a little stubborn about craft, is also why I built <strong>WriteTogetherHub</strong>. I remember what it felt like to start out: the uncertainty, the isolation, the gap between what I could imagine and what I could put on the page. WriteTogetherHub exists to close that gap, giving new writers the guidance, community, and encouragement I wished I'd had from day one.
          </p>
          <p>
            So whether you're here for a love story, a thriller, a memoir, or a hymn made plain, welcome. There's more than one world inside. I hope you'll wander.
          </p>
        </div>

        <Divider />

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/books" className="btn-caps btn-gold inline-flex items-center gap-2 rounded-sm px-6 py-3">
            <BookOpen size={16} /> Explore the Books
          </Link>
          <a href="#free-chapter" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3">
            <Mail size={16} /> Get a Free Chapter
          </a>
          <Link to="/media#media-kit" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3">
            <FileText size={16} /> Media Kit
          </Link>
        </div>
      </section>

      {genres.length > 0 && (
        <section className="bg-cream py-12">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="eyebrow text-gold-text mb-5">Genres &amp; Interests</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {genres.map((g) => (
                <span key={g} className="label-caps text-2xs border border-gold/30 text-gold-text rounded-full px-3.5 py-1.5">{g}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedBooks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow text-gold-text mb-3 text-center">Selected Books</p>
          <h2 className="font-display text-3xl text-ink text-center mb-10">One World Per Book</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {selectedBooks.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </>
  );
}
