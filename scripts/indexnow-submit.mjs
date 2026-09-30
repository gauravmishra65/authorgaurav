#!/usr/bin/env node
// Submits specific, genuinely-changed URLs to the IndexNow API (which Bing,
// and other IndexNow-participating engines, consume). Deliberately manual —
// per IndexNow's own guidance, submit only URLs that actually changed, not
// the whole site on every run.
//
// Usage:
//   node scripts/indexnow-submit.mjs /books/the-shadow-code/ /news/
//   node scripts/indexnow-submit.mjs https://authorgaurav.com/blog/some-post/
//
// The key file (public/<key>.txt) must already be deployed and reachable at
// https://authorgaurav.com/<key>.txt — IndexNow verifies it before accepting
// the submission.
//
// Windows/Git Bash note: MSYS auto-converts a bare leading-slash argument
// (e.g. a lone "/") into a Windows filesystem path before Node ever sees it.
// Run this from PowerShell, or quote/prefix paths some other MSYS-safe way,
// if invoking from Git Bash produces a mangled URL in the log output above.

const SITE_URL = 'https://authorgaurav.com';
const KEY = '2cde870b3d8e51281ed6a8d1146efaa6';
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;

function toAbsoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/indexnow-submit.mjs <path-or-url> [more...]');
  console.error('Example: node scripts/indexnow-submit.mjs /books/the-shadow-code/ /news/');
  process.exit(1);
}

const urlList = args.map(toAbsoluteUrl);

const body = {
  host: new URL(SITE_URL).hostname,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

console.log(`Submitting ${urlList.length} URL(s) to IndexNow:`);
for (const u of urlList) console.log(`  - ${u}`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

if (res.status === 200 || res.status === 202) {
  console.log(`\n✓ Accepted (HTTP ${res.status}).`);
} else {
  const text = await res.text().catch(() => '');
  console.error(`\n✗ IndexNow responded HTTP ${res.status}. ${text}`);
  process.exit(1);
}
