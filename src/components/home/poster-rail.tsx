"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/ui/icons";

/**
 * Pinned horizontal gallery: vertical scrolling slides the poster track
 * sideways (desktop). On small screens it becomes a native swipe rail.
 */
export function PosterRail({
  intro,
  items,
}: {
  intro: ReactNode;
  items: { href: string; title: string; no: string; poster: ReactNode }[];
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);

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
  const pinned = distance > 0;

  return (
    <section
      ref={section}
      className="relative"
      style={{ height: pinned ? `calc(100svh + ${distance}px)` : undefined }}
      aria-label="The FILO poster series"
    >
      <div className={pinned ? "sticky top-0 flex h-[100svh] items-center overflow-hidden" : "py-20"}>
        <motion.div
          ref={track}
          style={{ x: pinned ? x : 0 }}
          className="no-scrollbar flex w-max items-center gap-5 px-[clamp(1rem,2.8vw,3rem)] max-md:w-full max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto md:gap-8"
        >
          <div className="w-[82vw] shrink-0 snap-start md:w-[30vw]">{intro}</div>
          {items.map((item) => (
            <Link
              key={item.href + item.no}
              href={item.href}
              className="group block w-[74vw] shrink-0 snap-start sm:w-[46vw] md:w-[min(30vw,62vh)]"
              data-cursor="Shop"
            >
              <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">{item.poster}</div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>
                  <span className="mr-3 font-mono text-xs text-muted">No. {item.no}</span>
                  {item.title}
                </span>
                <ArrowUpRight width={16} className="transition-transform duration-500 group-hover:rotate-45" />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
