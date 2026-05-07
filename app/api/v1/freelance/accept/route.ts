import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { callAI } from "../../../../../lib/ai";

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { pitch_id, is_preview = true } = await req.json();

    // 1. Fetch data context: Pitch, Job, Gap Report, and Company Settings
    const { data: pitch, error: pitchError } = await supabase
      .from("freelance_pitches")
      .select(`
        *,
        jobs!inner(title, description, employer_id),
        match_scores!inner(total_score, xai_notes)
      `)
      .eq("id", pitch_id)
      .single();

    if (pitchError || !pitch) throw new Error("Pitch context not found.");
    if (pitch.jobs.employer_id !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    // Verify 60-74% range
    if (pitch.suitability_score < 60 || pitch.suitability_score >= 75) {
      throw new Error("SOW generation restricted to Freelance Flex range.");
    }

    const { data: company } = await supabase
      .from("company_profiles")
      .select("legal_boilerplate")
      .eq("employer_id", session.user.id)
      .single();

    // 2. AI Synthesis Logic
    const systemInstruction = `
      Act as a professional legal consultant for MeritSync.
      Your task is to synthesize a professional Statement of Work (SOW) by merging a Job Description with a candidate's pitch.
      - EXCLUDE tasks identified as gaps in the provided Gap Report.
      - Extract deliverables that match 100% with the candidate's skills.
      - Propose a realistic 4-12 week timeline.
      - DO NOT hallucinate tools or responsibilities.
    `;

    const prompt = `
      Job Description: ${pitch.jobs.description}
      Candidate Pitch: ${pitch.pitch_content}
      Gap Report: ${JSON.stringify(pitch.match_scores.xai_notes)}
      Company Terms: ${company?.legal_boilerplate || "Standard MeritSync Terms"}
    `;

    let sowContent = await callAI(prompt, systemInstruction);

    // 3. PII Masking for Preview
    if (is_preview && pitch.status !== "ACCEPTED") {
      sowContent = sowContent.replace(/\[Candidate Name\]/g, "#### ####");
    }

    return NextResponse.json({ 
      status: "success", 
      sow_content: sowContent,
      pitch_text: pitch.pitch_content,
      audit_ready: true
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
