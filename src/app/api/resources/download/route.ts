import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isOptOutConsent,
  isPersonalEmail,
} from "@/lib/resources/constants";
import { parseFormConfig, step2AdminFields } from "@/lib/resources/form-config";
import { fetchResourcePdfBytes } from "@/lib/resources/storage";
import { saveSubscriber } from "@/lib/subscribers";
import type { Resource } from "@/types/database";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

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
  const resourceId = typeof data.resourceId === "string" ? data.resourceId : "";
  const email = normalizeEmail(typeof data.email === "string" ? data.email : "");
  const saveOnly = data.saveOnly === true;
  const downloadId = typeof data.id === "string" ? data.id : null;
  const fields =
    data.fields && typeof data.fields === "object"
      ? (data.fields as Record<string, string>)
      : {};
  const answers =
    data.answers && typeof data.answers === "object"
      ? (data.answers as Record<string, string>)
      : {};
  const consents =
    data.consents && typeof data.consents === "object"
      ? (data.consents as Record<string, boolean>)
      : {};

  if (!resourceId) {
    return NextResponse.json({ error: "Missing resource" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Enter a valid work email" },
      { status: 400 },
    );
  }
  if (isPersonalEmail(email)) {
    return NextResponse.json(
      {
        error:
          "Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: resourceRow, error: resourceError } = await admin
    .from("resources")
    .select("*")
    .eq("id", resourceId)
    .eq("status", "published")
    .maybeSingle();

  if (resourceError || !resourceRow) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const resource = resourceRow as Resource;
  const form = parseFormConfig(resource.form_config);
  const hasExtras =
    step2AdminFields(form).length > 0 ||
    form.questions.length > 0 ||
    true; // first/last name always on step 2

  // Step 1: save lead only
  if (saveOnly) {
    const { data: existing } = await admin
      .from("resource_downloads")
      .select("id")
      .eq("resource_id", resourceId)
      .eq("email", email)
      .maybeSingle();

    let id = existing?.id as string | undefined;
    if (id) {
      await admin
        .from("resource_downloads")
        .update({
          profile_completed: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } else {
      const { data: inserted, error: insertError } = await admin
        .from("resource_downloads")
        .insert({
          resource_id: resourceId,
          email,
          fields: {},
          answers: {},
          profile_completed: false,
          marketing_consent: true,
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        return NextResponse.json(
          { error: insertError?.message || "Could not save lead" },
          { status: 500 },
        );
      }
      id = inserted.id;
    }

    // If no extra fields/questions and no consents to show — unusual; still require step 2 for names.
    // Spec: if no extra fields and no questions, first click saves and downloads.
    // But second spec always requires first/last name on step 2. Prefer second.
    void hasExtras;

    return NextResponse.json({ ok: true, saved: true, id });
  }

  // Step 2: validate + update + stream PDF
  if (!downloadId) {
    return NextResponse.json(
      { error: "Missing download session. Start again with your email." },
      { status: 400 },
    );
  }

  const firstName = (fields.first_name || "").trim();
  const lastName = (fields.last_name || "").trim();
  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First name and last name are required" },
      { status: 400 },
    );
  }

  for (const field of step2AdminFields(form)) {
    if (!field.required) continue;
    const val = (fields[field.key] || "").trim();
    if (!val) {
      return NextResponse.json(
        { error: `${field.label} is required` },
        { status: 400 },
      );
    }
  }

  for (const q of form.questions) {
    const val = (answers[q.id] || "").trim();
    if (!val) {
      return NextResponse.json(
        { error: "Please answer every question" },
        { status: 400 },
      );
    }
  }

  let optedOut = false;
  for (const c of form.consents.filter((x) => x.show)) {
    const checked = Boolean(consents[c.id]);
    if (isOptOutConsent(c)) {
      optedOut = checked;
      continue;
    }
    if (c.required && !checked) {
      return NextResponse.json(
        { error: "Please accept the required consents" },
        { status: 400 },
      );
    }
  }

  const mergedFields = {
    ...fields,
    first_name: firstName,
    last_name: lastName,
  };

  const { data: updated, error: updateError } = await admin
    .from("resource_downloads")
    .update({
      fields: mergedFields,
      answers,
      profile_completed: true,
      marketing_consent: !optedOut,
      updated_at: new Date().toISOString(),
    })
    .eq("id", downloadId)
    .eq("resource_id", resourceId)
    .eq("email", email)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: updateError?.message || "Could not update download record" },
      { status: 500 },
    );
  }

  try {
    await saveSubscriber({
      email,
      source: resource.category,
      sourceType: resource.category,
      sourceSlug: resource.slug,
      sourceTitle: resource.title,
      optOut: optedOut,
    });
  } catch (err) {
    console.error(
      "download subscribe sync failed:",
      err instanceof Error ? err.message : err,
    );
  }

  const pdf = await fetchResourcePdfBytes(resource);
  if (!pdf) {
    return NextResponse.json(
      { error: "PDF is not available yet" },
      { status: 404 },
    );
  }

  const safeName = `${resource.slug || "download"}.pdf`.replace(
    /[^\w.-]+/g,
    "_",
  );

  return new NextResponse(pdf.bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
}
