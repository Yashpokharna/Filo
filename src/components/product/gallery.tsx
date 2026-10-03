"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion";
import Image from "@/components/ui/image";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/ui/icons";
import type { ProductImage } from "@/lib/catalog";
import { cn } from "@/lib/format";

export function Gallery({ images }: { images: ProductImage[] }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  const onRailScroll = () => {
    const el = rail.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <>
      {/* Mobile: swipe rail */}
      <div className="relative md:hidden">
        <div ref={rail} onScroll={onRailScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setZoom(i)}
              className="relative aspect-[3/4] w-full shrink-0 snap-center bg-surface"
              aria-label={`Zoom image ${i + 1}`}
            >
              <Image src={img.src} alt={img.alt} fill loading={i === 0 ? "eager" : "lazy"} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
          {images.map((img, i) => (
            <span
              key={img.src}
              className={cn("h-[3px] rounded-full bg-white transition-all duration-500", i === index ? "w-6" : "w-3 opacity-50")}
            />
          ))}
        </div>
      </div>

      {/* Desktop: editorial grid */}
      <div className="hidden grid-cols-2 gap-1.5 md:grid">
        {images.map((img, i) => (
          <motion.button
            key={img.src}
            type="button"
            onClick={() => setZoom(i)}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden bg-surface",
              i === 0 || (images.length % 2 === 0 && i === images.length - 1 && images.length > 2)
                ? "col-span-2 aspect-[4/5]"
                : "aspect-[3/4]",
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: Math.min(i, 3) * 0.08 }}
            aria-label={`Zoom image ${i + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              loading={i < 2 ? "eager" : "lazy"}
              sizes={i === 0 ? "60vw" : "30vw"}
              className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
            />
          </motion.button>
        ))}
      </div>

      <Lightbox images={images} index={zoom} onChange={setZoom} />
    </>
  );
}

function Lightbox({
  images,
  index,
  onChange,
}: {
  images: ProductImage[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const open = index !== null;
  const go = (d: number) => index !== null && onChange((index + d + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          data-lenis-prevent
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" quality={85} className="object-contain" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6">
            <span className="text-sm tabular-nums text-muted">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              autoFocus
              onClick={() => onChange(null)}
              className="grid size-11 place-items-center rounded-full bg-bg/80 backdrop-blur"
              aria-label="Close image viewer"
            >
              <CloseIcon />
            </button>
          </div>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-bg/80 backdrop-blur md:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-bg/80 backdrop-blur md:right-6"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
