import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Skip locale handling for API routes and auth callback
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Run next-intl middleware first (handles locale detection + redirects)
  const response = intlMiddleware(request);

  // Apply Supabase session refresh on top of the intl response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract locale from the pathname (after intl middleware has processed it)
  const localeMatch = pathname.match(/^\/(fr|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Protected routes: redirect to login if not authenticated
  if (!user && pathname.includes("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Auth routes: redirect to dashboard if already authenticated
  if (
    user &&
    (pathname.includes("/login") || pathname.includes("/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
