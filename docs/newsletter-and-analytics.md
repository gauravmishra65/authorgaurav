# Newsletter Integration & Analytics

Phase 11 documentation for the reusable newsletter system, the Brevo provider
adapter, reader magnets, and the first-party analytics setup.

## Newsletter System

One component, `src/components/NewsletterForm.tsx`, is used everywhere a
signup form appears: Home (hero + `#free-chapter` strip), Footer, Books,
Start Here, Blog index, individual blog articles (`BlogPostDetail.tsx`),
News, Events, Readers, every book page (via `BookNewsletterCTA`), and the
Shadow Code launch countdown (via `BookLaunchHero`). It posts to the
`newsletter-subscribe` Supabase Edge Function, never directly to the
database.

### Required environment variables (Supabase Edge Function secrets)

Set these under Project Settings → Edge Functions → Secrets (or `supabase
secrets set`), not in the frontend `.env`:

| Variable | Required | Purpose |
|---|---|---|
| `AUTHORGAURAV_BREVO_API_KEY` | No | Enables syncing new subscribers to Brevo. Without it, subscribers are still stored in Supabase — the function just skips the ESP sync step. |
| `AUTHORGAURAV_BREVO_LIST_ID_THRILLERS` | No | Brevo list ID for the "Thrillers" interest. |
| `AUTHORGAURAV_BREVO_LIST_ID_ROMANCE` | No | Brevo list ID for "Romance". |
| `AUTHORGAURAV_BREVO_LIST_ID_SPIRITUAL` | No | Brevo list ID for "Spiritual books". |
| `AUTHORGAURAV_BREVO_LIST_ID_WRITING` | No | Brevo list ID for "Writing resources". |
| `AUTHORGAURAV_BREVO_LIST_ID_ALL` | No | Brevo list ID for "All updates". |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already available to every
Edge Function automatically — nothing to set for those.

### Brevo account setup

1. Create a free account at [brevo.com](https://www.brevo.com).
2. Under **Contacts → Lists**, create one list per interest you want to
   segment (Thrillers, Romance, Spiritual books, Writing resources, All
   updates) — or fewer, if you'd rather combine some.
3. Under **SMTP & API → API Keys**, generate a new API key and set it as
   `AUTHORGAURAV_BREVO_API_KEY`.
4. For each list you created, copy its numeric ID (visible in the list's URL
   or via **Contacts → Lists → [list] → Settings**) into the matching
   `AUTHORGAURAV_BREVO_LIST_ID_*` variable above.
5. Redeploy the `newsletter-subscribe` function after adding secrets (or just
   wait — Supabase picks up new secrets on the next cold start).

### Interest-tag mapping

The 5 interests shown in `NewsletterForm`'s optional genre-preference select
(`Thrillers`, `Romance`, `Spiritual books`, `Writing resources`, `All
updates`) are stored as-is in `authorgaurav_newsletter_subscribers.genre_preference`,
and passed to the edge function as `interest`, which looks up the matching
`AUTHORGAURAV_BREVO_LIST_ID_*` env var. An interest with no configured list
still gets the contact created in Brevo (just untagged) rather than failing
the whole signup.

### Swapping to a different provider

Everything provider-specific lives in one function,
`syncToBrevo(email, name, interest)`, inside
`supabase/functions/newsletter-subscribe/index.ts`. To use Mailchimp,
ConvertKit, or MailerLite instead:

1. Write a new `syncToX(email, name, interest)` function returning the same
   `ProviderResult` shape: `{status: 'subscribed'|'duplicate'|'skipped'|'error', reason?: string}`.
2. Replace the `syncToBrevo(...)` call near the bottom of the handler with
   your new function.
3. Update the required-env-vars table above and redeploy.

### Form states

`idle` → `loading` → one of: `success` (real subscription, provider-agnostic
copy so it's never dishonest about ESP sync status), `duplicate` (distinct
"you're already on the list" copy — a genuine, not-generic-error outcome),
`error` (validation, rate-limit, or network failure — always a visible
message, never silent).

### Anti-abuse

- **Honeypot**: a `company` field, visually and semantically hidden
  (`aria-hidden`, off-screen, `tabIndex={-1}`) from real users. If filled,
  the server pretends success without inserting anything or contacting
  Brevo.
- **Rate limiting**: the edge function rejects a second submission from the
  same email within 60 seconds (`429`, surfaced to the visitor with a
  friendly "please wait a minute" message).
- **Server-side validation**: required fields + email-format regex,
  independent of the client-side checks (which exist for fast UX feedback,
  not as the only line of defense).

### Reader magnets

`src/data/readerMagnets.ts` maps each interest to an optional `fileUrl`.
Today, only **Writing resources** has a real file
(`public/resources/manuscript-formatting-checklist.txt`) — everything else
is a placeholder entry with no `fileUrl`, so `NewsletterForm`'s success
state never advertises a download that doesn't exist. To add a real reader
magnet (sample chapter, thriller prequel, etc.), drop the real file in
`public/resources/` and set that interest's `fileUrl`.

## Analytics

### Design

First-party, cookieless, no-PII. Every event is logged to a new Supabase
table, `authorgaurav_analytics_events` (columns: `event_name`, `properties`
jsonb, `path`, `referrer`, `created_at`). Public `insert`, admin-only
`select` (same RLS pattern as every other table). `src/lib/analytics.ts`'s
`trackEvent()` also forwards to `window.plausible`/`window.gtag` if either
happens to already be loaded — so adding a real analytics script later
requires zero call-site changes.

### Why no consent banner

No cookies are set, no cross-site identifiers exist, nothing is sold or
shared with ad networks — so there is nothing that legally requires a
consent banner under GDPR/similar frameworks for this specific setup. If a
cookie-based tool (e.g. Google Analytics with default settings) is added
later, that decision needs to be revisited and a consent mechanism added
before enabling it.

### Event reference

| Event | Fired when | Properties |
|---|---|---|
| `homepage_cta_click` | Hero/genre-card/final-CTA buttons on Home | `label` |
| `book_view` | A book detail page mounts | `book` (slug) |
| `retailer_click` | Any real (non-`#`) buy-link button is clicked | `retailer` (label) |
| `amazon_click` | Same as above, additionally, when the link's hostname contains `amazon.` | `retailer` |
| `sample_download` | "Read a Sample" clicked on a book page or the Readers page (fires only once a book has a real `sampleUrl` set in /admin) | `book` (slug) |
| `trailer_play` | "Watch Trailer" clicked (currently never fires — no book has a real trailer yet) | `book` (slug) |
| `newsletter_signup` | A newsletter subscription is confirmed successful (not duplicate, not error) | `source`, `interest` |
| `contact_submit` | The contact form is confirmed successfully sent (not honeypot, not error) | `enquiryType` |
| `media_kit_download` | Author-photo or book-cover download on `/media` | `asset` |
| `discussion_guide_download` | Book-club questions file download on `/book-clubs` or `/readers` | `book` |
| `event_registration_click` | "Register" clicked on an `/events` card | `event` (slug) |
| `writetogetherhub_click` | Any real outbound link to writetogetherhub.com | `source` (which section/page) |
| `interview_resource_click` | "Visit Official Resource" clicked on `/interview-resources` | `organization`, `title` |
| `where_to_buy_click` | The "Where to Buy" CTA is clicked, on any of its placements (Home, Books, a book detail page) | `source` (which page/section) |

No event ever carries an email address, name, message body, or anything
matching `/email|name|message|password|token/i` — `trackEvent()` strips any
property whose key matches that pattern before sending, as a second line of
defense beyond "just don't pass it in."

### Naming convention

Flat, present-tense, `noun_verb` (e.g. `book_view`, not `view_book` or
`BookViewed`). New events should follow the same shape.

## Testing Process

1. `npm run typecheck && npm run lint && npm run build`.
2. **Newsletter — valid signup**: submit real name/email/interest on two
   different surfaces (e.g. Home and a book page); confirm a row appears in
   `authorgaurav_newsletter_subscribers` and the UI shows the success state.
3. **Invalid email**: submit a malformed address; confirm the inline client
   error appears and nothing is sent.
4. **Network failure**: point `NEWSLETTER_ENDPOINT` at an unreachable URL
   (or disconnect) and confirm the visible network-error state (never a
   silent failure).
5. **Provider error / not configured**: with no `AUTHORGAURAV_BREVO_API_KEY`
   set, confirm the subscriber is still stored and the UI still shows
   success (the `providerStatus` in the response will read `skipped`).
6. **Duplicate subscriber**: submit the same email twice (after the 60s
   rate-limit window); confirm the distinct "already on the list" state.
7. **Rate limiting**: submit the same email twice in immediate succession;
   confirm the 429/"please wait" message.
8. **Mobile + keyboard**: complete a signup at a 375px viewport and via
   keyboard only (Tab through every field, honeypot excluded via
   `tabIndex={-1}`).
9. **Screen-reader labels**: every input has an associated `<label>`
   (several visually hidden via `sr-only`) — verify via the accessibility
   tree, not just visually.
10. **Analytics**: trigger each event in the table above manually and query
    `authorgaurav_analytics_events` to confirm the row landed with the
    expected `event_name`/`properties` and no PII columns.
11. Production build (`npm run build`) succeeds with no new warnings beyond
    the pre-existing bundle-size notice.
