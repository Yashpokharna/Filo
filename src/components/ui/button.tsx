import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/format";

type Variant = "solid" | "outline" | "light" | "glass";

const variants: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:opacity-90",
  outline: "border border-fg/25 text-fg hover:border-fg hover:bg-fg hover:text-bg",
  light: "bg-white text-black hover:bg-white/90",
  glass: "border border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black",
};

const shell =
  "group/btn relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-6 text-[0.8125rem] font-medium tracking-[0.01em] transition-[background-color,color,border-color,opacity] duration-500 ease-out-expo disabled:pointer-events-none disabled:opacity-40";

/** Label that rolls up to a duplicate on hover. */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

const Arrow = () => (
  <span className="relative -mr-1 grid size-4 overflow-hidden" aria-hidden>
    <ArrowRight
      width={16}
      height={16}
      className="transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-5"
    />
    <ArrowRight
      width={16}
      height={16}
      className="absolute -translate-x-5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0"
    />
  </span>
);

export function ButtonLink({
  variant = "solid",
  arrow = false,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link className={cn(shell, variants[variant], className)} {...props}>
      <Roll>{children}</Roll>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "solid",
  arrow = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={cn(shell, variants[variant], className)} {...props}>
      <Roll>{children}</Roll>
      {arrow && <Arrow />}
    </button>
  );
}

/** Understated text link with an underline that redraws on hover. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link className={cn("group/tl relative inline-flex items-center gap-1.5 pb-1 text-sm font-medium", className)} {...props}>
      {children}
      <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current transition-transform duration-500 ease-out-expo group-hover/tl:origin-left group-hover/tl:scale-x-0" />
    </Link>
  );
}
