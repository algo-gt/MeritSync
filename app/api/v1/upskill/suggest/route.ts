import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { callAIJson } from "../../../../../lib/ai";

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { resume_text, job_description } = await req.json();

    const systemInstruction = `
      Act as a professional resume writer for MeritSync.
      Your task is to rephrase the candidate's existing experience to better align with the Job Description (JD).
      
      RULES:
      1. Use SEMANTIC TRANSLATION only. Identify where the candidate has the skill but uses different terminology.
      2. DO NOT FABRICATE DATA. Do not add new tools, technologies, years of experience, or team sizes not present in the original text.
      3. If a skill is missing and cannot be reasonably implied from the text, DO NOT suggest it.
      4. Output format: JSON array of objects { category: string, original: string, suggested: string }.
    `;

    const prompt = `
      Resume Text: ${resume_text}
      Job Description: ${job_description}
    `;

    const suggestions = await callAIJson(prompt, systemInstruction);

    return NextResponse.json({ status: "success", suggestions });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
