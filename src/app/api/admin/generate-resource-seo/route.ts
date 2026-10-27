import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { generateResourceSeo } from "@/lib/ai/generate-resource-seo";
import {
  RESOURCE_CATEGORY_META,
  type ResourceCategory,
} from "@/lib/resources/constants";

export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.error || !auth.admin) {
    const status = auth.error === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: auth.error }, { status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj =
    typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const title = String(obj.title ?? "").trim();
  const description = String(obj.description ?? "").trim();
  const category = String(obj.category ?? "") as ResourceCategory;
  const vertical = String(obj.vertical ?? "").trim();
  const offeredBy = String(obj.offered_by ?? "").trim();

  if (!title) {
    return NextResponse.json({ error: "Enter a title first" }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json(
      { error: "Enter a description first" },
      { status: 400 },
    );
  }
  if (!vertical) {
    return NextResponse.json(
      { error: "Select a vertical first" },
      { status: 400 },
    );
  }

  const categoryLabel =
    category in RESOURCE_CATEGORY_META
      ? RESOURCE_CATEGORY_META[category].label
      : "Resource";

  try {
    const seo = await generateResourceSeo({
      title,
      description,
      categoryLabel,
      vertical,
      offeredBy: offeredBy || undefined,
    });
    return NextResponse.json({ ok: true, ...seo });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("generate-resource-seo failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
