import "server-only";
import snapshot from "@/data/catalog.snapshot.json";
import { SHOPIFY_DOMAIN } from "@/lib/site";

/* ---------------------------------------------------------------- types -- */

type RawProduct = (typeof snapshot.products)[number];

export type CategoryKey = "linen" | "stretch" | "tailored" | "easy-care" | "shorts";

export type ProductImage = { src: string; width: number; height: number; alt: string };

export type SizeOption = { size: string; variantId: number; available: boolean };

export type Product = {
  id: number;
  handle: string;
  /** Shopify title, e.g. "FILO - Ease - Obsidian Black". */
  title: string;
  /** Style name shown in the UI, e.g. "Ease". */
  name: string;
  family: string;
  color: string;
  swatch: string;
  edition: string | null;
  fabric: string;
  categories: CategoryKey[];
  lead: string;
  highlights: string[];
  bodyHtml: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  sizes: SizeOption[];
  images: ProductImage[];
  isNew: boolean;
  createdAt: string;
};

/** Minimal shape for client components (cards, search, cart). */
export type ProductSummary = Pick<
  Product,
  | "handle"
  | "name"
  | "color"
  | "swatch"
  | "edition"
  | "fabric"
  | "categories"
  | "price"
  | "compareAtPrice"
  | "available"
  | "sizes"
  | "isNew"
  | "family"
> & {
  images: ProductImage[];
  siblings: { handle: string; color: string; swatch: string; image: ProductImage }[];
};

/* ------------------------------------------------------------ reference -- */

export const categories: { key: CategoryKey | "new"; label: string; blurb: string }[] = [
  { key: "new", label: "New In", blurb: "The latest drop. Same Filo attitude." },
  { key: "linen", label: "Linen", blurb: "Breathable linen for Indian summers." },
  { key: "stretch", label: "Stretch", blurb: "2-way and 4-way lycra that moves with you." },
  { key: "tailored", label: "Tailored", blurb: "Sharp lines for the office and beyond." },
  { key: "easy-care", label: "Wrinkle-Free", blurb: "No iron. Easy wash. Always sharp." },
  { key: "shorts", label: "Shorts", blurb: "Lightweight linen for warm days." },
];

type FamilyMeta = { name: string; fabric: string; categories: CategoryKey[]; order: number };

const FAMILIES: Record<string, FamilyMeta> = {
  ease: { name: "Ease", fabric: "Wrinkle-free", categories: ["easy-care"], order: 1 },
  "travel-pants": { name: "Travel Pant", fabric: "4-Way Lycra", categories: ["stretch"], order: 2 },
  "linen-pant": { name: "Linen Pant", fabric: "100% Linen", categories: ["linen"], order: 3 },
  "korean-pant": { name: "Korean Pant", fabric: "2-Way Lycra", categories: ["stretch"], order: 4 },
  "flexi-trouser": { name: "Flexi Trouser", fabric: "2-Way Lycra", categories: ["stretch"], order: 5 },
  "9to5": { name: "9TO5", fabric: "2-Way Stretch", categories: ["tailored", "stretch"], order: 6 },
  "buckle-pants-style-1": { name: "Buckle Pant I", fabric: "Tailored", categories: ["tailored"], order: 7 },
  "buckle-pants-style-2": { name: "Buckle Pant II", fabric: "Tailored", categories: ["tailored"], order: 8 },
  "air-linen-shorts": { name: "Air Linen Short", fabric: "Premium Linen", categories: ["linen", "shorts"], order: 9 },
  classic: { name: "Classic", fabric: "100% Cotton", categories: ["tailored"], order: 10 },
};

const COLORS: Record<string, string> = {
  "obsidian black": "#1c1c1e",
  "sterling grey": "#8e9093",
  "imperial navy": "#1f2a44",
  "champagne sand": "#cdb99a",
  "vanilla white": "#efe9dc",
  coffee: "#6b5442",
  silver: "#b9bcc0",
  "rose blush": "#d8a7a2",
  "olive mosh": "#6b6a45",
};

const COLOR_ALIASES: Record<string, string> = { white: "Vanilla White" };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* -------------------------------------------------------- normalization -- */

function parseTitle(title: string) {
  const clean = title.replace(/\s+/g, " ").replace(/^filo\s*(-\s*)?/i, "").trim();
  const cut = clean.lastIndexOf(" - ");
  let family = cut > -1 ? clean.slice(0, cut) : clean;
  let color = cut > -1 ? clean.slice(cut + 3) : "";
  color = COLOR_ALIASES[color.toLowerCase()] ?? color;
  let edition: string | null = null;
  const ed = family.match(/\s*(Founder['’]s Edition)$/i);
  if (ed) {
    edition = "Founder’s Edition";
    family = family.slice(0, ed.index);
  }
  return { family: slugify(family), familyLabel: family, color, edition };
}

/** Split Shopify body HTML into a lead paragraph + short bullet highlights. */
function parseBody(html: string) {
  const blocks = [...html.matchAll(/<(p|li|h\d)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map(([, , inner]) =>
      inner
        .replace(/<br\s*\/?>/g, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
  const lead = blocks.reduce((a, b) => (b.length > a.length ? b : a), "");
  const highlights = blocks
    .filter((b) => b !== lead && b.length < 70 && !/^filo\b/i.test(b) && !/^description$/i.test(b))
    .flatMap((b) => (b.includes("•") ? b.split("•").map((s) => s.trim()) : [b]))
    .filter(Boolean)
    .slice(0, 6);
  return { lead, highlights };
}

function normalize(raw: RawProduct, newHandles: Set<string>): Product {
  const { family, familyLabel, color, edition } = parseTitle(raw.title);
  const meta = FAMILIES[family];
  const sizeIndex = raw.options.findIndex((o) => o.name.toLowerCase() === "size");
  const sizes = raw.variants.map((v) => ({
    size: (sizeIndex === 1 ? v.option2 : v.option1) ?? v.title,
    variantId: v.id,
    available: v.available,
  }));
  const price = Math.min(...raw.variants.map((v) => Number(v.price)));
  const compare = raw.variants.map((v) => Number(v.compare_at_price ?? 0)).find((n) => n > price);
  const name = meta?.name ?? familyLabel;
  const { lead, highlights } = parseBody(raw.body_html);

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    name,
    family,
    color,
    swatch: COLORS[color.toLowerCase()] ?? "#bdb6ab",
    edition,
    fabric: meta?.fabric ?? (raw.product_type || "Trouser"),
    categories: meta?.categories ?? [],
    lead,
    highlights,
    bodyHtml: raw.body_html,
    price,
    compareAtPrice: compare ?? null,
    available: sizes.some((s) => s.available),
    sizes,
    images: raw.images.map((img, i) => ({
      src: img.src,
      width: img.width,
      height: img.height,
      alt: `${name} in ${color}${i ? ` — view ${i + 1}` : ""}`,
    })),
    isNew: newHandles.has(raw.handle),
    createdAt: raw.created_at,
  };
}

/* ---------------------------------------------------------------- fetch -- */

async function fetchJson<T>(path: string, attempt = 0): Promise<T> {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}${path}`, {
    next: { revalidate: 900, tags: ["catalog"] },
    signal: AbortSignal.timeout(10_000),
  });
  // Shopify rate-limits bursts (e.g. parallel build workers): back off and retry.
  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    await new Promise((r) => setTimeout(r, 400 * 2 ** attempt + Math.random() * 300));
    return fetchJson(path, attempt + 1);
  }
  if (!res.ok) throw new Error(`Shopify ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

async function loadRaw(): Promise<{ products: RawProduct[]; newArrivals: string[] }> {
  const [all, fresh] = await Promise.allSettled([
    fetchJson<{ products: RawProduct[] }>("/products.json?limit=250"),
    fetchJson<{ products: { handle: string }[] }>("/collections/new-arrivals/products.json?limit=50"),
  ]);
  const products =
    all.status === "fulfilled" && all.value.products?.length ? all.value.products : null;
  if (!products) {
    console.warn("[catalog] live fetch failed, using snapshot:", all.status === "rejected" ? all.reason : "empty");
  }
  return {
    products: products ?? snapshot.products,
    newArrivals:
      fresh.status === "fulfilled" ? fresh.value.products.map((p) => p.handle) : snapshot.newArrivals,
  };
}

const sortProducts = (list: Product[]) =>
  list.sort(
    (a, b) =>
      Number(b.available) - Number(a.available) ||
      (FAMILIES[a.family]?.order ?? 99) - (FAMILIES[b.family]?.order ?? 99) ||
      a.color.localeCompare(b.color),
  );

let memo: Promise<Product[]> | null = null;

export function getProducts(): Promise<Product[]> {
  // fetch() results are cached by Next; memo only dedupes within a process.
  memo ??= loadRaw()
    .then(({ products, newArrivals }) => {
      const fresh = new Set(newArrivals);
      return sortProducts(products.map((p) => normalize(p, fresh)));
    })
    .finally(() => setTimeout(() => (memo = null), 60_000));
  return memo;
}

export async function getProduct(handle: string) {
  return (await getProducts()).find((p) => p.handle === handle) ?? null;
}

export function siblingsOf(product: Product, all: Product[]) {
  return all.filter((p) => p.family === product.family);
}

export function toSummary(product: Product, all: Product[]): ProductSummary {
  return {
    handle: product.handle,
    name: product.name,
    family: product.family,
    color: product.color,
    swatch: product.swatch,
    edition: product.edition,
    fabric: product.fabric,
    categories: product.categories,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    available: product.available,
    sizes: product.sizes,
    isNew: product.isNew,
    images: product.images.slice(0, 2),
    siblings: siblingsOf(product, all).map((s) => ({
      handle: s.handle,
      color: s.color,
      swatch: s.swatch,
      image: s.images[0],
    })),
  };
}

export async function getSummaries(filter?: (p: Product) => boolean) {
  const all = await getProducts();
  return (filter ? all.filter(filter) : all).map((p) => toSummary(p, all));
}

/** One representative colourway per style, for editorial rows. */
export async function getStyleLeads() {
  const all = await getProducts();
  const seen = new Set<string>();
  return all.filter((p) => p.available && !seen.has(p.family) && seen.add(p.family));
}

export async function getRelated(product: Product, count = 4) {
  const all = await getProducts();
  const shared = (p: Product) => p.categories.some((c) => product.categories.includes(c));
  const pool = all.filter((p) => p.family !== product.family && p.available);
  const ranked = [...pool.filter(shared), ...pool.filter((p) => !shared(p))];
  const seen = new Set<string>();
  return ranked
    .filter((p) => !seen.has(p.family) && seen.add(p.family))
    .slice(0, count)
    .map((p) => toSummary(p, all));
}
