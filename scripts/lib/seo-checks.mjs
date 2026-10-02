// Shared page-level SEO checks used by validate-build-seo.mjs (the built
// dist/ output, before deploy) and validate-production-seo.mjs (the live
// site, after deploy), so both enforce exactly the same rules.

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? decode(m[1]) : null;
};

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
}

/** Returns { issues: [{severity, kind, detail}], title, description } for one page's HTML. */
export function auditHtml(html, expectedUrl) {
  const issues = [];
  const add = (severity, kind, detail) => issues.push({ severity, kind, detail });

  const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)];
  const title = titles[0] ? decode(titles[0][1].trim()) : '';
  if (titles.length !== 1) add('fail', 'title-count', `${titles.length} <title> tags (expected 1)`);
  else if (!title) add('fail', 'empty-title', 'title is empty');
  else if (title.length > 75) add('warn', 'long-title', `title is ${title.length} characters (may be truncated in results)`);

  const descTag = (html.match(/<meta\s+[^>]*name\s*=\s*"description"[^>]*>/i) ?? [])[0];
  const description = descTag ? (attr(descTag, 'content') ?? '') : '';
  if (!descTag || !description) add('fail', 'missing-description', 'no meta description');
  else if (description.length < 70 || description.length > 175) {
    add('warn', 'description-length', `meta description is ${description.length} characters (aim for roughly 70-175)`);
  }

  const canonicals = [...html.matchAll(/<link\s+[^>]*rel\s*=\s*"canonical"[^>]*>/gi)].map((m) => attr(m[0], 'href'));
  if (canonicals.length !== 1) add('fail', 'canonical-count', `${canonicals.length} canonical tags (expected 1)`);
  else {
    if (!/^https:\/\/authorgaurav\.com\//.test(canonicals[0])) {
      add('fail', 'canonical-not-absolute', `canonical "${canonicals[0]}" is not an absolute https://authorgaurav.com URL`);
    }
    if (expectedUrl && canonicals[0] !== expectedUrl) {
      add('fail', 'canonical-mismatch', `canonical "${canonicals[0]}" differs from the sitemap URL "${expectedUrl}"`);
    }
  }

  const ogTag = (prop) => {
    const t = (html.match(new RegExp(`<meta\\s+[^>]*property\\s*=\\s*"${prop}"[^>]*>`, 'i')) ?? [])[0];
    return t ? attr(t, 'content') : null;
  };
  for (const p of ['og:title', 'og:description', 'og:url']) if (!ogTag(p)) add('fail', 'missing-og', `missing ${p}`);
  if (canonicals[0] && ogTag('og:url') && ogTag('og:url') !== canonicals[0]) {
    add('fail', 'og-url-mismatch', `og:url "${ogTag('og:url')}" differs from canonical "${canonicals[0]}"`);
  }

  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s !== 1) add('fail', 'h1-count', `${h1s} <h1> elements (expected 1)`);

  if (!/<html[^>]*\slang\s*=\s*"[a-z-]+"/i.test(html)) add('fail', 'missing-lang', '<html> has no lang attribute');

  const robots = (html.match(/<meta\s+[^>]*name\s*=\s*"robots"[^>]*>/i) ?? [])[0];
  if (robots && /noindex/i.test(robots)) add('fail', 'noindex', 'page is a sitemap URL but carries a noindex robots tag');

  const blocks = [...html.matchAll(/<script[^>]*type\s*=\s*"application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  if (blocks.length === 0) add('warn', 'no-structured-data', 'no JSON-LD structured data on this page');
  blocks.forEach((b, i) => {
    try {
      const data = JSON.parse(b);
      const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
      if (!nodes.some((n) => n['@type'])) add('fail', 'jsonld-no-type', `JSON-LD block ${i + 1} has no @type`);
    } catch (e) {
      add('fail', 'jsonld-invalid', `JSON-LD block ${i + 1} is not valid JSON (${e.message})`);
    }
  });

  if (/>\s*(undefined|null|\[object Object\])\s*</.test(html)) {
    add('fail', 'placeholder-text', 'visible "undefined"/"null"/"[object Object]" text in the page');
  }

  return { issues, title, description };
}

/** Cross-page rules: the same title or description repeated across pages. */
export function crossPageIssues(pages) {
  const issues = [];
  for (const field of ['title', 'description']) {
    const seen = new Map();
    for (const p of pages) {
      if (!p[field]) continue;
      if (!seen.has(p[field])) seen.set(p[field], []);
      seen.get(p[field]).push(p.url);
    }
    for (const [text, urls] of seen) {
      if (urls.length > 1) {
        issues.push({
          severity: field === 'title' ? 'fail' : 'warn',
          kind: `duplicate-${field}`,
          url: urls.join(', '),
          detail: `same ${field} on ${urls.length} pages: "${text.slice(0, 70)}"`,
        });
      }
    }
  }
  return issues;
}

export function report(label, pageResults, extra = []) {
  const all = [...pageResults.flatMap((p) => p.issues.map((i) => ({ ...i, url: p.url }))), ...extra];
  const fails = all.filter((i) => i.severity === 'fail');
  const warns = all.filter((i) => i.severity === 'warn');
  console.log(`${label}: ${pageResults.length} pages checked, ${fails.length} failure(s), ${warns.length} warning(s).`);
  for (const i of fails) console.error(`  FAIL [${i.kind}] ${i.url}: ${i.detail}`);
  for (const i of warns) console.log(`  warn [${i.kind}] ${i.url}: ${i.detail}`);
  return fails.length;
}
