"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gutterPath, weavePath } from "@/components/about/paths";
import { cn } from "@/lib/format";

type Shape = { variant: "weave"; sides: ("left" | "right")[] } | { variant: "gutter"; count: number };

/**
 * A thread that sews itself down its container as the page scrolls, led by a
 * needle. The path is rebuilt in real pixels whenever the container resizes,
 * and its tip tracks a line 60% of the way down the viewport.
 */
export function Thread({ shape, className }: { shape: Shape; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const needle = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 0.6", "end 0.6"] });

  const d =
    size.w && size.h
      ? shape.variant === "weave"
        ? weavePath(shape.sides, size.w, size.h)
        : gutterPath(shape.count, size.w, size.h)
      : "";

  const draw = useCallback(
    (progress: number) => {
      const p = path.current;
      if (!p || !size.h) return;
      const total = p.getTotalLength();
      // Find the length whose point sits level with the reader, so the needle
      // keeps pace even where the thread swings sideways.
      const target = Math.min(1, Math.max(0, reduce ? 1 : progress)) * size.h;
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (p.getPointAtLength(mid).y < target) lo = mid;
        else hi = mid;
      }
      p.style.strokeDasharray = `${total}`;
      p.style.strokeDashoffset = `${total - lo}`;

      const n = needle.current;
      if (!n) return;
      const a = p.getPointAtLength(lo);
      const b = p.getPointAtLength(Math.min(total, lo + 2));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      n.style.transform = `translate(${a.x}px, ${a.y}px) rotate(${angle}deg)`;
      n.style.opacity = lo > 4 && lo < total - 4 ? "1" : "0";
    },
    [reduce, size.h],
  );

  useMotionValueEvent(scrollYProgress, "change", draw);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Redraw once the path exists or the layout changes.
  useEffect(() => draw(scrollYProgress.get()), [d, draw, scrollYProgress]);

  return (
    <div ref={box} className={cn("pointer-events-none absolute", className)} aria-hidden>
      {d && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="absolute inset-0 overflow-visible"
        >
          {/* Basting guide: where the thread will go. */}
          <path d={d} fill="none" stroke="currentColor" strokeOpacity={0.16} strokeWidth={1} strokeDasharray="3 7" />
          <path ref={path} d={d} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      )}
      {/* Needle: its eye rides the end of the thread, its point leads. */}
      <div
        ref={needle}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-300"
        style={{ transformOrigin: "0 0" }}
      >
        <svg width="40" height="10" viewBox="0 0 40 10" className="-ml-[5px] -mt-[5px] block" fill="currentColor">
          <path d="M1 5C1 3 3 2.2 6 2.6L38.5 4.6c.7.05.7.75 0 .8L6 7.4C3 7.8 1 7 1 5Z" />
          <ellipse cx="5.2" cy="5" rx="2.1" ry="0.9" className="fill-bg" />
        </svg>
      </div>
    </div>
  );
}
