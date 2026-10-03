import policies from "@/data/policies.json";

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
