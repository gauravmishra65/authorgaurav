import type { Book } from '../data/books';

type MilestoneBook = Pick<Book, 'slug' | 'title' | 'milestoneSalesCount' | 'milestoneMonthLabel' | 'milestoneStoreCount'>;

/**
 * Builds the "850+ copies sold..." milestone sentence from a book's
 * admin-editable milestone fields. Shared by the BookDetail banner and the
 * homepage ticker so the two never drift apart. The English/Hindi-edition
 * and specific-city clauses are real facts reported for Shadow Code
 * specifically — not assumed true for any future book that gets a
 * milestone of its own.
 */
export function buildMilestoneText(book: MilestoneBook): string | null {
  if (!book.milestoneSalesCount) return null;

  const isShadowCode = book.slug === 'the-shadow-code';
  const monthPrefix = book.milestoneMonthLabel ? `In ${book.milestoneMonthLabel}, ` : '';
  const editionsClause = isShadowCode ? ' in English and Hindi' : '';
  const retailersClause = isShadowCode ? ', Shopee, Lazada and Shopify' : '';
  const storesClause = book.milestoneStoreCount
    ? `, and in ${book.milestoneStoreCount}+ bookstores across India${isShadowCode ? ', including Delhi, Bangalore, Chennai, Uttar Pradesh and Rajasthan' : ''}`
    : '';

  return `${monthPrefix}${book.title} sold ${book.milestoneSalesCount}+ copies${editionsClause}, across Amazon, Flipkart, Kindle${retailersClause}${storesClause}.`;
}

export interface MilestoneParts {
  before: string;
  highlight: string;
  after: string;
}

/** Same sentence as buildMilestoneText(), split around the "850+" figure so
 * callers can render it bold/gold without needing their own copy of the
 * sentence-building logic. */
export function buildMilestoneParts(book: MilestoneBook): MilestoneParts | null {
  const text = buildMilestoneText(book);
  if (!text) return null;

  const highlight = `${book.milestoneSalesCount}+`;
  const index = text.indexOf(highlight);
  if (index === -1) return { before: text, highlight: '', after: '' };

  return {
    before: text.slice(0, index),
    highlight,
    after: text.slice(index + highlight.length),
  };
}
