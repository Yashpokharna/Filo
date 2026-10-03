"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE, Reveal } from "@/components/motion";
import { useIntroDone } from "@/lib/store";

const LETTERS = [
  "M0,209.59V3.46h105.23v12.11H13.84v75.82h83.6v11.82H13.84v106.38H0h0Z",
  "M159.43,209.59V3.46h13.84v206.13h-13.84Z",
  "M249.38,209.59V3.46h13.84v193.45h94.85v12.68h-108.69Z",
  "M406.35,182.2c-19.13-20.56-28.68-45.84-28.68-75.82s9.56-55.21,28.68-75.68S449.64,0,478.86,0s53.43,10.23,72.65,30.7c19.22,20.47,28.83,45.7,28.83,75.68s-9.61,55.26-28.83,75.82c-19.22,20.57-43.44,30.85-72.65,30.85s-53.38-10.28-72.51-30.85h0ZM416.59,39.64c-15.95,17.97-23.93,40.22-23.93,66.74s8.02,48.82,24.07,66.89c16.04,18.07,36.8,27.1,62.27,27.1s46.22-9.03,62.27-27.1c16.04-18.06,24.07-40.36,24.07-66.89s-8.03-48.77-24.07-66.74c-16.05-17.97-36.86-26.96-62.42-26.96s-46.32,8.99-62.27,26.96h0Z",
];

const DURATION = 6200; // ms to embroider all four letters
// Gentle sine ease: unhurried start and finish, an even pace through the middle letters.
const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * About-page opening: a needle embroiders the FILO wordmark in running
 * stitches, then a thread drops from between the letters into the story.
 */
export function AboutHero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const traces = useRef<(SVGPathElement | null)[]>([]);
  const reveals = useRef<(SVGPathElement | null)[]>([]);
  const needle = useRef<SVGGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const paths = traces.current.filter((p): p is SVGPathElement => !!p);
    const masks = reveals.current;
    const finish = () => {
      masks.forEach((m) => m?.style.setProperty("stroke-dashoffset", "0"));
      setDone(true);
    };
    if (reduce || paths.length !== LETTERS.length) {
      const t = setTimeout(finish, 0);
      return () => clearTimeout(t);
    }

    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const start = performance.now() + 450;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION));
      let remaining = easeInOut(t) * total;
      let active = -1;
      let along = 0;
      lengths.forEach((len, i) => {
        const portion = Math.min(1, Math.max(0, remaining / len));
        masks[i]?.style.setProperty("stroke-dashoffset", String(1 - portion));
        if (portion > 0 && portion < 1) {
          active = i;
          along = portion * len;
        }
        remaining -= len;
      });

      // Needle rides the stitch currently being sewn; its scale cancels the SVG's.
      const n = needle.current;
      const box = svg.current;
      if (n && box) {
        if (active >= 0) {
          const p = paths[active];
          const a = p.getPointAtLength(along);
          const b = p.getPointAtLength(Math.min(lengths[active], along + 1.5));
          const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          const unit = box.viewBox.baseVal.width / box.clientWidth;
          n.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle}) scale(${unit})`);
          n.style.opacity = "1";
        } else if (t > 0) {
          n.style.opacity = "0";
        }
      }

      if (t < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, reduce]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center pt-32 md:pt-36" aria-labelledby="about-title">
      <Reveal y={12}>
        <p className="type-label text-muted">Our story — The thread</p>
      </Reveal>
      <h1 id="about-title" className="sr-only">
        FILO — the story of a thread
      </h1>

      {/* The embroidered wordmark. */}
      <svg
        ref={svg}
        viewBox="-24 -24 628.34 261.05"
        className="mt-8 block w-[min(88vw,900px)] overflow-visible text-fg md:mt-10"
        aria-hidden
      >
        <defs>
          {LETTERS.map((d, i) => (
            <mask key={i} id={`stitch-mask-${i}`} maskUnits="userSpaceOnUse" x="-24" y="-24" width="628.34" height="261.05">
              <path
                ref={(el) => {
                  reveals.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="white"
                strokeWidth={12}
                pathLength={1}
                strokeDasharray="1 1"
                style={{ strokeDashoffset: 1 }}
              />
            </mask>
          ))}
        </defs>

        {LETTERS.map((d, i) => (
          <g key={i}>
            {/* Soft fill once the outline is complete. */}
            <motion.path
              d={d}
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: done ? 0.09 : 0 }}
              transition={{ duration: 1.8, ease: EASE, delay: i * 0.12 }}
            />
            {/* Running stitch, revealed as the needle passes. */}
            <path
              ref={(el) => {
                traces.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.3}
              strokeLinecap="round"
              strokeDasharray="7 4.5"
              mask={`url(#stitch-mask-${i})`}
            />
          </g>
        ))}

        {/* Needle (drawn in screen pixels; scaled back by the tick loop). */}
        <g ref={needle} style={{ opacity: 0, transition: "opacity .3s" }}>
          <g transform="translate(-5 -5)">
            <path
              d="M1 5C1 3 3 2.2 6 2.6L46.5 4.6c.7.05.7.75 0 .8L6 7.4C3 7.8 1 7 1 5Z"
              fill="currentColor"
            />
            <ellipse cx="5.2" cy="5" rx="2.1" ry="0.9" className="fill-bg" />
          </g>
        </g>
      </svg>

      {/* Caption, split around the thread that drops between the letters. */}
      <div className="relative flex w-full flex-1 flex-col items-center">
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-[calc(50%-0.8px)] top-6 hidden w-[1.6px] origin-top bg-fg md:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: done ? 1 : 0 }}
          transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
        />
        <div className="container-x mt-12 grid max-w-5xl gap-8 md:mt-14 md:grid-cols-2 md:gap-x-32">
          <Reveal delay={0.2} className="md:text-right">
            <p className="font-serif text-4xl italic leading-none md:text-5xl">filo</p>
            <p className="mt-3 font-mono text-xs text-muted">fee·loh — noun — Italian</p>
            <p className="mt-4 type-heading text-2xl md:text-3xl">A thread.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="max-w-sm leading-relaxed text-muted md:pt-1">
              Every FILO piece begins with a single thread. Follow it down the page — this is how it becomes the pair
              you’ll reach for every single day.
            </p>
            <p className="mt-5 type-label text-fg">Scroll to follow</p>
          </Reveal>
        </div>
        <div className="h-28 md:h-36" />
      </div>
    </section>
  );
}
