"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const field =
  "peer w-full border-b border-line bg-transparent pb-3 pt-6 text-base outline-none transition-colors placeholder:text-transparent focus:border-fg";
const label =
  "pointer-events-none absolute left-0 top-6 text-base text-muted transition-all duration-300 ease-out-expo peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    const json = await res?.json().catch(() => ({}));

    if (res?.ok) {
      setState("sent");
      form.reset();
    } else if (json?.fallback) {
      // Email delivery isn't configured on the server: hand off to the visitor's mail app.
      const body = `${data.message}\n\n— ${data.name}${data.phone ? `\n${data.phone}` : ""}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Website enquiry from ${data.name || data.email}`)}&body=${encodeURIComponent(body)}`;
      setState("mailto");
    } else {
      setState("error");
      setError(json?.error ?? "Something went wrong. Please email us directly.");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === "sent" || state === "mailto" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl bg-surface p-10"
          role="status"
        >
          <p className="type-heading text-4xl">{state === "sent" ? "Thank you." : "Almost there."}</p>
          <p className="mt-3 max-w-md text-fg/80">
            {state === "sent"
              ? `Your message is on its way to our team. We’re available ${site.hours} and will get back to you soon.`
              : `Your email app should have opened with your message — just hit send. If it didn’t, write to us at ${site.email}.`}
          </p>
          <button type="button" onClick={() => setState("idle")} className="mt-6 text-sm underline underline-offset-4">
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-8 sm:grid-cols-2">
          <div className="relative">
            <input id="name" name="name" required autoComplete="name" placeholder="Name" className={field} />
            <label htmlFor="name" className={label}>
              Name
            </label>
          </div>
          <div className="relative">
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
            <label htmlFor="email" className={label}>
              Email
            </label>
          </div>
          <div className="relative sm:col-span-2">
            <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className={field} />
            <label htmlFor="phone" className={label}>
              Phone (optional)
            </label>
          </div>
          <div className="relative sm:col-span-2">
            <textarea id="message" name="message" required rows={5} placeholder="Message" className={`${field} resize-none`} />
            <label htmlFor="message" className={label}>
              How can we help?
            </label>
          </div>
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <Button
              type="submit"
              disabled={state === "sending"}
              arrow
            >
              {state === "sending" ? "Sending…" : "Send message"}
            </Button>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
