import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { role, provider_token } = body as { role: string; provider_token?: string | null };

  if (!role || !["TALENT", "EMPLOYER"].includes(role)) {
    return NextResponse.json({ error: "Invalid role payload." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const user = sessionData.session.user;
  const profilePayload = {
    id: user.id,
    email: user.email,
    user_role: role,
    onboarding_status: "INCOMPLETE",
    has_accepted_dpdp: false,
    provider_token: provider_token ?? null
  };

  const { error } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}
