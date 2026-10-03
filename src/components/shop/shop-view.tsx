"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EASE, LineReveal } from "@/components/motion";
import { ProductCard } from "@/components/product/product-card";
import { ChevronDown, CloseIcon } from "@/components/ui/icons";
import type { categories as Categories, ProductSummary } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { matchProducts } from "@/lib/search";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "New arrivals" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
] as const;

export function ShopView({
  products,
  categories,
}: {
  products: ProductSummary[];
  categories: typeof Categories;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [panel, setPanel] = useState(false);

  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "featured";
  const q = params.get("q") ?? "";
  const colours = params.getAll("colour");
  const size = params.get("size");

  const update = (patch: Record<string, string | string[] | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      next.delete(k);
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
      else if (v && v !== "all" && !(k === "sort" && v === "featured")) next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const palette = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.color, p.swatch));
    return [...map];
  }, [products]);

  const sizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))].sort((a, b) => Number(a) - Number(b)),
    [products],
  );

  const visible = useMemo(() => {
    let list = q ? matchProducts(products, q) : products;
    if (category === "new") list = list.filter((p) => p.isNew);
    else if (category !== "all") list = list.filter((p) => p.categories.includes(category as never));
    if (colours.length) list = list.filter((p) => colours.includes(p.color));
    if (size) list = list.filter((p) => p.sizes.some((s) => s.size === size && s.available));
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return sorted;
  }, [products, q, category, colours, size, sort]);

  const active = categories.find((c) => c.key === category);
  const title = q ? `“${q}”` : (active?.label ?? "Shop All");
  const blurb = q ? "Search results" : (active?.blurb ?? "Every style, every colour — trousers made for the way you live.");
  const filterCount = colours.length + (size ? 1 : 0);

  // Keep the active category chip visible on narrow screens.
  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-chip="${category}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [category]);

  return (
    <div className="pb-24 pt-32 md:pb-36 md:pt-44">
      <header className="container-x">
        <p className="type-label mb-4 text-muted">{blurb}</p>
        <div className="flex items-end justify-between gap-6">
          <h1 key={title} className="type-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.03em]">
            <LineReveal immediate lines={[title]} />
          </h1>
          <p className="mb-2 shrink-0 text-sm tabular-nums text-muted">
            {visible.length} {visible.length === 1 ? "style" : "styles"}
          </p>
        </div>
      </header>

      {/* Filter bar */}
      <div className="sticky top-[var(--header-offset)] z-30 mt-10 transition-[top] duration-[600ms] ease-out-expo border-y border-line bg-bg/90 backdrop-blur-xl md:mt-14">
        <div className="container-x flex items-center gap-4 py-3">
          <div className="no-scrollbar -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1">
            {[{ key: "all", label: "All" }, ...categories].map((c) => (
              <button
                key={c.key}
                type="button"
                data-chip={c.key}
                onClick={() => update({ category: c.key, q: null })}
                aria-pressed={category === c.key}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-[0.8125rem] transition-colors",
                  category === c.key ? "text-bg" : "text-fg hover:bg-surface",
                )}
              >
                {category === c.key && (
                  <motion.span
                    layoutId="chip"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPanel((v) => !v)}
            aria-expanded={panel}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[0.8125rem] transition-colors hover:border-fg"
          >
            Filter & sort{filterCount > 0 && <span className="tabular-nums">({filterCount})</span>}
            <ChevronDown width={14} className={cn("transition-transform duration-500", panel && "rotate-180")} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden border-t border-line"
            >
              <div className="container-x grid gap-8 py-8 md:grid-cols-3">
                <fieldset>
                  <legend className="type-label mb-4 text-muted">Colour</legend>
                  <div className="flex flex-wrap gap-2">
                    {palette.map(([name, hex]) => {
                      const on = colours.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-pressed={on}
                          onClick={() => update({ colour: on ? colours.filter((c) => c !== name) : [...colours, name] })}
                          className={cn(
                            "flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs transition-colors",
                            on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
                          )}
                        >
                          <span className="size-4 rounded-full ring-1 ring-black/10" style={{ background: hex }} />
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="type-label mb-4 text-muted">Waist size (in stock)</legend>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={size === s}
                        onClick={() => update({ size: size === s ? null : s })}
                        className={cn(
                          "grid h-10 min-w-12 place-items-center rounded-full border text-sm tabular-nums transition-colors",
                          size === s ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="type-label mb-4 text-muted">Sort by</legend>
                  <div className="flex flex-col items-start gap-2.5">
                    {SORTS.map((s) => (
                      <label key={s.key} className="flex cursor-pointer items-center gap-3 text-sm">
                        <input
                          type="radio"
                          name="sort"
                          checked={sort === s.key}
                          onChange={() => update({ sort: s.key })}
                          className="size-4 accent-current"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(filterCount > 0 || q) && (
        <div className="container-x mt-6 flex flex-wrap items-center gap-2">
          {q && <Pill label={`Search: ${q}`} onClear={() => update({ q: null })} />}
          {colours.map((c) => (
            <Pill key={c} label={c} onClear={() => update({ colour: colours.filter((x) => x !== c) })} />
          ))}
          {size && <Pill label={`Waist ${size}`} onClear={() => update({ size: null })} />}
          <button
            type="button"
            onClick={() => update({ colour: [], size: null, q: null })}
            className="ml-1 text-xs text-muted underline underline-offset-4 hover:text-fg"
          >
            Clear all
          </button>
        </div>
      )}

      <motion.ul layout className="container-x mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 md:gap-y-14 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.li
              key={p.handle}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
            >
              <ProductCard product={p} priority={i < 4} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <div className="container-x py-24 text-center">
          <p className="type-heading text-4xl">Nothing here — yet.</p>
          <p className="mt-3 text-sm text-muted">Try removing a filter or browsing all styles.</p>
          <button
            type="button"
            onClick={() => update({ category: null, colour: [], size: null, q: null })}
            className="mt-8 rounded-full bg-fg px-6 py-3 text-sm text-bg"
          >
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}

function Pill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs transition-colors hover:bg-surface"
      aria-label={`Remove ${label}`}
    >
      {label}
      <CloseIcon width={12} height={12} />
    </button>
  );
}
