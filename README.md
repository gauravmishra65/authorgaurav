# authorgaurav

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-ztxni2be)

Author website for Gaurav Mishra — Vite + React + TypeScript + Tailwind CSS + React Router.

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

Copy `.env.example` to `.env` and fill in what you have:

| Variable | Purpose |
| --- | --- |
| `VITE_NEWSLETTER_ENDPOINT` | POST endpoint for the newsletter form (`src/components/NewsletterForm.tsx`). Point it at a MailerLite/ConvertKit (or similar) endpoint that accepts a JSON POST of `{ "email": "..." }`. Left unset, the form simulates success locally without a network call, so the UI can still be reviewed end to end. |

## Adding content

**A book** — add an entry to the `books` array in [`src/data/books.ts`](src/data/books.ts). Required fields: `id`, `slug` (used for the `/books/:slug` detail page and JSON-LD), `title`, `author`, `tagline`, `synopsis`, `genre`, `language`, `gradient` (fallback Tailwind gradient shown if the cover image fails to load), and `buyLinks`. Add `imageSrc`/`imageWidth`/`imageHeight` for a real cover (see the image pipeline below), and `testimonials` for reader quotes. The book automatically appears on the bookshelf, in `/books`, and gets its own `/books/:slug` page and sitemap entry.

**A blog post** — add an entry to `posts` in [`src/data/posts.ts`](src/data/posts.ts). Posts currently render as cards on `/blog` and the home page preview; there are no individual post pages yet.

**A news/event item** — add an entry to `news` in [`src/data/news.ts`](src/data/news.ts). Appears on `/news` and the home page preview.

**Cover images** — after adding a new cover to `public/images/book-covers/`, run:

```bash
npm run images:webp
```

This converts PNG/JPG covers in that folder to `.webp` (via `scripts/convert-covers-to-webp.mjs`), which is typically 70-90% smaller. Point the book's `imageSrc` at the generated `.webp` file; the original stays in the repo as the source master.

## SEO

- `src/components/Seo.tsx` sets the page title, meta description, canonical URL, and OG/Twitter tags per page, and can embed JSON-LD via its `jsonLd` prop (used for the `Book` schema on `/books/:slug`).
- A site-wide `Person` JSON-LD schema lives directly in `index.html`.
- `public/sitemap.xml` is regenerated from the app's routes and book slugs by `scripts/generate-sitemap.mjs`, which runs automatically before `npm run build` (the `prebuild` script). Run `npm run sitemap` to regenerate it manually.
- `public/robots.txt` points crawlers at the sitemap.

## Remaining manual TODOs

These need real accounts/credentials and can't be done from the codebase alone:

- **Connect the custom domain** `authorgaurav.com` in your host/deploy settings.
- **Newsletter provider** — create a MailerLite/ConvertKit account, set `VITE_NEWSLETTER_ENDPOINT` in your deploy environment, and set up a "Free Chapter" automation with a PDF attachment.
- **Search & analytics** — add Google Search Console + Google Analytics, and submit `https://authorgaurav.com/sitemap.xml` to Search Console.
- **Replace placeholders** — every `// TODO: real link` in `src/data/books.ts` (Amazon/Flipkart/Kindle buy links), the reader testimonials in `src/data/books.ts` and press quotes in `src/data/press.ts`, and the social handles in `src/data/social.ts` are placeholders and should be swapped for the real ones.
