#!/usr/bin/env node
// Content-completeness auditor. Run via `npm run validate:content`, or as a
// CI gate before deploy (see package.json). Unlike validate-links.mjs (which
// checks the *built* dist/ output), this checks the *data* the site is
// built from: live Supabase rows plus the two static reader-magnet/social
// config files. Needs VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY (same .env
// loader as scripts/generate-sitemap.mjs).
//
// Fails (exit 1) on:
//   - a published book missing title/synopsis/cover image
//   - a featured book with no purchase or pre-order link at all
//   - a duplicate book slug or duplicate blog-post slug
//   - a published book with an empty SEO title/description
//   - a social.ts entry claiming a real (non "#") href that is empty
//   - a readerMagnets.ts entry with a fileUrl pointing at a file that
//     doesn't actually exist under public/
// Warns (non-blocking) on:
//   - an upcoming/preorder book missing SEO fields (less severe: it isn't
//     indexable/shareable yet in the same way a published book is)
//   - a blog post missing an excerpt
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function addIssue(issues, severity, subject, kind, detail) {
  issues.push({ severity, subject, kind, detail });
}

// Mirrors src/data/books.ts's getBuyOptions() — kept in sync manually (same
// pattern already used by src/data/bookClubQuestions.ts for its own
// public/resources mirror). Update both if the real logic changes.
function hasAnyBuyOption(book) {
  const buyLinks = book.buy_links ?? [];
  const realBuyLink = buyLinks.some((l) => l.label !== 'Kindle' && l.href && l.href !== '#');
  const realKindle = Boolean(book.kindle_url) || buyLinks.some((l) => l.label === 'Kindle' && l.href && l.href !== '#');
  const realPaperback = Boolean(book.paperback_url);
  return realBuyLink || realKindle || realPaperback;
}

// Runs everything inside an async main() rather than at module top level so
// every exit path can just `return` — Node's ESM doesn't allow a top-level
// `return`, and calling process.exit() while a fetch()'s underlying socket
// is still being torn down has been observed to crash Node on Windows with
// "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)". Setting
// process.exitCode and letting the module finish naturally avoids that.
async function main() {
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }

  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = process.env;
  if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
    console.error('VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set — cannot fetch content to validate.');
    process.exitCode = 1;
    return;
  }

  const headers = { apikey: VITE_SUPABASE_ANON_KEY };

  const [booksRes, postsRes, photosRes, testimonialsRes] = await Promise.all([
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_books?select=*`, { headers }),
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_blog_posts?select=*`, { headers }),
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_reader_photos?select=*&kind=eq.bookstore`, { headers }),
    fetch(`${VITE_SUPABASE_URL}/rest/v1/authorgaurav_testimonials?select=id,quote,name,source,verified`, { headers }),
  ]);
  if (!booksRes.ok) { console.error(`Failed to fetch books: ${booksRes.status}`); process.exitCode = 1; return; }
  if (!postsRes.ok) { console.error(`Failed to fetch blog posts: ${postsRes.status}`); process.exitCode = 1; return; }
  if (!photosRes.ok) { console.error(`Failed to fetch reader photos: ${photosRes.status}`); process.exitCode = 1; return; }
  if (!testimonialsRes.ok) { console.error(`Failed to fetch testimonials: ${testimonialsRes.status}`); process.exitCode = 1; return; }

  const books = await booksRes.json();
  const posts = await postsRes.json();
  const bookstorePhotos = await photosRes.json();
  const testimonials = await testimonialsRes.json();

  const issues = []; // { severity, subject, kind, detail }

  const slugCounts = new Map();
  for (const book of books) {
    slugCounts.set(book.slug, (slugCounts.get(book.slug) ?? 0) + 1);

    if (book.status === 'published') {
      if (!book.title) addIssue(issues, 'fail', book.slug || book.id, 'missing-title', 'published book has no title');
      if (!book.synopsis) addIssue(issues, 'fail', book.slug, 'missing-synopsis', 'published book has no synopsis');
      if (!book.image_src) addIssue(issues, 'fail', book.slug, 'missing-cover', 'published book has no cover image');
      if (!book.seo_title) addIssue(issues, 'fail', book.slug, 'empty-seo-title', 'published book has no seo_title');
      if (!book.seo_description) addIssue(issues, 'fail', book.slug, 'empty-seo-description', 'published book has no seo_description');
    } else {
      if (!book.seo_title || !book.seo_description) {
        addIssue(issues, 'warn', book.slug, 'empty-seo-fields-unpublished', `${book.status} book is missing SEO fields (less urgent — not yet the canonical, shareable version)`);
      }
    }

    if (book.featured && !hasAnyBuyOption(book)) {
      addIssue(issues, 'fail', book.slug, 'featured-without-purchase-link', 'book is marked featured but has no real purchase/pre-order link (all buy_links/kindle_url/paperback_url are empty or "#")');
    }

    // Catches exactly the kind of accidental paste/concatenation bug found
    // live during the Phase 11 audit (a goodreads_url with the same URL
    // pasted twice back-to-back, and another with a stray leading space) —
    // a URL field with surrounding whitespace or two "http" protocols is
    // never intentional.
    const urlFields = {
      goodreads_url: book.goodreads_url, book_website: book.book_website, sample_url: book.sample_url,
      kindle_url: book.kindle_url, paperback_url: book.paperback_url, shopify_url: book.shopify_url,
      shopee_url: book.shopee_url, lazada_url: book.lazada_url,
    };
    for (const [field, value] of Object.entries(urlFields)) {
      if (!value) continue;
      if (value !== value.trim()) {
        addIssue(issues, 'fail', book.slug, 'malformed-url', `${field} has leading/trailing whitespace: "${value}"`);
      }
      if ((value.match(/https?:\/\//g) ?? []).length > 1) {
        addIssue(issues, 'fail', book.slug, 'malformed-url', `${field} looks like two URLs concatenated together: "${value}"`);
      }
    }

    // Mirrors getBuyOptions()'s own reconciliation exactly — a buy_links
    // entry labeled "Kindle" is a fallback that's superseded by kindle_url,
    // never shown alongside it, so it's excluded here the same way or this
    // would falsely flag every book that has one as a "duplicate".
    const urlCounts = new Map();
    const addUrl = (label, href) => {
      if (!href || href === '#') return;
      const entry = urlCounts.get(href) ?? [];
      entry.push(label);
      urlCounts.set(href, entry);
    };
    const buyLinks = book.buy_links ?? [];
    for (const link of buyLinks) {
      if (link.label === 'Kindle') continue;
      addUrl(link.label, link.href);
    }
    const kindleHref = book.kindle_url || buyLinks.find((l) => l.label === 'Kindle' && l.href !== '#')?.href;
    addUrl('Kindle', kindleHref);
    addUrl('Paperback', book.paperback_url);
    addUrl('Shopify', book.shopify_url);
    addUrl('Shopee', book.shopee_url);
    addUrl('Lazada', book.lazada_url);
    for (const [href, labels] of urlCounts) {
      if (labels.length > 1) {
        addIssue(issues, 'fail', book.slug, 'duplicate-retailer-url', `the same URL (${href}) is used for ${labels.length} retailer entries (${labels.join(', ')}) — confirm these are meant to be separate retailers`);
      }
    }
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) addIssue(issues, 'fail', slug, 'duplicate-book-slug', `slug "${slug}" used by ${count} book rows`);
  }

  // `featured` is the single source of truth for "current release" — the
  // header CTA, homepage hero, and Media's "Current Release" block all
  // derive from it (getFeaturedBook in src/lib/releaseStatus.ts). More than
  // one true would mean they could pick different books depending on
  // array order; zero true is allowed (the date-based fallback applies).
  const featuredSlugs = books.filter((b) => b.featured).map((b) => b.slug);
  if (featuredSlugs.length > 1) {
    addIssue(issues, 'fail', featuredSlugs.join(', '), 'multiple-featured-books', `${featuredSlugs.length} books are marked featured (${featuredSlugs.join(', ')}) — exactly one must be, or the header/hero/Media current-release block can disagree on which book is current`);
  }

  // An upcoming/preorder book must never be able to render a purchase CTA
  // without a genuine link — mirrors getBuyOptions()'s own real/placeholder
  // distinction so this can't silently drift from the UI's actual logic.
  for (const book of books) {
    if (book.status !== 'published' && hasAnyBuyOption(book)) {
      addIssue(issues, 'warn', book.slug, 'upcoming-with-real-purchase-link', `${book.status} book has a real purchase link already — confirm the status should still be "${book.status}" rather than "preorder"/"published"`);
    }
  }

  const postSlugCounts = new Map();
  for (const post of posts) {
    postSlugCounts.set(post.slug, (postSlugCounts.get(post.slug) ?? 0) + 1);
    if (!post.excerpt) addIssue(issues, 'warn', post.slug, 'missing-excerpt', 'blog post has no excerpt');
  }
  for (const [slug, count] of postSlugCounts) {
    if (count > 1) addIssue(issues, 'fail', slug, 'duplicate-post-slug', `slug "${slug}" used by ${count} blog post rows`);
  }

  // Mirrors the dedup groupBookstorePhotosByCity() applies on /where-to-buy:
  // the same store name repeated in the same city is almost always one
  // store that stocks more than one book (one photo row per book), not two
  // branches — this is a warning, not a failure, in case a real second
  // branch does exist and just needs a distinguishing name (e.g.
  // "Bahrisons — Khan Market") added to its caption.
  const storeCityCounts = new Map();
  for (const photo of bookstorePhotos) {
    const [store, city] = (photo.caption ?? '').split(',').map((s) => s.trim());
    if (!store) continue;
    const key = `${store}|${city ?? ''}`;
    storeCityCounts.set(key, (storeCityCounts.get(key) ?? 0) + 1);
  }
  for (const [key, count] of storeCityCounts) {
    if (count > 1) {
      const [store, city] = key.split('|');
      addIssue(issues, 'warn', store, 'duplicate-bookstore-listing', `"${store}"${city ? ` in ${city}` : ''} appears in ${count} reader-photo rows with no distinguishing branch name — confirm whether these are the same store (fine as-is) or different branches (add a branch name to each caption, e.g. "${store} — Khan Market")`);
    }
  }

  // "Public can read verified testimonials" RLS already means this anon-key
  // query can only ever receive rows where verified = true — so a failure
  // here would mean that RLS policy has regressed, not that an unverified
  // testimonial merely exists (unverified rows stay invisible to this
  // script by design; the admin panel is where the owner reviews those).
  for (const t of testimonials) {
    if (t.verified !== true) {
      addIssue(issues, 'fail', t.id, 'unverified-testimonial-visible', `testimonial ${t.id} has verified !== true but was returned by the public-key query — the "Public can read verified testimonials" RLS policy has regressed`);
    }
    if (!t.source) {
      addIssue(issues, 'warn', t.id, 'testimonial-missing-source', `testimonial by "${t.name}" has no source — every published quotation should be traceable to an actual reader, retailer review, publication, interviewer, or event`);
    }
  }

  // Static config files: social.ts and readerMagnets.ts are plain TS, parsed
  // with a small regex rather than imported (this is a standalone Node
  // script, not run through the Vite/TS toolchain).
  const socialSrc = readFileSync(resolve(root, 'src/data/social.ts'), 'utf-8');
  for (const m of socialSrc.matchAll(/\{\s*label:\s*'([^']*)',\s*href:\s*'([^']*)'/g)) {
    const [, label, href] = m;
    if (href !== '#' && !href) addIssue(issues, 'fail', label, 'verified-social-without-url', `social entry "${label}" is not the "#" placeholder but has an empty href`);
    if (href !== '#' && !/^https:\/\//.test(href)) addIssue(issues, 'fail', label, 'non-https-social-url', `social entry "${label}" href "${href}" is not https`);
  }

  const magnetsSrc = readFileSync(resolve(root, 'src/data/readerMagnets.ts'), 'utf-8');
  for (const m of magnetsSrc.matchAll(/fileUrl:\s*'([^']*)'/g)) {
    const fileUrl = m[1];
    const onDisk = resolve(root, 'public', fileUrl.replace(/^\//, ''));
    if (!existsSync(onDisk)) {
      addIssue(issues, 'fail', fileUrl, 'magnet-file-missing', `readerMagnets.ts references fileUrl "${fileUrl}" but public${fileUrl} does not exist`);
    }
  }

  const failCount = issues.filter((i) => i.severity === 'fail').length;
  const warnCount = issues.filter((i) => i.severity === 'warn').length;

  const reportsDir = resolve(root, 'reports');
  mkdirSync(reportsDir, { recursive: true });

  const jsonReport = {
    generatedAt: new Date().toISOString(),
    booksChecked: books.length,
    postsChecked: posts.length,
    failCount,
    warnCount,
    issues,
  };
  writeFileSync(resolve(reportsDir, 'content-validation-report.json'), JSON.stringify(jsonReport, null, 2));

  const md = [
    '# Content Validation Report',
    '',
    `Generated: ${jsonReport.generatedAt}`,
    `Books checked: ${books.length}`,
    `Blog posts checked: ${posts.length}`,
    `Failures: ${failCount}`,
    `Warnings: ${warnCount}`,
    '',
    '## Failures',
    '',
    failCount === 0 ? '_None._' : issues.filter((i) => i.severity === 'fail').map((i) => `- **${i.kind}** (${i.subject}): ${i.detail}`).join('\n'),
    '',
    '## Warnings',
    '',
    warnCount === 0 ? '_None._' : issues.filter((i) => i.severity === 'warn').map((i) => `- **${i.kind}** (${i.subject}): ${i.detail}`).join('\n'),
    '',
  ].join('\n');
  writeFileSync(resolve(reportsDir, 'content-validation-report.md'), md);

  console.log(`Content validation: ${books.length} books, ${posts.length} posts checked — ${failCount} failure(s), ${warnCount} warning(s).`);
  console.log('Reports written to reports/content-validation-report.{json,md}');

  if (failCount > 0) {
    console.error('\nFailures:');
    for (const i of issues.filter((i) => i.severity === 'fail')) console.error(`  [${i.kind}] ${i.subject}: ${i.detail}`);
    process.exitCode = 1;
  }
}

await main();
