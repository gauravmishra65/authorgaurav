# React Router v7 Migration Plan (Plan Only — Not Executed)

This document is a plan for a future migration, written against the app's actual current routing code (`src/App.tsx`). **No upgrade has been performed as part of this change set** — `package.json` still pins `react-router-dom": "^6.26.1"`.

## Current version and advisory context

- Installed: `react-router-dom@^6.26.1` (declarative mode — `<BrowserRouter>` + `<Routes>`/`<Route>`, no data router, no loaders/actions, no `createBrowserRouter`).
- `npm audit` (run just now, as part of this pass) reports two moderate advisories against the installed range, both affecting `>=6.0.0 <7.18.0` — meaning **no patched 6.x release exists**; the actual fix requires upgrading to `react-router-dom@7.18.0` or later:
  - [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) — open redirect via a backslash in `<Link>`/`useNavigate` (CVE-2025-68470 bypass).
  - [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) — arbitrary constructor injection via `deserializeErrors()` in SSR hydration (CVSS 6.1). This app doesn't do SSR, so this specific one likely doesn't apply in practice, but it's still flagged against the installed version range.
  - This is the concrete security motivation for eventually doing this migration — not just "staying current."
- No `<Form>`, no `useLoaderData`/`useActionData`, no deferred data — this app fetches everything client-side via `useSupabaseData`/`useEffect`-based hooks (see `src/lib/useSupabaseData.ts` and `src/lib/queries.ts`). This matters a lot for risk: the app never adopted the v6.4+ data APIs, so it isn't exposed to the parts of the v6→v7 migration that are hardest (loader/action semantics, `defer()`, error boundaries tied to route objects).

## Actual risk assessment

**Low-to-moderate.** The single biggest factor keeping this low-risk: the app uses only `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Navigate>`, `<Link>`, `<Outlet>`, `useParams`, and `useNavigate`-style hooks (implicitly, wherever pages need them) — all APIs that v7 keeps with the same names and behavior in non-data-router mode. React Router v7 folds in what used to be "Remix"-style data routing as an *optional* layer; a codebase that never opted into it doesn't have to change how it's structured to upgrade.

The real work in a v6→v7 upgrade for an app like this is almost entirely mechanical:
1. Bump the package version.
2. Address the few genuine breaking changes (below).
3. Re-run the full test suite (Vitest + the 46-test Playwright suite, including the new accessibility suite) and re-verify the 29 pre-rendered routes still render correctly.

## Breaking changes to check against this codebase specifically

Cross-referencing v6→v7's actual changelog against what's used here:

| v6→v7 change | Applies to this app? | Notes |
|---|---|---|
| Minimum React version bumped | **Yes — needs verification** | v7 requires React 18+ (this app is already on React 18.3.1, so likely fine, but confirm against the exact v7 release notes at migration time). |
| `future.v7_*` flags removed/defaulted on | **Yes** | v6.26 already supports opting into v7 behavior early via `future` flags on `<BrowserRouter>`. None are currently set in `App.tsx` — worth turning them on *one at a time* in a v6.26 branch before the actual v7 bump, to catch behavior changes early (see "Recommended approach" below). |
| Relative route path resolution changes | **Possibly** | This app's routes are all simple, non-nested-relative paths (`/books/:slug`, `/admin/blog/:id/content`, etc.) — low risk, but worth a manual click-through of every nav link after upgrading, which the existing Playwright smoke suite already partially covers (`e2e/smoke.spec.ts`'s "no href=#" and mobile-nav tests exercise real navigation). |
| `<Routes>`/`<Route>` API itself | **No change expected** | This app doesn't use data routers, so the biggest v7 additions (loaders, actions, `<Form>`) are opt-in and irrelevant unless adopted later. |
| Removal of `unstable_` prefixed APIs from v6 | **No** | This app doesn't reference any `unstable_*` React Router exports. |

## Redirect behavior — no change to the site's own redirect strategy

This app's actual "redirect" logic lives almost entirely **outside** React Router:
- The `/admin` → `/admin/books` redirect uses `<Navigate to="/admin/books" replace />` — this API is unchanged in v7.
- The trailing-slash/canonical-URL behavior (GitHub Pages 301-redirecting `/books/foo` → `/books/foo/`) is a **hosting-layer** behavior, not a React Router concern — see `src/lib/url.ts` and `scripts/generate-sitemap.mjs`. A React Router major version bump has zero effect on this.

## Pre-rendering implications

`scripts/prerender.mjs` drives a real headless browser (`@playwright/test`'s `chromium`) against the built app via `vite preview`, waiting for each route's real `<h1>` to render before snapshotting the DOM. This process is agnostic to which router version is running underneath — it just loads the page and waits for rendered content. **No changes needed to the pre-render pipeline for a router upgrade**, beyond re-running it as part of post-upgrade verification to confirm all 29 routes still pre-render successfully with the same route-specific `<title>`/meta output.

## Admin-route implications

The `/admin/*` route tree is structurally identical to the public one (nested `<Route>`s under a layout route) and carries no data-router usage either. The one thing worth double-checking post-upgrade: `AdminLayout.tsx`'s auth-gate behavior (redirecting unauthenticated visitors) still uses whatever pattern it uses today (Supabase session check + conditional render/redirect) — confirm this still fires correctly, since it's the one place in the app where "should this route even render" logic exists outside plain `<Route>` matching.

## Testing required before/after the upgrade

1. Full existing suite: `npm run typecheck && npm run lint && npm run test && npm run test:e2e && npm run build`.
2. Specifically re-run `e2e/smoke.spec.ts`'s navigation-dependent tests (mobile nav drawer, "no href=#", canonical-tag-matches-sitemap) and the full `e2e/accessibility.spec.ts` suite — both exercise real client-side navigation across the app and would surface any relative-path resolution regressions.
3. Manually click through the admin CRUD flows once locally (`/admin/books`, `/admin/blog`, `/admin/blog/:id/content`, etc.) — these aren't covered by the public-facing Playwright suite today.
4. Re-run `scripts/prerender.mjs` (via `npm run build`) and diff a sample of `dist/<route>/index.html` files against pre-upgrade output to confirm no unexpected markup changes.

## Rollback plan

- Perform the upgrade on a dedicated branch (see below), never directly on `main`.
- Because this app doesn't use any v7-only APIs, rollback is simply: revert the `package.json`/`package-lock.json` change and reinstall. There's no data-model or file-structure migration to unwind (unlike a Remix-style loader migration would require).
- Do not deploy the upgrade until the full test suite in the section above passes on the branch.

## Recommended approach (when this is actually scheduled)

1. Create a branch (e.g. `chore/react-router-v7`).
2. First, **stay on v6.26** and enable each `future.v7_*` flag on `<BrowserRouter>` one at a time (`v7_relativeSplatPath`, `v7_startTransition`, etc. — check the exact flag list current at migration time), running the full test suite after each. This surfaces most behavior changes without an actual major-version bump.
3. Once all future flags are on and green, bump `react-router-dom` to the latest v7 release.
4. Remove the now-redundant `future` flag props (v7 defaults them on).
5. Run the full verification list above.
6. Open a PR, do not merge/deploy without explicit sign-off — this is exactly the kind of dependency bump this project's standing rules ask to flag rather than execute silently.

## Explicitly out of scope for this document

No code changes were made to `package.json`, `App.tsx`, or any routing code as part of writing this plan. This is planning output only, per the request that this phase not perform the actual upgrade.
