import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Retired (confirmed unused by the frontend — superseded by
// newsletter-subscribe in Phase 11). No delete-function tool was available
// to fully remove this slug from the project, so it's neutralized in place:
// every request gets 410 Gone, no database access, no email sending. The
// original implementation is preserved in git history
// (supabase/functions/launch-signup/index.ts) if ever needed for reference.
Deno.serve(() => new Response(JSON.stringify({ error: "gone" }), { status: 410, headers: { "Content-Type": "application/json" } }));
