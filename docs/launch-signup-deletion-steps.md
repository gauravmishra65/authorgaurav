# Deleting the `launch-signup` Edge Function (Owner Action Required)

## Current state (verified via the Supabase project directly, just now)

- Project: `writetogetherhub` (ref `amblonweizpfqdebersh`), the same Supabase project this site runs on.
- The `launch-signup` function is still **deployed** (status `ACTIVE`, version 2) — it was never fully deleted, only **neutralized in place** in an earlier phase: every request to it now gets an immediate `410 Gone` response with no database access and no email sending (see `supabase/functions/launch-signup/index.ts`).
- Confirmed nothing in the frontend calls it anymore — `LaunchSignupForm.tsx` was retired and replaced by `NewsletterForm.tsx` posting to `newsletter-subscribe` instead (see `docs/newsletter-and-analytics.md`).
- The function's original implementation (before neutralization) is preserved in git history if it's ever needed for reference — deleting the deployed function does not lose that history.
- No available tool in this engineering session can delete a deployed Edge Function — that action requires the project owner's own Supabase dashboard access or CLI login, which is intentionally not something an assistant session should do on your behalf (it's an infrastructure-removal action, not a code change).

## Steps to actually delete it

**Option A — Supabase Dashboard (simplest):**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open the `writetogetherhub` project.
2. In the left sidebar, go to **Edge Functions**.
3. Find `launch-signup` in the list.
4. Open it, and use the **Delete Function** option (usually in a "..." menu or the function's settings tab).
5. Confirm the deletion when prompted.

**Option B — Supabase CLI (if you have it set up locally):**

```bash
supabase functions delete launch-signup --project-ref amblonweizpfqdebersh
```

You'll need to be logged in (`supabase login`) and linked to the project first if you haven't already.

## After deletion

- Nothing in the frontend needs to change — it was already fully migrated off this function.
- You can optionally remove the local `supabase/functions/launch-signup/` directory from the repo afterward if you want the codebase to match the deployed state exactly (not required — the neutralized stub causes no harm sitting in git history either way, and keeping it there for a bit preserves an easy reference to what it used to do).
- Double-check `newsletter-subscribe` and `contact-form` remain untouched — this deletion should only ever target the `launch-signup` slug specifically.
