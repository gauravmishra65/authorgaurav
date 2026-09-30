# Search Advertising Plan (Google Ads & Microsoft Ads)

A campaign plan, not a launch — every campaign here is owner action (account setup, budget, actually turning it on). Nothing here spends money or creates a live campaign; this is what to set up once you're ready, and in what order.

## Before turning anything on

Per the master plan's own instruction: **prepare campaigns only after conversion tracking is reliable.** That groundwork is already in place —

- `retailer_click` / `amazon_click` fire on every real (non-`#`) buy button (`src/components/RetailerButton.tsx`).
- `newsletter_signup` fires on a confirmed, non-duplicate, non-error signup (`src/components/NewsletterForm.tsx`).
- `book_explore`, `start_here_view` / `start_here_book_click`, and `related_book_click` (added this session) cover the discovery funnel between them, so it's possible to see not just "did someone convert" but "which surface got them there."

All of this already lands in `authorgaurav_analytics_events` (see `docs/newsletter-and-analytics.md`'s event reference table) — before spending on ads, confirm at least a few weeks of real organic data exists there so campaign performance has a baseline to compare against.

**Landing pages, not the homepage.** Every campaign below lands on a specific book page or `/where-to-buy`, never `/`. UTM parameters are already safe to add — confirmed this session that the canonical `<link>` (`Seo.tsx`) is built from an explicit `path` prop or `window.location.pathname`, neither of which ever carries a query string, so `?utm_source=...` on any URL can never leak into a canonical tag or get treated as a distinct indexable page.

## Google Ads

### Campaign A — Author brand

Keywords: `Gaurav Mishra author`, `Gaurav Mishra books`, `Gaurav Mishra [book title]` for each real title.
Landing page: `/about/?utm_source=google&utm_medium=cpc&utm_campaign=brand`.
Primary conversion: `retailer_click`. Secondary: `newsletter_signup`.
Low competition, low cost per click expected — mainly defensive (someone who already knows the name should land on an owned page, not a retailer search result first).

### Campaign B — Shadow Code (current flagship)

Keywords: book-title and genre-intent terms specific to a techno-financial thriller — e.g. `Shadow Code book`, `financial thriller Gaurav Mishra`, `techno thriller Hindi English`. Avoid broad, expensive generic terms (`best thriller books`, `novels to read`) unless real performance data later justifies testing them — per the master plan's own caution.
Landing page: `/books/the-shadow-code/?utm_source=google&utm_medium=cpc&utm_campaign=shadow-code`.
Primary conversion: `retailer_click` (and specifically `amazon_click`, since that's the dominant real retailer link today).

### Campaign C — Spiritual books

Keywords: specific, high-intent phrases matching the books' own real language — e.g. `Vishnu Sahasranama meaning Hindi`, `Lalita Sahasranama simple explanation` — not generic `spirituality` terms, which would draw an irrelevant, low-converting audience.
Landing pages: `/books/vishnu-sahasranama/` and `/books/lalita-sahasranama/`, each with its own `utm_campaign` value so they're distinguishable in reporting.

### Campaign D — Remarketing

Explicitly gated: only worth setting up once there's enough traffic for a meaningful audience size, and only with real privacy-compliant setup (a clear disclosure, since this is a cookie-based mechanism — unlike the site's own first-party, cookieless analytics, remarketing pixels are exactly the kind of tool the "why no consent banner" reasoning in `newsletter-and-analytics.md` says would require revisiting that decision). Do not enable before that review happens.

## Microsoft Advertising (Bing)

Smaller, cheaper test rather than a mirror of the Google spend:

- Bing Search campaign on the same book-title and author-name terms as Campaign A/B above (Bing's search population skews toward users already primed to convert, and CPCs are typically lower — a reasonable place to test messaging cheaply before scaling on Google).
- Same landing-page discipline: book-specific pages, distinct `utm_source=bing`.
- Keep initial spend controlled and time-boxed (e.g. two weeks) before deciding whether to continue — this is explicitly a test, not a default-on channel.

Measure, for both platforms: CPC, CTR, retailer-click rate (not just landing-page views), and newsletter-signup rate as a secondary signal. Do not optimize for pageviews alone — a cheap click that never becomes a `retailer_click` or `newsletter_signup` isn't a useful outcome, per the master plan's own instruction.

## What this plan deliberately does not do

- Doesn't set a budget — that's your call, not a technical one.
- Doesn't claim any projected ROI or click volume — no real spend history exists yet to project from, and inventing numbers here would be exactly the kind of fabricated claim the master plan prohibits elsewhere (sales figures, reader counts).
- Doesn't imply search ads are a substitute for the organic-indexing work already covered in `search-engine-distribution.md` — they're a separate, parallel channel.
