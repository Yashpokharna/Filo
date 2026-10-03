/**
 * Storefront-wide constants. The Shopify domain powers catalog sync and
 * checkout; once www.filoclothing.com points at this app, set
 * NEXT_PUBLIC_SHOPIFY_DOMAIN to the store's Shopify domain (see README).
 */
export const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "www.filoclothing.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.filoclothing.com";

export const site = {
  name: "Filo Clothing",
  shortName: "FILO",
  tagline: "Quiet luxury, made to last.",
  description:
    "Premium men’s trousers by FILO — wrinkle-free, 2-way stretch, linen and tailored pants designed for everyday elegance.",
  email: "hello@filoclothing.com",
  phone: "+91 94142 12340",
  hours: "Monday to Saturday, 10:00 AM – 6:00 PM IST",
  address: {
    line1: "R C Vyas Colony, 8-C-24 (Prabha Shree)",
    city: "Bhilwara",
    region: "Rajasthan",
    postalCode: "311001",
    country: "India",
  },
  social: {
    instagram: "https://www.instagram.com/filoclothiing/",
    threads: "https://www.threads.com/@filoclothiing",
  },
  promises: [
    "Dispatched in 24–48 hours",
    "5-day easy returns",
    "Waist sizes 28 to 40",
    "Secure checkout",
  ],
} as const;

export const nav = [
  { label: "Shop", href: "/shop" },
  { label: "New In", href: "/shop?category=new" },
  { label: "Posters", href: "/posters" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const policyLinks = [
  { label: "Shipping Policy", href: "/policies/shipping-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Legal Notice", href: "/policies/legal-notice" },
] as const;
