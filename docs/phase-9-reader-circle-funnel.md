# Phase 9: Reader Circle and Real Free-Content Funnel

Audited every newsletter CTA on the site — headings, subheadings, button labels, post-signup messages, and the dedicated welcome page — against what a subscriber actually receives. Found a real, site-wide problem: a "free chapter" was promised in at least nine places, with no automated process that ever sends one. Also found one place where the opposite was true — a genuine sample chapter exists but wasn't linked precisely, and one book's "Read a Sample" button pointed at a page with no actual sample.

## The core finding: no automated "free chapter" delivery exists

Checked `NewsletterForm.tsx`'s actual subscribe flow and `src/data/readerMagnets.ts` (the one real per-interest resource mechanism) directly. Only one interest — "Writing resources" — has a real file attached (`manuscript-formatting-checklist.txt`); Thrillers, Romance, and Spiritual books are explicitly flagged `TODO_CONTENT: no real [resource] exists yet` in the code. There is no automated email that sends a chapter to a new subscriber. Despite this, the following all promised one:

- `EmailStrip.tsx`'s default heading ("Get a free chapter and new-release alerts") and hardcoded button ("Get the Chapter") — used as the fallback on every page that didn't override it (Books, BlogPostDetail), and silently ignored by every page that did override the heading/subheading but still got the same button.
- `NewsletterForm.tsx`'s own post-signup success message: "Check your inbox for the free chapter, and welcome to the reader circle" — shown to every subscriber, regardless of interest, regardless of whether any resource exists.
- `ReaderCircleWelcome.tsx` (the dedicated `/reader-circle/welcome` confirmation page) repeated the identical false promise.
- `StartHere.tsx`'s closing CTA was the most explicit: heading "Get a free first chapter, no commitment," body "Tell us what you love reading and we'll send a free chapter to match," button "Send Me a Chapter."
- `Contact.tsx`'s SEO description and its "join the reader circle" checkbox label.
- `About.tsx`'s "Get a Free Chapter" button.
- `Home.tsx`'s Reader Circle subheading promised "sample chapters" (plural, general) as a standing subscriber benefit.
- `Books.tsx` had a second, separate offender: "Get a free chapter delivered to your inbox" — whose button didn't even link to a signup form, it linked to `/contact`. Promise and mechanism were both wrong.

Fixed by replacing every instance with the brief's honest default language: heading "Join the Reader Circle," subheading "Receive thoughtful updates about new books, the stories behind them and occasional extras for readers," button "Join the Reader Circle." `Books.tsx`'s broken block was rewritten to point at the real `/readers` page (which has genuine, conditionally-rendered sample links — see below) instead of a dead-end contact-form detour. The `#free-chapter` anchor id was renamed to `#reader-circle` to match, on both ends (`Home.tsx`, `About.tsx`).

## The one genuine sample, verified and now linked correctly

Checked `sample_url` in the live database: two books have one set (Offbeat Love, Shadow Code), both pointing at the book's own general marketing site rather than a specific excerpt page. Visited both sites directly to confirm what they actually contain:

- **Offbeat Love** (off-beat-love.com) has a real "Read Chapter 1" link to `/preview` — a genuine, full first-chapter excerpt of the actual published book. Updated `sample_url` to point directly at `https://off-beat-love.com/preview` instead of the homepage, so "Read a Sample" is now a one-click real excerpt rather than requiring a second click to find it.
- **Shadow Code** (the-shadow-code.com) has no such page — only an extended marketing synopsis at `/book`. Checked the NotionPress "read" link too (also linked from the official site); it requires creating an account to read anything, not a genuine free sample. Since no real excerpt exists, **cleared `sample_url` for Shadow Code** — this removes a "Read a Sample" button that was already live on the book's own page and promising something that didn't exist, independent of anything this phase's brief asked about newsletters specifically. This was a real, pre-existing bug this audit caught.

This is the real "content mapping" the brief asks for: Romance (Offbeat Love) gets a genuine "Read a Sample" link; Thriller (Shadow Code) does not, because no real sample exists for it — deliberately not matching the brief's own suggested example text, since that example assumed a resource that isn't actually there. Devotional and Memoir books have no `sampleUrl` at all and never claimed one.

Built this into `/reader-circle/welcome`: a Romance subscriber now sees a real "Read a Sample from Offbeat Love" button (linking to the verified `/preview` page) alongside "View the Book"; a Thrillers subscriber sees only "View the Book" — no fabricated sample promise for Shadow Code.

## Welcome page (`/reader-circle/welcome`)

This page already existed, built in an earlier phase — the brief's "create a welcome page" instruction was already satisfied structurally. It already had the real-book link, the real resource-magnet download (conditional on a real file existing), and a verified social link. What needed fixing:

- The same "Check your inbox for the free chapter" line used elsewhere — replaced with the brief's own suggested copy: "You are now part of the Reader Circle. New-book news and occasional reading notes will arrive by email."
- Added the real sample-chapter link for the Romance segment (above).
- Added the missing fourth element the brief asks for — a link to the Journal (`/blog`) — alongside the existing book/resource/social sections.

## Checked, already compliant — no change needed

- **`/reader-circle` itself** — its per-segment descriptions ("Shadow Code, The Zero Account, and what comes next"; "Offbeat Love, Anootha Pyar, and future contemporary fiction"; etc.) already describe each interest honestly, no chapter promise anywhere.
- **`Readers.tsx`'s "Sample Chapters & Summaries" section** — already conditionally renders a real "Read a Sample" button only when `book.sampleUrl` exists, and always shows the book's real synopsis regardless. Already correct; it will now correctly stop showing a sample button for Shadow Code and link straight to the real excerpt for Offbeat Love, automatically, from the data fix above.
- **Email frequency honesty** — several pages (`/reader-circle`, `/readers`, `/start-here`) already state "One email a month. No noise. Unsubscribe anytime." This is a specific, already-established commitment from earlier in the engagement, not something this phase found reason to doubt or loosen — left unchanged rather than replaced with the brief's vaguer suggested "occasional" wording.
- **The admin panel's "Sample chapter URL" field label** — already correctly scoped ("shown on the book page and Readers page," "Link to a PDF, Google Doc, or hosted excerpt"), which is exactly the kind of real resource this field should hold. Not changed.

## Verification

`npm run typecheck`, `npm run lint`, `npm run test` (8/8), `npm run build`, the full `npm run test:e2e` (132/132, no regressions), the accessibility suite (28 routes, 0 violations), `npm run validate:content` (0 failures), and `npm run validate:links` (0 failures) all pass. Manually verified live: the homepage, Start Here, Books, Contact, and About pages all show the corrected Reader Circle copy; `/reader-circle/welcome?interest=Romance` shows the real Offbeat Love sample link; `/reader-circle/welcome?interest=Thrillers` correctly shows no sample link; Shadow Code's book page no longer shows a "Read a Sample" button; Offbeat Love's now links directly to the real chapter preview.

## Remaining gap for the owner

No real sample/excerpt exists today for any Thriller, Devotional, or Memoir title, or for the Hindi edition of Offbeat Love (Anootha Pyar — off-beat-love.com has no Hindi content). If a genuine excerpt is produced for any of these, set its `sample_url` in `/admin` and it will automatically appear wherever `BookSample`/`Readers.tsx` already render it — no code change needed.
