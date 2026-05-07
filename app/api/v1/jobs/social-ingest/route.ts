import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });

  // Verify internal service key or admin session
  // For now, checking session for simplicity
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const signals = await req.json(); // Array of processed signals from Python

    const results = [];
    for (const signal of signals) {
      // 1. Deduplication (Vector Search)
      // In production, we'd hit Pinecone here to check if cosine similarity > 0.9
      // with any existing job description.
      const isDuplicate = false; // Mocked

      if (isDuplicate) continue;

      // 2. Ingest into 'jobs' table as a 'social' entry
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title: signal.role,
          company: signal.company,
          description: signal.text,
          location: signal.location,
          apply_url: signal.original_post_url,
          metadata: {
            is_social: true,
            source: signal.source,
            confidence: signal.confidence,
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14-day expiry
          }
        })
        .select()
        .single();

      if (data) results.push(data);
    }

    return NextResponse.json({ 
      status: "success", 
      ingested_count: results.length 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
