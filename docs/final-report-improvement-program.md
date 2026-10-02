# authorgaurav.com Improvement Program: Final Report (Phases 1-12)

This covers the whole twelve-phase program. Detail for each phase is in its own file under `docs/` (`phase-1-...` to `phase-11-...`); Phase 12's work is described in sections 14-20, and a follow-up round that executed the remaining engineering items is in section 25. How pages load (pre-render, swap, prefetch, deferred boot) is in `docs/performance-architecture.md`. Everything stated as measured was measured on this machine against the production build or the live site; anything that could not be verified from a development environment is marked as such rather than assumed.

## 1. Release-status inconsistencies corrected (Phase 1)

The header CTA, homepage hero and Media page each decided "the current book" differently, and two books were marked featured at once. They now share one source of truth (the `featured` flag, read through `getFeaturedBook()`): the header says "Explore Shadow Code", the homepage shows one hero, Media's Current Release block uses the same book. Published books without a stored release date no longer show "New Release" instead of "Now Available". Stale upcoming dates were corrected from real data (Zero Account: 30 October 2026; The Last Voice Note: cleared, as no date is confirmed). `validate:content` now fails if more than one book is featured.

## 2. Homepage sections removed or consolidated (Phase 2)

One visible H1 and editorial hero replaced a screen-reader-only heading. The launch hero was reduced to cover, title, tagline, synopsis and two actions; the full catalog carousel became four "Selected Books" with a link to the catalog; the stat strip and retailer row moved off the homepage (they remain on the book pages). A short About teaser, a compact WriteTogetherHub teaser and a closing prompt were added. Nothing was deleted from the site, only moved to the page that owns it.

## 3. Start Here improvements (Phase 3)

Rebuilt around four reading moods (suspense, relationships, faith and reflection, personal growth), each mapping to one real book and one honest call to action. The closing newsletter block was later corrected in Phase 9 (see item 9).

## 4. Book-page improvements (Phases 4, 5, 9, 12)

Books page: visible Upcoming and Language filters, an honest "Releasing In" / "Publication details will be added when confirmed" state, and a fix for a countdown label that was hardcoded to the Shadow Code series for every upcoming book. Book pages: followed the 12-section order; added a "Related Journal Articles" section driven by real post links; genre-specific Reader Circle copy; correct "Compiled by / संकलनकर्ता" labelling for devotional titles. Phase 9 removed a "Read a Sample" button on Shadow Code that led to a page with no book text and pointed Offbeat Love's directly at its real Chapter 1. Phase 12 fixed a genuine contrast defect on the light-themed book pages (Offbeat Love, both Sahasranama titles): the language badge and the "Loved this book?" feedback card chose light or dark colours from the cover art instead of the page theme, leaving them nearly invisible. Both now follow the page's theme variables.

## 5. Missing retailer links

Of ten published books, nine have at least one working purchase link. **A Journey of Grace has none**: every stored link is a placeholder, and the page correctly shows no purchase buttons rather than a dead one. Upcoming titles have none by design. Also corrected: The Friend You Keep showed an Amazon and a Paperback button pointing at the identical URL (the redundant entry was removed with your approval; the paperback link is unchanged), and its Amazon.com link had been filed under the Lazada field, so a "Lazada" button sent readers to Amazon (moved to the Amazon slot, same URL). Three malformed Goodreads URLs were repaired (one was two links pasted together and returned a 404). Amazon buttons now name their marketplace: "Amazon-IN" for amazon.in and "Amazon-US" for amazon.com. Amazon is now two dedicated columns on `authorgaurav_books`, `amazon_in_url` and `amazon_us_url` (migration `add_amazon_marketplace_columns`), each with its own field in /admin; the old single "Amazon" entry in `buy_links` is read only as a fallback and is being retired.

## 6. Where to Buy cleanup (Phase 6)

New headline and supporting copy as briefed, plus "Bookstore stock can change. Please contact the store before visiting." Duplicate Delhi bookstore cards (Bahrisons, Jain Book Agency) were one store holding photos for two books, not two branches; they now appear once, with a regression test. Not built, deliberately: grouping by Format and Country. No country exists anywhere in the purchase data and the `formats` field is empty for every book, so any grouping would have been invented. `validate:content` now also flags duplicate retailer URLs.

## 7. Media-page corrections (Phase 7)

"Media & Press" headline with the briefed introduction. The Current Release block now shows cover, genre, language, status, tagline and buy links from the same featured-book source as the rest of the site. One genuine press release (Shadow Code Now Available) was added, verified against live data first. The author photo is labelled "Web Resolution" with a factual download filename. No print-resolution photo exists (the file is 960 by 1440), so none is offered.

## 8. Testimonials removed or verified (Phase 8)

The fabricated press quotes the brief names ("The Reading Room", "Literary Notes") had already been removed before this program began and no trace remains. All 13 reader testimonials carry a real source (Amazon, Goodreads, "Verified Reader"). A confirmed migration added `verified`, `source_url` and `date` columns; the public read policy now returns only verified rows, the queries filter on it too, and an admin checkbox controls it. The sales milestone (850+ copies, September 2026) is dated and set from admin data.

## 9. Newsletter promises verified (Phase 9)

A "free chapter" was promised in at least nine places, with no automated process that sends one (only the Writing resources interest has a real file attached). Every instance was replaced with honest Reader Circle wording and the button now reads "Join the Reader Circle" everywhere. The post-signup message and `/reader-circle/welcome` no longer promise an email, and the welcome page offers a real sample link for Romance subscribers only.

## 10. Journal strategy (Phase 10)

Headline and copy as briefed. The article template gained `## Heading` sections, inline `[label](url)` links, and a Related Articles block (same category, real data). The three published articles received two links each (one for the Hindi devotional piece, deliberately) on mentions they already contained. A six-month editorial calendar is in `docs/journal-editorial-calendar.md`; no new articles were written or published.

## 11. Search Console status

**Not verified; owner action.** Nothing in this environment can see or act on your Search Console account. The checklist (`docs/google-search-console-checklist.md`) now lists all eleven pages the brief names and the full per-page inspection items (user and Google-selected canonical, page fetch, rendered content, mobile usability, structured data, indexing status). It makes no promise about indexing time.

## 12. Bing status

**Not verified; owner action.** Setup steps and what to check in Crawl, Indexed Pages, SEO Diagnostics, Backlinks and Search Keywords are in `docs/search-engine-distribution.md`.

## 13. IndexNow status

Implemented before this program and re-verified: `scripts/indexnow-submit.mjs` exists, and the key file is served live at `https://authorgaurav.com/2cde870b3d8e51281ed6a8d1146efaa6.txt` with matching content. It is manual by design (only genuinely changed URLs). After Phases 9-12 were deployed, 15 changed pages were submitted (home, Books, Start Here, About, Contact, Journal, Media, Where to Buy, Readers, Reader Circle, the Shadow Code and Offbeat Love pages, and the three Journal articles); IndexNow answered HTTP 202. That means "received", not "crawled" or "indexed" - what Bing and other participating engines do with it is theirs to decide. The follow-up round (section 25) changes page content again; once it is deployed, submit again with `npm run indexnow -- <path> ...` from PowerShell.

## 14. Background changes (Phase 12)

The existing palettes already matched the brief (Shadow Code: midnight, graphite, controlled red, steel blue; Offbeat Love: cream, blush, wine, terracotta; both Sahasranama titles: ivory with maroon or deep blue and antique gold). The page texture is a 3.5%-opacity dot pattern, not a wallpaper. All large decorative motifs are `aria-hidden`. No neon, hearts, diya or animated sacred-object effects were found, so none were removed. The only background-related defect found was the contrast problem in item 4.

## 15. Icon changes (Phase 12)

One icon family (Lucide) plus a single custom X brand mark. Inline UI icons of 11-15px were normalised to 16px (39 files). Purely decorative icons beside "Loved This Book?", "Gaurav Replied" and the "One email a month" line were removed. The only icons larger than 28px are the aria-hidden theme motifs.

## 16. Typography changes (Phase 12)

Measured before and after across 11 pages at four viewports. Before: about 2,000 text nodes rendered at 10.4-12px. After: none below 14px. Captions, labels and metadata are 14px, with caps tracking tightened so widths stay controlled. English descriptive text is 15px on desktop and 16px on mobile; Hindi sections are 17px on mobile; buttons were already 16px and navigation 15/16px; long-form article text is 18px. Devanagari no longer gets a synthetic italic slant. Still one serif (Fraunces) and one sans (Inter), plus the Devanagari pair for Hindi only. Fonts are now self-hosted (28 files, subsets only), removing a render-blocking third-party stylesheet.

## 17. Navigation changes

None needed. The header already matches the brief: Books, Start Here, Journal, About, Readers, Media, with Events, Contact and the rest under More, and a data-driven "Explore Shadow Code" call to action. Button wording is consistent; the only generic label found ("Read more" on journal cards) became "Read the Article".

## 18. Mobile results

390 by 844, 768 by 1024, 1440 by 1000 and 1920 by 1080 were captured and measured for the home page, Books, Start Here, four book pages, Media, Journal, Reader Circle and Where to Buy: no horizontal overflow on any, exactly one H1 on every page, no skipped heading levels. Scripted checks against the production build confirm the mobile menu opens and shows its sixteen links, and the existing end-to-end tests cover its reachability.

## 19. Accessibility results

- axe across 28 routes: 0 critical, 0 serious violations (unchanged).
- Important limitation: axe reports 40-78 colour-contrast items per page as "incomplete" rather than pass or fail, because it cannot resolve backgrounds through the page texture. So a clean axe run did not prove contrast. A separate contrast sweep is what found the footer problem (below).
- Fixed: footer headings and hover states used the dark gold meant for light backgrounds (about 2.7:1 on the navy footer); light-theme badge and feedback card (item 4).
- Carousels: both auto-scrolling strips now have a real Pause/Play control (previously they paused only on hover or focus, which touch users cannot use). Under reduced-motion they stop entirely, drop their duplicate copy and become manually scrollable (the previous rule shortened the loop to a near-instant infinite repeat). Verified by keyboard: focus ring visible, Enter toggles.
- Already in place and unchanged: skip link, visible focus outline, correct `lang="hi"` on Hindi content.
- Not done: a manual screen-reader pass with real assistive technology.

## 20. Performance results (updated)

Measured two ways, and then re-measured on the live site once the follow-up round (section 25) had deployed.

**Live site, Lighthouse 12 mobile, several runs per page** (run-to-run variance on a live network is large, so every run is shown rather than the best one):

| Page | Performance (each run) | Accessibility / Best practices / SEO | LCP (simulated) | CLS |
|---|---|---|---|---|
| Home | 75, 96, 89 | 100 / 100 / 100 | 2.7-3.6s | 0-0.001 |
| Books | 95, 97 | 100 / 100 / 100 | 2.5s | 0-0.001 |
| Shadow Code | 87, 84 | 100 / 100 / 100 | 3.8-3.9s | 0 |
| Offbeat Love | 88, 88 | 100 / 100 / 100 | 3.8-3.9s | 0 |
| Journal | 91 | 100 / 100 / 100 | 3.3s | 0.001 |

The 75 on the first home run came with a 630ms blocking time and a 6.0s speed index that the next two runs did not reproduce (96 and 89), so treat it as a cold-start outlier, not a typical score, but it is a real run and is shown. Accessibility, best practices and SEO were 100 on every live run. Live desktop was not re-run. Live production SEO validation passed 38 of 38 pages.

The live book pages are the weak spot (84-88): Lighthouse attributes about 1.1-1.4s of their LCP to the hero cover not starting to download until well after the server responds. A follow-up fix (a preload hint for the hero cover in the page head, below) was built and measured on the local build, where it raised Shadow Code from 91 to 95, Offbeat Love from 91 to 93 and home from 94 to 95.

**Live site after the preload deployed (CI run #140), 3 Lighthouse mobile runs per page:**

| Page | Performance (each run) | Accessibility / Best practices / SEO |
|---|---|---|
| Home | 90, 89, 90 | 100 / 100 / 100 |
| Books | 98, 97, 99 | 100 / 100 / 100 |
| Shadow Code | 87, 99, 87 | 100 / 100 / 100 |
| Offbeat Love | 88, 97, 88 | 100 / 100 / 100 |
| Journal | 84, 91, 97 | 100 / 100 / 100 |

The preload works as intended: the cover now starts downloading together with the stylesheet and fonts, right after the HTML arrives. The live scores split into two groups, though. When the page's HTML arrives quickly (about 10ms on the fast Shadow Code run) the book pages score 97-99; when it arrives slowly (about 275ms on the slow one) they stay at 87-88, exactly where they were before the preload. That delay is the hosting platform's response time, not something the site's code controls, so the local gain did not carry over reliably. One Journal run (84) had a long main-thread stall the other two did not repeat.

**Local production build, measured before that last change:**

**Lighthouse 12, mobile profile (simulated slow 4G, 4x CPU):**

| Page | Performance | Accessibility | Best practices | SEO | LCP (simulated) | CLS |
|---|---|---|---|---|---|---|
| Home | 94 | 100 | 100 | 100 | 3.0s | 0.001 |
| Books | 97 | 100 | 100 | 100 | 2.5s | 0.001 |
| Shadow Code | 91 | 100 | 100 | 100 | 3.3s | 0 |
| Offbeat Love | 91 | 100 | 100 | 100 | 3.3s | 0 |
| Journal | 91 | 100 | 100 | 100 | 3.3s | 0.001 |

Desktop preset: home and Shadow Code both score 100 / 100 / 100 / 100 (LCP 0.6s).

**Direct browser measurement under the same throttling** (real page-load events rather than a model):

| Mobile, throttled | LCP | CLS | TBT | INP (estimate) |
|---|---|---|---|---|
| Home | 2.0s | 0.001 | 219ms | 64ms |
| Books | 1.3s | 0.001 | 165ms | 40ms |
| Shadow Code | 1.5s | 0.000 | 188ms | 48ms |
| Offbeat Love | 1.9s | 0.000 | 198ms | 40ms |
| Journal | 1.2s | 0.001 | 299ms | 48ms |
| Where to Buy | 1.3s | 0.000 | 156ms | 40ms |

How to read these. Accessibility (100) and SEO (100) clear their 98 targets; best practices is 100. Cumulative layout shift and interaction metrics are well inside their targets. LCP is inside 2.5s on every page in the direct measurement, but Lighthouse's own simulation projects 2.5-3.3s: on localhost every resource finishes before its first paint, so its model counts all of them as dependencies of that paint. Of the five pages, only Books reaches the 95 performance target in Lighthouse (97); home is at 94 and the others at 91. No field data from real visitors exists.

What moved them (details in `docs/performance-architecture.md`): the pre-rendered page now stays on screen while the app loads (layout shift 0.2-0.67 to about 0.00); the app's own JavaScript is requested after the page's `load` event instead of competing with the hero image; data requests start from the page's head and are shared instead of repeated; book covers have 160-640px variants (the hero cover went from 116KB to 46KB); the heading font holds its text until it loads so the pre-rendered and live headings paint identically; fonts are self-hosted; and the hero cover is preloaded from the page head. Along the way one regression of my own was caught by Lighthouse (the prefetch script had pushed `<meta charset>` past the first 1024 bytes) and fixed.

## 21. Link-validation results (updated)

`validate:links`: 38 pages scanned, 0 failures, **0 warnings** (it was 1,791 - all internal links written without the trailing slash the canonical URLs use). The validator also had a false positive on links with a query or hash after the slash, now fixed. `validate:build-seo` (also run in CI after the build): 38 of 38 built pages pass, with 16 warnings (long titles and a few short or long meta descriptions, listed in its output). `validate:production-seo` against the live site returned 38 of 38 pages with a real HTTP 200 and 0 failures.

## 22. Remaining factual information required from the author

- A higher-resolution author photo for a "Print Resolution" download.
- Real sample chapters, if any exist, for Shadow Code and the Hindi, memoir and devotional titles (set `sample_url` in /admin; it appears automatically).
- The approved English title for निर्दोष गैंगस्टर (Amazon and Goodreads use "Innocent Gangster"; the site shows only the Hindi title).
- Real retail links for A Journey of Grace.
- Verified LinkedIn, BookBub and YouTube profile URLs, if they exist. Not guessed, because "Gaurav Mishra" is a shared name (see item 23).
- Themes, author's note and formats for each book, and country data per retailer, if the original brief's Format and Country grouping is still wanted.
- Real interviews or press coverage when they exist.
- Fuller meta descriptions for the five upcoming titles (two are under 40 characters), and a decision on the 16 title and description length warnings (for example the Shadow Code page title is 95 characters). These are your wording to decide, and are best settled before the pages are indexed.
- Whether Kindle and Paperback buttons should also name their marketplace. Only Amazon was asked for, so Kindle and Paperback keep their plain labels.

## 23. Remaining owner actions

1. **Nothing is waiting to be pushed or deployed.** CI runs #139 (the follow-up round in section 25) and #140 (the hero-cover preload) both passed and deployed; the live SEO check, live Lighthouse and an IndexNow submission (home and the 15 book pages, HTTP 200) were all re-run after #140.
2. Set up Google Search Console and Bing Webmaster Tools from the two checklists; submit the sitemap; request indexing for the listed pages. Indexing is Google's and Bing's schedule, not something this site can force. Check Bing's IndexNow section a day or two after setup to see whether the 202 submission turned into crawls.
3. Fix the **Goodreads author link**: the author link on every book's Goodreads page resolves to an unrelated "Gaurav Mishra" (an Indian Polity exam-prep author), so use Goodreads' Author Program to claim your own profile.
4. Decide whether to keep the six-month editorial calendar as it stands; each article still needs your writing and review (the spiritual ones in particular need accuracy checking).
5. Several database changes were applied directly to the live Supabase project during the program (a testimonials migration, retailer-link fixes, sample links, article links); they took effect immediately and are independent of any git push.

## 24. Final website quality assessment

What the evidence supports: the site is consistent about which book is current; it no longer promises a free chapter, a sample or a review it cannot deliver; its contact, purchase and press surfaces contain only verifiable facts; every public page has one H1, valid structured data, a matching canonical and a real HTTP 200; text is readable at every size tested and measured for contrast; the pages no longer jump while loading and reach their main content quickly under throttling; Lighthouse gives accessibility, best-practices and SEO scores of 100 on the live site in every run; and the automated checks (typecheck, lint, 16 unit tests, 160 end-to-end tests including contrast, 12 production-build tests, the content, link and SEO validators) all pass.

What it does not yet demonstrate: performance at 95 or above on every page (on the live site Books reaches it every time; home scores about 90; the book pages score 97-99 when the host answers quickly and 87-88 when it does not, even with the hero-cover preload deployed), any field data from real users, search visibility (the changed pages were submitted to IndexNow twice and accepted both times, but nothing is known to be indexed), or a manual assistive-technology review. Several content gaps in item 22 are the author's to fill, and the site's discoverability depends mostly on what gets written and earned from here, not on further code changes.

## 25. Follow-up round: the remaining engineering items, executed

After the report above was first written, the engineering items it listed as "could do next" were carried out. Content and account items cannot be done from here and stay in sections 22-23.

**Done**

- **Internal links:** 92 link definitions in 27 files now use the trailing slash the canonical URLs use. Link warnings fell from 1,791 to 0. This also fixed a real production bug: the nav highlights the current page by comparing paths, and visitors land on the slashed URL, so the highlight silently never matched on a direct load. The comparison is now slash-insensitive and covered by a test.
- **Contrast regression test:** `e2e/contrast.spec.ts` measures every visible text node on all 28 routes. It failed on five pages at first and found real defects, all fixed: breadcrumbs dimmed below readable contrast on dark book pages; the Interview Resources page heading rendered ink-on-ink (invisible); blog and book share buttons in the light gold on a cream page; and four more links that hovered to the dark gold on a dark background (announcement bar, Media release block, dark section headings, header social icons).
- **Production-build test:** `e2e-prerendered/swap.spec.ts` (`npm run test:e2e:prerendered`, now a CI step) covers the page-swap path the dev-server suite never reached.
- **Mobile LCP:** self-hosted heading font held until loaded, early shared data requests, responsive cover images, high fetch priority on the hero cover, app script requested after `load`, and an empty-shell 404 page. A later live Lighthouse check showed the book pages still lagging, which led to a preload hint for the hero cover (deployed in run #140; it lifts the book pages when the host responds quickly but not when it is slow). Results in item 20.
- **Real Lighthouse numbers:** obtained (item 20) after finding the debugging-port approach worked once run outside a wrapper script.
- **Amazon-IN / Amazon-US labels** on every Amazon buy button, plus the mis-filed Lazada link described in item 5.
- This report's stale statements corrected.

**Deliberately not done**

- **Title and description wording** (16 length warnings): your wording to decide, and churn after indexing is best avoided.
- **An `updated_date` column for the Journal:** a database change with no current use, since no article has been revised.
- **Format and Country grouping on Where to Buy:** still no data to group by.
- **A manual screen-reader pass and field performance data:** need a person and real traffic.
