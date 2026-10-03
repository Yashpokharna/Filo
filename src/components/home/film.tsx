"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/format";

/** Muted looping video that only plays while on screen. */
export function Film({
  src,
  poster,
  className,
  eager = false,
}: {
  src: string;
  poster: string;
  className?: string;
  /** Start buffering immediately (above-the-fold use). */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "20% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
