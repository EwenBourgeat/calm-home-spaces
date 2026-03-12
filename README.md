# 🏡 CalmHomeSpaces — Pinterest Bridge Page

A high-performance Pinterest → Amazon bridge page infrastructure. Built as a "Digital Decor Magazine" with premium UX, ISR caching, and full Amazon Associates compliance.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your values
cp .env.local.example .env.local

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

## 📋 Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AIRTABLE_API_KEY` | Airtable Personal Access Token | `pat_xxxx...` |
| `AIRTABLE_BASE_ID` | Your Airtable Base ID | `appXXXXXXXX` |
| `AIRTABLE_TABLE_NAME` | Name of the Products table | `Products` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | `https://calmhomespaces.com` |

## 🏗 Tech Stack

- **Next.js 14+** (App Router) — ISR, Server Components
- **TypeScript** — Strict mode
- **Tailwind CSS v4** — Custom design system
- **Airtable** — Headless CMS
- **Lucide React** — Icons
- **Vercel** — Hosting (optimized for Next.js)

## 📁 Project Structure

```
calm-home-bridge/
├── app/
│   ├── product/[id]/page.tsx   # Product bridge page (ISR)
│   ├── globals.css             # Design system & utilities
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── not-found.tsx           # Custom 404
│   └── page.tsx                # Homepage
├── components/ui/
│   ├── Header.tsx              # Sticky glass header
│   ├── ProductCard.tsx         # Pinterest-style card
│   └── StickyBuyButton.tsx     # Mobile sticky CTA + disclaimer
├── lib/
│   ├── airtable.ts             # Typed Airtable client
│   └── utils.ts                # cn() utility
├── CONTEXT.md                  # Business context & architecture
└── .env.local.example          # Env template
```

## 🚢 Deploying to Vercel

1. Push the repo to GitHub
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in Settings → Environment Variables
4. Deploy — Vercel auto-detects Next.js and optimizes the build

## ⚖️ Compliance

- **Amazon Associates**: Affiliate disclaimer is always visible near the CTA button
- **FTC**: Disclosure text is rendered in the DOM (not CSS-hideable)
- **Link Security**: All Amazon links use `rel="nofollow noreferrer noopener"`
