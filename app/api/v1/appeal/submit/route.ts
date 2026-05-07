import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { job_id, justification } = await req.json();

    // 1. Check tokens
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("review_tokens")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) throw new Error("Profile not found.");
    if (profile.review_tokens <= 0) {
      return NextResponse.json({ error: "No review tokens remaining this month." }, { status: 403 });
    }

    // 2. Submit appeal
    const { data: appeal, error: appealError } = await supabase
      .from("manual_review_requests")
      .insert({
        candidate_id: session.user.id,
        job_id,
        justification,
        status: "PENDING"
      })
      .select()
      .single();

    if (appealError) throw appealError;

    // 3. Deduct token
    await supabase
      .from("profiles")
      .update({ review_tokens: profile.review_tokens - 1 })
      .eq("id", session.user.id);

    return NextResponse.json({ status: "success", data: appeal });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
