# HealthMatics

Healthcare intelligence, news, analysis, research, and insights for executives and decision-makers transforming healthcare.

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
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (or custom domain), e.g. `https://your-app.vercel.app`.
5. Deploy. After the first deploy, update `NEXT_PUBLIC_SITE_URL` if the URL changed, then redeploy.
6. In Supabase → Authentication → URL configuration, add your Vercel domain to **Site URL** and **Redirect URLs**.

### Cron

`vercel.json` schedules `POST /api/cron/generate-article` daily at **15:50 UTC** (9:20 PM IST).  
Ensure `CRON_SECRET` is set in Vercel env so the job is authorized.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run bootstrap` | Seed admin user + healthcare topics |
| `npm run generate:topics` | Generate one AI article per news topic |

See `.env.example` for required environment variables.
