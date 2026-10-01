# Phase 6: Fix Where to Buy

Audited the brief's requests against `/where-to-buy`'s real code and live Supabase data before changing anything. One request was a genuine bug (fixed), several were real copy/UX gaps (built), and two — the "Format" and "Country" grouping — turned out to depend on data that doesn't exist yet, so they're documented as gaps rather than faked.

## Fixed: duplicate bookstore listings

Confirmed via SQL against the live `authorgaurav_reader_photos` table that "Bahrisons, Delhi" and "Jain Book Agency, Delhi" each had two rows — one per book they stock, not two branches. `groupBookstorePhotosByCity()` in [`src/lib/bookstoreAvailability.ts`](../src/lib/bookstoreAvailability.ts) had no deduplication, unlike its sibling `buildBookstoreAvailabilityText()` which already deduped correctly. Brought it in line: a store name now appears once per city, regardless of how many books it stocks. No verified branch name exists for either duplicate pair (e.g. "Bahrisons — Khan Market"), so per the site's non-fabrication rule this collapses to one listing rather than inventing a distinguishing branch. Covered by 3 new unit tests in [`src/lib/bookstoreAvailability.test.ts`](../src/lib/bookstoreAvailability.test.ts); `npm run test` now passes 8/8 across both files.

## Updated: hero copy

Replaced the old eyebrow/headline/subhead with the brief's exact suggested wording:
- Headline: "Where to Buy" (was "Online & in Bookstores")
- Supporting copy: "Choose a book, edition and retailer. Availability may vary by country and store." (was a different, longer sentence)
- Eyebrow changed from "Where to Buy" to "Buy the Books" — the old eyebrow duplicated what is now the headline verbatim; every other page on the site (Books, Contact, Events, Blog, etc.) uses a distinct short eyebrow above a different headline, so this keeps the page consistent with that pattern rather than showing the same two words twice in a row.

## Added: "stock can change" note

Added "Bookstore stock can change. Please contact the store before visiting." directly under the Find in Bookstores heading, above the city groups — visible only when at least one bookstore photo exists.

## Added: empty-state copy for the bookstore section

The Find in Bookstores section previously rendered nothing at all (not even its own heading) when there were zero bookstore photos — a silent gap rather than a message. It now shows the section heading plus the brief's exact copy, "Retail availability has not yet been confirmed for this location," via the existing `EmptyState` component (same one used elsewhere on the site for legitimately-empty listings). Not currently visible live (there are bookstore photos today) but verified by temporarily emptying the photo list in dev.

## Added: technical checks in `validate:content`

Extended `scripts/validate-content.mjs` (the `npm run validate:content` CI gate) with two checks the brief specifically asked for:

- **Duplicate retailer URLs per book** — flags (fail) when the same URL appears under two different buy-option labels for one book. Built to mirror `getBuyOptions()`'s own reconciliation exactly (a `buy_links` "Kindle" entry is superseded by `kindle_url`, not counted separately), otherwise every book with that redundant-but-correctly-ignored pattern would false-positive. Running it against live data found **one real issue**: *The Friend You Keep*'s `buy_links` "Amazon" entry and its `paperback_url` point at the exact same Amazon listing URL, so the book's purchase panel currently shows an "Amazon" button and a "Paperback" button that go to the identical page. This is a real content issue for you to fix (likely `paperback_url` should point at a genuinely different paperback listing, or the redundant `buy_links` entry should be removed) — not changed here, since guessing the correct URL would be fabrication.
- **Duplicate bookstore listings** — flags (warn, not fail, since the UI already handles this gracefully) when the same store name repeats in the same city across reader-photo rows, so a future real second branch gets caught and can be given a distinguishing name instead of silently collapsing.

Duplicate store records, empty/`#` URLs, and invalid country labels were already covered (the first two by this phase's bookstore fix and the pre-existing `validate-links.mjs`; "invalid country labels" doesn't apply — see below, there's no country field to validate).

## Investigated and deliberately not built: Format and Country grouping

The brief asks for online retailers organized "Book → Format → Country → Retailer." Checked the real schema before attempting this:

- **Country**: no country field exists anywhere in the purchase-link data (`buy_links`, `kindle_url`, `paperback_url`, `shopify_url`, `shopee_url`, `lazada_url` — none carry a country). There is nothing real to group by.
- **Format**: a `book.formats: BookFormat[]` field exists in the schema and is already wired into `BookPurchasePanel.tsx` — but it's confirmed empty for every book today (same `TODO_CONTENT` gap already flagged in Phase 5 for Themes and Author Note). The one real Format-like signal that does exist is `getBuyOptions()`'s own internal logic, which treats "Kindle" as its own case separate from Paperback/Shopify/Shopee/Lazada — but that's a loose "ebook vs. everything else" split, not a real Format taxonomy, and several of those "everything else" entries (Shopify, Shopee, Lazada) are marketplaces that could carry either format, not confirmed-paperback-only. Building a "Format" header out of that distinction would mean labeling retailers with a format they haven't actually confirmed — that's the same kind of fabrication this engagement's standing rule rules out, just at the UI-label level instead of the content level.

Left the retailer-button layout as it is (a flat, real list of verified retailer links per book) rather than building a grouping header on top of data that doesn't support it. This is a data gap for you to close — once `book.formats` has real entries and/or a country field is added to the purchase-link data, the Book → Format → Country → Retailer structure becomes buildable without guessing.

## Checked, no change needed

- **"Only show verified URLs"** — already true; `getBuyOptions()` filters out empty/`#` hrefs, and `validate-links.mjs` already catches any that slip through at build time (0 failures, confirmed this phase).
- **Store/Branch/City/Country/Area/Map-link display** — Store and City are shown (the only two fields that exist in the data); Branch, Country, Area and Map-link all require fields that don't exist in the schema, so they're not displayed rather than being invented.

## Verification

`npm run typecheck`, `npm run lint`, `npm run test` (8/8), `npm run build`, the full `npm run test:e2e` (132/132, including the existing `/where-to-buy` smoke tests), the accessibility suite (28 routes incl. `/where-to-buy`, 0 violations), `npm run validate:links` (0 failures), and `npm run validate:content` (now correctly surfacing the one real Friend You Keep duplicate-URL issue above) all pass. Manually verified live in the browser at both desktop and mobile (375px) widths: hero copy matches the brief exactly, Bahrisons and Jain Book Agency each appear once under Delhi, the "stock can change" note renders above the city groups, and no horizontal overflow at mobile width.
