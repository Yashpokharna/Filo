"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useIntroDone, useOverlays } from "@/lib/store";

function ScrollControl() {
  const lenis = useLenis();
  const pathname = usePathname();
  const { cart, search, menu } = useOverlays();
  const introDone = useIntroDone();
  const locked = cart || search || menu || !introDone;

  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [lenis, locked]);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [lenis, pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [locked]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <ReactLenis root options={{ lerp: reduce ? 1 : 0.11, smoothWheel: !reduce, anchors: true }}>
      <ScrollControl />
      {children}
    </ReactLenis>
  );
}
