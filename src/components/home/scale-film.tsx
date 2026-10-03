"use client";

import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Film } from "@/components/home/film";
import { ButtonLink } from "@/components/ui/button";

/** A small framed film that grows to fill the screen as you scroll past it. */
export function ScaleFilm() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(p, [0, 0.5], [1, 0]);
  const clipPath = useMotionTemplate`inset(calc(${t} * 22%) calc(${t} * 30%) calc(${t} * 22%) calc(${t} * 30%) round calc(${t} * 10px))`;
  const textScale = useTransform(p, [0, 0.5], [1, 0.9]);
  const textOpacity = useTransform(p, [0.2, 0.45], [1, 0]);
  const copyOpacity = useTransform(p, [0.5, 0.7], [0, 1]);
  const copyY = useTransform(p, [0.5, 0.7], [40, 0]);
  const [live, setLive] = useState(false);
  useMotionValueEvent(p, "change", (v) => setLive(v > 0.55));

  return (
    <section ref={ref} className="relative h-[240vh]" aria-label="Cut with care">
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
        <motion.p
          style={{ scale: textScale, opacity: textOpacity }}
          className="type-display pointer-events-none absolute inset-x-0 text-center text-[14vw] leading-none"
          aria-hidden
        >
          Cut with care
        </motion.p>
        <motion.div className="absolute inset-0 bg-black" style={{ clipPath }}>
          <Film src="/media/film-craft.mp4" poster="/media/film-craft-poster.webp" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className={`absolute inset-x-0 bottom-0 text-white ${live ? "" : "pointer-events-none"}`}
          aria-hidden={!live}
        >
          <div className="container-x flex flex-col gap-6 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
            <h2 className="type-display text-[clamp(3rem,7vw,7rem)]">
              Considered from <span className="font-serif font-normal italic tracking-normal">the first cut.</span>
            </h2>
            <div className="flex max-w-sm flex-col gap-5">
              <p className="text-white/80">
                Every piece is developed with attention to silhouette, fabric, construction and finishing — built
                to wear well, wash after wash.
              </p>
              <ButtonLink href="/about" variant="light" arrow className="self-start">
                Our story
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
