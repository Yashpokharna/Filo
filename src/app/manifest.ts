import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Web app manifest: makes FILO installable as a home-screen app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FILO — Trousers for every hour",
    short_name: "FILO",
    description: site.description,
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#f5f4f1",
    theme_color: "#f5f4f1",
    lang: "en-IN",
    dir: "ltr",
    categories: ["shopping", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Shop all",
        short_name: "Shop",
        url: "/shop?source=app",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New in",
        short_name: "New in",
        url: "/shop?category=new&source=app",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Poster gallery",
        short_name: "Posters",
        url: "/posters?source=app",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Your bag",
        short_name: "Bag",
        url: "/?bag=open",
        icons: [{ src: "/pwa/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
