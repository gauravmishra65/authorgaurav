import { describe, expect, it } from 'vitest';
import { getBuyOptions } from './books';

// Regression coverage for a real bug found and fixed in this session:
// buyLinks frequently carries a stale `#` placeholder for "Kindle" even when
// the dedicated kindleUrl field is real, and some components rendered every
// buyLinks entry unconditionally (including `#` placeholders) as if it were
// a working button. getBuyOptions is the one place that must always resolve
// this correctly, since BookCarousel, BookCard, and BookPurchasePanel all
// depend on it to show the same, honest set of options.
describe('getBuyOptions', () => {
  it('excludes placeholder (#) buyLinks entries', () => {
    const options = getBuyOptions({
      buyLinks: [{ label: 'Amazon', href: '#' }, { label: 'Flipkart', href: '#' }],
      kindleUrl: undefined,
      paperbackUrl: undefined,
    });
    expect(options).toEqual([]);
  });

  it('includes a real (non-#) buyLinks entry other than Kindle', () => {
    const options = getBuyOptions({
      buyLinks: [{ label: 'Flipkart', href: 'https://flipkart.example/book' }],
      kindleUrl: undefined,
      paperbackUrl: undefined,
    });
    expect(options).toEqual([{ label: 'Flipkart', href: 'https://flipkart.example/book' }]);
  });

  it('recovers a real Kindle link from kindleUrl even when buyLinks.Kindle is still a # placeholder', () => {
    const options = getBuyOptions({
      buyLinks: [{ label: 'Amazon', href: '#' }, { label: 'Kindle', href: '#' }],
      kindleUrl: 'https://amazon.example/dp/REAL123',
      paperbackUrl: undefined,
    });
    expect(options).toEqual([{ label: 'Kindle', href: 'https://amazon.example/dp/REAL123' }]);
  });

  it('appends Paperback only when paperbackUrl is real', () => {
    const withPaperback = getBuyOptions({
      buyLinks: [],
      kindleUrl: undefined,
      paperbackUrl: 'https://publisher.example/book',
    });
    expect(withPaperback).toEqual([{ label: 'Paperback', href: 'https://publisher.example/book' }]);

    const withoutPaperback = getBuyOptions({ buyLinks: [], kindleUrl: undefined, paperbackUrl: undefined });
    expect(withoutPaperback).toEqual([]);
  });

  it('never fabricates an option for a book with no real links anywhere', () => {
    const options = getBuyOptions({
      buyLinks: [{ label: 'Amazon', href: '#' }, { label: 'Flipkart', href: '#' }, { label: 'Kindle', href: '#' }],
      kindleUrl: undefined,
      paperbackUrl: undefined,
    });
    expect(options).toEqual([]);
  });
});
