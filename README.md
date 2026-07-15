# authorgaurav

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-ztxni2be)

Author website for Gaurav Mishra — Vite + React + TypeScript + Tailwind CSS + React Router, backed by Supabase for content and an admin CMS.

## Running locally

```bash
npm install
npm run dev        # start the dev server
npm run build       # production build (also regenerates public/sitemap.xml)
npm run preview     # preview the production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Environment variables

Copy `.env.example` to `.env` and fill in the Supabase project's URL and anon/publishable key (Project Settings → API in the Supabase dashboard). Both are required — the site fetches its books/blog/news/testimonials from Supabase at runtime, so nothing renders without them.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | The Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | The project's public anon/publishable key. Safe to expose client-side — write access is enforced by Row Level Security, not by keeping this secret. |

## Content & the admin CMS

All book/blog/news/testimonial content lives in Supabase, in the shared **writetogetherhub** project, under tables prefixed `authorgaurav_` (`authorgaurav_books`, `authorgaurav_testimonials`, `authorgaurav_blog_posts`, `authorgaurav_news_items`, `authorgaurav_newsletter_subscribers`, `authorgaurav_contact_messages`) so they don't collide with that project's own community tables.

**Manage content at `/admin`** (e.g. `authorgaurav.com/admin`) — sign in with the same Supabase Auth account already used for WriteTogetherHub (any account listed in that project's `public.admins` table). From there you can add/edit/delete books, testimonials, blog posts, and news/events, and view newsletter subscribers and contact messages. Changes appear on the live site immediately — no redeploy needed.

- `src/lib/queries.ts` — public read queries used by the site's pages.
- `src/lib/adminQueries.ts` — CRUD queries used by `/admin`.
- `src/pages/admin/` — the admin UI (`AdminLayout` gates everything behind a Supabase Auth session).

**Cover images** — after adding a new cover to `public/images/book-covers/`, run:

```bash
npm run images:webp
```

This converts PNG/JPG covers in that folder to `.webp` (via `scripts/convert-covers-to-webp.mjs`), which is typically 70-90% smaller. Point the book's cover image field at the generated `.webp` file; the original stays in the repo as the source master.

## Contact form

The Contact page posts to a Supabase Edge Function (`contact-form`, deployed in the same `writetogetherhub` project) which inserts the message into `authorgaurav_contact_messages` and emails it to **hello@writetogetherhub.com** via Resend (reply-to is set to the visitor's address). The function needs a `RESEND_API_KEY` secret set in that Supabase project (Edge Functions → Secrets) to actually send email — without it, messages still save to the database and are visible at `/admin`, but no email goes out.

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages on every push to `main`. One-time setup:

1. **Repo settings → Pages** → set "Source" to **GitHub Actions** (not "Deploy from a branch").
2. **Repo settings → Secrets and variables → Actions** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as your local `.env`).
3. Push/merge to `main` — the workflow builds (`npm run build`, which also runs `postbuild` to copy `index.html` to `404.html` so client-side routes like `/books/shadow-code` don't 404 on a direct load) and publishes `dist/`.
4. **Custom domain**: repo settings → Pages → "Custom domain" → enter `authorgaurav.com` → Save. This writes the same value already committed in `public/CNAME`, which GitHub reads on every deploy. At your DNS provider, add:
   - Four `A` records for the apex domain (`authorgaurav.com`) pointing to GitHub Pages' IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`.
   - DNS propagation can take a few minutes to a few hours; GitHub auto-provisions SSL once it's verified.
5. Check the **Actions** tab after pushing to watch the build/deploy run and catch any failures.

## SEO

- `src/components/Seo.tsx` sets the page title, meta description, canonical URL, and OG/Twitter tags per page, and can embed JSON-LD via its `jsonLd` prop (used for the `Book` schema on `/books/:slug`).
- A site-wide `Person` JSON-LD schema lives directly in `index.html`.
- `public/sitemap.xml` is regenerated from the app's routes and book slugs by `scripts/generate-sitemap.mjs`, which runs automatically before `npm run build` (the `prebuild` script). Run `npm run sitemap` to regenerate it manually.
- `public/robots.txt` points crawlers at the sitemap.

## Remaining manual TODOs

These need real accounts/credentials and can't be done from the codebase alone:

- **Connect the custom domain** `authorgaurav.com` — see the Deploying section above; the DNS records and one Pages-settings click still need to be done by hand.
- **Set the `RESEND_API_KEY` secret** in the Supabase project's Edge Functions settings so the contact form actually sends email (see Contact form section above).
- **Search & analytics** — add Google Search Console + Google Analytics, and submit `https://authorgaurav.com/sitemap.xml` to Search Console.
- **Replace placeholders** — the Amazon/Flipkart/Kindle buy links (`#` placeholders, editable per-book at `/admin`), the reader testimonials seeded into `authorgaurav_testimonials`, the press quotes in `src/data/press.ts`, and the YouTube link in `src/data/social.ts` are all placeholders and should be swapped for the real ones.
