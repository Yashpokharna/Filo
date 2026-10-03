import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCarousel } from "@/components/home/carousel";
import { Gallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { SectionHeading } from "@/components/section-heading";
import { categories, getProduct, getProducts, getRelated, siblingsOf } from "@/lib/catalog";
import { SITE_URL, site } from "@/lib/site";

export const revalidate = 900;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  const title = `${product.name} — ${product.color}`;
  return {
    title,
    description: product.lead.slice(0, 160),
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title,
      description: product.lead.slice(0, 160),
      images: product.images.slice(0, 1).map((i) => ({ url: `${i.src}&width=1200`, width: 1200, alt: i.alt })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const [product, all] = await Promise.all([getProduct(handle), getProducts()]);
  if (!product) notFound();

  const siblings = siblingsOf(product, all).map((s) => ({
    handle: s.handle,
    color: s.color,
    swatch: s.swatch,
    image: s.images[0].src,
    available: s.available,
  }));
  const related = await getRelated(product, 8);
  const category = categories.find((c) => c.key === product.categories[0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.color}`,
    description: product.lead,
    image: product.images.map((i) => i.src),
    brand: { "@type": "Brand", name: "FILO" },
    color: product.color,
    sku: String(product.id),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: product.price,
      highPrice: product.price,
      offerCount: product.sizes.length,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.handle}`,
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-24 md:pt-32">
        <nav aria-label="Breadcrumb" className="container-x mb-4 hidden text-xs text-muted md:block">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/shop" className="hover:text-fg">
                Shop
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/shop?category=${category.key}`} className="hover:text-fg">
                    {category.label}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li className="text-fg" aria-current="page">
              {product.name} — {product.color}
            </li>
          </ol>
        </nav>

        <div className="md:container-x grid gap-8 md:grid-cols-12 md:gap-10 xl:gap-16">
          <div className="md:col-span-7">
            <Gallery images={product.images} />
          </div>
          <div className="container-x md:col-span-5 md:px-0">
            <div className="md:sticky md:top-[calc(var(--header-offset)+1.5rem)] md:transition-[top] md:duration-[600ms]">
              <PurchasePanel product={product} siblings={siblings} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-24 md:py-36" aria-labelledby="related">
          <SectionHeading
            eyebrow="Complete the wardrobe"
            title={[<span key="a" id="related">You may</span>, <em key="b" className="text-muted">also like.</em>]}
          />
          <div className="mt-12 md:mt-16">
            <ProductCarousel products={related} label="Related products" />
          </div>
        </section>
      )}
    </>
  );
}
