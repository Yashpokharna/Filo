"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { EASE } from "@/components/motion";
import { Poster } from "@/components/posters/poster";
import { ButtonLink } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/ui/icons";
import type { PosterData } from "@/lib/posters";

/** Full-screen "step closer" view of a poster with its gallery label. */
export function PosterLightbox({
  posters,
  index,
  onChange,
}: {
  posters: PosterData[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const open = index !== null;
  const poster = open ? posters[index] : null;
  const go = (d: number) => index !== null && onChange((index + d + posters.length) % posters.length);

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
      {poster && index !== null && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-bg/92 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={`Poster No. ${poster.no}: ${poster.title}`}
          data-lenis-prevent
        >
          <div className="container-x flex items-center justify-between py-5">
            <p className="type-label text-muted">
              <span className="font-mono tracking-normal">
                {String(index + 1).padStart(2, "0")} / {String(posters.length).padStart(2, "0")}
              </span>{" "}
              — The FILO poster series
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => onChange(null)}
              className="-mr-2 flex h-10 items-center gap-2 px-2 text-sm"
              aria-label="Close"
            >
              Close <CloseIcon width={18} />
            </button>
          </div>

          <div className="container-x grid flex-1 items-center gap-8 pb-8 md:grid-cols-12 md:gap-10">
            <div className="relative flex h-full max-h-[78svh] items-center justify-center md:col-span-7 md:max-h-[84svh]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={poster.slug}
                  className="aspect-[5/7] h-full max-h-full max-w-full"
                  initial={{ opacity: 0, y: 40, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -30, rotate: 2 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Poster poster={poster} className="h-full" />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={poster.slug}
                className="md:col-span-4 md:col-start-9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="font-mono text-xs text-muted">No. {poster.no}</p>
                <h2 className="mt-3 type-display text-[clamp(2.25rem,4vw,4rem)]">{poster.title}</h2>
                <p className="mt-5 max-w-sm leading-relaxed text-muted">{poster.blurb}</p>
                <div className="mt-6 flex items-center gap-2" aria-label="Palette">
                  {[poster.bg, poster.fg, poster.accent].map((c, j) => (
                    <span key={j} className="size-5 rounded-full ring-1 ring-line" style={{ background: c }} />
                  ))}
                  <span className="ml-2 font-mono text-[11px] uppercase text-muted">{poster.bg}</span>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink href={poster.href} arrow onClick={() => onChange(null)}>
                    {poster.cta}
                  </ButtonLink>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg"
                      aria-label="Previous poster"
                    >
                      <ChevronLeft width={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg"
                      aria-label="Next poster"
                    >
                      <ChevronRight width={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
