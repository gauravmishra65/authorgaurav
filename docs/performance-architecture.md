# How pages load: pre-render, swap, prefetch, deferred boot

The site is a React single-page app hosted on GitHub Pages, but every public page is also shipped as a complete, pre-rendered HTML file. This note explains how the two fit together, because the way they interact is not obvious from any single file and it is easy to break.

## The pieces

1. **Pre-render** (`scripts/prerender.mjs`, runs inside `npm run build`). A headless browser loads each public route, waits for its real content, and saves the finished DOM to `dist/<route>/index.html`. Visitors and crawlers get a real page with no JavaScript needed.

2. **Swap, not wipe** (`src/main.tsx`, `src/lib/appReady.ts`). When the app boots on a pre-rendered page, `#root` already holds the page. The app renders into a separate, invisible `#app` container, and once it has its data (`useSupabaseData` reports in-flight loads to `appReady`) the two are swapped in a single step. Rendering straight over `#root` instead used to wipe the page and rebuild it, which scored 0.2-0.67 on layout shift. A 4-second timeout swaps anyway, so a slow database can't leave the visitor on a non-interactive snapshot. When `#root` is empty (dev server, the 404 shell) or `window.__PRERENDER__` is set (the capture itself), the app just renders into `#root`.

3. **Data prefetch** (`withPrefetch` in `prerender.mjs`, `prefetchAwareFetch` in `src/lib/supabase.ts`). During capture the script records which Supabase reads each page makes and writes them back into the page as a tiny inline `<script data-prefetch>` that starts those requests immediately. For the first 15 seconds of the page's life the app's own matching anonymous GET requests share those responses (cloned), so data arrives earlier and components that ask for the same list share one request. A signed-in admin session, any write, a different URL, or an old page all use a normal fetch.

4. **Deferred boot** (`withDeferredBoot` in `prerender.mjs`). The app bundle isn't needed to show a pre-rendered page, so its `<script type="module">` and chunk preloads are removed from `<head>` and requested on the page's `load` event instead (5-second backstop), so they stop competing with the hero image, fonts and CSS. During capture it boots immediately.

5. **Hero preload** (`withHeroPreload` in `prerender.mjs`). The hero cover is the largest paint but sits in `<body>`, so the browser finds it late. The first image the app marked `fetchpriority="high"` is also declared in `<head>` as `<link rel="preload" as="image" data-hero imagesrcset=... imagesizes=...>` with the same `srcset`/`sizes`, so the same file is fetched once, immediately.

6. **404 shell.** `dist/404.html` is the empty app shell, saved before the homepage snapshot overwrites `dist/index.html`. Routes that aren't pre-rendered (`/reader-circle/welcome/`, `/admin/*`) get it and render straight away, instead of flashing a copy of the homepage.

## Rules that keep it working

- Don't call `createRoot(...).render()` onto a non-empty `#root` without the swap logic.
- Anything fetched for a page should go through `useSupabaseData` so the swap waits for it.
- `<meta charset>` must stay within the first 1024 bytes - the prefetch script is deliberately inserted after it.
- The strip patterns in `prerender.mjs` (`data-prefetch`, `data-boot`, `data-hero`) match both the bare attribute and `=""`, because the browser serialises the attribute the second way. Pages are captured through the SPA fallback (which serves the already-written homepage), so unstripped scripts would pile up on every page.
- Fraunces uses `font-display: block`, not `swap` (`src/fonts.css`): the static and live headings must paint identically, or the swap registers as a new, larger "largest paint".
- Cover images: `npm run images:variants` generates the 160-640px `.webp` siblings `BookCover` builds its `srcset` from. Run it after adding or replacing a cover.

## What guards it

- `e2e-prerendered/swap.spec.ts` (`npm run test:e2e:prerendered`, also in CI): runs against the production build - one H1 after the swap, no console errors, layout shift under 0.25, working mobile menu, nav highlight on the canonical slashed URL.
- `src/lib/appReady.test.ts`: the readiness logic.
- `e2e/contrast.spec.ts`: text contrast, because axe can't resolve backgrounds on this site.
- `npm run validate:build-seo`: canonical, title, description, Open Graph, one H1 and valid JSON-LD for every built page.

## Measured results

Core Web Vitals under a Lighthouse-style mobile profile (slow 4G, 4x CPU) on the production build, before and after: layout shift 0.2-0.67 to about 0.00; home LCP 4.6s to 2.0s; book pages 3.2-3.6s to 1.5-1.9s. Lighthouse mobile: performance 91-97, accessibility, best-practices and SEO 100 (home 94); desktop 100 across the board. Field data from real visitors has not been collected.
