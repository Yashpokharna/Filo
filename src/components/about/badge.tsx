import { Monogram } from "@/components/brand";
import { cn } from "@/lib/format";

/**
 * Circular, slowly rotating text stamp with the monogram at its centre.
 * Pass positioning (e.g. "absolute …") via className; it defaults to relative.
 */
export function SpinningBadge({ text, className = "relative" }: { text: string; className?: string }) {
  return (
    <div className={cn("grid size-32 place-items-center rounded-full bg-bg text-fg md:size-40", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite]" aria-hidden>
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        {/* textLength stretches the phrase to exactly one lap of the circle. */}
        <text className="fill-current font-mono text-[7px] uppercase">
          <textPath href="#badge-circle" textLength={230} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <Monogram className="h-9 w-auto md:h-11" />
      <span className="sr-only">{text}</span>
    </div>
  );
}
