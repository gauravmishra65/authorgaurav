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

### What to check once Bing starts crawling

Bing's reporting is organized differently from Search Console — these are the sections worth checking, not immediately but over the following weeks:

- **Crawl** (Reports & Data → Crawl Information): confirms Bing's crawler is actually reaching the site and how many pages/requests, and flags any crawl errors (404s, server errors) it hit.
- **Indexed pages** (Reports & Data → Site Explorer, or "Index Explorer"): the actual count and list of pages Bing has indexed — compare roughly against the sitemap's ~29 URLs; a large gap after a few weeks is worth investigating, a same-day gap is not.
- **SEO diagnostics** (the dedicated "SEO Reports" tool): an automated scan for common on-page issues (missing titles, duplicate meta descriptions, etc.) — most of what it checks has already been addressed site-wide (see `docs/accessibility-test-results.md` and the content/link validation reports), but it's worth a glance since it checks a few Bing-specific heuristics this project doesn't test for directly.
- **Backlinks** (Reports & Data → Backlinks): shows what Bing has discovered linking to the site. Nothing to configure — this is purely informational and reflects real external links as they're discovered over time, not anything controllable from this codebase.
- **Search keywords** (Reports & Data → Search Keywords): what queries are actually surfacing the site in Bing results. Like Performance in Search Console, this only becomes meaningful after real traffic accumulates — nothing to check in the first days after setup.

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

## Author entity consistency

Checked every verified profile live (Phase 11 audit) to confirm Gaurav Mishra's identity — same name, portrait, bio, and book-title spelling — is consistent across them, and that `Person.sameAs` in the site's structured data only lists real, correctly-matched profiles.

### Verified and already wired into `Person.sameAs`

- **Amazon Author Central** (`https://www.amazon.in/stores/author/B0H34FKXHP`) — checked live: same portrait as the site's own author photo, a bio that matches `AUTHOR_SHORT_BIO` almost word for word, and lists real titles (including *Innocent Gangster*). Added to `src/data/author.ts`'s new `AUTHOR_VERIFIED_PROFILES` and now included in `Person.sameAs` (`PersonStructuredData.tsx`). Not added to the header/footer social icon row (`social.ts`'s `socialLinks`) — that list drives icon rendering (`SocialLinks.tsx`) and has no icon mapped for a retailer-author page, so adding it there would've rendered as stray fallback text next to the Instagram/Facebook/X icons instead of an icon.
- **Instagram, Facebook, X** — already verified and live (unchanged from before this phase).

### Found, but NOT a match — do not link

- **Goodreads.** Every book's `goodreads_url` now links correctly to its own book page — found and fixed three malformed ones during this audit (a URL with the same link pasted twice back-to-back, one with a stray leading space, one with a trailing `--` artifact); `validate-content.mjs` now has a standing check (`malformed-url`) that would catch this class of bug again. But the **author** link on those book pages (`goodreads.com/author/show/7571255.Gaurav_Mishra`) resolves to a different, unrelated person: an author of Indian Polity exam-prep MCQ books, not this Gaurav Mishra. This is a real name collision, not a setup step that was skipped. **Owner action**: Goodreads has an Author Program (reachable via "Is this you? Let us know" on an author page, or a request through Goodreads Author support) to claim a distinct author profile separate from this unrelated one. Until that's done, there is no correct Goodreads *author* page to link — the individual book pages are fine as they are.

### Not found — owner to verify or create

- **LinkedIn** and **BookBub** — no existing link anywhere in the codebase or on verified profiles pointing to either. "Gaurav Mishra" is common enough (confirmed by the Goodreads collision above) that guessing a profile URL risks linking the wrong person entirely, so none is included here. If real profiles exist, send the exact URLs to add; otherwise they're real gaps to create.
- **YouTube** — already correctly excluded site-wide (`social.ts` keeps it as a `#` placeholder until a real channel exists, per that file's own established rule).

### Book-title spelling

Amazon lists *निर्दोष गैंगस्टर* as "Innocent Gangster" — a reasonable English rendering, but the site itself never shows this English title anywhere (only the Hindi original). The data model already has a field built for exactly this (`Book.translatedTitles`, a `TODO_CONTENT` gap since Phase 4/5 — empty for every book today). Confirming "Innocent Gangster" as the official English title and entering it via `/admin` would close this gap for that one book; not changed here since it's a content decision for the title's exact approved wording, not a verification this audit can settle on its own.

## Other search engines

Do not assume universal submission. What's actually verified:

- **Google**: crawls independently; sitemap submission (above) is a discovery signal, not a guarantee.
- **Bing**: crawls independently; also consumes IndexNow submissions directly.
- **Yandex, Seznam, and other IndexNow-participating engines**: consume the same IndexNow submissions Bing does, per the open protocol — no separate integration needed, but no separate confirmation tooling either.
- Anything not listed above (DuckDuckGo, etc.) generally sources its index from Bing's, so Bing indexing already covers it indirectly — this project makes no direct claim about them.
