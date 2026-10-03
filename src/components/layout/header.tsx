"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { EASE } from "@/components/motion";
import {
  ArrowUpRight,
  BagIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";
import { overlay, useCart } from "@/lib/store";

export type MegaTile = {
  href: string;
  label: string;
  caption: string;
  image: string;
};
export type MegaLink = { href: string; label: string; blurb: string };

const links = [
  { label: "New In", href: "/shop?category=new" },
  { label: "Posters", href: "/posters" },
  { label: "Journal", href: "/journal" },
];

/** Label that rolls to a duplicate on hover. */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover/nav:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/nav:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

function Announcement() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((n) => (n + 1) % site.promises.length),
      3800,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inverse relative h-8 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-0 grid place-items-center type-label text-[0.625rem]"
        >
          {site.promises[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Header({
  megaLinks,
  megaTiles,
}: {
  megaLinks: MegaLink[];
  megaTiles: MegaTile[];
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);

  // Hover intent: brushing past a neighbouring link on the way down to the
  // panel shouldn't snap it shut, so closing waits a beat and is cancelled
  // as soon as the pointer reaches the panel (or Shop) again.
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openMega = useCallback(() => {
    clearTimeout(closeTimer.current);
    setMega(true);
  }, []);
  const closeMega = useCallback((delay = 280) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), delay);
  }, []);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > 320 && y > prev && !mega);
  });

  // Lets sticky UI (e.g. shop filters) sit flush under the header.
  useEffect(() => {
    document.documentElement.dataset.header = hidden ? "hidden" : "shown";
  }, [hidden]);

  // Close the mega menu whenever the route changes.
  useEffect(() => {
    const t = setTimeout(() => setMega(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  const solid = scrolled || mega;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseLeave={() => closeMega()}
    >
      <div className="intro-hide" style={{ transitionDelay: "0.25s" }}>
        <Announcement />
      </div>
      <div
        className={cn(
          "relative border-b transition-[background-color,border-color] duration-500",
          solid
            ? "border-line bg-bg/80 backdrop-blur-xl"
            : "border-transparent",
        )}
      >
        <div className="container-x grid h-15 grid-cols-[1fr_auto_1fr] items-center md:h-17">
          <nav
            aria-label="Primary"
            className="intro-hide flex items-center"
            style={{ transitionDelay: "0.05s" }}
          >
            <button
              type="button"
              onClick={() => overlay.open("menu")}
              className="-ml-2 grid size-10 place-items-center md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <div className="hidden items-center gap-7 md:flex">
              <Link
                href="/shop"
                onMouseEnter={openMega}
                onFocus={openMega}
                aria-expanded={mega}
                className="group/nav text-[0.8125rem] font-medium"
              >
                <Roll>Shop</Roll>
              </Link>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => mega && closeMega()}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="group/nav text-[0.8125rem] font-medium aria-[current=page]:opacity-50"
                >
                  <Roll>{l.label}</Roll>
                </Link>
              ))}
            </div>
          </nav>

          <Link href="/" aria-label="Filo Clothing — home" className="block">
            <Wordmark
              data-site-logo
              className="intro-logo h-4 w-auto md:h-[18px]"
            />
          </Link>

          <div
            className="intro-hide flex items-center justify-end gap-0.5 md:gap-2"
            style={{ transitionDelay: "0.12s" }}
          >
            <Link
              href="/about"
              onMouseEnter={() => mega && closeMega()}
              className="group/nav mr-3 hidden text-[0.8125rem] font-medium lg:block"
            >
              <Roll>About</Roll>
            </Link>
            <button
              type="button"
              onClick={() => overlay.open("search")}
              className="grid size-10 place-items-center"
              aria-label="Search products"
            >
              <SearchIcon />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => overlay.open("cart")}
              className="relative -mr-2 flex h-10 items-center gap-2 pl-2 pr-2 text-[0.8125rem] font-medium md:-mr-0 md:rounded-full md:border md:border-line md:pl-4 md:pr-4 md:transition-colors md:hover:bg-fg md:hover:text-bg"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <BagIcon className="md:hidden" />
              <span className="hidden md:inline">Bag</span>
              <span
                className={cn(
                  "relative inline-grid min-w-4 overflow-hidden tabular-nums max-md:absolute max-md:right-0.5 max-md:top-1 max-md:size-4 max-md:place-items-center max-md:rounded-full max-md:bg-fg max-md:text-[10px] max-md:text-bg",
                  count === 0 && "max-md:hidden",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={count}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.7, ease: EASE }}
              onMouseEnter={openMega}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-bg md:block"
            >
              <div className="container-x grid grid-cols-12 gap-8 py-10">
                <div className="col-span-2">
                  <p className="type-label text-muted">Shop by edit</p>
                </div>
                <ul className="col-span-4 space-y-1">
                  {[
                    {
                      href: "/shop",
                      label: "Shop all",
                      blurb: "Every style, every colour",
                    },
                    ...megaLinks,
                  ].map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: EASE,
                        delay: 0.04 * i,
                      }}
                    >
                      <Link
                        href={l.href}
                        className="group flex items-baseline gap-4 py-1"
                      >
                        <span className="type-heading text-[2rem] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                          {l.label}
                        </span>
                        <span className="text-xs text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {l.blurb}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="col-span-6 grid grid-cols-3 gap-3">
                  {megaTiles.map((t, i) => (
                    <motion.div
                      key={t.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: EASE,
                        delay: 0.1 + i * 0.06,
                      }}
                    >
                      <Link
                        href={t.href}
                        className="group block"
                        data-cursor="View"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface">
                          <Image
                            src={t.image}
                            alt=""
                            fill
                            sizes="16vw"
                            className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-3 flex items-center justify-between text-sm font-medium">
                          {t.label}
                          <ArrowUpRight
                            width={15}
                            className="transition-transform duration-500 group-hover:rotate-45"
                          />
                        </p>
                        <p className="text-xs text-muted">{t.caption}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
