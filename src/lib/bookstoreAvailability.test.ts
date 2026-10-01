import { describe, expect, it } from 'vitest';
import { groupBookstorePhotosByCity } from './bookstoreAvailability';
import type { ReaderPhoto } from '../data/readerPhotos';

function photo(id: string, caption: string): ReaderPhoto {
  return { id, imageSrc: `/img/${id}.jpg`, caption, kind: 'bookstore' };
}

// Regression coverage for a real duplicate-listing bug found while auditing
// /where-to-buy: a store that stocks two different books has two separate
// photo rows in the database (one per book), which this page's city-grouped
// gallery rendered as the same store name appearing twice in a row — e.g.
// "Bahrisons, Delhi" showed up as two identical-looking cards. There's no
// real branch/location signal to tell the two rows apart, so per the site's
// non-fabrication rule the fix is to collapse to one listing, not invent a
// distinguishing branch name.
describe('groupBookstorePhotosByCity', () => {
  it('shows a store once per city even when it has photos for multiple books', () => {
    const groups = groupBookstorePhotosByCity([
      photo('1', 'Bahrisons, Delhi'),
      photo('2', 'Bahrisons, Delhi'),
      photo('3', 'Jain Book Agency, Delhi'),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].city).toBe('Delhi');
    expect(groups[0].photos.map((p) => p.id)).toEqual(['1', '3']);
  });

  it('keeps distinct stores, and the same store name in different cities, separate', () => {
    const groups = groupBookstorePhotosByCity([
      photo('1', 'Higginbotham\'s, Bangalore'),
      photo('2', 'Higginbotham\'s, Chennai'),
      photo('3', 'Gangaram, Bangalore'),
    ]);
    const byCity = Object.fromEntries(groups.map((g) => [g.city, g.photos.map((p) => p.id)]));
    expect(byCity['Bangalore']).toEqual(['1', '3']);
    expect(byCity['Chennai']).toEqual(['2']);
  });

  it('groups captions with no city into a single city: null group', () => {
    const groups = groupBookstorePhotosByCity([photo('1', 'Some Store'), photo('2', 'Some Store')]);
    expect(groups).toHaveLength(1);
    expect(groups[0].city).toBeNull();
    expect(groups[0].photos.map((p) => p.id)).toEqual(['1']);
  });
});
