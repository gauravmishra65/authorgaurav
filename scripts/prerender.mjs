#!/usr/bin/env node
// Runs after `vite build`, before the SPA-404-fallback copy (see
// package.json's "build"/"postbuild" scripts). GitHub Pages has no
// server-side routing, so every non-root URL was returning a literal HTTP
// 404 with only the homepage's static <title>/meta/OG/JSON-LD, even though
// the client-side app renders the right page correctly once JS loads. This
// script fixes that at the HTTP layer: for every public route, it loads the
// already-built app in a real headless browser, waits for that route's real
// content to render (client-side data fetch included), and writes the fully
// serialized DOM to `dist/<route>/index.html` — a real static file GitHub
// Pages serves directly with a 200 status and route-specific metadata,
// before any JavaScript runs. The bundled script tag is preserved, so a real
// visitor's browser still boots the live, interactive SPA exactly as today.
//
// Route list is intentionally the same one generate-sitemap.mjs already
// builds (static routes + book/blog slugs from Supabase) — single source of
// truth, and it already excludes /admin/* and anything not meant to be
// public.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const envPath = resolve(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

// /reader-circle/welcome is deliberately excluded — it's a post-signup
// confirmation page (like a "thank you" page), not meant for organic
// discovery/indexing, so it isn't prerendered as a static route or listed
// in the sitemap (see generate-sitemap.mjs).
const staticRoutes = [
  '/', '/books', '/about', '/blog', '/news', '/testimonials', '/start-here', '/write-together-hub', '/contact',
  '/media', '/readers', '/events', '/book-clubs', '/writing-resources', '/interview-resources', '/where-to-buy',
  '/reader-circle', '/privacy-policy', '/terms', '/accessibility',
];

let bookRoutes = [];
let blogRoutes = [];
const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = process.env;
if (VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY) {
  const [booksRes, postsRes] = await Promise.all([
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_books?select=slug`, { headers: { apikey: VITE_SUPABASE_ANON_KEY } }),
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_blog_posts?select=slug`, { headers: { apikey: VITE_SUPABASE_ANON_KEY } }),
  ]);
  if (booksRes.ok) bookRoutes = (await booksRes.json()).map((b) => `/books/${b.slug}`);
  if (postsRes.ok) blogRoutes = (await postsRes.json()).map((p) => `/blog/${p.slug}`);
} else {
  console.warn('Warning: Supabase env vars not set; pre-rendering only static routes (no /books/:slug or /blog/:slug).');
}

const routes = [...staticRoutes, ...bookRoutes, ...blogRoutes];

const GENERIC_TITLE = 'Gaurav Mishra | Author of Shadow Code, Offbeat Love and Spiritual Books';

// GitHub Pages serves 404.html for any route that isn't pre-rendered (e.g.
// /reader-circle/welcome/, /admin/*). It must be the EMPTY app shell, captured
// now before the '/' route below overwrites dist/index.html with the rendered
// homepage - otherwise those routes would flash a copy of the homepage (and
// its data prefetch) before the right page appears.
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));

const server = await preview({ root, preview: { port: 4174, strictPort: true }, logLevel: 'error' });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');

const browser = await chromium.launch();
const page = await browser.newPage();
// Tells src/main.tsx to render straight into #root. Without this, routes
// served through the SPA fallback would load the already-rendered homepage
// (written to dist/index.html first) and the app would treat it as a snapshot
// to keep on screen, capturing duplicated markup.
await page.addInitScript(() => { window.__PRERENDER__ = true; });

const failures = [];
let count = 0;

// Which Supabase REST reads each page makes, recorded during capture and
// written back into the page as an early fetch (see src/lib/supabase.ts).
const supabaseOrigin = VITE_SUPABASE_URL ? new URL(VITE_SUPABASE_URL).origin : null;
let seenReads = new Set();
page.on('request', (req) => {
  if (supabaseOrigin && req.method() === 'GET' && req.url().startsWith(`${supabaseOrigin}/rest/v1/`)) seenReads.add(req.url());
});

function withPrefetch(html, urls) {
  // Serialised by the browser as data-prefetch="" - match both forms, or each
  // page would inherit the previous page's script (pages are captured through
  // the SPA fallback, which serves the already-written homepage).
  const stripped = html.replace(/<script data-prefetch(?:="")?>[\s\S]*?<\/script>/g, '');
  if (!VITE_SUPABASE_ANON_KEY || urls.length === 0) return stripped;
  const script =
    '<script data-prefetch>if(!window.__PRERENDER__){window.__prefetch={};window.__prefetchAt=Date.now();(function(k,u){for(var i=0;i<u.length;i++){' +
    "var p=fetch(u[i],{headers:{apikey:k,Authorization:'Bearer '+k}});p.catch(function(){});window.__prefetch[u[i]]=p}})(" +
    `${JSON.stringify(VITE_SUPABASE_ANON_KEY)},${JSON.stringify(urls)})}</script>`;
  // After <meta charset>, never before it: the charset declaration has to sit
  // within the first 1024 bytes of the document or browsers may re-parse it.
  return stripped.replace(/<meta charset[^>]*>/i, (m) => m + script);
}

// The pre-rendered page is already complete, so the app bundle isn't needed to
// show it - but left in <head> it races the hero image, fonts and CSS for the
// same bandwidth. Hold the entry script (and the chunk preloads the browser
// added while capturing) until the page's own `load` event instead, with a
// 5-second backstop so the app can never fail to start. During capture itself
// (__PRERENDER__) it boots immediately, exactly as before.
function withDeferredBoot(html) {
  const entry = html.match(/<script type="module" crossorigin(?:="")? src="(\/assets\/index-[^"]+\.js)"><\/script>/);
  if (!entry) return html;
  const preloads = [...html.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => m[1]);
  const stripped = html
    .replace(/<script data-boot(?:="")?>[\s\S]*?<\/script>/g, '')
    .replace(/<script type="module" crossorigin(?:="")? src="\/assets\/index-[^"]+\.js"><\/script>/g, '')
    .replace(/<link rel="modulepreload"[^>]*>/g, '');
  const boot =
    `<script data-boot>(function(){var h=${JSON.stringify([...new Set(preloads)])},e=${JSON.stringify(entry[1])},s=false;` +
    "function go(){if(s)return;s=true;for(var i=0;i<h.length;i++){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h[i];document.head.appendChild(l)}" +
    "var m=document.createElement('script');m.type='module';m.crossOrigin='';m.src=e;document.head.appendChild(m)}" +
    "if(window.__PRERENDER__||document.readyState==='complete')go();else{addEventListener('load',go);setTimeout(go,5000)}})()</script>";
  return stripped.replace(/<\/body>/i, boot + '</body>');
}

for (const route of routes) {
  try {
    seenReads = new Set();
    await page.goto(baseUrl + route, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForSelector('h1', { timeout: 10000 });
    // Non-homepage routes must not still be showing the generic fallback
    // title — that's the exact defect this script exists to fix, so treat
    // it as a hard failure rather than silently shipping a wrong <title>.
    const title = await page.title();
    if (route !== '/' && title === GENERIC_TITLE) {
      throw new Error(`still showing the generic homepage title after waiting — route-specific <Seo> never ran`);
    }

    const html = withDeferredBoot(withPrefetch(await page.content(), [...seenReads]));
    const outDir = route === '/' ? dist : join(dist, ...route.split('/').filter(Boolean));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), `<!doctype html>\n${html}`);
    count++;
  } catch (err) {
    failures.push({ route, message: err.message });
  }
}

await browser.close();
await new Promise((res) => server.httpServer.close(res));

if (failures.length > 0) {
  console.error(`\nPre-render failed for ${failures.length} of ${routes.length} route(s):`);
  for (const f of failures) console.error(`  ${f.route} — ${f.message}`);
  process.exit(1);
}

console.log(`Pre-rendered ${count} route(s) to static dist/<route>/index.html files.`);
