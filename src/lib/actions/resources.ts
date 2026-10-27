"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  defaultFormConfig,
  type ResourceCategory,
  type ResourceFormConfig,
} from "@/lib/resources/constants";
import { parseFormConfig } from "@/lib/resources/form-config";
import { slugifyResourceTitle } from "@/lib/resources/slug";
import {
  removeResourceFiles,
  uploadResourceFile,
} from "@/lib/resources/storage";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const admin = createAdminClient();
  const { data: row } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) throw new Error("Forbidden");
  return admin;
}

function revalidateResourcePaths(slug?: string, category?: string) {
  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  revalidatePath("/admin/downloads");
  if (category) {
    const pathMap: Record<string, string> = {
      whitepaper: "white-papers",
      report: "reports",
      case_study: "case-studies",
      guide: "guides",
      webinar: "webinars",
    };
    const seg = pathMap[category];
    if (seg) {
      revalidatePath(`/resources/${seg}`);
      if (slug) revalidatePath(`/resources/${seg}/${slug}`);
    }
  }
}

export async function saveResource(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "") as ResourceCategory;
  const vertical = String(formData.get("vertical") || "").trim();
  const overview = String(formData.get("overview") || "").trim() || null;
  const offeredBy =
    String(formData.get("offered_by") || "").trim() || "HealthMatics";
  const authorName = String(formData.get("author_name") || "").trim() || null;
  const statusRaw = String(formData.get("status") || "draft");
  const status = statusRaw === "published" ? "published" : "draft";
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugifyResourceTitle(slugInput || title);

  let formConfig: ResourceFormConfig = defaultFormConfig();
  try {
    const raw = String(formData.get("form_config") || "");
    if (raw) formConfig = parseFormConfig(JSON.parse(raw));
  } catch {
    formConfig = defaultFormConfig();
  }

  let seo: Record<string, unknown> = {};
  try {
    const raw = String(formData.get("seo") || "");
    if (raw) seo = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    seo = {};
  }

  if (!title || !description || !category || !vertical) {
    throw new Error("Title, description, category, and vertical are required");
  }
  if (description.length > 220) {
    throw new Error("Description must be 220 characters or fewer");
  }

  const existing = id
    ? (
        await admin.from("resources").select("*").eq("id", id).maybeSingle()
      ).data
    : null;

  let pdf_path = existing?.pdf_path ?? null;
  let pdf_url = existing?.pdf_url ?? null;
  let cover_path = existing?.cover_path ?? null;
  let cover_url = existing?.cover_url ?? null;

  const pdfFile = formData.get("pdf") as File | null;
  if (pdfFile && pdfFile.size > 0) {
    const path = `${slug}/document-${Date.now()}.pdf`;
    const buf = Buffer.from(await pdfFile.arrayBuffer());
    pdf_url = await uploadResourceFile(path, buf, "application/pdf");
    if (pdf_path) await removeResourceFiles([pdf_path]);
    pdf_path = path;
  }

  const coverFile = formData.get("cover") as File | null;
  if (coverFile && coverFile.size > 0) {
    const ext =
      coverFile.type === "image/png"
        ? "png"
        : coverFile.type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `${slug}/cover-${Date.now()}.${ext}`;
    const buf = Buffer.from(await coverFile.arrayBuffer());
    cover_url = await uploadResourceFile(
      path,
      buf,
      coverFile.type || "image/jpeg",
    );
    if (cover_path) await removeResourceFiles([cover_path]);
    cover_path = path;
  }

  if (!pdf_url || !cover_url) {
    throw new Error("PDF and cover image are required");
  }

  const published = status === "published";
  const row = {
    title,
    description,
    category,
    vertical,
    slug,
    seo,
    overview,
    pdf_path,
    pdf_url,
    cover_path,
    cover_url,
    form_config: formConfig as unknown as Record<string, unknown>,
    offered_by: offeredBy,
    author_name: authorName,
    status: (published ? "published" : "draft") as "draft" | "published",
    published_at: published
      ? existing?.published_at || new Date().toISOString()
      : null,
  };

  if (id) {
    const { error } = await admin.from("resources").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("resources").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidateResourcePaths(slug, category);
  redirect("/admin/resources");
}

export async function deleteResource(id: string) {
  const admin = await requireAdmin();
  const { data: row } = await admin
    .from("resources")
    .select("id, slug, category, pdf_path, cover_path")
    .eq("id", id)
    .maybeSingle();
  if (!row) throw new Error("Not found");

  await removeResourceFiles([row.pdf_path, row.cover_path]);
  const { error } = await admin.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateResourcePaths(row.slug, row.category);
}

export async function deleteResourceDownload(id: string) {
  const admin = await requireAdmin();
  const { error } = await admin.from("resource_downloads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/downloads");
}

export async function deleteSubscriber(id: string) {
  const admin = await requireAdmin();
  const { error } = await admin.from("subscribers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/subscribes");
  revalidatePath("/admin/subscribers");
}
