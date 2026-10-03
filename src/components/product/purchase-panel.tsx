"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { EASE } from "@/components/motion";
import { SizeGuide } from "@/components/product/size-guide";
import Image from "@/components/ui/image";
import { ChevronDown, MinusIcon, PlusIcon, ReturnIcon, RulerIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";
import type { Product } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import { cartActions, checkoutUrl, MAX_QTY } from "@/lib/store";
import { site } from "@/lib/site";

type Sibling = { handle: string; color: string; swatch: string; image: string; available: boolean };

export function PurchasePanel({ product, siblings }: { product: Product; siblings: Sibling[] }) {
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [nudge, setNudge] = useState(false);
  const [guide, setGuide] = useState(false);
  const cta = useRef<HTMLDivElement>(null);
  const ctaVisible = useInView(cta, { margin: "0px 0px -40px 0px" });

  const chosen = product.sizes.find((s) => s.size === size);

  const requireSize = () => {
    if (chosen) return true;
    setNudge(true);
    document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setNudge(false), 1600);
    return false;
  };

  const add = () => {
    if (!requireSize() || !chosen) return;
    cartActions.add(
      {
        variantId: chosen.variantId,
        handle: product.handle,
        name: product.name,
        color: product.color,
        size: chosen.size,
        price: product.price,
        image: product.images[0].src,
      },
      qty,
    );
  };

  const buyNow = () => {
    if (!requireSize() || !chosen) return;
    window.location.href = checkoutUrl([{ variantId: chosen.variantId, quantity: qty }]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-1.5">
        {product.isNew && <Tag>New</Tag>}
        {product.edition && <Tag dark>{product.edition}</Tag>}
        <Tag>{product.fabric}</Tag>
      </div>

      <h1 className="mt-5 type-display text-[clamp(2.75rem,4.4vw,4.25rem)] leading-[0.95] tracking-[-0.02em]">
        {product.name}
      </h1>
      <p className="mt-2 text-muted">{product.color}</p>
      <p className="mt-6 text-xl tabular-nums">
        {product.compareAtPrice && (
          <s className="mr-2 text-base text-muted">{formatPrice(product.compareAtPrice)}</s>
        )}
        {formatPrice(product.price)}
      </p>

      {siblings.length > 1 && (
        <div className="mt-9">
          <p className="mb-3 text-sm">
            Colour <span className="text-muted">— {product.color}</span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {siblings.map((s) => {
              const current = s.handle === product.handle;
              return (
                <li key={s.handle}>
                  <Link
                    href={`/products/${s.handle}`}
                    scroll={false}
                    aria-label={`${s.color}${s.available ? "" : " (sold out)"}`}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "group relative block h-[72px] w-14 overflow-hidden rounded-md bg-surface ring-offset-2 ring-offset-bg transition",
                      current ? "ring-1 ring-fg" : "hover:ring-1 hover:ring-muted",
                    )}
                    title={s.color}
                  >
                    <Image src={s.image} alt="" fill sizes="56px" className={cn("object-cover", !s.available && "opacity-40")} />
                    <span
                      className="absolute bottom-1 right-1 size-2.5 rounded-full ring-1 ring-white"
                      style={{ background: s.swatch }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div id="size-picker" className="mt-9">
        <div className="mb-3 flex items-center justify-between text-sm">
          <p>
            Waist size{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={size ?? (nudge ? "nudge" : "none")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={nudge ? "text-red-600 dark:text-red-400" : "text-muted"}
              >
                — {size ? `${size}″` : nudge ? "please select a size" : "select"}
              </motion.span>
            </AnimatePresence>
          </p>
          <button
            type="button"
            onClick={() => setGuide(true)}
            className="flex items-center gap-1.5 text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            <RulerIcon width={16} /> Size guide
          </button>
        </div>
        <motion.div
          className="grid grid-cols-7 gap-1.5"
          animate={nudge ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          role="radiogroup"
          aria-label="Waist size"
        >
          {product.sizes.map((s) => (
            <button
              key={s.variantId}
              type="button"
              role="radio"
              aria-checked={size === s.size}
              disabled={!s.available}
              onClick={() => setSize(s.size)}
              className={cn(
                "relative grid h-12 place-items-center rounded-full border text-sm tabular-nums transition-colors duration-300",
                size === s.size ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
                !s.available && "cursor-not-allowed text-muted line-through hover:border-line",
              )}
            >
              {s.size}
            </button>
          ))}
        </motion.div>
      </div>

      <div ref={cta} className="mt-6 flex gap-2">
        <div className="flex h-14 items-center rounded-full border border-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-12 place-items-center"
            aria-label="Decrease quantity"
          >
            <MinusIcon width={14} />
          </button>
          <span className="w-5 text-center text-sm tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            className="grid size-12 place-items-center"
            aria-label="Increase quantity"
          >
            <PlusIcon width={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!product.available}
          className="group/btn relative h-14 flex-1 overflow-hidden rounded-full bg-fg text-sm font-medium tracking-wide text-bg transition-colors hover:opacity-90 disabled:bg-muted"
        >
          {product.available ? (
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">
                Add to bag · {formatPrice(product.price * qty)}
              </span>
              <span className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0">
                Add to bag · {formatPrice(product.price * qty)}
              </span>
            </span>
          ) : (
            "Sold out"
          )}
        </button>
      </div>
      {product.available && (
        <button
          type="button"
          onClick={buyNow}
          className="mt-2 h-14 rounded-full border border-fg text-sm font-medium tracking-wide transition-colors duration-500 hover:bg-fg hover:text-bg"
        >
          Buy it now
        </button>
      )}

      <ul className="mt-8 grid gap-3 rounded-2xl bg-surface p-5 text-sm">
        <li className="flex items-center gap-3">
          <TruckIcon className="shrink-0 text-muted" /> {site.promises[0]} · Delivery across India
        </li>
        <li className="flex items-center gap-3">
          <ReturnIcon className="shrink-0 text-muted" /> {site.promises[1]} on unworn pieces
        </li>
        <li className="flex items-center gap-3">
          <ShieldIcon className="shrink-0 text-muted" /> Secure, encrypted checkout
        </li>
      </ul>

      <div className="mt-10 divide-y divide-line border-y border-line">
        <Accordion title="Details" defaultOpen>
          <p>{product.lead}</p>
          {product.highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-fg/50" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </Accordion>
        <Accordion title="Size & fit">
          <p>
            FILO sizes follow your waist measurement in inches (28–40). Measure around your natural waist where you
            wear your trousers, and if you are between sizes, choose the larger one.
          </p>
          <button type="button" onClick={() => setGuide(true)} className="mt-3 underline underline-offset-4">
            Open the size guide
          </button>
        </Accordion>
        <Accordion title="Shipping & returns">
          <p>
            Orders are processed within 24–48 working hours (excluding Sundays and public holidays) and shipped across
            India with tracking.
          </p>
          <p className="mt-3">
            Returns are accepted within 5 days of delivery for unused, unwashed items with original tags and packaging.
            Email {site.email} with your order number to start a return. Sale items are final.
          </p>
          <Link href="/policies/refund-policy" className="mt-3 inline-block underline underline-offset-4">
            Read the full policy
          </Link>
        </Accordion>
      </div>

      {/* Mobile sticky purchase bar */}
      <AnimatePresence>
        {!ctaVisible && product.available && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-bg/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted">
                {formatPrice(product.price)} · {size ? `Waist ${size}` : "Select size"}
              </p>
            </div>
            <button type="button" onClick={add} className="h-12 rounded-full bg-fg px-6 text-sm font-medium text-bg">
              Add to bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuide open={guide} onClose={() => setGuide(false)} sizes={product.sizes.map((s) => s.size)} />
    </div>
  );
}

function Tag({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
        dark ? "bg-fg text-bg" : "bg-surface text-fg",
      )}
    >
      {children}
    </span>
  );
}

function Accordion({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium"
      >
        {title}
        <ChevronDown width={16} className={cn("transition-transform duration-500 ease-out-expo", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-relaxed text-fg/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
