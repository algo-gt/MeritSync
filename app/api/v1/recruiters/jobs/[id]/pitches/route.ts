import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobId = id;

  try {
    // Verify employer ownership of the job
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("employer_id", session.user.id)
      .single();

    if (jobError || !jobData) {
      return NextResponse.json({ error: "Job requisition not found or unauthorized." }, { status: 403 });
    }

    // Fetch pitches with candidate profiles and XAI scores
    const { data: pitches, error } = await supabase
      .from("freelance_pitches")
      .select(`
        *,
        profiles:candidate_id (email, user_role),
        match_scores!inner(total_score, xai_notes)
      `)
      .eq("job_id", jobId)
      .eq("match_scores.candidate_id", "freelance_pitches.candidate_id") // join check
      .order("suitability_score", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ status: "success", data: pitches });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
