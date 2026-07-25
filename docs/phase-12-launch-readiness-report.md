# authorgaurav.com — Phase 12 Final Handover Report

Date: 2026-07-26
Scope: Performance, accessibility, responsive, security, and SEO audit; final pre-launch technical checks.

---

## 1. Original problems found

- Main JS bundle was monolithic (565 kB / 155 kB gzip) — every route's code downloaded on every visit.
- Five production images were oversized for their display size (nav logo 713 kB, author portrait 661 kB, three book covers 300–360 kB each), inflating LCP.
- Hero image had stale `width`/`height` attributes (mismatched the actual file), and no `fetchPriority`/`loading="eager"` hint.
- `fetchPriority="high"` had been added in camelCase, which this project's React 18.3 runtime silently drops (only React 19 wires the camelCase prop to the DOM attribute) — the LCP hint was never actually reaching the browser.
- Skip-to-content link existed but its target (`<main id="main-content">`) had no `tabindex`, so activating it never actually moved keyboard focus — the skip link was non-functional.
- `TestimonialModal` (the per-book "Add a Testimonial" popup) had no dialog semantics: no `role="dialog"`, no focus trap, no Escape-to-close, no initial focus, and no return-focus — unlike the site's other modal (`MobileNavigation`), which already does all of this correctly.
- Four pages (`Media`, `Readers`, `Book Clubs`, `Writing Resources`) had no `<h1>` at all — their opening heading rendered as `<h2>` via the shared `SectionHeading` component.
- The homepage-scrolling carousel only paused its auto-scroll on `:hover`, leaving keyboard-only users with no way to pause continuously-moving content (WCAG 2.2.2).
- The Contact page overflowed horizontally at 320–430px viewports: an unwrapped `flex` row of four labeled social pills forced the shared (columns-less-at-mobile) grid track to ~432 px, dragging the entire contact form wider than the viewport.
- `scripts/generate-sitemap.mjs` emitted raw, unencoded `<loc>` values — a live, malformed DB row (`slug = "शैडो कोड"`, raw Devanagari with a space) produced an invalid sitemap entry and a broken, non-canonical live URL.
- A duplicate "upcoming, featured" book row existed in `authorgaurav_books` with the Hindi title used as both `title` and `slug`, empty tagline/synopsis, and placeholder buy links — it was rendering as a real Featured Release on `/books`.
- The orphaned `launch-signup` Supabase Edge Function (retired from the frontend in Phase 11) remained live with none of the protections its siblings have — no honeypot, no rate limit, no email-format validation.
- No automated test suite exists in this project (no Jest/Vitest config) — all verification has always been manual (typecheck/lint/build + live browser testing).

## 2. Main changes completed

- Route-based code splitting for every public page except `Home` via `React.lazy`, with a single `Suspense` boundary in `Layout.tsx` around `<Outlet/>` so Nav/Footer stay mounted across route transitions.
- Resized 5 oversized image assets in place (same filenames, so no reference changes needed): author portrait 661 kB→115 kB, nav logo 713 kB→109 kB, three book covers ~300–360 kB→150–174 kB each.
- Corrected stale `width`/`height` attributes on the hero/about images to match the resized files; fixed the `fetchPriority` casing bug (`fetchpriority` lowercase + `@ts-expect-error`, with a matching ESLint `no-unknown-property` allowlist entry) so the LCP hint actually reaches the DOM.
- Added `tabIndex={-1}` to `<main id="main-content">` so the skip link actually moves focus.
- Rebuilt `TestimonialModal` with the same accessible-dialog pattern already used by `MobileNavigation`: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape-to-close, initial focus, return-focus-to-trigger.
- Added an optional `level` prop to `SectionHeading` (defaults to `h2`) and set `level="h1"` on the first heading of `Media`, `Readers`, `Book Clubs`, and `Writing Resources` — each page now has exactly one `<h1>`.
- Added `:focus-within` alongside `:hover` to the carousel's pause rule (`.carousel-track`, `.carousel-track-ltr`).
- Added `flex-wrap` to the Contact page's social-pill row, eliminating the 320–430px horizontal overflow.
- Hardened `generate-sitemap.mjs` to `encodeURI()` every `<loc>` value, so a malformed slug can never again produce invalid XML.
- Fixed the bad DB row's slug (`शैडो कोड` → `shadow-code-hindi`) — content fields (tagline, synopsis, real buy links) were intentionally left for you to fill in, per your choice not to delete the row.
- npm audit: bumped what could be bumped without a breaking change; documented the rest (see §19).

## 3. Files created

- `docs/newsletter-and-analytics.md` (Phase 11)
- `docs/phase-12-launch-readiness-report.md` (this file)
- (Phase 11) `supabase/functions/newsletter-subscribe/index.ts`, `src/lib/analytics.ts`, `src/data/readerMagnets.ts`

## 4. Files modified (this phase)

`src/App.tsx`, `src/components/Layout.tsx`, `src/components/SectionHeading.tsx`, `src/components/TestimonialModal.tsx`, `src/components/Nav.tsx`, `src/pages/Home.tsx`, `src/pages/About.tsx`, `src/pages/Media.tsx` (×2: heading level + image dims), `src/pages/Readers.tsx`, `src/pages/BookClubs.tsx`, `src/pages/WritingResources.tsx`, `src/pages/Contact.tsx`, `src/components/AboutTeaser.tsx`, `src/index.css`, `eslint.config.js`, `scripts/generate-sitemap.mjs`, `public/images/author/GM-Photo.jpg`, `public/images/brand/logo-full.png`, `public/images/book-covers/generated-image.webp`, `generated-image_(4).webp`, `generated-image-1.webp` (all resized in place), `package.json`/`package-lock.json` (npm audit fix).

Database: one row in `authorgaurav_books` (`id a286e615-...`) had its `slug` corrected from `शैडो कोड` to `shadow-code-hindi`.

## 5. Routes (current, full list)

Public: `/`, `/books`, `/books/:slug`, `/about`, `/blog`, `/blog/:slug`, `/news`, `/write-together-hub`, `/testimonials`, `/start-here`, `/contact`, `/media`, `/readers`, `/events`, `/book-clubs`, `/writing-resources`, `/privacy-policy`, `/terms`, `/accessibility`, `*` (404).
Admin (auth-gated, code-split): `/admin/books`, `/testimonials`, `/testimonial-submissions`, `/blog`, `/blog/:id/content`, `/news`, `/events`, `/subscribers`, `/messages`.

## 6. Book themes implemented

Four books have a fully bespoke visual theme (background component, accent colors, slug-conditional sections in `BookDetail.tsx`): `the-shadow-code`, `offbeat-love`, `lalita-sahasranama`, `vishnu-sahasranama`. Other books use the shared default template.

## 7. SEO improvements (this phase)

- Fixed the invalid/unencoded sitemap entry and the underlying bad slug (see §1).
- Hardened the sitemap generator against any future malformed-slug data.
- No other SEO regressions found: titles/descriptions are unique per page (checked programmatically), canonical/OG/Twitter meta are set centrally via `Seo.tsx`, Person/WebSite JSON-LD is in `index.html`, and Book/Article/BreadcrumbList/Event JSON-LD are wired per-page — Event schema is built only from real, fetched event rows, never fabricated.

## 8. Accessibility improvements

- Fixed the non-functional skip link (§1).
- Rebuilt `TestimonialModal` as a real accessible dialog.
- Gave `Media`, `Readers`, `Book Clubs`, `Writing Resources` a real `<h1>`.
- Made the homepage carousel pausable by keyboard (`:focus-within`), not just mouse hover.
- Manually keyboard-tested: skip link (now confirmed focusable), Books dropdown, mobile nav drawer (focus trap/Escape/return-focus — already correct), form tab order and `aria-invalid`/`aria-describedby`/`role="alert"` wiring on Contact/Newsletter/Testimonial forms.
- Reviewed and are choosing **not** to change without your sign-off: the site's gold-accent text (`#B18A4A`) on cream/ivory backgrounds measures ≈3.0:1 contrast, below the 4.5:1 AA threshold for normal-size text (it's used for small "eyebrow" captions and outline-button text, not body copy). Fixing this means darkening a brand color you've iterated on carefully in earlier phases, so I'm flagging it rather than recoloring the site. Recommended next step: either accept it (the same information is always duplicated in an adjacent full-contrast heading) or pick a slightly darker gold for small-text contexts specifically.
- Hindi (`lang="hi"`) is already applied thoroughly and correctly on every Devanagari section of `BookDetail.tsx`.

## 9. Performance improvements

- Route-based code splitting: main bundle 565 kB→451 kB gzip (155 kB→128 kB gzip); every other page now loads its own small chunk on demand (largest is `BookDetail` at 32 kB / 9.7 kB gzip).
- ~1.6 MB→~712 kB across 5 resized images; the two highest-impact fixes (nav logo, author portrait) load on nearly every page view.
- `fetchPriority`/`loading="eager"` LCP hints on the two hero-candidate images now actually reach the DOM (previously silently dropped — see §1).
- Confirmed already-correct and left untouched: Google Fonts' combined stylesheet auto-splits by `unicode-range`, so Devanagari font bytes are never downloaded on English-only pages; no video/iframe embeds exist anywhere (trailers are plain outbound links, so "click-to-play instead of autoplay" is trivially satisfied); CSS bundle is a single 35.5 kB (8.2 kB gzip) file, reasonable for the site's size.

## 10. Analytics events (from Phase 11, verified still correct)

`homepage_cta_click`, `book_view`, `retailer_click`, `amazon_click`, `sample_download`, `trailer_play`, `newsletter_signup`, `contact_submit`, `media_kit_download`, `discussion_guide_download`, `event_registration_click`, `writetogetherhub_click`. Self-hosted/cookieless via `authorgaurav_analytics_events`; PII keys are stripped defensively before insert.

## 11. Newsletter integration status

Working end-to-end — verified live in this session: submitted a real signup through the homepage form, confirmed the row landed in `authorgaurav_newsletter_subscribers` with the correct `source`, then removed the test row. Brevo sync is configured but skips gracefully (`status: "skipped"`) if `AUTHORGAURAV_BREVO_API_KEY` isn't set — subscribers are still recorded either way.

## 12. Contact-form status

Working — verified the `?type=media` and `?type=book-club` query params correctly pre-select the enquiry type. Server-side validation, honeypot, and 60-second rate limiting are all in place (`supabase/functions/contact-form`).

## 13. Environment variables

Frontend (`.env`, `VITE_` prefix, safe to expose — protected by RLS): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
Edge functions (Supabase secrets, never in frontend bundle — confirmed): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AUTHORGAURAV_RESEND_API_KEY`, `AUTHORGAURAV_BREVO_API_KEY`, `AUTHORGAURAV_BREVO_LIST_ID_THRILLERS/ROMANCE/SPIRITUAL/WRITING/ALL`. See `docs/newsletter-and-analytics.md` for full setup steps.

## 14. Missing factual content (do not fabricate — flagging for you)

- No book has a real sample chapter (`BookSample` correctly never renders without one) — Journey "Books → Offbeat Love → Sample" has no Sample link to click today.
- Blog articles have no "related book" cross-link feature at all (not a bug — it was never built). The named journey "Article → Related book → Retailer" isn't something the current site can do; building it would be a new feature, out of scope for this bug-fix-only audit phase.
- The `shadow-code-hindi` book row (see §1) has an empty tagline/synopsis and placeholder (`#`) buy links — needs real content before it should be promoted anywhere.
- Only "Writing resources" has a real reader-magnet download file; the other four interests show no download link, correctly, since no real file exists for them yet.

## 15. Local dev command

```bash
npm run dev
```

## 16. Production build command

```bash
npm run build
```
(runs `sitemap` before and `copy-spa-fallback` after automatically via `prebuild`/`postbuild`)

## 17. Deployment instructions

Push to the branch GitHub Actions watches; the existing workflow builds and deploys `dist/` to GitHub Pages. No changes to the deploy pipeline were made this phase. **Nothing in this session has been pushed** — all work is local, per standing instructions.

## 18. Test results

- `npm run typecheck` — clean.
- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run build` — succeeds; no chunk-size warning; sitemap regenerates with valid, encoded URLs.
- No automated unit/integration test suite exists in this project — there is no `test` script and no test framework configured. All functional verification (forms, navigation, responsive layout, keyboard interaction) was done manually via a live browser this session; this is not a regression from this phase, it has been true throughout the project.
- `npm audit` — 10 vulnerabilities (3 moderate, 7 high): the eslint/minimatch chain and esbuild/vite are dev-tooling-only (no production runtime exposure); react-router-dom's two CVEs don't meaningfully apply here (SSR-hydration CVE is irrelevant to this client-only SPA; the open-redirect CVE needs an attacker-controlled `Link to=` value, and every `to=`/`href=` in this codebase is a hardcoded string). Fixing it fully requires a react-router v6→v7 major-version upgrade, which is a breaking change out of scope for "no major new features."

## 19. Remaining risks

- **The orphaned `launch-signup` Edge Function is still live and unprotected** (no honeypot, no rate limit, no email validation) — unlike its actively-used siblings. It's unreachable from the current frontend, but the URL is guessable/discoverable. Recommend either deleting it or adding the same protections `contact-form`/`newsletter-subscribe` already have.
- Gold-accent text-on-cream contrast (~3.0:1) is below WCAG AA for normal text — flagged in §8, not fixed without your sign-off.
- GitHub Pages can't serve custom HTTP response headers, so there's no CSP/X-Frame-Options/etc. at the network level. A `<meta http-equiv="Content-Security-Policy">` tag is possible but needs careful tuning against this site's actual external dependencies (Google Fonts, Supabase, Brevo, Resend) to avoid breaking anything — recommend as a deliberate, tested follow-up rather than a same-session addition.
- The `shadow-code-hindi` book (§14) is live with `status: "upcoming"`, `featured: true`, and a real release date, but has no real synopsis/tagline/buy links — worth completing or unpublishing before it gets meaningful traffic.
- Two of the 8 named user journeys assume features that don't exist yet (Sample chapter, Article→Related-book) — see §14.

## 20. Recommended post-launch actions

1. Decide the `launch-signup` function's fate (delete vs. harden) — see §19.
2. Fill in real content for the `shadow-code-hindi` book, or unpublish it until ready.
3. Decide whether to address the gold-on-cream text contrast, and if so, agree a specific replacement shade before I touch the brand palette again.
4. Consider a tested CSP `<meta>` tag as a deliberate follow-up task, not a rushed pre-launch addition.
5. When ready for a react-router v7 upgrade (clears the last real npm-audit finding), budget it as its own migration pass — it's a breaking change.
6. If a real book sample or an article→book cross-link feature is wanted, scope those as new, explicit feature requests rather than assuming they already exist.

---

**Launch-readiness gate:** the production build passes (`npm run typecheck`, `npm run lint`, `npm run build` all clean), and all 8 critical user journeys either work end-to-end or fail only because of documented, pre-existing missing content (not because of a bug) — on that basis, **the site is launch-ready**, with the risks in §19 flagged for your explicit awareness rather than silently left for you to discover later.
