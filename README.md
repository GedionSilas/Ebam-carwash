# EBAM Booking Boost (Next.js)

## Run Website

```bash
npm install
npm run dev
```

## Sanity CMS Setup

1. Copy `.env.example` to `.env` and fill:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (use `production`)
2. Install and run Sanity Studio:

```bash
npm run sanity:install
npm run sanity:dev
```

3. In `sanity/.env`, set:
   - `SANITY_STUDIO_PROJECT_ID`
   - `SANITY_STUDIO_DATASET`

4. Open Studio, create content for:
   - Site Settings
   - Services
   - Testimonials
   - Pricing Plans
   - Footer

When CMS values are missing or env vars are not configured, the site renders fallback content.
