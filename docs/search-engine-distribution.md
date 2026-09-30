# Search Engine Distribution

How authorgaurav.com gets discovered and indexed across search engines — what's already built into the codebase, what's implemented but needs your one-time setup, and what's an owner action only you can take (Search Console/Webmaster Tools have no API a script can safely act through on your behalf, and doing so would mean handling your account credentials).

## Google

Full checklist: [`docs/google-search-console-checklist.md`](google-search-console-checklist.md) — domain verification, sitemap submission, and requesting indexing for key pages. All owner action; nothing here for a script to do.

## Bing

Bing Webmaster Tools is separate from Google Search Console and needs its own verification.

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and sign in (a Microsoft account).
2. Add `authorgaurav.com` as a site. Bing offers an **"Import from Google Search Console"** option if you've already verified there — this is the fastest path and avoids a second DNS/HTML verification step.
   - If you'd rather verify independently: use the **DNS TXT record** method (same idea as Google's, different record value) rather than the HTML meta-tag method, since a domain-level DNS record covers `www.` and root variants in one step.
3. Once verified, go to **Sitemaps** in the left sidebar and submit `https://authorgaurav.com/sitemap.xml`.
4. Bing Webmaster Tools also has a **URL Submission** tool (separate from IndexNow, see below) for nudging specific pages — use it the same sparing way as Google's URL Inspection: key pages only, not the whole site.

## IndexNow

IndexNow is an open protocol (not Bing-specific, though Bing is the primary consumer) that lets a site push "this URL changed" notifications instead of waiting to be re-crawled. It's already implemented in this repo:

- **Key file**: `public/2cde870b3d8e51281ed6a8d1146efaa6.txt` — deployed automatically with every build (it's a static file under `public/`), reachable at `https://authorgaurav.com/2cde870b3d8e51281ed6a8d1146efaa6.txt`. IndexNow checks this file matches the key in the submission request before accepting it.
- **Submission script**: `scripts/indexnow-submit.mjs`, run via `npm run indexnow -- <path-or-url> [more...]`.

### Usage

Submit only genuinely new/changed/removed public URLs — never the whole site on every deploy (IndexNow's own guidance, and repeated identical submissions don't help).

```bash
npm run indexnow -- /books/the-shadow-code/ 
npm run indexnow -- /news/ /blog/some-new-post/
```

On Windows, run this from **PowerShell**, not Git Bash — Git Bash's MSYS layer auto-converts a bare leading-slash argument into a Windows filesystem path before Node ever sees it, which silently submits a garbled URL. (Verified: this is exactly what happened during initial testing — Git Bash mangled `/` into a local path, while PowerShell submitted the correct `https://authorgaurav.com/`.)

This is deliberately **not** wired into the GitHub Actions deploy workflow yet — every deploy would otherwise need to know precisely which URLs actually changed (vs. rebuilding everything, which always touches every file's build hash). Running it manually after a deploy that adds/changes real content is the safer starting point; automating it is a reasonable follow-up once there's a real list of "what changed this deploy," but that's a CI change worth its own review rather than doing it silently.

### Verifying it's working

Bing Webmaster Tools has an **IndexNow** section (left sidebar) that shows recently submitted URLs and their crawl status — check there a day or two after a submission, not immediately.

## Other search engines

Do not assume universal submission. What's actually verified:

- **Google**: crawls independently; sitemap submission (above) is a discovery signal, not a guarantee.
- **Bing**: crawls independently; also consumes IndexNow submissions directly.
- **Yandex, Seznam, and other IndexNow-participating engines**: consume the same IndexNow submissions Bing does, per the open protocol — no separate integration needed, but no separate confirmation tooling either.
- Anything not listed above (DuckDuckGo, etc.) generally sources its index from Bing's, so Bing indexing already covers it indirectly — this project makes no direct claim about them.
