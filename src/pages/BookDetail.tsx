import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import BookThemeProvider from '../components/BookThemeProvider';
import BookHero from '../components/BookHero';
import BookReview from '../components/BookReview';
import RelatedBooks from '../components/RelatedBooks';
import BookClubCTA from '../components/BookClubCTA';
import BookNewsletterCTA from '../components/BookNewsletterCTA';
import { buildBookStructuredData } from '../components/BookStructuredData';
import Divider from '../components/Divider';
import Section from '../components/Section';
import ReleaseDetails from '../components/ReleaseDetails';
import ReleaseCountdown from '../components/ReleaseCountdown';
import SocialShareButtons from '../components/SocialShareButtons';
import ShadowCodeBackground from '../components/ShadowCodeBackground';
import OffbeatLoveBackground from '../components/OffbeatLoveBackground';
import LalitaBackground from '../components/LalitaBackground';
import VishnuBackground from '../components/VishnuBackground';
import { getBookTheme } from '../data/bookThemes';
import { fetchBooks, fetchReaderPhotos } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { isReleased } from '../lib/releaseStatus';
import { trackEvent } from '../lib/analytics';
import { offbeatLoveBookClubQuestions } from '../data/bookClubQuestions';

const shadowCodeWhyReaders = [
  'Suspense built on a real anxiety: financial data, surveillance, and who’s really watching whom.',
  'A grounded techno-thriller pace, not over-the-top action.',
  'A Mumbai setting that grounds global finance in a specific, vivid place.',
  'Ambiguity built into the premise. The line between watcher and watched blurs, keeping the moral center in question.',
];

const offbeatLoveWhyReaders = [
  'A love story grounded in real tension: family expectation versus personal choice, not manufactured drama.',
  'Music runs through the relationship as its own emotional thread.',
  'A Mumbai setting that feels lived-in and specific, not a generic romantic backdrop.',
  'A quieter, more mature kind of romance, about the courage to choose your own life, not just falling in love.',
];

const lalitaFeatures = [
  'सरल और सहज हिंदी भाषा में अर्थ',
  'हर नाम का भावार्थ, न कि केवल शब्दार्थ',
  'दैनिक जीवन से जुड़े व्यावहारिक सुझाव',
  'श्रद्धा और समझ, दोनों के लिए उपयुक्त',
];

const lalitaFaq = [
  { q: 'क्या इस पुस्तक को पढ़ने के लिए संस्कृत आना आवश्यक है?', a: 'नहीं, हर नाम का सरल हिंदी अर्थ दिया गया है।' },
  { q: 'क्या यह पुस्तक शुरुआती पाठकों के लिए उपयुक्त है?', a: 'हाँ, यह हर स्तर के पाठकों के लिए सुलभ है।' },
  { q: 'क्या इसे प्रतिदिन पढ़ा जा सकता है?', a: 'हाँ, इसे दैनिक पाठ और चिंतन दोनों के लिए उपयोग किया जा सकता है।' },
];

// Transcribed directly from the approved cover art (public/images/book-covers/VS.jpeg).
const vishnuFeatures = [
  'हर श्लोक का सरल अर्थ',
  'भावार्थ और जीवन में प्रयोग',
  'मुख्य शिक्षाएँ',
  'प्रेरक उदाहरण',
  'साधना के मार्गदर्शन',
];

const vishnuFaq = [
  { q: 'क्या इसे समझने के लिए संस्कृत आना जरूरी है?', a: 'नहीं, हर नाम का सरल हिंदी अर्थ दिया गया है।' },
  { q: 'क्या यह पुस्तक युवा पाठकों के लिए उपयुक्त है?', a: 'हाँ, इसे विशेष रूप से युवाओं और आधुनिक पाठकों को ध्यान में रखकर तैयार किया गया है।' },
  { q: 'क्या इसे दैनिक पाठ के लिए उपयोग किया जा सकता है?', a: 'हाँ, नियमित पाठ और चिंतन के लिए उपयुक्त है।' },
];

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);
  const { data: allPhotos } = useSupabaseData(fetchReaderPhotos, []);
  const book = books?.find((b) => b.slug === slug);

  useEffect(() => {
    if (book) trackEvent('book_view', { book: book.slug });
  }, [book]);

  if (loading) return <div className="py-32 text-center text-muted">Loading…</div>;
  if (error) return <div className="py-32 text-center text-rose">Couldn't load this book: {error}</div>;

  if (!book) return <Navigate to="/books" replace />;

  const released = book.releaseDate ? isReleased(book.releaseDate) : false;
  const theme = getBookTheme(book.slug);
  const isShadowCode = book.slug === 'the-shadow-code';
  const isOffbeatLove = book.slug === 'offbeat-love';
  const isLalita = book.slug === 'lalita-sahasranama';
  const isVishnu = book.slug === 'vishnu-sahasranama';
  const isHindiRelabel = isLalita || isVishnu;
  const isInterviewGuide = book.slug === 'interview-guide';
  const bookstorePhotos = (allPhotos ?? []).filter((p) => p.kind === 'bookstore' && p.bookTitle === book.title);

  return (
    <BookThemeProvider theme={theme}>
      <Seo
        title={book.seoTitle || `${book.title} | Gaurav Mishra`}
        description={book.seoDescription || book.tagline || book.synopsis.slice(0, 155)}
        path={`/books/${book.slug}`}
        image={book.imageSrc}
        lang={book.language === 'Hindi' ? 'hi' : 'en'}
        jsonLd={buildBookStructuredData(book)}
      />

      {/* 19. Breadcrumbs, 1-7. Book hero (cover, genre/language, hook, purchase/sample/trailer) */}
      <div className="bg-[var(--book-bg)] bg-grain">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-2">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Books', href: '/books' },
              { label: book.title },
            ]}
            className="text-[var(--book-accent)]"
          />
        </div>
      </div>
      <BookHero
        book={book}
        released={released}
        eyebrowOverride={isShadowCode ? 'Techno-Financial Thriller' : isOffbeatLove ? 'Contemporary Romance' : undefined}
        background={isShadowCode ? <ShadowCodeBackground /> : isOffbeatLove ? <OffbeatLoveBackground /> : isLalita ? <LalitaBackground /> : isVishnu ? <VishnuBackground /> : undefined}
        coverWrapperClassName={isShadowCode ? 'scan-line-hover rounded-md' : isOffbeatLove ? 'card-soft-lift rounded-md' : undefined}
        purchaseButtonClassName={isShadowCode ? 'btn-glow-red' : undefined}
        readerCircleHref={isOffbeatLove ? '#reader-circle' : undefined}
        introLine={
          isLalita
            ? 'माँ ललिता के दिव्य नामों को सरल अर्थ, भावार्थ और दैनिक जीवन से जोड़ने का एक श्रद्धापूर्ण प्रयास।'
            : isVishnu
              ? 'भगवान विष्णु के दिव्य नामों को सरल भाषा में जानने और जीवन में उतारने का एक विनम्र प्रयास।'
              : undefined
        }
      />

      {/* Lalita Sahasranama only: key-features section ahead of the generic synopsis */}
      {isLalita && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>इस पुस्तक की विशेषताएँ</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {lalitaFeatures.map((point) => (
                <div key={point} className="card-soft-lift rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-6">
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vishnu Sahasranama only: key-features section (from the approved cover art) ahead of the generic synopsis */}
      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>इस पुस्तक की विशेषताएँ</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {vishnuFeatures.map((point) => (
                <div key={point} className="card-soft-lift rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-6">
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shadow Code only: atmosphere section ahead of the generic synopsis */}
      {isShadowCode && (
        <Section tone="dark">
          <p className="eyebrow text-gold-lt mb-4 text-center">Inside the Hidden Financial World</p>
          <p className="font-display text-2xl md:text-3xl text-center max-w-2xl mx-auto leading-snug">
            A breach in the system. A trail through global finance. A truth powerful people cannot afford to reveal.
          </p>
        </Section>
      )}

      {/* Offbeat Love only: atmosphere section ahead of the generic synopsis */}
      {isOffbeatLove && (
        <section className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>A Story Across Two Worlds</p>
            <p className="font-display text-2xl md:text-3xl leading-snug mb-5" style={{ color: '#672F3A' }}>
              Two lives shaped by different worlds. One connection neither expected.
            </p>
            <p className="text-[var(--book-text)]/80 leading-relaxed">
              Offbeat Love unfolds against the pulse of Mumbai, where two people from very different worlds are pulled toward each other despite the distance between their families, their expectations, and the lives they were each raised to live.
            </p>
          </div>
        </section>
      )}

      {/* 8. Full story introduction */}
      <section lang={isHindiRelabel ? 'hi' : undefined} className="bg-[color-mix(in_srgb,var(--book-surface)_15%,white)] px-6 py-16">
        <div className="mx-auto max-w-prose">
          <p className="eyebrow text-gold-text mb-3">{isLalita ? 'पुस्तक के बारे में' : isVishnu ? 'पुस्तक का उद्देश्य' : 'Synopsis'}</p>
          <div className="prose-literary">
            <p>{book.synopsis}</p>
          </div>

          {/* 9-10. Themes (also stands in for "why readers may enjoy it" — see
              TODO_CONTENT below: real per-book "why you'll enjoy this" copy
              needs content input, not invention) */}
          {/* TODO_CONTENT: themes is empty for every book today */}
          {book.themes && book.themes.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {book.themes.map((t) => (
                <span key={t} className="label-caps text-2xs border border-gold/30 text-gold-text rounded-full px-3 py-1">{t}</span>
              ))}
            </div>
          )}

          {/* 14. Author or compiler note */}
          {/* TODO_CONTENT: authorNote is empty for every book today */}
          {book.authorNote && (
            <div className="mt-10 pt-8 border-t border-gold/15">
              <p className="eyebrow text-gold-text mb-3">{book.genre === 'Devotional' ? "Compiler's Note" : "Author's Note"}</p>
              <p className="text-text/85 leading-relaxed text-lg italic">{book.authorNote}</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <SocialShareButtons path={`/books/${book.slug}`} title={book.title} />
            <Link to="/books" className="inline-flex items-center gap-1.5 label-caps text-gold-text hover:text-ink transition-colors">
              Back to All Books <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Lalita Sahasranama only: सरल अर्थ / भावार्थ / दैनिक जीवन में प्रयोग / किन पाठकों के लिए उपयोगी */}
      {isLalita && (
        <section lang="hi" className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>सरल अर्थ</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              इस पुस्तक में श्री ललिता सहस्रनाम के नामों को सरल और सहज हिंदी में समझाने का प्रयास किया गया है, ताकि कठिन संस्कृत श्लोक भी आमजन के लिए सुलभ बन सकें।
            </p>
          </div>
        </section>
      )}

      {isLalita && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>भावार्थ</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              अर्थ के साथ-साथ हर नाम के भावार्थ को भी सामने रखा गया है, जिससे पाठक केवल शब्दों को नहीं, बल्कि उनके पीछे की भावना और भाव को भी समझ सकें।
            </p>
          </div>
        </section>
      )}

      {isLalita && (
        <section lang="hi" className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>दैनिक जीवन में प्रयोग</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              यह पुस्तक केवल पाठ के लिए नहीं, बल्कि दैनिक जीवन में शांति, संतुलन और सकारात्मकता लाने के एक सरल साधन के रूप में भी उपयोगी है।
            </p>
          </div>
        </section>
      )}

      {isLalita && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>किन पाठकों के लिए उपयोगी</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              यह पुस्तक उन पाठकों के लिए उपयुक्त है जो संस्कृत श्लोकों को सरल हिंदी में समझना चाहते हैं, नियमित पाठ करना चाहते हैं, या अपने आध्यात्मिक अभ्यास को दैनिक जीवन से जोड़ना चाहते हैं।
            </p>
          </div>
        </section>
      )}

      {isLalita && (
        <section lang="hi" className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>संकलनकर्ता की भूमिका</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              गौरव मिश्रा ने इस सहस्रनाम को संकलित कर इसे सरल भाषा में प्रस्तुत करने का प्रयास किया है, ताकि अधिक से अधिक पाठक इसका लाभ उठा सकें।
            </p>
          </div>
        </section>
      )}

      {/* Vishnu Sahasranama only: सरल अर्थ / किन पाठकों के लिए उपयोगी / दैनिक पाठ और चिंतन / संकलनकर्ता की भूमिका */}
      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>सरल अर्थ</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              इस पुस्तक में श्री विष्णु सहस्रनाम के हर श्लोक का सरल अर्थ दिया गया है, ताकि पाठक बिना संस्कृत के गहन ज्ञान के भी भावार्थ को समझ सकें।
            </p>
          </div>
        </section>
      )}

      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>किन पाठकों के लिए उपयोगी</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              यह पुस्तक विशेष रूप से युवाओं और आधुनिक पाठकों के लिए उपयोगी है जो भक्ति को केवल पाठ तक सीमित न रखकर, उसे अपने दैनिक जीवन से जोड़ना चाहते हैं।
            </p>
          </div>
        </section>
      )}

      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>दैनिक पाठ और चिंतन</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              नियमित पाठ और चिंतन के माध्यम से यह पुस्तक भक्ति को दैनिक जीवन का स्वाभाविक हिस्सा बनाने में सहायक है।
            </p>
          </div>
        </section>
      )}

      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>संकलनकर्ता की भूमिका</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">
              गौरव मिश्रा ने श्री विष्णु सहस्रनाम को सरल भाषा में संकलित किया है, विशेष रूप से युवा और आधुनिक पाठकों को ध्यान में रखते हुए, ताकि यह ज्ञान अधिक सुलभ बन सके।
            </p>
          </div>
        </section>
      )}

      {/* Shadow Code only: reader-fit + genre-context sections */}
      {isShadowCode && (
        <Section tone="cream">
          <p className="eyebrow text-gold-text mb-6 text-center">Why Thriller Readers May Enjoy It</p>
          <ul className="max-w-2xl mx-auto space-y-4">
            {shadowCodeWhyReaders.map((point) => (
              <li key={point} className="flex gap-3 text-text/85 leading-relaxed text-lg">
                <span className="text-gold-text mt-1">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {isShadowCode && (
        <Section tone="light">
          <p className="eyebrow text-gold-text mb-4 text-center">Technology, Finance and Crime Context</p>
          <div className="prose-literary max-w-2xl mx-auto text-center">
            <p>Shadow Code sits at the intersection of financial-crime fiction and the techno-thriller: whistleblowers, encrypted trails, and institutional power in collision. It's written for readers who enjoy suspense grounded in how modern financial and digital systems actually work, with no technical background required.</p>
          </div>
        </Section>
      )}

      {/* Shadow Code only: on-shelf-in-India social proof, shown only once real bookstore photos exist */}
      {isShadowCode && bookstorePhotos.length > 0 && (
        <section className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="eyebrow mb-4 text-center" style={{ color: 'var(--book-accent)' }}>Now in Stores</p>
            <h2 className="font-display text-2xl md:text-3xl text-center mb-4" style={{ color: 'var(--book-text)' }}>On Shelves Across India</h2>
            <p className="text-[var(--book-text)]/80 leading-relaxed max-w-2xl mx-auto text-center mb-10">
              Shadow Code is now stocked in bookstores across Bangalore, Chennai, and Delhi, alongside the online retailers above.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {bookstorePhotos.map((photo) => (
                <figure key={photo.id} className="rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-bg)] overflow-hidden">
                  <div className="h-48 flex items-center justify-center bg-[var(--book-bg)] p-2">
                    <img src={photo.imageSrc} alt={photo.caption || 'Shadow Code on a bookstore shelf in India'} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  {photo.caption && (
                    <figcaption className="px-3 py-2.5 text-2xs text-[var(--book-text)]/70 text-center border-t border-[var(--book-accent)]/10">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offbeat Love only: reader-fit + setting sections */}
      {isOffbeatLove && (
        <section className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>Why Romance Readers May Enjoy It</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {offbeatLoveWhyReaders.map((point) => (
                <div key={point} className="card-soft-lift rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-6">
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isOffbeatLove && (
        <section className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>Setting &amp; Journey</p>
            <p className="text-[var(--book-text)]/85 leading-relaxed text-lg mb-6">
              The story moves between two very different worlds, shaped by different families, different expectations, and different ideas of what love is allowed to look like, and finds, in Mumbai, the one place they meet.
            </p>
            {book.bookWebsite && (
              <a
                href={book.bookWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline-elegant inline-flex items-center gap-1.5 label-caps"
                style={{ color: 'var(--book-accent)' }}
              >
                Visit the Offbeat Love Website
              </a>
            )}
          </div>
        </section>
      )}

      {book.releaseDate && (
        <section className="bg-[var(--book-bg)] bg-grain text-[var(--book-text)]">
          <div className="hairline-solid w-full opacity-30" />
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="eyebrow mb-6 text-center" style={{ color: 'var(--book-accent)' }}>Release Details</p>
            <ReleaseDetails book={book} className="mb-12" />
            {!released && (
              <>
                <p className="eyebrow mb-6 text-center" style={{ color: 'var(--book-accent)' }}>The Code Will Be Revealed In</p>
                <ReleaseCountdown releaseDate={book.releaseDate} />
              </>
            )}
          </div>
        </section>
      )}

      {/* 11. Reviews */}
      {book.testimonials && book.testimonials.length > 0 && (
        <section lang={isHindiRelabel ? 'hi' : undefined} className="bg-cream">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="eyebrow text-gold-text mb-3 text-center">{isHindiRelabel ? 'पाठकों की प्रतिक्रियाएँ' : 'What Readers Say'}</p>
            <Divider className="!my-6" />
            <div className="grid gap-6 md:grid-cols-2">
              {book.testimonials.map((t, i) => <BookReview key={i} review={t} />)}
            </div>
            <p className="text-center mt-10">
              <Link to="/testimonials" className="label-caps text-gold-text hover:text-ink transition-colors">Share Your Own Feedback</Link>
            </p>
          </div>
        </section>
      )}

      {/* Lalita Sahasranama only: सामान्य प्रश्न */}
      {isLalita && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>सामान्य प्रश्न</p>
            <div className="space-y-4">
              {lalitaFaq.map(({ q, a }) => (
                <div key={q} className="rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-5">
                  <p className="font-display text-lg mb-2" style={{ color: 'var(--book-accent)' }}>{q}</p>
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vishnu Sahasranama only: सामान्य प्रश्न */}
      {isVishnu && (
        <section lang="hi" className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 py-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>सामान्य प्रश्न</p>
            <div className="space-y-4">
              {vishnuFaq.map(({ q, a }) => (
                <div key={q} className="rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-5">
                  <p className="font-display text-lg mb-2" style={{ color: 'var(--book-accent)' }}>{q}</p>
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offbeat Love only: reflective book-club discussion questions */}
      {isOffbeatLove && (
        <section className="bg-[var(--book-bg)]">
          <div className="mx-auto max-w-2xl px-6 pt-16">
            <p className="eyebrow mb-8 text-center" style={{ color: 'var(--book-accent)' }}>Book-Club Questions</p>
            <div className="space-y-4">
              {offbeatLoveBookClubQuestions.map((q, i) => (
                <div key={q} className="card-soft-lift flex gap-4 rounded-md border border-[var(--book-accent)]/20 bg-[var(--book-surface)]/40 p-5">
                  <span className="label-caps shrink-0" style={{ color: 'var(--book-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[var(--book-text)]/85 leading-relaxed text-lg">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interview Guide only: link to the dedicated, continuously-updated resources page */}
      {isInterviewGuide && (
        <section className="bg-[var(--book-surface)]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="eyebrow mb-4" style={{ color: 'var(--book-accent)' }}>Go Deeper</p>
            <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--book-text)' }}>Interview Resources &amp; Tools</h2>
            <p className="text-[var(--book-text)]/80 leading-relaxed mb-6">
              Official references and practical worksheets that support this book, kept current on a dedicated resources page.
            </p>
            <Link
              to="/interview-resources"
              className="btn-caps btn-gold-outline inline-flex items-center gap-2 rounded-sm px-6 py-3"
              style={{ color: 'var(--book-accent)', borderColor: 'var(--book-accent)' }}
            >
              Explore Interview Resources <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* 15. Book-club section */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <BookClubCTA bookTitle={book.title} />
      </section>

      {/* 16. Related books */}
      {books && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <p className="eyebrow text-gold-text mb-3 text-center">More to Explore</p>
          <Divider className="!my-6" />
          <RelatedBooks book={book} allBooks={books} />
        </section>
      )}

      {/* 17. Genre-specific newsletter CTA */}
      <div id="reader-circle" className="scroll-mt-20">
        <BookNewsletterCTA book={book} />
      </div>
    </BookThemeProvider>
  );
}
