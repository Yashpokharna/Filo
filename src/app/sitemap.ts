import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { articles, policyPages } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  const page = (path: string, priority: number) => ({ url: `${SITE_URL}${path}`, lastModified: now, priority });

  return [
    page("", 1),
    page("/shop", 0.9),
    page("/about", 0.6),
    page("/contact", 0.5),
    page("/journal", 0.6),
    page("/posters", 0.6),
    page("/app", 0.5),
    ...products.map((p) => ({ ...page(`/products/${p.handle}`, 0.8), images: [p.images[0]?.src].filter(Boolean) })),
    ...articles.map((a) => ({ ...page(`/journal/${a.slug}`, 0.5), lastModified: new Date(a.publishedAt) })),
    ...policyPages.map((p) => page(`/policies/${p.slug}`, 0.2)),
  ];
}
