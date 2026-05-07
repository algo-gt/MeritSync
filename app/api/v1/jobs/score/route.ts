import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { callAIJson, generateGatekeeperPrompt, GATEKEEPER_SYSTEM_PROMPT } from "../../../../../lib/ai";

export const config = {
  runtime: "edge",
  regions: ["bom1"], // Mumbai region for DPDP 2023 compliance
};

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers,
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { job_id, candidate_id, resume_data, job_description } = await req.json();

    // 1. Check Cache (Supabase)
    const { data: existingScore } = await supabase
      .from("match_scores")
      .select("*")
      .eq("job_id", job_id)
      .eq("candidate_id", candidate_id)
      .single();

    if (existingScore) {
      return NextResponse.json({ status: "success", source: "cache", data: existingScore });
    }

    // 2. Call Gemini 1.5 Flash (Gatekeeper Logic)
    const prompt = generateGatekeeperPrompt(resume_data, job_description);
    const aiResult = await callAIJson(prompt, GATEKEEPER_SYSTEM_PROMPT);

    // 3. Store Results
    const { data: savedScore, error: dbError } = await supabase
      .from("match_scores")
      .insert({
        job_id,
        candidate_id,
        total_score: aiResult.suitability_score,
        status: aiResult.status,
        xai_notes: aiResult.xai_summary,
        gap_analysis: aiResult.gap_analysis,
        metadata: {
          freelance_pitch_suggestion: aiResult.freelance_pitch_suggestion,
          calculated_at: new Date().toISOString(),
          model: "gemini-1.5-flash"
        }
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ status: "success", source: "ai", data: savedScore });

  } catch (error: any) {
    console.error("Scoring Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
