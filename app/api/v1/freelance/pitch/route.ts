import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { job_id, pitch_content, suggested_rate, suggested_timeline } = await req.json();

    // 1. Validate the candidate's score is in the 60-74% range
    const { data: scoreData, error: scoreError } = await supabase
      .from("match_scores")
      .select("total_score")
      .eq("candidate_id", session.user.id)
      .eq("job_id", job_id)
      .single();

    if (scoreError || !scoreData) {
      return NextResponse.json({ error: "Candidate suitability score not found." }, { status: 404 });
    }

    const score = scoreData.total_score;
    if (score < 60 || score >= 75) {
      return NextResponse.json({ 
        error: "Pitching is only available for candidates in the 60-74% 'Freelance Flex' range.",
        current_score: score 
      }, { status: 403 });
    }

    // 2. Insert the pitch
    const { data, error } = await supabase
      .from("freelance_pitches")
      .upsert({
        candidate_id: session.user.id,
        job_id,
        pitch_content,
        suitability_score: score,
        suggested_rate,
        suggested_timeline,
        status: "PENDING"
      }, { onConflict: 'candidate_id,job_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: "success", data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
