import type { ImageLoaderProps } from "next/image";

/**
 * Shopify's CDN resizes on the fly and negotiates WebP/AVIF itself, so we ask
 * it for the exact width instead of proxying originals (often 3–5 MB PNGs)
 * through Next's optimizer.
 */
export function shopifyLoader({ src, width }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}

export const isShopifyImage = (src: unknown): src is string =>
  typeof src === "string" && src.startsWith("https://cdn.shopify.com/");
