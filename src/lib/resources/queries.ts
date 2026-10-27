import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseFormConfig } from "@/lib/resources/form-config";
import type { ResourceCategory } from "@/lib/resources/constants";
import type { Resource, ResourceDownload } from "@/types/database";

export type ResourcePublic = Resource & {
  form_config_parsed: ReturnType<typeof parseFormConfig>;
};

function mapResource(row: Resource): ResourcePublic {
  return {
    ...row,
    form_config_parsed: parseFormConfig(row.form_config),
  };
}

export async function listPublishedResources(category?: ResourceCategory) {
  const supabase = await createClient();
  let q = supabase
    .from("resources")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) {
    console.error("listPublishedResources:", error.message);
    return [] as ResourcePublic[];
  }
  return ((data ?? []) as Resource[]).map(mapResource);
}

export async function getPublishedResourceBySlug(
  slug: string,
  category?: ResourceCategory,
) {
  const supabase = await createClient();
  let q = supabase
    .from("resources")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  const { data, error } = await q;
  if (error || !data) return null;
  const row = data as Resource;
  if (category && row.category !== category) return null;
  return mapResource(row);
}

export async function listAdminResources() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("resources")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Resource[];
}

export async function getAdminResource(id: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Resource | null;
}

export async function listResourceDownloads() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("resource_downloads")
    .select("*, resource:resources(id, title, slug, category)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as (ResourceDownload & {
    resource: Pick<Resource, "id" | "title" | "slug" | "category"> | null;
  })[];
}
