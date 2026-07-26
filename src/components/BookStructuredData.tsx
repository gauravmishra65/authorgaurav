import type { Book } from '../data/books';
import { SITE_URL, canonicalUrl as buildUrl } from '../lib/url';

/** Builds the Book + BreadcrumbList JSON-LD for a book page — extracted out
 * of BookDetail so the schema logic is testable/reusable on its own. Passed
 * to `Seo`'s `jsonLd` prop, which renders it via `StructuredData`. */
export function buildBookStructuredData(book: Book): Record<string, unknown> {
  const canonicalUrl = buildUrl(`/books/${book.slug}`);

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
        bookFormat: book.formats?.length
          ? undefined
          : book.paperbackUrl ? 'https://schema.org/Paperback' : book.kindleUrl ? 'https://schema.org/EBook' : undefined,
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
