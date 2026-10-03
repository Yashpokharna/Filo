import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AboutHero } from "@/components/about/about-hero";
import { SpinningBadge } from "@/components/about/badge";
import { StepRail } from "@/components/about/step-rail";
import { Tape } from "@/components/about/tape";
import { Thread } from "@/components/about/thread";
import { Monogram } from "@/components/brand";
import { Film } from "@/components/home/film";
import { LineReveal, MaskReveal, Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { getProducts } from "@/lib/catalog";
import { cn } from "@/lib/format";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Our Story — The Thread",
  description:
    "Filo: Italian for thread. Follow one through the making of a FILO trouser — from fabric and fit to the cut, the stitch and the wear. Founded by Satyam Goyal and Shivam Goyal.",
  alternates: { canonical: "/about" },
};

type Chapter = {
  id: string;
  step: string;
  title: ReactNode[];
  body: ReactNode;
  media: ReactNode;
  side: "left" | "right";
  aside?: ReactNode;
};

const VALUES = ["Confidence", "Ambition", "Discipline", "Elegance"];

function ChapterBlock({ chapter, index }: { chapter: Chapter; index: number }) {
  const mediaLeft = chapter.side === "left";
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="relative grid items-center gap-10 py-20 md:h-[110svh] md:grid-cols-12 md:gap-0 md:py-0"
    >
      {/* Oversized step word, set behind the copy. */}
      <span
        aria-hidden
        className={cn(
          "type-display pointer-events-none absolute bottom-[6%] hidden text-[15vw] leading-none text-fg/[0.04] md:block",
          mediaLeft ? "right-0" : "left-0",
        )}
      >
        {chapter.step}
      </span>

      <div
        className={cn(
          "relative z-10 md:col-span-5",
          mediaLeft ? "md:col-start-1 md:row-start-1" : "md:col-start-8 md:row-start-1",
        )}
      >
        <MaskReveal className="relative rounded-sm">{chapter.media}</MaskReveal>
        {chapter.aside}
      </div>

      <div
        className={cn("relative z-10 md:col-span-4 md:row-start-1", mediaLeft ? "md:col-start-8" : "md:col-start-2")}
      >
        <Reveal y={12}>
          <p className="mb-5 flex items-center gap-3 type-label text-muted">
            <span className="font-mono tracking-normal">Chapter {String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-current" />
            {chapter.step}
          </p>
        </Reveal>
        <h2 id={`${chapter.id}-title`} className="type-display text-[clamp(2.75rem,5vw,5.25rem)]">
          <LineReveal lines={chapter.title} />
        </h2>
        <Reveal delay={0.15}>
          <div className="mt-7 max-w-md space-y-4 leading-relaxed text-muted">{chapter.body}</div>
        </Reveal>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  const all = await getProducts();
  const img = (handle: string, i = 0) =>
    (all.find((p) => p.handle === handle) ?? all[0]).images[i]?.src ?? all[0].images[0].src;
  const styles = new Set(all.map((p) => p.family)).size;
  const sizes = new Set(all.flatMap((p) => p.sizes.map((s) => s.size))).size;

  const chapters: Chapter[] = [
    {
      id: "thread",
      step: "Thread",
      side: "left",
      title: ["It starts", <em key="b">with a thread.</em>],
      body: (
        <>
          <p>
            FILO is a premium Indian apparel brand founded by Satyam Goyal and Shivam Goyal, with its studio in
            Bhilwara, Rajasthan — a city known across India for its textiles.
          </p>
          <p>
            Fabric comes first: linen that breathes, stretch that recovers its shape, weaves that refuse to wrinkle.
            Everything after is built on that choice.
          </p>
        </>
      ),
      media: (
        <div className="relative aspect-[4/5]">
          <Image
            src="/media/about-detail.webp"
            alt="Close detail of a FILO trouser"
            fill
            sizes="(min-width:768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ),
    },
    {
      id: "measure",
      step: "Measure",
      side: "right",
      title: ["Measured", <em key="b">by the inch.</em>],
      body: (
        <p>
          A trouser is only as good as its fit. Every FILO style is cut in waist sizes from 28 to 40, sized by the inch
          — so you buy your number, not a guess. Scroll, and the tape reads them all.
        </p>
      ),
      media: <Tape />,
    },
    {
      id: "cut",
      step: "Cut",
      side: "left",
      title: ["Silhouette", <em key="b">first.</em>],
      body: (
        <p>
          Before a single cut, we decide how a pair should fall — the clean, relaxed line of the Korean Pant, the easy
          drape of linen, the sharp break of tailoring. Pattern first, then precision.
        </p>
      ),
      media: (
        <div className="relative aspect-[4/5] bg-black">
          <Film src="/media/film-craft.mp4" poster="/media/film-craft-poster.webp" />
        </div>
      ),
    },
    {
      id: "stitch",
      step: "Stitch",
      side: "right",
      title: ["Made to be worn", <em key="b">on repeat.</em>],
      body: (
        <p>
          Construction is where quality hides. Reinforced stitching, structured waistbands, buckle details and elastic
          for the long haul — built for durability and fit, for the hundredth wear as much as the first.
        </p>
      ),
      media: (
        <div className="relative aspect-[4/5] bg-white">
          <Image
            src={img("filo-buckle-pants-style-1")}
            alt="Buckle waistband detail on FILO tailored trousers"
            fill
            sizes="(min-width:768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ),
    },
    {
      id: "press",
      step: "Press",
      side: "left",
      title: ["Then we made", <em key="b">the iron optional.</em>],
      body: (
        <p>
          Pressing is the final step in tailoring — so we made it one you can skip. FILO Ease is wrinkle-free: no iron
          required, easy to wash and sharp from the first meeting to the last train home.
        </p>
      ),
      media: (
        <div className="relative aspect-[4/5]">
          <Image
            src={img("filo-ease")}
            alt="FILO Ease wrinkle-free trousers in Coffee"
            fill
            sizes="(min-width:768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ),
      aside: (
        <SpinningBadge
          text="Wrinkle-free · No iron · Easy wash · "
          className="absolute -bottom-10 -right-6 z-20 shadow-xl md:-right-12"
        />
      ),
    },
    {
      id: "wear",
      step: "Wear",
      side: "right",
      title: ["An extension", <em key="b">of self.</em>],
      body: (
        <>
          <p>
            FILO believes fashion is more than clothing — it is an extension of personality, ambition and lifestyle.
            Made for people who value quality, detail and understated luxury in their everyday wardrobe.
          </p>
          <ul className="grid grid-cols-2 gap-x-6 border-t border-line pt-5 text-fg">
            {VALUES.map((v, i) => (
              <li key={v} className="flex items-baseline gap-3 py-1.5">
                <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                <span className="type-heading text-2xl">{v}</span>
              </li>
            ))}
          </ul>
        </>
      ),
      media: (
        <div className="relative aspect-[4/5]">
          <Image
            src="/media/hero.webp"
            alt="Man seated in a linen shirt and black FILO trousers"
            fill
            sizes="(min-width:768px) 40vw, 100vw"
            className="object-cover object-[50%_40%]"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <AboutHero />

      {/* The story: one thread sewn through six chapters. */}
      <div id="the-thread" className="container-x xl:px-44">
        <div className="relative pl-8 md:pl-0">
          <Thread shape={{ variant: "weave", sides: chapters.map((c) => c.side) }} className="inset-0 hidden text-fg md:block" />
          <Thread shape={{ variant: "gutter", count: chapters.length }} className="inset-y-0 left-0 w-5 text-fg md:hidden" />
          {chapters.map((c, i) => (
            <ChapterBlock key={c.id} chapter={c} index={i} />
          ))}
        </div>
      </div>
      <StepRail steps={chapters.map((c) => ({ id: c.id, label: c.step }))} containerId="the-thread" />

      {/* The knot: thread ties off into the monogram. */}
      {/* Same column geometry as the story, so it lines up with the thread's end. */}
      <div aria-hidden className="container-x xl:px-44">
        <div className="flex flex-col items-start md:items-center">
          <div className="flex w-5 flex-col items-center md:w-auto">
            <span className="block h-20 w-[1.6px] bg-fg" />
            <Monogram className="h-20 w-auto shrink-0 md:h-28" />
          </div>
        </div>
      </div>

      {/* Founders */}
      <section className="container-x py-28 text-center md:py-40" aria-labelledby="founders">
        <Reveal y={12}>
          <p className="type-label text-muted">From the founders</p>
        </Reveal>
        <h2 id="founders" className="mx-auto mt-8 max-w-5xl type-display text-[clamp(2.5rem,5.5vw,5.5rem)]">
          <LineReveal lines={["Confidence", <em key="b">without excess.</em>]} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-muted">
            Inspired by the elegance and discipline of classic tailoring culture, FILO embraces a clean and refined
            design language — premium craftsmanship, minimal yet powerful aesthetics, and timeless styling over
            fast-changing trends.
          </p>
          <p className="mt-10 font-serif text-3xl italic md:text-4xl">Satyam Goyal &amp; Shivam Goyal</p>
          <p className="mt-2 type-label text-muted">Founders, FILO</p>
        </Reveal>
      </section>

      {/* By the numbers */}
      <section className="inverse" aria-label="FILO in numbers">
        <ul className="container-x grid grid-cols-2 md:grid-cols-4">
          {[
            [String(styles), "Styles"],
            [String(all.length), "Colourways"],
            [String(sizes), "Waist sizes, 28 — 40"],
            ["24–48h", "To dispatch"],
          ].map(([n, label], i) => (
            <Reveal
              as="li"
              key={label}
              delay={i * 0.08}
              className={cn(
                "border-line py-12 md:py-16",
                i % 2 ? "border-l pl-6 md:pl-10" : "pr-6",
                i > 1 && "max-md:border-t",
                i === 2 && "md:border-l md:pl-10",
              )}
            >
              <p className="type-display text-[clamp(3.5rem,7vw,6.5rem)] tabular-nums">{n}</p>
              <p className="mt-2 type-label text-muted">{label}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Finale */}
      <section className="container-x py-28 text-center md:py-40" aria-labelledby="your-turn">
        <h2 id="your-turn" className="type-display text-[clamp(3.5rem,10vw,10rem)]">
          <LineReveal lines={["Your", <em key="b">turn.</em>]} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-md text-muted">
            The thread is ready. Find the pair that becomes your everyday.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" arrow>
              Shop the collection
            </ButtonLink>
            <ButtonLink href="/posters" variant="outline">
              Poster series
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
