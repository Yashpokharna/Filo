"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE } from "@/components/motion";
import { PlusIcon } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import type { ProductSummary } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import { cartActions } from "@/lib/store";

export function ProductCard({
  product,
  sizes = "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw",
  priority = false,
  className,
}: {
  product: ProductSummary;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [quick, setQuick] = useState(false);
  const previewImage = product.siblings.find((s) => s.handle === preview && s.handle !== product.handle)?.image;
  const [front, back] = product.images;
  const href = `/products/${product.handle}`;

  const quickAdd = (size: ProductSummary["sizes"][number]) => {
    cartActions.add({
      variantId: size.variantId,
      handle: product.handle,
      name: product.name,
      color: product.color,
      size: size.size,
      price: product.price,
      image: front.src,
    });
    setQuick(false);
  };

  return (
    <article className={cn("group/card relative", className)} onMouseLeave={() => setQuick(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
        <Link href={href} aria-label={`${product.name} — ${product.color}`} className="absolute inset-0" data-cursor="View">
          <Image
            src={front.src}
            alt={front.alt}
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover/card:scale-[1.04]"
          />
          {back && (
            <Image
              src={back.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-out-expo group-hover/card:opacity-100 max-md:hidden"
            />
          )}
          <AnimatePresence>
            {previewImage && (
              <motion.div
                key={preview}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image src={previewImage.src} alt="" fill sizes={sizes} className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
          {!product.available ? (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur">
              Sold out
            </span>
          ) : product.isNew ? (
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black backdrop-blur">
              New
            </span>
          ) : null}
          {product.edition && (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur">
              {product.edition}
            </span>
          )}
        </div>

        {product.available && (
          <div className="absolute inset-x-2.5 bottom-2.5 hidden md:block">
            <AnimatePresence initial={false} mode="wait">
              {quick ? (
                <motion.div
                  key="sizes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="rounded-xl bg-white/90 p-2.5 text-black backdrop-blur-md"
                >
                  <p className="mb-1.5 text-center text-[11px] text-black/55">Select waist size</p>
                  <div className="grid grid-cols-7 gap-0.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s.variantId}
                        type="button"
                        disabled={!s.available}
                        onClick={() => quickAdd(s)}
                        className="h-8 rounded-full text-xs tabular-nums transition-colors hover:bg-black hover:text-white disabled:text-black/25 disabled:line-through disabled:hover:bg-transparent"
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <button
                  key="cta"
                  type="button"
                  onClick={() => setQuick(true)}
                  className="flex h-10 w-full translate-y-2 items-center justify-center gap-2 rounded-full bg-white/85 text-xs font-medium text-black opacity-0 backdrop-blur-md transition-all duration-500 ease-out-expo group-hover/card:translate-y-0 group-hover/card:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
                >
                  <PlusIcon width={14} height={14} /> Quick add
                </button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">
            <Link href={href}>{product.name}</Link>
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted">
            {product.color} · {product.fabric}
          </p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">
          {product.compareAtPrice && (
            <s className="mr-1.5 text-xs text-muted">{formatPrice(product.compareAtPrice)}</s>
          )}
          {formatPrice(product.price)}
        </p>
      </div>

      {product.siblings.length > 1 && (
        <ul className="mt-2.5 flex flex-wrap items-center gap-1.5" aria-label="Other colours">
          {product.siblings.map((s) => (
            <li key={s.handle}>
              <Link
                href={`/products/${s.handle}`}
                onMouseEnter={() => setPreview(s.handle)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(s.handle)}
                onBlur={() => setPreview(null)}
                aria-label={s.color}
                aria-current={s.handle === product.handle ? "true" : undefined}
                className={cn(
                  "block size-3.5 rounded-full ring-1 ring-offset-2 ring-offset-bg transition-shadow",
                  s.handle === product.handle ? "ring-fg" : "ring-transparent hover:ring-muted",
                )}
                style={{ background: s.swatch, boxShadow: "inset 0 0 0 1px rgb(127 127 127 / 0.35)" }}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
