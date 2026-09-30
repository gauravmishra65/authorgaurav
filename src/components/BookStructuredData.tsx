import type { Book } from '../data/books';
import { SITE_URL, canonicalUrl as buildUrl } from '../lib/url';

/** schema.org bookFormat values for whichever real editions this book
 * actually has a link for — every genuinely-available format is listed
 * (a book with both a real Kindle and a real Paperback link reports both),
 * rather than the old logic which silently picked only one. `book.formats`
 * is the more granular structured field for this, but it's empty for every
 * book today (TODO_CONTENT), so this derives from the URLs that are real. */
function realBookFormats(book: Book): string[] {
  const formats: string[] = [];
  if (book.paperbackUrl) formats.push('https://schema.org/Paperback');
  if (book.kindleUrl) formats.push('https://schema.org/EBook');
  return formats;
}

/** Builds the Book + BreadcrumbList JSON-LD for a book page — extracted out
 * of BookDetail so the schema logic is testable/reusable on its own. Passed
 * to `Seo`'s `jsonLd` prop, which renders it via `StructuredData`. */
export function buildBookStructuredData(book: Book): Record<string, unknown> {
  const canonicalUrl = buildUrl(`/books/${book.slug}`);
  const formats = realBookFormats(book);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Book',
        name: book.title,
        // Uses the book's own `author` field (correctly "गौरव मिश्रा" for the
        // Hindi devotional titles) rather than a hardcoded "Gaurav Mishra" —
        // schema.org's Book type has no distinct "compiler" property, but at
        // least the name/language is now accurate per book.
        author: { '@type': 'Person', name: book.author },
        description: book.synopsis,
        genre: book.genre,
        inLanguage: book.language === 'Hindi' ? 'hi' : 'en',
        image: book.imageSrc ? `${SITE_URL}${book.imageSrc}` : undefined,
        url: canonicalUrl,
        datePublished: book.releaseDate,
        // TODO_CONTENT: isbn13/pageCount are empty for every book today — the
        // schema.org fields simply omit themselves until real values exist.
        isbn: book.isbn13,
        numberOfPages: book.pageCount,
        bookFormat: formats.length > 1 ? formats : formats[0],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: buildUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Books', item: buildUrl('/books') },
          { '@type': 'ListItem', position: 3, name: book.title, item: canonicalUrl },
        ],
      },
    ],
  };
}
