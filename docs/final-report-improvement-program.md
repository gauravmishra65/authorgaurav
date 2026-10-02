# authorgaurav.com Improvement Program: Final Report (Phases 1-12)

This covers the whole twelve-phase program. Detail for each phase is in its own file under `docs/` (`phase-1-...` to `phase-11-...`); Phase 12's work is described in section 14-20 below. Everything stated as measured was measured on this machine against the production build or the live site; anything that could not be verified from a development environment is marked as such rather than assumed.

## 1. Release-status inconsistencies corrected (Phase 1)

The header CTA, homepage hero and Media page each decided "the current book" differently, and two books were marked featured at once. They now share one source of truth (the `featured` flag, read through `getFeaturedBook()`): the header says "Explore Shadow Code", the homepage shows one hero, Media's Current Release block uses the same book. Published books without a stored release date no longer show "New Release" instead of "Now Available". Stale upcoming dates were corrected from real data (Zero Account: 30 October 2026; The Last Voice Note: cleared, as no date is confirmed). `validate:content` now fails if more than one book is featured.

## 2. Homepage sections removed or consolidated (Phase 2)

One visible H1 and editorial hero replaced a screen-reader-only heading. The launch hero was reduced to cover, title, tagline, synopsis and two actions; the full catalog carousel became four "Selected Books" with a link to the catalog; the stat strip and retailer row moved off the homepage (they remain on the book pages). A short About teaser, a compact WriteTogetherHub teaser and a closing prompt were added. Nothing was deleted from the site, only moved to the page that owns it.

## 3. Start Here improvements (Phase 3)

Rebuilt around four reading moods (suspense, relationships, faith and reflection, personal growth), each mapping to one real book and one honest call to action. The closing newsletter block was later corrected in Phase 9 (see item 9).

## 4. Book-page improvements (Phases 4, 5, 9, 12)

Books page: visible Upcoming and Language filters, an honest "Releasing In" / "Publication details will be added when confirmed" state, and a fix for a countdown label that was hardcoded to the Shadow Code series for every upcoming book. Book pages: followed the 12-section order; added a "Related Journal Articles" section driven by real post links; genre-specific Reader Circle copy; correct "Compiled by / संकलनकर्ता" labelling for devotional titles. Phase 9 removed a "Read a Sample" button on Shadow Code that led to a page with no book text and pointed Offbeat Love's directly at its real Chapter 1. Phase 12 fixed a genuine contrast defect on the light-themed book pages (Offbeat Love, both Sahasranama titles): the language badge and the "Loved this book?" feedback card chose light or dark colours from the cover art instead of the page theme, leaving them nearly invisible. Both now follow the page's theme variables.

## 5. Missing retailer links

Of ten published books, nine have at least one working purchase link. **A Journey of Grace has none**: every stored link is a placeholder, and the page correctly shows no purchase buttons rather than a dead one. Upcoming titles have none by design. Also corrected: The Friend You Keep showed an Amazon and a Paperback button pointing at the identical URL (the redundant entry was removed with your approval; the paperback link is unchanged). Three malformed Goodreads URLs were repaired (one was two links pasted together and returned a 404).

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

Implemented before this program and re-verified: `scripts/indexnow-submit.mjs` exists, and the key file is served live at `https://authorgaurav.com/2cde870b3d8e51281ed6a8d1146efaa6.txt` with matching content. It is manual by design (only genuinely changed URLs). No submission has been made during this program, because the changes are not deployed yet. After you deploy, submit the changed pages with `npm run indexnow -- <path> ...` from PowerShell.

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

## 20. Performance results

**Lighthouse itself could not be run here** (Chrome would not launch from the Lighthouse CLI in this environment), so no Lighthouse scores are claimed. Instead, Core Web Vitals were measured directly in a browser against the production build, using Lighthouse's mobile profile (1.6 Mbps, 150ms RTT, 4x CPU slowdown).

| Mobile, throttled | LCP | CLS | TBT | INP (estimate) |
|---|---|---|---|---|
| Home | 3.8s | 0.001 | 270ms | 56ms |
| Books | 1.4s | 0.002 | 146ms | 48ms |
| Shadow Code | 3.5s | 0.000 | 218ms | 48ms |
| Offbeat Love | 3.6s | 0.000 | 167ms | 64ms |
| Journal | 1.9s | 0.001 | 181ms | 56ms |
| Where to Buy | 1.5s | 0.001 | 151ms | 56ms |

Desktop (unthrottled): LCP under 0.3s on the home, Books and Shadow Code pages; CLS 0.001-0.078.

The big finding: layout shift was 0.2-0.67 on most pages before, and is now at or near zero. The cause was architectural: each page is shipped as pre-rendered HTML, but React then wiped it and rebuilt it after fetching data, so the whole page vanished and reappeared. The static page now stays on screen while the live app renders invisibly, and the two are swapped in one step when its data has arrived (`src/main.tsx`, `src/lib/appReady.ts`, with unit tests). If the app is slow, a 4-second timeout swaps it in anyway.

**Not met: LCP of 2.5s or less on the home and book pages under this throttled profile (3.5-3.8s).** On a saturated slow link the cover image and heading wait behind JavaScript. Real devices on typical 4G will be faster than this profile, but I have no field data. Closing the rest of the gap means hydrating the page with its data embedded instead of refetching it, which is a larger change than polish and was not attempted. Interaction metrics (TBT, INP) are comfortably inside their targets.

## 21. Link-validation results

38 pages scanned, 0 failures. The 1,791 warnings are all one kind: internal links written without a trailing slash (for example `/books`) while canonical URLs use one; GitHub Pages redirects these. Not blocking, and not changed. A new `validate:build-seo` check (also now run in CI after the build) found 0 failures across all 38 built pages, with 16 warnings (long titles and a few short or long meta descriptions, listed in its output). `validate:production-seo` against the live site (the currently deployed version) returned 38 of 38 pages with a real HTTP 200 and 0 failures.

## 22. Remaining factual information required from the author

- A higher-resolution author photo for a "Print Resolution" download.
- Real sample chapters, if any exist, for Shadow Code and the Hindi, memoir and devotional titles (set `sample_url` in /admin; it appears automatically).
- The approved English title for निर्दोष गैंगस्टर (Amazon and Goodreads use "Innocent Gangster"; the site shows only the Hindi title).
- Real retail links for A Journey of Grace.
- Verified LinkedIn, BookBub and YouTube profile URLs, if they exist. Not guessed, because "Gaurav Mishra" is a shared name (see item 23).
- Themes, author's note and formats for each book, and country data per retailer, if the original brief's Format and Country grouping is still wanted.
- Real interviews or press coverage when they exist.
- Fuller meta descriptions for the five upcoming titles (two are under 40 characters).

## 23. Remaining owner actions

1. **Deploy and confirm CI.** The last deploy run I could inspect (#137, before the retailer data fix) failed at `validate:content`. You told me you re-ran it; I could not see the result from here. Local `validate:content` now passes. After you push, confirm the run is green.
2. After deploying: run `npm run validate:production-seo`, then submit the changed pages with `npm run indexnow`.
3. Set up Google Search Console and Bing Webmaster Tools from the two checklists; submit the sitemap; request indexing for the listed pages. Indexing is Google's and Bing's schedule, not something this site can force.
4. Fix the **Goodreads author link**: the author link on every book's Goodreads page resolves to an unrelated "Gaurav Mishra" (an Indian Polity exam-prep author), so use Goodreads' Author Program to claim your own profile.
5. Decide whether to keep the six-month editorial calendar as it stands; each article still needs your writing and review (the spiritual ones in particular need accuracy checking).
6. A database migration (`add_verification_fields_to_testimonials`) and several data fixes were applied directly to the live Supabase project during the program; they take effect immediately and are independent of any git push.
7. Everything described here is committed locally and has **not been pushed**.

## 24. Final website quality assessment

What the evidence supports: the site is consistent about which book is current; it no longer promises a free chapter, a sample or a review it cannot deliver; its contact, purchase and press surfaces contain only verifiable facts; every public page has one H1, valid structured data, a matching canonical and a real HTTP 200; text is readable at every size tested; the pages no longer jump while loading; and the automated checks (typecheck, lint, 13 unit tests, 132 end-to-end tests, 28-route axe scan, content, link and SEO validators) all pass from a clean install.

What it does not yet demonstrate: Lighthouse scores (not measurable here), mobile LCP inside 2.5s on a slow connection for the home and book pages, any field data from real users, search visibility (nothing has been submitted or indexed by this program), or a manual assistive-technology review. Several content gaps in item 22 are the author's to fill, and the site's strength in discoverability depends mostly on what gets written and earned from here, not on further code changes.
