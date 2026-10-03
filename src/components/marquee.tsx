import { Monogram } from "@/components/brand";

/** Infinite ticker; content is duplicated so the loop is seamless. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {[...items, ...items].map((item, i) => (
        <li key={i} className="flex items-center gap-10 pr-10">
          <span className="type-display text-4xl md:text-5xl">{item}</span>
          <Monogram className="h-5 w-auto text-muted" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="flex overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
