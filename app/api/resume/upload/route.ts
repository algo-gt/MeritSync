import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for resume uploads." },
      { status: 500 }
    );
  }

  const storageClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
  const supabase = createRouteHandlerSupabaseClient({
    cookies,
    headers
  });
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["pdf", "docx"].includes(extension)) {
    return NextResponse.json({ error: "Only PDF and DOCX formats are supported." }, { status: 400 });
  }

  const resumeId = crypto.randomUUID();
  const key = `${sessionData.session.user.id}/${resumeId}-${file.name}`;

  const { error: uploadError } = await storageClient.storage
    .from("resumes-private")
    .upload(key, file.stream(), {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  if (process.env.RESUME_EDGE_URL) {
    await fetch(process.env.RESUME_EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_id: resumeId,
        user_id: sessionData.session.user.id,
        object_key: key
      })
    }).catch(() => {
      // The parser notification is best-effort; upload succeeded.
    });
  }

  return NextResponse.json({ status: "uploaded", resume_id: resumeId });
}
