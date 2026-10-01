# ESLint 10 Migration Plan (Plan Only — Not Executed, Not Recommended Yet)

This document is a plan for a future migration, written against the app's actual current lint config (`eslint.config.js`) and its real rule usage. **No upgrade has been performed as part of this change set** — `package.json` still pins `"eslint": "^9.9.0"` (installed: `9.39.5`).

## The conclusion, up front

**Don't do this yet.** Unlike the react-router, Vite, and React 19 plans, this one isn't a "do it now, low risk" recommendation — it's "the ecosystem isn't ready, here's the exact blocker and what to watch for." This is dev-tooling-only (zero production runtime impact either way), so there's no cost to waiting.

## The real blocker: eslint-plugin-react crashes under ESLint 10

Checked this project's actual active ruleset, not just version ranges in isolation: `eslint.config.js` spreads `react.configs.recommended.rules` into its flat config, and that ruleset includes `react/display-name`:

```
$ node -e "console.log(require('eslint-plugin-react').configs.recommended.rules['react/display-name'])"
# → confirmed present and active in this exact config
```

`eslint-plugin-react@7.37.5` (the current, and only, published release — confirmed via `npm view eslint-plugin-react versions`, nothing newer exists) calls `context.getFilename()` internally (in its version-detection utility, `lib/util/version.js`) to figure out which ESLint API shape it's running under. **ESLint 10 removed `getFilename()` from the rule context entirely.** The documented, reproduced result (confirmed via the plugin's own open GitHub issue, [jsx-eslint/eslint-plugin-react#3977](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977), opened 2026-02-07, still open with no fix merged as of this writing):

```
TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function
```

This isn't a peer-dependency warning you can safely ignore — `npm run lint` would **hard-crash** on startup, not just produce a stricter/different lint result. Since `react/display-name` is already active in this exact config (not a rule this project added deliberately that could just be disabled to work around it — well, it technically *could* be disabled, but that's patching around an upstream bug rather than actually migrating), the plugin as a whole is non-functional under ESLint 10 today.

There is a tracked fix PR ([jsx-eslint/eslint-plugin-react#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979)), but per public tracking it's itself blocked on an upstream `eslint-plugin-import` compatibility issue, open since February 2026 with no resolution as of this writing (multiple independent projects — ToolJet, FluidFramework, others — are tracking the same blocker in their own issue trackers, so this isn't specific to this codebase or a one-off report).

## What everything else in this stack actually supports (checked directly, not assumed)

| Package | Installed | Declares ESLint 10 support? |
|---|---|---|
| `typescript-eslint` | `8.71.0` | **Yes** — peer is `eslint: ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0` |
| `eslint-plugin-react-hooks` | `7.1.1` | **Yes** — peer is `eslint: ^3.0.0 \|\| ... \|\| ^9.0.0 \|\| ^10.0.0` |
| `eslint-plugin-react-refresh` | `0.5.7` | **Yes** — peer is `eslint: ^9 \|\| ^10` |
| `eslint-plugin-react` | `7.37.5` | **No — and crashes, not just warns, per above** |

If this project didn't use `eslint-plugin-react`, this would be a same-day, low-risk bump like the others. It's the one dependency holding this back.

## Workarounds that exist, deliberately not recommended here

Public discussion around this same blocker (search results surfaced several other projects hitting it) mentions two paths other projects have taken:
- **`@eslint-react/eslint-plugin`** — a from-scratch rewrite of React linting for ESLint's flat-config era, with its own rule names and config shape.
- **`@ternaus/eslint-plugin-react`** — an independent, unofficial continuation/fork specifically patched for ESLint 10 compatibility.

Neither is adopted in this plan. Swapping the plugin itself is a materially bigger decision than a version bump — different rule names mean `eslint.config.js`'s rule overrides (`react/no-unescaped-entities`, `react/prop-types`, `react/no-unknown-property`, etc.) would need remapping, and an unofficial fork carries its own trust/maintenance questions. That's a separate evaluation from "bump ESLint," not a sub-step of this one.

## Recommended approach (when this is actually revisited)

1. Before doing anything else, re-check [jsx-eslint/eslint-plugin-react#3977](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977) and its linked PR #3979 for a merged fix and new release.
2. If fixed: re-run this plan's research (peer ranges may have shifted again by then) and proceed the same way as the react-router/Vite/React 19 plans — branch, bump, verify, PR, explicit sign-off before merge.
3. If still unfixed after a long wait: revisit whether `@eslint-react/eslint-plugin` is mature enough to be worth the bigger migration, as its own separate plan — don't fold it into "the ESLint bump."

## Explicitly out of scope for this document

- No attempt was made to work around the crash (e.g., disabling `react/display-name` or patching the installed plugin) — that would be papering over an unfixed upstream bug, not a real migration.
- No code changes were made to `package.json` or `eslint.config.js` as part of writing this plan. This is planning output only.
