"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/format";

/**
 * Fixed chapter index for the story (large screens). Highlights the chapter
 * in view and jumps to any chapter on click.
 */
export function StepRail({ steps, containerId }: { steps: { id: string; label: string }[]; containerId: string }) {
  const lenis = useLenis();
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById(containerId);
    const sections = steps.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!container || !sections.length) return;

    const inChapter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => inChapter.observe(s));

    const inStory = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "-30% 0px -30% 0px",
    });
    inStory.observe(container);

    return () => {
      inChapter.disconnect();
      inStory.disconnect();
    };
  }, [steps, containerId]);

  return (
    <div className="fixed left-[clamp(1rem,2.8vw,3rem)] top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Story chapters"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <ol className="space-y-2.5">
              {steps.map((s, i) => {
                const on = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(s.id);
                        if (!el) return;
                        if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
                        else el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={cn(
                        "group flex items-center gap-3 type-label transition-colors duration-300",
                        on ? "text-fg" : "text-muted hover:text-fg",
                      )}
                      aria-current={on ? "step" : undefined}
                    >
                      <span className="font-mono tracking-normal">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "h-px bg-current transition-all duration-500 ease-out-expo",
                          on ? "w-8" : "w-3 group-hover:w-5",
                        )}
                      />
                      <span
                        className={cn(
                          "transition-opacity duration-300",
                          on ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
