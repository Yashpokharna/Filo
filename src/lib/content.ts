import journal from "@/data/journal.json";
import policies from "@/data/policies.json";

export type Article = (typeof journal)[number];

/** The Korean pants article has no cover on Shopify, so borrow a product shot. */
const FALLBACK_COVERS: Record<string, string> = {
  "korean-pants-for-men-why-they-re-trending-in-india":
    "https://cdn.shopify.com/s/files/1/0819/7786/8547/files/IMG_4245.png?v=1789799986",
};

export const articles: (Article & { cover: string; readingMinutes: number })[] = journal.map((a) => ({
  ...a,
  cover: a.image ?? FALLBACK_COVERS[a.slug] ?? "/media/hero.webp",
  readingMinutes: Math.max(2, Math.round(a.html.replace(/<[^>]+>/g, " ").split(/\s+/).length / 220)),
}));

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug) ?? null;

/** Shopify policy markup nests every line in divs; flatten to plain blocks. */
const tidy = (html: string) =>
  html
    .replace(/<a name="[^"]*"><\/a>/g, "")
    .replace(/<\/?div>/g, "\n")
    .replace(/(<br>\s*){2,}/g, "<br>")
    .replace(/\n\s*<br>\s*\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

export const policyPages = policies.map((p) => ({ ...p, html: tidy(p.html) }));

export const getPolicy = (slug: string) => policyPages.find((p) => p.slug === slug) ?? null;
