import Seo from '../components/Seo';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import BookGrid from '../components/BookGrid';
import EmailStrip from '../components/EmailStrip';
import { fetchBooks, fetchReaderPhotos } from '../lib/queries';
import { useSupabaseData } from '../lib/useSupabaseData';
import { getBuyOptions } from '../data/books';
import { groupBookstorePhotosByCity } from '../lib/bookstoreAvailability';
import { getVerifiedSocialLinks } from '../data/social';
import { canonicalUrl } from '../lib/url';

function buildJsonLd() {
  const pageUrl = canonicalUrl('/where-to-buy');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Where to Buy | Gaurav Mishra',
        description: 'Every book by Gaurav Mishra, and where to buy it: real online retailer links plus the physical bookstores currently stocking his books across India.',
        url: pageUrl,
      },
      {
        '@type': 'Person',
        name: 'Gaurav Mishra',
        url: canonicalUrl('/about'),
        sameAs: getVerifiedSocialLinks().map((s) => s.href),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Where to Buy', item: pageUrl },
        ],
      },
    ],
  };
}

/** Store name only, without the city already shown in its group heading. */
function storeNameOnly(caption: string): string {
  return caption.split(',')[0].trim();
}

export default function WhereToBuy() {
  const { data: books, loading, error } = useSupabaseData(fetchBooks, []);
  const { data: allPhotos } = useSupabaseData(fetchReaderPhotos, []);

  const buyableBooks = (books ?? []).filter((b) => getBuyOptions(b).length > 0 || b.goodreadsUrl);
  const bookstorePhotos = (allPhotos ?? []).filter((p) => p.kind === 'bookstore');
  const cityGroups = groupBookstorePhotosByCity(bookstorePhotos);

  return (
    <>
      <Seo
        title="Where to Buy | Gaurav Mishra"
        description="Every book by Gaurav Mishra, and where to buy it: real online retailer links plus the physical bookstores currently stocking his books across India."
        path="/where-to-buy"
        jsonLd={buildJsonLd()}
      />

      <section className="bg-ink bg-grain text-ivory">
        <div className="hairline-solid w-full opacity-30" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="eyebrow text-gold-lt mb-4">Where to Buy</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Online &amp; in Bookstores</h1>
          <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Every book, with its real retailer links, plus the physical bookstores currently stocking Gaurav Mishra's books across India.
          </p>
        </div>
      </section>

      {loading && <p className="py-16 text-center text-muted">Loading…</p>}
      {error && <p className="py-16 text-center text-rose">Couldn't load books: {error}</p>}

      {!loading && !error && (
        <Section tone="light" containerSize="wide">
          <SectionHeading eyebrow="Buy Online" title="Every Book, Every Retailer" />
          <BookGrid books={buyableBooks} />
        </Section>
      )}

      {cityGroups.length > 0 && (
        <Section tone="cream" containerSize="wide">
          <SectionHeading eyebrow="Find in Bookstores" title="On Shelves Across India" />
          <div className="space-y-14">
            {cityGroups.map((group) => (
              <div key={group.city ?? '__other'}>
                {group.city && (
                  <p className="label-caps text-gold-text mb-5 text-center">{group.city}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {group.photos.map((photo) => (
                    <figure key={photo.id} className="rounded-md border border-gold/20 bg-ivory overflow-hidden">
                      <div className="h-48 flex items-center justify-center bg-ivory p-2">
                        <img
                          src={photo.imageSrc}
                          alt={photo.caption || 'A Gaurav Mishra book on a bookstore shelf in India'}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      {photo.caption && (
                        <figcaption className="px-3 py-2.5 text-2xs text-muted text-center border-t border-gold/10">
                          {storeNameOnly(photo.caption)}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <EmailStrip
        heading="Never miss a new release"
        subheading="Get notified the moment a new book is available, plus updates on new bookstores stocking Gaurav's work."
      />
    </>
  );
}
