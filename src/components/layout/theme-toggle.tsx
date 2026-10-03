"use client";

import { flushSync } from "react-dom";
import { cn } from "@/lib/format";

export const THEME_KEY = "filo-theme";

/** Runs before first paint: the visitor's saved choice, else light (the default). */
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="dark")t="light";document.documentElement.dataset.theme=t;var d=document.documentElement.dataset;if(sessionStorage.getItem("filo-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.intro="seen";else d.introPhase="loading"}catch(e){}`;

/**
 * Light/dark switch. The new theme wipes in as a circle from the button,
 * using the View Transitions API where available.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return apply();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(apply));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title="Toggle theme"
      className={cn("group relative grid size-10 place-items-center", className)}
    >
      {/* Sun (shown in dark mode) / moon (shown in light mode) — CSS-driven, no hydration flicker. */}
      <svg
        viewBox="0 0 24 24"
        width={19}
        height={19}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        className="hidden transition-transform duration-700 ease-out-expo group-hover:rotate-90 dark:block"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        className="block transition-transform duration-700 ease-out-expo group-hover:-rotate-12 dark:hidden"
        aria-hidden
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
