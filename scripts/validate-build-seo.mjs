#!/usr/bin/env node
// Checks the BUILT site (dist/) before deploy: every URL in the generated
// sitemap must have a pre-rendered page with a title, description, single
// canonical matching the sitemap, Open Graph basics, exactly one H1, a lang
// attribute, valid JSON-LD, and no accidental noindex. Run `npm run build`
// first. Production counterpart: validate-production-seo.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { auditHtml, crossPageIssues, parseSitemapLocs, report } from './lib/seo-checks.mjs';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const sitemapPath = join(dist, 'sitemap.xml');

if (!existsSync(sitemapPath)) {
  console.error('dist/sitemap.xml not found - run `npm run build` first.');
  process.exitCode = 1;
} else {
  const locs = parseSitemapLocs(readFileSync(sitemapPath, 'utf-8'));
  const results = [];
  for (const url of locs) {
    const path = new URL(url).pathname;
    const file = join(dist, path === '/' ? '' : path, 'index.html');
    if (!existsSync(file)) {
      results.push({ url, issues: [{ severity: 'fail', kind: 'missing-page', detail: `no pre-rendered file at ${file}` }] });
      continue;
    }
    const { issues, title, description } = auditHtml(readFileSync(file, 'utf-8'), url);
    results.push({ url, issues, title, description });
  }
  const fails = report('Build SEO validation', results, crossPageIssues(results.filter((r) => r.title)));
  if (fails > 0) process.exitCode = 1;
}
