import type { ReactNode } from "react";
import { LineReveal, Reveal } from "@/components/motion";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  index,
  title,
  aside,
  className,
}: {
  eyebrow?: string;
  /** Small section number shown beside the eyebrow, e.g. "02". */
  index?: string;
  /** Each entry renders as its own masked line. */
  title: ReactNode[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container-x grid gap-6 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        {eyebrow && (
          <Reveal y={12}>
            <p className="mb-5 flex items-center gap-3 type-label text-muted">
              {index && <span className="font-mono tracking-normal">({index})</span>}
              {eyebrow}
            </p>
          </Reveal>
        )}
        <h2 className="type-display text-[clamp(2.75rem,6.4vw,6.5rem)]">
          <LineReveal lines={title} />
        </h2>
      </div>
      {aside && (
        <Reveal delay={0.15} className="md:col-span-4 md:justify-self-end md:text-right">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

/** Italic serif accent used inside display headlines. */
export const Accent = ({ children }: { children: ReactNode }) => (
  <span className="font-serif font-normal italic tracking-normal">{children}</span>
);
