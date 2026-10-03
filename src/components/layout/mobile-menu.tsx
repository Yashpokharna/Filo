"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { EASE } from "@/components/motion";
import { CloseIcon, InstagramIcon, ThreadsIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/sheet";
import { nav, site } from "@/lib/site";
import { overlay, useOverlays } from "@/lib/store";
import type { MegaLink } from "./header";

export function MobileMenu({ megaLinks }: { megaLinks: MegaLink[] }) {
  const { menu } = useOverlays();
  const close = () => overlay.close("menu");

  return (
    <Sheet open={menu} onClose={close} side="left" label="Menu" className="max-w-none">
      <div className="flex items-center justify-between px-4 py-4">
        <Wordmark className="h-4 w-auto" />
        <div className="flex items-center">
          <ThemeToggle />
          <button type="button" onClick={close} className="-mr-2 grid size-10 place-items-center rounded-full transition-colors hover:bg-fg/5" aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav aria-label="Mobile" className="flex-1 px-4 pt-6">
        <ul>
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
              >
                <Link href={item.href} onClick={close} className="flex items-baseline justify-between py-3.5">
                  <span className="type-display text-[2.9rem]">{item.label}</span>
                  <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-9"
        >
          <p className="type-label mb-4 text-muted">Shop by edit</p>
          <div className="flex flex-wrap gap-2">
            {megaLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="rounded-full border border-line px-4 py-2 text-sm">
                {l.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </nav>

      <div className="mt-10 flex items-center justify-between border-t border-line px-4 py-6 text-sm text-muted">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <div className="flex gap-3 text-fg">
          <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={site.social.threads} target="_blank" rel="noreferrer" aria-label="Threads">
            <ThreadsIcon />
          </a>
        </div>
      </div>
    </Sheet>
  );
}
