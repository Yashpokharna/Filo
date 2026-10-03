import Link from "next/link";
import { ProductCarousel } from "@/components/home/carousel";
import type { FilmShot } from "@/components/home/filo-film";
import { Hero } from "@/components/home/hero";
import { Lineup, type LineupItem } from "@/components/home/lineup";
import { PosterRail } from "@/components/home/poster-rail";
import { ScaleFilm } from "@/components/home/scale-film";
import { Marquee } from "@/components/marquee";
import { LineReveal, MaskReveal, Reveal } from "@/components/motion";
import { Poster } from "@/components/posters/poster";
import { ProductCard } from "@/components/product/product-card";
import { Accent, SectionHeading } from "@/components/section-heading";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { getProducts, toSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { posters } from "@/lib/posters";

export const revalidate = 900;

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

const FABRICS = [
  {
    name: "Wrinkle-free",
    detail: "FILO Ease",
    copy: "Sharp without an iron. Easy to wash, comfortable from the first meeting to the last train home.",
    href: "/shop?category=easy-care",
  },
  {
    name: "2-way lycra",
    detail: "Korean · Flexi · 9TO5",
    copy: "Comfortable stretch that holds a clean, structured silhouette for office and smart-casual days.",
    href: "/shop?category=stretch",
  },
  {
    name: "4-way lycra",
    detail: "Travel Pant",
    copy: "Stretch in every direction with an elastic waistband. Made for long journeys.",
    href: "/products/filo-travel-pants",
  },
  {
    name: "100% linen",
    detail: "Linen Pant · Air Short",
    copy: "Lightweight, breathable and naturally soft — the answer to an Indian summer.",
    href: "/shop?category=linen",
  },
];

export default async function Home() {
  const all = await getProducts();
  const summary = (p: (typeof all)[number]) => toSummary(p, all);
  const fresh = all.filter((p) => p.isNew && p.available).map(summary);
  const featured = all.filter((p) => p.available && !p.isNew).slice(0, 8).map(summary);
  const ease = all.find((p) => p.handle === "filo-ease") ?? all[0];
  const families = [...new Set(all.map((p) => p.family))];
  const lineup: LineupItem[] = families.map((family) => {
    const group = all.filter((p) => p.family === family);
    const lead = group.find((p) => p.available) ?? group[0];
    return {
      href: `/products/${lead.handle}`,
      name: lead.name,
      fabric: lead.fabric,
      price: Math.min(...group.map((p) => p.price)),
      colours: group.length,
      image: lead.images[0].src,
    };
  });
  const img = (handle: string, i = 0) =>
    (all.find((p) => p.handle === handle) ?? ease).images[i]?.src ?? ease.images[0].src;
  const shots: FilmShot[] = [
    { kind: "photo", src: img("linen-pant"), move: "push", enter: "cut", seconds: 2.4 },
    { kind: "photo", src: img("linen-pant-imperial-navy"), move: "rise", enter: "wipe-up", seconds: 2 },
    { kind: "photo", src: img("filo-ease"), move: "pan", enter: "wipe-left", seconds: 2.2 },
    {
      kind: "triptych",
      srcs: [img("filo-ease-obsidian-black"), img("filo-ease-1"), img("filo-ease", 1)],
      enter: "cut",
      seconds: 1.8,
    },
    { kind: "photo", src: img("korean-pant-imperial-navy"), move: "pan", enter: "zoom", seconds: 2.3 },
    { kind: "photo", src: img("korean-pant-sterling-grey"), move: "push", enter: "slide", seconds: 2 },
    { kind: "photo", src: img("korean-pant-champagne-sand"), move: "rise", enter: "wipe-up", seconds: 2.2 },
    { kind: "photo", src: img("linen-pant-white"), move: "pull", enter: "slide", seconds: 2.2 },
  ];
  const floats: [string, string] = [
    all.find((p) => p.handle === "linen-pant")?.images[0].src ?? ease.images[0].src,
    all.find((p) => p.handle === "korean-pant-champagne-sand")?.images[0].src ?? ease.images[0].src,
  ];

  return (
    <>
      <Hero floats={floats} shots={shots} stats={`${families.length} styles · ${all.length} colourways`} />

      <Marquee items={["Wrinkle-free", "2-way stretch", "100% linen", "Tailored fits", "Waist 28 — 40"]} />

      {/* New Now */}
      <section className="pb-28 md:pb-40" aria-labelledby="new-now">
        <SectionHeading
          index="01"
          eyebrow="Just dropped"
          title={[
            <span key="a" id="new-now">
              New <Accent>now</Accent>
            </span>,
          ]}
          aside={
            <div className="flex flex-col gap-4 md:items-end">
              <p className="max-w-xs text-sm text-muted">Fresh colourways of the styles you already love.</p>
              <TextLink href="/shop?category=new">Shop new arrivals</TextLink>
            </div>
          }
        />
        <div className="mt-12 md:mt-16">
          <ProductCarousel products={fresh} label="New arrivals" />
        </div>
      </section>

      {/* Lineup */}
      <section className="pb-28 md:pb-40" aria-labelledby="lineup">
        <SectionHeading
          index="02"
          eyebrow="The lineup"
          title={[
            <span key="a" id="lineup">
              {WORDS[families.length] ?? families.length} styles.
            </span>,
            <Accent key="b">One standard.</Accent>,
          ]}
          aside={<TextLink href="/shop">View all {all.length} colourways</TextLink>}
        />
        <div className="container-x mt-12 md:mt-16">
          <Lineup items={lineup} />
        </div>
      </section>

      {/* Poster series */}
      <PosterRail
        intro={
          <div className="pr-4">
            <p className="mb-5 flex gap-3 type-label text-muted">
              <span className="font-mono tracking-normal">(03)</span> The poster series
            </p>
            <h2 className="type-display text-[clamp(2.75rem,5vw,5.5rem)]">
              <LineReveal lines={["Worth", <Accent key="b">framing.</Accent>]} />
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              Six campaign posters designed in-house, each set in the palette of the colourway it celebrates.
            </p>
            <div className="mt-8">
              <TextLink href="/posters">View the series</TextLink>
            </div>
          </div>
        }
        items={posters.map((p) => ({
          href: p.href,
          no: p.no,
          title: p.title,
          poster: <Poster poster={p} />,
        }))}
      />

      {/* FILO Ease feature */}
      <section className="inverse py-28 md:py-40" aria-labelledby="ease">
        <div className="container-x grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <MaskReveal className="relative aspect-[4/5] rounded-sm md:col-span-6">
            <Image
              src="/media/ease-editorial.webp"
              alt="Man in FILO Ease trousers walking up to a front door"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover object-[50%_60%]"
            />
          </MaskReveal>
          <div className="md:col-span-5 md:col-start-8">
            <Reveal>
              <p className="mb-6 flex gap-3 type-label text-muted">
                <span className="font-mono tracking-normal">(04)</span> Signature style
              </p>
            </Reveal>
            <h2 id="ease" className="type-display text-[clamp(3rem,6vw,6rem)]">
              <LineReveal lines={["No iron.", "No fuss.", <Accent key="c">Always sharp.</Accent>]} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md leading-relaxed text-muted">{ease.lead}</p>
              <dl className="mt-8 grid max-w-md grid-cols-2 border-t border-line text-sm">
                {[
                  ["Fabric", "Wrinkle-free"],
                  ["Care", "Easy wash"],
                  ["Iron", "Not required"],
                  ["Colours", `${all.filter((p) => p.family === ease.family).length}`],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-line py-3.5">
                    <dt className="type-label text-muted">{k}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <ButtonLink href={`/products/${ease.handle}`} arrow>
                  Shop FILO Ease
                </ButtonLink>
                <span className="text-sm tabular-nums text-muted">{formatPrice(ease.price)}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ScaleFilm />

      {/* Collection grid */}
      <section className="pb-28 md:pb-40" aria-labelledby="explore">
        <SectionHeading
          index="05"
          eyebrow="The collection"
          title={[
            <span key="a" id="explore">
              Explore
            </span>,
            <Accent key="b">every style.</Accent>,
          ]}
          aside={<TextLink href="/shop">Shop all {all.length} pieces</TextLink>}
        />
        <div className="container-x mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-4 md:gap-y-14 xl:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.handle} delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fabric guide */}
      <section className="border-t border-line py-28 md:py-40" aria-labelledby="fabrics">
        <SectionHeading
          index="06"
          eyebrow="Fabric guide"
          title={[
            <span key="a" id="fabrics">
              Choose by
            </span>,
            <Accent key="b">how you move.</Accent>,
          ]}
        />
        <ul className="container-x mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {FABRICS.map((f, i) => (
            <Reveal as="li" key={f.name} delay={i * 0.07}>
              <Link
                href={f.href}
                className="group flex h-full flex-col rounded-sm border border-line p-6 transition-colors duration-500 hover:bg-fg hover:text-bg md:p-8"
              >
                <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                <span className="mt-14 type-heading text-4xl">{f.name}</span>
                <span className="mt-1.5 text-xs opacity-60">{f.detail}</span>
                <span className="mt-5 text-sm leading-relaxed opacity-80">{f.copy}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-8 text-sm font-medium">
                  Shop
                  <ArrowUpRight width={15} className="transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

    </>
  );
}
