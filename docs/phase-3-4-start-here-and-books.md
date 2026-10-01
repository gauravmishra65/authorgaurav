# Phase 3 & 4: Start Here Rebuild and Books Page / Purchase Journey

## Phase 3: Start Here, rebuilt around reader mood

Replaced the old "Three genres, one writer" framing (genuinely inaccurate once a fourth, non-genre mood — reflective/memoir reading — had a real book to point to) with four reader-mood paths, each pairing a real question, a real book, and a specific CTA rather than a generic "Read More":

| Mood | Question | Book | CTA |
|---|---|---|---|
| Suspense & Mystery | "I want something suspenseful." | Shadow Code | Explore the Thriller |
| Love & Relationships | "I want a story about people and relationships." | Offbeat Love | Explore Love Stories |
| Faith & Reflection | "I want something spiritual." | Vishnu Sahasranama | Explore Spiritual Books |
| Life & Personal Growth | "I want something reflective." | A Journey of Grace | Explore Reflective Reading |

These are the same four mood labels used in the homepage's Start Here teaser (Phase 2) — a reader who clicks through from the homepage sees the exact categories they were just shown, not a different taxonomy.

Added `start_here_category` to the analytics event union and fire it alongside the existing `start_here_book_click` on each path's click, so "which mood resonated" and "which specific book they went to" are two distinct, queryable signals — matching the brief's own tracking list (`start_here_view`, `start_here_category`, `start_here_book_click`), all three now real.

**Deliberately not built**: the brief's optional "How would you like to read?" second question (full book / short reading / devotional reading / journal article). The brief itself marks it optional and explicitly warns against turning this into "a complicated quiz" — building it meaningfully would need real content-routing logic for each combination, which is a separate, bigger feature decision than a reader-mood rename deserves to carry.

## Phase 4: Books page and purchase journey

**Real audit, not assumption** — queried every published book's actual `buy_links`/`kindle_url`/`paperback_url`/etc. directly. Result: 9 of 10 published books have at least one genuine, working purchase link; exactly one (*A Journey of Grace*) has none at all (every `buy_links` entry is a `#` placeholder, every URL field null) — and it already correctly shows zero purchase buttons rather than a dead one, confirmed both by this audit and by the existing e2e test. No book was found showing "Buy Now" without a real destination.

**A second real bug found while checking the "Coming Soon" copy**: `BookDetail.tsx`'s release countdown was labeled "The Code Will Be Revealed In" — hardcoded for *every* upcoming book, including ones with nothing to do with the Shadow Code thriller series. Checked the other upcoming titles' actual taglines: *The Last Voice Note* ("one buried truth... family") and *The Letter They Buried* ("a detective, a letter") are standalone stories, not code/tech-themed at all — the label made sense only for *Zero Account* and *Operation Reyes* (genuine sequels). Fixed to the neutral "Releasing In", matching the label `BookLaunchHero.tsx` already used correctly on the homepage.

**Also added**: upcoming/preorder books with no `release_date` at all (so no countdown to show) previously had no explanatory text whatsoever on their own page — just silence. Added the brief's own suggested copy ("Coming Soon" / "Publication details will be added when confirmed.") for exactly that case; books that do have a real date keep showing the actual countdown instead, which is more informative than a generic placeholder.

**Filters**: added a visible "Upcoming" status toggle (previously only reachable via a URL parameter from the nav dropdown, with no visible pill) and a new Language filter (English/Hindi) — both real fields already on every book, verified they combine correctly with the existing genre filter and with each other (e.g. Upcoming + Hindi correctly narrows to the one upcoming Hindi title).

**Copy**: updated the page hero to the brief's suggested "Books by Gaurav Mishra" / "Thrillers, contemporary fiction, spiritual books and reflective writing. Browse by interest, language or publication status." Renamed the catalog card CTA from "View Book" to "Explore Book" (`BookCard.tsx`, shared across `/books`, the homepage's Selected Books, and `/about`) to match the brief's terminology consistently everywhere that component is used, not just on `/books`.

**Dead code found and removed**: `BookCarousel.tsx` had zero remaining imports anywhere in the codebase — Phase 2 removed its one usage ("The Bookshelf" section on the homepage) and nothing else ever used it. Deleted the file; a few unrelated components' doc comments still mention it by name as a historical cross-reference (shared animation technique, shared buy-options helper) — left alone since they're accurate about *why* a pattern exists, not a claim that the file still exists.

**Filters considered and deliberately not changed**: the brief suggests a simpler filter set ("Thrillers", "Love & Contemporary Fiction", "Spiritual", "Reflection"). The real category data (from the admin-managed `authorgaurav_book_categories` table, shared with the Nav "Books" dropdown) already has 7 genuine categories in active use. Replacing that with a different, hardcoded taxonomy would mean the Books page and the Nav dropdown disagree about what a book's categories are — exactly the kind of inconsistency Phase 1 existed to eliminate. Left the real, data-driven category filter as-is; it already satisfies "useful filters, not excessive complexity" since every pill reflects a real, admin-managed category.

## Verification

`npm run typecheck`, `npm run lint`, `npm run test`, the full `npm run test:e2e` (132 tests), the accessibility suite (28 routes including `/start-here` and `/books`, 0 violations), `npm run validate:content`, `npm run validate:links`, and `npm run build` all pass. Manually confirmed live: all four Start Here paths render with their correct question/book/CTA; the Books page's new Status and Language filters work individually and combine correctly; *Operation Reyes* (no date) shows the new "Publication details will be added when confirmed" copy; *Zero Account* (real date) shows "Releasing In" with its correct live countdown, not the old Shadow-Code-specific label.
