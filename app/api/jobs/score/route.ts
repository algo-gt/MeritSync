import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { job_id, candidate_id, resume_text, job_description } = body;

    if (!job_id || !candidate_id || !resume_text || !job_description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const FASTAPI_URL = process.env.FASTAPI_SCORER_URL || "http://localhost:8000";

    const response = await fetch(`${FASTAPI_URL}/api/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        job_id,
        candidate_id,
        resume_text,
        job_description
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Python microservice failed", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
