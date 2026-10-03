"use client";

import { useLenis } from "lenis/react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion";
import { ArrowUpRight } from "@/components/ui/icons";

const LETTERS = [
  { d: "M0,209.59V3.46h105.23v12.11H13.84v75.82h83.6v11.82H13.84v106.38H0h0Z", x: 0, w: 106 },
  { d: "M159.43,209.59V3.46h13.84v206.13h-13.84Z", x: 140, w: 52 },
  { d: "M249.38,209.59V3.46h13.84v193.45h94.85v12.68h-108.69Z", x: 249, w: 110 },
  {
    d: "M406.35,182.2c-19.13-20.56-28.68-45.84-28.68-75.82s9.56-55.21,28.68-75.68S449.64,0,478.86,0s53.43,10.23,72.65,30.7c19.22,20.47,28.83,45.7,28.83,75.68s-9.61,55.26-28.83,75.82c-19.22,20.57-43.44,30.85-72.65,30.85s-53.38-10.28-72.51-30.85h0ZM416.59,39.64c-15.95,17.97-23.93,40.22-23.93,66.74s8.02,48.82,24.07,66.89c16.04,18.07,36.8,27.1,62.27,27.1s46.22-9.03,62.27-27.1c16.04-18.06,24.07-40.36,24.07-66.89s-8.03-48.77-24.07-66.74c-16.05-17.97-36.86-26.96-62.42-26.96s-46.32,8.99-62.27,26.96h0Z",
    x: 377,
    w: 204,
  },
];

/**
 * Oversized FILO that rises in letter by letter. Hovering a letter fills it
 * with a product photograph (the outline of each letter is the mask).
 */
export function FooterWordmark({ images }: { images: string[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <svg
      ref={ref}
      viewBox="0 0 580.34 213.05"
      className="block h-auto w-full overflow-hidden"
      role="img"
      aria-label="FILO"
      onPointerLeave={() => setActive(null)}
    >
      <defs>
        {LETTERS.map((l, i) => (
          <clipPath key={i} id={`footer-letter-${i}`}>
            {/* Wipes up from the baseline when the letter is hovered. */}
            <motion.rect
              x={l.x}
              width={l.w}
              rx={6}
              initial={false}
              animate={active === i ? { y: 0, height: 213 } : { y: 213, height: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </clipPath>
        ))}
        {/* The O's outer edge: its photo fills the ring and stays inside it. */}
        <clipPath id="footer-letter-o-shape">
          <ellipse cx="478.95" cy="106.5" rx="101.3" ry="106.5" />
        </clipPath>
      </defs>
      {LETTERS.map((l, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { y: 230 }}
          animate={inView ? { y: 0 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: i * 0.08 }}
          onPointerEnter={() => setActive(i)}
        >
          {/* Generous hit area, especially for the thin I. */}
          <rect x={l.x} y={0} width={l.w} height={213} fill="transparent" />
          <g clipPath={i === 3 ? "url(#footer-letter-o-shape)" : undefined}>
            <g clipPath={`url(#footer-letter-${i})`}>
              <image
                href={images[i % images.length]}
                x={l.x}
                y={0}
                width={l.w}
                height={213}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </g>
          <path d={l.d} fill="currentColor" />
        </motion.g>
      ))}
    </svg>
  );
}

/** Live local time at the Bhilwara studio. Rendered after mount to avoid hydration drift. */
export function StudioClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 tabular-nums">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>
      Bhilwara {now ?? "--:--"} IST
    </span>
  );
}

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group inline-flex items-center gap-2"
    >
      Back to top
      <span className="grid size-7 place-items-center rounded-full border border-line transition-colors group-hover:bg-fg group-hover:text-bg">
        <ArrowUpRight width={13} className="-rotate-45" />
      </span>
    </button>
  );
}
