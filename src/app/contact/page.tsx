import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { LineReveal, Reveal } from "@/components/motion";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, ThreadsIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about sizing, orders or returns? Get in touch with the FILO team.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  {
    q: "When will my order ship?",
    a: "Orders are processed within 24–48 working hours, excluding Sundays and public holidays. You’ll receive tracking details as soon as your order is dispatched.",
  },
  {
    q: "What is your return policy?",
    a: "You can request a return within 5 days of delivery. Items must be unused, unwashed and in their original packaging with tags attached. Email hello@filoclothing.com with your order number to begin — returns sent without approval can’t be accepted.",
  },
  {
    q: "Do you offer exchanges?",
    a: "We don’t offer direct exchanges at the moment. If you need a different size, request a return for the original item and place a new order.",
  },
  {
    q: "How do I find my size?",
    a: "FILO trousers are sized by waist in inches, from 28 to 40. Measure around your natural waist where you wear your trousers; if you’re between sizes, choose the larger one.",
  },
  {
    q: "My order arrived damaged or incorrect.",
    a: "We’re sorry! Please email us within 48 hours of delivery with your order number and clear photos or videos of the issue, and we’ll arrange a replacement or refund after verification.",
  },
  {
    q: "When will I receive my refund?",
    a: "Once your return is received and approved, refunds are processed to your original payment method within 7–10 business days. Your bank or UPI provider may take a little longer to reflect it.",
  },
];

export default function ContactPage() {
  const tel = site.phone.replace(/\s/g, "");
  return (
    <>
      <section className="pb-20 pt-36 md:pb-28 md:pt-48">
        <div className="container-x">
          <Reveal y={12}>
            <p className="type-label mb-6 text-muted">Contact</p>
          </Reveal>
          <h1 className="type-display text-[clamp(3.25rem,8vw,8rem)] leading-[0.9] tracking-[-0.03em]">
            <LineReveal immediate lines={["We’d love to", <em key="b" className="text-muted">hear from you.</em>]} />
          </h1>
        </div>

        <div className="container-x mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-4" delay={0.1}>
            <ul className="space-y-8 text-sm">
              <li className="flex gap-4">
                <MailIcon className="mt-0.5 shrink-0 text-muted" />
                <div>
                  <p className="type-label mb-1.5 text-muted">Email</p>
                  <a href={`mailto:${site.email}`} className="text-base hover:underline">
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <PhoneIcon className="mt-0.5 shrink-0 text-muted" />
                <div>
                  <p className="type-label mb-1.5 text-muted">Phone</p>
                  <a href={`tel:${tel}`} className="text-base hover:underline">
                    {site.phone}
                  </a>
                  <p className="mt-1 text-muted">{site.hours}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <PinIcon className="mt-0.5 shrink-0 text-muted" />
                <div>
                  <p className="type-label mb-1.5 text-muted">Studio</p>
                  <address className="text-base not-italic leading-relaxed">
                    {site.address.line1}
                    <br />
                    {site.address.city} {site.address.postalCode}, {site.address.region}
                  </address>
                </div>
              </li>
              <li className="flex gap-3 pl-10">
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 hover:border-fg">
                  <InstagramIcon width={16} /> Instagram
                </a>
                <a href={site.social.threads} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 hover:border-fg">
                  <ThreadsIcon width={16} /> Threads
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal className="md:col-span-7 md:col-start-6" delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <h2 className="type-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em]">
              <LineReveal lines={["Questions,", <em key="b" className="text-muted">answered.</em>]} />
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Faq items={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
