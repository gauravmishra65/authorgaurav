// Length variants of the same already-approved About-page biography — no
// new facts, just different amounts of the same confirmed material. Shared
// so Media.tsx and PersonStructuredData.tsx can't drift into inconsistent
// wording for the same author identity.
export const AUTHOR_SHORT_BIO =
  'Gaurav Mishra writes across romance, thriller, memoir, and devotion, all united by the belief that a good story can carry a reader anywhere. He is the founder of WriteTogetherHub.';

export const AUTHOR_MEDIUM_BIO = `Gaurav Mishra writes across romance, thriller, memoir, and devotion, all united by the belief that a good story can carry a reader anywhere. His books include the contemporary romance Offbeat Love, the techno-financial thriller Shadow Code, the travel memoir A Journey of Grace, and accessible Hindi renderings of the Vishnu and Lalita Sahasranama. He is also the founder of WriteTogetherHub, a community and guided-learning platform for new and returning writers.`;

export const AUTHOR_LONG_BIO = `Gaurav Mishra writes across romance, thriller, memoir, and devotion, all united by the belief that a good story can carry a reader anywhere. His curiosity has led him to Offbeat Love, a contemporary romance about two people from different worlds who find one shared melody in the noise of Mumbai; to Shadow Code, a techno-financial thriller about the truths that hide inside algorithms and the people willing to chase them; to A Journey of Grace, a travel memoir about faith, the road, and the quiet conversations that change us; and back, again and again, to the devotional texts he grew up with, the Vishnu Sahasranama and the Lalita Sahasranama, rendered in accessible Hindi as living wisdom rather than ritual alone.

He is also the founder of WriteTogetherHub, built to give new and returning writers the guidance, community, and encouragement he wished he'd had when he was starting out.`;

export const AUTHOR_PORTRAIT_PATH = '/images/author/GM-Photo.jpg';

// Owned domains, not social-media profiles, so they live here rather than in
// social.ts's socialLinks (that array's own doc comment is specific to
// verified social platform profiles). Each is already rendered live,
// clickable, in Footer.tsx's "More Worlds" section — not new/unverified.
export const AUTHOR_OWNED_SITES = [
  'https://off-beat-love.com',
  'https://the-shadow-code.com',
  'https://writetogetherhub.com',
];

// Verified third-party author/retailer profiles that belong in Person.sameAs
// for entity recognition, but aren't "follow me" social links (so they don't
// belong in social.ts's socialLinks, which drives the header/footer icon
// rows and has no icon for a retailer profile) and aren't owned sites either.
// Each entry here was checked live during the Phase 11 author-entity audit —
// same portrait, a bio matching AUTHOR_SHORT_BIO, and real listed titles —
// not the generic Amazon search result. A same-name Goodreads author profile
// was found NOT to be a match (a different, unrelated "Gaurav Mishra") and
// is deliberately not included here; see docs/search-engine-distribution.md.
export const AUTHOR_VERIFIED_PROFILES = [
  'https://www.amazon.in/stores/author/B0H34FKXHP',
];
