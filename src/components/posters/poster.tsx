import type { CSSProperties, ReactNode } from "react";
import { Monogram } from "@/components/brand";
import Image from "@/components/ui/image";
import { cn } from "@/lib/format";
import type { PosterData } from "@/lib/posters";

/*
 * Every measurement is in container units (cqw) so a poster renders identically
 * as a 260px thumbnail or a full-screen print.
 */

const mono = "font-mono uppercase tracking-[0.08em]";
const display = "type-display";

function Photo({ src, className, sizes = "(min-width:1024px) 30vw, 70vw" }: { src: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("absolute overflow-hidden", className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover/poster:scale-[1.06]"
      />
    </div>
  );
}

function Frame({ poster, children }: { poster: PosterData; children: ReactNode }) {
  return (
    <>
      <div className={cn("absolute inset-x-[5%] top-[3.5%] flex items-center justify-between text-[2.1cqw]", mono)}>
        <span className="flex items-center gap-[1.2cqw]">
          <Monogram className="h-[3.2cqw] w-auto" /> FILO — Poster series
        </span>
        <span>No. {poster.no}</span>
      </div>
      <div className="absolute inset-x-[5%] top-[7%] h-px bg-current opacity-30" />
      {children}
      <div className={cn("absolute inset-x-[5%] bottom-[3%] flex items-center justify-between text-[2.1cqw]", mono)}>
        <span>filoclothing.com</span>
        <span>Bhilwara · IN</span>
        <span>2026</span>
      </div>
    </>
  );
}

function Specs({ items, className }: { items: [string, string][]; className?: string }) {
  return (
    <dl className={cn("absolute text-[2.3cqw]", mono, className)}>
      {items.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-[3cqw] border-t border-current/30 py-[1.1cqw]">
          <dt className="opacity-60">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const layouts: Record<PosterData["slug"], (p: PosterData) => ReactNode> = {
  "no-iron": (p) => (
    <>
      <h3 className={cn(display, "absolute left-[5%] top-[10%] text-[19cqw]")}>
        No iron.
        <br />
        <span className="font-serif italic font-normal tracking-normal">No fuss.</span>
      </h3>
      <Photo src={p.images[0]} className="bottom-[8%] right-[5%] h-[50%] w-[57%]" />
      <Specs
        className="bottom-[8%] left-[5%] w-[31%]"
        items={[
          ["Style", "Ease"],
          ["Fabric", "Wrinkle-free"],
          ["Iron", "Never"],
          ["Wash", "Easy"],
          ["Wear", "All day"],
          ["Price", "₹1,777"],
        ]}
      />
    </>
  ),

  "linen-season": (p) => (
    <>
      <div
        className="absolute left-1/2 top-[14%] aspect-square w-[80%] -translate-x-1/2 rounded-full transition-transform duration-[1.6s] ease-out-expo group-hover/poster:scale-[1.04]"
        style={{ background: p.accent }}
      />
      <h3 className="absolute left-[5%] top-[9%] font-serif text-[23cqw] italic leading-none">Linen</h3>
      <p
        className={cn(display, "absolute right-[3%] top-[30%] text-[13cqw] [writing-mode:vertical-rl]")}
      >
        Season
      </p>
      <Photo src={p.images[0]} className="bottom-[9%] left-1/2 h-[55%] w-[50%] -translate-x-1/2 rounded-t-full" />
      <p className={cn("absolute bottom-[9%] left-[5%] w-[20%] text-[2.2cqw] leading-relaxed", mono)}>
        100% linen
        <br />
        Breathable
        <br />
        Lightweight
        <br />
        Naturally soft
      </p>
      <p className="absolute bottom-[9%] right-[5%] w-[20%] text-right font-serif text-[4cqw] italic leading-tight">
        For long, hot afternoons.
      </p>
    </>
  ),

  "nine-to-five": (p) => (
    <>
      <span
        className={cn(display, "absolute -left-[3%] top-[11%] text-[86cqw] text-transparent")}
        style={{ WebkitTextStroke: `0.25cqw ${p.fg}` } as CSSProperties}
        aria-hidden
      >
        9
      </span>
      <span
        className={cn(display, "absolute -right-[3%] top-[11%] text-[86cqw] text-transparent")}
        style={{ WebkitTextStroke: `0.25cqw ${p.fg}` } as CSSProperties}
        aria-hidden
      >
        5
      </span>
      <Photo src={p.images[0]} className="left-1/2 top-[16%] h-[56%] w-[42%] -translate-x-1/2" />
      <h3 className={cn(display, "absolute bottom-[8%] left-[5%] text-[10.5cqw]")}>
        Nine to five,
        <br />
        <span className="font-serif italic font-normal tracking-normal">and beyond.</span>
      </h3>
      <p className={cn("absolute bottom-[8.5%] right-[5%] text-right text-[2.2cqw] leading-relaxed", mono)}>
        FILO 9TO5
        <br />
        Smart corporate fit
        <br />
        2-way stretch
      </p>
    </>
  ),

  "go-further": (p) => (
    <>
      <h3 className={cn(display, "absolute left-[5%] top-[10%] text-[24cqw]")}>
        Go
        <br />
        further.
      </h3>
      <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M8 70 C 24 72, 32 62, 44 60 S 66 54, 72 40 S 86 25, 94 22"
          fill="none"
          stroke="currentColor"
          strokeDasharray="1.4 1.4"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 1.2 }}
        />
        <circle cx="8" cy="70" r="1.1" fill="currentColor" />
        <circle cx="94" cy="22" r="1.1" fill="currentColor" />
      </svg>
      <p className={cn("absolute left-[5%] top-[52%] text-[2.1cqw]", mono)}>Start · 25.35°N 74.63°E</p>
      <p className={cn("absolute right-[5%] top-[12%] text-right text-[2.1cqw]", mono)}>→ Wherever next</p>
      <div className="absolute bottom-[11%] right-[5%] h-[43%] w-[44%] bg-white shadow-[0_2cqw_5cqw_rgb(0_0_0/0.18)]">
        <Photo src={p.images[0]} className="inset-[3%]" />
      </div>
      <Specs
        className="bottom-[11%] left-[5%] w-[40%]"
        items={[
          ["Style", "Travel Pant"],
          ["Fabric", "4-way lycra"],
          ["Waist", "Elastic"],
          ["For", "Long journeys"],
        ]}
      />
    </>
  ),

  stretch: (p) => (
    <>
      <div className="absolute inset-x-[5%] top-[9%] font-bold uppercase leading-[0.8] tracking-[-0.02em]">
        {[62, 94, 125].map((w, i) => (
          <p
            key={w}
            // Hovering swaps the widths, so the word visibly stretches.
            style={{ "--w": w, "--w-hover": [125, 94, 62][i] } as CSSProperties}
            className="text-[13cqw] transition-[font-variation-settings] duration-700 ease-out-expo [font-variation-settings:'wdth'_var(--w)] group-hover/poster:[font-variation-settings:'wdth'_var(--w-hover)]"
          >
            Stretch
          </p>
        ))}
      </div>
      <Photo src={p.images[0]} className="bottom-[9%] left-[5%] h-[47%] w-[52%]" />
      <p className="absolute bottom-[24%] right-[5%] w-[34%] text-right font-serif text-[7cqw] italic leading-[1.05]">
        Stretch, don’t stress.
      </p>
      <p className={cn("absolute bottom-[9%] right-[5%] text-right text-[2.2cqw] leading-relaxed", mono)}>
        Korean Pant
        <br />
        Imperial Navy
        <br />
        2-way stretch
      </p>
    </>
  ),

  founders: (p) => (
    <>
      <h3 className="absolute left-[6%] top-[9%] leading-[0.95]">
        <span className="block font-serif text-[15cqw] italic">Founder’s</span>
        <span className={cn(display, "block text-[15cqw]")}>Edition</span>
      </h3>
      <Photo src={p.images[0]} className="left-[6%] top-[36%] h-[45%] w-[42%] rounded-t-full" sizes="(min-width:1024px) 15vw, 40vw" />
      <Photo src={p.images[1]} className="right-[6%] top-[30%] h-[45%] w-[42%] rounded-t-full" sizes="(min-width:1024px) 15vw, 40vw" />
      <p className={cn("absolute left-[6%] top-[83%] text-[2.2cqw]", mono)}>Rose Blush</p>
      <p className={cn("absolute right-[6%] top-[77%] text-right text-[2.2cqw]", mono)}>Olive Mosh</p>
      <p className="absolute bottom-[8%] right-[6%] text-right">
        <span className="block font-serif text-[5cqw] italic leading-none">Satyam &amp; Shivam Goyal</span>
        <span className={cn("mt-[1cqw] block text-[2cqw] opacity-70", mono)}>Founders, FILO</span>
      </p>
    </>
  ),
};

export function Poster({ poster, className }: { poster: PosterData; className?: string }) {
  return (
    <div
      className={cn(
        "group/poster @container relative aspect-[5/7] w-full overflow-hidden shadow-[0_1px_0_rgb(0_0_0/0.04),0_24px_60px_-30px_rgb(0_0_0/0.45)]",
        className,
      )}
      style={{ background: poster.bg, color: poster.fg }}
      role="img"
      aria-label={`FILO poster No. ${poster.no}: ${poster.title}`}
    >
      <Frame poster={poster}>{layouts[poster.slug](poster)}</Frame>
    </div>
  );
}
