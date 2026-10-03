import Link from "next/link";
import { Monogram } from "@/components/brand";
import { BackToTop, FooterWordmark, StudioClock } from "@/components/layout/footer-extras";
import { Newsletter } from "@/components/layout/newsletter";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArrowUpRight, InstagramIcon, ReturnIcon, RulerIcon, ShieldIcon, ThreadsIcon, TruckIcon } from "@/components/ui/icons";
import { categories } from "@/lib/catalog";
import { policyLinks, site } from "@/lib/site";

const PROMISES = [
  { icon: TruckIcon, title: "Dispatched in 24–48 hrs", note: "Tracked delivery across India" },
  { icon: ReturnIcon, title: "5-day returns", note: "On unworn pieces with tags" },
  { icon: ShieldIcon, title: "Secure checkout", note: "Encrypted, trusted payments" },
  { icon: RulerIcon, title: "Waist 28 — 40", note: "Every style, every size" },
];

const columns = [
  {
    title: "Shop",
    links: [{ label: "Shop all", href: "/shop" }, ...categories.map((c) => ({ label: c.label, href: `/shop?category=${c.key}` }))],
  },
  {
    title: "FILO",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Poster series", href: "/posters" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { title: "Help", links: policyLinks.map((l) => ({ label: l.label, href: l.href })) },
];

export function Footer({ images }: { images: string[] }) {
  const tel = site.phone.replace(/\s/g, "");
  return (
    <footer className="inverse relative overflow-hidden">
      {/* Service bar */}
      <div className="container-x">
        <ul className="grid grid-cols-2 gap-px border-b border-line bg-line lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, note }) => (
            <li key={title} className="flex items-start gap-4 bg-bg px-1 py-7 md:px-6 md:py-9 lg:first:pl-0">
              <Icon className="mt-0.5 size-5 shrink-0 text-muted" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="mb-6 type-label text-muted">The FILO list</p>
          <p className="type-display text-[clamp(2.6rem,4.8vw,4.75rem)]">
            First to every
            <br />
            <em>new drop.</em>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            New colourways, restocks and the occasional style note — straight to your inbox. No noise, ever.
          </p>
          <div className="mt-9 max-w-md rounded-2xl border border-line bg-elev/40 p-5 md:p-6">
            <Newsletter />
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-fg hover:text-bg"
            >
              <InstagramIcon width={16} /> Instagram
              <ArrowUpRight width={13} className="transition-transform duration-500 group-hover:rotate-45" />
            </a>
            <a
              href={site.social.threads}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-fg hover:text-bg"
            >
              <ThreadsIcon width={16} /> Threads
              <ArrowUpRight width={13} className="transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:col-span-7 lg:pl-10">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 type-label text-muted">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group relative inline-flex text-sm">
                      <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                        {l.label}
                      </span>
                      <span className="absolute -left-3 top-1/2 size-1 -translate-y-1/2 scale-0 rounded-full bg-current transition-transform duration-300 group-hover:scale-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <p className="mb-5 type-label text-muted">Visit</p>
            <address className="text-sm not-italic leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.city} {site.address.postalCode}
              <br />
              {site.address.region}, {site.address.country}
            </address>
            <p className="mt-5 text-xs leading-relaxed text-muted">{site.hours}</p>
            <div className="mt-5 space-y-1.5 text-sm">
              <a href={`mailto:${site.email}`} className="block underline-offset-4 hover:underline">
                {site.email}
              </a>
              <a href={`tel:${tel}`} className="block underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Signature */}
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 border-t border-line pt-6 pb-4 text-xs text-muted">
          <p className="max-w-xs">
            <span className="md:hidden">Tap a letter.</span>
            <span className="max-md:hidden">Hover the letters.</span>
          </p>
          <p className="hidden sm:block">Quiet luxury, made to last.</p>
        </div>
        <FooterWordmark images={images} />
      </div>

      {/* Bottom bar */}
      <div className="container-x mt-6 flex flex-col gap-4 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2.5">
          <Monogram className="h-4 w-auto text-fg" />© {new Date().getFullYear()} Filo Clothing. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <StudioClock />
          <span className="flex items-center gap-1">
            Theme <ThemeToggle className="size-8" />
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
