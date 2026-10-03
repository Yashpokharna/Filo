import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Cursor } from "@/components/layout/cursor";
import { Footer } from "@/components/layout/footer";
import { Header, type MegaLink, type MegaTile } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Preloader } from "@/components/layout/preloader";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { themeScript } from "@/components/layout/theme-toggle";
import { categories, getStyleLeads } from "@/lib/catalog";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Filo Clothing | Men’s Formal, Lycra & Linen Pants",
    template: "%s — Filo Clothing",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/media/hero.webp", width: 1672, height: 941, alt: "FILO — trousers for every hour" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f5f4f1" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const leads = await getStyleLeads();
  const megaLinks: MegaLink[] = categories.map((c) => ({
    href: `/shop?category=${c.key}`,
    label: c.label,
    blurb: c.blurb,
  }));
  const megaTiles: MegaTile[] = ["ease", "linen-pant", "korean-pant"]
    .map((f) => leads.find((p) => p.family === f))
    .filter((p) => p !== undefined)
    .map((p) => ({
      href: `/products/${p.handle}`,
      label: p.name,
      caption: p.fabric,
      image: p.images[0].src,
    }));

  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${jetbrains.variable} ${instrument.variable} antialiased`}
      // The theme/intro script below tags <html> before hydration.
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <Script id="filo-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Preloader images={leads.map((p) => `${p.images[0].src}&width=360`)} />
        <SmoothScroll>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Header megaLinks={megaLinks} megaTiles={megaTiles} />
          <main id="main">{children}</main>
          <Footer images={leads.map((p) => `${p.images[0].src}&width=700`)} />
          <CartDrawer />
          <SearchOverlay />
          <MobileMenu megaLinks={megaLinks} />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
