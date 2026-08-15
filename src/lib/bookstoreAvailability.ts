import type { ReaderPhoto } from '../data/readerPhotos';

function joinWithAnd(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Builds a "stocked at bookstores including X, Y in City" sentence from real
 * bookstore-photo captions (format "Store" or "Store, City"), so the copy
 * only ever names stores we actually have a photo of — never invented.
 */
export function buildBookstoreAvailabilityText(bookTitle: string, photos: ReaderPhoto[]): string | null {
  const byCity = new Map<string, string[]>();
  const noCity: string[] = [];

  for (const photo of photos) {
    if (!photo.caption) continue;
    const [store, city] = photo.caption.split(',').map((s) => s.trim());
    if (city) {
      const stores = byCity.get(city) ?? [];
      if (!stores.includes(store)) stores.push(store);
      byCity.set(city, stores);
    } else if (store && !noCity.includes(store)) {
      noCity.push(store);
    }
  }

  const clauses = [
    ...[...byCity.entries()].map(([city, stores]) => `${joinWithAnd(stores)} in ${city}`),
    ...noCity,
  ];

  if (clauses.length === 0) return null;
  const joined = clauses.length > 1
    ? `${clauses.slice(0, -1).join('; ')}; and ${clauses[clauses.length - 1]}`
    : clauses[0];
  return `${bookTitle} is now stocked at bookstores across India, including ${joined}, alongside the online retailers above.`;
}
