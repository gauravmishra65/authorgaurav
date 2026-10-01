# TypeScript 7 Migration Plan (Plan Only — Not Executed, Deferred)

This document is a plan for a future migration, written against the app's actual current TypeScript setup (`tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`'s `typescript-eslint` usage). **No upgrade has been performed as part of this change set** — `package.json` still pins `"typescript": "^5.5.3"` (installed: `5.9.3`).

## The conclusion, up front

**Defer, same as ESLint 10.** TypeScript 7 is the completed Go-native rewrite of the compiler (shipped GA per public release notes) — a real, substantial performance win in general, but `typescript-eslint` (this project's own linting dependency, not a hypothetical concern) does not support it yet, and a request to support it was closed upstream as "not planned" for the 7.0 line. Dev-tooling-adjacent either way (the performance win is in `tsc`/editor tooling, not anything shipped to `authorgaurav.com`), so there's no cost to waiting.

## The real blocker: typescript-eslint can't run against TypeScript 7

Checked directly, not assumed:

```
$ npm view typescript-eslint@8.71.0 peerDependencies --json
{
  "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
  "typescript": ">=4.8.4 <6.1.0"
}
```

The upper bound is `<6.1.0` — this isn't "hasn't been bumped yet," it's an explicit, deliberate cap. `typescript-eslint` reads type information through TypeScript's classic compiler API, which the native Go-based TypeScript 7.0 build doesn't expose at all. Per public tracking, the stable programmatic API that `typescript-eslint` would need doesn't land until TypeScript **7.1**, not 7.0 — and a support request filed on TS 7.0's GA day was closed upstream as "not planned" for 7.0 itself.

This project's `eslint.config.js` uses `typescript-eslint`'s `tseslint.config(...)` helper and `tseslint.configs.recommended` directly — this isn't a tangential dev dependency, it's how linting is wired for every `.ts`/`.tsx` file in `src/`. Installing `typescript@7` today would mean either: (a) `npm install` refusing to resolve the peer conflict without `--force`, or (b) forcing it through and having type-aware lint rules potentially misbehave against an API surface `typescript-eslint` was never built to read — neither is a real migration, both are forcing an unsupported combination.

## What a workaround would look like, deliberately not adopted here

Public guidance on this exact gap (multiple independent write-ups during TS 7's rollout) converges on the same shape: keep the classic TypeScript 6.x compiler installed as a second package (commonly surfaced as `@typescript/native` or similar for the actual `tsc`/build-time compiler) specifically so `typescript-eslint` still has a classic-API TypeScript to import, while the native compiler handles the real build. That's a real, working pattern elsewhere, but it's a split-toolchain setup this project doesn't need to take on for a 6-second `tsc --noEmit` run (measured just now, on this exact codebase) — the performance motivation that makes TS 7 compelling for large codebases (one write-up cites a 13s→3.5s typecheck improvement) doesn't apply much to a project this size in the first place.

## What everything else in this stack actually requires (checked directly)

| Package | Installed | TypeScript range it declares |
|---|---|---|
| `typescript-eslint` | `8.71.0` | `>=4.8.4 <6.1.0` — **excludes TS 7 entirely, by design** |
| `vite` (via `@vitejs/plugin-react`, `vitest`) | `7.3.6` / `4.1.11` | No explicit TypeScript peer constraint found — these consume compiled output, not the compiler API, so they're not the blocker here |

`typescript-eslint` is the one dependency holding this back, same shape as the ESLint 10 situation — a real upstream API gap, not a version-range oversight.

## Recommended approach (when this is actually revisited)

1. Watch for `typescript-eslint` to ship support against TypeScript 7.1+'s stable programmatic API (its peer range upper bound moving past `6.1.0` for `typescript` is the concrete signal).
2. Re-run this plan's research at that point — `typescript`'s own breaking-changes list (separate from the eslint-tooling gap) wasn't deeply audited here since the real blocker made it moot; a real migration attempt should still check that cross-reference, the same way the react-router/Vite/React 19 plans did for their own ecosystems.
3. Branch, bump, verify, PR, explicit sign-off before merge — same standing approach as every other migration in this series.

## Explicitly out of scope for this document

- No attempt was made to adopt the split-compiler workaround (classic TypeScript for linting, native TypeScript for builds) — that's a real option, just not one worth taking on for this project's size right now.
- `typescript`'s own non-eslint-related breaking changes between 5.x and 7.x were not researched in depth, since the `typescript-eslint` blocker makes the question moot until it's resolved.
- No code changes were made to `package.json`, `tsconfig.app.json`, `tsconfig.node.json`, or `eslint.config.js` as part of writing this plan. This is planning output only.
