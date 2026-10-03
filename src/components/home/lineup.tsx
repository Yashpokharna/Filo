"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, useState } from "react";
import { EASE, Reveal } from "@/components/motion";
import { ArrowUpRight } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { cn, formatPrice } from "@/lib/format";

export type LineupItem = {
  href: string;
  name: string;
  fabric: string;
  price: number;
  colours: number;
  image: string;
};

/**
 * Index of every style. On desktop a photograph trails the cursor and swaps as
 * you move between rows; on touch screens each row carries a thumbnail.
 */
export function Lineup({ items }: { items: LineupItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1500, 1500], [-8, 8], { clamp: true });

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item.href}
            delay={Math.min(i, 6) * 0.04}
            y={20}
            className="border-b border-line"
          >
            <Link
              href={item.href}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[4rem_1fr_12rem_8rem_8rem_2rem] md:gap-6 md:py-5"
            >
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "type-display text-[clamp(2.25rem,6.2vw,6.25rem)] transition-[transform,opacity] duration-700 ease-out-expo md:group-hover:translate-x-4",
                  active !== null && active !== i && "md:opacity-25",
                )}
              >
                {item.name}
              </span>
              <span className="relative aspect-[3/4] w-14 overflow-hidden rounded-sm bg-surface md:hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="hidden text-sm text-muted md:block">
                {item.fabric}
              </span>
              <span className="hidden text-sm text-muted md:block">
                {item.colours} colour{item.colours === 1 ? "" : "s"}
              </span>
              <span className="hidden text-sm tabular-nums md:block">
                From {formatPrice(item.price)}
              </span>
              <ArrowUpRight
                width={20}
                className="hidden transition-transform duration-500 ease-out-expo group-hover:rotate-45 md:block"
              />
            </Link>
          </Reveal>
        ))}
      </ul>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[17vw] md:block"
        style={{ x: sx, y: sy, rotate }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key="frame"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface shadow-2xl"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0, transition: { duration: 0.6 } }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Image
                      src={items[active].image}
                      alt=""
                      fill
                      sizes="17vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
