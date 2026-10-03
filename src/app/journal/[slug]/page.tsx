import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LineReveal, MaskReveal, Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import Image from "@/components/ui/image";
import { articles, getArticle } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { type: "article", publishedTime: article.publishedAt, images: [article.cover] },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const index = articles.findIndex((a) => a.slug === article.slug);
  const next = articles[(index + 1) % articles.length];
  // The first <h2> in Shopify's body repeats the title; drop it.
  const body = article.html.replace(/^\s*<h2>[\s\S]*?<\/h2>/, "");

  return (
    <article className="pb-24 pt-36 md:pb-36 md:pt-44">
      <header className="container-x max-w-5xl text-center">
        <Reveal y={12}>
          <p className="type-label text-muted">
            <Link href="/journal" className="hover:text-fg">
              Journal
            </Link>{" "}
            · {formatDate(article.publishedAt)} · {article.readingMinutes} min read
          </p>
        </Reveal>
        <h1 className="mt-6 type-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[1] tracking-[-0.02em]">
          <LineReveal immediate lines={[article.title]} />
        </h1>
      </header>

      <MaskReveal className="container-x mt-14 md:mt-20">
        <div className="relative aspect-[16/8] overflow-hidden bg-surface">
          <Image src={article.cover} alt="" fill preload sizes="100vw" className="object-cover" />
        </div>
      </MaskReveal>

      <Reveal className="container-x mt-14 max-w-2xl md:mt-20">
        <div className="prose-filo" dangerouslySetInnerHTML={{ __html: body }} />
      </Reveal>

      <div className="container-x mt-20 max-w-2xl border-t border-line pt-10">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-heading text-2xl leading-snug">Find the pair that fits your day.</p>
          <ButtonLink href="/shop">Shop trousers</ButtonLink>
        </div>
        {next && next.slug !== article.slug && (
          <Link href={`/journal/${next.slug}`} className="group mt-12 flex items-center justify-between gap-6">
            <div>
              <p className="type-label text-muted">Next article</p>
              <p className="mt-2 type-heading text-2xl leading-snug transition-colors group-hover:text-muted md:text-3xl">
                {next.title}
              </p>
            </div>
            <ArrowRight className="size-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  );
}
