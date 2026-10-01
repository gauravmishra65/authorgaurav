# Master Plan Status Report

Status against the master-plan document's own 28-item "Required Final Report" and "Final Acceptance Criteria." Grounded in what was actually verified (real code, real Supabase data, real test runs) across this engagement, not aspirational claims — consistent with the master plan's own instruction not to claim "world's best" from appearance alone.

*Last substantially revised after adding the Reader Circle pages, admin Analytics, book-card simplification, nav restructure, and descriptive image filenames — see git history for exact commits.*

## 1–2. Current-state audit / benchmark comparison

Audited at the start of each work session by running the actual scripts (`typecheck`, `lint`, `test`, `test:e2e`, `build`, `validate:content`, `validate:links`) rather than assuming the plan's claimed gaps were real. This repeatedly found more existing infrastructure than the plan assumed (a working Playwright/axe-core suite, real validators, a real Where to Buy page) — recorded in each slice's own commit rather than a single static benchmark table, since the site's state changed materially over the engagement.

## 3–6. Brand / backgrounds / icons / typography

Not touched this round — prior phases (see `docs/phase-12-launch-readiness-report.md`, `docs/final-verification-typography-dedup-report.md`) already established the visual system. No new audit performed here; if a fresh design pass is wanted, treat it as its own slice under the non-destructive redesign policy (enhance, don't replace).

## 7–9. Homepage / Start Here / Books index

Homepage sections (hero, featured book, Start Here pointer, explore books, testimonials, author intro, journal preview, reader circle, final CTA) are in place. **Start Here** existed as a real page but was unreachable from primary or mobile navigation since launch (the same failure mode `/news` suffered once before) — fixed, added right after "Books." **Books index** uses search + category filters rather than the plan's suggested static sections (Latest/Thrillers/Love/etc.) — a legitimate, arguably more flexible alternative; not changed, since replacing a working pattern with a different one is a design call, not a bug fix.

Since fixed: `/books` and About's "Selected Books" cards showed the full retailer-button matrix (up to 6-7 buttons per card) directly on the catalog grid — exactly the anti-pattern the plan warns against ("purchase complexity belongs on the book page"). Confirmed the trade-off with the user first (it's a visible change to working functionality, not a silent bug fix), then simplified to a single "View Book" CTA on `/books`, About, and the homepage carousel. `/where-to-buy` — the one page whose entire job is surfacing purchase options — is unchanged and still shows every retailer link.

## 10–11. Book landing pages / Where to Buy

All 16 recommended book-page elements are present for every book that has real content for them (purchase options, formats, synopsis, author note, book-club resources, related books, reader-circle CTA). Fixed this session: `bookFormat` structured data under-reporting real formats; 9 of 15 books had wrong stored cover dimensions, one pointing at the wrong file entirely (confirmed with the user before correcting). `/where-to-buy` exists and works.

## 12–13. Sample chapters / Reader Circle

**Sample chapters — real gap, still not fixed**: no internal HTML "read a sample" experience exists — `sampleUrl` only supports an external link (PDF/Google Doc/hosted excerpt), always opened in a new tab. Building a real in-site reader is a structural feature addition, not a bug fix, and needs real sample text to populate it — out of scope without that content.

**Reader Circle — built.** `/reader-circle` (value prop, cadence, the 5 real newsletter segments) and `/reader-circle/welcome` (the plan's specified post-signup sequence: thank the reader, offer a relevant book only where genuinely unambiguous, offer the one real downloadable resource, suggest one verified social follow) both exist now, built entirely from already-real content. `NewsletterForm` gained an optional `onSuccess` callback used only here — every other existing embed (footer, book pages, Start Here, etc.) keeps its original inline-success behavior untouched. Wired into nav, footer, sitemap, and the e2e route list; `/welcome` is deliberately excluded from the sitemap/prerender (a post-signup confirmation page, not meant for search). Verified live end-to-end against the real Supabase backend for four different interest values, then cleaned up the test data. Also fixed two follow-on "connect the dots" bugs found while wiring this in: the homepage's own Reader Circle section had no link to the fuller page (first attempt used a negative CSS margin that made the link visually present but **unclickable** — caught by actually clicking it, not just screenshotting), and About's hero button literally labeled "Join the Reader Circle" pointed at the homepage form instead of the real page.

The "free chapter" promise repeated across ~10 places was checked directly with the site owner rather than assumed false — confirmed it's genuinely fulfilled (manually / via Brevo), so left as-is.

## 14–15. Journal / content UX

Three real posts exist; none published since 2026-05-12 against a ~4-month gap at the time of this report. `docs/content-calendar.md` (titles/outlines only, not drafted content, per the plan's own instruction) covers the next six months. Fixed: blog posts had a `BreadcrumbList` in structured data with no matching visible breadcrumb (violating the `Breadcrumbs` component's own stated contract), and no visible author byline.

End-of-article "promote the relevant book/resource" CTA — built. Required a real schema change (a nullable `related_link` column on `authorgaurav_blog_posts`, confirmed with the user first since it's a live DDL change), wired into the admin blog editor so future posts can set it without a code change. Renders a book card or a WriteTogetherHub card depending on the value, or nothing at all if a slug doesn't match a real book. Set real values for the 3 existing posts based on their actual content. Still not built: a "related articles" section (low value with only 3 posts today — revisit once the content calendar is drafted and the library is bigger).

## 16. Search engine indexing

Google: `docs/google-search-console-checklist.md` exists; verification/submission is owner-only (no API a script can safely act through). Bing: `docs/search-engine-distribution.md` covers Webmaster Tools setup. **IndexNow**: fully implemented (`scripts/indexnow-submit.mjs`, key file deployed, tested end-to-end against the real API this engagement).

## 17–18. Author entity SEO / Book structured data

Fixed this session: Person + WebSite JSON-LD was duplicated inconsistently (a static, site-wide copy baked into `index.html` with a `sameAs` list that bypassed the app's own verified-link filter, plus a separate, less-complete inline copy on two pages, and none at all on Home/About). Consolidated into one shared builder (`PersonStructuredData.tsx`), now including `image`/`jobTitle`/`description`, rendered on Home and About. Book schema's `bookFormat` fixed to report every real format instead of silently picking one. `FAQPage` added for the two book pages with real, visible FAQ content.

## 19. Image SEO

Fixed: 9 of 15 books had wrong stored width/height (one pointed at an entirely wrong cover file — confirmed the correct one with the user first); 2 books were serving `.png`/`.jpg` despite an unused `.webp` already existing on disk; alt text upgraded to include the author name. **Descriptive filenames — done**: all 15 book covers renamed from generic/cryptic names (`generated-image.webp`, `VS.webp`, `friendship.webp`) to the plan's own example format (e.g. `the-shadow-code-gaurav-mishra-book-cover.webp`), each confirmed to have zero hardcoded references elsewhere before renaming.

## 20. Media kit

Fixed: "Current Release" was hardcoded to a specific book slug — a live bug (confirmed a different, more recently-released book had already superseded it by over a month). Now computed from real release dates. **Not done, and can't be**: real press coverage, book facts (ISBN/page count are empty for every book today), and previous interviews — all require real content that doesn't yet exist; the page correctly shows honest empty states rather than fabricated placeholders (one of which — fabricated press quotes on the homepage — was found and removed this session).

## 21. Events / book clubs

`/events` and its `Event` structured data are fully built and correctly handle zero real events (confirmed live: the events table currently has 0 rows, so this is dead code today, not broken code — nothing to fix without inventing an event). `/book-clubs` has a real, working discussion-guide download for Offbeat Love.

## 22–23. Visual QA / button-CTA consistency

Audited this round via a real screenshot/DOM pass across breakpoints (desktop and 375px mobile) on every primary page. CTA button classes (`btn-gold`/`btn-gold-outline` sizing and spacing) are consistent across public pages; admin pages intentionally use a smaller, separate scale, and `/where-to-buy`'s retailer buttons are deliberately larger/distinct as the page's core purpose — neither is a bug.

Found and fixed one real, concrete bug this pass turned up: the mobile nav drawer (built earlier this session as part of the primary/secondary nav restructure, #24) was hard-capped at `max-height: 32rem` (512px) with `overflow: hidden`, while background scroll is intentionally locked whenever the drawer is open. Confirmed via computed styles that the actual link list is 880px tall — meaning Reader Circle, News, Events, Contact, the "Explore Latest Book" button, and the social icons were all present in the DOM but **physically unreachable** by a real mobile touch/mouse user (no working scroll gesture could reach them). The existing e2e test for this drawer only checked open/close, not whether its full content was reachable, so this slipped through CI. Fixed by making the open drawer internally scrollable (`overflow-y: auto`, `max-height: min(32rem, 80vh)`) instead of hard-clipping it. Added a new regression test (`e2e/smoke.spec.ts`) that scrolls the drawer to its end and asserts the last link is actually rendered in the viewport there — verified it fails against the old CSS and passes with the fix, so a future addition to the "More" group can't silently reintroduce this.

## 24. Navigation

Start Here added (see #7–9). The broader question the plan raises — whether the primary nav should be trimmed into primary/secondary tiers — was surfaced to the user rather than decided unilaterally, since demoting existing nav items is a content-prioritization call, not a bug fix; the user approved a specific proposal, now built: desktop shows 6 always-visible items (Books, Start Here, Journal, About, Readers, Media) plus a "More" dropdown (Where to Buy, Reader Circle, News, Events, Contact) using the same interaction pattern the Books dropdown already used — not deleted from the header outright, since this codebase has twice lost a real page's only nav link that way before. Mobile keeps every link, just visually grouped.

## 25–27. Mobile / performance / accessibility

Mobile: 320px-overflow checks now run across every real route, via the e2e suite. Performance: the React 19 upgrade (see that migration's plan doc) grew the main chunk past Vite's 500KB warning threshold for the first time (557KB raw / 162KB gzip) — real, measured, from React 19's renderer-internals consolidation, not a bug. Fixed via `vite.config.ts`'s `build.rollupOptions.output.manualChunks`: split `react`/`react-dom`, `react-router-dom`, and `@supabase/supabase-js` (which was bundling its unused Realtime/Storage sub-clients too — confirmed via a real bundle-treemap inspection, not assumed) into their own vendor chunks. Total bytes shipped on first visit are unchanged (this is reorganization, not reduction — actually dropping the unused Supabase sub-clients would be a separate, riskier change to how the client is constructed), but the app's own code is now a 73KB chunk that changes on every deploy, while the ~480KB of vendor code that rarely changes can be cached by the browser across deploys instead of being invalidated with every app-code change like before. Also added one concrete, safe win earlier: a `preconnect` hint for the Supabase API domain (every page fetches from it immediately; only Google Fonts had one before), using Vite's own env-substitution syntax so it stays correct if the project changes.

**Accessibility: 0 critical/serious/moderate/minor violations across all 28 real routes** (was 4 serious failures across 24 routes at the start of this engagement's accessibility work) — verified via the full axe-core suite, not spot-checked. One real regression was caught and fixed along the way: a new component introduced an `<h3>` where the page's only other heading was `<h1>` (skipping `<h2>`) — didn't fail CI since moderate violations don't block, caught by re-reading the full report rather than just the critical/serious counts.

Also added, narrowly scoped: Devanagari body text (in the main long-form reading context, `.prose-literary`, which was already at the plan's target 18px) gets the plan's recommended more generous line-height (1.85 vs Latin's 1.75) — scoped to `[lang='hi'] .prose-literary p` specifically, not a blanket `[lang='hi']` rule, so it can't cascade into buttons/nav/badges on Hindi pages. Verified via computed styles on both a Hindi and an English page.

## 28. CI/CD

Real, verified gap fixed this session: the deploy workflow ran `typecheck`/`lint`/`test`/`build` but never `test:e2e` (125 tests, including all the accessibility work above), `validate:content`, or `validate:links` — meaning none of that protection was actually enforced before a deploy. All three are now wired into `.github/workflows/deploy.yml`, confirmed to pass end-to-end locally in the exact CI order before committing. `validate:build-seo`/`validate:production-seo` (named in the plan) don't exist as separate scripts — their intent is already substantially covered by `prerender.mjs`'s own build-time title check plus `validate-links.mjs`'s canonical/sitemap/asset checks, so a dedicated script would be largely redundant rather than a real gap.

## 40. Final success metrics

Real gap found and fixed: extensive analytics tracking exists (`book_view`, `retailer_click`, `book_explore`, `start_here_view`, `journal_book_click`, `newsletter_signup`, and more), but there was no way to actually see any of it without writing raw SQL against Supabase directly — all that instrumentation was much less useful in practice. Added `/admin/analytics`: event counts over a selectable 7/30/90-day period, with a generic top-property breakdown per event (e.g. `retailer_click` → Amazon: 8, Flipkart: 5) that adapts to whatever properties an event carries rather than hardcoding per event name. Confirmed the query is correctly gated by the existing admin-only RLS policy, and validated the aggregation logic against real production data (1,629 `book_view` events, 72 `start_here_view`, real retailer clicks in a 30-day window).

## Search advertising (26/29–31 in the plan's own numbering)

`docs/ad-campaign-plan.md` covers Google Ads and Microsoft Ads campaign structure, keyword direction per real book/genre, and landing-page discipline (book-specific, never the homepage; UTM-safe, confirmed canonical tags can't leak query params). No campaign is live and none should go live without the owner setting a real budget — this is a plan, not an execution.

## Authority / backlinks / content calendar / social proof

`docs/authority-and-backlink-plan.md` and `docs/content-calendar.md` are new deliverables this session, both outline/strategy-level per the plan's own "titles/outlines first, not mass content" instruction. Social proof (`Testimonials.tsx`, milestone banners) already only renders admin-curated, real entries — audited, found compliant, not changed. The one real violation found — fabricated press quotes on the homepage attributed to invented outlets — was removed.

## Remaining owner actions (nothing here is code)

- Verify Google Search Console and Bing Webmaster Tools (checklists exist; verification needs your account).
- Claim/complete Goodreads Author Program and Amazon Author Central profiles (see the backlink plan) — this also directly improves the site's own `sameAs` structured data once added to `src/data/social.ts`.
- Decide whether/when to greenlight the ad campaigns in `docs/ad-campaign-plan.md`.
- Remove `test-verify-reader-circle@example.com` from Brevo — a real signup was used to verify the Reader Circle flow end-to-end; the Supabase/analytics side of the test data was cleaned up directly, but the Brevo sync happens server-side and can't be undone from here.
- Supply real content this repo cannot invent: sample chapters, press coverage, ISBNs/page counts, ratified reader magnets for four of five newsletter interests, a higher-resolution author photo for print use.

## Honest scorecard against the plan's "Final Acceptance Criteria"

Met, verified: cohesive brand across genres (pre-existing, not re-audited), consistent author identity, no serious/critical/moderate/minor accessibility violations, structured data validated (including FAQPage where real FAQ content exists), sitemap free of known-broken links, IndexNow implemented, analytics tracking meaningful book/newsletter conversions *and now actually visible* via `/admin/analytics`, no known placeholder URLs or duplicated low-value sections remaining, catalog grids no longer stack full retailer-button matrices on every card, a working Reader Circle product with its own page and confirmation flow, CI now actually protects SEO/links/prerendering/accessibility.

Not met, and can't be met without real input: an in-site sample-chapter reader, complete purchase-link coverage for every book (several upcoming titles genuinely have none yet — correctly so, not a bug), a populated Search Console/Bing Webmaster connection, live ad campaigns, six months of real published content, real backlinks. These are appropriately left as owner actions or future, content-gated work rather than something to fake.
