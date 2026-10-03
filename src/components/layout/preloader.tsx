"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/format";
import { finishIntro } from "@/lib/store";

type Phase = "loading" | "settle" | "docking" | "revealing" | "done";

const STEPS = [
  { at: 0, label: "Measuring" },
  { at: 26, label: "Cutting" },
  { at: 52, label: "Stitching" },
  { at: 78, label: "Pressing" },
  { at: 100, label: "Ready" },
];

/** Pixels per centimetre on the tape. */
const CM = 11;
const TICKS = Array.from({ length: 161 }, (_, i) => i - 30); // -30 … 130 cm

const PATHS = {
  F: "M0,209.59V3.46h105.23v12.11H13.84v75.82h83.6v11.82H13.84v106.38H0h0Z",
  I: "M159.43,209.59V3.46h13.84v206.13h-13.84Z",
  L: "M249.38,209.59V3.46h13.84v193.45h94.85v12.68h-108.69Z",
  O: "M406.35,182.2c-19.13-20.56-28.68-45.84-28.68-75.82s9.56-55.21,28.68-75.68S449.64,0,478.86,0s53.43,10.23,72.65,30.7c19.22,20.47,28.83,45.7,28.83,75.68s-9.61,55.26-28.83,75.82c-19.22,20.57-43.44,30.85-72.65,30.85s-53.38-10.28-72.51-30.85h0ZM416.59,39.64c-15.95,17.97-23.93,40.22-23.93,66.74s8.02,48.82,24.07,66.89c16.04,18.07,36.8,27.1,62.27,27.1s46.22-9.03,62.27-27.1c16.04-18.06,24.07-40.36,24.07-66.89s-8.03-48.77-24.07-66.74c-16.05-17.97-36.86-26.96-62.42-26.96s-46.32,8.99-62.27,26.96h0Z",
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Entry sequence, once per session:
 * 1. FILO sits centre-stage while product photos flicker inside the "O" and a
 *    tailor's tape measures 0 → 100 cm.
 * 2. The tape and photos clear; the wordmark flies into its place in the navbar.
 * 3. The navbar fades in around it and the page is revealed top to bottom.
 */
export function Preloader({ images }: { images: string[] }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [frame, setFrame] = useState(0);
  const [step, setStep] = useState(STEPS[0].label);
  const mark = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const reading = useTransform(progress, (v) =>
    String(Math.round(v)).padStart(3, "0"),
  );
  const tapeX = useTransform(progress, (v) => -v * CM);

  useMotionValueEvent(progress, "change", (v) => {
    const current = [...STEPS].reverse().find((s) => v >= s.at);
    if (current && current.label !== step) setStep(current.label);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "seen") {
      delete root.dataset.introPhase;
      finishIntro();
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }

    root.dataset.introPhase = "loading";
    let cancelled = false;
    const flicker = setInterval(() => setFrame((f) => f + 1), 170);
    const run = animate(progress, 100, {
      duration: 2.6,
      ease: [0.6, 0, 0.3, 1],
      delay: 0.6,
    });

    run.then(async () => {
      if (cancelled) return;
      clearInterval(flicker);
      setPhase("settle");
      await wait(550);

      // Fly the wordmark into the navbar logo's exact box.
      const el = mark.current;
      const target = document
        .querySelector("[data-site-logo]")
        ?.getBoundingClientRect();
      if (el && target && target.width > 0) {
        const from = el.getBoundingClientRect();
        root.dataset.introPhase = "docking";
        setPhase("docking");
        await animate(
          el,
          {
            x: target.left + target.width / 2 - (from.left + from.width / 2),
            y: target.top + target.height / 2 - (from.top + from.height / 2),
            scale: target.height / from.height,
          },
          { duration: 1.1, ease: [0.76, 0, 0.24, 1] },
        );
      }
      if (cancelled) return;

      try {
        sessionStorage.setItem("filo-intro", "1");
      } catch {}
      root.dataset.introPhase = "revealing";
      setPhase("revealing");
      setTimeout(finishIntro, 450);
    });

    return () => {
      cancelled = true;
      clearInterval(flicker);
      run.stop();
    };
  }, [progress]);

  if (phase === "done") return null;
  const loading = phase === "loading";

  return (
    <div className="preloader fixed inset-0 z-[80]" aria-hidden>
      {/* Backdrop: lifts away top-down once the logo has docked. */}
      <motion.div
        className="absolute inset-0 bg-bg"
        initial={false}
        animate={{
          clipPath:
            phase === "revealing"
              ? "inset(100% 0% 0% 0%)"
              : "inset(0% 0% 0% 0%)",
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
        onAnimationComplete={() => {
          if (phase !== "revealing") return;
          delete document.documentElement.dataset.introPhase;
          setPhase("done");
        }}
      />

      {/* Chrome: labels, step caption, tape measure. */}
      <motion.div
        className="container-x absolute inset-0 flex flex-col justify-between py-6 text-fg md:py-8"
        animate={loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.div
          className="flex items-center justify-between type-label text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span>Filo Clothing</span>
          <span>Bhilwara — India</span>
        </motion.div>

        <div>
          <div className="mb-5 flex items-end justify-between gap-6">
            <div className="relative h-[15px] overflow-hidden type-label leading-[15px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={step}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {step}
                  {step !== "Ready" && "…"}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="font-mono text-3xl tabular-nums tracking-tight md:text-5xl">
              <motion.span>{reading}</motion.span>
              <span className="ml-1 text-sm text-muted md:text-base">cm</span>
            </p>
            <p className="hidden max-w-[14rem] text-right type-label text-muted sm:block">
              Trousers for every hour of your day
            </p>
          </div>

          {/* Tailor's tape: slides under a fixed needle as the reading climbs. */}
          <motion.div
            className="relative h-16 overflow-hidden rounded-sm border-y border-line bg-surface/60 [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]"
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-y-0 left-1/2"
              style={{ x: tapeX }}
            >
              {TICKS.map((cm) => (
                <span
                  key={cm}
                  className={cn(
                    "absolute top-0 w-px bg-fg",
                    cm % 10 === 0
                      ? "h-7 opacity-90"
                      : cm % 5 === 0
                        ? "h-4.5 opacity-60"
                        : "h-2.5 opacity-35",
                  )}
                  style={{ left: cm * CM }}
                />
              ))}
              {TICKS.filter((cm) => cm % 10 === 0 && cm >= 0 && cm <= 100).map(
                (cm) => (
                  <span
                    key={`n${cm}`}
                    className="absolute top-8 -translate-x-1/2 font-mono text-[10px] tabular-nums text-muted"
                    style={{ left: cm * CM }}
                  >
                    {cm}
                  </span>
                ),
              )}
            </motion.div>
            <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-fg" />
            <span className="absolute left-1/2 top-0 size-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-fg" />
          </motion.div>
        </div>
      </motion.div>

      {/* The wordmark — the only element that survives into the navbar. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-fg">
        {/* Outer layer handles the hand-off; inner box is what flies (FLIP). */}
        <div className={phase === "revealing" ? "invisible" : undefined}>
          <div ref={mark} className="w-fit">
            <svg
              viewBox="0 0 580.34 213.05"
              className="block h-[min(15vw,132px)] w-auto overflow-hidden"
            >
              <defs>
                <clipPath id="filo-o-hole">
                  <ellipse cx="478.86" cy="106.3" rx="86.5" ry="93.8" />
                </clipPath>
              </defs>

              {/* Lookbook flicker inside the O. */}
              <motion.g
                clipPath="url(#filo-o-hole)"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  loading
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.6 }
                }
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: loading ? 0.9 : 0,
                }}
                style={{ transformOrigin: "478.86px 106.3px" }}
              >
                {images.map((src, i) => (
                  <image
                    key={src}
                    href={src}
                    x="392"
                    y="12"
                    width="174"
                    height="189"
                    preserveAspectRatio="xMidYMid slice"
                    opacity={i === frame % images.length ? 1 : 0}
                  />
                ))}
              </motion.g>

              {(["F", "I", "L", "O"] as const).map((k, i) => (
                <motion.path
                  key={k}
                  d={PATHS[k]}
                  fill="currentColor"
                  initial={{ y: 230 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.1,
                    ease: EASE,
                    delay: 0.15 + i * 0.09,
                  }}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
