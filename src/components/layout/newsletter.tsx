"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { site } from "@/lib/site";

export function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, kind: "newsletter" }),
    }).catch(() => null);
    const json = await res?.json().catch(() => ({}));
    if (res?.ok) {
      setState("done");
      setMessage("You’re on the list. Welcome to FILO.");
    } else if (json?.fallback) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Subscribe me to the FILO list")}&body=${encodeURIComponent(`Please add ${data.email} to your mailing list.`)}`;
      setState("done");
      setMessage("Your email app should open — hit send and you’re in.");
    } else {
      setState("error");
      setMessage(json?.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center border-b border-fg/30 pb-3 transition-colors focus-within:border-fg">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={state === "sending"}
          className="group flex shrink-0 items-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          {state === "sending" ? "Joining…" : "Subscribe"}
          <ArrowRight width={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </button>
      </div>
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mt-3 text-sm text-muted"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
