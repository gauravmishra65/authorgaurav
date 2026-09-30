# 6-Month Content Calendar (Titles & Outlines Only)

Titles and outlines only — per the master plan's own instruction, this deliberately stops short of drafting full articles. Six months of auto-generated full posts would be exactly the "mass-publish AI SEO content" the plan warns against; the value here is picking topics and angles worth writing well, not filling a queue.

**Status check**: three real posts are published today (`idea-to-finished-manuscript`, `writing-love-across-two-worlds`, `vishnu-sahasranama-daily-life` — last dated 2026-05-12). Nothing has published since. This calendar starts the month after today's date (2026-09-30) rather than backfilling the gap.

Cadence, per the master plan: 2 evergreen articles/month, 1 author-note/update/month, 1 newsletter-archive-or-resource/month. Categories are the real, existing `BlogCategory` values (`src/data/posts.ts`) — nothing new invented.

## October 2026

1. **"What Makes a Financial Thriller Actually Work"** — *Writing Craft* · Cluster A (Shadow Code)
   Audience: thriller readers curious about the genre's mechanics. Search intent: "how to write a thriller" / "financial thriller genre" adjacent. Relevant book: Shadow Code. CTA: Explore Shadow Code + Reader Circle (Thrillers interest). Internal links: `/books/the-shadow-code`, `/start-here`.
2. **"Two Languages, One Story: Publishing Shadow Code in Hindi and English"** — *Behind the Books*
   Audience: bilingual readers, Hindi-fiction readers discovering the author for the first time. Search intent: "Shadow Code Hindi", author-name searches. Relevant books: Shadow Code, Shadow Code Hindi edition. CTA: language-specific book pages. Internal links: `/books/the-shadow-code`, `/books/shadow-code-hindi`.
3. **Author note**: brief update on The Zero Account's upcoming release — status, what readers can expect, no invented dates beyond what `/admin` already has set for `releaseDate`.
4. **Newsletter/resource**: highlight the real manuscript-formatting-checklist reader magnet (the one that actually exists — see `src/data/readerMagnets.ts`) to Writing-resources subscribers who haven't downloaded it yet.

## November 2026

1. **"Character-Driven Romance: Why Offbeat Love Isn't a Meet-Cute Story"** — *Behind the Books* · Cluster B
   Audience: contemporary-romance readers tired of formula. Search intent: "character driven romance books", "Mumbai romance novel". Relevant book: Offbeat Love. CTA: sample/synopsis, Reader Circle (Romance interest). Internal links: `/books/offbeat-love`.
2. **"Reading the Lalita Sahasranama Without Knowing Sanskrit"** — *Spiritual Reflections* · Cluster C
   Audience: readers curious about devotional practice but intimidated by the source language. Search intent: "Lalita Sahasranama meaning in Hindi/English", "how to start reading Sahasranama". Relevant book: Lalita Sahasranama. CTA: book page + daily-reading framing (mirrors the real FAQ already on that page). Internal links: `/books/lalita-sahasranama`.
3. **Author note**: WriteTogetherHub update — whatever's genuinely new there this month (a cohort, a resource, a milestone); cross-post per the existing WriteTogetherHub cross-linking pattern.
4. **Newsletter/resource**: reader-circle segment spotlight — what Spiritual-books subscribers can expect, pointing at the real devotional catalog.

## December 2026

1. **"Finishing the First Draft: What Actually Gets People There"** — *Writing Craft* · Cluster D
   Audience: aspiring novelists, WriteTogetherHub's core audience. Search intent: "how to finish writing a novel", "first draft tips". CTA: WriteTogetherHub. Internal links: `/write-together-hub`, existing `idea-to-finished-manuscript` post (build the cluster, don't orphan the older piece).
2. **"A Year in Books: 2026 in Review"** — *Book Updates*
   Audience: existing readers/subscribers, a natural January-adjacent piece. Search intent: branded/author-name searches, not much organic volume, but strong for reader retention and internal linking to every real release this year. Internal links: `/books`, each real book page released in 2026.
3. **Author note**: whatever's real and current for December (no content specified here since master plan explicitly bars pre-writing months of speculative "news").
4. **Newsletter/resource**: end-of-year note to the full list, referencing the "A Year in Books" post above.

## January 2027

1. **"What Makes The Complete Interview Success Guide Different From a Generic Interview-Prep Book"** — *Book Updates*
   Audience: job seekers, a distinct, non-fiction audience worth its own cluster per the earlier SEO metadata work done on this book. Search intent: "interview preparation guide", "STAR method interview" (matches the book's own real STAR-R framework, already documented on `/books/interview-guide` and `/interview-resources`). CTA: `/interview-resources`. Internal links: `/books/interview-guide`, `/interview-resources`.
2. **"Editing Your Own Manuscript: A Realistic Process"** — *Writing Craft* · Cluster D
   Audience: writers past the first-draft stage. Search intent: "self-editing tips", "how to edit your novel". CTA: WriteTogetherHub. Internal links: `/write-together-hub`.
3. **Author note**: real update, whatever's current at the time.
4. **Newsletter/resource**: January is a natural point to review whether more reader magnets have become real (per `readerMagnets.ts`'s TODO_CONTENT markers) and, if so, announce the new one honestly rather than let this calendar assume it.

## February 2027

1. **"Faith, the Road, and What A Journey of Grace Is Actually About"** — *Behind the Books*
   Audience: memoir/reflective-nonfiction readers — the one real book in this genre currently has the thinnest content footprint on the site (per earlier `validate:content` audits), so this both serves SEO and shores up a real content gap. Relevant book: A Journey of Grace. Internal links: `/books/journey-of-grace`.
2. **"The Vishnu Sahasranama for Younger Readers"** — *Spiritual Reflections* · Cluster C
   Audience: the book's own stated target (per its real synopsis) — accessible for modern/younger readers. Search intent: "Vishnu Sahasranama simple meaning", "Vishnu Sahasranama for beginners". Internal links: `/books/vishnu-sahasranama`, cross-link to the existing `vishnu-sahasranama-daily-life` post.
3. **Author note**: real update.
4. **Newsletter/resource**: segment spotlight for Thrillers subscribers, timed around whichever thriller release is closest at that point (The Zero Account, Operation Reyes, or The Letter They Buried, depending on actual release order by then).

## March 2027

1. **"Cybercrime and Trust in Contemporary Fiction"** — *Writing Craft* / *Behind the Books* · Cluster A
   Audience: readers/writers interested in how tech-adjacent crime fiction is built. Search intent: "techno-thriller writing", "cybercrime fiction". Relevant books: Shadow Code, The Zero Account (once real and released). Internal links: `/books/the-shadow-code`, `/books/the-zero-account`.
2. **"One Year of WriteTogetherHub: What Actually Helped New Writers"** — *Writing Craft*
   Only publish if there's real substance to report (testimonials, concrete outcomes) — otherwise slide this topic to a later month rather than pad it out. Internal links: `/write-together-hub`.
3. **Author note**: real update.
4. **Newsletter/resource**: a genuine reader-magnet or reader-circle refresh, same honesty caveat as January.

## Notes on execution

- Every "Author note" and several "Newsletter/resource" slots are deliberately left topic-light — the master plan is explicit that speculative months-ahead news content shouldn't be pre-written, since it risks becoming stale or simply false by the time it publishes.
- Where a slot depends on something not yet real (Zero Account's release, a new reader magnet, a WriteTogetherHub milestone), verify it's actually true that month before publishing — don't let this calendar's existence pressure publishing something not yet accurate.
- Revisit this calendar's next six months once these are drafted or the situation changes materially (a new book releases ahead of schedule, a real press mention arrives, etc.) rather than treating it as fixed.
