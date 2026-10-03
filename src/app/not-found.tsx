import { LineReveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[85svh] items-center pb-24 pt-40">
      <div className="container-x">
        <p className="type-label mb-6 text-muted">404 · Page not found</p>
        <h1 className="type-display text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.03em]">
          <LineReveal immediate lines={["This page has", <em key="b" className="text-muted">stepped out.</em>]} />
        </h1>
        <p className="mt-8 max-w-md text-fg/80">
          The link may be old or the product may have moved. Let’s get you back to something that fits.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop">Shop all trousers</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
