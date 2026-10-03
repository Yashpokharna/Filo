"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import type { ProductSummary } from "@/lib/catalog";

/** Horizontally scrolling product rail with snap, arrows and a progress line. */
export function ProductCarousel({ products, label }: { products: ProductSummary[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: track });
  const [edges, setEdges] = useState({ start: true, end: false });

  useMotionValueEvent(scrollXProgress, "change", (v) => setEdges({ start: v < 0.01, end: v > 0.99 }));

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 16) * (window.innerWidth > 768 ? 2 : 1), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={track}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[clamp(1rem,3.2vw,3rem)] px-[clamp(1rem,3.2vw,3rem)] pb-2"
      >
        {products.map((p) => (
          <li key={p.handle} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] xl:w-[23vw]">
            <ProductCard product={p} sizes="(min-width:1280px) 23vw, (min-width:768px) 30vw, 72vw" />
          </li>
        ))}
      </ul>

      <div className="container-x mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-line">
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-fg" style={{ scaleX: scrollXProgress }} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Previous"
            className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg disabled:opacity-30"
          >
            <ChevronLeft width={18} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Next"
            className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-fg disabled:opacity-30"
          >
            <ChevronRight width={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
