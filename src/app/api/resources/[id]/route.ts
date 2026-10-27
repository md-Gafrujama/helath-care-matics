import { NextResponse } from "next/server";
import { parseFormConfig } from "@/lib/resources/form-config";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = data as Resource;
  return NextResponse.json({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    coverUrl: row.cover_url,
    description: row.description,
    vertical: row.vertical,
    form: parseFormConfig(row.form_config),
  });
}
