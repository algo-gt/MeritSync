import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

async function hashIp(ip: string): Promise<string> {
  const buffer = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { consent_version } = body as { consent_version?: string };

  if (!consent_version) {
    return NextResponse.json({ error: "Consent version is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = sessionData.session.user.id;
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const hashedIp = await hashIp(ip);

  const [{ error: profileError }, { error: auditError }] = await Promise.all([
    supabase.from("profiles").update({ has_accepted_dpdp: true }).eq("id", userId),
    supabase.from("compliance_audit_logs").insert({
      user_id: userId,
      consent_version,
      hashed_ip: hashedIp
    })
  ]);

  if (profileError || auditError) {
    return NextResponse.json({ error: (profileError ?? auditError)?.message ?? "Consent storage failed." }, { status: 500 });
  }

  return NextResponse.json({ status: "accepted" });
}
