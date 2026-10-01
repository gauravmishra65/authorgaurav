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

export interface BookstoreCityGroup {
  city: string | null;
  photos: ReaderPhoto[];
}

/**
 * Groups real bookstore photos (any book) by the city named in their caption
 * ("Store, City"), for the site-wide "Find in Bookstores" directory. Photos
 * with no city in their caption land in a final `city: null` group rather
 * than being dropped or assigned a guessed location.
 *
 * One photo per store name per city — a store that stocks two different
 * books has two photo rows in the database (one per book), which otherwise
 * rendered as the same store name twice in a row on this page. There's no
 * real signal here (e.g. a verified branch name) to tell two same-named
 * rows apart as different locations, so per the site's standing
 * non-fabrication rule this collapses to one listing rather than guessing
 * a distinguishing branch label. buildBookstoreAvailabilityText() above
 * already does the equivalent dedup for the per-book sentence; this brings
 * the city-grouped gallery in line with it.
 */
export function groupBookstorePhotosByCity(photos: ReaderPhoto[]): BookstoreCityGroup[] {
  const byCity = new Map<string, ReaderPhoto[]>();
  const noCity: ReaderPhoto[] = [];

  for (const photo of photos) {
    const [store, city] = (photo.caption ?? '').split(',').map((s) => s.trim());
    const list = city ? (byCity.get(city) ?? []) : noCity;
    if (!list.some((p) => (p.caption ?? '').split(',')[0].trim() === store)) list.push(photo);
    if (city) byCity.set(city, list);
  }

  const groups: BookstoreCityGroup[] = [...byCity.entries()].map(([city, cityPhotos]) => ({ city, photos: cityPhotos }));
  if (noCity.length > 0) groups.push({ city: null, photos: noCity });
  return groups;
}
