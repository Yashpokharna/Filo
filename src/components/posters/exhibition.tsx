"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE, LineReveal, Reveal } from "@/components/motion";
import { Poster } from "@/components/posters/poster";
import { PosterLightbox } from "@/components/posters/poster-lightbox";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/format";
import type { PosterData } from "@/lib/posters";
import { useIntroDone } from "@/lib/store";

/* --------------------------------------------------------------- opening -- */

/** The six posters as a deck that fans out once the page is ready. */
function Fan({ posters, onOpen }: { posters: PosterData[]; onOpen: (i: number) => void }) {
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const mid = (posters.length - 1) / 2;

  return (
    <div
      className="relative mx-auto aspect-[5/7] w-[min(46vw,15rem)] md:w-[min(17vw,16rem)]"
      onPointerLeave={() => setHover(null)}
    >
      {posters.map((p, i) => {
        const k = i - mid;
        const lifted = hover === i;
        return (
          <motion.button
            key={p.slug}
            type="button"
            onClick={() => onOpen(i)}
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            className="absolute inset-0 origin-bottom"
            style={{ zIndex: lifted ? 20 : i }}
            initial={reduce ? false : { rotate: 0, x: "0%", y: "30%", opacity: 0 }}
            animate={
              ready
                ? {
                    rotate: k * 7,
                    x: `${k * 30}%`,
                    y: `${Math.abs(k) * 4 - (lifted ? 10 : 0)}%`,
                    opacity: 1,
                  }
                : undefined
            }
            transition={{
              duration: lifted ? 0.5 : 1.4,
              ease: EASE,
              delay: ready && hover === null ? 0.2 + i * 0.08 : 0,
            }}
            aria-label={`View poster No. ${p.no}: ${p.title}`}
            data-cursor="View"
          >
            <Poster poster={p} />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- wall -- */

function Placard({ poster }: { poster: PosterData }) {
  return (
    <div className="mt-6 w-full">
      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">No. {poster.no}</span>
        <span className="flex gap-1" aria-label="Palette">
          {[poster.bg, poster.fg, poster.accent].map((c, j) => (
            <span key={j} className="size-3 rounded-full ring-1 ring-line" style={{ background: c }} />
          ))}
        </span>
      </div>
      <p className="mt-2 type-heading text-xl md:text-2xl">{poster.title}</p>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted md:text-[0.8125rem] md:[@media(max-height:780px)]:hidden">{poster.blurb}</p>
      <Link href={poster.href} className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
        Shop the look
        <ArrowUpRight width={14} className="transition-transform duration-500 group-hover:rotate-45" />
      </Link>
    </div>
  );
}

/**
 * A poster hung from the rail on two threads. It sways with scroll speed
 * (pivoting at the hook) and tilts toward the cursor with a paper sheen.
 */
function HangingPoster({
  poster,
  index,
  sway,
  onOpen,
  register,
}: {
  poster: PosterData;
  index: number;
  sway: MotionValue<number>;
  onOpen: () => void;
  register: (el: HTMLElement | null) => void;
}) {
  const reduce = useReducedMotion();
  const rotate = useTransform(sway, (v) => (reduce ? 0 : v * (1 + (index % 3) * 0.18)));
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.42), transparent 48%)`;

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set(-(py - 0.5) * 10);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div ref={register} className="relative w-[var(--pw)] shrink-0">
      <motion.div style={{ rotate, transformOrigin: "50% 0%" }} className="flex flex-col items-center">
        {/* Hook on the rail, then the two hanging threads. */}
        <span className="relative z-10 -mt-[5px] block size-2.5 rounded-full border-[1.5px] border-fg bg-bg" />
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className="-mt-1 block h-14 w-[86%] text-fg md:h-16"
          aria-hidden
        >
          <path
            d="M50 0 L0 60 M50 0 L100 60"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <motion.button
          type="button"
          onClick={onOpen}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="group/hang relative block w-full"
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
          aria-label={`View poster No. ${poster.no}: ${poster.title}`}
          data-cursor="View"
        >
          <Poster poster={poster} />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover/hang:opacity-100"
            style={{ background: sheen }}
          />
        </motion.button>
      </motion.div>
      <Placard poster={poster} />
    </div>
  );
}

function Wall({ posters, onOpen }: { posters: PosterData[]; onOpen: (i: number) => void }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const pinned = distance > 0;

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (!el) return;
      setDistance(window.innerWidth >= 768 ? Math.max(0, el.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -distance]);
  const rail = useTransform(scrollYProgress, [0, 1], [0.0001, 1]);

  // Pendulum: scroll speed pushes the posters, a soft spring lets them settle.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const push = useTransform(velocity, [-2400, 2400], [5, -5], { clamp: true });
  const sway = useSpring(push, { stiffness: 70, damping: 6, mass: 0.8 });

  // Which poster is closest to the centre of the screen? On desktop this is
  // computed from the slide offset itself (no layout read, so no frame lag).
  const pick = () => {
    const desktop = window.innerWidth >= 768;
    let best = 0;
    let bestDist = Infinity;
    items.current.forEach((el, i) => {
      if (!el) return;
      let dist: number;
      if (desktop) {
        dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 + x.get() - window.innerWidth / 2);
      } else {
        const r = el.getBoundingClientRect();
        dist = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  };
  useMotionValueEvent(x, "change", pick);
  useMotionValueEvent(scrollY, "change", pick);

  const tint = posters[active]?.bg ?? "transparent";

  return (
    <section
      ref={section}
      id="the-wall"
      aria-label="The gallery wall"
      className="relative transition-[background-color] duration-[1200ms] ease-out"
      style={{
        height: pinned ? `calc(100svh + ${distance}px)` : undefined,
        backgroundColor: `color-mix(in oklab, ${tint} 13%, var(--bg))`,
      }}
    >
      <div
        className={cn(
          // Layout follows the breakpoint; JS only measures how far to slide.
          "py-20 [--pw:min(76vw,22rem)] md:sticky md:top-0 md:h-[100svh] md:overflow-hidden md:py-0",
          // Poster width from the height budget: rail offset + hook/threads (~4rem)
          // + label (~11rem) + gallery bar (~4rem), then the 5:7 poster fills the rest.
          "md:[--pw:min(23vw,calc((100svh_-_max(16svh,8rem)_-_19rem)_*_0.714))]",
        )}
      >
        {/* The hanging rail. */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 top-[max(16svh,8rem)] hidden h-[1.5px] origin-left bg-fg md:block"
          style={{ scaleX: rail }}
        />
        <motion.div
          ref={track}
          style={{ x: pinned ? x : 0 }}
          className="flex flex-col items-center gap-20 px-[clamp(1rem,2.8vw,3rem)] md:absolute md:left-0 md:top-[max(16svh,8rem)] md:w-max md:flex-row md:items-start md:gap-[7vw]"
        >
          {/* Exhibition notes */}
          <div className="w-full max-w-md shrink-0 md:w-[min(28vw,24rem)] md:max-w-none md:pt-16">
            <p className="type-label text-muted">Wall 01 — On view</p>
            <h2 className="mt-5 type-display text-[clamp(2.5rem,4.4vw,4.5rem)]">
              Six works.
              <br />
              <em>One per colourway.</em>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Each poster is set in the palette of the trouser it celebrates. Hover to tilt one toward the light, click
              to step closer.
            </p>
            <p className="mt-10 hidden items-center gap-2 type-label md:flex">
              Scroll to walk the wall <ArrowRight width={14} />
            </p>
          </div>

          {posters.map((p, i) => (
            <HangingPoster
              key={p.slug}
              poster={p}
              index={i}
              sway={sway}
              onOpen={() => onOpen(i)}
              register={(el) => {
                items.current[i] = el;
              }}
            />
          ))}

          {/* End of the wall */}
          <div className="w-full max-w-md shrink-0 text-center md:w-[min(30vw,26rem)] md:max-w-none md:self-center md:pr-[10vw] md:text-left">
            <p className="type-label text-muted">End of wall</p>
            <p className="mt-5 type-display text-[clamp(2.25rem,3.6vw,3.75rem)]">
              Now take one <em>home.</em>
            </p>
            <div className="mt-8 flex justify-center md:block">
              <ButtonLink href="/shop" arrow>
                Shop the collection
              </ButtonLink>
            </div>
          </div>
        </motion.div>

        {/* Gallery HUD */}
        {pinned && (
          <div className="container-x absolute inset-x-0 bottom-6 hidden items-center gap-6 text-sm md:flex">
            <p className="w-64 truncate">
              <span className="font-mono text-xs text-muted">
                {String(active + 1).padStart(2, "0")} / {String(posters.length).padStart(2, "0")}
              </span>
              <span className="ml-3">{posters[active]?.title}</span>
            </p>
            <div className="relative h-px flex-1 bg-line">
              <motion.span className="absolute inset-0 origin-left bg-fg" style={{ scaleX: scrollYProgress }} />
            </div>
            <p className="type-label text-muted">FILO Gallery</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- experience -- */

export function PostersExperience({ posters }: { posters: PosterData[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      {/* Opening */}
      <section className="container-x grid min-h-[100svh] items-center gap-16 pb-20 pt-36 md:grid-cols-12 md:gap-8 md:pt-32">
        <div className="md:col-span-5">
          <Reveal y={12}>
            <p className="type-label text-muted">The FILO poster series — No. 01 to 06</p>
          </Reveal>
          <h1 className="mt-6 type-display text-[clamp(3.5rem,8vw,8.5rem)]">
            <LineReveal immediate lines={["The FILO", <em key="b">Gallery.</em>]} />
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-sm leading-relaxed text-muted">
              Six original campaign posters, designed in-house — one for each colourway story. Walk the wall, step
              closer to any piece, and take the trouser home.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#the-wall" arrow>
                Enter the gallery
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <div className="pb-10 md:col-span-7 md:pb-0">
          <Fan posters={posters} onOpen={setOpen} />
        </div>
      </section>

      <Wall posters={posters} onOpen={setOpen} />

      {/* Closing */}
      <section className="container-x py-28 md:py-40" aria-labelledby="wear-it">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 id="wear-it" className="type-display text-[clamp(2.75rem,5.5vw,5.5rem)]">
              <LineReveal lines={["Every poster is", <em key="b">a pair you can wear.</em>]} />
            </h2>
          </div>
          <ul className="border-t border-line md:col-span-6 md:col-start-7">
            {posters.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.05} y={14} className="border-b border-line">
                <div className="group flex items-center gap-5 py-4">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="w-12 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-rotate-3"
                    aria-label={`View poster No. ${p.no}`}
                  >
                    <Poster poster={p} className="shadow-none" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-muted">No. {p.no}</p>
                    <p className="truncate type-heading text-xl">{p.title}</p>
                  </div>
                  <Link href={p.href} className="flex shrink-0 items-center gap-1.5 text-sm font-medium">
                    {p.cta}
                    <ArrowUpRight width={14} className="transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <PosterLightbox posters={posters} index={open} onChange={setOpen} />
    </>
  );
}
