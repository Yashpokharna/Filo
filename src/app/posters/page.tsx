import type { Metadata } from "next";
import Link from "next/link";
import { LineReveal, Reveal } from "@/components/motion";
import { Poster } from "@/components/posters/poster";
import { Accent } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { posters } from "@/lib/posters";

export const metadata: Metadata = {
  title: "Poster Series",
  description: "Six FILO campaign posters, each set in the palette of the colourway it celebrates.",
  alternates: { canonical: "/posters" },
};

export default function PostersPage() {
  return (
    <div className="pb-28 pt-36 md:pb-40 md:pt-48">
      <header className="container-x grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal y={12}>
            <p className="mb-6 type-label text-muted">The FILO poster series — No. 01 to 06</p>
          </Reveal>
          <h1 className="type-display text-[clamp(3.5rem,9vw,9.5rem)]">
            <LineReveal immediate lines={["Worth", <Accent key="b">framing.</Accent>]} />
          </h1>
        </div>
        <Reveal delay={0.2} className="md:col-span-4">
          <p className="max-w-sm leading-relaxed text-muted">
            A campaign series designed in-house. Each poster is set in the palette of the colourway it celebrates —
            coffee, vanilla, obsidian, silver, navy and blush.
          </p>
        </Reveal>
      </header>

      <ul className="container-x mt-20 grid gap-x-6 gap-y-20 md:mt-28 md:grid-cols-2 md:gap-y-28 xl:gap-x-10">
        {posters.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-40" : undefined}>
            <Link href={p.href} className="group block" data-cursor="Shop">
              <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
                <Poster poster={p} />
              </div>
            </Link>
            <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              <span className="font-mono text-xs text-muted">No. {p.no}</span>
              <div>
                <h2 className="type-heading text-3xl">{p.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{p.blurb}</p>
                <div className="mt-5 flex items-center gap-4">
                  <ButtonLink href={p.href} variant="outline" arrow>
                    {p.cta}
                  </ButtonLink>
                  <span className="flex items-center gap-1.5" aria-label="Palette">
                    {[p.bg, p.fg, p.accent].map((c, j) => (
                      <span key={j} className="size-4 rounded-full ring-1 ring-line" style={{ background: c }} />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
