import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Namespaced so this never collides with WriteTogetherHub's own secrets in
// this shared Supabase project.
const BREVO_API_KEY = Deno.env.get("AUTHORGAURAV_BREVO_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// Interest → Brevo list ID env var mapping. Each is optional; an interest
// with no configured list still gets the contact created (untagged) rather
// than failing the whole signup.
const INTEREST_ENV_KEYS: Record<string, string> = {
  Thrillers: "AUTHORGAURAV_BREVO_LIST_ID_THRILLERS",
  Romance: "AUTHORGAURAV_BREVO_LIST_ID_ROMANCE",
  "Spiritual books": "AUTHORGAURAV_BREVO_LIST_ID_SPIRITUAL",
  "Writing resources": "AUTHORGAURAV_BREVO_LIST_ID_WRITING",
  "All updates": "AUTHORGAURAV_BREVO_LIST_ID_ALL",
};

type ProviderResult =
  | { status: "subscribed" }
  | { status: "duplicate" }
  | { status: "skipped"; reason: string }
  | { status: "error"; reason: string };

/** Brevo ("Create a contact") adapter. To swap providers, write a new
 * syncToX(email, name, interest) => Promise<ProviderResult> function with
 * this same return shape and call it instead — nothing else in this file
 * needs to change. */
async function syncToBrevo(email: string, name: string | undefined, interest: string | undefined): Promise<ProviderResult> {
  if (!BREVO_API_KEY) return { status: "skipped", reason: "AUTHORGAURAV_BREVO_API_KEY not configured" };

  const listIdEnvKey = interest ? INTEREST_ENV_KEYS[interest] : undefined;
  const listIdRaw = listIdEnvKey ? Deno.env.get(listIdEnvKey) : undefined;
  const listIds = listIdRaw ? [Number(listIdRaw)] : undefined;

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: name ? { FIRSTNAME: name } : undefined,
        listIds,
        updateEnabled: false,
      }),
    });

    if (res.ok) return { status: "subscribed" };

    const body = await res.json().catch(() => ({}));
    if (res.status === 400 && body?.code === "duplicate_parameter") return { status: "duplicate" };

    console.error("Brevo error:", res.status, JSON.stringify(body));
    return { status: "error", reason: `brevo_${res.status}` };
  } catch (err) {
    console.error("Brevo request failed:", err);
    return { status: "error", reason: "brevo_request_failed" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, source, interest, consent, company } = await req.json();

    // Honeypot: a real visitor never sees or fills this field.
    if (company) {
      return new Response(JSON.stringify({ status: "subscribed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || !consent) {
      return new Response(JSON.stringify({ error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();
    const { count: recentCount, error: rateError } = await supabase
      .from("authorgaurav_newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since);
    if (rateError) throw rateError;
    if ((recentCount ?? 0) > 0) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: dbError } = await supabase.from("authorgaurav_newsletter_subscribers").insert({
      name: name || null,
      email,
      source: source || "website",
      genre_preference: interest || null,
    });

    // A duplicate email (unique constraint violation, code 23505) means this
    // reader already subscribed — report it as its own status, not an error.
    const isDuplicate = dbError?.code === "23505";
    if (dbError && !isDuplicate) throw dbError;

    const providerResult = await syncToBrevo(email, name, interest);

    return new Response(JSON.stringify({
      status: isDuplicate ? "duplicate" : "subscribed",
      providerStatus: providerResult.status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
