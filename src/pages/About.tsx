import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import Divider from '../components/Divider';

export default function About() {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <Seo
        title="About Gaurav Mishra — A Writer Who Refuses to Stay in One Lane"
        description="Gaurav Mishra writes across romance, thriller, memoir, and devotion — united by the belief that a good story can carry a reader anywhere. Founder of WriteTogetherHub."
      />

      <section className="bg-ink text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-[280px_1fr]">
            <div className="mx-auto">
              <div className="aspect-[3/4] w-[260px] rounded-md border border-gold/25 shadow-book overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-[#16243a]">
                {!imgError ? (
                  <img
                    src="/images/author/GM-Photo.jpg"
                    alt="Gaurav Mishra — author portrait"
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
                A writer who refuses to stay in one lane — romance, thriller, memoir, devotion — united by the belief that a good story can carry a reader anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-prose px-6 py-20">
        <div className="prose-literary">
          <p>I didn't set out to write across genres. I set out to follow curiosity — and curiosity, it turns out, doesn't stay in one lane.</p>
          <p>
            It led me to <em>Offbeat Love</em>, a romance about two people from different worlds who find one shared melody in the noise of Mumbai. It led me to <em>Shadow Code</em>, a thriller about the truths that hide inside algorithms and the people willing to chase them. It led me to <em>A Journey of Grace</em>, a travel memoir about faith, the road, and the quiet conversations that change us when we're paying attention.
          </p>
          <p>
            And it led me back — again and again — to the devotional texts I grew up with. The Vishnu Sahasranama. The Lalita Sahasranama. Not as rituals to perform, but as living wisdom to understand, to unpack, and to carry into ordinary days.
          </p>

          <blockquote className="my-12 border-l-2 border-gold pl-6 py-2">
            <p className="font-display text-2xl md:text-3xl text-ink italic leading-snug">
              "I write across worlds because that's how curiosity works — it doesn't stay in one lane."
            </p>
          </blockquote>

          <p>
            People sometimes ask whether writing in so many genres is a risk. Maybe it is. But I'd rather risk a reader's surprise than write the same book twice. And I've learned that the readers who find me in one world often follow me into the next — not because the genre is the same, but because the voice is.
          </p>
          <p>
            That voice — curious, sincere, a little stubborn about craft — is also why I built <strong>WriteTogetherHub</strong>. I remember what it felt like to start out: the uncertainty, the isolation, the gap between what I could imagine and what I could put on the page. WriteTogetherHub exists to close that gap — to give new writers the guidance, community, and encouragement I wished I'd had from day one.
          </p>
          <p>
            So whether you're here for a love story, a thriller, a memoir, or a hymn made plain — welcome. There's more than one world inside. I hope you'll wander.
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
        </div>
      </section>
    </>
  );
}
