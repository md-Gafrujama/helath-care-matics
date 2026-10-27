import { NextResponse } from "next/server";
import {
  pathToCategory,
  type ResourceCategory,
} from "@/lib/resources/constants";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type") || searchParams.get("category");
  let category: ResourceCategory | null = null;
  if (typeParam) {
    category =
      pathToCategory(typeParam) ||
      (["whitepaper", "report", "case_study", "guide", "webinar"].includes(
        typeParam,
      )
        ? (typeParam as ResourceCategory)
        : null);
  }

  const supabase = await createClient();
  let q = supabase
    .from("resources")
    .select("id, title, slug, category, cover_url, description, vertical")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);
  if (category) q = q.eq("category", category);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}
