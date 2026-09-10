# HealthMatics

Healthcare intelligence — news, analysis, research, and insights for executives and decision-makers transforming healthcare.

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
npm run bootstrap
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run bootstrap` | Seed admin user + healthcare topics |
| `npm run generate:topics` | Generate one AI article per news topic |

See `.env.example` for required environment variables.

Admin: `/admin/login`
