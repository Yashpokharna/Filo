"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { EASE } from "@/components/motion";
import { ArrowRight, CloseIcon, SearchIcon } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { Sheet } from "@/components/ui/sheet";
import type { ProductSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { matchProducts } from "@/lib/search";
import { overlay, useOverlays } from "@/lib/store";

const SUGGESTIONS = ["Linen", "Wrinkle-free", "Korean", "Travel", "Black", "Navy", "Shorts", "Office"];

let cache: Promise<ProductSummary[]> | null = null;
const loadIndex = () =>
  (cache ??= fetch("/api/products")
    .then((r) => r.json() as Promise<ProductSummary[]>)
    .catch(() => {
      cache = null;
      return [];
    }));

export function SearchOverlay() {
  const { search: open } = useOverlays();
  const close = () => overlay.close("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    if (open) loadIndex().then(setProducts);
  }, [open]);

  const results = useMemo(() => {
    if (!deferred.trim()) return products.filter((p) => p.isNew).slice(0, 6);
    return matchProducts(products, deferred).slice(0, 12);
  }, [products, deferred]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    close();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Sheet open={open} onClose={close} side="top" label="Search">
      <div className="container-x pb-12 pt-5">
        <div className="flex items-center justify-between">
          <p className="type-label text-muted">Search</p>
          <button type="button" onClick={close} className="-mr-2 grid size-10 place-items-center" aria-label="Close search">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 flex items-center gap-4 border-b border-fg pb-4" role="search">
          <SearchIcon className="size-6 shrink-0 text-muted md:size-8" />
          <input
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trousers, fabrics, colours"
            aria-label="Search products"
            className="w-full bg-transparent type-display text-4xl outline-none placeholder:text-fg/25 md:text-6xl"
          />
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full border border-line px-4 py-1.5 text-xs transition-colors hover:border-fg"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-5 mt-10 flex items-baseline justify-between">
          <p className="type-label text-muted">
            {deferred.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Just dropped"}
          </p>
          {deferred.trim() && results.length > 0 && (
            <button type="button" onClick={() => submit()} className="flex items-center gap-1.5 text-sm font-medium">
              See all <ArrowRight width={15} />
            </button>
          )}
        </div>
        {results.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 lg:grid-cols-6">
            {results.map((p, i) => (
              <motion.li
                key={p.handle}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.03 }}
              >
                <Link href={`/products/${p.handle}`} onClick={close} className="group block" data-cursor="View">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
                    <Image
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      sizes="(min-width:1024px) 16vw, (min-width:768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2.5 text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.color} · {formatPrice(p.price)}
                  </p>
                </Link>
              </motion.li>
            ))}
          </ul>
        ) : (
          deferred.trim() && (
            <p className="text-sm text-muted">
              Nothing matched “{deferred}”. Try a fabric like “linen” or a colour like “navy”.
            </p>
          )
        )}
      </div>
    </Sheet>
  );
}
