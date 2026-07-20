#!/usr/bin/env node
// Regenerates public/sitemap.xml from the app's static routes plus book
// slugs fetched from Supabase. Runs automatically before `npm run build`
// (see package.json "prebuild"); run `npm run sitemap` to regenerate it
// manually. Needs VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY in the
// environment (loaded from .env locally, or from CI secrets).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Minimal .env loader so this plain Node script sees the same vars Vite
// would — no extra dependency needed.
const envPath = resolve(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

const SITE_URL = 'https://authorgaurav.com';

const staticRoutes = ['/', '/books', '/about', '/blog', '/news', '/testimonials', '/start-here', '/write-together-hub', '/contact'];

let bookRoutes = [];
let blogRoutes = [];
const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = process.env;
if (VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY) {
  const [booksRes, postsRes] = await Promise.all([
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_books?select=slug`, { headers: { apikey: VITE_SUPABASE_ANON_KEY } }),
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_blog_posts?select=slug`, { headers: { apikey: VITE_SUPABASE_ANON_KEY } }),
  ]);
  if (booksRes.ok) {
    const books = await booksRes.json();
    bookRoutes = books.map((b) => `/books/${b.slug}`);
  } else {
    console.warn(`Warning: could not fetch book slugs from Supabase (${booksRes.status}); sitemap will omit /books/:slug routes.`);
  }
  if (postsRes.ok) {
    const posts = await postsRes.json();
    blogRoutes = posts.map((p) => `/blog/${p.slug}`);
  } else {
    console.warn(`Warning: could not fetch blog post slugs from Supabase (${postsRes.status}); sitemap will omit /blog/:slug routes.`);
  }
} else {
  console.warn('Warning: VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set; sitemap will omit /books/:slug and /blog/:slug routes.');
}

const routes = [...staticRoutes, ...bookRoutes, ...blogRoutes];

const urlset = routes
  .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`Generated public/sitemap.xml with ${routes.length} routes.`);
