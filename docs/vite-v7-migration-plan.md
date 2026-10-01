# Vite v7 Migration Plan (Plan Only — Not Executed)

This document is a plan for a future migration, written against the app's actual current build setup (`vite.config.ts`, `vitest.config.ts`, `scripts/prerender.mjs`, `package.json`). **No upgrade has been performed as part of this change set** — `package.json` still pins `"vite": "^5.4.2"` (installed: `5.4.21`).

## Current version and advisory context

- Installed: `vite@5.4.21`, bundling `esbuild@0.21.5`.
- `npm audit` (run just now, as part of this pass) reports 2 vulnerabilities rooted here:
  - [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) (moderate) — esbuild's dev server lets any website send requests to it and read the response. Vulnerable range: `esbuild <=0.24.2`.
  - [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) (high, CVSS 7.5) — `server.fs.deny` bypass on Windows alternate paths. Vulnerable range for the v5/v6 line: `vite <=6.4.2` (no patched release exists in that range — the advisory lists separate patched points inside the v7 and v8 lines instead, `<=7.3.4` and `<=8.0.15` respectively).
  - Two more moderate vite advisories ([GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) path traversal in optimized-deps `.map` handling, [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) NTLMv2 hash disclosure via UNC paths on Windows) apply to the same `<=6.4.x` range and are likewise unpatched below v7.
  - `npm audit fix --force` offers to jump straight to `vite@8.3.2` ("latest"). **That's not the minimal fix** — see "Why v7, not v8" below.
- Dev-only risk in practice: these are all dev-server-only vulnerabilities (malicious site reaching your local Vite dev server, or a local path-traversal/fs-bypass while `vite dev` is running). None of this ships into the production bundle or affects `authorgaurav.com` directly — the exposure is to whoever's machine runs `npm run dev`. Still worth fixing; not an emergency.
- One more piece of current-state context found while researching this: last session's `npm audit fix` pass already bumped `vitest` to `4.1.11`, and `vitest@4.1.11`'s own `peerDependencies` require `vite: ^6.0.0 || ^7.0.0 || ^8.0.0` — meaning **vitest no longer formally supports vite 5 at all**. npm resolved this by giving `vitest`'s internal `@vitest/mocker` dependency its own private nested copy of `vite@8.3.2`, separate from the app's top-level `vite@5.4.21` (confirmed via `npm ls vite vitest`). Tests still pass today because npm isolates the two copies, but it's a real signal this gap is already overdue, not hypothetical.

## Why v7, not v8 — the minimal real fix

`npm audit fix --force` defaults to the `latest` dist-tag (`8.3.2`), but that's not where these specific advisories get patched. Checked each advisory's actual patched-version data directly:

| Advisory | Vulnerable range | Patched from |
|---|---|---|
| GHSA-fx2h-pf6j-xcff | `<=6.4.2` | `7.3.5` |
| GHSA-4w7w-66w2-5vf9 | `<=6.4.1` | `7.3.2` |
| GHSA-v6wh-96g9-6wx3 | `<=6.4.2` | `7.3.5` (bundled fix) |
| GHSA-67mh-4wv8-2f99 (esbuild) | `esbuild <=0.24.2` | pulled in automatically — `vite@7.3.6` depends on `esbuild: ^0.27.0 \|\| ^0.28.0` |

**`vite@7.3.6` (the current stable v7 release) fully resolves all four advisories on its own.** Going to v8 adds nothing toward fixing *these* vulnerabilities — it would only be worth doing for other reasons (see below), and those reasons come with meaningfully higher risk and effort for this codebase specifically:

- `@vitejs/plugin-react@4.7.0` (currently installed) declares support for `vite: ^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0` — **it already works with v7, no plugin bump needed.** It does *not* declare support for `^8.0.0`.
- The `@vitejs/plugin-react` version that *does* support v8 is `6.1.1`, which pulls in new peer dependencies this project has never used: `oxc-transform-react`, `@rolldown/plugin-babel`, `babel-plugin-react-compiler`.
- That's because **Vite 8 replaces esbuild and Rollup with Rolldown and Oxc as the default bundler and transformer** — a genuine architecture change, not a routine version bump. `build.rollupOptions` is renamed `build.rolldownOptions`, the `esbuild` config option is deprecated in favor of `oxc`, Lightning CSS becomes the default CSS minifier, and CommonJS default-import interop behavior changes.
- This project's own test output already shows the practical edge of that shift today, independent of this migration: `vitest`'s nested `vite@8.3.2` prints `Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored` on every `npm run test` / `npm run test:e2e` run, because `@vitejs/plugin-react` (still on the v7-compatible `4.7.0`) configures esbuild JSX options that Oxc silently overrides inside that nested v8 copy. Harmless today (tests pass), but it's a live preview of the kind of interop question a real v8 bump would need to resolve properly across the whole toolchain, not just suppress.

**Recommendation: do v7 now as the security fix. Treat v8 as its own separate, later evaluation** once `@vitejs/plugin-react` v6 and the Rolldown/Oxc toolchain have had more time to mature, and only if there's a concrete reason to want it (the advisories don't require it).

## Actual risk assessment

**Low.** `vite.config.ts` is minimal — `defineConfig({ plugins: [react()] })`, nothing else:
- No `resolve.conditions`, `css.preprocessorOptions`, `build.lib`, custom proxy, or SSR config to be affected by the v6 config-default changes (conditions, JSON stringify mode, Sass legacy API, CSS output naming).
- No Sass/SCSS anywhere in `src/` — the Sass legacy-API removal (gone by v7) is moot.
- No `splitVendorChunkPlugin`, `transformIndexHtml` hook-level `enforce`/`transform`, or `build.rollupOptions.output.manualChunks` usage anywhere in the codebase — the v7 removals of these don't apply.
- No `.browserslistrc` or `package.json` `browserslist` field — the v6→v7 default build-target bump (`modules` → `baseline-widely-available`, roughly Chrome/Edge 107+, Firefox 104+, Safari 16+) just takes Vite's new default. Worth a conscious note for a general-audience author site in 2026, but not a blocker — those are already old-enough browser versions that this is very unlikely to affect real visitors, and nothing in the stack specifically targets older browsers today.
- `postcss.config.js` is a plain ESM object (`tailwindcss` + `autoprefixer`), no TypeScript/YAML config format — the v6 `postcss-load-config` v6 bump (which added a `tsx`/`jiti`/`yaml` requirement for those formats) doesn't apply here.
- `package.json` has `"type": "module"` — the whole project is already pure ESM, so the v8-era CommonJS-interop changes (irrelevant anyway, since this plan targets v7) aren't a concern either way.

The one genuine Vite-API touchpoint in this codebase is `scripts/prerender.mjs`, which imports Vite's JS API directly: `import { preview } from 'vite'`, then calls `preview({ root, preview: { port, strictPort }, logLevel })` and reads `server.resolvedUrls.local[0]`. This exact shape isn't called out as changed in the v6 or v7 migration guides — it's stable, commonly-used API surface. Still, because this is the one place the app code (not just config) touches Vite directly, it gets explicit re-verification in testing below rather than just trusted by omission.

Node.js requirement: v7 needs `^20.19.0 || >=22.12.0` (up from v5/v6's `^18.0.0 || ^20.0.0 || >=22.0.0`). The installed local Node is `v24.21.0` — already satisfied. CI (`.github/workflows/deploy.yml`) pins its own Node version via `actions/setup-node@v4`; confirm that pinned version also meets `20.19+`/`22.12+` before merging (see Testing section).

## Breaking changes to check against this codebase specifically

| v5→v6 change | Applies to this app? | Notes |
|---|---|---|
| `resolve.conditions` no longer implicit | No | Not set; app doesn't rely on custom condition resolution. |
| Sass legacy API → modern API default | No | No Sass anywhere in `src/`. |
| `postcss-load-config` v6 (needs `tsx`/`jiti` for TS configs) | No | `postcss.config.js` is plain JS/ESM. |
| `splitVendorChunkPlugin` removed | No | Never used. |
| CSS output naming in library mode | No | This app isn't built in library mode. |
| **v6→v7 change** | | |
| Node 18 support dropped | **Yes — satisfied** | Installed Node is 24.21.0; verify CI's pinned version separately. |
| Default build target → `baseline-widely-available` | Yes, cosmetic | Slightly newer minimum browser baseline in the output bundle; no known real-world impact for this audience. |
| Sass legacy API fully removed | No | No Sass. |
| `splitVendorChunkPlugin` / `transformIndexHtml` hook removals | No | Neither used. |
| **Both majors** | | |
| `scripts/prerender.mjs`'s `preview()` API call | **Yes — needs re-verification** | Not flagged as changed in either guide, but it's the one place app code calls into Vite's JS API directly rather than just config, so it gets explicit testing rather than being assumed fine. |
| `@vitejs/plugin-react` compatibility | **Yes — already compatible** | Installed `4.7.0` declares `vite: ^4.2.0 \|\| ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0` — no plugin version bump needed for this migration. |
| `vitest` peer compatibility | **Yes — resolves a pre-existing gap** | `vitest@4.1.11` requires `vite: ^6.0.0 \|\| ^7.0.0 \|\| ^8.0.0`; bumping the app to v7 brings the top-level `vite` within vitest's declared support range for the first time since the last `npm audit fix` pass. |

## Pre-rendering implications

Already covered above under "risk assessment" — `scripts/prerender.mjs` is the one place this migration touches real app code, via `import { preview } from 'vite'`. Re-running `npm run build` (which runs `vite build && node scripts/prerender.mjs`) is both the test and the proof: if the preview server fails to start, resolves the wrong URL, or routes 38 pages incorrectly, the script's own existing hard-failure checks (generic-title detection, per-route `<h1>` wait) will surface it immediately rather than silently shipping bad output.

## Testing required before/after the upgrade

1. Full existing suite: `npm run typecheck && npm run lint && npm run test && npm run test:e2e && npm run build`.
2. Specifically confirm `npm run build`'s prerender step completes all 38 routes with route-specific `<title>`s (not the generic homepage fallback) — this is `scripts/prerender.mjs`'s own built-in failure mode, so a broken `preview()` call would already fail the build loudly.
3. Run `npm run validate:content` and `npm run validate:links` (both already part of the CI pipeline) against the new build output.
4. Diff the production bundle's JS output for any unexpected syntax-target changes from the `baseline-widely-available` default (e.g. `npm run build` and spot-check `dist/assets/index-*.js` isn't doing anything surprising) — low expected impact, but cheap to eyeball.
5. Confirm whatever Node version `.github/workflows/deploy.yml`'s `actions/setup-node@v4` step pins satisfies v7's `^20.19.0 || >=22.12.0` requirement — bump the workflow's Node version alongside this change if it doesn't.
6. Re-run `npm audit` after the bump and confirm all four advisories listed above are gone.

## Rollback plan

- Perform the upgrade on a dedicated branch (see below), never directly on `main`.
- Rollback is simply: revert the `package.json`/`package-lock.json` change and reinstall. `vite.config.ts` needs no changes for this migration (see risk assessment — none of the v6/v7 config-default changes apply to this minimal config), so there's no config file to unwind either.
- Do not deploy the upgrade until the full test suite in the section above passes on the branch.

## Recommended approach (when this is actually scheduled)

1. Create a branch (e.g. `chore/vite-v7`).
2. Bump `vite` to `^7.3.6` (or whatever the current stable v7 patch is at migration time — re-check `npm view vite dist-tags` first, since v7 may have moved past `7.3.6` by then).
3. Leave `@vitejs/plugin-react` at its current `^4.3.1` range (resolves to `4.7.0` or newer within that range) — no bump needed, already v7-compatible.
4. Run the full verification list above.
5. Re-run `npm audit` to confirm the four advisories are actually gone (not just assumed from the version-range research above — verify against the real installed tree).
6. Open a PR, do not merge/deploy without explicit sign-off — same standing rule as the react-router migration.

## Explicitly out of scope for this document

- **Vite 8 / Rolldown+Oxc** is deliberately not this plan's target. It isn't needed to fix the current advisories (v7.3.6 already does), and it brings a real bundler-architecture change (`esbuild`→Oxc, `Rollup`→Rolldown, a required `@vitejs/plugin-react` major bump with new peer deps) that deserves its own dedicated risk evaluation once that toolchain has matured further — not something to fold into a routine security patch.
- No code changes were made to `package.json`, `vite.config.ts`, `vitest.config.ts`, or any build script as part of writing this plan. This is planning output only.
