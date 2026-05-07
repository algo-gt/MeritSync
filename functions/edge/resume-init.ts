export async function POST(request: Request) {
  const payload = await request.json();
  const { resume_id, user_id, object_key } = payload as {
    resume_id: string;
    user_id: string;
    object_key: string;
  };

  // This edge function is intended to notify the AI parser once a resume is stored.
  // In a production deployment, implement the parser invocation here.

  return new Response(JSON.stringify({ status: "notified", resume_id, user_id, object_key }), {
    headers: { "Content-Type": "application/json" }
  });
}
