import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { request_id, action, reason, ai_score } = await req.json();

    // 1. Update request status
    const { data: appeal, error: updateError } = await supabase
      .from("manual_review_requests")
      .update({ status: action })
      .eq("id", request_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Log to bias_audit_logs (Compliance)
    const { error: logError } = await supabase
      .from("bias_audit_logs")
      .insert({
        request_id,
        employer_id: session.user.id,
        ai_score,
        human_decision: action,
        recruiter_reason: reason,
        anonymized_metadata: {
          timestamp: new Date().toISOString(),
          action_type: "MANUAL_OVERRIDE"
        }
      });

    if (logError) throw logError;

    return NextResponse.json({ status: "success", message: `Appeal ${action.toLowerCase()} successfully.` });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
