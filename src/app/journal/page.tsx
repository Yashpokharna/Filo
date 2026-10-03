import type { Metadata } from "next";
import Link from "next/link";
import { LineReveal, MaskReveal, Reveal } from "@/components/motion";
import Image from "@/components/ui/image";
import { articles } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description: "Style notes, fabric guides and trend reports from FILO.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <div className="pb-24 pt-36 md:pb-36 md:pt-48">
      <header className="container-x">
        <Reveal y={12}>
          <p className="type-label mb-6 text-muted">The FILO Journal</p>
        </Reveal>
        <h1 className="type-display text-[clamp(3.25rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em]">
          <LineReveal immediate lines={["Notes on", <em key="b" className="text-muted">dressing well.</em>]} />
        </h1>
      </header>

      {lead && (
        <Link href={`/journal/${lead.slug}`} className="group container-x mt-16 grid gap-8 md:mt-24 md:grid-cols-12 md:items-end">
          <MaskReveal className="relative aspect-[16/10] md:col-span-8">
            <Image
              src={lead.cover}
              alt=""
              fill
              preload
              sizes="(min-width:768px) 66vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
            />
          </MaskReveal>
          <Reveal className="md:col-span-4" delay={0.2}>
            <p className="text-xs text-muted">
              {formatDate(lead.publishedAt)} · {lead.readingMinutes} min read
            </p>
            <h2 className="mt-3 type-heading text-4xl leading-[1.05] transition-colors group-hover:text-muted md:text-5xl">
              {lead.title}
            </h2>
            <p className="mt-5 leading-relaxed text-fg/80">{lead.excerpt}</p>
            <span className="mt-6 inline-block border-b border-fg pb-1 text-sm font-medium">Read article</span>
          </Reveal>
        </Link>
      )}

      <ul className="container-x mt-24 grid gap-x-4 gap-y-16 md:mt-32 md:grid-cols-3">
        {rest.map((a, i) => (
          <Reveal as="li" key={a.slug} delay={i * 0.08}>
            <Link href={`/journal/${a.slug}`} className="group block">
              <div className="relative aspect-[16/11] overflow-hidden bg-surface">
                <Image
                  src={a.cover}
                  alt=""
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                />
              </div>
              <p className="mt-5 text-xs text-muted">
                {formatDate(a.publishedAt)} · {a.readingMinutes} min read
              </p>
              <h2 className="mt-2 type-heading text-[1.75rem] leading-snug transition-colors group-hover:text-muted">{a.title}</h2>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{a.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
