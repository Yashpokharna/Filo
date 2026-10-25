import { ProductCarousel } from "@/components/home/carousel";
import type { FilmShot } from "@/components/home/filo-film";
import { Hero } from "@/components/home/hero";
import { PosterRail } from "@/components/home/poster-rail";
import { ScaleFilm } from "@/components/home/scale-film";
import { Wardrobe, type WardrobeItem } from "@/components/home/wardrobe";
import { Marquee } from "@/components/marquee";
import { LineReveal, MaskReveal, Reveal } from "@/components/motion";
import { Poster } from "@/components/posters/poster";
import { ProductCard } from "@/components/product/product-card";
import { Accent, SectionHeading } from "@/components/section-heading";
import { ButtonLink, TextLink } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { findColourway, getProducts, toSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getPosters } from "@/lib/posters";

export const revalidate = 900;

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

export default async function Home() {
  const [all, posters] = await Promise.all([getProducts(), getPosters()]);
  const summary = (p: (typeof all)[number]) => toSummary(p, all);
  const fresh = all.filter((p) => p.isNew && p.available).map(summary);
  const featured = all.filter((p) => p.available && !p.isNew).slice(0, 8).map(summary);
  const ease = findColourway(all, "ease", "Coffee") ?? all[0];
  const families = [...new Set(all.map((p) => p.family))];
  const wardrobe: WardrobeItem[] = families.map((family) => {
    const group = all.filter((p) => p.family === family);
    const lead = group.find((p) => p.available) ?? group[0];
    return {
      family,
      name: lead.name,
      fabric: lead.fabric,
      lead: lead.lead,
      price: Math.min(...group.map((p) => p.price)),
      // Catalog order puts available colourways first, so the rail opens on one in stock.
      colours: group.map((p) => ({
        handle: p.handle,
        color: p.color,
        swatch: p.swatch,
        images: (p.images.length ? p.images : lead.images).slice(0, 2).map((i) => i.src),
        available: p.available,
      })),
    };
  });
  const img = (family: string, color: string, i = 0) =>
    (findColourway(all, family, color) ?? ease).images[i]?.src ?? ease.images[0].src;
  const shots: FilmShot[] = [
    { kind: "photo", src: img("linen-pant", "Obsidian Black"), move: "push", enter: "cut", seconds: 2.4 },
    { kind: "photo", src: img("linen-pant", "Imperial Navy"), move: "rise", enter: "wipe-up", seconds: 2 },
    { kind: "photo", src: img("ease", "Coffee"), move: "pan", enter: "wipe-left", seconds: 2.2 },
    {
      kind: "triptych",
      srcs: [img("ease", "Obsidian Black"), img("ease", "Sterling Grey"), img("ease", "Coffee", 1)],
      enter: "cut",
      seconds: 1.8,
    },
    { kind: "photo", src: img("korean-stretch-pant", "Imperial Navy"), move: "pan", enter: "zoom", seconds: 2.3 },
    { kind: "photo", src: img("korean-stretch-pant", "Sterling Grey"), move: "push", enter: "slide", seconds: 2 },
    { kind: "photo", src: img("korean-stretch-pant", "Champagne Sand"), move: "rise", enter: "wipe-up", seconds: 2.2 },
    { kind: "photo", src: img("linen-pant", "Vanilla White"), move: "pull", enter: "slide", seconds: 2.2 },
  ];
  const floats: [string, string] = [img("linen-pant", "Obsidian Black"), img("korean-stretch-pant", "Champagne Sand")];

  return (
    <>
      <Hero floats={floats} shots={shots} stats={`${families.length} styles · ${all.length} colourways`} />

      <Marquee items={["Wrinkle-free", "2-way stretch", "100% linen", "Tailored fits", "Waist 28 — 40"]} />

      {/* New Now */}
      <section className="pb-28 pt-16 md:pb-40 md:pt-24" aria-labelledby="new-now">
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

      {/* Wardrobe */}
      <section className="pb-28 md:pb-40" aria-labelledby="wardrobe">
        <SectionHeading
          index="02"
          eyebrow="The wardrobe"
          title={[
            <span key="a" id="wardrobe">
              {WORDS[families.length] ?? families.length} styles,
            </span>,
            <Accent key="b">one rail.</Accent>,
          ]}
          aside={
            <div className="flex flex-col gap-4 md:items-end">
              <p className="max-w-xs text-sm text-muted">
                Run along the rail and take a pair off the hanger to see it up close.
              </p>
              <TextLink href="/shop">View all {all.length} colourways</TextLink>
            </div>
          }
        />
        <div className="container-x mt-12 md:mt-16">
          <Wardrobe items={wardrobe} />
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
      <section className="pb-28 pt-16 md:pb-40 md:pt-24" aria-labelledby="explore">
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

    </>
  );
}
