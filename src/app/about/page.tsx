import type { Metadata } from "next";
import { Film } from "@/components/home/film";
import { LineReveal, MaskReveal, Parallax, Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import Image from "@/components/ui/image";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "FILO is a premium Indian apparel brand founded by Satyam Goyal and Shivam Goyal — timeless design, refined craftsmanship and elevated everyday essentials.",
  alternates: { canonical: "/about" },
};

const VALUES = ["Confidence", "Ambition", "Discipline", "Elegance"];
const CRAFT = [
  { name: "Silhouette", copy: "Clean, considered lines that flatter without excess." },
  { name: "Fabric", copy: "Linen, stretch and wrinkle-free weaves chosen for how they wear." },
  { name: "Construction", copy: "Reinforced stitching and structure built for durability." },
  { name: "Finishing", copy: "Details checked from fabric selection to final production." },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="pb-24 pt-36 md:pb-36 md:pt-48">
        <div className="container-x grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col md:col-span-6 md:pt-10">
            <Reveal y={12}>
              <p className="type-label mb-6 text-muted">Our story</p>
            </Reveal>
            <h1 className="type-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em]">
              <LineReveal immediate lines={["Quiet luxury,", <em key="b" className="text-muted">made to last.</em>]} />
            </h1>
            <Reveal delay={0.3} className="mt-auto pt-12">
              <p className="max-w-md text-lg leading-relaxed text-fg/80">
                FILO is a premium Indian apparel brand founded by Satyam Goyal and Shivam Goyal, created with a vision to
                redefine modern fashion through timeless design, refined craftsmanship, and elevated everyday essentials.
              </p>
            </Reveal>
          </div>
          <MaskReveal className="relative aspect-[4/5] md:col-span-5 md:col-start-8">
            <Parallax className="absolute inset-0" offset={50}>
              <Image
                src="/media/about-tailoring.webp"
                alt="Crossed legs in white tailored FILO trousers and black boots"
                fill
                preload
                sizes="(min-width:768px) 42vw, 100vw"
                className="object-cover object-[50%_45%]"
              />
            </Parallax>
          </MaskReveal>
        </div>
      </section>

      {/* Statement */}
      <section className="border-y border-line bg-surface py-28 md:py-44">
        <div className="container-x text-center">
          <Reveal y={12}>
            <p className="type-label mb-8 text-muted">Our philosophy</p>
          </Reveal>
          <p className="mx-auto max-w-5xl type-display text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.02] tracking-[-0.02em]">
            <LineReveal
              lines={[
                "Fashion is more than clothing —",
                <span key="b">
                  it is an <em className="text-muted">extension of self.</em>
                </span>,
              ]}
            />
          </p>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl leading-relaxed text-fg/80">
              Built on the philosophy of sophistication and confidence, FILO represents a new generation of fashion that
              blends luxury aesthetics with functionality, comfort, and contemporary style.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-36">
        <div className="container-x grid items-center gap-14 md:grid-cols-12 md:gap-8">
          <MaskReveal className="relative aspect-[3/4] md:col-span-5">
            <Image
              src="/media/about-detail.webp"
              alt="Detail of a FILO trouser"
              fill
              sizes="(min-width:768px) 42vw, 100vw"
              className="object-cover"
            />
          </MaskReveal>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="type-display text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1] tracking-[-0.02em]">
              <LineReveal lines={["Confidence", <em key="b" className="text-muted">without excess.</em>]} />
            </h2>
            <Reveal delay={0.15}>
              <div className="mt-8 max-w-lg space-y-5 leading-relaxed text-fg/80">
                <p>
                  Inspired by the elegance and discipline of classic tailoring culture, FILO embraces a clean and refined
                  design language. We create premium apparel that feels versatile, effortless and enduring — for people
                  who value quality, detail and understated luxury in their everyday wardrobe.
                </p>
                <p>
                  The brand emphasises premium craftsmanship, minimal yet powerful aesthetics, and timeless styling over
                  fast-changing trends. From fabric selection to final production, FILO maintains a strong commitment to
                  quality, durability, fit and design precision.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section className="inverse py-24 md:py-36">
        <div className="container-x">
          <p className="type-label mb-6 text-muted">How every piece is made</p>
          <h2 className="type-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.02em]">
            <LineReveal lines={["Attention to", <em key="b" className="text-muted">every detail.</em>]} />
          </h2>
        </div>
        <MaskReveal className="container-x mt-14 md:mt-20">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Film src="/media/film-craft.mp4" poster="/media/film-craft-poster.webp" />
          </div>
        </MaskReveal>
        <ul className="container-x mt-14 grid gap-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {CRAFT.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.08} className="border-t border-line pt-6">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <p className="mt-6 type-heading text-3xl">{c.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.copy}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section className="py-24 md:py-36">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="type-label mb-6 text-muted">Values</p>
              <p className="max-w-sm leading-relaxed text-fg/80">
                At its core, FILO represents confidence, ambition, discipline and elegance — designed for those who
                appreciate refined fashion and elevated everyday dressing.
              </p>
            </Reveal>
          </div>
          <ul className="md:col-span-8">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v} delay={i * 0.06} className="group flex items-baseline gap-6 border-b border-line py-5 md:py-7">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <span className="type-display text-[clamp(2.75rem,7vw,6.5rem)] leading-none tracking-[-0.03em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                  {v}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-36">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-sm bg-black text-white">
            <Image src="/media/hero.webp" alt="" fill sizes="100vw" className="object-cover opacity-55" />
            <div className="relative flex flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-14 md:py-28">
              <p className="max-w-xl type-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1]">
                Elevated everyday dressing, <em>for the modern generation.</em>
              </p>
              <ButtonLink href="/shop" variant="light">
                Shop now
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
