"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/format";

/**
 * Modal panel that slides in from an edge. Handles Escape, focus entry and
 * restore, and a simple focus trap.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  inverse = false,
  label,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "top";
  /** Render with the opposite theme's colours. */
  inverse?: boolean;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panel.current;
    const focusables = () =>
      node?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? [];
    const t = setTimeout(() => (node?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const offscreen = { right: { x: "100%" }, left: { x: "-100%" }, top: { y: "-100%" } }[side];
  const onscreen = side === "top" ? { y: "0%" } : { x: "0%" };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            data-lenis-prevent
            className={cn(
              "absolute flex flex-col overflow-y-auto overscroll-contain",
              inverse ? "inverse" : "bg-bg text-fg",
              side === "right" && "inset-y-0 right-0 w-full max-w-[460px]",
              side === "left" && "inset-y-0 left-0 w-full max-w-[520px]",
              side === "top" && "inset-x-0 top-0 max-h-[100dvh]",
              className,
            )}
            initial={offscreen}
            animate={onscreen}
            exit={offscreen}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
