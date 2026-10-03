import type { ProductSummary } from "@/lib/catalog";

const SYNONYMS: Record<string, string> = {
  pant: "pants trouser",
  pants: "pant trouser",
  trouser: "pant",
  trousers: "pant",
  formal: "tailored 9to5 buckle classic",
  office: "tailored 9to5 stretch",
  lycra: "stretch",
  "wrinkle-free": "ease easy-care",
  wrinkle: "ease easy-care",
  grey: "gray sterling",
  gray: "grey sterling",
  white: "vanilla",
  beige: "sand champagne coffee",
  brown: "coffee",
  blue: "navy",
  summer: "linen shorts",
};

const haystack = (p: ProductSummary) =>
  [p.name, p.color, p.fabric, p.edition ?? "", p.family, ...p.categories, p.isNew ? "new" : ""]
    .join(" ")
    .toLowerCase();

/** Every query word (or a synonym of it) must appear somewhere in the product. */
export function matchProducts(products: ProductSummary[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const text = haystack(p);
    return words.every((w) =>
      [w, ...(SYNONYMS[w]?.split(" ") ?? [])].some((alt) => text.includes(alt)),
    );
  });
}
