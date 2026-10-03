/**
 * FILO Poster Series — campaign artwork composed in code from the product
 * photography. Each palette is taken from the colourway it celebrates.
 */
const CDN = "https://cdn.shopify.com/s/files/1/0819/7786/8547/files";

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

export const posters: PosterData[] = [
  {
    slug: "no-iron",
    no: "01",
    title: "No Iron. No Fuss.",
    blurb: "FILO Ease in Coffee — the wrinkle-free trouser that goes from wash to wear.",
    href: "/products/filo-ease",
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
    href: "/products/filo-eco",
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
    href: "/products/filo-travel-pants",
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
    blurb: "The Korean Pant in Imperial Navy — a clean, modern fit with 2-way stretch.",
    href: "/products/korean-pant-imperial-navy",
    cta: "Shop Korean Pant",
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
    href: "/products/filo-flexi-trouser-founders-edition-rose-blush",
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
