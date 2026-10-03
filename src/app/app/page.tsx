import type { Metadata } from "next";
import { AppIcon, InstallButton } from "@/components/app/install";
import { PhoneMockup } from "@/components/app/phone-mockup";
import { QrCode } from "@/components/app/qr-code";
import { LineReveal, Reveal } from "@/components/motion";
import { getProducts } from "@/lib/catalog";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Get the FILO App",
  description:
    "Install the FILO app on your phone: full-screen from your home screen, your bag kept on your device, quick on any network. No app store needed.",
  alternates: { canonical: "/app" },
};

const FEATURES = [
  {
    title: "On your home screen",
    copy: "Its own icon and a full-screen window — no browser bars, just FILO.",
  },
  {
    title: "Your bag, kept",
    copy: "Whatever you add stays saved on your device, ready when you come back.",
  },
  {
    title: "Quick on any network",
    copy: "Pages and images you’ve seen load instantly, and it degrades gracefully offline.",
  },
  {
    title: "Always up to date",
    copy: "New drops and prices arrive the moment we publish them. No app-store updates.",
  },
];

const PLATFORMS = [
  {
    name: "iPhone",
    steps: ["Open this page in Safari", "Tap Share, then “Add to Home Screen”", "Tap Add"],
  },
  {
    name: "Android",
    steps: ["Tap “Get the app” above", "Confirm Install", "Open FILO from your apps"],
  },
  {
    name: "Computer",
    steps: ["Scan the code with your phone", "Or, in Chrome or Edge, click the install icon in the address bar"],
  },
];

export default async function AppPage() {
  const all = await getProducts();
  const fresh = all.filter((p) => p.isNew && p.available);
  const cards = (fresh.length >= 2 ? fresh : all).slice(0, 2).map((p) => ({
    image: p.images[0].src,
    name: p.name,
    color: p.color,
    price: p.price,
  }));
  const hero = all.find((p) => p.handle === "linen-pant")?.images[0].src ?? all[0].images[0].src;

  return (
    <>
      {/* Hero */}
      <section className="container-x grid min-h-[100svh] items-center gap-14 pb-24 pt-36 md:grid-cols-12 md:gap-8 md:pt-32">
        <div className="md:col-span-6">
          <Reveal y={12}>
            <div className="flex items-center gap-3">
              <AppIcon className="size-11" />
              <p className="type-label text-muted">The FILO app</p>
            </div>
          </Reveal>
          <h1 className="mt-8 type-display text-[clamp(3.5rem,8vw,8rem)]">
            <LineReveal immediate lines={["FILO,", <em key="b">in your pocket.</em>]} />
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-md leading-relaxed text-muted">
              Install the FILO app on your phone. It opens full-screen from your home screen, keeps your bag, and stays
              quick even on a patchy signal — no app store, no download wait.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <InstallButton />
              <div className="hidden items-center gap-4 md:flex">
                <QrCode path="/app" className="size-20 overflow-hidden rounded-lg border border-line" />
                <p className="max-w-[10rem] text-xs leading-relaxed text-muted">
                  On a computer? Scan to get it on your phone.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={40} className="md:col-span-5 md:col-start-8">
          <div className="animate-[float_7s_ease-in-out_infinite]">
            <PhoneMockup hero={hero} cards={cards} />
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section className="border-t border-line py-24 md:py-32" aria-labelledby="why-app">
        <div className="container-x">
          <h2 id="why-app" className="max-w-3xl type-display text-[clamp(2.5rem,5vw,4.75rem)]">
            <LineReveal lines={["Everything you like about FILO,", <em key="b">one tap away.</em>]} />
          </h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 0.07} className="bg-bg p-6 md:p-8">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <p className="mt-10 type-heading text-2xl">{f.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.copy}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How to install */}
      <section className="inverse py-24 md:py-32" aria-labelledby="how-install">
        <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <h2 id="how-install" className="type-display text-[clamp(2.5rem,4.5vw,4.25rem)]">
              <LineReveal lines={["Install in", <em key="b">seconds.</em>]} />
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              FILO installs straight from the web, so there’s nothing to search for and nothing large to download.
            </p>
            <div className="mt-8">
              <InstallButton variant="light" />
            </div>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:col-span-8 md:grid-cols-3">
            {PLATFORMS.map((p) => (
              <li key={p.name} className="bg-bg p-6 md:p-8">
                <p className="type-heading text-2xl">{p.name}</p>
                <ol className="mt-6 space-y-3 text-sm text-muted">
                  {p.steps.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="font-mono text-xs text-fg">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
