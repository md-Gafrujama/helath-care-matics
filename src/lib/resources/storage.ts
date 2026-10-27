import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "resources";

export function publicStorageUrl(path: string): string {
  const admin = createAdminClient();
  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadResourceFile(
  path: string,
  bytes: ArrayBuffer | Buffer,
  contentType: string,
) {
  const admin = createAdminClient();
  const body =
    bytes instanceof Buffer ? bytes : Buffer.from(new Uint8Array(bytes));
  const { error } = await admin.storage.from(BUCKET).upload(path, body, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return publicStorageUrl(path);
}

export async function removeResourceFiles(paths: (string | null | undefined)[]) {
  const clean = paths.filter((p): p is string => Boolean(p));
  if (clean.length === 0) return;
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove(clean);
  if (error) console.error("removeResourceFiles:", error.message);
}

export async function fetchResourcePdfBytes(resource: {
  pdf_path: string | null;
  pdf_url: string | null;
}): Promise<{ bytes: ArrayBuffer; filename: string } | null> {
  if (resource.pdf_path) {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(BUCKET)
      .download(resource.pdf_path);
    if (error || !data) {
      console.error("pdf download path failed:", error?.message);
    } else {
      const bytes = await data.arrayBuffer();
      const filename =
        resource.pdf_path.split("/").pop()?.replace(/[^\w.-]+/g, "_") ||
        "download.pdf";
      return { bytes, filename: filename.endsWith(".pdf") ? filename : `${filename}.pdf` };
    }
  }
  if (resource.pdf_url) {
    const res = await fetch(resource.pdf_url);
    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    return { bytes, filename: "download.pdf" };
  }
  return null;
}
