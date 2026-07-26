# Missing Content Checklist

Tracks real, owner-supplied content that's missing — nothing here is invented or guessed. Per standing project rules, retailer links, reviews, awards, ratings, and similar factual content are never fabricated or auto-selected from a web search; each item below needs the actual owner to supply and verify the real value.

## Book purchase links

### A Journey of Grace (`journey-of-grace`) — published, no retailer link

**Status: no real purchase link exists anywhere in the database** (`buy_links` are all `#` placeholders, `kindle_url`/`paperback_url` are both `null`). This is the only published book with zero real purchase links.

**What the site currently does about it (verified, confirmed correct behavior):** every buy-options surface (homepage carousel, `/books` grid card, the book's own detail-page purchase panel) uses the shared `getBuyOptions()` helper, which returns an empty list for this book — so **no purchase button of any kind renders**, not even a disabled or fake one. The book detail page (`/books/journey-of-grace`) still shows its full content (title, synopsis, cover) and the internal "View Book" links continue to work everywhere. Confirmed live in the browser: 0 purchase links render on the detail page, no `#` placeholder, no "Buy Now."

**What's needed to close this gap** — a verified purchase URL for at least one of:

| Field | Format | Status |
|---|---|---|
| Amazon (US/UK/India) | Kindle or paperback | Missing |
| Flipkart | Paperback | Missing |
| Publisher/official page | Any | Missing |

A URL is only added once it's been checked against: correct title, correct author name, correct cover, correct edition/format, correct language, correct marketplace. I will not search by title and use the first result automatically — per project policy, this always needs a verified link from you.

**Once you have a real, verified link**, give it to me with the format (paperback/kindle/hardcover) and marketplace, and I'll:
1. Add it to the book's `kindle_url`/`paperback_url` (or a new `buy_links` entry) in Supabase.
2. Confirm the URL resolves and opens the correct listing.
3. Regenerate the sitemap and pre-rendered pages.
4. Verify it shows up correctly on the carousel, book card, and detail page.
5. Confirm `retailer_click`/`amazon_click` analytics fire.

## Reader magnets (already documented in `docs/newsletter-and-analytics.md`, repeated here for visibility)

Four of five newsletter-interest reader magnets have no real file yet (`src/data/readerMagnets.ts`): Thriller prequel, Romance bonus content, Spiritual reading guide, and the generic "All updates" welcome resource. Only "Writing resources" has a real file. See `docs/reader-magnet-content-plan.md` for what each would need before it could be added.

## Discussion guides

Only Offbeat Love has a real discussion guide today (`src/data/bookClubQuestions.ts` + the downloadable `.txt`). No other book has one. `BookClubs.tsx` and the book detail pages only ever show a download link when a guide is real — no other book's page implies one exists.

## Social profiles

See `docs/social-link-audit.md`. No real URL exists yet for YouTube (kept as a documented placeholder, never rendered). No entries exist at all for LinkedIn, Goodreads, Amazon Author Central, BookBub, Threads, or Pinterest — add them to `src/data/social.ts` if real profiles exist.
