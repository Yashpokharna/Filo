import type { Metadata } from "next";
import { Monogram } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "You’re offline",
  robots: { index: false },
};

/** Served by the service worker when a page can't be reached. */
export default function OfflinePage() {
  return (
    <section className="container-x flex min-h-[85svh] flex-col items-center justify-center pb-24 pt-40 text-center">
      <Monogram className="h-16 w-auto" />
      <p className="mt-10 type-label text-muted">No connection</p>
      <h1 className="mt-4 type-display text-[clamp(3rem,8vw,6rem)]">
        You’re <em>offline.</em>
      </h1>
      <p className="mt-6 max-w-sm text-muted">
        Pages you’ve already visited are still here, and your bag is saved on this device. Reconnect to see the latest
        stock and check out.
      </p>
      <div className="mt-10">
        <ButtonLink href="/" arrow>
          Try again
        </ButtonLink>
      </div>
    </section>
  );
}
