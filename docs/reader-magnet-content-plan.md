# Reader Magnet Content Plan

Per-interest plan for the newsletter's reader-magnet incentives (`src/data/readerMagnets.ts`). This is a *content plan*, not content — no magnet's actual text/audio/video is written here or anywhere else in this engineering phase. `NewsletterForm`'s success state only ever shows a download link when `readerMagnets.ts` has a real `fileUrl` (`isDownloadable = magnet.status === 'published' && Boolean(magnet.fileUrl)`), so nothing below is advertised to a visitor until it's real.

## Status summary

| Interest | Label | Status | File |
|---|---|---|---|
| Writing resources | writing checklists | **Published** | `/resources/manuscript-formatting-checklist.txt`, `/resources/self-editing-checklist.txt` |
| Thrillers | thriller prequel | Not started | — |
| Romance | romance bonus content | Not started | — |
| Spiritual books | spiritual reading guide | Not started | — |
| All updates | welcome resource | Not started | — |

## Thrillers — thriller prequel

- **Purpose:** reward Shadow Code / techno-thriller readers who opt into the "Thrillers" interest; gives them a reason to open the welcome email and a taste of tone/voice ahead of the Shadow Code launch (2026-07-31).
- **Length:** a short prequel scene or chapter (roughly 1,500–2,500 words) — long enough to be a real reading experience, short enough to write and approve quickly.
- **Language:** English (matches Shadow Code).
- **Format:** PDF, so it reads consistently across devices and can carry the same cover/branding as the book.
- **Source needed:** the author writes (or selects an existing unused scene/outtake) — this is original creative work, not something to draft speculatively in an engineering pass.
- **Approval status:** not started — needs the author's own draft and sign-off before publication.
- **Segment:** subscribers who selected "Thrillers" at signup.
- **Landing page:** delivered inline via the newsletter success state (no separate landing page needed) — same pattern as Writing Resources.
- **Download status:** not downloadable (`fileUrl` unset) until a real file exists.
- **Analytics event:** `sample_download` (property: `magnet: 'thriller-prequel'`) once wired, mirroring `BookSample.tsx`'s existing (currently dormant, since no sample exists) event.

## Romance — romance bonus content

- **Purpose:** reward Offbeat Love readers; a short bonus scene or "where are they now"-style extra deepens engagement with an already-published book.
- **Length:** short (roughly 800–1,500 words) — a bonus scene, not a second novella.
- **Language:** English (matches Offbeat Love).
- **Format:** PDF.
- **Source needed:** author-written original content.
- **Approval status:** not started.
- **Segment:** subscribers who selected "Romance."
- **Landing page:** inline via newsletter success state.
- **Download status:** not downloadable until real.
- **Analytics event:** `sample_download` (property: `magnet: 'romance-bonus'`).

## Spiritual books — spiritual reading guide

- **Purpose:** reward readers of the Vishnu/Lalita Sahasranama renderings with a short companion guide (e.g., how to use the sahasranama in daily practice) — complements, doesn't duplicate, the books themselves.
- **Length:** short guide, roughly 3–5 pages.
- **Language:** Hindi (matches the two devotional books) with an English-subtitle option if the author wants wider reach — author's call, not assumed here.
- **Format:** PDF.
- **Source needed:** author-written; likely adapts material already in the books' front matter, but needs explicit author sign-off since devotional/religious content carries its own accuracy expectations.
- **Approval status:** not started.
- **Segment:** subscribers who selected "Spiritual books."
- **Landing page:** inline via newsletter success state.
- **Download status:** not downloadable until real.
- **Analytics event:** `sample_download` (property: `magnet: 'spiritual-reading-guide'`).

## All updates — welcome resource

- **Purpose:** a small "thank you for subscribing" resource for subscribers who didn't pick a specific genre — least urgent of the four gaps, since "All updates" subscribers are already getting the core promise (updates) without needing an added incentive.
- **Length:** open — could be as simple as a one-page author welcome note, or reuse one of the other magnets once available.
- **Language:** English (or bilingual, author's call).
- **Format:** PDF, or could simply point at the About page rather than requiring a new asset — worth deciding with the author rather than defaulting to "must be a downloadable file."
- **Source needed:** author decision on scope before any drafting.
- **Approval status:** not started.
- **Segment:** subscribers who selected "All updates."
- **Landing page:** inline via newsletter success state, if a file is created.
- **Download status:** not downloadable until real.
- **Analytics event:** `sample_download` (property: `magnet: 'welcome-resource'`) if a file is added.

## What happens once any of these becomes real

1. Author supplies the approved file (PDF/text).
2. File is added to `public/resources/`.
3. `src/data/readerMagnets.ts`'s matching entry gets a real `fileUrl`.
4. `npm run validate:content` (see `scripts/validate-content.mjs`) confirms the referenced file actually exists on disk before it ships.
5. `NewsletterForm`'s success state automatically starts showing the download link for that interest — no other code change needed.
