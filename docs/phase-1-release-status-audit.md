# Phase 1: Release-Status Audit and Single Source of Truth

Real findings from auditing the live site and database, with the fixes applied for each. No status/date was changed without the owner confirming the real fact first — two things in particular (which book is the current marketing priority, and the real dates for two delayed books) were confirmed with the owner directly rather than inferred.

## What was actually wrong, found by reading real code and real data

| Surface | Problem found | Evidence |
|---|---|---|
| Header (`Nav.tsx`, `MobileNavigation.tsx`) | "Explore Latest Book" hardcoded to `/books/the-shadow-code` on both desktop and mobile — not data-driven at all | Literal string in source |
| Homepage (`Home.tsx`) | Rendered **two** separate hero blocks (Shadow Code's and The Friend You Keep's) stacked on top of each other, both hardcoded by slug — nothing decided which one was "the" current release | Literal slug lookups in source |
| `BookLaunchHero.tsx` | Real display bug: `released` was computed only from `releaseDate` presence, so any **published** book with no stored `release_date` (The Friend You Keep, Offbeat Love, Anootha Pyar, Nirdosh Gangster, A Journey of Grace, both Sahasranama titles) showed **"New Release" instead of "Now Available"** | Confirmed in the actual conditional (`book.releaseDate ? isReleased(...) : false`) |
| `Media.tsx` "Current Release" | Picked whichever published book had the latest real `release_date` — since The Friend You Keep has none, it could never be selected even if it were the real current release | Confirmed in `findCurrentRelease()`'s filter logic |
| Database | No field existed to say "this one book is the current marketing priority" independent of date math | Confirmed via `information_schema.columns` |
| Database | Two books (`the-shadow-code` and `shadow-code-hindi`) both had `featured: true` simultaneously | Confirmed via direct query |
| Database | `the-zero-account` / `zero-account-hindi` and `last-voice` were `status: upcoming` with a stored `release_date` already in the past relative to today | Confirmed via direct query |

## What did NOT need fixing (checked, not assumed)

- `BookCard.tsx` and `Books.tsx`'s status filter already correctly derive "Coming Soon"/"Preorder" badges from the real `status` field — no hardcoding found.
- `getBuyOptions()` (the single shared function every purchase button on the site goes through) already correctly suppresses purchase links when no real URL exists — confirmed against all 5 upcoming books, every one has only `#` placeholders today, so none can currently show a fake "Buy Now."
- `AnnouncementBar`'s "Shadow Code available in Hindi & English" message is manually curated (not meant to be auto-derived — it's a campaign-style banner, not a "current release" claim) and happens to already agree with the confirmed priority book. Left as-is.
- `milestoneText.ts`'s Shadow-Code-specific clauses ("in English and Hindi", the named bookstores) are already explicitly documented as real facts about that one book, not a template assumed true for whichever book becomes featured next. No change needed.
- No structured data (JSON-LD) or Open Graph metadata makes any "latest/newest" claim — nothing to fix there.

## The fix: reuse the existing `featured` field as the single source of truth

No schema migration was needed. `authorgaurav_books` already had a `featured` boolean column — defined, editable in the admin, but never actually read by any page. Rather than adding a new `marketing_priority` column, this field was repurposed (and its doc-comment/admin label corrected) to be exactly that: **true on exactly one book at a time**, driving the header, homepage hero, and Media's "Current Release" from one shared helper (`getFeaturedBook()` in `src/lib/releaseStatus.ts`) instead of three separate hardcoded decisions.

Confirmed with the owner directly:
- **Shadow Code stays the current priority book** (real release date, real milestone sales data, already the only one meaningfully promoted).
- **The Zero Account** (and its Hindi edition): real release date is **October 30, 2026** — the old stored date (August 31) was stale.
- **The Last Voice Note**: no confirmed date yet — cleared to null rather than showing a stale one.

## Data corrections applied

```sql
update authorgaurav_books set featured = false where slug = 'shadow-code-hindi';
update authorgaurav_books set release_date = '2026-10-30' where slug in ('the-zero-account', 'zero-account-hindi');
update authorgaurav_books set release_date = null where slug = 'last-voice';
```

## Code changes

- **`src/lib/releaseStatus.ts`**: new `getFeaturedBook(books)` — returns the one `featured: true` book, falling back to the most-recently-released published book if none is marked (defensive, not the expected steady state).
- **`src/data/books.ts`**: new `getTranslationEdition(book, books)` — a small, explicit, documented slug-pair list (`the-shadow-code` → `shadow-code-hindi`, `the-zero-account` → `zero-account-hindi`). Unlike the featured-book decision, there's no relational field linking an English book to its Hindi edition in the schema, so this stays a short, named exception rather than a slug-guessing heuristic.
- **`Nav.tsx` / `MobileNavigation.tsx`**: header CTA now reads `Explore {featured book's title}` (falls back to the evergreen "Explore the Books" if no book is marked featured, rather than ever naming a stale title).
- **`Home.tsx`**: renders exactly one `BookLaunchHero`, for the featured book (with its translation edition alongside, if one exists). The Friend You Keep still appears normally in the bookshelf grid below — it just no longer gets a second, contradictory hero block.
- **`BookLaunchHero.tsx`**: `released` is now `true` whenever `book.status === 'published'`, regardless of whether `releaseDate` happens to be set — fixes the real "New Release" mislabeling bug.
- **`Media.tsx`**: "Current Release" now calls the same `getFeaturedBook()` the header and homepage use, instead of its own separate date-only logic.
- **`AdminBooks.tsx`**: the featured-field label now says what it actually does ("Current marketing priority — should be Yes on only one book") instead of the old, inaccurate "Featured (New Release ribbon)" (that ribbon was never actually wired to anything).

## Tests added

- **`scripts/validate-content.mjs`** (runs in CI before every deploy): fails if more than one book is marked `featured`; warns if an upcoming/preorder book already has a real purchase link (a hint the status field may be stale, not a hard error).
- **`e2e/smoke.spec.ts`**: two new tests — one confirms an upcoming book (`the-zero-account`) shows "Coming Soon" and zero purchase links; the other confirms the header's CTA and the homepage hero always name the same book, so they can never contradict each other again. Both were verified to actually catch the regression they're meant to catch (a deliberate race-condition bug was caught and fixed in the second test itself during development — see commit history) before being accepted as real coverage, not just "written and green."

## Verification

`npm run typecheck`, `npm run lint`, `npm run test`, the full `npm run test:e2e` (132 tests, up from 130), the accessibility suite (28 routes, 0 violations), `npm run validate:content`, `npm run validate:links`, and `npm run build` all pass. Manually confirmed live: header → "Explore Shadow Code", homepage → one hero (Shadow Code), Media → "Current Release: Shadow Code", Zero Account's detail page → "Coming Soon" badge, real October 30, 2026 release date, a correctly-computed live countdown, and zero purchase buttons.
