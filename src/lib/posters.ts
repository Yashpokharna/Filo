/**
 * FILO Poster Series — campaign artwork composed in code from the product
 * photography. Each palette is taken from the colourway it celebrates.
 */
import { colourwayHref, getProducts } from "@/lib/catalog";

const CDN = "https://cdn.shopify.com/s/files/1/0819/7786/8547/files";

/** A colourway by style and colour; resolved to a product URL at render time. */
type ColourwayRef = { family: string; color: string };

export type PosterData = {
  slug: "no-iron" | "linen-season" | "nine-to-five" | "go-further" | "stretch" | "founders";
  no: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  bg: string;
  fg: string;
  accent: string;
  images: string[];
};

const series: (Omit<PosterData, "href"> & { href: string | ColourwayRef })[] = [
  {
    slug: "no-iron",
    no: "01",
    title: "No Iron. No Fuss.",
    blurb: "FILO Ease in Coffee — the wrinkle-free trouser that goes from wash to wear.",
    href: { family: "ease", color: "Coffee" },
    cta: "Shop FILO Ease",
    bg: "#6b5442",
    fg: "#f3ebdf",
    accent: "#d9c4a8",
    images: [`${CDN}/IMG_4118.png?v=1789702970`],
  },
  {
    slug: "linen-season",
    no: "02",
    title: "Linen Season",
    blurb: "Pure linen for long, hot afternoons. Breathable, lightweight, naturally soft.",
    href: "/shop?category=linen",
    cta: "Shop linen",
    bg: "#e7e0cf",
    fg: "#2d3122",
    accent: "#c9963f",
    images: [`${CDN}/IMG_4319.png?v=1789968508`],
  },
  {
    slug: "nine-to-five",
    no: "03",
    title: "Nine to Five, and Beyond",
    blurb: "FILO 9TO5 — a smart corporate fit in 2-way stretch. Professional in appearance, flexible in comfort.",
    href: { family: "9to5", color: "Obsidian Black" },
    cta: "Shop 9TO5",
    bg: "#19191b",
    fg: "#ece9e2",
    accent: "#8e9093",
    images: [`${CDN}/IMG_3924.png?v=1789287142`],
  },
  {
    slug: "go-further",
    no: "04",
    title: "Go Further",
    blurb: "The Travel Pant in 4-way lycra with an elastic waistband. Built for long journeys.",
    href: { family: "travel-pant", color: "Obsidian Black" },
    cta: "Shop Travel Pant",
    bg: "#babdc1",
    fg: "#121212",
    accent: "#121212",
    images: [`${CDN}/Travelpant.png?v=1788018742`],
  },
  {
    slug: "stretch",
    no: "05",
    title: "Stretch, Don’t Stress",
    blurb: "The Korean Stretch Pant in Imperial Navy — a clean, modern fit with 2-way stretch.",
    href: { family: "korean-stretch-pant", color: "Imperial Navy" },
    cta: "Shop Korean Stretch Pant",
    bg: "#1e2942",
    fg: "#e8e3d8",
    accent: "#9fb0d6",
    images: [`${CDN}/IMG_4245.png?v=1789799986`],
  },
  {
    slug: "founders",
    no: "06",
    title: "Founder’s Edition",
    blurb: "Flexi Trouser in Rose Blush and Olive Mosh — the Founder’s Edition colourways in 2-way lycra.",
    href: { family: "flexi-trouser", color: "Rose Blush" },
    cta: "Shop Founder’s Edition",
    bg: "#ead9d2",
    fg: "#3b2b29",
    accent: "#b7837c",
    images: [
      `${CDN}/ChatGPTImageJul5_2026_10_43_01PM.png?v=1783273513`,
      `${CDN}/ChatGPTImageJun30_2026_10_25_21PM.png?v=1783273481`,
    ],
  },
];

/** The series with product links pointing at whatever the catalog currently calls each colourway. */
export async function getPosters(): Promise<PosterData[]> {
  const all = await getProducts();
  return series.map(({ href, ...poster }) => ({
    ...poster,
    href: typeof href === "string" ? href : colourwayHref(all, href.family, href.color),
  }));
}
