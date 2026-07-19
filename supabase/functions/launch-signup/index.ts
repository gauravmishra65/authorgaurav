import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Namespaced so this never collides with WriteTogetherHub's own RESEND_API_KEY
// secret in this shared Supabase project (they're two different functions
// that both send email, but each needs its own key).
const RESEND_API_KEY = Deno.env.get("AUTHORGAURAV_RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, source } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase.from("authorgaurav_newsletter_subscribers").insert({
      name: name || null,
      email,
      source: source || "website",
    });

    // A duplicate email (unique constraint violation, code 23505) means this
    // reader already signed up and was already notified about — treat it as
    // success without sending a second notification email.
    const isDuplicate = dbError?.code === "23505";
    if (dbError && !isDuplicate) throw dbError;

    let emailStatus = isDuplicate
      ? "skipped (duplicate signup)"
      : "skipped (no AUTHORGAURAV_RESEND_API_KEY)";

    if (RESEND_API_KEY && !isDuplicate) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "authorgaurav.com <contact@writetogetherhub.com>",
          to: ["hello@writetogetherhub.com"],
          reply_to: email,
          subject: `New release-update signup from ${name || email}`,
          text: `Name: ${name || "(not given)"}\nEmail: ${email}\nSource: ${source || "website"}`,
        }),
      });

      const emailResBody = await emailRes.text();
      emailStatus = emailRes.ok ? "sent" : `failed: ${emailRes.status} ${emailResBody}`;
      if (!emailRes.ok) console.error("Resend error:", emailResBody);
    }

    return new Response(JSON.stringify({ ok: true, emailStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
