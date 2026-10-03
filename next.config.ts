import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Catalog photos are resized by Shopify's CDN (src/components/ui/image.tsx);
    // local brand assets go through the built-in optimizer.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
    qualities: [75, 85],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async redirects() {
    // Keep old Shopify URLs working after the domain moves to this app.
    return [
      { source: "/collections/all", destination: "/shop", permanent: true },
      { source: "/collections/new-arrivals", destination: "/shop?category=new", permanent: true },
      { source: "/collections/:handle", destination: "/shop", permanent: true },
      { source: "/pages/about-us", destination: "/about", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/blogs/news", destination: "/journal", permanent: true },
      { source: "/blogs/news/:slug", destination: "/journal/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
