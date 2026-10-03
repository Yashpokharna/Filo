# Filo Clothing — storefront

The website for [Filo Clothing](https://www.filoclothing.com), built with Next.js 16, React 19, Tailwind CSS v4 and Motion.

Shopify stays the commerce backend: products, prices, stock and **checkout/payments** come from the existing Shopify store, so orders keep landing in Shopify admin. This app replaces the storefront customers browse.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run sync       # refresh the offline snapshot from Shopify (see below)
```

Copy `.env.example` to `.env.local` and adjust if needed. Every variable has a working default.

## How it works

| Concern | Where |
| --- | --- |
| Catalog | `src/lib/catalog.ts` reads Shopify's public `products.json` (revalidated every 15 min) and groups colourways into styles (Ease, Linen Pant, Korean Pant…). If Shopify is unreachable it falls back to `src/data/catalog.snapshot.json`. |
| Cart | `src/lib/store.ts` keeps the cart in `localStorage` and syncs it across tabs. |
| Checkout | The bag's **Checkout** and the product page's **Buy it now** send shoppers to a Shopify cart permalink (`/cart/{variant}:{qty}`), which opens Shopify's hosted checkout with your existing payment, shipping and tax settings. |
| Images | Product photos are resized by Shopify's CDN (`src/components/ui/image.tsx`). Brand media (hero, films, editorial) lives in `public/media`. |
| Journal & policies | Snapshotted from Shopify into `src/data/journal.json` and `src/data/policies.json` by `npm run sync`. |
| Contact & newsletter | `POST /api/contact` emails the team through Resend when `RESEND_API_KEY` is set. Otherwise the forms open the visitor's email app. |
| SEO | Per-page metadata, product JSON-LD, `sitemap.xml`, `robots.txt`, and redirects from old Shopify URLs (`/collections/*`, `/pages/*`, `/blogs/news/*`). |

### Adding or editing products

Do it in Shopify admin as usual. Changes appear here within 15 minutes. To show a new style's name, fabric label and shop category, add it to `FAMILIES` in `src/lib/catalog.ts`. New colours get a swatch in `COLORS`. Run `npm run sync` occasionally so the offline snapshot stays current.

## Going live on www.filoclothing.com

Shopify checkout needs to stay reachable on a domain Shopify controls. Before pointing `www` at this app:

1. In Shopify admin → **Settings → Domains**, connect a subdomain such as `shop.filoclothing.com` and make it the **primary** domain.
2. Set `NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.filoclothing.com` in this app's environment.
3. Deploy this app (e.g. Vercel) and point `www.filoclothing.com` at it.
4. Optionally set `RESEND_API_KEY` to receive contact-form messages by email.

Until then, the defaults use `www.filoclothing.com` directly, so the site already works end to end against the live store.
