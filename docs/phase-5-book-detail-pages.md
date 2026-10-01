# Phase 5: Standardize Every Book Detail Page

Audited `BookDetail.tsx`'s real structure against the brief's 12-section sequence before changing anything. Result: 9 of 12 sections already existed and already matched the sequence closely; one (Related Journal Articles) was genuinely missing and buildable from real data; two (Reader Circle CTA copy) needed real wording changes the brief explicitly supplied.

## Sequence check against what's actually on the page today

| # | Section | Status |
|---|---|---|
| 1 | Hero | Already present (`BookHero`) |
| 2 | Purchase / edition choice | Already present, within the hero |
| 3 | Short synopsis | Already present — `book.tagline`, shown in the hero, serves this role; no second field exists to fabricate a duplicate |
| 4 | Full synopsis | Already present — `book.synopsis`, labeled "Synopsis" / "पुस्तक के बारे में" / "पुस्तक का उद्देश्य" depending on the book |
| 5 | Themes | Field exists (`book.themes`) but is empty for every book today — already flagged in the code with a `TODO_CONTENT` comment. Not fabricated here either. |
| 6 | Why readers may enjoy it | Already present, but only for Shadow Code and Offbeat Love (real, specific copy for those two only) — no equivalent exists for the other 8 published/upcoming books. Not invented for them. |
| 7 | Reviews | Already present, real testimonials only, hidden entirely when a book has none |
| 8 | Reading sample | Already present, within the hero, only when `sampleUrl` is real |
| 9 | Author/compiler note | Field exists (`book.authorNote`) but is empty for every book today — same `TODO_CONTENT` gap as Themes |
| 10 | **Related journal articles** | **Missing — built this phase** (see below) |
| 11 | Related books | Already present (`RelatedBooks`) |
| 12 | Reader Circle CTA | Already present (`BookNewsletterCTA`), but with generic/per-book copy rather than the brief's genre-specific wording — **updated this phase** (see below) |

## Built: Related Journal Articles (#10)

Added the reverse of the lookup `JournalBookCTA` already does on blog posts (post → related book). A book page now shows any blog posts whose own `related_link` field names that book's slug — real data only, the same field Phase 1 of this engagement added, nothing inferred from genre or category. Today that surfaces on exactly two book pages (Offbeat Love ← "Writing love across two worlds"; Vishnu Sahasranama ← its matching post) since those are the only two book-to-post links that currently exist; the section simply doesn't render on books with no linked post, rather than showing an empty placeholder.

## Updated: Reader Circle CTA copy (#12)

Replaced the English-book copy in `BookNewsletterCTA.tsx` with the brief's own genre-specific wording — a real question tied to the genre plus a consistent Reader Circle invitation, instead of one template with a swapped-in phrase:

- **Thriller**: "Enjoy suspense and crime fiction?" / "Join the Reader Circle for book news, behind-the-story notes and future thriller releases."
- **Romance**: "Enjoy contemporary love stories?" / "Join the Reader Circle for new-book news, reading notes and occasional extras."
- **Devotional**: "Interested in devotional reading?" / "Receive updates on spiritual books, reading notes and future editions."
- **Memoir** (not given explicitly by the brief — extrapolated in the same voice, not fabricating facts, just consistent marketing phrasing): "Enjoy honest, reflective true stories?" / "Join the Reader Circle for new-book news, reading notes and occasional extras."

Hindi books are untouched — they already have their own Hindi marketing copy (a deliberate earlier decision so the CTA doesn't read as an abrupt language switch at the bottom of a Hindi page), and the brief's suggested lines were English-only.

## Checked, already compliant — no change needed

- **Compiler vs. author labeling**: the brief says not to call Gaurav Mishra "the author" where a book credits him as compiler. Checked `BookHero.tsx` directly — devotional books already render "संकलनकर्ता" / "Compiled by" instead of "लेखक" / "By", driven by `book.genre === 'Devotional'`. Already correct.
- **Background colors** (Shadow Code: midnight navy/graphite/restrained red/steel blue; Offbeat Love: cream/warm blush/wine/soft brown): both books already have dedicated theme files (`ShadowCodeBackground.tsx`, `OffbeatLoveBackground.tsx`, `getBookTheme()`) built in an earlier phase of this engagement. Not re-touched — re-auditing the exact color values against the brief's palette language is a design-review task, not a structural one, and nothing here suggested the existing themes are actually wrong.

## Deliberately not changed — a judgment call, not an oversight

The brief suggests new hero taglines/positioning lines for Shadow Code and Offbeat Love, and new Hindi introductory lines for both Sahasranama pages. **Left the existing, already-approved copy as-is.** The brief itself hedges these as "possible... only use if it accurately fits" rather than a mandate, and the current copy — especially the two Hindi devotional intro lines — was written carefully in an earlier phase of this engagement with real attention to not overstating scriptural authority (the same concern this brief itself raises). Swapping established, approved marketing/devotional copy for alternative wording is a content decision, not a structural fix, and deserves an explicit decision from you rather than being changed by default. Flag this back if you'd like the swap made.

## Deliberately not built: Themes and Author/Compiler Note content

Both fields exist in the schema and the rendering code already handles them correctly when present — they're empty because there's no real content for them yet, not because of a code gap. Writing "why you'll enjoy this" copy or an author's note for all ten books would mean inventing content, which this engagement's standing rule doesn't allow. These stay as owner-supplied content tasks.

## Verification

`npm run typecheck`, `npm run lint`, `npm run test`, the full `npm run test:e2e` (132 tests), the accessibility suite (28 routes, 0 violations), `npm run validate:content`, `npm run validate:links`, and `npm run build` all pass. Manually confirmed live: Offbeat Love's page shows its real linked journal article in the correct position (after the book-club questions, before "More to Explore") and the new genre-specific Reader Circle copy; Vishnu Sahasranama (a Hindi book) shows its own linked article too, with its Hindi Reader Circle copy correctly unchanged.
