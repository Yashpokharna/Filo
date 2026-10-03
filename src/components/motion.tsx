"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { useIntroDone } from "@/lib/store";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * In-view trigger that also waits for the entry loader, so nothing animates
 * unseen behind it.
 */
function useReveal<T extends Element>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });
  const ready = useIntroDone();
  return { ref, show: inView && ready, ready };
}

/** Fade + rise into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "span";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal<HTMLDivElement>();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Each line slides up from behind a mask. Pass lines as an array. */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate as soon as the page is ready instead of on scroll. */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  // Observe the wrapper: the lines start clipped by their masks, so an
  // observer on the lines themselves would never report them as visible.
  const { ref, show, ready } = useReveal<HTMLSpanElement>("0px 0px -10% 0px");
  const go = immediate ? ready : show;
  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={reduce ? false : { y: "110%" }}
            animate={go ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Image wrapper that wipes open (clip-path) and settles from a slight zoom. */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal<HTMLDivElement>("0px 0px -8% 0px");
  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(16% 0% 0% 0%)", opacity: 0 }}
      animate={show ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.12 }}
        animate={show ? { scale: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Translates children on scroll for a subtle depth effect. */
export function Parallax({
  children,
  className,
  offset = 80,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-offset, offset]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        style={{ y, height: `calc(100% + ${offset * 2}px)`, marginTop: -offset }}
        className="relative w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
