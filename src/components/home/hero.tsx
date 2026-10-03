"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { FiloFilm, type FilmShot } from "@/components/home/filo-film";
import { EASE } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { cn } from "@/lib/format";
import { useIntroDone } from "@/lib/store";

const FI = (
  <svg viewBox="0 0 174 213" fill="currentColor" className="h-full w-auto" aria-hidden>
    <path d="M0,209.59V3.46h105.23v12.11H13.84v75.82h83.6v11.82H13.84v106.38H0h0Z" />
    <path d="M159.43,209.59V3.46h13.84v206.13h-13.84Z" />
  </svg>
);

const LO = (
  <svg viewBox="249 0 332 213" fill="currentColor" className="h-full w-auto" aria-hidden>
    <path d="M249.38,209.59V3.46h13.84v193.45h94.85v12.68h-108.69Z" />
    <path d="M406.35,182.2c-19.13-20.56-28.68-45.84-28.68-75.82s9.56-55.21,28.68-75.68S449.64,0,478.86,0s53.43,10.23,72.65,30.7c19.22,20.47,28.83,45.7,28.83,75.68s-9.61,55.26-28.83,75.82c-19.22,20.57-43.44,30.85-72.65,30.85s-53.38-10.28-72.51-30.85h0ZM416.59,39.64c-15.95,17.97-23.93,40.22-23.93,66.74s8.02,48.82,24.07,66.89c16.04,18.07,36.8,27.1,62.27,27.1s46.22-9.03,62.27-27.1c16.04-18.06,24.07-40.36,24.07-66.89s-8.03-48.77-24.07-66.74c-16.05-17.97-36.86-26.96-62.42-26.96s-46.32,8.99-62.27,26.96h0Z" />
  </svg>
);

/**
 * Scroll-driven hero: the FILO wordmark splits around a framed photograph.
 * Scrolling pushes the letters apart while the frame opens to full bleed,
 * then the campaign line and calls to action rise in.
 */
export function Hero({
  floats,
  stats,
  shots,
}: {
  floats: [string, string];
  stats: string;
  shots: FilmShot[];
}) {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const [final, setFinal] = useState(false);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(p, [0, 0.55], [1, 0]); // 1 = framed, 0 = full bleed
  const clipPath = useMotionTemplate`inset(calc(${t} * var(--iy)) calc(${t} * var(--ix)) calc(${t} * var(--iy)) calc(${t} * var(--ix)) round calc(${t} * 10px))`;
  const imageScale = useTransform(p, [0, 0.55], [1.2, 1]);
  const lettersOut = useTransform(p, [0, 0.45], ["0vw", "-38vw"]);
  const lettersOutR = useTransform(p, [0, 0.45], ["0vw", "38vw"]);
  const lettersFade = useTransform(p, [0.1, 0.4], [1, 0]);
  const chromeFade = useTransform(p, [0, 0.12], [1, 0]);
  const shade = useTransform(p, [0.45, 0.75], [0, 1]);
  const finalY = useTransform(p, [0.55, 0.78], [60, 0]);
  const finalOpacity = useTransform(p, [0.55, 0.75], [0, 1]);
  const floatY = useTransform(p, [0, 0.5], [0, -260]);

  useMotionValueEvent(p, "change", (v) => setFinal(v > 0.62));

  // Gentle pointer parallax on the floating frames.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const sxInv = useTransform(sx, (v) => -v);
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set((e.clientX / innerWidth - 0.5) * 30);
    my.set((e.clientY / innerHeight - 0.5) * 30);
  };

  const rise = (delay: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: ready ? { y: "0%" } : undefined,
    transition: { duration: 1.3, ease: EASE, delay },
  });
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[290vh] [--ix:21%] [--iy:25%] md:[--ix:37.5%] md:[--iy:17%]"
      aria-label="FILO — trousers for every hour"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The photograph: framed at first, opening to full bleed on scroll. */}
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: "inset(50% 50% 50% 50%)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        >
          <motion.div className="absolute inset-0" style={{ clipPath }}>
            <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
              <FiloFilm shots={shots} playing={ready} />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"
              style={{ opacity: shade }}
            />
          </motion.div>
        </motion.div>

        {/* FI | LO */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <motion.div
            style={{ x: lettersOut, opacity: lettersFade }}
            className="flex h-[10vw] flex-1 justify-end pr-[2.4vw] md:h-[min(29vh,13vw)]"
          >
            <span className="block h-full overflow-hidden">
              <motion.span className="block h-full" {...rise(0.45)}>
                {FI}
              </motion.span>
            </span>
          </motion.div>
          <div className="w-[calc(100%-2*var(--ix))] shrink-0" />
          <motion.div
            style={{ x: lettersOutR, opacity: lettersFade }}
            className="flex h-[10vw] flex-1 justify-start pl-[2.4vw] md:h-[min(29vh,13vw)]"
          >
            <span className="block h-full overflow-hidden">
              <motion.span className="block h-full" {...rise(0.55)}>
                {LO}
              </motion.span>
            </span>
          </motion.div>
        </div>

        {/* Floating frames (desktop) */}
        <motion.div style={{ y: floatY, opacity: chromeFade }} className="pointer-events-none absolute inset-0 hidden md:block">
          <motion.div style={{ x: sx, y: sy }} className="absolute bottom-[17%] left-[5%] w-[9vw]">
            <motion.div {...fade(0.9)} className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
              <Image src={floats[0]} alt="" fill sizes="10vw" className="object-cover" />
            </motion.div>
          </motion.div>
          <motion.div style={{ x: sxInv, y: sy }} className="absolute right-[6%] top-[22%] w-[7.5vw]">
            <motion.div {...fade(1)} className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
              <Image src={floats[1]} alt="" fill sizes="9vw" className="object-cover" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Corner details */}
        <motion.div style={{ opacity: chromeFade }} className="pointer-events-none absolute inset-0">
          <div className="container-x absolute inset-x-0 top-[calc(var(--header-h)+1.25rem)] flex justify-between type-label text-muted">
            <motion.span {...fade(0.8)} className="max-sm:hidden">
              The FILO Collection
            </motion.span>
            <motion.span {...fade(0.85)} className="max-sm:mx-auto">
              {stats}
            </motion.span>
          </div>
          <div className="container-x absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 md:bottom-8">
            <motion.div {...fade(0.95)} className="flex items-center gap-3 type-label">
              <span className="relative block h-9 w-px overflow-hidden bg-line">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-fg"
                  animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              Scroll
            </motion.div>
            <motion.p {...fade(1)} className="hidden max-w-xs text-center text-sm text-muted md:block">
              Wrinkle-free, stretch, linen and tailored trousers — made for every hour of your day.
            </motion.p>
            <motion.p {...fade(1.05)} className="type-label">
              Waist 28 — 40
            </motion.p>
          </div>
        </motion.div>

        {/* Final state copy */}
        <motion.div
          style={{ opacity: finalOpacity, y: finalY }}
          className={cn("absolute inset-x-0 bottom-0 text-white", !final && "pointer-events-none")}
        >
          <div className="container-x flex flex-col gap-8 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
            <h1 className="type-display text-[clamp(3.25rem,8.5vw,9rem)]">
              Trousers for
              <br />
              <span className="font-serif font-normal italic tracking-normal">every hour.</span>
            </h1>
            <div className="flex max-w-sm flex-col gap-6">
              <p className="text-[0.9375rem] leading-relaxed text-white/80">
                Stretch that moves when you do, linen for the heat, wrinkle-free for busy mornings and tailoring for the boardroom.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/shop" variant="light" arrow tabIndex={final ? 0 : -1}>
                  Shop the collection
                </ButtonLink>
                <ButtonLink href="/posters" variant="glass" tabIndex={final ? 0 : -1}>
                  Poster series
                </ButtonLink>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
