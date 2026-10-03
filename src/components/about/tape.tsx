"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/format";

const SIZES = [28, 30, 32, 34, 36, 38, 40];
const INCH = 28; // px per inch on the tape
const TICKS = Array.from({ length: (46 - 22) * 4 + 1 }, (_, i) => 22 + i / 4); // quarter-inch ticks

/** A tailor's tape that reads waist sizes 28 → 40 as the chapter scrolls by. */
export function Tape() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });
  const inches = useTransform(scrollYProgress, [0.1, 0.9], [28, 40], {
    clamp: true,
  });
  const x = useTransform(inches, (v) => -(v - 22) * INCH);
  const [size, setSize] = useState(28);
  useMotionValueEvent(inches, "change", (v) => setSize(Math.min(40, Math.max(28, Math.round(v / 2) * 2))));

  return (
    <div
      ref={ref}
      className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-sm bg-surface p-6 md:p-10"
    >
      <div className="flex items-start justify-between type-label text-muted">
        <span>Waist</span>
        <span>Inches</span>
      </div>

      <div className="text-center">
        <p className="type-display text-[clamp(6rem,15vw,14rem)] tabular-nums leading-none">
          {size}
          <span className="align-top text-[0.35em] text-muted">″</span>
        </p>
        <ul className="mt-6 flex justify-center gap-2">
          {SIZES.map((s) => (
            <li
              key={s}
              className={cn(
                "grid size-9 place-items-center rounded-full border text-xs tabular-nums transition-colors duration-300 md:size-10",
                s === size ? "border-fg bg-fg text-bg" : "border-line text-muted",
              )}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* The tape, sliding under a fixed needle. */}
      <div className="relative -mx-6 h-16 overflow-hidden border-y border-line bg-bg/60 md:-mx-10 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <motion.div className="absolute inset-y-0 left-1/2" style={{ x }}>
          {TICKS.map((t) => {
            const whole = Number.isInteger(t);
            const half = !whole && Number.isInteger(t * 2);
            return (
              <span
                key={t}
                className={cn(
                  "absolute top-0 w-px bg-fg",
                  whole ? "h-7 opacity-80" : half ? "h-4 opacity-50" : "h-2.5 opacity-30",
                )}
                style={{ left: (t - 22) * INCH }}
              />
            );
          })}
          {TICKS.filter((t) => Number.isInteger(t)).map((t) => (
            <span
              key={`n${t}`}
              className={cn(
                "absolute top-8 -translate-x-1/2 font-mono text-[10px] tabular-nums",
                t % 2 === 0 && t >= 28 && t <= 40 ? "text-fg" : "text-muted",
              )}
              style={{ left: (t - 22) * INCH }}
            >
              {t}
            </span>
          ))}
        </motion.div>
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-fg" />
      </div>
    </div>
  );
}
