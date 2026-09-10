import { NextResponse } from "next/server";
import { unsubscribeByEmail } from "@/lib/subscribers";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email : "";
  const reason = typeof data.reason === "string" ? data.reason : null;

  const result = await unsubscribeByEmail(email, reason);
  if (!result.ok) {
    const status = result.error.includes("valid email") ? 400 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, already: Boolean(result.already) });
}
