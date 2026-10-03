import { Wordmark } from "@/components/brand";
import Image from "@/components/ui/image";
import { formatPrice } from "@/lib/format";

type Card = { image: string; name: string; color: string; price: number };

/** A drawn phone showing the FILO app's home screen (static artwork, not a screenshot). */
export function PhoneMockup({ hero, cards }: { hero: string; cards: Card[] }) {
  return (
    <div className="relative mx-auto w-[min(78vw,320px)]">
      {/* Body */}
      <div className="relative aspect-[9/19.5] rounded-[3rem] bg-[#111] p-[11px] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.55),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-[#f5f4f1] text-[#141414]">
          {/* Status bar + dynamic island */}
          <div className="relative flex h-10 shrink-0 items-center justify-between px-7 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#111]" />
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-4 rounded-[3px] border border-current" />
            </span>
          </div>
          {/* App bar */}
          <div className="flex h-10 shrink-0 items-center justify-center border-b border-black/10">
            <Wordmark className="h-3 w-auto" />
          </div>
          {/* Hero */}
          <div className="relative mx-3 mt-3 aspect-[4/4.4] shrink-0 overflow-hidden rounded-xl bg-[#e9e7e2]">
            <Image src={hero} alt="" fill sizes="300px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <p className="absolute bottom-3 left-3 type-display text-[1.6rem] leading-none text-white">
              Trousers for
              <br />
              <em>every hour.</em>
            </p>
          </div>
          {/* Product row */}
          <p className="mx-3 mt-3 text-[9px] font-medium uppercase tracking-[0.14em] text-black/50">Just dropped</p>
          <div className="mt-2 flex gap-2 px-3">
            {cards.slice(0, 2).map((c) => (
              <div key={c.image} className="min-w-0 flex-1">
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#e9e7e2]">
                  <Image src={c.image} alt="" fill sizes="140px" className="object-cover" />
                </div>
                <p className="mt-1 truncate text-[9px] font-medium">{c.name}</p>
                <p className="truncate text-[8px] text-black/50">
                  {c.color} · {formatPrice(c.price)}
                </p>
              </div>
            ))}
          </div>
          {/* Tab bar */}
          <div className="mt-auto flex h-14 shrink-0 items-start justify-around border-t border-black/10 bg-white/80 pt-2 text-[8px] font-medium text-black/45">
            {["Home", "Shop", "Gallery", "Search", "Bag"].map((t, i) => (
              <span key={t} className={i === 0 ? "text-black" : undefined}>
                <span className={`mx-auto mb-1 block size-4 rounded-[5px] ${i === 0 ? "bg-black" : "bg-black/20"}`} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Side buttons */}
      <span className="absolute -left-[3px] top-[22%] h-12 w-[3px] rounded-l bg-[#222]" />
      <span className="absolute -right-[3px] top-[28%] h-16 w-[3px] rounded-r bg-[#222]" />
    </div>
  );
}
