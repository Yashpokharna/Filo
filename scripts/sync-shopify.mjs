#!/usr/bin/env node
/**
 * Snapshots catalog and policy content from the Shopify store into
 * src/data/*.json. The storefront reads the live catalog at request time and
 * falls back to this snapshot, so run this whenever products change in bulk:
 *
 *   npm run sync
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const STORE = process.env.SHOPIFY_STORE_URL ?? "https://www.filoclothing.com";
const OUT_DIR = path.resolve(import.meta.dirname, "../src/data");

const POLICIES = [
  "shipping-policy",
  "refund-policy",
  "privacy-policy",
  "terms-of-service",
  "legal-notice",
];

async function get(url, type = "json") {
  const res = await fetch(url, { headers: { "user-agent": "filo-sync/1.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return type === "json" ? res.json() : res.text();
}

/** Strip editor noise (data-*, inline styles, empty spans) from Shopify HTML. */
function cleanHtml(html) {
  return html
    .replace(/<(script|style|meta)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/\s(data-[\w-]+|style|class|id|dir)="[^"]*"/gi, "")
    .replace(/<\/?span>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

const text = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

async function syncCatalog() {
  const { products } = await get(`${STORE}/products.json?limit=250`);
  const { products: fresh } = await get(
    `${STORE}/collections/new-arrivals/products.json?limit=50`,
  );
  const slim = products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    body_html: cleanHtml(p.body_html ?? ""),
    product_type: p.product_type,
    tags: p.tags,
    created_at: p.created_at,
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
    variants: p.variants.map((v) => ({
      id: v.id,
      title: v.title,
      option1: v.option1,
      option2: v.option2,
      price: v.price,
      compare_at_price: v.compare_at_price,
      available: v.available,
    })),
    images: p.images.map((i) => ({
      src: i.src,
      width: i.width,
      height: i.height,
    })),
  }));
  await writeFile(
    path.join(OUT_DIR, "catalog.snapshot.json"),
    JSON.stringify(
      { syncedAt: new Date().toISOString(), newArrivals: fresh.map((p) => p.handle), products: slim },
      null,
      2,
    ),
  );
  console.log(`catalog: ${slim.length} products, ${fresh.length} new arrivals`);
}

async function syncPolicies() {
  const out = [];
  for (const slug of POLICIES) {
    const page = await get(`${STORE}/policies/${slug}`, "text");
    const title = text(page.match(/shopify-policy__title"[^>]*>([\s\S]*?)<\/div>/)[1]);
    const body = page.match(/shopify-policy__body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
    out.push({ slug, title, html: cleanHtml(body ? body[1] : "") });
  }
  await writeFile(path.join(OUT_DIR, "policies.json"), JSON.stringify(out, null, 2));
  console.log(`policies: ${out.map((p) => p.slug).join(", ")}`);
}

await mkdir(OUT_DIR, { recursive: true });
await Promise.all([syncCatalog(), syncPolicies()]);
