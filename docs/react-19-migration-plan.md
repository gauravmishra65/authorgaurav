# React 19 Migration Plan (Plan Only — Not Executed)

This document is a plan for a future migration, written against the app's actual current component code (all of `src/`), entry point (`src/main.tsx`), and test setup (`src/test/setup.ts`, `src/data/books.test.ts`). **No upgrade has been performed as part of this change set** — `package.json` still pins `"react": "^18.3.1"` / `"react-dom": "^18.3.1"` (installed: `18.3.1`).

## Why this one is different from the react-router and Vite plans

Those two were **security-motivated** — real CVEs with no patched release below a major-version bump. **This one is not.** `npm audit` reports nothing against React 18.3.1; there is no vulnerability forcing this upgrade. This is a version-currency upgrade: staying on a maintained major, picking up the newer API surface (`useActionState`, `useOptimistic`, the `use()` hook, `<Activity>`, improved error reporting), and clearing a growing peer-dependency gap (see below). That changes the framing: there's no urgency clock on this one, so it's fine to defer indefinitely if there's nothing else pulling for it.

## Current version and peer-dependency context

- Installed: `react@18.3.1`, `react-dom@18.3.1`, `@types/react@18.3.31`, `@types/react-dom@18.3.7`.
- `npm outdated` (run just now) shows `react`/`react-dom`/`@types/react`/`@types/react-dom` all have `19.3.0` as latest, outside the current `^18.x` ranges.
- Checked every React-facing dependency's peer range directly rather than assuming:

| Package | Installed | Declares React 19 support? |
|---|---|---|
| `react-router-dom` | `7.18.4` | Yes — peer is `react: >=18` (open-ended, no action needed) |
| `@testing-library/react` | `16.3.3` | Yes — `^18.0.0 \|\| ^19.0.0` |
| `@vitejs/plugin-react` | `4.7.0` | N/A — only peers on `vite`, not `react` itself |
| `lucide-react` | `0.344.0` | **No** — peers on `^16.5.1 \|\| ^17.0.0 \|\| ^18.0.0` only |

**`lucide-react` is the one real blocker.** Its installed `0.344.0` doesn't declare React 19 in its peer range at all. Checked when that changed: React 19 peer support was added by `lucide-react@0.400.0` and has been present in every release since (confirmed through the current latest `0.x`, `0.577.0`). Since `lucide-react` is still pre-1.0 (semver treats every `0.x` minor bump as potentially breaking), this migration needs an accompanying bump to **the latest `0.x` release** (`0.577.0` as of this writing — re-check `npm view lucide-react versions` at execution time, since it releases frequently) rather than jumping to the `1.x` line, which exists (`1.0.0` onward) but is a separate major with its own unrelated API changes not needed here. All 39 icon names this codebase actually imports (`AlertTriangle`, `ArrowLeft`, `ArrowRight`, `ArrowUpRight`, `BookOpen`, `CalendarDays`, `Check`, `CheckCircle2`, `ChevronDown`, `ChevronRight`, `Compass`, `Download`, `ExternalLink`, `Facebook`, `FileText`, `Globe`, `Instagram`, `Link2`, `Linkedin`, `Mail`, `MapPin`, `Menu`, `MessageCircle`, `MessageSquareQuote`, `Package`, `Pencil`, `PlayCircle`, `Plus`, `Quote`, `Rocket`, `Search`, `Send`, `Store`, `Trash2`, `Trophy`, `Users`, `Users2`, `Video`, `X`, `Youtube`) are long-stable, common icon names — low risk of being renamed/removed in a `0.344→0.577` bump, but worth a quick post-bump build+visual check rather than assuming.

## Actual risk assessment

**Very low**, grounded in a direct grep of the whole `src/` tree against every item on React's own official upgrade-guide breaking-changes list — not assumed, checked:

| React 19 breaking/removed API | Found in this codebase? |
|---|---|
| `ReactDOM.render` / `.hydrate` / `.unmountComponentAtNode` / `.findDOMNode` | **No** — `src/main.tsx` already uses `createRoot(...).render(...)` (the React 18 API), which is what React 19 keeps |
| `propTypes` / `defaultProps` on function components | **No** — zero matches |
| String refs (`ref="someName"`) | **No** — zero real matches (grep hits were all `href="..."` substrings, not actual refs) |
| Legacy context (`contextTypes` / `getChildContext`) | **No** — zero class components exist anywhere in `src/` |
| `react-dom/test-utils` (`act` import) | **No** — zero matches; no test currently imports `act` at all |
| `react-test-renderer` | **No** — not a dependency |
| Bare `useRef()` with no argument | **No** — zero matches |
| `useReducer<React.Reducer<...>>` explicit generic | **No** — zero matches |
| Global `JSX` namespace augmentation | **No** — zero matches |
| `forwardRef` usage (not removed in 19, but worth knowing exposure) | **No** — zero matches anywhere |
| Module pattern factories / `React.createFactory` | **No** — zero matches |

The one existing test (`src/data/books.test.ts`) is pure logic (`getBuyOptions`), not a component render — it doesn't even import `@testing-library/react`, which is installed as a devDependency but currently unused by any real test. So there's no component-rendering test suite that could break on this upgrade either way; the upgrade's real proof is the live app, not the unit tests.

`StrictMode` is already enabled in `src/main.tsx` — React 19 doesn't change StrictMode's dev-mode double-invoke behavior from what 18 already does, so nothing new to adapt to there; if an effect (e.g. `src/lib/useSupabaseData.ts`'s fetch-on-mount `useEffect`) already tolerates 18's double-invoke in dev today, it tolerates 19's identical behavior too.

`eslint-plugin-react-hooks` is already on `^7.1.1`, a version whose newer rules (e.g. `react-hooks/set-state-in-effect`, which this codebase has already hit and fixed once, in `AdminAnalytics.tsx`) anticipate React 19-era patterns — the lint setup is already somewhat ahead of the React version, not behind it.

## Testing required before/after the upgrade

1. Full existing suite: `npm run typecheck && npm run lint && npm run test && npm run test:e2e && npm run build`.
2. Specifically re-run the full `e2e/accessibility.spec.ts` suite (28 routes) and `e2e/smoke.spec.ts` — both exercise real client-side rendering, hydration-adjacent prerendering (via `scripts/prerender.mjs`), and interactive components (mobile nav drawer, forms, dropdowns) that would surface any real runtime behavior change.
3. After bumping `lucide-react`, do a quick visual pass (or at least a build + grep of `dist/assets/*.js` for the icon names above) to confirm none were renamed between `0.344.0` and the target `0.x` version — the automated suites don't visually diff icons.
4. Run `npm run build` and confirm all 38 routes still prerender with route-specific titles — `scripts/prerender.mjs`'s own hard-failure check (generic-title detection) already guards this.
5. Confirm `@types/react` / `@types/react-dom` bump doesn't introduce new TypeScript errors beyond what `npm run typecheck` already catches — given zero `forwardRef`, zero explicit `useReducer` generics, and no JSX namespace augmentation found above, the TypeScript-specific React 19 changes (ref-as-prop typing, `ReactElement.props` defaulting to `unknown`) have no code to affect.

## Rollback plan

- Perform the upgrade on a dedicated branch (see below), never directly on `main`.
- Rollback is simply: revert the `package.json`/`package-lock.json` change and reinstall. No source files are expected to need changes (see risk assessment — zero breaking-API matches), so there's no application code to unwind either, only the dependency bump itself.
- Do not deploy the upgrade until the full test suite in the section above passes on the branch.

## Recommended approach (when this is actually scheduled)

1. Create a branch (e.g. `chore/react-19`).
2. Bump `react`, `react-dom`, `@types/react`, `@types/react-dom` to `^19.x` together (they need to move as a set).
3. Bump `lucide-react` to the latest `0.x` release available at that time (re-check `npm view lucide-react dist-tags` / `versions` first — don't assume `0.577.0` is still current).
4. Run the full verification list above, including the icon-rename spot-check.
5. Open a PR, do not merge/deploy without explicit sign-off — same standing rule as the other two migrations.

## Explicitly out of scope for this document

- **Adopting any new React 19 API** (`useActionState`, `useOptimistic`, the `use()` hook, `<Activity>`, the new `onCaughtError`/`onUncaughtError` root options) is not part of this plan. This plan is scoped to "upgrade the version, change nothing else" — adopting new APIs is a separate, later, feature-shaped decision, not a dependency bump.
- No code changes were made to `package.json`, `src/main.tsx`, or any component as part of writing this plan. This is planning output only.
