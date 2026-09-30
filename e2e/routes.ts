// Every major public route — shared between accessibility.spec.ts and
// smoke.spec.ts so the two suites' route coverage can't drift apart (they
// used to keep separate lists; accessibility.spec.ts's own comment claimed
// to mirror scripts/prerender.mjs's staticRoutes plus a representative
// blog post, but was actually missing /interview-resources, /where-to-buy,
// and any /blog/:slug route entirely — none of the three had ever been
// accessibility- or smoke-tested despite being real, live, prerendered,
// sitemap-listed pages).
//
// Mirrors scripts/prerender.mjs's staticRoutes, plus one representative
// dynamic slug per family so Hindi/English book pages and a real blog post
// are covered without scanning every single book/post individually.
export const routes = [
  '/', '/books', '/about', '/blog', '/news', '/testimonials', '/start-here', '/write-together-hub', '/contact',
  '/media', '/readers', '/events', '/book-clubs', '/writing-resources', '/interview-resources', '/where-to-buy',
  '/reader-circle', '/privacy-policy', '/terms', '/accessibility',
  '/books/the-shadow-code', '/books/offbeat-love', '/books/journey-of-grace',
  '/books/lalita-sahasranama', '/books/vishnu-sahasranama', '/books/anootha-pyar', '/books/nirdosh-gangster',
  '/blog/writing-love-across-two-worlds',
];

// The subset of `routes` above that are book pages — used by smoke tests
// that check book-specific conventions (canonical trailing slash, etc.)
// across every sampled book rather than just one.
export const bookRoutes = routes.filter((r) => r.startsWith('/books/'));
