# Authority & Backlink Plan

Where authorgaurav.com's off-site authority should come from, and what to actively avoid. Everything here is owner action (outreach, account setup, submissions) — there's no script that can safely do this on your behalf, the same way Search Console/Webmaster Tools verification is owner-only (see [`search-engine-distribution.md`](search-engine-distribution.md)).

## Why this matters

Search engines (and AI answer engines, which favor the same consistent-entity signals — see the site's own Person structured data in `src/data/author.ts`) weigh how consistently and credibly an author is referenced elsewhere on the web, not just what's on the site itself. A handful of real, relevant mentions outweigh a large number of low-quality ones — and the wrong kind of link (paid, automated, irrelevant) can actively hurt rather than help.

## Priority 1 — Author-identity platforms (do these first)

These aren't really "backlinks" so much as the canonical record of who the author is — they're what `sameAs` in the site's Person structured data points to (see `src/data/author.ts`), so getting them real and consistent has a direct, immediate SEO payoff.

- **Goodreads Author Profile**: claim/create one at [goodreads.com/author/program](https://www.goodreads.com/author/program) if not already done. Link every published book's real Goodreads page. Use the same headshot, bio, and website URL as everywhere else on the site.
- **Amazon Author Central**: [author.amazon.com](https://author.amazon.com) — same identity consistency (name, photo, bio, website link), plus it's what powers the author bio block that appears on Amazon book listing pages.
- Once either is real and live, add its URL to `socialLinks` in `src/data/social.ts` (only through `getVerifiedSocialLinks()` — see that file's own doc comment on why placeholders must never leak through) so it starts appearing in the site's own Person schema automatically.

## Priority 2 — Genre-relevant coverage

Match outreach to what's actually in the catalog rather than generic "book blogger" spam lists:

- **Techno-thriller / crime fiction**: reviewers and blogs that cover financial thrillers, techno-thrillers, or Indian crime fiction specifically (Shadow Code, the Zero Account books) — not general "thriller" lists where the book won't stand out.
- **Contemporary romance**: reviewers/bookstagrammers focused on cross-cultural or Mumbai-set contemporary romance (Offbeat Love, Anootha Pyar).
- **Devotional/spiritual reading**: sites and communities focused on accessible Hindi devotional texts, not generic "spirituality" content mills — the Vishnu/Lalita Sahasranama books need reviewers who'll actually engage with the material seriously (the master plan's own caution about religious-content accuracy applies here too).
- **Career/interview guidance**: career-advice sites, HR/recruiting blogs, or campus-placement resources for The Complete Interview Success Guide — a distinct audience from the fiction titles, worth its own outreach list rather than folding into general "book reviewer" outreach.

For each: a genuine review or mention, with a real byline and a real URL — never a paid placement, never a "guaranteed backlink package."

## Priority 3 — Community and event presence

- **Book clubs**: `/book-clubs` already has real discussion-guide infrastructure (Offbeat Love's questions, downloadable). Approaching book clubs (in person or via platforms like Goodreads groups) for a real discussion or author Q&A, with a link back to the book-clubs page, is a legitimate, high-relevance mention.
- **Writing communities**: WriteTogetherHub (writetogetherhub.com) is Gaurav's own real platform — cross-linking is already in place (Footer, About, WriteTogetherHub page all link it). Extending this to genuine guest posts on *other* writing-community sites (not just self-links) is the actual backlink opportunity here — e.g. a real guest essay on manuscript formatting or first-novel completion (both existing Journal cluster topics per the content strategy) placed on an established writing-community site, linking back to the relevant Journal article.
- **Podcasts and interviews**: `/media`'s "Suggested Interview Topics" section already exists for exactly this — when a real podcast or publication interview happens, add it to that page's (currently empty) "Previous Interviews" section with a real link, and it becomes both a credibility signal on-site and (if the host publishes show notes) a real off-site mention.
- **Libraries and distributors**: if books are carried by a distributor or library system with its own catalog page (a real ISBN listing, not a marketing page), that's a legitimate, naturally-occurring reference — no outreach needed beyond normal distribution, just worth knowing it exists once it does.

## Explicitly avoid

Per the master plan's own instruction and standard search-engine guidance on manipulative link schemes:

- Paid link placements or "SEO backlink packages" (nearly all of these are either ignored by search engines or actively penalized).
- Link farms / link exchange networks.
- Automated directory submissions (the mass "submit your site to 500 directories" services).
- Any mention that isn't genuinely about the book/author — a link buried in unrelated content purely for the link's sake.

## Tracking

There's no dedicated backlink-tracking tooling in this repo, and adding one isn't warranted yet — a simple running note (this file, or a spreadsheet) of "site — what was published — date — URL" is enough at this stage. Revisit whether real tooling (e.g. Google Search Console's own "Links" report, which is already free and owner-accessible once Search Console is verified) is needed once outreach volume actually justifies it.
