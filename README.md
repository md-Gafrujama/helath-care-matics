# HealthMatics

Healthcare intelligence, news, analysis, research, and insights for executives and decision-makers transforming healthcare.

**Production domain:** [https://healthmatics.net](https://healthmatics.net)

## Stack

- Next.js 16 (App Router)
- Supabase
- Anthropic (article generation)
- Pexels (cover images)
- Vercel (hosting + cron)

## Develop

```bash
npm install
cp .env.example .env.local
# fill .env.local, then:
npm run bootstrap
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: `/admin/login`

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add every variable from `.env.example` in **Project → Settings → Environment Variables** (Production + Preview).
4. Set Production `NEXT_PUBLIC_SITE_URL` to **`https://www.healthmatics.net`** (must match Vercel primary / Search Console property).
5. In Vercel → Domains, keep `www.healthmatics.net` as primary (apex can redirect to www).
6. Deploy. Confirm:
   - `https://www.healthmatics.net/sitemap.xml`
   - `https://www.healthmatics.net/robots.txt`
7. In Supabase → Authentication → URL configuration, set Site URL to `https://www.healthmatics.net` and add redirect URLs for that domain.
8. In Google Search Console, submit sitemap as: `sitemap.xml` (on the **www** property).

### Cron

`vercel.json` schedules `/api/cron/generate-article` daily at **15:50 UTC** (9:20 PM IST).  
Ensure `CRON_SECRET` is set in Vercel env so the job is authorized.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run bootstrap` | Seed admin user + healthcare topics |
| `npm run generate:topics` | Generate one AI article per news topic |

See `.env.example` for required environment variables.
