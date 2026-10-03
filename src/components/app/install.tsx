"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Monogram } from "@/components/brand";
import { QrCode } from "@/components/app/qr-code";
import { EASE } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { BagIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/format";
import { closeInstallGuide, initInstall, installApp, useInstall } from "@/lib/install";
import { overlay, useCart } from "@/lib/store";

/* ----------------------------------------------------------------- shell -- */

/**
 * Runs once per page load: wires install events, registers the service
 * worker (production only, so dev never serves stale code), flags app mode
 * on <html>, and opens the bag for the "Your bag" home-screen shortcut.
 */
export function AppShell() {
  const { standalone } = useInstall();

  useEffect(() => initInstall(), []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-standalone", standalone);
  }, [standalone]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("bag") === "open") {
      overlay.open("cart");
      url.searchParams.delete("bag");
      window.history.replaceState(null, "", url);
    }
  }, []);

  return (
    <>
      <InstallGuide />
      <AppBanner />
      <AppTabBar />
    </>
  );
}

/* ------------------------------------------------------------- app icon -- */

export function AppIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-[22%] bg-[#141414] text-[#ecebe6] shadow-sm", className)}
    >
      <Monogram className="h-[56%] w-auto translate-x-[3%]" />
    </span>
  );
}

/* --------------------------------------------------------------- button -- */

/** "Get the app": native one-tap install where possible, guided steps otherwise. */
export function InstallButton({
  className,
  variant = "solid",
  children = "Get the app",
}: {
  className?: string;
  variant?: "solid" | "outline" | "light" | "glass";
  children?: ReactNode;
}) {
  const { standalone, installed } = useInstall();
  if (standalone || installed) {
    return (
      <p className={cn("inline-flex h-12 items-center gap-2 text-sm text-muted", className)}>
        <span className="size-2 rounded-full bg-emerald-500" />{" "}
        {installed ? "Installed — find FILO on your home screen" : "You’re using the FILO app"}
      </p>
    );
  }
  return (
    <Button variant={variant} arrow className={className} onClick={() => installApp()}>
      {children}
    </Button>
  );
}

/* ---------------------------------------------------------------- guide -- */

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-line py-4 last:border-0">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-fg font-mono text-xs text-bg">{n}</span>
      <span className="pt-0.5 text-[0.9375rem] leading-relaxed">{children}</span>
    </li>
  );
}

const ShareGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="mx-1 inline -translate-y-0.5"
    aria-label="Share"
  >
    <path
      d="M12 15V3M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Step-by-step install for browsers without a one-tap prompt. */
function InstallGuide() {
  const { guideOpen, platform } = useInstall();

  return (
    <Sheet
      open={guideOpen}
      onClose={closeInstallGuide}
      side={platform === "desktop" ? "right" : "bottom"}
      label="Install the FILO app"
    >
      <div className="flex items-center justify-between px-6 pb-2 pt-5">
        <p className="type-label text-muted">Install the app</p>
        <button
          type="button"
          onClick={closeInstallGuide}
          className="-mr-2 grid size-10 place-items-center rounded-full hover:bg-fg/5"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="px-6 pb-8">
        <div className="flex items-center gap-4">
          <AppIcon className="size-14" />
          <div>
            <p className="type-heading text-2xl">FILO</p>
            <p className="text-sm text-muted">Trousers for every hour</p>
          </div>
        </div>

        {platform === "ios" && (
          <>
            <p className="mt-6 text-sm text-muted">Two taps in Safari and FILO lives on your home screen.</p>
            <ol className="mt-2">
              <Step n={1}>
                Tap the <strong>Share</strong> button <ShareGlyph /> in Safari’s toolbar.
              </Step>
              <Step n={2}>
                Scroll and choose <strong>Add to Home Screen</strong>.
              </Step>
              <Step n={3}>
                Tap <strong>Add</strong> — FILO opens full-screen from its own icon.
              </Step>
            </ol>
          </>
        )}

        {platform === "android" && (
          <>
            <p className="mt-6 text-sm text-muted">Install FILO from your browser menu.</p>
            <ol className="mt-2">
              <Step n={1}>
                Tap the <strong>⋮ menu</strong> in your browser.
              </Step>
              <Step n={2}>
                Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
              </Step>
              <Step n={3}>Confirm — FILO appears with your other apps.</Step>
            </ol>
          </>
        )}

        {platform === "desktop" && (
          <>
            <p className="mt-6 text-sm text-muted">Get FILO on your phone — scan with your camera.</p>
            <div className="mt-5 flex items-center gap-5 rounded-2xl bg-surface p-4">
              <QrCode path="/app" className="size-28 shrink-0 overflow-hidden rounded-lg" />
              <p className="text-sm leading-relaxed text-muted">
                Opens the FILO app page on your phone, where you can install it in a couple of taps.
              </p>
            </div>
            <p className="mt-7 type-label text-muted">Or on this computer</p>
            <ol className="mt-1">
              <Step n={1}>
                In <strong>Chrome</strong> or <strong>Edge</strong>, click the install icon at the right of the address
                bar.
              </Step>
              <Step n={2}>
                In <strong>Safari</strong> on Mac, choose <strong>File → Add to Dock</strong>.
              </Step>
            </ol>
          </>
        )}
      </div>
    </Sheet>
  );
}

/* --------------------------------------------------------------- banner -- */

const DISMISS_KEY = "filo-app-banner-dismissed";
const DISMISS_DAYS = 14;

/**
 * Gentle install nudge on phones: appears after a short browse, never on
 * product pages (which have their own bottom bar) or the app page, and stays
 * away for two weeks once dismissed.
 */
function AppBanner() {
  const pathname = usePathname();
  const { standalone, installed, platform } = useInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (standalone || installed || platform === "desktop") return;
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      if (Date.now() - at < DISMISS_DAYS * 864e5) return;
    } catch {}
    const t = setTimeout(() => setShow(true), 9000);
    return () => clearTimeout(t);
  }, [standalone, installed, platform]);

  const hiddenHere = pathname.startsWith("/products/") || pathname === "/app";
  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  return (
    <AnimatePresence>
      {show && !hiddenHere && !standalone && !installed && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: "0%" }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 md:hidden"
          role="region"
          aria-label="Get the FILO app"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-elev/95 p-3 shadow-xl backdrop-blur-xl">
            <AppIcon className="size-11" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">The FILO app</p>
              <p className="truncate text-xs text-muted">Full-screen, quick, on your home screen</p>
            </div>
            <button
              type="button"
              onClick={() => installApp()}
              className="h-9 shrink-0 rounded-full bg-fg px-4 text-xs font-medium text-bg"
            >
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-fg/5"
              aria-label="Dismiss"
            >
              <CloseIcon width={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------- tab bar -- */

const TABS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/shop", label: "Shop", match: (p: string) => p.startsWith("/shop") || p.startsWith("/products") },
  { href: "/posters", label: "Gallery", match: (p: string) => p.startsWith("/posters") },
];

const TabGlyph = ({ name }: { name: string }) => {
  const common = {
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "Home")
    return (
      <svg viewBox="0 0 24 24" {...common} aria-hidden>
        <path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z" />
      </svg>
    );
  if (name === "Shop")
    return (
      <svg viewBox="0 0 24 24" {...common} aria-hidden>
        <path d="M8 3h8l1 6-2 12h-2l-1-8-1 8H9L7 9z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...common} aria-hidden>
      <rect x="5" y="4" width="14" height="17" rx="1" />
      <path d="M12 1.5 9 4M12 1.5 15 4" />
    </svg>
  );
};

/** Native-style bottom tabs, only inside the installed app on phones. */
function AppTabBar() {
  const pathname = usePathname();
  const { standalone } = useInstall();
  const { count } = useCart();
  if (!standalone) return null;

  const item = "flex flex-1 flex-col items-center gap-1 pt-2 text-[10px] font-medium tracking-wide";
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-bg/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      {TABS.map((t) => {
        const on = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(item, on ? "text-fg" : "text-muted")}
            aria-current={on ? "page" : undefined}
          >
            <TabGlyph name={t.label} />
            {t.label}
          </Link>
        );
      })}
      <button type="button" onClick={() => overlay.open("search")} className={cn(item, "text-muted")}>
        <SearchIcon width={22} height={22} />
        Search
      </button>
      <button type="button" onClick={() => overlay.open("cart")} className={cn(item, "relative text-muted")}>
        <BagIcon width={22} height={22} />
        Bag
        {count > 0 && (
          <span className="absolute left-1/2 top-1 ml-2 grid min-w-4 place-items-center rounded-full bg-fg px-1 text-[9px] leading-4 text-bg">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
