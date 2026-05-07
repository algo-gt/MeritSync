import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const { data: sessionData } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  if (!sessionData?.session) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_role, has_accepted_dpdp")
    .eq("id", sessionData.session.user.id)
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
