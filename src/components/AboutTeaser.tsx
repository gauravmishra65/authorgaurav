import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AboutTeaser() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="relative">
            <div className="aspect-[3/4] rounded-md border border-gold/25 shadow-book overflow-hidden bg-gradient-to-br from-ink-soft via-ink to-[#16243a]">
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
            <div className="absolute -bottom-3 -right-3 h-20 w-20 rounded-full border border-gold/30 bg-cream/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-gold text-2xl">❖</span>
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold mb-3">About the Author</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-5">A writer who refuses to stay in one lane.</h2>
            <p className="text-muted leading-relaxed mb-4">
              Gaurav Mishra writes across romance, thriller, memoir, and devotion — united by the belief that a good story can carry a reader anywhere.
            </p>
            <p className="text-muted leading-relaxed mb-7">
              He also founded WriteTogetherHub to help new writers find guidance, community, and the courage to keep going.
            </p>
            <Link to="/about" className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3">
              Read my story <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
