#!/usr/bin/env node
// Static link auditor for the *built* site (dist/, produced by `npm run
// build`, which runs the sitemap generator + Vite build + prerender.mjs
// before this can run). Run via `npm run validate:links`, or as a CI gate
// before deploy (see package.json). Checks only what can be verified from
// the files on disk — it does not make outbound network requests, so it
// says nothing about whether an *external* retailer/social URL is currently
// reachable (that's a manual/periodic check, not a build gate: a temporary
// third-party outage should not block a deploy of our own site).
//
// Fails the build (exit 1) on:
//   - href="#" anywhere in rendered output
//   - empty href="" or src=""
//   - javascript:void(...) hrefs
//   - hrefs pointing at localhost
//   - internal (root-relative) links to a route with no matching
//     dist/<route>/index.html
//   - internal asset links (images, downloads) to a file that doesn't exist
//   - a page's canonical <link> and og:url meta disagreeing with each other
//   - a page's canonical URL not present in dist/sitemap.xml
//   - a sitemap.xml <loc> that isn't https, isn't trailing-slash normalized
//     (or root "/"), or has no corresponding dist/<path>/index.html
// Everything else (external http(s) links) is recorded for the report as
// "external — not verified by this script" rather than silently ignored.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');
const SITE_URL = 'https://authorgaurav.com';

if (!existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

/** Recursively collects every dist/**\/index.html, paired with its route
 * (root-relative, trailing-slash form, e.g. "/books/the-shadow-code/"). */
function collectPages(dir, base = '') {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      pages.push(...collectPages(full, `${base}/${entry}`));
    } else if (entry === 'index.html') {
      pages.push({ route: base === '' ? '/' : `${base}/`, file: full });
    }
  }
  return pages;
}

/** Every real, non-HTML file under dist/ (assets, downloads, etc.), as
 * root-relative paths — used to confirm an internal asset link resolves. */
function collectAssets(dir, base = '') {
  const assets = new Set();
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      for (const a of collectAssets(full, `${base}/${entry}`)) assets.add(a);
    } else {
      assets.add(`${base}/${entry}`);
    }
  }
  return assets;
}

const pages = collectPages(dist);
const routeSet = new Set(pages.map((p) => p.route));
const allFiles = collectAssets(dist);

const sitemapPath = join(dist, 'sitemap.xml');
const sitemapUrls = existsSync(sitemapPath)
  ? [...readFileSync(sitemapPath, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  : [];

const issues = []; // { severity: 'fail'|'warn', route, kind, detail }
const externalLinks = new Map(); // href -> Set(routes)

function addIssue(severity, route, kind, detail) {
  issues.push({ severity, route, kind, detail });
}

const HREF_SRC_RE = /(?:href|src)="([^"]*)"/g;

for (const { route, file } of pages) {
  const html = readFileSync(file, 'utf-8');

  for (const match of html.matchAll(HREF_SRC_RE)) {
    const href = match[1];

    if (href === '#') { addIssue('fail', route, 'href-hash', 'href="#" found in rendered output'); continue; }
    if (href.trim() === '') { addIssue('fail', route, 'empty-href', 'empty href/src attribute'); continue; }
    if (/^javascript:void\(/i.test(href)) { addIssue('fail', route, 'javascript-void', `href="${href}"`); continue; }
    if (/localhost/i.test(href)) { addIssue('fail', route, 'localhost', `href="${href}"`); continue; }
    if (/^https?:\/\/example\.com/i.test(href)) { addIssue('fail', route, 'placeholder-domain', `href="${href}"`); continue; }

    if (href.startsWith('/') && !href.startsWith('//')) {
      // Internal link. Anything with a file extension is an asset; anything
      // without is a client-side route.
      const [pathOnly] = href.split(/[?#]/);
      const ext = extname(pathOnly);
      if (ext) {
        if (!allFiles.has(pathOnly)) {
          addIssue('fail', route, 'missing-asset', `${href} has no matching file in dist/`);
        }
      } else {
        const normalized = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
        if (!routeSet.has(normalized)) {
          addIssue('fail', route, 'missing-route', `${href} has no matching dist/<route>/index.html`);
        } else if (pathOnly !== '/' && !href.endsWith('/')) {
          addIssue('warn', route, 'non-trailing-slash-internal-link', `${href} omits the trailing slash (still resolves, but via redirect rather than a direct 200)`);
        }
      }
    } else if (/^https?:\/\//i.test(href)) {
      if (!externalLinks.has(href)) externalLinks.set(href, new Set());
      externalLinks.get(href).add(route);
    }
  }

  // Canonical vs og:url vs sitemap consistency.
  const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/);
  const ogUrlMatch = html.match(/property="og:url" content="([^"]+)"/);
  const canonical = canonicalMatch?.[1];
  const ogUrl = ogUrlMatch?.[1];

  if (!canonical) {
    addIssue('fail', route, 'missing-canonical', 'no <link rel="canonical"> found');
  } else {
    if (!canonical.startsWith('https://')) addIssue('fail', route, 'non-https-canonical', canonical);
    if (ogUrl && ogUrl !== canonical) addIssue('fail', route, 'canonical-og-mismatch', `canonical=${canonical} og:url=${ogUrl}`);
    if (sitemapUrls.length > 0 && !sitemapUrls.includes(canonical)) {
      addIssue('fail', route, 'canonical-not-in-sitemap', `${canonical} has no matching sitemap.xml <loc>`);
    }
    const expected = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    if (canonical !== expected) {
      addIssue('fail', route, 'canonical-mismatch', `expected ${expected}, found ${canonical}`);
    }
  }
}

// Sitemap self-consistency: every <loc> must be https, trailing-slash (or
// root), and point at a route we actually pre-rendered.
for (const loc of sitemapUrls) {
  if (!loc.startsWith('https://')) addIssue('fail', 'sitemap.xml', 'non-https-sitemap-url', loc);
  const path = loc.replace(SITE_URL, '') || '/';
  if (path !== '/' && !path.endsWith('/')) addIssue('fail', 'sitemap.xml', 'non-trailing-slash-sitemap-url', loc);
  if (!routeSet.has(path)) addIssue('fail', 'sitemap.xml', 'sitemap-route-not-prerendered', `${loc} has no matching dist/<route>/index.html`);
}
for (const route of routeSet) {
  const loc = `${SITE_URL}${route === '/' ? '/' : route}`;
  if (!sitemapUrls.includes(loc)) addIssue('warn', route, 'route-not-in-sitemap', `pre-rendered but absent from sitemap.xml (${loc})`);
}

const failCount = issues.filter((i) => i.severity === 'fail').length;
const warnCount = issues.filter((i) => i.severity === 'warn').length;

const reportsDir = resolve(root, 'reports');
mkdirSync(reportsDir, { recursive: true });

const jsonReport = {
  generatedAt: new Date().toISOString(),
  pagesScanned: pages.length,
  failCount,
  warnCount,
  externalLinkCount: externalLinks.size,
  issues,
  externalLinks: [...externalLinks.entries()].map(([href, routes]) => ({
    href, seenOn: [...routes], status: 'external — not verified by this script (no network calls made)',
  })),
};
writeFileSync(join(reportsDir, 'link-validation-report.json'), JSON.stringify(jsonReport, null, 2));

const md = [
  '# Link Validation Report',
  '',
  `Generated: ${jsonReport.generatedAt}`,
  `Pages scanned: ${pages.length}`,
  `Failures: ${failCount}`,
  `Warnings: ${warnCount}`,
  `External links referenced (not verified — this script makes no network calls): ${externalLinks.size}`,
  '',
  '## Failures',
  '',
  failCount === 0 ? '_None._' : issues.filter((i) => i.severity === 'fail').map((i) => `- **${i.kind}** on \`${i.route}\`: ${i.detail}`).join('\n'),
  '',
  '## Warnings',
  '',
  warnCount === 0 ? '_None._' : issues.filter((i) => i.severity === 'warn').map((i) => `- **${i.kind}** on \`${i.route}\`: ${i.detail}`).join('\n'),
  '',
  '## External links seen (unverified by this script)',
  '',
  ...[...externalLinks.entries()].map(([href, routes]) => `- ${href} — seen on: ${[...routes].join(', ')}`),
  '',
].join('\n');
writeFileSync(join(reportsDir, 'link-validation-report.md'), md);

console.log(`Link validation: ${pages.length} pages scanned, ${failCount} failure(s), ${warnCount} warning(s).`);
console.log('Reports written to reports/link-validation-report.{json,md}');

if (failCount > 0) {
  console.error('\nFailures:');
  for (const i of issues.filter((i) => i.severity === 'fail')) console.error(`  [${i.kind}] ${i.route}: ${i.detail}`);
  process.exitCode = 1;
}
