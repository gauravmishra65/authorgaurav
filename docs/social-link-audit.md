# Social Link Audit

Date: 2026-07-26

Single source of truth: `src/data/social.ts`. All consumers (`SocialLinks.tsx`, used in the nav, footer, and elsewhere; `Contact.tsx`'s "Social" card) now go through the new `getVerifiedSocialLinks()` export rather than filtering `socialLinks` themselves — this was fixed this session after finding the filter had been applied in one place (`SocialLinks.tsx`) but not the other (`Contact.tsx`), which let a dead `#` placeholder link leak onto the Contact page.

## Findings

| Platform | URL | Loads? | Real content? | Ownership verified? | Status |
|---|---|---:|---:|---:|---|
| Instagram | `instagram.com/gauravmishrawrites/` | Yes (200) | Yes | Not independently verifiable by me | Rendered |
| Facebook | `facebook.com/profile.php?id=61591772941621` | Yes (loads a real profile — a bare `curl` returned 400, but that is Facebook's well-known anti-bot filtering, not a broken link; confirmed live via an actual browser) | Yes — a real, active "WriteTogether Hub" page | Not independently verifiable by me | Rendered |
| X (Twitter) | `x.com/writetogetherh` | Yes (200) | Yes | Not independently verifiable by me | Rendered |
| YouTube | `#` (placeholder — no real URL yet) | N/A | N/A | N/A | **Hidden** — `getVerifiedSocialLinks()` excludes any entry whose `href` is empty or `#`, so no dead icon renders anywhere. The entry stays in source with a `// TODO: real link` comment so its absence is documented, not silently forgotten. |
| LinkedIn, Goodreads, Amazon Author Central, BookBub, Threads, Pinterest | — | — | — | — | **Not present.** No entry exists in `social.ts` for any of these — nothing to hide or fix, since nothing is currently rendered for them. Adding one requires a real URL from the author. |

## What "ownership verified" means here

I can confirm a URL is syntactically valid, loads, is not a 404/dead page, and shows content plausibly related to the author's known ventures (WriteTogetherHub, book titles). I **cannot** independently confirm that a given Instagram/Facebook/X account is actually controlled by Gaurav Mishra — that requires the account owner's own confirmation. All three currently-linked profiles are technically live and non-broken; ownership itself was not re-verified in this pass (it predates this session and I have no reason to doubt it, but it's not something automated tooling can prove).

## Naming note (not a bug, flagging for awareness)

The Facebook profile currently linked is branded "WriteTogether Hub," not "Gaurav Mishra." This is consistent with the site's existing framing (WriteTogetherHub is the author's separate venture, cross-linked throughout the site), so it's very likely intentional — the author's social presence for that platform is under the WriteTogetherHub name rather than a personal profile. Not changed; flagging only in case it's not what was intended.

## Action taken

- Fixed the Contact page rendering a dead YouTube `#` icon (real bug, now fixed).
- Centralized the "only show verified links" filter into one function (`getVerifiedSocialLinks()`) so this specific bug class — a filter applied in one place but forgotten in another — cannot recur.

## Remaining owner action

If real profiles exist for YouTube, LinkedIn, Goodreads, Amazon Author Central, BookBub, or any other platform, add them to `src/data/social.ts` (and, for reader-facing platforms like Goodreads/Amazon Author Central, consider whether they belong in `SocialLinks` at all or are better suited to a dedicated "Find my books" section — that's a content/IA decision, not something to guess at here).
