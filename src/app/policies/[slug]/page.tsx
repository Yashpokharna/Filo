import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LineReveal } from "@/components/motion";
import { getPolicy, policyPages } from "@/lib/content";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return policyPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const policy = getPolicy((await params).slug);
  return policy ? { title: policy.title, alternates: { canonical: `/policies/${policy.slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="pb-24 pt-36 md:pb-36 md:pt-44">
      <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-3">
          <nav aria-label="Policies" className="md:sticky md:top-[calc(var(--header-offset)+2rem)]">
            <p className="type-label mb-5 text-muted">Customer care</p>
            <ul className="space-y-2.5 text-sm">
              {policyPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/policies/${p.slug}`}
                    aria-current={p.slug === slug ? "page" : undefined}
                    className={cn("transition-colors hover:text-fg", p.slug === slug ? "text-fg" : "text-muted")}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm leading-relaxed text-muted">
              Questions? Email{" "}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </nav>
        </aside>
        <div className="md:col-span-8 md:col-start-5">
          <h1 className="type-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
            <LineReveal immediate lines={[policy.title]} />
          </h1>
          <div className="prose-filo mt-12 max-w-3xl" dangerouslySetInnerHTML={{ __html: policy.html }} />
        </div>
      </div>
    </div>
  );
}
