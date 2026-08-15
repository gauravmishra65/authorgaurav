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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const staticRoutes = [
  '/', '/books', '/about', '/blog', '/news', '/testimonials', '/start-here', '/write-together-hub', '/contact',
  '/media', '/readers', '/events', '/book-clubs', '/writing-resources', '/interview-resources', '/where-to-buy',
  '/privacy-policy', '/terms', '/accessibility',
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

const server = await preview({ root, preview: { port: 4174, strictPort: true }, logLevel: 'error' });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');

const browser = await chromium.launch();
const page = await browser.newPage();

const failures = [];
let count = 0;

for (const route of routes) {
  try {
    await page.goto(baseUrl + route, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForSelector('h1', { timeout: 10000 });
    // Non-homepage routes must not still be showing the generic fallback
    // title — that's the exact defect this script exists to fix, so treat
    // it as a hard failure rather than silently shipping a wrong <title>.
    const title = await page.title();
    if (route !== '/' && title === GENERIC_TITLE) {
      throw new Error(`still showing the generic homepage title after waiting — route-specific <Seo> never ran`);
    }

    const html = await page.content();
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
