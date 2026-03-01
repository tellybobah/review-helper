import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/fr/dashboard";

  // Ensure the redirect path has a locale prefix
  const localizedNext = /^\/(fr|en)(\/|$)/.test(next) ? next : `/fr${next}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${localizedNext}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${localizedNext}`);
      } else {
        return NextResponse.redirect(`${origin}${localizedNext}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/fr/login?error=auth`);
}
