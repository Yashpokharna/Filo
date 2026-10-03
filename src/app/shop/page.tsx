import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/shop-view";
import { categories, getSummaries } from "@/lib/catalog";

export const revalidate = 900;

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = categories.find((c) => c.key === category);
  return {
    title: cat ? `${cat.label} Trousers` : "Shop All Trousers",
    description: cat?.blurb ?? "Shop wrinkle-free, stretch, linen and tailored trousers for men by FILO.",
    alternates: { canonical: cat ? `/shop?category=${cat.key}` : "/shop" },
  };
}

export default async function ShopPage() {
  const products = await getSummaries();
  return (
    <Suspense>
      <ShopView products={products} categories={categories} />
    </Suspense>
  );
}
