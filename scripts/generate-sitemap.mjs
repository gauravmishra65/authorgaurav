#!/usr/bin/env node
// Regenerates public/sitemap.xml from the app's static routes plus book
// slugs. Runs automatically before `npm run build` (see package.json
// "prebuild"); run `npm run sitemap` to regenerate it manually.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SITE_URL = 'https://authorgaurav.com';

const staticRoutes = ['/', '/books', '/about', '/blog', '/news', '/write-together-hub', '/contact'];

const booksSource = readFileSync(resolve(root, 'src/data/books.ts'), 'utf-8');
const slugs = [...booksSource.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const bookRoutes = slugs.map((slug) => `/books/${slug}`);

const routes = [...staticRoutes, ...bookRoutes];

const urlset = routes
  .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`Generated public/sitemap.xml with ${routes.length} routes.`);
