# Phase 11: Search Engine Distribution and Indexing

Most of this phase's asks (IndexNow script + key file, Google Search Console checklist, Bing setup instructions, "don't advertise fake 100-search-engine submission" documentation) were already built in an earlier phase of this engagement — confirmed live and working, not rebuilt. This phase's real work was auditing those docs against the brief's exact checklist items and filling genuine gaps, plus a live author-entity-consistency audit the brief specifically asked for.

## Already built, verified working — no change needed

- **IndexNow**: `scripts/indexnow-submit.mjs` and its key file `public/2cde870b3d8e51281ed6a8d1146efaa6.txt` already exist, already deployed, confirmed live at `https://authorgaurav.com/2cde870b3d8e51281ed6a8d1146efaa6.txt`. Deliberately manual (not wired into CI), matching the brief's "do not repeatedly submit the entire website every deployment" rule.
- **robots.txt** already references the sitemap correctly.
- **"Other search engines" documentation** already exists and already avoids the fake "submit to 100 search engines" framing, listing only real, verified methods.

## Extended: Google Search Console checklist

`docs/google-search-console-checklist.md` already existed but only listed 5 of the 11 pages the brief names for indexing requests. Added the missing ones (Start Here, Lalita Sahasranama, Vishnu Sahasranama, Media, Journal, Where to Buy) and expanded the single "confirm canonical and mobile usability" step into the brief's full checklist: Google-selected canonical, user-declared canonical, page fetch, rendered content, mobile usability, structured data, and indexing status — each with what it actually means for this specific codebase, not generic advice.

## Extended: Bing checklist

`docs/search-engine-distribution.md` already had Bing setup steps but didn't cover the specific report sections the brief asks to verify. Added what to check in Crawl, Indexed Pages, SEO Diagnostics, Backlinks, and Search Keywords, each scoped to what's realistic to expect and when.

## Built: author entity consistency audit

Checked every author profile live rather than assuming:

- **Amazon Author Central** (confirmed real — same portrait, bio matching `AUTHOR_SHORT_BIO`, real titles listed) — added to a new `AUTHOR_VERIFIED_PROFILES` constant and wired into `Person.sameAs`. Not added to the header/footer social icon row, since that list has no icon for a retailer-author page.
- **Goodreads — found a real problem**: every book's own Goodreads page is correct, but the "author" link on those pages resolves to a *different, unrelated* "Gaurav Mishra" (an Indian Polity exam-prep author). Documented as a real owner action (Goodreads' Author Program, to claim a distinct profile) rather than linking the wrong person.
- **LinkedIn, BookBub**: no existing link found anywhere; not guessed, given the Goodreads collision proves the name isn't unique enough to search blindly. Documented as open items for the owner.
- **Book-title spelling**: Amazon lists *निर्दोष गैंगस्टर* as "Innocent Gangster"; the site has no English title anywhere for it. The schema already has a `translatedTitles` field for exactly this (empty today) — flagged, not filled in myself, since the exact approved English title is a content decision.

## Fixed: three malformed URLs found during the audit

While checking Goodreads links, found three real data bugs: `vishnu-sahasranama`'s `goodreads_url` had the same URL pasted twice back-to-back (404'd), `the-shadow-code`'s had a stray leading space, `lalita-sahasranama`'s had a trailing `--` artifact (resolved anyway, cleaned for consistency). Fixed all three directly in the database, verified each corrected URL resolves to the right book. Added a standing `malformed-url` check to `validate-content.mjs` (whitespace or doubled `http://` in any URL field) so this class of bug fails CI in the future instead of sitting unnoticed.

## Verification

`npm run typecheck`, `npm run lint`, and `npm run build` pass. `npm run validate:content` passes with 0 failures (confirms the three URL fixes and no new issues from the structured-data change). The full `npm run test:e2e` (132/132) and accessibility (28/28 routes, 0 violations) suites, which could not be run when this phase was first committed because of a session cutoff, were run at the start of Phase 12 against these changes and passed.
