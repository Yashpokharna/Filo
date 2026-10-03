"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { Sheet } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { cartActions, checkoutUrl, MAX_QTY, overlay, useCart, useOverlays } from "@/lib/store";

export function CartDrawer() {
  const { cart: open } = useOverlays();
  const { lines, count, subtotal } = useCart();
  const close = () => overlay.close("cart");

  return (
    <Sheet open={open} onClose={close} label="Shopping bag" className="max-w-[460px]">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <p className="text-sm font-medium">
          Your bag <span className="text-muted">({count})</span>
        </p>
        <button type="button" onClick={close} className="-mr-2 grid size-10 place-items-center" aria-label="Close bag">
          <CloseIcon />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
          <p className="type-display text-5xl">Your bag is empty</p>
          <p className="max-w-xs text-sm text-muted">
            Start with FILO Ease — the wrinkle-free trouser that needs no iron.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <ButtonLink href="/products/filo-ease" onClick={close} data-autofocus>
              Shop FILO Ease
            </ButtonLink>
            <ButtonLink href="/shop" onClick={close} variant="outline">
              Browse all
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex-1 px-6">
            <AnimatePresence initial={false}>
              {lines.map((line, i) => (
                <motion.li
                  key={line.variantId}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: i * 0.04 } }}
                  exit={{ opacity: 0, x: 24, transition: { duration: 0.3 } }}
                  className="flex gap-4 border-b border-line py-5"
                >
                  <Link
                    href={`/products/${line.handle}`}
                    onClick={close}
                    className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-sm bg-surface"
                  >
                    <Image src={line.image} alt="" fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/products/${line.handle}`} onClick={close} className="text-sm font-medium hover:underline">
                          {line.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {line.color} · Waist {line.size}
                        </p>
                      </div>
                      <p className="text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex h-9 items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="grid size-9 place-items-center"
                          onClick={() => cartActions.update(line.variantId, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="grid size-9 place-items-center disabled:opacity-30"
                          disabled={line.quantity >= MAX_QTY}
                          onClick={() => cartActions.update(line.variantId, line.quantity + 1)}
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => cartActions.remove(line.variantId)}
                        className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="sticky bottom-0 border-t border-line bg-bg px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="type-heading text-2xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Shipping calculated at checkout. {site.promises[0]}.</p>
            <a
              href={checkoutUrl(lines)}
              className="group mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-fg text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Checkout
              <ArrowRight width={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full text-center text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}
