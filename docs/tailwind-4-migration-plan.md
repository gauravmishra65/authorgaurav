# Tailwind CSS 4 Migration Plan (Plan Only — Not Executed, Deferred)

This document is a plan for a future migration, written against the app's actual current Tailwind usage — not just `tailwind.config.js` and `postcss.config.js`, but a direct grep of every real utility class this project uses that Tailwind v4 changes the meaning of. **No upgrade has been performed as part of this change set** — `package.json` still pins `"tailwindcss": "^3.4.1"` (installed: `3.4.19`).

## The conclusion, up front — and why it's different from the other deferrals

**Defer, but for a different reason than ESLint 10 or TypeScript 7.** Those two are blocked outright — the dependency literally refuses to install or crashes. Tailwind 4 has no such hard blocker: it installs fine, has a real official codemod (`npx @tailwindcss/upgrade`), and nothing here is incompatible. The reason to defer is different and more important to get right: **this project genuinely uses several utility classes whose names Tailwind v4 keeps but silently redefines to mean something else.** That's not a build error you'd catch in CI — it's a visual regression that only shows up by looking at the site, across potentially every one of its 38 routes. This is real, feature-shaped visual-QA work, not a version-number flip, and deserves its own dedicated pass with the time to actually look at every page — not something to bundle into a routine dependency bump.

## What actually changes meaning (checked against this codebase's real usage, not the abstract list)

Grepped the whole `src/` tree for every class Tailwind's own v3→v4 upgrade guide calls out as renamed-not-removed (the dangerous kind — the ones that still "work" post-upgrade but mean something different):

| Utility | v3 meaning moves to (v4 name) | Real usage in this codebase |
|---|---|---|
| `rounded` (bare) | `rounded-sm` | **105 occurrences** |
| `rounded-sm` | `rounded-xs` | **88 occurrences** |
| `shadow` (bare) | `shadow-sm` | **34 occurrences** |
| `backdrop-blur` / `backdrop-blur-sm` | `backdrop-blur-sm` / `backdrop-blur-xs` | 2 + 1 occurrences |
| `border` (bare, relies on v3's implicit `gray-200` default) | now defaults to `currentColor` instead | **115 occurrences** |
| `flex-shrink-*` / `flex-grow-*` | `shrink-*` / `grow-*` | used across 10 files |
| `space-y-*` / `space-x-*` (selector mechanism changes from sibling-combinator to `:not(:last-child)`) | same class names, different CSS selector under the hood | ~30 occurrences |
| Important modifier (`!my-8`, leading `!`) | moves to trailing (`my-8!`) | 5 occurrences (`!mb-10`, `!my-6`, `!my-8`, `!my-10`, `!my-12`) |

**The one that matters most: `outline-none`, used in 6 files** (`BookSearch.tsx`, `Layout.tsx`, `NewsletterForm.tsx`, `TestimonialForm.tsx`, `AdminLogin.tsx`, `Contact.tsx`). In v3, `outline-none` is the conventional way to suppress the browser's default focus ring before applying a custom one. In v4, that exact behavior is renamed `outline-hidden`, and the utility now literally named `outline-none` means something new (`outline-style: none` with none of the old accessibility-conscious handling). If the rename isn't applied correctly everywhere, this could **silently reintroduce invisible focus indicators** — a real regression for a site that this engagement has specifically driven to 0 accessibility violations across 28 routes. This is the single highest-priority thing to verify, not just eyeball.

None of `bg-opacity-*`/`text-opacity-*`/etc. (the deprecated-and-fully-removed-in-v4 opacity utilities) are used anywhere — that category is a non-issue here. No `@apply` usage anywhere in `src/index.css` either, so the trickier parts of migrating custom CSS that leans on Tailwind's theme functions don't apply.

## Other real changes to account for

- **PostCSS plugin package changes.** `postcss.config.js` currently runs `tailwindcss` + `autoprefixer` as separate plugins. v4 moves the PostCSS plugin to `@tailwindcss/postcss` and handles vendor-prefixing internally — `autoprefixer` becomes redundant and should be removed, not just left in alongside the new plugin.
- **Browser support baseline rises**: Safari 16.4+, Chrome 111+, Firefox 128+ (v4 relies on native CSS `@property` and `color-mix()`). Same category of note as the Vite v7 plan's `baseline-widely-available` build-target change — a modern-but-reasonable bar for a general-audience site in 2026, not expected to be a real blocker, but worth being a conscious decision rather than an unnoticed side effect.
- **`tailwind.config.js` itself** is clean for the official codemod to handle: plain `theme.extend` (colors, fontFamily, fontSize, boxShadow, letterSpacing, zIndex, keyframes, animation), no `plugins` array entries, no `safelist`, no custom plugin functions. This is about as convertible a config as exists — the codemod's CSS-first `@theme` conversion should handle it cleanly.

## Recommended approach (when this is actually scheduled)

1. Create a branch (e.g. `chore/tailwind-4`) — same standing rule as every other migration here.
2. Run the official codemod: `npx @tailwindcss/upgrade` (requires Node 20+, already satisfied). Let it handle the mechanical class renames and the `tailwind.config.js` → CSS `@theme` conversion rather than hand-editing — it's specifically built for exactly the rename categories above.
3. Swap `postcss.config.js` from `tailwindcss`/`autoprefixer` to `@tailwindcss/postcss`; remove `autoprefixer` from `package.json`.
4. Run the full existing automated suite (`typecheck`, `lint`, `test`, `test:e2e`, `build`) — necessary but **not sufficient** here, since none of these suites visually diff border-radius, shadow depth, or border color.
5. **The real work**: a manual visual pass across representative pages at both breakpoints (desktop/mobile), specifically checking the categories above — rounded corners, shadows, borders, backdrop-blur, and spacing groups — plus explicit keyboard-navigation testing (Tab through forms and nav) to confirm focus rings are still visible everywhere `outline-none` was used. This is the step that makes this a real time investment, not a rubber-stamp.
6. Re-run the full `e2e/accessibility.spec.ts` suite specifically after the `outline-none` fix, even though axe-core's automated checks aren't guaranteed to catch a missing-but-not-technically-invalid focus style — treat the manual keyboard pass as the real verification there, not the automated suite alone.
7. Open a PR, do not merge/deploy without explicit sign-off, and call out the manual visual-QA pass explicitly in that PR so a reviewer knows automated green doesn't mean "visually unchanged" here.

## Explicitly out of scope for this document

- No attempt was made to run the codemod or preview its output as part of writing this plan — that's real execution work, reserved for when this is actually scheduled with time set aside for the visual-QA pass.
- No code changes were made to `package.json`, `tailwind.config.js`, `postcss.config.js`, or any component as part of writing this plan. This is planning output only.
