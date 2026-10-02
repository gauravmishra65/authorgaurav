#!/usr/bin/env node
// Same checks as validate-build-seo.mjs, run against the LIVE site after a
// deploy. Reads https://authorgaurav.com/sitemap.xml and fetches every URL
// in it. Needs network access; deliberately not part of CI's pre-deploy
// steps (there is nothing live to check yet at that point).
//
// Usage: npm run validate:production-seo [-- https://other-origin.example]
import { auditHtml, crossPageIssues, parseSitemapLocs, report } from './lib/seo-checks.mjs';

const origin = (process.argv[2] ?? 'https://authorgaurav.com').replace(/\/$/, '');
const sitemapRes = await fetch(`${origin}/sitemap.xml`);

if (!sitemapRes.ok) {
  console.error(`Could not fetch ${origin}/sitemap.xml (HTTP ${sitemapRes.status}).`);
  process.exitCode = 1;
} else {
  const locs = parseSitemapLocs(await sitemapRes.text());
  const results = [];
  for (const url of locs) {
    const liveUrl = url.replace('https://authorgaurav.com', origin);
    const res = await fetch(liveUrl, { redirect: 'follow' });
    if (res.status !== 200) {
      results.push({ url, issues: [{ severity: 'fail', kind: 'http-status', detail: `HTTP ${res.status} (a real 200 is required - a 404 shell would not be indexed)` }] });
      continue;
    }
    const { issues, title, description } = auditHtml(await res.text(), url);
    results.push({ url, issues, title, description });
  }
  const fails = report(`Production SEO validation (${origin})`, results, crossPageIssues(results.filter((r) => r.title)));
  if (fails > 0) process.exitCode = 1;
}
