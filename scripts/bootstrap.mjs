/**
 * One-time CMS bootstrap:
 * 1. Verifies Supabase connection
 * 2. Syncs HR navbar topics from topic-config
 * 3. Creates admin login user (ADMIN_EMAIL / ADMIN_PASSWORD in .env.local)
 *
 * Usage: npm run bootstrap
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const HR_TOPICS = [
  {
    slug: "health-it",
    navLabel: "Health IT",
    description:
      "Interoperability, EHR modernization, and enterprise AI for healthcare technology leaders.",
  },
  {
    slug: "hospitals",
    navLabel: "Hospitals & Health Systems",
    description:
      "Operations, M&A, capital planning, and strategy for hospital executives.",
  },
  {
    slug: "payers",
    navLabel: "Payers & Insurance",
    description:
      "Reimbursement, claims automation, and value-based contracts for payer teams.",
  },
  {
    slug: "digital-health",
    navLabel: "Digital Health",
    description:
      "Virtual care, remote monitoring, and patient engagement platforms.",
  },
  {
    slug: "cybersecurity",
    navLabel: "Cybersecurity",
    description:
      "Risk, resilience, and regulatory compliance for healthcare security leaders.",
  },
  {
    slug: "pharma-biotech",
    navLabel: "Pharma & Biotech",
    description:
      "Drug development, commercial strategy, MedTech, and AI in the pipeline.",
  },
];

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("HealthMatics bootstrap\n");

  const { error: ping } = await supabase.from("topics").select("id").limit(1);
  if (ping) {
    const grantsHint =
      ping.message?.includes("permission denied")
        ? "\n\nRun supabase/fix-grants.sql in Supabase SQL Editor (one-time grants fix)."
        : "";
    console.error(
      "Database not ready:",
      ping.message,
      "\n\nRun supabase/schema.sql in Supabase Dashboard > SQL Editor first.",
      grantsHint,
    );
    process.exit(1);
  }

  console.log("✓ Connected to Supabase");

  for (const topic of HR_TOPICS) {
    const { data: existing } = await supabase
      .from("topics")
      .select("id")
      .eq("slug", topic.slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("topics")
        .update({ name: topic.navLabel, description: topic.description })
        .eq("id", existing.id);
      if (error) throw error;
      console.log(`  updated topic: ${topic.navLabel}`);
    } else {
      const { error } = await supabase.from("topics").insert({
        slug: topic.slug,
        name: topic.navLabel,
        description: topic.description,
      });
      if (error) throw error;
      console.log(`  inserted topic: ${topic.navLabel}`);
    }
  }

  console.log(`✓ Synced ${HR_TOPICS.length} navbar topics`);

  if (adminEmail && adminPassword) {
    const { data: list } = await supabase.auth.admin.listUsers();
    const found = list?.users?.find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
    );

    let userId = found?.id;
    if (!userId) {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      if (error) throw error;
      userId = created.user.id;
      console.log(`✓ Created admin user: ${adminEmail}`);
    } else {
      const { error: pwError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: adminPassword, email_confirm: true },
      );
      if (pwError) throw pwError;
      console.log(`✓ Admin user exists (password synced): ${adminEmail}`);
    }

    const { error: adminErr } = await supabase
      .from("admin_users")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
    if (adminErr) throw adminErr;
    console.log("✓ Admin access granted → /admin/login");
  } else {
    console.log("⊘ Skipped admin user (set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local)");
  }

  console.log("\nDone. Generate articles with:");
  console.log(
    '  curl -X POST http://localhost:3000/api/cron/generate-article -H "Authorization: Bearer <CRON_SECRET>" -H "Content-Type: application/json" -d "{\\"topic_slug\\":\\"compliance\\"}"',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
