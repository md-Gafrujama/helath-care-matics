/**
 * Generate AI articles per HealthMatics news topic via the cron API.
 * Requires: npm run dev (or next start) and CRON_SECRET in .env.local
 *
 * Usage:
 *   npm run generate:topics
 *   PER_TOPIC=2 npm run generate:topics
 */
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

const TOPICS = [
  "health-it",
  "hospitals",
  "payers",
  "digital-health",
  "cybersecurity",
  "pharma-biotech",
];

const PER_TOPIC = Math.max(1, Number(process.env.PER_TOPIC || "1") || 1);
const BASE =
  process.env.GENERATE_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

loadEnv();

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("Missing CRON_SECRET in .env.local");
  process.exit(1);
}

async function generateForTopic(slug) {
  const url = `${BASE.replace(/\/$/, "")}/api/cron/generate-article`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic_slug: slug }),
  });
  const data = await res.json().catch(() => ({}));
  return { slug, status: res.status, data };
}

async function main() {
  console.log(
    `HealthMatics generate, ${TOPICS.length} topics × ${PER_TOPIC} via ${BASE}\n`,
  );

  let okCount = 0;
  let failCount = 0;

  for (const slug of TOPICS) {
    for (let n = 1; n <= PER_TOPIC; n++) {
      console.log(`→ ${slug} (${n}/${PER_TOPIC}, ~1-2 min)...`);
      const result = await generateForTopic(slug);
      if (
        result.status >= 200 &&
        result.status < 300 &&
        result.data?.ok !== false
      ) {
        const created = result.data.articles ?? result.data.created ?? [];
        for (const row of created) {
          console.log(`  ✓ ${row.topic}: /article/${row.slug}`);
          okCount += 1;
        }
        if (created.length === 0) {
          console.log("  ✓ done (no new rows in response)");
        }
      } else {
        failCount += 1;
        console.error(
          `  ✗ failed (${result.status}):`,
          result.data?.error ?? result.data,
        );
      }
      console.log("");
    }
  }

  console.log(`Done. Created ${okCount}, failed ${failCount}.`);
  if (failCount > 0 && okCount === 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
