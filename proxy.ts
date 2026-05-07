import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  if (!session) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_role, has_accepted_dpdp")
    .eq("id", session.user.id)
    .single();

  const role = profile?.user_role as string | null;
  const hasAcceptedDpdp = profile?.has_accepted_dpdp as boolean | null;

  if (!role && pathname !== "/role-selection") {
    return NextResponse.redirect(new URL("/role-selection", req.url));
  }

  if (role === "TALENT" && !hasAcceptedDpdp && pathname !== "/consent") {
    return NextResponse.redirect(new URL("/consent", req.url));
  }

  if (pathname === "/consent" && role === "TALENT" && hasAcceptedDpdp) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname === "/role-selection" && role) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/role-selection", "/consent", "/api/:path*"]
};
